import * as React from "react";

import { StyleSheet, Text, View } from "react-native";
import { hp, wp } from "../utils/common";
import CircularProgress from "./ui/circular-progress";
import { theme } from "../constants/Theme";

const HomeProgress = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Your Progress</Text>
      <CircularProgress
        perecentage={25}
        color={theme.colors.primary}
        textColor="black"
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
