import * as React from "react";

import { ActivityIndicator, Pressable, StyleSheet } from "react-native";
import { theme } from "@/src/constants/Theme";
import { ButtonProps } from "@/src/types/type";
import { hp, wp } from "@/src/utils/common";

const getVariantStyle = (variant: string) => {
  switch (variant) {
    case "secondary":
      return {
        backgroundColor: theme.colors.secondary,
      };
    case "outline":
      return {
        borderWidth: 1,
        borderColor: theme.colors.outline,
        backgroundColor: "transparent",
      };
    case "icon":
      return {
        paddingHorizontal: wp(1.6),
        paddingVertical: hp(0.8),
        borderRadius: 10,
      };
    default:
      return;
  }
};

const Button = ({
  style,
  onPress,
  isLoading = false,
  showShadow = false,
  variant = "default",
  children,
}: ButtonProps) => {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.button,
        getVariantStyle(variant),
        style,
        showShadow && theme.shadowStyle,
      ]}
    >
      {isLoading && (
        <ActivityIndicator
          color={variant === "outline" ? theme.colors.primary : "white"}
        />
      )}
      {children}
    </Pressable>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "auto",
    gap: 20,
    padding: hp(2.1),
    backgroundColor: theme.colors.primary,
    borderRadius: 100,
  },
});
