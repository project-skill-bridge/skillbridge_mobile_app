import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';

const BufferingProgress = () => {
    const spinValue = useRef(new Animated.Value(0)).current;
    const dotCount = 3; 
    const dotAnimations = useRef(Array.from({ length: dotCount }, () => ({
      scale: new Animated.Value(1),
      opacity: new Animated.Value(1),
    }))).current;


    useEffect(() => {
        // Rotating animation
        Animated.loop(
          Animated.timing(spinValue, {
            toValue: 1,
            duration: 1500,
            easing: Easing.linear,
            useNativeDriver: true,
          })
        ).start();
    
        // Pulsing dots animation
        dotAnimations.forEach((dot, index) => {
          Animated.loop(
            Animated.sequence([
              Animated.delay(index * 200),
              Animated.parallel([
                Animated.timing(dot.scale, {
                  toValue: 1.5,
                  duration: 500,
                  useNativeDriver: true,
                }),
                Animated.timing(dot.opacity, {
                  toValue: 0.3,
                  duration: 500,
                  useNativeDriver: true,
                }),
              ]),
              Animated.parallel([
                Animated.timing(dot.scale, {
                  toValue: 1,
                  duration: 500,
                  useNativeDriver: true,
                }),
                Animated.timing(dot.opacity, {
                  toValue: 1,
                  duration: 500,
                  useNativeDriver: true,
                }),
              ]),
            ])
          ).start();
        });
      }, []);

      const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
      });

      return (
        <View style={styles.container}>
          {/* Rotating Spinner */}
          <Animated.View style={[styles.spinner, { transform: [{ rotate: spin }] }]}>
            <View style={styles.spinnerInner} />
          </Animated.View>
    
          {/* Pulsing Dots */}
          <View style={styles.dotsContainer}>
            {dotAnimations.map((dot, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.dot,
                  {
                    transform: [{ scale: dot.scale }],
                    opacity: dot.opacity,
                  },
                ]}
              />
            ))}
          </View>
        </View>
      );
    
  
};


const styles = StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    spinner: {
      width: 50,
      height: 50,
      borderRadius: 25,
      borderWidth: 3,
      borderColor: '#e0e0e0',
      borderTopColor: '#2196F3',
      marginBottom: 20,
    },
    dotsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    dot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: '#2196F3',
      marginHorizontal: 5,
    },
    spinnerInner: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export default BufferingProgress;