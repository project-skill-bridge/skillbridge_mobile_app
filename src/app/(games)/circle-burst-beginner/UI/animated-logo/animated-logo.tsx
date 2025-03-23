/**
 * =========================================================================
 * CircloBrust Animated Logo Component
 * =========================================================================
 *
 * This component creates an interactive, animated game logo featuring:
 *  - A pulsing blue circle
 *  - An animated hand that rotates and scales
 *  - A shine effect that sweeps across the banner
 *  - Decorative corner elements
 *  - Dynamic text styling
 *
 * The animations create a playful, engaging visual identity for the game
 * that draws the player's attention and reinforces the "tap and pop"
 * gameplay mechanic through its visual language.
 *
 * @lastUpdated March 21, 2025
 * =========================================================================
 */

/* ================ REACT CORE IMPORTS ================ */
// Core React library and hooks for component management and animation references
import React, { useRef, useEffect } from "react";

/* ================ REACT NATIVE IMPORTS ================ */
// Essential React Native components for UI, animation, styling and layout
import {
  Animated,
  Easing,
  Dimensions,
  StyleSheet,
  Text,
  View,
} from "react-native";

/* ================ SVG IMPORTS ================ */
// SVG rendering components for creating the hand graphic
import Svg, { Path, G } from "react-native-svg";

/* ================ CONSTANTS ================ */
// Get screen width for responsive layout and animation calculations
const { width } = Dimensions.get("window");

/* ================ SVG COMPONENTS ================ */
/**
 * Hand SVG Component
 *
 * Creates a custom SVG graphic representing a hand with two fingers.
 * Uses SVG path elements to draw the complex curved shapes needed
 * for a stylized hand illustration. The hand is designed to appear
 * as if it's touching or interacting with the circle element.
 *
 * @param {Object} props - Component properties
 * @param {string} [props.color="#1d3557"] - Color of the hand SVG
 * @param {Object} [props.style] - Additional styles to apply
 * @param {React.Ref} ref - Forwarded ref for Animated.createAnimatedComponent
 * @returns {JSX.Element} SVG representation of a hand
 */
const HandTouchingSVG = React.forwardRef(
  (
    { color = "#1d3557", style }: { color?: string; style?: object },
    ref: any
  ) => {
    return (
      <Svg width="80" height="80" viewBox="0 0 100 100" style={style}>
        <G transform="translate(50, 30)">
          {/* Finger 1 (thumb) - Curved path creates a thumb shape */}
          <Path
            d="M-20,10 C-25,5 -25,-5 -20,-10 C-15,-15 -5,-15 0,-10 L10,0 C15,5 15,15 10,20 C5,25 -5,25 -10,20 Z"
            fill={color}
            opacity={0.9}
          />
          {/* Finger 2 (index) - Curved path creates an index finger shape */}
          <Path
            d="M10,0 C15,-5 25,-5 30,0 C35,5 35,15 30,20 L20,30 C15,35 5,35 0,30 C-5,25 -5,15 0,10 Z"
            fill={color}
            opacity={0.9}
          />
          {/* Hand palm - Connects the fingers and completes the hand shape */}
          <Path
            d="M-15,15 C-10,20 -5,25 0,30 C5,35 10,40 15,35 C20,30 15,25 10,20 C5,15 0,10 -5,5 C-10,0 -15,5 -15,15 Z"
            fill={color}
            opacity={0.9}
          />
        </G>
      </Svg>
    );
  }
);

// Create an animatable version of the hand SVG component
const AnimatedHand = Animated.createAnimatedComponent(HandTouchingSVG);

/**
 * AnimatedLogo Component
 *
 * Creates an animated logo banner for the CircloBrust game with multiple
 * coordinated animations that create an engaging visual experience.
 *
 * The logo features a red banner with corner decorations, a pulsing
 * blue circle that represents the game's bubble-popping mechanic,
 * an animated hand that simulates the player interaction, and a
 * sweeping shine effect to add visual interest.
 *
 * @returns {JSX.Element} The fully animated logo component
 */
const AnimatedLogo = () => {
  /* ================ ANIMATION VALUES ================ */
  // Animation for the blue circle pulsing effect (scale: 1.0 to 1.2)
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Animation for the hand movement (controls scaling between 0.9 and 1.1)
  const handAnim = useRef(new Animated.Value(0)).current;

  // Animation for hand rotation (0 to 360 degrees)
  const handRotateAnim = useRef(new Animated.Value(0)).current;

  // Animation for the shine effect that sweeps across the banner
  // Starts offscreen to the left (-width) and moves to the right (width)
  const bannerShineAnim = useRef(new Animated.Value(-width)).current;

  /* ================ ANIMATION SETUP ================ */
  /**
   * Sets up and starts all animations when component mounts
   * Creates looping animations for continuous visual interest
   */
  useEffect(() => {
    // Pulse animation for the blue circle - creates a breathing effect
    Animated.loop(
      Animated.sequence([
        // Scale up to 120% over 1 second
        Animated.timing(pulseAnim, {
          toValue: 1.2, // 20% larger
          duration: 1000, // 1 second
          easing: Easing.inOut(Easing.ease), // Smooth acceleration/deceleration
          useNativeDriver: true, // Hardware acceleration
        }),
        // Scale back down to 100% over 1 second
        Animated.timing(pulseAnim, {
          toValue: 1, // Original size
          duration: 1000, // 1 second
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Hand animation - scaling up and down to simulate tapping motion
    Animated.loop(
      Animated.sequence([
        // Scale up over 1.5 seconds
        Animated.timing(handAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        // Scale back down over 1.5 seconds
        Animated.timing(handAnim, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Hand rotation animation - complete 360° rotation
    Animated.loop(
      Animated.timing(handRotateAnim, {
        toValue: 1, // Represents a full rotation (mapped to 360° via interpolation)
        duration: 8000, // 8 seconds for one full rotation
        easing: Easing.linear, // Constant speed rotation
        useNativeDriver: true,
      })
    ).start();

    // Banner shine animation - sweeping highlight effect
    Animated.loop(
      Animated.timing(bannerShineAnim, {
        toValue: width, // Move from left edge (-width) to right edge (width)
        duration: 3000, // 3 seconds for the shine to sweep across
        easing: Easing.ease, // Slight acceleration/deceleration
        useNativeDriver: true,
        delay: 2000, // Wait 2 seconds between shine animations
      })
    ).start();

    // No cleanup needed - animations stop automatically on unmount
  }, []);

  /* ================ ANIMATION INTERPOLATIONS ================ */
  // Convert handAnim (0-1) to a scaling factor (0.9-1.1)
  const handScale = handAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1.1], // 10% smaller to 10% larger
  });

  // Convert handRotateAnim (0-1) to rotation degrees (0-360)
  const handRotate = handRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"], // Full circle rotation
  });

  /* ================ RENDER ================ */
  return (
    <View style={styles.logoContainer}>
      <Animated.View style={styles.logoBox}>
        {/* Shine effect overlay - animated diagonal highlight */}
        <Animated.View
          style={[
            styles.shineEffect,
            { transform: [{ translateX: bannerShineAnim }] }, // Animated horizontal movement
          ]}
        />
        {/* Banner content - hand, circle, and text */}
        <View style={styles.bannerContent}>
          {/* Left side with animated hand and circle */}
          <View style={styles.splatterContainer}>
            {/* Animated hand that rotates and scales */}
            <Animated.View
              style={[
                styles.handContainer,
                {
                  transform: [
                    { rotate: handRotate }, // Continuous rotation
                    { scale: handScale }, // Subtle scaling
                  ],
                },
              ]}
            >
              <AnimatedHand color="#1d3557" />
            </Animated.View>

            {/* Blue circle that pulses */}
            <Animated.View
              style={[
                styles.blueCircle,
                { transform: [{ scale: pulseAnim }] }, // Breathing animation
              ]}
            />
          </View>

          {/* Right side with "CIRCLOBRUST" text */}
          <View style={styles.textContainer}>
            {/* Split into two parts for different styling */}
            <Text style={styles.logoText}>CIRCLO</Text>
            <Text style={[styles.logoText, styles.logoTextBold]}>BRUST</Text>
          </View>
        </View>
        {/* Decorative corner elements - add visual polish */}
        <View style={styles.bannerCorner1} /> {/* Top-left corner */}
        <View style={styles.bannerCorner2} /> {/* Top-right corner */}
        <View style={styles.bannerCorner3} /> {/* Bottom-left corner */}
        <View style={styles.bannerCorner4} /> {/* Bottom-right corner */}
      </Animated.View>
    </View>
  );
};

/* ================ STYLES ================ */
/**
 * Component styles using StyleSheet for optimal performance
 * Organized by visual element for maintainability
 */
const styles = StyleSheet.create({
  /* Container Styles */
  logoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    zIndex: 5, // Ensure logo appears above other elements
    marginTop: -120, // Position adjustment
  },

  /* Main Logo Banner Styles */
  logoBox: {
    width: "100%",
    aspectRatio: 1.6, // Maintain consistent proportions (width:height)
    backgroundColor: "#e63946", // Vibrant red background
    borderRadius: 10, // Rounded corners
    justifyContent: "center",
    alignItems: "center",
    // Shadow effects for depth
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8, // Android shadow
    overflow: "hidden", // Contain shine effect within bounds
    borderWidth: 2, // Add border
    borderColor: "#c1121f", // Darker red border for definition
    position: "relative", // For absolute positioning of children
  },

  /* Shine Effect Styles */
  shineEffect: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: 60, // Width of shine streak
    height: "300%", // Extra height for rotation effect
    backgroundColor: "rgba(255, 255, 255, 0.3)", // Semi-transparent white
    transform: [{ rotate: "45deg" }], // Angled diagonal shine
  },

  /* Content Layout Styles */
  bannerContent: {
    flexDirection: "row", // Arrange elements horizontally
    alignItems: "center", // Center vertically
    justifyContent: "center", // Center horizontally
    width: "100%",
    paddingHorizontal: 20,
  },

  /* Hand and Circle Container Styles */
  splatterContainer: {
    position: "relative", // For positioning child elements
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
  },

  /* Hand Animation Container Styles */
  handContainer: {
    position: "absolute",
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1, // Below circle
  },

  /* Circle Styles */
  blueCircle: {
    position: "absolute",
    width: 40,
    height: 40,
    borderRadius: 20, // Makes it a perfect circle
    backgroundColor: "#1d3557", // Deep blue color
    zIndex: 2, // Above hand
    // Shadow for depth
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },

  /* Text Styles */
  textContainer: {
    flexDirection: "row", // Arrange text parts horizontally
    alignItems: "center",
    marginLeft: 10, // Space from hand/circle
  },
  logoText: {
    color: "#f1faee", // Off-white color
    fontSize: 28, // Large text size
    fontFamily: "Montserrat-SemiBold", // Medium weight font
    textAlign: "center",
    // Text shadow for better readability
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  logoTextBold: {
    fontFamily: "Montserrat-Bold", // Heavier weight for emphasis
    color: "#ffd700", // Gold color for contrast
  },

  /* Corner Decoration Styles */
  // Top-left corner decoration
  bannerCorner1: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 15,
    height: 15,
    backgroundColor: "#c1121f", // Darker red
    borderBottomRightRadius: 15, // Creates quarter-circle shape
  },
  // Top-right corner decoration
  bannerCorner2: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 15,
    height: 15,
    backgroundColor: "#c1121f",
    borderBottomLeftRadius: 15,
  },
  // Bottom-left corner decoration
  bannerCorner3: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: 15,
    height: 15,
    backgroundColor: "#c1121f",
    borderTopRightRadius: 15,
  },
  // Bottom-right corner decoration
