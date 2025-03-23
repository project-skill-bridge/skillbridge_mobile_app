import React, { useEffect, useState, useRef, useCallback } from "react";

import {
  Alert,
  Image,
  ImageBackground,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import { useFonts } from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import Button from "@/src/components/ui/button";
import { Images } from "@/src/constants/Images";
import { hp, wp } from "@/src/utils/common";
import { Icons } from "@/src/constants/Icons";
import { theme } from "@/src/constants/Theme";
import { Fonts } from "@/src/constants/Fonts";
import Loader from "@/src/components/ui/loader";
import { SafeAreaView } from "react-native-safe-area-context";
import FinnVoiceIntro from "@/src/components/FinnCharacter/FinnGame";

type ImageKeys = `level${1 | 2 | 3 | 4}Badge`;
const gameIntroText = [
  "Welcome to Tap & Type, the ultimate test of speed and accuracy!",
  "In this game, you'll need to tap the correct letters as fast as possible.",
  "Each level challenges your typing skills with increasing difficulty.",
  "The faster and more accurately you type, the higher your score!",
  "Tap & Type helps improve your typing speed, reflexes, and focus.",
  "Are you ready to put your fingers to the test? Let’s get started!"
];

const INITIAL_HEARTS = 10;

const MainScreen = () => {
  const router = useRouter();

  // Game state
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [score, setScore] = useState<number>(0);
  const [hearts, setHearts] = useState<number>(INITIAL_HEARTS);

  // Modal state
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Settings state
  const [isSoundOn, setIsSoundOn] = useState<boolean>(true);
  const [isMusicOn, setIsMusicOn] = useState<boolean>(true);

  // Cooldown state
  const cooldownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [cooldownTimeLeft, setCooldownTimeLeft] = useState<number>(0);

  // Load settings from AsyncStorage
  useEffect(() => {
    const loadSettingsSound = async () => {
      const sound = await AsyncStorage.getItem("sound");
      const music = await AsyncStorage.getItem("music");

      if (sound !== null) setIsSoundOn(JSON.parse(sound) === true);
      if (music !== null) setIsMusicOn(JSON.parse(music) === true);
    };
    loadSettingsSound();
  }, []);

  const scale = useSharedValue(0.9);

  // Load the custom font
  const [fontsLoaded] = useFonts({
    Coiny: Fonts.Coiny,
  });

  // Animation effect for badge
  useEffect(() => {
    scale.value = withRepeat(
      withTiming(1.1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      -1, // Infinite loop
      true // Reverse animation
    );
  }, []);

  // Animated style for badge
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Check for active cooldown on mount and load game data
  useFocusEffect(
    useCallback(() => {
      const checkCooldown = async () => {
        const storedTime = await AsyncStorage.getItem(
          "tap-and-type-cool-down-time"
        );
        if (storedTime) {
          const cooldownEnd = parseInt(storedTime, 10);
          const now = Date.now();
          if (cooldownEnd > now) {
            const remaining = Math.ceil((cooldownEnd - now) / 1000);
            setCooldownTimeLeft(remaining);
          } else {
            await AsyncStorage.removeItem("tap-and-type-cool-down-time");
            setCooldownTimeLeft(0);
          }
        }
      };
      checkCooldown();

      const loadGameData = async () => {
        try {
          const savedData = await AsyncStorage.getItem("tap-and-type-game");
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
        } catch {
          handleGameError(
            "Error",
            "An error occurred while loading the game data."
          );
        }
      };

      loadGameData();

      if (cooldownTimeLeft === 0 && hearts === 0) {
        handleHeartRefill();
      }
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
            handleHeartRefill();
            AsyncStorage.removeItem("tap-and-type-cool-down-time");
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

  // Navigate to game screen
  const handlePlayNow = async () => {
    if (cooldownTimeLeft !== null && cooldownTimeLeft > 0) {
      setIsModalVisible(true);
      return;
    }
    router.push("/tap-and-type/game-screen");
  };

  // Refill hearts
  const handleHeartRefill = async () => {
    const savedData = JSON.parse(
      (await AsyncStorage.getItem("tap-and-type-game")) as string
    );
    await AsyncStorage.setItem(
      "tap-and-type-game",
      JSON.stringify({ ...savedData, hearts: INITIAL_HEARTS })
    );
    setHearts(INITIAL_HEARTS);
  };

  // Handle sound toggle
  const handleSoundToggle = async () => {
    setIsSoundOn((prev) => !prev);
    await AsyncStorage.setItem("sound", JSON.stringify(!isSoundOn));
  };

  // Handle music toggle
  const handleMusicToggle = async () => {
    setIsMusicOn((prev) => !prev);
    await AsyncStorage.setItem("music", JSON.stringify(!isMusicOn));
  };

  // Handle game error
  const handleGameError = (title: string, message: string) => {
    Alert.alert(title, message, [
      {
        text: "Exit",
        onPress: async () => {
          await ScreenOrientation.unlockAsync();
          router.back();
        },
      },
    ]);
  };

  // Fallback if font is not loaded
  if (!fontsLoaded) {
    return (
      <View style={styles.loader}>
        <Loader size={30} />
      </View>
    );
  }

  return (
    <ImageBackground
      source={Images.tapAndTypeMainScreen}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.topRaw}>
          <Button variant="icon" onPress={() => router.back()}>
            <Icons.ChevronLeft color="black" />
          </Button>
          <Button variant="icon" onPress={() => setIsSettingsOpen(true)}>
            <Icons.Settings color="black" />
          </Button>
        </View>

        <View style={{ flex: 1, justifyContent: "center", gap: hp(2) }}>
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
                {cooldownTimeLeft > 0 ? (
                  <Text style={styles.scoreText}>
                    {`${Math.floor(cooldownTimeLeft / 60)
                      .toString()
                      .padStart(2, "0")}:${(cooldownTimeLeft % 60)
                      .toString()
                      .padStart(2, "0")}`}
                  </Text>
                ) : null}
                {hearts > 0 ? (
                  <Icons.Heart
                    size={40}
                    fill="red"
                    stroke="black"
                    strokeWidth={1}
                  />
                ) : (
                  <Icons.HeartCrack
                    size={40}
                    fill="red"
                    stroke="black"
                    strokeWidth={1}
                  />
                )}

                <Text style={styles.hearts}>{hearts}</Text>
              </View>
            </View>
          </View>

          <Button variant="secondary" showShadow onPress={handlePlayNow}>
            <Text style={theme.buttonTextDefaultStyle}>Play Now</Text>
          </Button>
        </View>

        {cooldownTimeLeft > 0 && isModalVisible && (
          <View style={styles.modelWrapper}>
            <View
              style={styles.overlay}
              onTouchEnd={() => setIsModalVisible(false)}
            />
            <View style={styles.modal}>
              <View style={styles.countdownContainer}>
                <Text style={styles.countdownText}>
                  Please wait{" "}
                  {`${Math.floor(cooldownTimeLeft / 60)
                    .toString()
                    .padStart(2, "0")}:${(cooldownTimeLeft % 60)
                    .toString()
                    .padStart(2, "0")}`}{" "}
                  seconds to play
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

        {isSettingsOpen && (
          <View style={styles.modelWrapper}>
            <View
              style={styles.overlay}
              onTouchEnd={() => setIsSettingsOpen(false)}
            />
            <View style={styles.switchModel}>
              <Text style={styles.settingText}>Settings</Text>
              <View style={styles.switchContainer}>
                <Icons.Volume2 size={30} color={theme.colors.primary} />
                <Text style={styles.switchLabel}>Sound</Text>
                <Switch value={isSoundOn} onValueChange={handleSoundToggle} />
              </View>
              <View style={styles.switchContainer}>
                <Icons.Music size={30} color={theme.colors.primary} />
                <Text style={styles.switchLabel}>Music</Text>
                <Switch value={isMusicOn} onValueChange={handleMusicToggle} />
              </View>
            </View>
          </View>
        )}
        
        
        <View style={styles.finnOverlayContainer}>
          <FinnVoiceIntro
          gameId="Tap-Type"
          buttonText=""  
          IntroText={gameIntroText}  
          displayText={gameIntroText}
          language="en-US"
          speed="normal"
          voiceType="child"
          />
          </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default MainScreen;

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
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
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
  },
  scoreCard: {
    backgroundColor: "#fff2b3",
    alignItems: "center",
    borderRadius: 10,
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
  modelWrapper: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    position: "absolute",
    zIndex: 1,
  },
  switchModel: {
    backgroundColor: "rgb(3, 5, 21)",
    paddingVertical: hp(4),
    paddingHorizontal: wp(10),
    alignItems: "center",
    width: "auto",
    borderRadius: 10,
    zIndex: 2,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.8)",
  },
  settingText: {
    textAlign: "center",
    fontSize: hp(4),
    fontFamily: "Coiny",
    color: "rgba(255, 255, 255, 0.9)",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: hp(1),
    gap: wp(10),
  },
  switchLabel: {
    fontSize: hp(3),
    color: "rgba(255, 255, 255, 0.8)",
    fontFamily: "Coiny",
  },
     finnOverlayContainer: {
    position: "absolute",
    bottom: 360,
    right: 0,
    width: "100%",
    zIndex: 10,
    pointerEvents: "box-none",
  },

});
