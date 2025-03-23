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
const AnimatedBubble: React.FC<AnimatedBubbleProps> = ({
  size,
  delay,
  duration,
  startPosition,
}) => {
  // Animation value references - using useRef to maintain instances across renders
  const bubblePosition = React.useRef(
    // Start position is below screen (y: height + 100) at specified x coordinate
    new Animated.ValueXY({ x: startPosition, y: height + 100 })
  ).current;

  // Opacity starts at 0 (invisible)
  const opacity = React.useRef(new Animated.Value(0)).current;

  // Scale starts at 0.3 (30% of final size)
  const scale = React.useRef(new Animated.Value(0.3)).current;

  /**
   * Set up and start the bubble animation sequence
   * Uses useEffect to trigger animation on component mount
   */
  React.useEffect(() => {
    /**
     * Defines and initiates the animation sequence
     * Creates a self-repeating animation loop
     */
    const startAnimation = () => {
      Animated.sequence([
        // Step 1: Wait for the specified delay
        Animated.delay(delay),

        // Step 2: Run these animations in parallel
        Animated.parallel([
          // Position animation - move the bubble upward with slight horizontal variation
          Animated.timing(bubblePosition, {
            toValue: {
              // Add random horizontal drift of ±50px
              x: startPosition + (Math.random() * 100 - 50),
              // Move to above the screen
              y: -100,
            },
            duration: duration,
            easing: Easing.linear, // Constant speed
            useNativeDriver: true, // Hardware acceleration
          }),

          // Opacity animation - fade in then out
          Animated.sequence([
            // Fade in during first 20% of the animation
            Animated.timing(opacity, {
              toValue: 0.7, // Semi-transparent
              duration: duration * 0.2,
              useNativeDriver: true,
            }),
            // Fade out during remaining 80% of animation
            Animated.timing(opacity, {
              toValue: 0,
              duration: duration * 0.8,
              useNativeDriver: true,
            }),
          ]),

          // Scale animation - grow from 30% to 100% size
          Animated.timing(scale, {
            toValue: 1, // Full size
            duration: duration,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        // Animation completion callback - reset and restart

        // Reset position to starting point
        bubblePosition.setValue({ x: startPosition, y: height + 100 });
        // Reset opacity to invisible
        opacity.setValue(0);
        // Reset scale to initial small size
        scale.setValue(0.3);
        // Restart the animation loop
        startAnimation();
      });
    };

    // Start the initial animation
    startAnimation();

    // No cleanup needed - animation stops when component unmounts
  }, [delay, duration, startPosition, bubblePosition, opacity, scale]);

  return (
    <Animated.View
      style={[
        styles.bubble, // Base bubble style
        {
          // Dynamic styles based on props and animation values
          width: size,
          height: size,
          borderRadius: size / 2, // Make perfectly circular
          transform: [
            // Apply position and scale transformations
            { translateX: bubblePosition.x },
            { translateY: bubblePosition.y },
            { scale: scale },
          ],
          opacity: opacity, // Apply opacity animation
        },
      ]}
    />
  );
};

/* ================ STYLES ================ */
/**
 * Base styles for individual bubbles
 */
const styles = StyleSheet.create({
  bubble: {
    position: "absolute", // Allow positioning anywhere within container
    backgroundColor: "#6979c9", // Soft blue color for bubbles
    opacity: 0.5, // Base opacity (further modified by animation)
  },
});

/* ================ MAIN COMPONENT ================ */
/**
 * AnimatedBubbles - Container component that renders multiple bubbles
 *
 * Creates a field of floating bubbles with randomized properties for
 * a dynamic, lively background effect.
 *
 * @param {AnimatedBubblesProps} props - Component configuration
 * @returns {JSX.Element} Container with multiple animated bubbles
 */
const AnimatedBubbles: React.FC<AnimatedBubblesProps> = ({
  numberOfBubbles = 15, // Default to 15 bubbles if not specified
}) => {
  // Generate random horizontal positions for all bubbles
  // Using useMemo to avoid regenerating positions on every render
  const bubblePositions = React.useMemo(
    () =>
      Array.from(
        { length: numberOfBubbles },
        // Random position anywhere along screen width
        () => Math.random() * width
      ),
    [numberOfBubbles] // Regenerate only if bubble count changes
  );

  return (
    <View style={bubblesContainerStyle.bubblesContainer}>
      {/* Map each position to a bubble component with randomized properties */}
      {bubblePositions.map((position, index) => (
        <AnimatedBubble
          key={index}
          size={10 + Math.random() * 50} // Random size between 10-60px
          delay={index * 200} // Stagger start times by 200ms per bubble
          duration={5000 + Math.random() * 5000} // Random duration between 5-10 seconds
          startPosition={position}
        />
      ))}
    </View>
  );
};
