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

  // Update message based on time and start animation
  useEffect(() => {
    setMessage(getTimeBasedMessage());

    // Update message every minute
    const intervalId = setInterval(() => {
      setMessage(getTimeBasedMessage());
    }, 60000);

    // Start the bounce animation
    startBounceAnimation();

    return () => clearInterval(intervalId);
  }, []);

  // Calculate responsive sizes based on screen width
  const getResponsiveSizes = () => {
    const baseWidth = 375;
    const scale = width / baseWidth;

    return {
      containerHeight: Math.min(120 * scale, 180),
      characterSize: Math.min(100 * scale, 150),
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
          <View style={styles.bubbleDots}>
            <View style={styles.dot1}></View>
            <View style={styles.dot2}></View>
            <View style={styles.dot3}></View>
            <View style={styles.dot4}></View>
          </View>
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
    paddingHorizontal: 15,
    position: "relative",
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
    paddingBottom: 5,
  },
  bubbleContainer: {
    flexDirection: "row",
    alignItems: "center",
    maxWidth: "95%",
  },
  thoughtBubble: {
    backgroundColor: "#87CEFA",
    borderRadius: 20,
    borderTopLeftRadius: 4,
    marginRight: 5,
  },
  thoughtText: {
    color: "#000",
    fontWeight: "500",
  },
  bubbleDots: {
    flexDirection: "column",
    justifyContent: "center",
    height: 40,
  },
  dot1: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#87CEFA",
    marginBottom: 3,
  },
  dot2: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: "#87CEFA",
    marginBottom: 3,
    marginLeft: 3,
  },
  dot3: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#87CEFA",
    marginBottom: 2,
    marginLeft: 6,
  },
  dot4: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#87CEFA",
    marginLeft: 8,
  },
  characterContainer: {
    // Position adjusted in character section
  },
  character: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
});

export default FinnCharacter;
