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
          <LinearGradient
            colors={["#f472b6", "#db2777"]}
            style={styles.gameCard}
          >
            <Text style={styles.cardIcon}>🧵</Text>
            <Text style={styles.cardText}>Stitching Master</Text>
            <Text style={styles.cardSubText}>Start Training →</Text>
            <View style={styles.cardDecoration1} />
            <View style={styles.cardDecoration2} />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
}

/**
 * Component styles
 */
const styles = StyleSheet.create({
  /**
   * Main container with gradient background
   */
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 50,
  },

  /**
   * Main title with custom font and text shadow
   */
  title: {
    fontFamily: "BungeeInline_400Regular",
    fontSize: 32,
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
    marginTop: 40,
    textAlign: "center",
  },

  /**
   * Game card with gradient background and elevation
   */
  gameCard: {
    width: 300,
    height: 200,
    borderRadius: 25,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },

  /**
   * Card title text with custom font
   */
  cardText: {
    fontFamily: "BungeeInline_400Regular",
    fontSize: 24,
    color: "white",
    marginVertical: 10,
  },

  /**
   * Secondary card text with call to action
   */
  cardSubText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  /**
   * Emoji icon displayed on card
   */
  cardIcon: {
    fontSize: 40,
    marginBottom: 10,
  },

  /**
   * Decorative circular element (top-left)
   */
  cardDecoration1: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    top: -20,
    left: -20,
  },

  /**
   * Decorative circular element (bottom-right)
   */
  cardDecoration2: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    bottom: -20,
    right: -20,
  },
});
