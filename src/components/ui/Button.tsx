import * as React from "react";


import { GestureResponderEvent, Pressable, StyleSheet } from "react-native";
import { theme } from "@/src/constants/Theme";
import { ButtonProps } from "@/src/types/type";
import { hp, wp } from "@/src/utils/common";
import Loader from "./loader";
import { Audio } from "expo-av";
import { Sounds } from "@/src/constants/Sounds";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  const buttonClickRef = React.useRef<Audio.Sound | null>(null);

  React.useEffect(() => {
    const loadSound = async () => {
      const { sound: buttonClick } = await Audio.Sound.createAsync(
        Sounds.buttonClick
      );
      buttonClickRef.current = buttonClick;
    };

    loadSound();
    return () => {
      buttonClickRef.current?.unloadAsync();
    };
  }, []);

  const handlePress = async (e: GestureResponderEvent) => {
    if (!onPress) return;

    const hasSound = JSON.parse(
      (await AsyncStorage.getItem("sound")) as string
    );

    if (hasSound && variant === "icon") {
      await buttonClickRef.current?.setVolumeAsync(0.1);
      await buttonClickRef.current?.replayAsync();
    }
    onPress(e);
  };

  return (
    <Pressable
      onPress={(e) => handlePress(e)}
      style={[
        styles.button,
        getVariantStyle(variant),
        style,
        showShadow && theme.shadowStyle,
      ]}
    >
      {isLoading && (
        <Loader
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
