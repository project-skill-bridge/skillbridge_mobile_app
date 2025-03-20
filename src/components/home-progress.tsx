import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import { hp, wp } from "../utils/common";
import CircularProgress from "./ui/circular-progress";
import { theme } from "../constants/Theme";

const HomeProgress = () => {
  // Assuming you have 5 levels in total
  const totalLevels = 5;

  // Track the number of completed levels (this could come from your game logic or props)
  const completedLevels = 2; // Change this dynamically based on game progress

  // Calculate percentage based on completed levels
  const progressPercentage = (completedLevels / totalLevels) * 100;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Your Progress</Text>
      <CircularProgress
        perecentage={progressPercentage} // Pass the calculated percentage
        color={theme.colors.primary}
        textColor="blue"
        radius={45}
      />
    </View>
  );
};

export default HomeProgress;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: hp(2),
    paddingHorizontal: wp(5),
    backgroundColor: "#F2F2F2",
    borderRadius: wp(3),
  },
  text: {
    fontSize: hp(2),
    fontWeight: "bold",
  },
});
