import * as React from "react";

import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { theme } from "@/src/constants/Theme";
import { ButtonProps } from "@/src/types/type";
import { hp } from "@/src/utils/common";

const outlineStyle = {
  borderWidth: 1,
  borderColor: theme.colors.outline,
};

const getBgVariant = (bgVariant: string) => {
  switch (bgVariant) {
    case "primary":
      return theme.colors.primary;
    case "secondary":
      return theme.colors.secondary;
    case "outline":
      return "transparent";
    default:
      return theme.colors.primary;
  }
};

const Button = ({
  title,
  style,
  onPress,
  icon: Icon,
  isLoading = false,
  showShadow = true,
  bgVariant = "primary",
  textVariant = "primary",
}: ButtonProps) => {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.button,
        style,
        {
          backgroundColor: getBgVariant(bgVariant),
          ...(showShadow && theme.shadowStyle),
          ...(bgVariant === "outline" && outlineStyle),
        },
      ]}
    >
      {isLoading && (
        <ActivityIndicator
          color={bgVariant === "outline" ? theme.colors.primary : "white"}
        />
      )}

      {Icon && <React.Fragment>{Icon}</React.Fragment>}

      <Text
        style={[
          styles.text,
          {
            color:
              textVariant === "primary" ? "#FFF" : theme.colors.primaryText,
          },
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    padding: hp(2.1),
    justifyContent: "center",
    width: "100%",
    borderRadius: 100,
    gap: 20,
  },
  text: {
    fontSize: hp(2),
    fontWeight: theme.fontWeights.bold,
  },
});
