import React, { useState, useEffect, useRef } from "react";

import { StyleSheet, View, Text, Dimensions, Animated } from "react-native";
import { useFonts } from "expo-font";
import { Image } from "expo-image";
import { Fonts } from "@/src/constants/Fonts";
import { Images } from "@/src/constants/Images";

const { width } = Dimensions.get("window");

const FinnCharacter: React.FC = () => {
  const [message, setMessage] = useState("");
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const bubbleAnim = useRef(new Animated.Value(0)).current;
  const bubbleDotsAnim = useRef(new Animated.Value(0)).current;

  // Load custom font
  const [fontsLoaded] = useFonts({
    Bubblegum: Fonts.Baloo,
  });

  // Time-based message function
  const getTimeBasedMessage = (): string => {
    const hour = new Date().getHours();

    if (hour >= 4 && hour < 11) {
      return "Hi, Good Morning! My name is Finn.";
    } else if (hour >= 11 && hour < 16) {
      return "Hello, Good Afternoon! I'm Finn!";
    } else if (hour >= 16 && hour < 21) {
      return "Good Evening! Finn here to help!";
    } else {
      return "Still awake? I'm Finn, your night buddy!";
    }
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
      // Restart animation randomly between 5-10 seconds
      setTimeout(startBounceAnimation, Math.random() * 5000 + 5000);
    });
  };

    // Initial speech bubble animation
    const startBubbleAnimation = () => {
      // First animate the main bubble
      Animated.timing(bubbleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true
      }).start();
      
      // Then animate the bubble dots with a slight delay
      setTimeout(() => {
        Animated.timing(bubbleDotsAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true
        }).start();
      }, 400);
    };
  
  // Update message based on time and start animation
  useEffect(() => {
    setMessage(getTimeBasedMessage());

    // Update message every minute
    const intervalId = setInterval(() => {
      setMessage(getTimeBasedMessage());
    }, 60000);

    // Start the bounce animation
    startBounceAnimation();

    // Start the bubble animation
    startBubbleAnimation();

    return () => clearInterval(intervalId);
  }, []);

  // Calculate responsive sizes based on screen width
  const getResponsiveSizes = () => {
    const baseWidth = 375;
    const scale = width / baseWidth;

    return {
      containerHeight: Math.min(120 * scale, 180),
      characterSize: Math.min(120 * scale),
      fontSize: Math.min(18 * scale, 24),
      bubblePadding: Math.min(15 * scale, 25),
    };
  };

  const responsiveSizes = getResponsiveSizes();

  // Transform for bounce animation
  const bounceTransform = bounceAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, -8, 0],
  });

  // Bubble animation styles
  const bubbleScale = bubbleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 1]
  });
  
  const bubbleOpacity = bubbleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1]
  });
  
  const dotsOpacity = bubbleDotsAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1]
  });
  
  const dotsTranslate = bubbleDotsAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-10, 0]
  });

  if (!fontsLoaded) {
    return <View style={styles.container} />;
  }

  return (
    <View
      style={[styles.container, { height: responsiveSizes.containerHeight }]}
    >
      {/* Message section aligned to top */}
      <View style={styles.messageSection}>
        {/* Improved thought bubble */}
        <View style={styles.bubbleContainer}>
        <Animated.View style={[
            styles.bubbleWrapper,
            {
              opacity: bubbleOpacity,
              transform: [
                { scale: bubbleScale }
              ]
            }
          ]}>
          <View
            style={[
              styles.thoughtBubble,
              { padding: responsiveSizes.bubblePadding },
            ]}
          >
            <Text
              style={[
                styles.thoughtText,
                { fontSize: responsiveSizes.fontSize, fontFamily: "Bubblegum" },
              ]}
            >
              {message}
            </Text>
          </View>
        </Animated.View>

        <Animated.View style={[
            styles.bubbleDots,
            {
              opacity: dotsOpacity,
              transform: [
                { translateX: dotsTranslate }
              ]
            }
          ]}>
            <View style={styles.dot1}></View>
            <View style={styles.dot2}></View>
            <View style={styles.dot3}></View>
            <View style={styles.dot4}></View>
          </Animated.View>
        </View>
      </View>

      {/* Finn character positioned lower */}
      <View style={styles.characterSection}>
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
            source={Images.normalFinn}
            contentFit="contain"
            style={styles.character}
          />
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    position: "relative",
    top: 7,
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
    // paddingBottom: 5,
  },
  bubbleContainer: {
    flexDirection: "row",
    alignItems: "center",
    maxWidth: "100%",
  },
  bubbleWrapper: {
    // Container for shadow and bubble
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  thoughtBubble: {
    backgroundColor: "#4AA4DE", // More vibrant blue color
    borderRadius: 24,
    // padding: 15,
    // marginRight: 1,
    // Subtle inner shadow for 3D bubble effect
    borderWidth: 1,
    borderColor: "#5CBBFF",
    // For Android elevation
    elevation: 3,
    
  },
  thoughtText: {
    color: "#FFFFFF", // White text for better contrast on blue
    fontWeight: "600",
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  bubbleDots: {
    flexDirection: "column",
    justifyContent: "center",
    height: 40,
  },
  dot1: {
    width: 12,
    height: 12,
    borderRadius: 12,
    backgroundColor: "#4AA4DE",
    position: "relative",
    left: 10,
    marginBottom: 1,
    // Bubble effect with border
    borderWidth: 1.5,
    borderColor: "#5CBBFF",
    elevation: 2,
  },
  dot2: {
    width: 9,
    height: 9,
    borderRadius: 9,
    backgroundColor: "#4AA4DE",
    position: "relative",
    left: 25,
    marginBottom: 1,
    // Bubble effect with border
    borderWidth: 1,
    borderColor: "#5CBBFF",
    elevation: 2,
  },
  dot3: {
    width: 6,
    height: 6,
    borderRadius: 6,
    backgroundColor: "#4AA4DE",
    position: "relative",
    left: 37,
    marginBottom: 1,
    // Bubble effect with border
    borderWidth: 0.8,
    borderColor: "#5CBBFF",
    elevation: 1,
  },
  dot4: {
    width: 4,
    height: 4,
    borderRadius: 4,
    backgroundColor: "#4AA4DE",
    position: "relative",
    left: 46,
    // Bubble effect with border
    borderWidth: 0.5,
    borderColor: "#5CBBFF",
    elevation: 1,
  },
  characterContainer: {
    // Position adjusted in character section
  },
  character: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    left: 15,
  },
});

export default FinnCharacter;
