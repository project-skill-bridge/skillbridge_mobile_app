import * as React from "react";

import { Pressable, StyleSheet, Text } from "react-native";
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
  onPress,
  bgVariant = "primary",
  icon: Icon,
  style,
  showShadow = true,
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
      {icon && <React.Fragment>{icon}</React.Fragment>}
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
    gap: 10,
  },
  text: {
    fontSize: hp(2),
    fontWeight: theme.fontWeights.bold,
  },
});
