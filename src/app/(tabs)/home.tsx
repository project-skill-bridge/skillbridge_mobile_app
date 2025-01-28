import * as React from "react";

import { useUserStore } from "@/src/store/user-store";
import { hp, wp } from "@/src/utils/common";
import { StyleSheet, Text, View } from "react-native";
import HomeProgress from "@/src/components/home-progress";
import GameSliderContainer from "@/src/components/game/game-slider-container";
import AnimatedAvatar from "@/src/components/animated-avatar";

const HomeScreen = () => {
  const { user } = useUserStore();

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Hi {user?.name} 👋</Text>
      <HomeProgress />
      <AnimatedAvatar />
      <GameSliderContainer />
    </View>
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp(6),
    paddingVertical: hp(4),
    gap: hp(2),
    backgroundColor: "#FFF",
    height: "100%",
  },
  welcomeText: {
    fontSize: hp(2.5),
    fontWeight: "bold",
    flex: 1,
    backgroundColor: "#fff",
    // alignItems: "center",
    // justifyContent: "space-between",
    padding: wp(5),
  },
  welcomeText: {
    fontSize: hp(3),
    fontWeight: "bold",
    alignSelf: "flex-start",
  },
});
