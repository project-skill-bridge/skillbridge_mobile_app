import { Pressable, StyleSheet, Text } from "react-native";
import { router } from "expo-router";

import { theme } from "@/src/constants/Theme";
import { hp } from "@/src/utils/common";
import { icons } from "@/src/constants/Icons";
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
      {icons.backArrow}
    </Pressable>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    padding: hp(1.5),
    justifyContent: "center",
    width: "auto",
    borderRadius: "50%",
    backgroundColor: theme.colors.secondary,
  },
});
