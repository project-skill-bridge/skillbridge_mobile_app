import React, { useEffect, useState, useCallback } from "react";
import {
  Alert,
  ImageBackground,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { useFonts } from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import LottieView from "lottie-react-native";

import Button from "@/src/components/ui/button";
import { Images } from "@/src/constants/Images";
import { hp, wp } from "@/src/utils/common";
import { Icons } from "@/src/constants/Icons";
import { theme } from "@/src/constants/Theme";
import { Fonts } from "@/src/constants/Fonts";
import Loader from "@/src/components/ui/loader";
import { Lotties } from "@/src/constants/Lottie";

type ImageKeys = `level${1 | 2 | 3 | 4}Badge`;

const MainScreen = () => {
  const router = useRouter();

  // Game state
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [score, setScore] = useState<number>(0);

  // Modal state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Settings state
  const [isSoundOn, setIsSoundOn] = useState<boolean>(true);
  const [isMusicOn, setIsMusicOn] = useState<boolean>(true);

  // Load settings from AsyncStorage
  useEffect(() => {
    (async () => {
      const sound = await AsyncStorage.getItem("sound");
      const music = await AsyncStorage.getItem("music");

      if (sound !== null) setIsSoundOn(JSON.parse(sound) === true);
      if (music !== null) setIsMusicOn(JSON.parse(music) === true);
    })();
  }, []);

  // Load the custom font
  const [fontsLoaded] = useFonts({
    Coiny: Fonts.Coiny,
  });

  // Check for active cooldown on mount and load game data
  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          const savedData = await AsyncStorage.getItem("mind-match-game");
          if (savedData) {
            const { currentLevel: savedLevel, score: savedScore } =
              JSON.parse(savedData);

            setCurrentLevel(savedLevel);
            setScore(savedScore);
          }
        } catch {
          handleGameError(
            "Error",
            "An error occurred while loading the game data."
          );
        }
      })();
    }, [])
  );

  // Navigate to game screen
  const handlePlayNow = async () => {
    router.push("/mind-match/game-screen");
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
      source={Images.mindMatchMainScreen}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        {/* Settings */}
        <View style={styles.topRaw}>
          <Button variant="icon" onPress={() => router.back()}>
            <Icons.ChevronLeft color="black" />
          </Button>
          <Button variant="icon" onPress={() => setIsSettingsOpen(true)}>
            <Icons.Settings color="black" />
          </Button>
        </View>

        {/* Main content */}
        <View>
          {/* Game title */}
          <Text style={styles.headingText}>Mind Match</Text>

          {/* Badge */}
          <View style={styles.badgeContainer}>
            <LottieView
              source={Lotties[`level${currentLevel}Badge` as ImageKeys]}
              autoPlay
              loop
              style={styles.badge}
              resizeMode="cover"
            />
          </View>

          {/* Score card */}
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
            </View>
          </View>

          {/* Play Button */}
          <Button variant="secondary" showShadow onPress={handlePlayNow}>
            <Text style={theme.buttonTextDefaultStyle}>Play Now</Text>
          </Button>
        </View>

        {/* Settings Modal */}
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
  border: {
    borderColor: "#a2622f",
    borderWidth: 10,
    borderRadius: 15,
    backgroundColor: "#a2622f",
    marginBottom: hp(2),
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
  badgeContainer: {
    position: "relative",
    width: "100%",
    height: hp(25),
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    width: "50%",
    height: "100%",
  },
});
