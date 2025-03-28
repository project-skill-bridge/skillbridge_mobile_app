/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
} from "react-native";
import { Image } from "expo-image";
const { width, height } = Dimensions.get("window");
import TypeWriter from "react-native-typewriter";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import * as Speech from "expo-speech";

/**
 * Responsive scaling functions for consistent sizing across devices
 */
const scaleWidth = width / 375;
const scaleHeight = height / 812;
const scaledSize = (size: number) =>
  Math.ceil(size * Math.min(scaleWidth, scaleHeight));

/**
 * Props interface for the step data structure
 */
export interface StepsProps {
  steps: { text: string; image: any; description: string; voiceNote: string }[];
}

/**
 * AnimatedContent component
 * Displays a step-by-step vocational training guide with animations and voice narration
 *
 * @param {StepsProps} props - Contains the steps array with text, images, descriptions
 * @returns {JSX.Element} Rendered component
 */
const AnimatedContent = ({ steps }: StepsProps) => {
  const router = useRouter();
  const [stepNo, setStepNo] = useState(0);
  const [speaking, setSpeaking] = useState(false);
  const scale = useSharedValue(1);
  const navigationInProgress = useRef(false);

  /**
   * Creates animated style for the image scaling effect
   */
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  /**
   * Handle text-to-speech when step changes
   * Starts speech for current step and stops previous speech
   */
  useEffect(() => {
    // Stop any current speech before starting new one
    Speech.stop();
    setSpeaking(false);

    // Start new speech with current step's voiceNote
    if (steps[stepNo]?.voiceNote) {
      Speech.speak(steps[stepNo].voiceNote, {
        language: "en",
        pitch: 1.1,
        rate: 0.85,
        onStart: () => setSpeaking(true),
        onDone: () => setSpeaking(false),
        onStopped: () => setSpeaking(false),
      });
    }

    // Clean up on unmount or when step changes
    return () => {
      Speech.stop();
    };
  }, [stepNo]);

  /**
   * Ensure speech is stopped when component unmounts
   */
  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  /**
   * Handles progression to next step or completion of the guide
   * Applies a spring animation to the image when moving to next step
   * Ensures speech is stopped before navigating away
   */
  const nextStep = async () => {
    // Prevent multiple rapid clicks
    if (navigationInProgress.current) return;

    if (stepNo < steps.length - 1) {
      setStepNo(stepNo + 1);
      scale.value = withSpring(1.1, { damping: 5, stiffness: 100 }, () => {
        scale.value = withSpring(1);
      });
    } else {
      // Set navigation flag to prevent multiple clicks
      navigationInProgress.current = true;

      // Stop speech before navigating
      await Speech.stop();
      setSpeaking(false);

      // Navigate after ensuring speech is stopped
      router.push("/(tabs)/home");
    }
  };

  /**
   * Toggle speech playback
   * Starts or stops voice narration
   */
  const toggleSpeech = async () => {
    const isSpeaking = await Speech.isSpeakingAsync();
    if (isSpeaking) {
      Speech.stop();
      setSpeaking(false);
    } else {
      Speech.speak(steps[stepNo]?.voiceNote || "", {
        language: "en",
        pitch: 1.0,
        rate: 0.9,
        onStart: () => setSpeaking(true),
        onDone: () => setSpeaking(false),
        onStopped: () => setSpeaking(false),
      });
    }
  };

  /**
   * Calculate the max description length for proper layout
   */
  // const maxDescriptionLength = Math.max(
  //   ...steps.map((step) => (step.description ? step.description.length : 0))
  // );

  return (
    <LinearGradient colors={["#f8f9fa", "#e9ecef"]} style={styles.container}>
      {/* Header Section - Fixed Height */}
      <LinearGradient colors={["#6366f1", "#4338ca"]} style={styles.header}>
        <Text style={styles.headerTitle}>Stitching Master Class</Text>
        <View style={styles.stepIndicator}>
          <Text style={styles.stepCount}>
            STEP {stepNo + 1}/{steps.length}
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${((stepNo + 1) / steps.length) * 100}%` },
              ]}
            />
          </View>
        </View>
      </LinearGradient>

      {/* Main Content - Fixed Layout */}
      <View style={styles.mainContent}>
        <Animated.View style={[styles.imageContainer, animatedStyle]}>
          <Image
            source={steps[stepNo]?.image}
            style={styles.image}
            contentFit="contain"
          />
        </Animated.View>

        {/* Fixed height text container */}
        <View style={styles.textContainer}>
          <ScrollView
            contentContainerStyle={styles.textWrapper}
            showsVerticalScrollIndicator={false}
          >
            <TypeWriter
              style={styles.stepText}
              typing={1}
              minDelay={20}
              maxDelay={30}
              fixed={true}
            >
              {steps[stepNo]?.description || ""}
            </TypeWriter>
          </ScrollView>
        </View>

        {/* Button Group */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.button}
            onPress={nextStep}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={["#6366f1", "#4338ca"]}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>
                {stepNo < steps.length - 1 ? "Next Step →" : "Finish Training"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.voiceButton} onPress={toggleSpeech}>
            <Text style={styles.voiceButtonText}>
              {speaking ? "Stop Voice" : "Play Voice"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

/**
 * Component styles
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    height: height * 0.22,
    paddingTop: height * 0.06,
    paddingBottom: height * 0.02,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  headerTitle: {
    fontSize: scaledSize(24),
    fontWeight: "800",
    color: "white",
    textAlign: "center",
    marginBottom: 15,
    textShadowColor: "rgba(0,0,0,0.1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  stepIndicator: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    padding: 15,
    marginHorizontal: width * 0.1,
  },
  stepCount: {
    color: "white",
    fontSize: scaledSize(14),
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  progressBar: {
    height: 6,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: 3,
  },
  mainContent: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.03,
    paddingBottom: height * 0.02,
  },
  imageContainer: {
    width: width * 0.8,
    height: height * 0.3,
    alignSelf: "center",
    borderRadius: 20,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
    overflow: "hidden",
    marginBottom: height * 0.02,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  textContainer: {
    height: height * 0.22,
    minHeight: 150,
    padding: 15,
    backgroundColor: "white",
    borderRadius: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    justifyContent: "center",
  },
  textWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    maxWidth: width * 0.9,
  },
  stepText: {
    fontSize: scaledSize(16),
    lineHeight: scaledSize(24),
    color: "#495057",
    textAlign: "center",
    fontWeight: "500",
    width: "100%",
  },
  button: {
    height: height * 0.07,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    marginBottom: height * 0.015,
  },
  buttonGroup: {
    width: width * 0.7,
    alignSelf: "center",
    marginTop: height * 0.02,
  },
  buttonGradient: {
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: scaledSize(16),
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  voiceContainer: {
    height: height * 0.12,
    width: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "white",
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  voiceButton: {
    height: height * 0.06,
    backgroundColor: "#6366f1",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  voiceButtonText: {
    color: "white",
    fontSize: scaledSize(14),
    fontWeight: "600",
  },
});

export default AnimatedContent;
