import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  useFonts,
  BungeeInline_400Regular,
} from "@expo-google-fonts/bungee-inline";
import { useRouter } from "expo-router";

/**
 * MainScreen Component for Vocational Training Guide
 * Displays a visually appealing interface with animated cards
 * for accessing various vocational training options
 *
 * @returns {JSX.Element} The rendered UI component
 */
export default function MainScreen() {
  const router = useRouter();
  const scaleValue = new Animated.Value(1);

  /**
   * Load custom font for stylized typography
   */
  const [fontsLoaded] = useFonts({
    BungeeInline_400Regular,
  });

  /**
   * Animates card scale down when pressed
   * Creates visual feedback for user interaction
   */
  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

