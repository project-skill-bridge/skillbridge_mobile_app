import { Pressable, StyleSheet, Text } from "react-native";
import { theme } from "@/src/constants/Theme";
import { ButtonProps } from "@/src/types/type";
import { hp } from "@/src/utils/common";

const shadowStyle = {
  shadowColor: "#000",
  shadowOffset: {
    width: 10,
    height: 4,
  },
  shadowOpacity: 0.3,
  shadowRadius: 3,
  elevation: 5,
};

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
  icon,
  style,
  showShadow = true,
  textVariant = "primary",
}: ButtonProps) => {
  return (
    <Pressable
      onPress={onPress}
      style={[
        style,
        styles.button,
        {
          backgroundColor: getBgVariant(bgVariant),
          ...(showShadow && shadowStyle),
          ...(bgVariant === "outline" && outlineStyle),
        },
      ]}
    >
      {icon && icon}
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
