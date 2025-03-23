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

