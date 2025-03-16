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
import { Icons } from "@/src/constants/Icons";
import { useFonts } from "expo-font";
import { Fonts } from "@/src/constants/Fonts";
import Loader from "@/src/components/ui/loader";
import { hp, wp } from "@/src/utils/common";
import Button from "@/src/components/ui/button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Sounds } from "@/src/constants/Sounds";
import { Audio } from "expo-av";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { router } from "expo-router";

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

const pairsPerLevel = [6, 8, 10, 12];
const levelColors = ["#6200ee", "#388e3c", "#f44336", "#ff9800"];

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
            opacity: card.fadeAnim, // Add fade animation here
          },
        ]}
      >
        {/* Back Face (Question Mark) */}
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

        {/* Front Face (Icon) */}
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
  const [fontsLoaded] = useFonts({
    Coiny: Fonts.Coiny,
  });

  const [currentLevel, setCurrentLevel] = useState(1);
  const [deck, setDeck] = useState(generateDeck(pairsPerLevel[0]));
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [flipCount, setFlipCount] = useState(0);
  const [totalFlips, setTotalFlips] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [isGameExiting, setIsGameExiting] = useState(false);
  const [isGameLoading, setIsGameLoading] = useState(true);

  const gameStateRef = useRef({
    currentLevel,
    score,
    deck,
    flippedCards,
    flipCount,
    totalFlips,
    isChecking,
  });

  const successSoundRef = useRef<Audio.Sound | null>(null);
  const backgroundSoundRef = useRef<Audio.Sound | null>(null);
  const cardFlipSoundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    gameStateRef.current = {
      currentLevel,
      score,
      deck,
      flippedCards,
      flipCount,
      totalFlips,
      isChecking,
    };
  }, [
    currentLevel,
    score,
    deck,
    flippedCards,
    flipCount,
    totalFlips,
    isChecking,
  ]);

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
      } catch (error) {
        console.log("Error loading game state:", error);
        setDeck(generateDeck(pairsPerLevel[0]));
      } finally {
        setIsGameLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    return () => {
      const saveOnUnmount = async () => {
        try {
          const gameState = gameStateRef.current;
          await AsyncStorage.setItem(
            "mind-match-game",
            JSON.stringify({
              currentLevel: gameState.currentLevel,
              score: gameState.score,
              deck: gameState.deck.map(
                ({ id, icon, isFlipped, isMatched }) => ({
                  id,
                  icon,
                  isFlipped,
                  isMatched,
                })
              ),
              flippedCards: gameState.flippedCards,
              flipCount: gameState.flipCount,
              totalFlips: gameState.totalFlips,
              isChecking: gameState.isChecking,
            })
          );
        } catch (error) {
          console.log("Error saving game state on unmount:", error);
        }
      };
      saveOnUnmount();
    };
  }, []);

  useEffect(() => {
    const loadSound = async () => {
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
      startBackgroundMusic();
    };

    loadSound();
    return () => {
      successSoundRef.current?.unloadAsync();
      cardFlipSoundRef.current?.unloadAsync();
      stopBackgroundMusic();
    };
  }, []);

  const saveGameState = async () => {
    try {
      const gameState = gameStateRef.current;
      await AsyncStorage.setItem(
        "mind-match-game",
        JSON.stringify({
          currentLevel: gameState.currentLevel,
          score: gameState.score,
          deck: gameState.deck.map(({ id, icon, isFlipped, isMatched }) => ({
            id,
            icon,
            isFlipped,
            isMatched,
          })),
          flippedCards: gameState.flippedCards,
          flipCount: gameState.flipCount,
          totalFlips: gameState.totalFlips,
          isChecking: gameState.isChecking,
        })
      );

      const user = auth().currentUser;
      if (user) {
        await firestore()
          .collection("users")
          .doc(user.uid)
          .collection("games")
          .doc("mind-match")
          .set({
            progress: { level: gameState.currentLevel, score: gameState.score },
            timestamp: firestore.FieldValue.serverTimestamp(),
          });
      }
    } catch (error) {
      console.log("Error saving game state:", error);
    }
  };

  useEffect(() => {
    if (!isChecking) {
      saveGameState();
    }
  }, [isChecking]);

  useEffect(() => {
    if (isChecking && flippedCards.length === 2) {
      setTimeout(() => checkForMatch(flippedCards), 1000);
    }
  }, [isChecking, flippedCards, deck]);

  // start the background music
  const startBackgroundMusic = async () => {
    if (backgroundSoundRef.current) {
      try {
        await backgroundSoundRef.current.setVolumeAsync(0.4);
        await backgroundSoundRef.current.playAsync();
      } catch {
        console.log("Error playing background music");
      }
    }
  };

  // stop the background music
  const stopBackgroundMusic = async () => {
    if (backgroundSoundRef.current) {
      try {
        await backgroundSoundRef.current.stopAsync();
        await backgroundSoundRef.current.unloadAsync();
        backgroundSoundRef.current = null;
      } catch (error) {
        console.log("Error stopping background music", error);
      }
    }
  };

  const playSuccessSound = async () => {
    if (successSoundRef.current) {
      try {
        await successSoundRef.current.replayAsync();
      } catch (error) {
        console.log("Error playing success sound:", error);
      }
    }
  };

  const playCardFlipSound = async () => {
    if (cardFlipSoundRef.current) {
      try {
        await cardFlipSoundRef.current.replayAsync();
      } catch (error) {
        console.log("Error playing card flip sound:", error);
      }
    }
  };

  // Update the handleCardPress to use functional updates
  const handleCardPress = (index: number) => {
    if (isChecking || deck[index].isFlipped || deck[index].isMatched) return;

    playCardFlipSound();

    // Use functional update to ensure latest state
    setDeck((prevDeck) => {
      const newDeck = [...prevDeck];
      newDeck[index].isFlipped = true;
      return newDeck;
    });

    setFlipCount((prev) => prev + 1);
    setFlippedCards((prev) => {
      const newFlipped = [...prev, index];
      if (newFlipped.length === 2) {
        setIsChecking(true);
        setTimeout(() => checkForMatch(newFlipped), 1000);
      }
      return newFlipped;
    });
  };

  const checkForMatch = (flippedIndices: number[]) => {
    const [firstIndex, secondIndex] = flippedIndices;

    // Use functional update to get latest deck state
    setDeck((prevDeck) => {
      const newDeck = [...prevDeck];
      const firstCard = newDeck[firstIndex];
      const secondCard = newDeck[secondIndex];

      if (firstCard.icon === secondCard.icon) {
        newDeck[firstIndex].isMatched = true;
        newDeck[secondIndex].isMatched = true;
        playSuccessSound();
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
        ]).start();

        // Check if all matches are done using current state
        const allMatched = newDeck.every((card) => card.isMatched);
        if (allMatched) {
          const nextLevel = currentLevel + 1;
          if (nextLevel > 4) {
            const finalTotalFlips = totalFlips + flipCount;
            Alert.alert(
              "Congratulations!",
              `You've completed all levels!\nTotal Score: ${score}\nTotal Flips: ${finalTotalFlips}`,
              [{ text: "OK", onPress: resetGame }]
            );
          } else {
            setTotalFlips((prev) => prev + flipCount);
            setCurrentLevel(nextLevel);
            setDeck(generateDeck(pairsPerLevel[nextLevel - 1]));
            setFlippedCards([]);
            setFlipCount(0);
          }
        }
      } else {
        newDeck[firstIndex].isFlipped = false;
        newDeck[secondIndex].isFlipped = false;
      }

      // Return the updated deck immediately
      return newDeck;
    });

    // Reset these states using functional updates
    setFlippedCards([]);
    setIsChecking(false);
  };

  const resetGame = () => {
    setCurrentLevel(1);
    setDeck(generateDeck(pairsPerLevel[0]));
    setFlippedCards([]);
    setScore(0);
    setFlipCount(0);
    setTotalFlips(0);
    setIsChecking(false);
    saveGameState();
  };

  const handleBackButtonPress = async () => {
    await saveGameState();
    router.back();
  };

  const renderItem = ({ item, index }: { item: Deck; index: number }) => (
    <Card
      card={item}
      onPress={() => handleCardPress(index)}
      disabled={isChecking}
      level={currentLevel}
    />
  );

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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Mind Match - Level {currentLevel}</Text>
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
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <FlatList
          data={deck}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={4}
          contentContainerStyle={styles.grid}
        />
      </View>
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
    </View>
  );
};

// Styles
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
  grid: {
    alignItems: "center",
  },
  cardWrapper: {
    width: 80,
    height: 80,
    margin: 5,
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
    backfaceVisibility: "hidden", // Ensures proper flipping
  },
  cardBack: {
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  cardFront: {
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
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
    zIndex: 1,
  },
  modelOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modal: {
    backgroundColor: "#fff2b2",
    paddingVertical: hp(5),
    paddingHorizontal: wp(5),
    borderRadius: 10,
    alignItems: "center",
    position: "relative",
    width: "90%",
    display: "flex",
    borderWidth: 6,
    borderColor: "#9a5f31",
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
  exitButton: {
    backgroundColor: "#f44336",
  },
});

export default MindMatchGame;
