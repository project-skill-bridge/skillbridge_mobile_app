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

const FinnVoiceIntro = () => {
  return (
    <View>
      <Text>Hello! I am Finn, your learning buddy.</Text>
    </View>
  );
};

export default FinnVoiceIntro;
