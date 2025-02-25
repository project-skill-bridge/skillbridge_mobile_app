/* eslint-disable @typescript-eslint/no-require-imports */
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Alert,
  Image,
} from "react-native";
import * as ScreenOrientation from "expo-screen-orientation";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { router } from "expo-router";
import { hp, wp } from "@/src/utils/common";
import HexagonSVG from "@/src/components/hexagon-svg";
import { theme } from "@/src/constants/Theme";
import { Audio } from "expo-av";
import AsyncStorage from "@react-native-async-storage/async-storage";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { Images } from "@/src/constants/Images";
import Button from "@/src/components/ui/button";
import { Icons } from "@/src/constants/Icons";

const ALPHABETS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const SIMPLE_WORDS = [
  "CAT",
  "DOG",
  "CAR",
  "SUN",
  "HAT",
  "FOX",
  "BEE",
  "PEN",
  "BOX",
  "BALL",
  "SHIP",
  "TREE",
  "FORK",
  "STAR",
  "MOON",
];

const TIME_LIMIT = 15; // seconds (used for timed levels 2 and 4)
const TARGET_SCORE = 10;
const INITIAL_HEARTS = 5;
const COOLDOWN_TIME = 30; // seconds of cooldown when hearts reach 0

const TypingGameScreen: React.FC = () => {
  // Game state
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [score, setScore] = useState<number>(0);
  const [hearts, setHearts] = useState<number>(INITIAL_HEARTS);
  const [levelComplete, setLevelComplete] = useState<boolean>(false);
  // Sound states (if needed)
  const [successSound, setSuccessSound] = useState<Audio.Sound | null>(null);
  const [failureSound, setFailureSound] = useState<Audio.Sound | null>(null);
  const [backgroundMusic, setBackgroundMusic] = useState<Audio.Sound | null>(
    null
  );

  // Round state (for letter rounds and word rounds)
  const [currentLetter, setCurrentLetter] = useState<string>("");
  const [currentWord, setCurrentWord] = useState<string>("");
  const [currentCharIndex, setCurrentCharIndex] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(TIME_LIMIT);

  // Cooldown state (when hearts reach 0)
  const [cooldownTimeLeft, setCooldownTimeLeft] = useState<number | null>(null);
  const cooldownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Determine mode based on level:
  // Levels 1 & 2: letter rounds; levels 3 & 4: word rounds.
  const roundType: "letter" | "word" = currentLevel <= 2 ? "letter" : "word";
  // Levels 2 & 4 have a timer
  const isTimed = currentLevel === 2 || currentLevel === 4;

  // For shake animation on errors
  const shake = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shake.value }],
  }));

  // Lock orientation on mount
  useEffect(() => {
    const lockOrientation = async () => {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE
      );
    };
    lockOrientation();

    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, []);

  // Load saved game data (optional)
  useEffect(() => {
    const loadGameData = async () => {
      try {
        const savedData = await AsyncStorage.getItem("gameData");
        if (savedData) {
          const {
            hearts: savedHearts,
            currentLevel: savedLevel,
            score: savedScore,
          } = JSON.parse(savedData);
          setHearts(savedHearts);
          setCurrentLevel(savedLevel);
          setScore(savedScore);
        }
      } catch (error) {
        console.error("Error loading game data:", error);
      }
    };

    loadGameData();
  }, []);

  // Save game data to local storage and Firebase
  useEffect(() => {
    const saveGameData = async () => {
      try {
        const localData = { hearts, currentLevel, score };
        await AsyncStorage.setItem("gameData", JSON.stringify(localData));

        const firebaseData = { level: currentLevel, score };
        const user = auth().currentUser;
        if (user) {
          await firestore()
            .collection("users")
            .doc(user.uid)
            .collection("games")
            .doc("typing-game")
            .set({
              progress: firebaseData,
              timestamp: firestore.FieldValue.serverTimestamp(),
            });
        }
      } catch (error) {
        console.error("Error saving game data:", error);
      }
    };

    saveGameData();
  }, [hearts, currentLevel, score]);

  // Timer for timed rounds
  useEffect(() => {
    let timerId: number | null = null;
    if (isTimed && cooldownTimeLeft === null && !levelComplete) {
      if (timeLeft > 0) {
        timerId = setTimeout(() => {
          setTimeLeft(timeLeft - 1);
        }, 1000) as unknown as number;
      } else {
        // Timeout reached: penalize and start a new round
        handleTimeExpired();
      }
    }
    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [timeLeft, isTimed, levelComplete, cooldownTimeLeft]);

  // When level changes, start a new round
  useEffect(() => {
    startNewRound();
  }, [currentLevel]);

  // Check if a cooldown is already active (e.g. after app restart)
  useEffect(() => {
    const checkCooldown = async () => {
      const storedTime = await AsyncStorage.getItem("cooldownEndTime");
      if (storedTime) {
        const cooldownEnd = parseInt(storedTime, 10);
        const now = Date.now();
        if (cooldownEnd > now) {
          const remaining = Math.ceil((cooldownEnd - now) / 1000);
          setCooldownTimeLeft(remaining);
        } else {
          await AsyncStorage.removeItem("cooldownEndTime");
          setCooldownTimeLeft(null);
        }
      }
    };
    checkCooldown();
  }, []);

  // Cooldown timer effect (counts down every second)
  useEffect(() => {
    if (cooldownTimeLeft !== null && cooldownTimeLeft > 0) {
      cooldownIntervalRef.current = setInterval(() => {
        setCooldownTimeLeft((prev) => {
          if (prev && prev > 1) return prev - 1;
          else {
            if (cooldownIntervalRef.current)
              clearInterval(cooldownIntervalRef.current);
            AsyncStorage.removeItem("cooldownEndTime");
            return 0;
          }
        });
      }, 1000);
    }
    return () => {
      if (cooldownIntervalRef.current)
        clearInterval(cooldownIntervalRef.current);
    };
  }, [cooldownTimeLeft]);

  // -------------------------
  // ROUND HELPERS
  // -------------------------
  const generateRandomLetter = (): string => {
    const randomIndex = Math.floor(Math.random() * ALPHABETS.length);
    return ALPHABETS[randomIndex];
  };

  const generateRandomWord = (): string => {
    const filteredWords = SIMPLE_WORDS.filter(
      (word) => word.length === 3 || word.length === 4
    );
    const randomIndex = Math.floor(Math.random() * filteredWords.length);
    return filteredWords[randomIndex];
  };

  const startNewRound = (): void => {
    if (isTimed) {
      setTimeLeft(TIME_LIMIT);
    }
    if (roundType === "letter") {
      setCurrentLetter(generateRandomLetter());
    } else {
      const newWord = generateRandomWord();
      setCurrentWord(newWord);
      setCurrentCharIndex(0);
    }
  };

  const triggerShakeAnimation = (): void => {
    shake.value = withSequence(
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(-10, { duration: 50 }),
      withTiming(0, { duration: 50 })
    );
  };

  // Called when the timer expires during a timed round
  const handleTimeExpired = (): void => {
    triggerShakeAnimation();
    const updatedHearts = hearts - 1;
    setHearts(updatedHearts);
    if (updatedHearts <= 0) {
      startCooldown();
    } else {
      startNewRound();
    }
  };

  // -------------------------
  // COOLDOWN HANDLING
  // -------------------------
  const startCooldown = async (): Promise<void> => {
    // Set cooldown state and store the end time in AsyncStorage
    setCooldownTimeLeft(COOLDOWN_TIME);
    const cooldownEndTime = Date.now() + COOLDOWN_TIME * 1000;
    await AsyncStorage.setItem("cooldownEndTime", cooldownEndTime.toString());
  };

  // -------------------------
  // HANDLE KEY PRESSES FROM THE VIRTUAL KEYBOARD
  // -------------------------
  const handleKeyPress = (char: string): void => {
    // Do not process key presses during cooldown or after level completion
    if (cooldownTimeLeft !== null || levelComplete) return;

    if (roundType === "letter") {
      if (char === currentLetter) {
        setScore((prev) => {
          const newScore = prev + 2;
          if (newScore >= TARGET_SCORE) {
            setLevelComplete(true);
          }
          return newScore;
        });
        startNewRound();
      } else {
        triggerShakeAnimation();
        const updatedHearts = hearts - 1;
        setHearts(updatedHearts);
        if (updatedHearts <= 0) {
          startCooldown();
        } else {
          startNewRound();
        }
      }
    } else {
      if (char === currentWord[currentCharIndex]) {
        if (currentCharIndex + 1 === currentWord.length) {
          setScore((prev) => {
            const newScore = prev + 2;
            if (newScore >= TARGET_SCORE) {
              setLevelComplete(true);
            }
            return newScore;
          });
          startNewRound();
        } else {
          setCurrentCharIndex(currentCharIndex + 1);
        }
      } else {
        triggerShakeAnimation();
        const updatedHearts = hearts - 1;
        setHearts(updatedHearts);
        if (updatedHearts <= 0) {
          startCooldown();
        } else {
          startNewRound();
        }
      }
    }
  };

  // -------------------------
  // HANDLERS FOR LEVEL PROGRESSION & GAME RESET
  // -------------------------
  const handleNextLevel = (): void => {
    if (currentLevel < 4) {
      setCurrentLevel(currentLevel + 1);
      setScore(0);
      setHearts(INITIAL_HEARTS);
      setLevelComplete(false);
      startNewRound();
    } else {
      Alert.alert("Congratulations!", "You have completed all levels!", [
        { text: "Restart Game", onPress: resetGame },
      ]);
    }
  };

  const handleRestartLevel = (): void => {
    // Only allow restart if cooldown is finished (i.e. cooldownTimeLeft is 0)
    if (cooldownTimeLeft && cooldownTimeLeft > 0) return;
    setScore(0);
    setHearts(INITIAL_HEARTS);
    setLevelComplete(false);
    setCooldownTimeLeft(null);
    startNewRound();
  };

  const resetGame = (): void => {
    setCurrentLevel(1);
    setScore(0);
    setHearts(INITIAL_HEARTS);
    setLevelComplete(false);
    setCooldownTimeLeft(null);
    startNewRound();
  };

  const handleBackButtonPress = () => {
    Alert.alert("Exit Game", "Are you sure you want to exit?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Exit",
        onPress: async () => {
          // resetGame();
          await ScreenOrientation.unlockAsync();
          router.back();
        },
      },
    ]);
  };

  // -------------------------
  // RENDER HELPERS
  // -------------------------
  // Virtual keyboard layout
  const keyboardRows: string[][] = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M"],
  ];

  // Render letter or word display
  const renderDisplay = () => {
    if (roundType === "letter") {
      return (
        <Animated.View style={animatedStyle}>
          <HexagonSVG character={currentLetter} fill={theme.colors.primary} />
        </Animated.View>
      );
    } else {
      const displayString = currentWord
        .split("")
        .map((letter, index) => (index < currentCharIndex ? letter : "_"))
        .join(" ");
      return (
        <Animated.View style={animatedStyle}>
          <Text style={[styles.displayText, { fontSize: 30 }]}>
            {displayString}
          </Text>
        </Animated.View>
      );
    }
  };

  return (
    <ImageBackground
      source={Images.tapAndTypeBackground}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.topRow}>
          <View style={styles.backButtonAndLifeContainer}>
            <Button onPress={handleBackButtonPress} variant="icon">
              <Icons.ChevronLeft color="black" />
            </Button>
            <Text style={[styles.infoText, { fontSize: 30 }]}>❤️ {hearts}</Text>
          </View>

          <View style={styles.randomCharContainer}>{renderDisplay()}</View>

          <View style={styles.scoreAndTimeContainer}>
            {isTimed && <Text style={styles.infoText}>Time: {timeLeft}</Text>}
            <View style={styles.scoreBoardContainer}>
              <View style={styles.scoreContainer}>
                <Text style={styles.level}>Level {currentLevel}</Text>
                <Text style={styles.score}>Score: {score}</Text>
              </View>
              <Image
                style={styles.scoreBoardImage}
                source={require("@/assets/images/black-board.png")}
                resizeMode="contain"
              />
            </View>
          </View>
        </View>

        <View style={styles.keyboardContainer}>
          {keyboardRows.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.keyboardRow}>
              {row.map((key) => (
                <TouchableOpacity
                  key={key}
                  style={styles.key}
                  onPress={() => handleKeyPress(key)}
                >
                  <Text style={styles.keyText}>{key}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>

        {/* Cooldown Modal */}
        {cooldownTimeLeft !== null && (
          <View style={styles.overlayContainer}>
            <View style={styles.modal}>
              <Text style={styles.modalText}>
                {cooldownTimeLeft > 0
                  ? `Please wait ${cooldownTimeLeft} seconds`
                  : "Cooldown complete!"}
              </Text>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  {
                    backgroundColor:
                      cooldownTimeLeft && cooldownTimeLeft > 0
                        ? "#aaa"
                        : "#4CAF50",
                  },
                ]}
                onPress={handleRestartLevel}
                disabled={cooldownTimeLeft !== 0}
              >
                <Text style={styles.modalButtonText}>Restart Game</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#FF5252" }]}
                onPress={handleBackButtonPress}
              >
                <Text style={styles.modalButtonText}>Exit Game</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Level Complete Modal */}
        {levelComplete && (
          <View style={styles.overlayContainer}>
            <View style={styles.modal}>
              <Text style={styles.modalText}>Level Complete!</Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleNextLevel}
              >
                <Text style={styles.modalButtonText}>
                  {currentLevel < 4 ? "Next Level" : "Finish"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },
  topRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backButtonAndLifeContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 50,
  },
  randomCharContainer: {
    flex: 1,
    alignItems: "center",
  },
  scoreAndTimeContainer: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 30,
  },
  scoreBoardContainer: {
    position: "relative",
    width: wp(34),
    height: hp(10),
  },
  scoreBoardImage: {
    width: "100%",
    height: "100%",
  },
  scoreContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  level: {
    fontSize: hp(2),
    fontWeight: "600",
    color: "#fff",
  },
  score: {
    fontSize: hp(2.5),
    fontWeight: "bold",
    color: "#fff",
  },
  infoText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  keyboardContainer: {
    backgroundColor: "#fdeed8",
    opacity: 0.9,
    padding: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#e78cba",
    marginBottom: 10,
  },
  keyboardRow: {
    flexDirection: "row",
    justifyContent: "center",
  },
  key: {
    backgroundColor: "#fff",
    margin: 5,
    borderRadius: 5,
    padding: 10,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  keyText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  displayText: {
    color: "#fff",
    fontWeight: "bold",
  },
  overlayContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 5,
  },
  modalButtonText: {
    fontSize: 18,
    color: "#fff",
  },
});

export default TypingGameScreen;
