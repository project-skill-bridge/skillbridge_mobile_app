import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Image } from "expo-image";
import TypeWriter from "react-native-typewriter";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { useRouter } from "expo-router";

import VoiceIntro from "./VoiceIntro";

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
 * @param {StepsProps} props - Contains the steps array with text, images, and descriptions
 * @returns {JSX.Element} Rendered component
 */
const AnimatedContent = ({ steps }: StepsProps) => {
  const router = useRouter();
  const [stepNo, setStepNo] = useState(0);
  const scale = useSharedValue(1);

  /**
   * Creates animated style for the image scaling effect
   */
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  /**
   * Handles progression to next step or completion of the guide
   * Applies a spring animation to the image when moving to next step
   */
  const nextStep = () => {
    if (stepNo < steps.length - 1) {
      setStepNo(stepNo + 1);
      scale.value = withSpring(1.1, { damping: 5, stiffness: 100 });
    } else {
      router.push("/(tabs)/home");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.mainContent}>
        <Text> Stitching Training </Text>
        <Text style={styles.stepText}>
          Step {stepNo + 1} : {steps[stepNo].text}{" "}
        </Text>

        <Animated.View style={[styles.imageContainer, animatedStyle]}>
          <Image
            source={steps[stepNo].image}
            style={styles.image}
            contentFit="contain"
          />
        </Animated.View>
/**
 * Component styles
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  stepText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  mainContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  voiceContainer: {
    width: "100%",
    padding: 16,
  },
  imageContainer: {
    width: 250,
    height: 250,
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  button: {
    marginTop: 40,
    backgroundColor: "#6200EA",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
  },
  stepDes: {
    fontSize: 14,
    textAlign: "center",
  },
});

export default AnimatedContent;
