import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';

const BufferingProgress = () => {
    const spinValue = useRef(new Animated.Value(0)).current;
    const dotCount = 3; 
    const dotAnimations = useRef(Array.from({ length: dotCount }, () => ({
      scale: new Animated.Value(1),
      opacity: new Animated.Value(1),
    }))).current;
  
};

export default BufferingProgress;