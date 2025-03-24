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

  /**
   * Animates card scale back to normal when press released
   * Uses spring physics for natural motion feel
   */
  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  /**
   * Display nothing while fonts are loading
   */
  if (!fontsLoaded) {
    return null;
  }

  /**
   * Main component render function
   */
  return (
    <LinearGradient colors={["#6366f1", "#4338ca"]} style={styles.container}>
      <Text style={styles.title}>
        Vocational {"\n"}Training{"\n"}Guide{" "}
      </Text>

      <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
        <TouchableOpacity
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.8}
          onPress={() => router.push("/(games)/voccational-trainning/stiching")}
        >
