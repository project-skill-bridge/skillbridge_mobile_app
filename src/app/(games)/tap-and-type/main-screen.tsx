import React, { useEffect, useState, useRef, useCallback } from "react";
import { Image, ImageBackground, StyleSheet, Text, View } from "react-native";
import Button from "@/src/components/ui/button";
import { Images } from "@/src/constants/Images";

import { hp, wp } from "@/src/utils/common";
import { useFocusEffect, useRouter } from "expo-router";
import { useFonts } from "expo-font";
import { Icons } from "@/src/constants/Icons";
import { Loader } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { theme } from "@/src/constants/Theme";
import { Fonts } from "@/src/constants/Fonts";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

type ImageKeys = `level${1 | 2 | 3 | 4}Badge`;

const MainScreen = () => {
  const router = useRouter();
  const [cooldownTimeLeft, setCooldownTimeLeft] = useState<number | null>(null);
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [score, setScore] = useState<number>(0);
  const [hearts, setHearts] = useState<number>(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const cooldownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const scale = useSharedValue(0.9);

  // Load the custom font
  const [fontsLoaded] = useFonts({
    Coiny: Fonts.Coiny,
  });

  const backButtonHandler = () => {
    router.back();
  };

  const handlePlayNow = async () => {
    if (cooldownTimeLeft !== null && cooldownTimeLeft > 0) {
      setIsModalVisible(true);
      return;
    }
    router.push("/tap-and-type/game-screen");
  };

  React.useEffect(() => {
    scale.value = withRepeat(
      withTiming(1.1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      -1, // Infinite loop
      true // Reverse animation
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Check for active cooldown on mount

  useFocusEffect(
    useCallback(() => {
      const checkCooldown = async () => {
        const storedTime = await AsyncStorage.getItem("cooldownEndTime");
        if (storedTime) {
          const cooldownEnd = parseInt(storedTime, 10);
          const now = Date.now();
          if (cooldownEnd > now) {
            const remaining = Math.ceil((cooldownEnd - now) / 1000);
            setCooldownTimeLeft(remaining);
          } else {
            await AsyncStorage.removeItem("cooldownEndTime");
            setCooldownTimeLeft(null);
          }
        }
      };
      checkCooldown();

      const loadGameData = async () => {
        try {
          const savedData = await AsyncStorage.getItem("gameData");
          if (savedData) {
            const {
              currentLevel: savedLevel,
              score: savedScore,
              hearts: savedHearts,
            } = JSON.parse(savedData);

            setHearts(savedHearts);
            setCurrentLevel(savedLevel);
            setScore(savedScore);
          }
        } catch (error) {
          console.error("Error loading game data:", error);
        }
      };

      loadGameData();
    }, [])
  );

  // Countdown timer effect for main screen
  useEffect(() => {
    if (cooldownTimeLeft !== null && cooldownTimeLeft > 0) {
      cooldownIntervalRef.current = setInterval(() => {
        setCooldownTimeLeft((prev) => {
          if (prev && prev > 1) return prev - 1;
          else {
            if (cooldownIntervalRef.current)
              clearInterval(cooldownIntervalRef.current);
            AsyncStorage.removeItem("cooldownEndTime");
            return 0;
          }
        });
      }, 1000);
    }
    return () => {
      if (cooldownIntervalRef.current)
        clearInterval(cooldownIntervalRef.current);
    };
  }, [cooldownTimeLeft]);

  if (!fontsLoaded) {
    return <Loader />;
  }

  return (
    <ImageBackground
      source={Images.tapAndTypeMainScreen}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <View style={styles.topRaw}>
          <Button variant="icon" onPress={backButtonHandler}>
            <Icons.ChevronLeft color="black" />
          </Button>
          <Button variant="icon">
            <Icons.Settings color="black" />
          </Button>
        </View>

        <Text style={styles.headingText}>Tap & Type</Text>

        <Animated.View style={[styles.badgeContainer, animatedStyle]}>
          <Image
            source={Images[`level${currentLevel}Badge` as ImageKeys]}
            style={styles.badge}
            resizeMode="contain"
          />
        </Animated.View>

        <View style={styles.border}>
          <View style={styles.scoreCard}>
            <Text style={styles.header}>Congratulation !</Text>
            <Text style={styles.level}>{`Level ${currentLevel}`}</Text>
            <View style={styles.starContainer}>
              {[...Array(3)].map((_, index) => (
                <Icons.Star
                  style={[
                    styles.star,
                    index === 0 && { left: 0, bottom: 0 },
                    index === 1 && { top: -10, right: "34%" },
                    index === 2 && { right: 0, bottom: 0 },
                  ]}
                  key={index}
                  size={50}
                  fill="#FFD700"
                  stroke="#b87d2d"
                  strokeWidth={1}
                />
              ))}
            </View>
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreText}>YOUR SCORE:</Text>
              <Text style={styles.score}>{score}</Text>
            </View>
            <View style={styles.heartsContainer}>
              <Icons.Heart
                size={40}
                fill="red"
                stroke="black"
                strokeWidth={1}
              />
              <Text style={styles.hearts}>{hearts}</Text>
            </View>
          </View>
        </View>

        {cooldownTimeLeft !== null &&
          cooldownTimeLeft > 0 &&
          isModalVisible && (
            <View style={styles.overlayContainer}>
              <View style={styles.modal}>
                <View style={styles.countdownContainer}>
                  <Text style={styles.countdownText}>
                    Please wait {cooldownTimeLeft} Minute to play
                  </Text>
                  <Button
                    variant="secondary"
                    style={styles.button}
                    onPress={() => setIsModalVisible(false)}
                  >
                    <Text style={styles.modelText}>OK</Text>
                  </Button>
                </View>
              </View>
            </View>
          )}

        <Button variant="secondary" showShadow onPress={handlePlayNow}>
          <Text style={theme.buttonTextDefaultStyle}>Play Now</Text>
        </Button>
      </View>
    </ImageBackground>
  );
};

export default MainScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    paddingHorizontal: wp(6),
    paddingVertical: hp(4),
  },
  topRaw: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headingText: {
    fontFamily: "Coiny",
    fontSize: hp(7.5),
    color: "#0c264f",
    textAlign: "center",
  },
  overlayContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp(5),
    zIndex: 2,
  },
  modal: {
    backgroundColor: "#a15e34",
    padding: 10,
    borderRadius: 15,
    alignItems: "center",
  },
  countdownContainer: {
    padding: 20,
    borderRadius: 10,
    gap: 20,
    backgroundColor: "#efca89",
  },
  countdownText: {
    fontSize: hp(2.5),
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#fbb329",
    padding: 10,
    alignItems: "center",
    width: "auto",
    borderRadius: 10,
  },
  modelText: {
    textAlign: "center",
    fontSize: hp(2),
    fontWeight: "900",
  },
  badgeContainer: {
    height: hp(20),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: hp(1),
  },
  badge: {
    width: wp(35),
    height: "100%",
  },
  border: {
    borderColor: "#a2622f",
    borderWidth: 10,
    borderRadius: 15,
    backgroundColor: "#a2622f",
    marginBottom: hp(3),
  },
  scoreCard: {
    backgroundColor: "#fff2b3",
    alignItems: "center",
    borderRadius: 10,
  },
  header: {
    fontFamily: "Coiny",
    fontSize: hp(3.5),
    color: "white",
    backgroundColor: theme.colors.secondary,
    paddingHorizontal: wp(5),
    paddingVertical: hp(1),
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginTop: hp(1),
  },
  starContainer: {
    position: "relative",
    flexDirection: "row",
    width: "50%",
    height: 50,
  },
  star: {
    position: "absolute",
  },
  level: {
    fontFamily: "Coiny",
    fontSize: hp(5),
    color: "#a15e34",
  },
  scoreContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  scoreText: {
    fontFamily: "Coiny",
    fontSize: hp(2.5),
    color: "#9a5f31",
  },
  score: {
    fontFamily: "Coiny",
    fontSize: 30,
    color: "#9a5f31",
  },
  heartsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  hearts: {
    fontFamily: "Coiny",
    fontSize: hp(3.5),
    color: "red",
  },
});
