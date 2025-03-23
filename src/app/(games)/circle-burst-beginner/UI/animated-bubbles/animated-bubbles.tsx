/**
 * =========================================================================
 * Animated Bubbles Component
 * =========================================================================
 *
 * This component creates a visually appealing background of animated bubbles
 * that float upward with varying sizes, opacities, and speeds. The bubbles
 * create a playful, dynamic atmosphere appropriate for the CircloBrust game.
 *
 * Features:
 * - Customizable number of bubbles
 * - Random sizing and positioning
 * - Smooth animations with opacity transitions
 * - Continuous looping animation
 * - Performance-optimized with useNativeDriver
 *
 * @lastUpdated March 21, 2025
 * =========================================================================
 */

/* ================ REACT CORE IMPORTS ================ */
// Core React library for component creation, hooks, and state management
import React from "react";

/* ================ REACT NATIVE IMPORTS ================ */
// Essential UI components, animation system, and styling utilities
import { Animated, Easing, Dimensions, StyleSheet, View } from "react-native";

/* ================ CONSTANTS ================ */
// Get device screen dimensions for responsive layout calculations
const { width, height } = Dimensions.get("window");

/* ================ COMPONENT INTERFACES ================ */
/**
 * Props interface for individual bubble components
 *
 * @property {number} size - Diameter of the bubble in pixels
 * @property {number} delay - Milliseconds to wait before starting animation
 * @property {number} duration - Total animation duration in milliseconds
 * @property {number} startPosition - Initial horizontal (x) position
 */
interface AnimatedBubbleProps {
  size: number;
  delay: number;
  duration: number;
  startPosition: number;
}

/**
 * Props interface for the main AnimatedBubbles component
 *
 * @property {number} [numberOfBubbles=15] - Optional prop to control bubble count
 */
interface AnimatedBubblesProps {
  numberOfBubbles?: number;
}

/* ================ INDIVIDUAL BUBBLE COMPONENT ================ */
/**
 * Single animated bubble component
 *
 * Creates and manages one floating bubble with its own animation sequence.
 * Each bubble moves from bottom to top with changing opacity and scale.
 *
 * @param {AnimatedBubbleProps} props - Configuration props for this bubble
 * @returns {JSX.Element} Animated bubble view
 */
