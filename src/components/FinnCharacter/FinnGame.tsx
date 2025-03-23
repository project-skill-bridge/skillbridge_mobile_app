/* eslint-disable @typescript-eslint/no-explicit-any */
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
  TouchableWithoutFeedback,
  Easing,
  ScrollView,
  PanResponder,
} from "react-native";
import * as Speech from "expo-speech";
import * as Font from "expo-font";
import { Fonts } from "@/src/constants/Fonts";
import { Images } from "@/src/constants/Images";
import BufferingProgress from "../ui/buffering-progress";
import { hp, wp } from "@/src/utils/common";

const { width } = Dimensions.get("window");

interface FinnVoiceIntroProps {
  gameId: string;
  buttonText: string;
  IntroText: string | string[];
  displayText: string | string[];
  onComplete?: () => void;
  language?: string;
  speed?: "slow" | "normal" | "fast";
  voiceType?: "child" | "adult" | "robot";
}

const FinnVoiceIntro: React.FC<FinnVoiceIntroProps> = ({
  gameId,
  IntroText = "",
  displayText = "Let's Play!",
  onComplete = () => {},
  language = "en-US",
  speed = "normal",
  voiceType = "adult",
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  // const [isComplete, setIsComplete] = useState<boolean>(false);
  // const [isFirstVisit, setIsFirstVisit] = useState<boolean>(true);
  const [isTalking, setIsTalking] = useState<boolean>(false);
  const [showBubble, setShowBubble] = useState<boolean>(false);
  const [showButton, setShowButton] = useState<boolean>(false);
  const [showBackdrop, setShowBackdrop] = useState<boolean>(false);
  const [fontsLoaded, setFontsLoaded] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [sentencesReady, setSentencesReady] = useState<boolean>(false);

  // States for handling sequential sentences
  // const [currentSentenceIndex, setCurrentSentenceIndex] = useState<number>(0);
  const [sentences, setSentences] = useState<string[]>([]);
  const [currentDisplayText, setCurrentDisplayText] = useState<string>("");

  // Animation refs
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;

  // Draggable position animations
  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  // All backdrop-related animations use JS driver
  const backdropAnim = useRef(new Animated.Value(0)).current;
  const backdropScaleAnim = useRef(new Animated.Value(1.2)).current;

  // Bubble animations (all using native driver)
  const bubbleOpacityAnim = useRef(new Animated.Value(0)).current;
  const bubbleScaleAnim = useRef(new Animated.Value(0.7)).current;

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

  // Initialize sentences array on component mount
  useEffect(() => {
    // Convert IntroText and displayText to arrays if they're not already
    const introArray = Array.isArray(IntroText) ? IntroText : [IntroText];
    const displayArray = Array.isArray(displayText)
      ? displayText
      : [displayText];

    // Use the longer of the two arrays
    const sentencesArray =
      introArray.length >= displayArray.length ? introArray : displayArray;

    setSentences(sentencesArray);

    // Set the initial display text
    if (sentencesArray.length > 0) {
      setCurrentDisplayText(sentencesArray[0]);
      setSentencesReady(true);
    }
  }, [IntroText, displayText]);

  // Calculate responsive sizes based on screen width
  const getResponsiveSizes = () => {
    const baseWidth = 375;
    const scale = width / baseWidth;

    return {
      containerHeight: Math.min(150 * scale, 220),
      characterSize: Math.min(140 * scale, 150),
      fontSize: Math.min(16 * scale, 20),
      bubblePadding: Math.min(15 * scale, 22),
      buttonSize: Math.min(115 * scale, 160),
      bubbleMaxHeight: Math.min(180 * scale, 360),
    };
  };

  const responsiveSizes = getResponsiveSizes();

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (_, gestureState) => {
        if (isTalking) return false;

        return gestureState.dx > 5 || gestureState.dy > 5;
      },
      onMoveShouldSetPanResponder: (_, gestureState) => {
        if (isTalking) return false;

        return gestureState.dx > 10 || gestureState.dy > 10;
      },
      onPanResponderGrant: () => {
        setIsDragging(true);
        pan.extractOffset();
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: () => {
        setIsDragging(false);
        pan.flattenOffset();

        const newPosition = {
          x: (pan.x as any)._value || 0,
          y: (pan.y as any)._value || 0,
        };
        // setPosition(newPosition);
        savePosition(newPosition);
      },
    })
  ).current;

  // Draggable position state
  // const [position, setPosition] = useState<{ x: number; y: number }>({
  //   x: 0,
  //   y: 0,
  // });

  const savePosition = async (pos: { x: number; y: number }) => {
    try {
      const positionKey = `finn_position_${gameId}`;
      await AsyncStorage.setItem(positionKey, JSON.stringify(pos));
    } catch (error) {
      console.error("Error saving position:", error);
    }
  };

  const loadPosition = async () => {
    try {
      const positionKey = `finn_position_${gameId}`;
      const savedPosition = await AsyncStorage.getItem(positionKey);

      if (savedPosition) {
        const pos = JSON.parse(savedPosition);
        // setPosition(pos);
        pan.setValue({ x: pos.x, y: pos.y });
      }
    } catch (error) {
      console.error("Error loading position:", error);
    }
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
    loadPosition();

    const timer = setTimeout(() => {
      // setIsFirstVisit(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const testStorage = async () => {
      try {
        await AsyncStorage.setItem("test_key", "test_value");
        const value = await AsyncStorage.getItem("test_key");
        console.log(
          "AsyncStorage test:",
          value === "test_value" ? "PASSED" : "FAILED"
        );
      } catch (error) {
        console.error("AsyncStorage test error:", error);
      }
    };
    testStorage();
  }, []);

  const checkFirstVisit = async (gameId: string) => {
    try {
      const storageKey = `hasVisited_${gameId}`;
      const hasVisited = await AsyncStorage.getItem(storageKey);
      const isFirst = hasVisited === null;

      // setIsFirstVisit(isFirst);

      if (isFirst) {
        await AsyncStorage.setItem(storageKey, "true");
      }

      return isFirst;
    } catch (error) {
      console.error("Error checking first visit:", error);
      return false;
    }
  };

  // Show bubble with animation
  const showBubbleWithAnimation = (show: boolean, callback?: () => void) => {
    if (show) {
      setShowBubble(true);
      Animated.parallel([
        Animated.timing(bubbleOpacityAnim, {
          toValue: 1,
          duration: 400,
          easing: Easing.bezier(0.16, 1, 0.3, 1),
          useNativeDriver: true,
        }),
        Animated.timing(bubbleScaleAnim, {
          toValue: 1,
          duration: 400,
          easing: Easing.bezier(0.16, 1, 0.3, 1),
          useNativeDriver: true,
        }),
      ]).start(() => {
        if (callback) callback();
      });
    } else {
      Animated.parallel([
        Animated.timing(bubbleOpacityAnim, {
          toValue: 0,
          duration: 300,
          easing: Easing.bezier(0.16, 1, 0.3, 1),
          useNativeDriver: true,
        }),
        Animated.timing(bubbleScaleAnim, {
          toValue: 0.7,
          duration: 300,
          easing: Easing.bezier(0.16, 1, 0.3, 1),
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowBubble(false);
        if (callback) callback();
      });
    }
  };

  const speakCurrentSentence = (indexToSpeak = 0) => {
    if (!sentences || sentences.length === 0) {
      console.error("No sentences available to speak");
      return;
    }

    if (indexToSpeak >= sentences.length) {
      // Completed all sentences - hide both bubble and backdrop
      setIsPlaying(false);
      setIsTalking(false);
      // setIsComplete(true);

      // Hide bubble first, then backdrop for better visual flow
      showBubbleWithAnimation(false, () => {
        // Once bubble is hidden, smoothly hide backdrop
        showBackdropWithAnimation(false);
        if (onComplete) onComplete();
      });
      return;
    }

    setIsTalking(true);
    // setCurrentSentenceIndex(indexToSpeak);

    // Show bubble with current sentence text
    setCurrentDisplayText(sentences[indexToSpeak]);
    showBubbleWithAnimation(true);

    const { pitch, rate } = voiceSettings[voiceType];
    const speedMultiplier = speedSettings[speed];

    Speech.speak(sentences[indexToSpeak], {
      language,
      rate: rate * speedMultiplier,
      pitch,
      onDone: () => {
        // Hide bubble when speech is done
        showBubbleWithAnimation(false, () => {
          // When bubble is hidden, move to next sentence
          const nextIndex = indexToSpeak + 1;

          if (nextIndex < sentences.length) {
            // Wait a moment before showing next sentence
            setTimeout(() => {
              speakCurrentSentence(nextIndex);
            }, 500); // Wait half a second between sentences
          } else {
            // All sentences complete
            setIsPlaying(false);
            setIsTalking(false);
            // setIsComplete(true);

            // Hide backdrop at the end
            showBackdropWithAnimation(false);
            if (onComplete) onComplete();
          }
        });
      },
      onError: (error) => {
        console.error("Speech error:", error);
        setIsTalking(false);
        showBubbleWithAnimation(false);
        showBackdropWithAnimation(false);
      },
    });
  };

  // Show backdrop with animation
  const showBackdropWithAnimation = (show: boolean, callback?: () => void) => {
    if (show) {
      setShowBackdrop(true);

      Animated.parallel([
        Animated.timing(backdropAnim, {
          toValue: 0.5,
          duration: 600,
          useNativeDriver: false,
        }),
        Animated.timing(backdropScaleAnim, {
          toValue: 1,
          duration: 600,
          easing: Easing.bezier(0.16, 1, 0.3, 1),
          useNativeDriver: false,
        }),
      ]).start(() => {
        if (callback) callback();
      });
    } else {
      Animated.parallel([
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 500,
          easing: Easing.bezier(0.16, 1, 0.3, 1),
          useNativeDriver: false,
        }),
        Animated.timing(backdropScaleAnim, {
          toValue: 1.2,
          duration: 500,
          easing: Easing.bezier(0.16, 1, 0.3, 1),
          useNativeDriver: false,
        }),
      ]).start(() => {
        setShowBackdrop(false);
        if (callback) callback();
      });
    }
  };

  // Show all intro elements with synchronized animations
  const showIntroElements = (show: boolean, callback?: () => void) => {
    if (show) {
      // Only show backdrop at the start
      showBackdropWithAnimation(true, callback);

      // Bubble will be shown by speakCurrentSentence function
    } else {
      // Hide all elements
      showBackdropWithAnimation(false, callback);
    }
  };

  const startIntro = () => {
    if (isPlaying) return;

    if (!sentencesReady || !sentences || sentences.length === 0) {
      console.error("No sentences available to speak");
      return;
    }

    // Stop any ongoing speech first
    Speech.stop();

    // Reset state
    setIsPlaying(true);
    showIntroElements(true);
    setShowButton(false);
    // setIsComplete(false);

    // Wait a moment for backdrop animation to settle, then start speaking
    setTimeout(() => {
      speakCurrentSentence(0);
    }, 500);
  };

  const buttonIntro = () => {
    // Don't start if already playing
    if (isPlaying) return;

    // Make sure sentences are loaded
    if (!sentencesReady || !sentences || sentences.length === 0) {
      console.error("No sentences available to speak");
      return;
    }

    // Stop any ongoing speech first
    Speech.stop();

    // Reset state
    setIsPlaying(true);
    showIntroElements(true);
    setShowButton(false);
    // setIsComplete(false);

    // Wait a moment for backdrop animation to settle, then start speaking
    setTimeout(() => {
      speakCurrentSentence(0);
    }, 500);
  };

  // Character bounce animation
  const startBounceAnimation = () => {
    // Don't bounce during drag
    if (isDragging) return;

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
      // Only restart animation if not talking and not dragging
      if (!isTalking && !isDragging) {
        setTimeout(startBounceAnimation, Math.random() * 5000 + 5000);
      }
    });
  };

  // Handle close button press
  const handleClose = () => {
    // Make sure speech stops completely
    Speech.stop();

    showBubbleWithAnimation(false, () => {
      showBackdropWithAnimation(false, () => {
        // Hide elements with animation
        showIntroElements(false, () => {
          // Set states to reflect closed state only after animations complete
          setIsPlaying(false);
          setIsTalking(false);

          // Reset sentence index
          // setCurrentSentenceIndex(0);

          // Call onComplete if provided
          if (onComplete) onComplete();
        });
      });
    });
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
    // Only handle press if not dragging
    if (isDragging) return;

    // Toggle button state with animation
    const newButtonState = !showButton;
    setShowButton(newButtonState);
    animateButton(newButtonState);
  };

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

  // Modified useEffect to use gameId parameter for checkFirstVisit
  useEffect(() => {
    if (fontsLoaded && sentencesReady) {
      checkFirstVisit(gameId).then((isFirst) => {
        // Only call startIntro if it's the first visit
        if (isFirst) {
          setTimeout(() => {
            startIntro();
          }, 300);
        }
      });

      if (!isDragging) {
        startBounceAnimation();
      }
    }

    return () => {
      Speech.stop();
    };
  }, [fontsLoaded, gameId, isDragging, sentencesReady]);

  // Stop bounce animation during dragging
  useEffect(() => {
    if (isDragging) {
      bounceAnim.setValue(0);
    } else if (!isTalking) {
      startBounceAnimation();
    }
  }, [isDragging]);

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <BufferingProgress />
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
      <View style={styles.container}>
        {/* Full-screen backdrop */}
        {showBackdrop && (
          <Animated.View
            style={[
              styles.backdrop,
              {
                opacity: backdropAnim,
                transform: [{ scale: backdropScaleAnim }],
              },
            ]}
          />
        )}

        {/* Draggable Finn Container */}
        <Animated.View
          style={[
            styles.draggableContainer,
            {
              transform: [{ translateX: pan.x }, { translateY: pan.y }],
            },
          ]}
          {...panResponder.panHandlers}
        >
          {/* Message section */}
          {showBubble && (
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <Animated.View
                style={[
                  styles.bubbleContainer,
                  {
                    opacity: bubbleOpacityAnim,
                    transform: [{ scale: bubbleScaleAnim }],
                  },
                ]}
              >
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
                      {currentDisplayText}
                    </Text>
                  </ScrollView>

                  <TouchableOpacity
                    onPress={handleClose}
                    style={styles.closeButton}
                    activeOpacity={0.7}
                    hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
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
              </Animated.View>
            </TouchableWithoutFeedback>
          )}

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
              <TouchableOpacity
                style={styles.voiceButton}
                onPress={buttonIntro}
                activeOpacity={0.7}
              >
                <Text style={styles.voiceButtonText}>Voice Intro</Text>
              </TouchableOpacity>
            )}
          </Animated.View>

          {/* Finn character - Separate TouchableOpacity not using panHandlers */}
          <TouchableOpacity
            onPress={(e) => {
              // Prevent event propagation to stop accidental touches
              e.stopPropagation();

              // Only handle press if not already talking
              if (!isTalking) {
                handleFinnPress();
              }
            }}
            activeOpacity={0.8}
            disabled={isTalking} // Only disable during talking, not during dragging
          >
            <Animated.View
              style={[
                styles.characterContainer,
                {
                  width: responsiveSizes.characterSize,
                  height: responsiveSizes.characterSize,
                  transform: isDragging
                    ? []
                    : [{ translateY: bounceTransform }],
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
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: "100%",
    height: "100%",
  },
  backdrop: {
    position: "absolute",
    width: Dimensions.get("window").width * 5,
    height: Dimensions.get("window").height * 5,
    left: Dimensions.get("window").width * -2,
    top: Dimensions.get("window").height * -2,
    backgroundColor: "black",
    zIndex: 5,
  },
  draggableContainer: {
    position: "absolute",
    zIndex: 999,
    flexDirection: "column",
    alignItems: "center",
    right: 10,
    bottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bubbleContainer: {
    position: "absolute",
    bottom: 50,
    right: 120,
    flexDirection: "row",
    alignItems: "center",
    maxWidth: "100%",
    zIndex: 15,
    marginBottom: 10,
  },
  thoughtBubble: {
    backgroundColor: "#87CEFA",
    borderRadius: 20,
    borderTopRightRadius: 4,
    marginRight: 0,
    position: "relative",
    width: wp(50),
    height: hp(20),
    right: 54,
  },
  thoughtText: {
    color: "#000",
    fontWeight: "500",
    lineHeight: 26,
  },
  bubbleDots: {
    flexDirection: "row",
    justifyContent: "center",
    width: 40,
    position: "absolute",
    right: -40,
    bottom: 25,
  },
  dot1: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#87CEFA",
    position: "relative",
    right: 12,
    top: 5,
  },
  dot2: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: "#87CEFA",
    position: "relative",
    right: 12,
    top: 15,
  },
  dot3: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#87CEFA",
    position: "relative",
    right: 10,
    top: 23,
  },
  dot4: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#87CEFA",
    position: "relative",
    right: 7,
    top: 30,
  },
  characterContainer: {
    zIndex: 15,
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
    zIndex: 20,
  },
  closeButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonContainer: {
    alignSelf: "center",
    marginBottom: 10,
    zIndex: 15,
    position: "absolute",
    top: -20,
  },
  voiceButton: {
    backgroundColor: "rgba(66, 133, 244, 0.9)",
    paddingVertical: 5,
    paddingHorizontal: 10,
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

export default FinnVoiceIntro;
