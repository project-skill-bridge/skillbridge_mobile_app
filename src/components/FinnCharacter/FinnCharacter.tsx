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

export default ElementsSection;