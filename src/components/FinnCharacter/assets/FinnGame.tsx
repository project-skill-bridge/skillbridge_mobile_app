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

export default FinnVoiceIntro;
