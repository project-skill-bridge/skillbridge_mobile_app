import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Image, 
  Text,
  Dimensions,
  Animated
} from 'react-native';
import { useFonts } from 'expo-font';
import { Image } from "expo-image";

const { width } = Dimensions.get('window');

const ElementsSection: React.FC = () => {
  const [message, setMessage] = useState("");
  const bounceAnim = useRef(new Animated.Value(0)).current;


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
        useNativeDriver: true
      }),
      Animated.timing(bounceAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      })
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
        containerHeight: Math.min(120 * scale, 180), // Cap at 180
        characterSize: Math.min(100 * scale, 150),   // Cap at 150
        fontSize: Math.min(18 * scale, 24),          // Cap at 24
        bubblePadding: Math.min(15 * scale, 25)      // Cap at 25
      };
    };
    
    const responsiveSizes = getResponsiveSizes();


export default ElementsSection;