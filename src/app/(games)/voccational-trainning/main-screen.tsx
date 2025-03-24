import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  useFonts,
  BungeeInline_400Regular,
} from "@expo-google-fonts/bungee-inline";
import { useRouter } from "expo-router";
const { width, height } = Dimensions.get("window");
const scaleWidth = width / 375;
const scaleHeight = height / 812;
import { BlurView } from "expo-blur";

const scaledSize = (baseSize: number) => {
  const ratio = Math.min(scaleWidth, scaleHeight);
  return Math.round(baseSize * ratio * 0.95 + baseSize * 0.2);
};

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
      {/* New Header Section */}
      <LinearGradient
        colors={["rgba(255,255,255,0.15)", "transparent"]}
        style={styles.header}
      >
        <Text style={styles.windowTitle}>Stitching Training</Text>
        <View style={styles.headerDecorations}>
          <View style={styles.headerDot} />
          <View style={styles.headerDot} />
          <View style={styles.headerDot} />
        </View>
      </LinearGradient>

      <Text style={styles.title}>
        Vocational {"\n"}Training{"\n"}Guide{" "}
      </Text>

      <Animated.View
        style={[styles.cardContainer, { transform: [{ scale: scaleValue }] }]}
      >
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
            {/* Gradient Border Container */}
            <LinearGradient
              colors={["rgba(255,255,255,0.3)", "transparent"]}
              style={styles.cardBorder}
            >
              <Text style={styles.cardIcon}>🧵</Text>
              <Text style={styles.cardText}>Stitching Master</Text>
              <BlurView intensity={20} style={styles.button}>
                <Text style={styles.cardSubText}>Start Training →</Text>
              </BlurView>
              <View style={styles.stitchDecorations}>
                <View style={[styles.stitchLine, { top: 15, left: 20 }]} />
                <View style={[styles.stitchLine, { bottom: 15, right: 20 }]} />
              </View>
            </LinearGradient>
            <View style={styles.cardDecoration1} />
            <View style={styles.cardDecoration2} />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      {/* Step Progress Indicator */}
      <View style={styles.stepContainer}>
        {[1, 2, 3].map((_, index) => (
          <View
            key={index}
            style={[styles.stepDot, index === 0 && styles.activeStepDot]}
          />
        ))}
      </View>
    </LinearGradient>
  );
}

/**
 * Component styles
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: height * 0.05,
  },
  header: {
    position: "absolute",
    top: 0,
    width: "100%",
    paddingTop: height * 0.06,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  windowTitle: {
    fontFamily: "BungeeInline_400Regular",
    fontSize: scaledSize(20),
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
    letterSpacing: 1,
  },
  headerDecorations: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginTop: 10,
  },
  headerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  title: {
    fontFamily: "BungeeInline_400Regular",
    fontSize: scaledSize(32),
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
    marginTop: height * 0.15,
    textAlign: "center",
    lineHeight: scaledSize(40),
    maxWidth: width * 0.9,
    letterSpacing: 1.5,
  },
  cardContainer: {
    width: width * 0.9,
    maxWidth: 400,
    aspectRatio: 1.5,
    marginBottom: height * 0.05,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 15,
  },
  gameCard: {
    width: "100%",
    height: "100%",
    borderRadius: scaledSize(25),
    overflow: "hidden",
  },
  cardBorder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: scaledSize(20),
  },
  cardText: {
    fontFamily: "BungeeInline_400Regular",
    fontSize: scaledSize(24),
    color: "white",
    marginVertical: height * 0.01,
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  cardSubText: {
    color: "white",
    fontSize: scaledSize(16),
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  button: {
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 20,
    overflow: "hidden",
    marginTop: 15,
  },
  cardIcon: {
    fontSize: scaledSize(50),
    marginBottom: height * 0.01,
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  cardDecoration1: {
    position: "absolute",
    width: width * 0.25,
    height: width * 0.25,
    borderRadius: width * 0.125,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    top: -width * 0.08,
    left: -width * 0.08,
  },
  cardDecoration2: {
    position: "absolute",
    width: width * 0.2,
    height: width * 0.2,
    borderRadius: width * 0.1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    bottom: -width * 0.06,
    right: -width * 0.06,
  },
  stitchDecorations: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  stitchLine: {
    position: "absolute",
    width: 40,
    height: 2,
    backgroundColor: "rgba(255,255,255,0.3)",
    transform: [{ rotate: "-45deg" }],
  },
  stepContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  activeStepDot: {
    backgroundColor: "#fff",
    transform: [{ scale: 1.2 }],
  },
});
