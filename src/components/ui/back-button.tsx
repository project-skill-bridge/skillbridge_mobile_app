import * as React from "react";

import { Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";

import { theme } from "@/src/constants/Theme";
import { hp } from "@/src/utils/common";
import Icon from "@/src/constants/Icons";
import { BackButtonProps } from "@/src/types/type";

const setPosition = (position: string) => {
  switch (position) {
    case "left":
      return "flex-start";
    case "center":
      return "center";
    case "right":
      return "flex-end";
    default:
      return "flex-start";
  }
};

const BackButton = ({ position = "left", onPress }: BackButtonProps) => {
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.back();
    }
  };
  return (
    <Pressable
      onPress={handlePress}
      style={[styles.button, { alignSelf: setPosition(position) }]}
    >
      <Icon name="left-arrow" />
    </Pressable>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    paddingHorizontal: hp(1.8),
    paddingVertical: hp(1),
    justifyContent: "center",
    width: "auto",
    borderRadius: "50%",
    backgroundColor: theme.colors.secondary,
  },
});
