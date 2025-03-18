import React, { useEffect, useState, useRef } from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
  Alert,
} from "react-native";
import * as ScreenOrientation from "expo-screen-orientation";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { Audio } from "expo-av";
import { useFonts } from "expo-font";
import { hp, wp } from "@/src/utils/common";
import { Images } from "@/src/constants/Images";
import Button from "@/src/components/ui/button";
import { Icons } from "@/src/constants/Icons";
import { Fonts } from "@/src/constants/Fonts";
import Loader from "@/src/components/ui/loader";
import CircularProgress from "@/src/components/ui/circular-progress";
import { Sounds } from "@/src/constants/Sounds";
import { SIMPLE_WORDS } from "@/src/data/words";

const ALPHABETS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const TIME_LIMIT = 120;
const INITIAL_HEARTS = 10;
const COOLDOWN_TIME = 180;

const MAX_LEVEL = 4;
const MAX_SCORE = 100;
const TOTAL_PROGRESS = MAX_LEVEL * MAX_SCORE;

const TapAndTypeScreen = () => {
  // Game state
  const [score, setScore] = useState<number>(0);
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [hearts, setHearts] = useState<number>(INITIAL_HEARTS);
  const [levelComplete, setLevelComplete] = useState<boolean>(false);

  // Sound refs
  const successSoundRef = useRef<Audio.Sound | null>(null);
  const failureSoundRef = useRef<Audio.Sound | null>(null);
  const backgroundMusicRef = useRef<Audio.Sound | null>(null);

  // Load custom font
  const [fontsLoaded] = useFonts({
    Coiny: Fonts.Coiny,
  });

  // Round state (for letter rounds and word rounds)
  const [currentWord, setCurrentWord] = useState<string>("");
  const [currentLetter, setCurrentLetter] = useState<string>("");
  const [currentCharIndex, setCurrentCharIndex] = useState<number>(0);
  const [correctCharCount, setCorrectCharCount] = useState<number>(0);

  // Cooldown state (when hearts reach 0)
  const [timeLeft, setTimeLeft] = useState<number>(TIME_LIMIT);
  const [cooldownTimeLeft, setCooldownTimeLeft] = useState<number>(0);
  const cooldownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Exit game state
  const [isGameExiting, setIsGameExiting] = useState<boolean>(false);

  // Determine mode based on level:
  // Levels 1 & 2: letter rounds; levels 3 & 4: word rounds.
  const roundType: "letter" | "word" = currentLevel <= 2 ? "letter" : "word";
  // Levels 2 & 4 have a timer
  const isTimed = currentLevel === 2 || currentLevel === 4;

  // Keyboard layout (3 rows of letters)
  const keyboardRows: string[][] = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M"],
  ];

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

  // Load sounds on mount
  useEffect(() => {
    const loadSound = async () => {
      const isMusicOn = JSON.parse(
        (await AsyncStorage.getItem("music")) as string
      );

      if (!isMusicOn) return;

      const { sound: loadedSuccessSound } = await Audio.Sound.createAsync(
        Sounds.successSound
      );
      const { sound: loadedFailureSound } = await Audio.Sound.createAsync(
        Sounds.failureSound
      );
      const { sound: loadedBackgroundMusic } = await Audio.Sound.createAsync(
        Sounds.backgroundMusic,
        { isLooping: true }
      );
      backgroundMusicRef.current = loadedBackgroundMusic;
      successSoundRef.current = loadedSuccessSound;
      failureSoundRef.current = loadedFailureSound;
      startBackgroundMusic();
    };

    loadSound();
    return () => {
      successSoundRef.current?.unloadAsync();
      failureSoundRef.current?.unloadAsync();
      stopBackgroundMusic();
    };
  }, []);

  // Load saved game data from local storage
  useEffect(() => {
    const loadGameData = async () => {
      try {
        const savedData = await AsyncStorage.getItem("tap-and-type-game");
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
      } catch {
        handleGameError("Error", "Failed to load game data");
      }
    };

    loadGameData();
  }, []);

  // Save game data to local storage and Firebase
  useEffect(() => {
    const saveGameData = async () => {
      try {
        const localData = { hearts, currentLevel, score };
        await AsyncStorage.setItem(
          "tap-and-type-game",
          JSON.stringify(localData)
        );

        const firebaseData = { level: currentLevel, score };
        const user = auth().currentUser;
        if (user) {
          await firestore()
            .collection("users")
            .doc(user.uid)
            .collection("games")
            .doc("tap-and-type")
            .set({
              ...firebaseData,
              totalGameProgressPercentage: calculateProgress(),
              timestamp: firestore.FieldValue.serverTimestamp(),
            });
        }
      } catch {
        handleGameError("Error", "Failed to save game data");
      }
    };

    saveGameData();
  }, [hearts, currentLevel, score]);

  // Check if a cooldown is already active (e.g. after app restart)
  useEffect(() => {
    const checkCooldown = async () => {
      const storedTime = await AsyncStorage.getItem(
        "tap-and-type-cool-down-time"
      );
      if (storedTime) {
        const cooldownEnd = parseInt(storedTime, 10);
        const now = Date.now();
        if (cooldownEnd > now) {
          const remaining = Math.ceil((cooldownEnd - now) / 1000);
          setCooldownTimeLeft(remaining);
        } else {
          await AsyncStorage.removeItem("tap-and-type-cool-down-time");
          setCooldownTimeLeft(0);
        }
      }
    };
    checkCooldown();
  }, []);

  // Timer for timed rounds
  useEffect(() => {
    let timerId: number | null = null;
    if (isTimed && cooldownTimeLeft === 0 && !levelComplete) {
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

  // Cooldown timer effect (counts down every second)
  useEffect(() => {
    if (cooldownTimeLeft > 0) {
      cooldownIntervalRef.current = setInterval(() => {
        setCooldownTimeLeft((prev) => {
          if (prev && prev > 1) return prev - 1;
          else {
            if (cooldownIntervalRef.current)
              clearInterval(cooldownIntervalRef.current);
            AsyncStorage.removeItem("tap-and-type-cool-down-time");
            handleHeartsRefill();
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

  const calculateProgress = () => {
    return (((currentLevel - 1) * MAX_SCORE + score) / TOTAL_PROGRESS) * 100;
  };

  const handleHeartsRefill = async () => {
    const savedData = JSON.parse(
      (await AsyncStorage.getItem("tap-and-type-game")) as string
    );
    await AsyncStorage.setItem(
      "tap-and-type-game",
      JSON.stringify({ ...savedData, hearts: INITIAL_HEARTS })
    );
    setHearts(INITIAL_HEARTS);
  };

  // start the background music
  const startBackgroundMusic = async () => {
    if (backgroundMusicRef.current) {
      try {
        await backgroundMusicRef.current.setVolumeAsync(0.2);
        await backgroundMusicRef.current.playAsync();
      } catch {
        console.log("Error playing background music");
      }
    }
  };

  // stop the background music
  const stopBackgroundMusic = async () => {
    if (backgroundMusicRef.current) {
      try {
        await backgroundMusicRef.current.stopAsync();
        await backgroundMusicRef.current.unloadAsync();
        backgroundMusicRef.current = null;
      } catch (error) {
        console.log("Error stopping background music", error);
      }
    }
  };

  // Play success sound
  const playSuccessSound = async () => {
    if (successSoundRef.current) {
      try {
        await successSoundRef.current.replayAsync();
      } catch (error) {
        console.log("Error playing success sound", error);
      }
    }
  };

  // Play failure sound
  const playFailureSound = async () => {
    if (failureSoundRef.current) {
      try {
        await failureSoundRef.current.replayAsync();
      } catch (error) {
        console.log("Error playing failure sound", error);
      }
    }
  };

  // Generate a random letter for letter rounds
  const generateRandomLetter = (): string => {
    const randomIndex = Math.floor(Math.random() * ALPHABETS.length);
    return ALPHABETS[randomIndex];
  };

  // Generate a random 3 or 4-letter word for word rounds
  const generateRandomWord = (): string => {
    const filteredWords = SIMPLE_WORDS.filter(
      (word) => word.length === 3 || word.length === 4
    );
    const randomIndex = Math.floor(Math.random() * filteredWords.length);
    return filteredWords[randomIndex];
  };

  // Start a new round (letter or word) based on the current level
  const startNewRound = (): void => {
    if (isTimed) {
      setTimeLeft(TIME_LIMIT);
    }
    if (roundType === "letter") {
      const newLetter = generateRandomLetter();
      setCurrentLetter(newLetter);
    } else {
      const newWord = generateRandomWord();
      setCurrentWord(newWord);
      setCurrentCharIndex(0);
      setCorrectCharCount(0);
    }
  };

  // Trigger shake animation on wrong
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

  // Start a cooldown period after losing
  const startCooldown = async (): Promise<void> => {
    // Set cooldown state and store the end time in AsyncStorage
    setCooldownTimeLeft(COOLDOWN_TIME);
    const coolDownEndTime = Date.now() + COOLDOWN_TIME * 1000;
    await AsyncStorage.setItem(
      "tap-and-type-cool-down-time",
      coolDownEndTime.toString()
    );
  };

  // Handle key presses (letters or words)
  const handleKeyPress = (char: string): void => {
    // Do not process key presses during cooldown or after level completion
    if (cooldownTimeLeft !== 0 || levelComplete) return;

    if (roundType === "letter") {
      if (char === currentLetter) {
        playSuccessSound();
        setScore((prev) => {
          const newScore = prev + 2;
          if (newScore >= MAX_SCORE) {
            setLevelComplete(true);
          }
          return newScore;
        });
        startNewRound();
      } else {
        triggerShakeAnimation();
        playFailureSound();
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
        playSuccessSound();
        if (currentCharIndex + 1 === currentWord.length) {
          setScore((prev) => {
            const newScore = prev + 2;
            if (newScore >= MAX_SCORE) {
              setLevelComplete(true);
            }
            return newScore;
          });
          startNewRound();
        } else {
          setCorrectCharCount((prev) => prev + 1);
          setCurrentCharIndex(currentCharIndex + 1);
        }
      } else {
        triggerShakeAnimation();
        playFailureSound();
        const updatedHearts = hearts - 1;
        setHearts(updatedHearts);
        if (updatedHearts <= 0) {
          startCooldown();
        }
      }
    }
  };

  // Handle next level or game completion
  const handleNextLevel = (): void => {
    if (currentLevel < 4) {
      setCurrentLevel(currentLevel + 1);
      setScore(0);
      setHearts(INITIAL_HEARTS);
      setLevelComplete(false);
      startNewRound();
    } else {
      handleResetGame();
    }
  };

  // Restart the game (reset all state to initial values)
  const handleRestartLevel = async () => {
    setScore(0);
    setCooldownTimeLeft(0);
    setLevelComplete(false);
    setHearts(INITIAL_HEARTS);
    await AsyncStorage.removeItem("tap-and-type-cool-down-time");
    startNewRound();
  };

  // Reset the game to level 1
  const handleResetGame = (): void => {
    setCurrentLevel(1);
    setScore(0);
    setHearts(INITIAL_HEARTS);
    setLevelComplete(false);
    setCooldownTimeLeft(0);
    startNewRound();
  };

  // Handle back button press
  const handleBackButtonPress = async () => {
    await ScreenOrientation.unlockAsync();
    router.back();
  };

  // Render letter or word display
  const renderDisplay = () => {
    if (roundType === "letter") {
      return (
        <Animated.View style={animatedStyle}>
          <View style={styles.key}>
            <Text style={styles.keyText}>{currentLetter}</Text>
          </View>
        </Animated.View>
      );
    } else {
      return currentWord.split("").map((letter, index) => (
        <Animated.View
          key={index}
          style={[
            currentCharIndex === index && animatedStyle,
            currentCharIndex === index && styles.focusKey,
          ]}
        >
          <View
            style={[
              styles.key,
              index < correctCharCount && { backgroundColor: "#FFD700" },
            ]}
          >
            <Text style={styles.keyText}>{letter}</Text>
          </View>
        </Animated.View>
      ));
    }
  };

  // Handle game errors (e.g. loading/saving data)
  const handleGameError = (title: string, message: string) => {
    Alert.alert(title, message, [
      {
        text: "Exit",
        onPress: async () => {
          await ScreenOrientation.unlockAsync();
          router.back();
        },
      },
    ]);
  };

  // Check if the game is loading fonts
  if (!fontsLoaded) {
    return (
      <View style={styles.loader}>
        <Loader size={30} />
      </View>
    );
  }

  return (
    <ImageBackground
      source={Images.tapAndTypeBackground}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.topRow}>
          <View style={styles.backButtonAndLifeContainer}>
            <Button onPress={() => setIsGameExiting(true)} variant="icon">
              <Icons.ChevronLeft color="black" />
            </Button>
            <View style={styles.heartsContainer}>
              <Icons.Heart
                size={40}
                fill="red"
                stroke="black"
                strokeWidth={1}
              />
              <Text style={styles.hearts}>{hearts}</Text>
            </View>
          </View>

          <View style={styles.randomCharContainer}>{renderDisplay()}</View>

          <View style={styles.scoreAndTimeContainer}>
            {isTimed && (
              <CircularProgress
                perecentage={timeLeft}
                max={TIME_LIMIT}
                timer
                textColor="black"
                color="#feae32"
              />
            )}
            <View style={styles.scoreBoardContainer}>
              <View style={styles.scoreContainer}>
                <Text style={styles.level}>Level {currentLevel}</Text>
                <Text style={styles.score}>Score: {score}</Text>
              </View>
              <Image
                style={styles.scoreBoardImage}
                source={Images.blakboard}
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
        {cooldownTimeLeft !== 0 && (
          <View style={styles.modelWrapper}>
            <View style={styles.modal}>
              {/* <Text style={styles.modalText}>Level Complete!</Text> */}
              <View style={styles.scoreBar}>
                <Text style={[styles.scoreText, { fontSize: hp(3) }]}>
                  COOLDOWN TIME:
                </Text>
                <Text
                  style={[styles.score, { color: "black", fontSize: hp(3.5) }]}
                >
                  {`${Math.floor(cooldownTimeLeft / 60)
                    .toString()
                    .padStart(2, "0")}:${(cooldownTimeLeft % 60)
                    .toString()
                    .padStart(2, "0")}`}
                </Text>
              </View>

              <View style={styles.buttonContainer}>
                <Button onPress={handleRestartLevel} style={styles.button}>
                  <Icons.Repeat size={40} color={"black"} />
                  <Text style={styles.buttonText}>REPLAY</Text>
                </Button>
                <Button
                  onPress={() => setIsGameExiting(true)}
                  style={[styles.button, styles.exitButton]}
                >
                  <Icons.LogOut size={40} color={"black"} />
                  <Text style={styles.buttonText}>EXIT</Text>
                </Button>
              </View>
            </View>
          </View>
        )}

        {/* Level Complete Modal */}
        {(levelComplete || (currentLevel === 4 && score === MAX_SCORE)) && (
          <View style={styles.modelWrapper}>
            <View style={styles.modelOverlay} />
            <View style={styles.modal}>
              <Text style={styles.modalText}>
                {currentLevel !== 4
                  ? `Level ${currentLevel} Complete!`
                  : "Congratulations"}
              </Text>
              {currentLevel === 4 && (
                <Text style={[styles.scoreText]}>
                  You have completed all levels!
                </Text>
              )}

              <View style={styles.scoreBar}>
                <Text style={[styles.scoreText, { fontSize: hp(3) }]}>
                  YOUR SCORE:
                </Text>
                <Text
                  style={[styles.score, { color: "black", fontSize: hp(3.5) }]}
                >
                  {score}
                </Text>
              </View>

              <View style={styles.buttonContainer}>
                <Button onPress={handleRestartLevel} style={styles.button}>
                  <Icons.Repeat size={40} color={"black"} />
                  <Text style={styles.buttonText}>REPLAY</Text>
                </Button>
                <Button
                  onPress={handleNextLevel}
                  style={[styles.button, styles.nextLevelButton]}
                >
                  <Icons.ArrowBigRight size={40} color={"black"} />
                  <Text style={styles.buttonText}>
                    {currentLevel !== 4 ? "NEXT LEVEL" : "RESTART"}
                  </Text>
                </Button>
              </View>
            </View>
          </View>
        )}

        {isGameExiting && (
          <View style={styles.modelWrapper}>
            <View style={styles.modelOverlay} />
            <View style={styles.modal}>
              <Text style={styles.modalText}>Exit Game?</Text>
              <View style={styles.buttonContainer}>
                <Button
                  onPress={() => setIsGameExiting(false)}
                  style={styles.button}
                >
                  <Icons.X size={40} color={"black"} />
                  <Text style={styles.buttonText}>Cancel</Text>
                </Button>
                <Button
                  onPress={handleBackButtonPress}
                  style={[styles.button, styles.exitButton]}
                >
                  <Icons.Check size={40} color={"black"} />
                  <Text style={styles.buttonText}>Ok</Text>
                </Button>
              </View>
            </View>
          </View>
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
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
  heartsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  hearts: {
    fontSize: 30,
    fontFamily: "Coiny",
    color: "black",
  },
  randomCharContainer: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  scoreAndTimeContainer: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: wp(5),
  },
  scoreBoardContainer: {
    position: "relative",
    width: wp(40),
    height: hp(12),
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
  scoreText: {
    fontFamily: "Coiny",
    fontSize: hp(2.5),
    color: "#9a5f31",
  },
  level: {
    fontSize: hp(1.7),
    fontFamily: "Coiny",
    color: "#fff",
  },
  score: {
    fontSize: hp(2.5),
    fontFamily: "Coiny",
    color: "#e8e3e3",
  },
  scoreBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  infoText: {
    fontFamily: "Coiny",
    fontSize: hp(2.5),
    color: "#9a5f31",
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
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
  },
  focusKey: {
    backgroundColor: "red",
    borderRadius: 5,
  },
  keyText: {
    fontSize: hp(2.5),
    fontFamily: "Coiny",
  },
  displayText: {
    color: "#fff",
    fontWeight: "bold",
  },
  modelWrapper: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    position: "absolute",
    zIndex: 1,
  },
  modal: {
    backgroundColor: "#fff2b2",
    paddingVertical: hp(5),
    borderRadius: 10,
    alignItems: "center",
    position: "relative",
    width: "75%",
    display: "flex",
    justifyContent: "space-between",
    borderWidth: 6,
    borderColor: "#9a5f31",
  },
  modelOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalText: {
    fontSize: hp(4),
    fontFamily: "Coiny",
    backgroundColor: "#74b52b",
    paddingHorizontal: wp(5),
    color: "#fbfffe",
    borderRadius: 5,
    position: "absolute",
    top: -30,
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  buttonText: {
    fontSize: hp(2.5),
    fontFamily: "Coiny",
    color: "#fff",
  },
  nextLevelButton: {
    backgroundColor: "#6ee661",
  },
  exitButton: {
    backgroundColor: "#f44336",
  },
  button: {
    borderColor: "#000",
    borderWidth: 4,
    gap: 10,
  },
});

export default TapAndTypeScreen;
