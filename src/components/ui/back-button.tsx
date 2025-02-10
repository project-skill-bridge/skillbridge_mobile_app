import React from "react";

import { Pressable, StyleProp, StyleSheet } from "react-native";
import { router } from "expo-router";
import { hp } from "@/src/utils/common";
import Icon from "@/src/constants/Icons";
import { ViewStyle } from "react-native/Libraries/StyleSheet/StyleSheetTypes";

interface BackButtonProps {
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

const BackButton = ({ onPress, style }: BackButtonProps) => {
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.back();
    }
  };

  return (
    <Pressable onPress={handlePress} style={[styles.button, style]}>
      <Icon name="left-arrow" />
    </Pressable>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    paddingHorizontal: hp(1.6),
    paddingVertical: hp(0.8),
    justifyContent: "center",
    width: "auto",
    borderRadius: 10,
    backgroundColor: "#d3d3d3",
  },
});
