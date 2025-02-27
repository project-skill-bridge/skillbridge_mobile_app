/* eslint-disable @typescript-eslint/no-require-imports */
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ImageBackground, // Added for background image
} from "react-native";
import * as ScreenOrientation from "expo-screen-orientation";
import { Audio } from "expo-av";
// import firestore from "@react-native-firebase/firestore";

import { hp, wp } from "@/src/utils/common";
import { theme } from "@/src/constants/Theme";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { router } from "expo-router";
import HexagonSVG from "@/src/components/hexagon-svg";

const LandscapeKeyboardScreen = () => {
  const shake = useSharedValue(0);
  const [score, setScore] = useState(0); // New score state
  const [randomChar, setRandomChar] = useState("");
  const [successSound, setSuccessSound] = useState<Audio.Sound | null>(null);
  const [failureSound, setFailureSound] = useState<Audio.Sound | null>(null);
  const [backgroundMusic, setBackgroundMusic] = useState<Audio.Sound | null>(
    null
  );

  useEffect(() => {
    const lockOrientation = async () => {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE
      );
    };
    lockOrientation();

    generateRandomChar();
    // startBackgroundMusic();

    return () => {
      ScreenOrientation.unlockAsync();
      // successSound?.unloadAsync();
      // failureSound?.unloadAsync();
      // stopBackgroundMusic();
    };
  }, []);

  // useEffect(() => {
  //   const loadSound = async () => {
  //     const { sound: loadedSuccessSound } = await Audio.Sound.createAsync(
  //       require("@/assets/sounds/game_success.mp3")
  //     );
  //     const { sound: loadedFailureSound } = await Audio.Sound.createAsync(
  //       require("@/assets/sounds/game_failure.mp3")
  //     );
  //     setSuccessSound(loadedSuccessSound);
  //     setFailureSound(loadedFailureSound);
  //   };
  //   loadSound();
  // }, []);

  // const startBackgroundMusic = async () => {
  //   const { sound: loadedBackgroundMusic } = await Audio.Sound.createAsync(
  //     require("@/assets/sounds/background.mp3"), // Replace with your background music file
  //     { isLooping: true } // Enable looping
  //   );
  //   await loadedBackgroundMusic.setVolumeAsync(0.2);
  //   await loadedBackgroundMusic.playAsync();
  //   setBackgroundMusic(loadedBackgroundMusic);
  // };

  // const stopBackgroundMusic = async () => {
  //   if (backgroundMusic) {
  //     await backgroundMusic.stopAsync(); // Stop playback
  //     await backgroundMusic.unloadAsync(); // Release resources
  //     setBackgroundMusic(null); // Reset the state
  //   }
  // };

  const generateRandomChar = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const randomIndex = Math.floor(Math.random() * characters.length);
    setRandomChar(characters[randomIndex]);
  };

  const handleKeyPress = async (char: string) => {
    if (char === randomChar) {
      await successSound?.replayAsync();
      generateRandomChar();
    } else {
      await failureSound?.replayAsync();
      triggerShakeAnimation();
    }
  };

  const saveScoreToFirebase = async () => {
    // const storeGameScore = async () => {
    //   try {
    //     await firestore()
    //       .collection('userScores')
    //       .doc()
    //       .collection('gameScores')
    //       .doc()
    //       .set();
    //     console.log('Score stored successfully');
    //   } catch (error) {
    //     console.error('Error storing score: ', error);
    //   }
    // };
  };

  const triggerShakeAnimation = () => {
    shake.value = withSequence(
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(-10, { duration: 50 }),
      withTiming(0, { duration: 50 })
    );
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: shake.value }],
    };
  });

  const keyboardRows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M"],
  ];

  const handleBackButtonPress = () => {
    Alert.alert("Exit Game", "Are you sure you want to exit?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Exit",
        onPress: () => {
          // stopBackgroundMusic();
          saveScoreToFirebase();
          ScreenOrientation.unlockAsync();
          router.back();
        },
      },
    ]);
  };

  return (
    <ImageBackground
      // source={require("@/assets/images/typing-game-bg.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.topRaw}>
          {/* <BackButton onPress={handleBackButtonPress} /> */}
          <Animated.View style={animatedStyle}>
            <HexagonSVG character={randomChar} fill="pink" />
          </Animated.View>
          <Text>{score}</Text>
        </View>

        {/* Custom keyboard */}
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
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingInline: wp(5),
    paddingBlockEnd: hp(1),
    paddingBlockStart: hp(2),
  },
  overlay: {
    flex: 1,
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  keyboardContainer: {
    backgroundColor: "#fdeed8",
    opacity: 0.8,
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 5,
    borderColor: "#e78cba",
    alignSelf: "center",
  },
  keyboardRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 5,
  },
  key: {
    backgroundColor: "#ffffff",
    margin: 5,
    borderRadius: 5,
    padding: 10,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    borderWidth: 1,
  },
  keyText: {
    fontSize: hp(3),
    fontWeight: theme.fontWeights.extraBold,
  },
  topRaw: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  randomCharDisplay: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
});

export default LandscapeKeyboardScreen;
