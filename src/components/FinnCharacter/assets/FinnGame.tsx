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

    

export default FinnVoiceIntro;
