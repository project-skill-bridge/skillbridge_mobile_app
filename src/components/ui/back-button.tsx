import React from "react";

import { Pressable, StyleProp, StyleSheet } from "react-native";
import { router } from "expo-router";
import { hp, wp } from "@/src/utils/common";
import { ViewStyle } from "react-native/Libraries/StyleSheet/StyleSheetTypes";
import { Icons } from "@/src/constants/Icons";

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
      <Icons.ChevronLeft color="black" />
    </Pressable>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    paddingHorizontal: wp(1.6),
    paddingVertical: hp(0.8),
    justifyContent: "center",
    width: "auto",
    borderRadius: 10,
    backgroundColor: "#d3d3d3",
  },
});
