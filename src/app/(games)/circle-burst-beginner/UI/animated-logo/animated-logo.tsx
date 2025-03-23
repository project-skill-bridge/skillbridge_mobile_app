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
