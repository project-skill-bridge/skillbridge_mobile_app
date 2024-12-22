import { theme } from "@/src/constants/Theme";
import { hp } from "@/src/utils/common";
import { Pressable, StyleProp, StyleSheet, Text } from "react-native";
import { ViewStyle } from "react-native/Libraries/StyleSheet/StyleSheetTypes";

interface ButtonProps {
  title: string;
  onPress: () => void;
  bgVariant?: "primary" | "secondary";
  icon?: React.FC;
  style?: StyleProp<ViewStyle>;
}

const Button = ({
  title,
  onPress,
  bgVariant = "primary",
  icon,
  style,
}: ButtonProps) => {
  return (
    <Pressable
      onPress={onPress}
      style={[
        style,
        styles.button,
        {
          backgroundColor:
            bgVariant === "primary"
              ? theme.colors.primary
              : theme.colors.secondary,
        },
      ]}
    >
      {/* {icon && <IconLeft />} */}
      <Text style={styles.text}>{title}</Text>
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
    shadowColor: "#000",
    shadowOffset: {
      width: 10,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  text: {
    color: "white",
    fontSize: hp(2),
    fontWeight: theme.fontWeights.bold,
  },
});
