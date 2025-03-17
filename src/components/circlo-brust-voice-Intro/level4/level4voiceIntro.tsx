import React, { useState, useEffect, useRef } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Animated,
  TouchableOpacity,
  Easing,
  ScrollView,
} from "react-native";
import * as Speech from "expo-speech";
import * as Font from "expo-font";
import { Fonts } from "@/src/constants/Fonts";
import { Images } from "@/src/constants/Images";

const { width } = Dimensions.get("window");

interface FinnVoiceIntroProps {
  introText: string;
  displayText: string;
  onComplete?: () => void;
  language?: string;
  speed?: "slow" | "normal" | "fast";
  voiceType?: "child" | "adult" | "robot";
}

const level4voiceIntro: React.FC<FinnVoiceIntroProps> = ({
  introText = "Hi, I'm Finn! Welcome to our adventure!",
  onComplete = () => {},
  language = "en-US",
  speed = "normal",
  voiceType = "adult",
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [isFirstVisit, setIsFirstVisit] = useState<boolean>(true);
  const [isTalking, setIsTalking] = useState<boolean>(false);
  const [showBubble, setShowBubble] = useState<boolean>(true);
  const [showButton, setShowButton] = useState<boolean>(false);
  const [fontsLoaded, setFontsLoaded] = useState<boolean>(false);
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;

  // Voice settings based on type - adjusted for more natural sound
  const voiceSettings: Record<string, { pitch: number; rate: number }> = {
    child: { pitch: 1.1, rate: 0.95 },
    adult: { pitch: 1.0, rate: 0.9 },
    robot: { pitch: 0.8, rate: 0.9 },
  };

  // Speed settings - adjusted for slightly faster speech
  const speedSettings: Record<string, number> = {
    slow: 0.8,
    normal: 1.1,
    fast: 1.4,
  };

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          Baloo: Fonts.Baloo,
        });
        setFontsLoaded(true);
      } catch (error) {
        console.error("Error loading fonts:", error);
        setFontsLoaded(true);
      }
    }

    loadFonts();
  }, []);

  // Check if it's the first visit
  const checkFirstVisit = async () => {
    try {
      const hasVisited = await AsyncStorage.getItem("hasVisitedBefore");
      if (hasVisited !== null) {
        setIsFirstVisit(false);
        setShowBubble(false);
      } else {
        await AsyncStorage.setItem("hasVisitedBefore", "true");
        setShowBubble(true);
      }
    } catch (error) {
      console.error("Error checking first visit:", error);
    }
  };

  // Start the animation and voice
  const startIntro = () => {
    setIsPlaying(true);
    setIsTalking(true);
    setShowBubble(true);
    setShowButton(false);

    // Reset animation values
    setIsComplete(false);

    const { pitch, rate } = voiceSettings[voiceType];
    const speedMultiplier = speedSettings[speed];

    // Start the speech
    Speech.speak(introText, {
      language,
      rate: rate * speedMultiplier,
      pitch,
      onDone: () => {
        setIsPlaying(false);
        setIsTalking(false);
        setIsComplete(true);
        if (onComplete) onComplete();
      },
    });
  };

  // Character bounce animation
  const startBounceAnimation = () => {
    Animated.sequence([
      Animated.timing(bounceAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(bounceAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Only restart animation if not talking
      if (!isTalking) {
        setTimeout(startBounceAnimation, Math.random() * 5000 + 5000);
      }
    });
  };

  // Handle close button press
  const handleClose = () => {
    Speech.stop();
    setShowBubble(false);
    setShowButton(false);
    animateButton(false);
    if (onComplete) onComplete();
  };

  // Button animation
  const animateButton = (show: boolean) => {
    Animated.timing(buttonAnim, {
      toValue: show ? 1 : 0,
      duration: 800,
      easing: Easing.bezier(0.16, 1, 0.3, 1),
      useNativeDriver: true,
    }).start();
  };

  // Handle Finn character press
  const handleFinnPress = () => {
    if (!isFirstVisit && !showBubble) {
      // Toggle button state with animation
      const newButtonState = !showButton;
      setShowButton(newButtonState);
      animateButton(newButtonState);
    }
  };

  // Calculate responsive sizes based on screen width
  const getResponsiveSizes = () => {
    const baseWidth = 375;
    const scale = width / baseWidth;

    return {
      containerHeight: Math.min(140 * scale, 220),
      characterSize: Math.min(100 * scale, 150),
      fontSize: Math.min(16 * scale, 20),
      bubblePadding: Math.min(15 * scale, 22),
      buttonSize: Math.min(120 * scale, 160),
      bubbleMaxHeight: Math.min(180 * scale, 260),
    };
  };

  const responsiveSizes = getResponsiveSizes();

  // Animation values
  const bounceTransform = bounceAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, -8, 0],
  });

  const buttonTransform = buttonAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [40, -30],
  });

  const buttonScale = buttonAnim.interpolate({
    inputRange: [0, 0.7, 1],
    outputRange: [0.5, 1.1, 1],
  });

  const buttonOpacity = buttonAnim;

  // Effects on component mount
  useEffect(() => {
    if (fontsLoaded) {
      checkFirstVisit().then(() => {
        if (isFirstVisit) {
          startIntro();
        }
      });

      startBounceAnimation();
    }

    return () => {
      Speech.stop();
    };
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { height: responsiveSizes.containerHeight }]}
    >
      {/* Message section */}
      <View style={styles.messageSection}>
        {showBubble && (
          <View style={styles.bubbleContainer}>
            <View
              style={[
                styles.thoughtBubble,
                { padding: responsiveSizes.bubblePadding },
              ]}
            >
              <ScrollView
                style={{
                  maxHeight: responsiveSizes.bubbleMaxHeight,
                }}
                showsVerticalScrollIndicator={false}
              >
                <Text
                  style={[
                    styles.thoughtText,
                    {
                      fontSize: responsiveSizes.fontSize,
                      fontFamily: "Baloo",
                    },
                  ]}
                >
                  {displayText}
                </Text>
              </ScrollView>

              <TouchableOpacity
                onPress={handleClose}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.bubbleDots}>
              <View style={styles.dot1}></View>
              <View style={styles.dot2}></View>
              <View style={styles.dot3}></View>
              <View style={styles.dot4}></View>
            </View>
          </View>
        )}
      </View>

      {/* Finn character section */}
      <View style={styles.characterSection}>
        {/* Voice Intro Button */}
        <Animated.View
          style={[
            styles.buttonContainer,
            {
              transform: [
                { translateY: buttonTransform },
                { scale: buttonScale },
              ],
              opacity: buttonOpacity,
              width: responsiveSizes.buttonSize,
            },
          ]}
        >
          {showButton && (
            <TouchableOpacity style={styles.voiceButton} onPress={startIntro}>
              <Text style={styles.voiceButtonText}>Voice Intro</Text>
            </TouchableOpacity>
          )}
        </Animated.View>

        {/* Clickable Finn character */}
        <TouchableOpacity onPress={handleFinnPress} activeOpacity={0.8}>
          <Animated.View
            style={[
              styles.characterContainer,
              {
                width: responsiveSizes.characterSize,
                height: responsiveSizes.characterSize,
                transform: [{ translateY: bounceTransform }],
              },
            ]}
          >
            <Image
              source={isTalking ? Images.talkingFinn : Images.normalFinn}
              contentFit="contain"
              style={styles.character}
            />
          </Animated.View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    position: "relative",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  messageSection: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    paddingTop: 10,
  },
  characterSection: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
    paddingBottom: 5,
    position: "relative",
  },
  bubbleContainer: {
    flexDirection: "row",
    alignItems: "center",
    maxWidth: "95%",
  },
  thoughtBubble: {
    backgroundColor: "#87CEFA",
    borderRadius: 20,
    borderTopLeftRadius: 4,
    marginRight: 5,
    position: "relative",
    maxWidth: "95%",
  },
  thoughtText: {
    color: "#000",
    fontWeight: "500",
    lineHeight: 26,
  },
  bubbleDots: {
    flexDirection: "column",
    justifyContent: "center",
    height: 40,
  },
  dot1: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#87CEFA",
    marginBottom: 3,
  },
  dot2: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: "#87CEFA",
    marginBottom: 3,
    marginLeft: 3,
  },
  dot3: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#87CEFA",
    marginBottom: 2,
    marginLeft: 6,
  },
  dot4: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#87CEFA",
    marginLeft: 8,
  },
  characterContainer: {
    // Position adjusted in character section
  },
  character: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  closeButton: {
    position: "absolute",
    top: 5,
    right: 5,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonContainer: {
    position: "absolute",
    top: -60,
    alignSelf: "center",
    zIndex: 10,
  },
  voiceButton: {
    backgroundColor: "rgba(66, 133, 244, 0.9)",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 24,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
  },
  voiceButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
    textAlign: "center",
  },
});

export default level4voiceIntro;
