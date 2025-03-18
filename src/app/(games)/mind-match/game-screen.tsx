import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Alert,
} from "react-native";
import { Lotties } from "@/src/constants/Lottie";
import { useFonts } from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { router } from "expo-router";
import LottieView from "lottie-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Icons } from "@/src/constants/Icons";
import { Fonts } from "@/src/constants/Fonts";
import Loader from "@/src/components/ui/loader";
import { hp, wp } from "@/src/utils/common";
import Button from "@/src/components/ui/button";
import { Sounds } from "@/src/constants/Sounds";

// Icons
const icons = [
  "Heart",
  "Star",
  "Circle",
  "Square",
  "Triangle",
  "Zap",
  "Leaf",
  "Music",
  "Bell",
  "Book",
  "Camera",
  "Clock",
  "Coffee",
  "Gift",
  "Home",
  "Key",
  "Lock",
  "Map",
  "Phone",
  "Tv",
];

interface Deck {
  id: number;
  icon: string;
  isFlipped: boolean;
  isMatched: boolean;
  fadeAnim: Animated.Value;
}

interface CardProps {
  card: Deck;
  onPress: () => void;
  disabled: boolean;
  level: number;
}

// Game Constants
const pairsPerLevel = [4, 6, 8, 10];
const levelColors = ["#6200ee", "#388e3c", "#f44336", "#ff9800"];
const MAX_SCORE = 280;

// Generate a deck of cards
const generateDeck = (numPairs: number) => {
  const shuffledIcons = [...icons].sort(() => Math.random() - 0.5);
  const selectedIcons = shuffledIcons.slice(0, numPairs);
  const doubledIcons = [...selectedIcons, ...selectedIcons];
  const shuffledDeck = doubledIcons.sort(() => Math.random() - 0.5);
  return shuffledDeck.map((icon, index) => ({
    id: index,
    icon,
    isFlipped: false,
    isMatched: false,
    fadeAnim: new Animated.Value(1),
  }));
};

const Card = ({ card, onPress, disabled, level }: CardProps) => {
  const flipAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(flipAnim, {
      toValue: card.isFlipped ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [card.isFlipped]);

  const rotateY = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const frontOpacity = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });

  const backOpacity = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0, 0],
  });

  const IconComponent = Icons[card.icon as keyof typeof Icons];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || card.isMatched}
      style={styles.cardContainer}
    >
      <Animated.View
        style={[
          styles.cardFlipContainer,
          {
            transform: [{ perspective: 1000 }, { rotateY }],
            opacity: card.fadeAnim,
          },
        ]}
      >
        <Animated.View
          style={[styles.cardFace, styles.cardBack, { opacity: backOpacity }]}
        >
          <View
            style={[
              styles.cardBackContent,
              { backgroundColor: levelColors[level - 1] },
            ]}
          >
            <Icons.CircleHelp size={30} color="#fff" />
          </View>
        </Animated.View>
        <Animated.View
          style={[styles.cardFace, styles.cardFront, { opacity: frontOpacity }]}
        >
          <View style={styles.cardFrontContent}>
            <IconComponent size={30} color="#333" />
          </View>
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const MindMatchGame = () => {
  // Game State
  const [fontsLoaded] = useFonts({ Coiny: Fonts.Coiny });
  const [currentLevel, setCurrentLevel] = useState(1);
  const [deck, setDeck] = useState(generateDeck(pairsPerLevel[0]));
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [flipCount, setFlipCount] = useState(0);
  const [totalFlips, setTotalFlips] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [isGameExiting, setIsGameExiting] = useState(false);
  const [isGameLoading, setIsGameLoading] = useState(true);
  const [levelComplete, setLevelComplete] = useState<boolean>(false);

  // Sounds
  const successSoundRef = useRef<Audio.Sound | null>(null);
  const backgroundSoundRef = useRef<Audio.Sound | null>(null);
  const cardFlipSoundRef = useRef<Audio.Sound | null>(null);

  // Load Game State
  useEffect(() => {
    (async () => {
      try {
        const savedData = await AsyncStorage.getItem("mind-match-game");
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          setCurrentLevel(parsedData.currentLevel || 1);
          setScore(parsedData.score || 0);
          setFlippedCards(parsedData.flippedCards || []);
          setFlipCount(parsedData.flipCount || 0);
          setTotalFlips(parsedData.totalFlips || 0);
          setIsChecking(parsedData.isChecking || false);
          const loadedDeck = parsedData.deck.map((card: Deck) => ({
            ...card,
            fadeAnim: new Animated.Value(card.isMatched ? 0 : 1),
          }));
          setDeck(loadedDeck);
        } else {
          setDeck(generateDeck(pairsPerLevel[0]));
        }
      } catch {
        handleGameError("Error", "Error Loading Game State. Please try again.");
        setDeck(generateDeck(pairsPerLevel[0]));
      } finally {
        setIsGameLoading(false);
      }
    })();
  }, []);

  // Load Sounds
  useEffect(() => {
    (async () => {
      try {
        const isMusicOn = JSON.parse(
          (await AsyncStorage.getItem("music")) || "true"
        );
        if (!isMusicOn) return;

        const { sound: loadedSuccessSound } = await Audio.Sound.createAsync(
          Sounds.successSound2
        );
        const { sound: cardFlip } = await Audio.Sound.createAsync(
          Sounds.cardFlip
        );
        const { sound: background } = await Audio.Sound.createAsync(
          Sounds.backgroundMusic2,
          { isLooping: true }
        );
        successSoundRef.current = loadedSuccessSound;
        cardFlipSoundRef.current = cardFlip;
        backgroundSoundRef.current = background;
        await background.setVolumeAsync(0.4);
        await background.playAsync();
      } catch {
        handleGameError("Error", "Error Loading Sounds. Please try again.");
      }
    })();

    return () => {
      successSoundRef.current?.unloadAsync();
      cardFlipSoundRef.current?.unloadAsync();
      backgroundSoundRef.current?.stopAsync();
      backgroundSoundRef.current?.unloadAsync();
    };
  }, []);

  // Save Game State
  const saveGameState = async () => {
    try {
      const gameState = {
        currentLevel,
        score,
        deck: deck.map(({ id, icon, isFlipped, isMatched }) => ({
          id,
          icon,
          isFlipped,
          isMatched,
        })),
        flippedCards,
        flipCount,
        totalFlips,
        isChecking,
      };
      await AsyncStorage.setItem("mind-match-game", JSON.stringify(gameState));

      const user = auth().currentUser;
      if (user) {
        await firestore()
          .collection("users")
          .doc(user.uid)
          .collection("games")
          .doc("mind-match")
          .set({
            level: currentLevel,
            score,
            totalGameProgressPercentage: calculateProgress(),
            timestamp: firestore.FieldValue.serverTimestamp(),
          });
      }
    } catch {
      handleGameError("Error", "Error Saving Game State. Please try again.");
    }
  };

  // Save Game State when checking and flipped the cards
  useEffect(() => {
    if (!isChecking && flippedCards.length === 0) {
      saveGameState();
    }
  }, [isChecking, flippedCards]);

  // Play Sound
  const playSound = async (
    soundRef: React.MutableRefObject<Audio.Sound | null>
  ) => {
    try {
      await soundRef.current?.replayAsync();
    } catch {
      handleGameError("Error", "Error Playing Sound. Please try again.");
    }
  };

  // Handle Card Press
  const handleCardPress = (index: number) => {
    if (isChecking || deck[index].isFlipped || deck[index].isMatched) return;

    playSound(cardFlipSoundRef);

    setDeck((prevDeck) => {
      const newDeck = [...prevDeck];
      newDeck[index] = { ...newDeck[index], isFlipped: true };
      return newDeck;
    });

    setFlipCount((prev) => prev + 1);
    setFlippedCards((prev) => {
      const newFlipped = [...prev, index];
      if (newFlipped.length === 2) {
        setTimeout(() => checkForMatch(newFlipped), 1000);
      }
      return newFlipped;
    });
  };

  // check for match cards
  const checkForMatch = (flippedIndices: number[]) => {
    setIsChecking(true);
    setDeck((prevDeck) => {
      const newDeck = [...prevDeck];
      const [firstIndex, secondIndex] = flippedIndices;
      const firstCard = newDeck[firstIndex];
      const secondCard = newDeck[secondIndex];

      if (firstCard.icon === secondCard.icon) {
        newDeck[firstIndex] = { ...firstCard, isMatched: true };
        newDeck[secondIndex] = { ...secondCard, isMatched: true };

        playSound(successSoundRef);
        setScore((prev) => prev + 10);

        Animated.parallel([
          Animated.timing(newDeck[firstIndex].fadeAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(newDeck[secondIndex].fadeAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ]).start(() => {
          const allMatched = newDeck.every((card) => card.isMatched);

          if (allMatched) {
            setLevelComplete(true);
            const nextLevel = currentLevel + 1;

            if (nextLevel < 5) {
              setTotalFlips((prev) => prev + flipCount);
              setCurrentLevel(nextLevel);
              setDeck(generateDeck(pairsPerLevel[nextLevel - 1]));
              setFlipCount(0);
            }
          }

          setFlippedCards([]);
          setIsChecking(false);
        });
      } else {
        newDeck[firstIndex] = { ...firstCard, isFlipped: false };
        newDeck[secondIndex] = { ...secondCard, isFlipped: false };
        setFlippedCards([]);
        setIsChecking(false);
      }
      return newDeck;
    });
  };

  // Reset Game
  const resetGame = () => {
    setCurrentLevel(1);
    setDeck(generateDeck(pairsPerLevel[0]));
    setFlippedCards([]);
    setScore(0);
    setFlipCount(0);
    setTotalFlips(0);
    setIsChecking(false);
    setLevelComplete(false);
    saveGameState();
  };

  // Handle Back Button Press
  const handleBackButtonPress = async () => {
    await saveGameState();
    router.back();
  };

  // Handle game error
  const handleGameError = (title: string, message: string) => {
    Alert.alert(title, message, [
      {
        text: "Exit",
        onPress: async () => {
          router.back();
        },
      },
    ]);
  };

  // Render card item
  const renderItem = ({ item, index }: { item: Deck; index: number }) => (
    <Card
      card={item}
      onPress={() => handleCardPress(index)}
      disabled={isChecking}
      level={currentLevel}
    />
  );

  const calculateProgress = () => {
    return Math.round((score / MAX_SCORE) * 100);
  };

  const foundPairs = deck.filter((card) => card.isMatched).length / 2;
  const totalPairs = pairsPerLevel[currentLevel - 1];
  const progress = foundPairs / totalPairs;

  if (!fontsLoaded || isGameLoading) {
    return (
      <View style={styles.loader}>
        <Loader size={30} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Game Header and Stats*/}
      <View style={styles.header}>
        <Text style={styles.headerText}>
          Mind Match - Level {currentLevel < 4 ? currentLevel : 4}
        </Text>
        <View style={styles.statsContainer}>
          <Text style={styles.stats}>Score: {score}</Text>
          <Text style={styles.progressText}>
            Progress: {foundPairs} / {totalPairs}
          </Text>
          <Text style={styles.stats}>Flips: {flipCount}</Text>
        </View>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
        </View>
      </View>

      {/* Game Grid */}
      <View style={styles.gridContainer}>
        <FlatList
          data={deck}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={4}
          contentContainerStyle={styles.grid}
        />
      </View>

      {/* Game Controls */}
      <View style={styles.buttonContainer}>
        <Button onPress={resetGame} style={styles.button}>
          <Icons.Repeat size={20} color="#fff" />
          <Text style={styles.buttonText}>Reset</Text>
        </Button>
        <Button onPress={() => setIsGameExiting(true)} style={styles.button}>
          <Icons.LogOut size={20} color="#fff" />
          <Text style={styles.buttonText}>Exit</Text>
        </Button>
      </View>

      {/* Exit Game Modal */}
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
                <Icons.X size={40} color="black" />
                <Text style={styles.buttonText}>Cancel</Text>
              </Button>
              <Button
                onPress={handleBackButtonPress}
                style={[styles.button, styles.exitButton]}
              >
                <Icons.Check size={40} color="black" />
                <Text style={styles.buttonText}>Ok</Text>
              </Button>
            </View>
          </View>
        </View>
      )}

      {/* Level Complete Modal */}
      {(levelComplete || score === MAX_SCORE) && (
        <View style={styles.modelWrapper}>
          <View
            style={styles.modelOverlay}
            onTouchEnd={() => setLevelComplete(false)}
          />
          <View style={styles.modal}>
            <Text style={styles.modalText}>Congratulation</Text>
            {score !== MAX_SCORE ? (
              <View>
                <Text style={styles.message}>
                  Level {currentLevel - 1} Completed!
                </Text>
                <Button
                  onPress={() => setLevelComplete(false)}
                  style={styles.button}
                >
                  <Icons.ArrowBigRight size={40} color="black" />
                  <Text style={styles.buttonText}>Next Level</Text>
                </Button>
              </View>
            ) : (
              <View>
                <View style={{ flexDirection: "row" }}>
                  <LottieView
                    source={Lotties.congratulation2}
                    autoPlay
                    style={{ flex: 1, height: hp(15) }}
                    resizeMode="cover"
                  />
                  <LottieView
                    source={Lotties.congratulation2}
                    autoPlay
                    style={{ flex: 1, transform: [{ rotateY: "180deg" }] }}
                    resizeMode="cover"
                  />
                </View>
                <Text style={styles.message}>
                  You have completed all levels!
                </Text>

                <View style={styles.buttonContainer}>
                  <Button onPress={handleBackButtonPress} style={styles.button}>
                    <Icons.LogOut size={40} color="black" />
                    <Text style={styles.buttonText}>EXIT</Text>
                  </Button>
                  <Button
                    onPress={resetGame}
                    style={[styles.button, styles.exitButton]}
                  >
                    <Icons.Repeat size={40} color="black" />
                    <Text style={styles.buttonText}>REPLAY</Text>
                  </Button>
                </View>
              </View>
            )}
          </View>
          <LottieView
            source={Lotties.congratulation}
            loop={false}
            autoPlay
            style={styles.lottie}
            resizeMode="cover"
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    elevation: 3,
    width: "90%",
    gap: 5,
  },
  headerText: {
    fontSize: hp(3.5),
    fontFamily: "Coiny",
    color: "#333",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  stats: {
    fontSize: 16,
    color: "#666",
  },
  progressText: {
    fontSize: 16,
    color: "#666",
  },
  progressBarContainer: {
    width: "80%",
    height: 10,
    backgroundColor: "#ddd",
    borderRadius: 5,
    marginTop: 5,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#4caf50",
    borderRadius: 5,
  },
  gridContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  grid: {
    alignItems: "center",
  },
  cardContainer: {
    width: 80,
    height: 80,
    margin: 5,
  },
  cardFlipContainer: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  cardFace: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backfaceVisibility: "hidden",
  },
  cardBack: {
    backgroundColor: "#ddd",
    borderRadius: 10,
  },
  cardFront: {
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  cardBackContent: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  cardFrontContent: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  button: {
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Coiny",
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
    zIndex: 4,
  },
  modelOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 4,
  },
  modal: {
    backgroundColor: "#fff2b2",
    paddingVertical: hp(5),
    paddingHorizontal: wp(5),
    borderRadius: 10,
    alignItems: "center",
    width: "90%",
    borderWidth: 6,
    borderColor: "#9a5f31",
    zIndex: 10,
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
    textAlign: "center",
  },
  exitButton: {
    backgroundColor: "#f44336",
  },
  message: {
    fontSize: 20,
    fontFamily: "Coiny",
    color: "#333",
    marginBottom: 20,
  },
  lottie: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: "none",
    zIndex: 1,
  },
});

export default MindMatchGame;
