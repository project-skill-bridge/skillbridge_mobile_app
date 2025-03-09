import React,{ useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Image} from 'expo-image';

import { 
    StyleSheet, 
    View, 
    Text,
    Dimensions,
    Animated,
    TouchableOpacity,
    Easing,
  } from 'react-native';
import * as Speech from 'expo-speech';


const { width } = Dimensions.get('window');

interface FinnVoiceIntroProps {
    introText: string;
    onComplete?: () => void;
    language?: string;
    speed?: 'slow' | 'normal' | 'fast';
    voiceType?: 'child' | 'adult' | 'robot';
}

const FinnVoiceIntro: React.FC<FinnVoiceIntroProps> = ({ 
    introText = "Hi, I'm Finn! Welcome to our adventure!",
    onComplete = () => {},
    language = 'en-US',
    speed = 'normal',
    voiceType = 'child',
}) => {
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [isComplete, setIsComplete] = useState<boolean>(false);
    const [isFirstVisit, setIsFirstVisit] = useState<boolean>(true);
    const [isTalking, setIsTalking] = useState<boolean>(false);
    const [showBubble, setShowBubble] = useState<boolean>(true);
    const [showButton, setShowButton] = useState<boolean>(false);
    const bounceAnim = useRef(new Animated.Value(0)).current;
    const buttonAnim = useRef(new Animated.Value(0)).current;

     // Voice settings based on type
  const voiceSettings: Record<string, { pitch: number, rate: number }> = {
    child: { pitch: 1.2, rate: 0.8 },
    adult: { pitch: 1.0, rate: 1.0 },
    robot: { pitch: 0.8, rate: 0.9 }
  };

    // Speed settings
    const speedSettings: Record<string, number> = {
        slow: 1.5,
        normal: 1,
        fast: 0.5
      };
    
    // Format text into multiple lines for display
  const formatTextIntoLines = (text: string, maxLines: number = 6): string => {
    const words = text.split(' ');
    const approxCharsPerLine = Math.ceil(text.length / maxLines) + 10;
    let lines = [];
    let currentLine = '';
    
    for (const word of words) {
      if ((currentLine + word).length <= approxCharsPerLine || currentLine === '') {
        currentLine += (currentLine ? ' ' : '') + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
        
        if (lines.length >= maxLines - 1) {
          break;
        }
      }
    }

    if (currentLine) {
        lines.push(currentLine);
      }

    // If we haven't filled all lines, add remaining words to the last line
    if (lines.length < maxLines) {
        const remainingWords = words.slice(
          words.indexOf(lines[lines.length - 1].split(' ')[0]) + 
          lines[lines.length - 1].split(' ').length
        );
        
        if (remainingWords.length > 0) {
          lines[lines.length - 1] += ' ' + remainingWords.join(' ');
        }
      }
      
      return lines.join('\n');
    };

    const formattedIntroText = formatTextIntoLines(introText);

    // Check if it's the first visit
    const checkFirstVisit = async () => {
      try {
        const hasVisited = await AsyncStorage.getItem('hasVisitedBefore');
        if (hasVisited !== null) {
          setIsFirstVisit(false);
          setShowBubble(false);
        } else {
          await AsyncStorage.setItem('hasVisitedBefore', 'true');
          setShowBubble(true);
        }
      } catch (error) {
        console.error('Error checking first visit:', error);
      }
    };
  
    // Start the animation and voice
  const startIntro = () => {
    setIsPlaying(true);
    setIsTalking(true);
    setShowBubble(true);
    setShowButton(false);

  // Reset animation values
  setIsComplete(false);
    
  const { pitch, rate } = voiceSettings[voiceType];
  const speedMultiplier = speedSettings[speed];
  
      // Start the speech
      Speech.speak(formattedIntroText, {
        language,
        rate: rate * speedMultiplier,
        pitch,
        onDone: () => {
          setIsPlaying(false);
          setIsTalking(false);
          setIsComplete(true);
          if (onComplete) onComplete();
        },
      });
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
        // Only restart animation if not talking
      if (!isTalking) {
        setTimeout(startBounceAnimation, Math.random() * 5000 + 5000);
      }
    });
  };

    // Handle close button press
    const handleClose = () => {
        Speech.stop();
        setShowBubble(false);
        setShowButton(false);
        animateButton(false);
        if (onComplete) onComplete();
      };

    // Button animation
  const animateButton = (show: boolean) => {
    Animated.timing(buttonAnim, {
      toValue: show ? 1 : 0,
      duration: 800,
      easing: Easing.bezier(0.16, 1, 0.3, 1),
      useNativeDriver: true
    }).start();
  };

    // Handle Finn character press
    const handleFinnPress = () => {
        if (!isFirstVisit && !showBubble) {
          // Toggle button state with animation
          const newButtonState = !showButton;
          setShowButton(newButtonState);
          animateButton(newButtonState);
        }
      };


      // Calculate responsive sizes based on screen width
  const getResponsiveSizes = () => {
    const baseWidth = 375;
    const scale = width / baseWidth;
    
    return {
      containerHeight: Math.min(120 * scale, 190),
      characterSize: Math.min(100 * scale, 150),
      fontSize: Math.min(16 * scale, 20),
      bubblePadding: Math.min(15 * scale, 22),
      buttonSize: Math.min(120 * scale, 160)
    };
  };

  const responsiveSizes = getResponsiveSizes();

   // Animation values
   const bounceTransform = bounceAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, -8, 0]
  });

  const buttonTransform = buttonAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [40, -30]
  });

  const buttonScale = buttonAnim.interpolate({
    inputRange: [0, 0.7, 1],
    outputRange: [0.5, 1.1, 1]
  });

  const buttonOpacity = buttonAnim;

  // Effects on component mount
  useEffect(() => {
    checkFirstVisit().then(() => {
      if (isFirstVisit) {
        startIntro();
      }
    });
    
    startBounceAnimation();
    
    return () => {
      Speech.stop();
    };
  }, []);


  return (
    <View style={[styles.container, { height: responsiveSizes.containerHeight }]}>
      {/* Message section */}
      <View style={styles.messageSection}>
        {showBubble && (
          <View style={styles.bubbleContainer}>
            <View style={[
              styles.thoughtBubble, 
              { padding: responsiveSizes.bubblePadding }
            ]}>
              <Text style={[
                styles.thoughtText, 
                { fontSize: responsiveSizes.fontSize }
              ]}>
                {formattedIntroText}
              </Text>
              
              <TouchableOpacity 
                onPress={handleClose}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.bubbleDots}>
              <View style={styles.dot1}></View>
              <View style={styles.dot2}></View>
              <View style={styles.dot3}></View>
              <View style={styles.dot4}></View>
            </View>
          </View>
        )}
      </View>

      {/* Finn character section */}
      <View style={styles.characterSection}>
        {/* Voice Intro Button */}
        <Animated.View 
          style={[
            styles.buttonContainer,
            {
              transform: [
                { translateY: buttonTransform },
                { scale: buttonScale }
              ],
              opacity: buttonOpacity,
              width: responsiveSizes.buttonSize
            }
          ]}
          >
          {showButton && (
            <TouchableOpacity 
              style={styles.voiceButton}
              onPress={startIntro}
            >
              <Text style={styles.voiceButtonText}>Voice Intro</Text>
            </TouchableOpacity>
          )}
        </Animated.View>

                {/* Clickable Finn character */}
                <TouchableOpacity 
          onPress={handleFinnPress}
          activeOpacity={0.8}
        >
          <Animated.View 
            style={[
              styles.characterContainer, 
              { 
                width: responsiveSizes.characterSize, 
                height: responsiveSizes.characterSize,
                transform: [{ translateY: bounceTransform }]
              }
            ]}

            >
            <Image 
              source={isTalking ? require('./assets/Talking-Finn.gif') : require('./assets/Normal-Finn.gif')} 
              contentFit='contain'
              style={styles.character}
            />
          </Animated.View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 15,
      position: 'relative',
    },
    messageSection: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        paddingTop: 10,
      },
    characterSection: {
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        paddingBottom: 5,
        position: 'relative',
      },


export default FinnVoiceIntro;
