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

