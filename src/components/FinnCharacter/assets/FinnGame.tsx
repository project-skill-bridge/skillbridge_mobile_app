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

export default FinnVoiceIntro;
