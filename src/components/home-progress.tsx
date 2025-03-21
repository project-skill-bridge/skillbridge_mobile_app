import * as React from "react";

import { StyleSheet, Text, View } from "react-native";
import LottieView from "lottie-react-native";
import { Link } from "expo-router";

import { hp, wp } from "../utils/common";
import { theme } from "../constants/Theme";
import CircularProgress from "./ui/circular-progress";
import { Lotties } from "../constants/Lottie";

const HomeProgress = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Your Progress</Text>
      <View style={styles.wrapper}>
        {/* Streak */}
        <Link href="/streak" style={{ flex: 1 }}>
          <View style={styles.flameContainer}>
            <LottieView
              loop
              autoPlay
              style={styles.flame}
              resizeMode="cover"
              source={Lotties.streakFlame}
            />
            <Text style={styles.streak}>3</Text>
          </View>
        </Link>

        <CircularProgress
          perecentage={25}
          color={theme.colors.primary}
          textColor="black"
          radius={45}
        />
      </View>
    </View>
  );
};

export default HomeProgress;

const styles = StyleSheet.create({
  container: {
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(4),
    backgroundColor: "#F2F2F2",
    borderRadius: wp(3),
    gap: hp(1),
  },
  wrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  text: {
    fontSize: hp(2),
    fontWeight: "bold",
  },
  flameContainer: {
    position: "relative",
    width: "50%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: wp(4),
    height: hp(8),
    backgroundColor: "#ebebed",
    borderRadius: wp(3),
  },
  flame: {
    width: "20%",
    height: "100%",
  },
  streak: {
    alignSelf: "flex-end",
    fontSize: hp(4),
    fontWeight: "bold",
    color: theme.colors.primary,
    bottom: "10%",
  },
});
