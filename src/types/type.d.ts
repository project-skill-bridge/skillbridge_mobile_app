import * as React from "react";

import { TextInputProps } from "react-native";
import { icons } from "../constants/Icons";

declare interface InputFieldProps extends TextInputProps {
  label: string;
  leftIcon?: React.JSX.Element;
  rightIcon?: React.JSX.Element;
  secureTextEntry?: boolean;
}

declare interface ButtonProps {
  title: string;
  onPress: () => void;
  bgVariant?: "primary" | "secondary" | "outline";
  textVariant?: "primary" | "secondary";
  icon?: React.JSX.Element;
  style?: StyleProp<ViewStyle>;
  showShadow?: boolean;
}

declare interface TabIconProps {
  focused: boolean;
  icon: React.JSX.Element;
}

declare interface TabBarButtonProps {
  onPress: () => void;
  onLongPress: () => void;
  routeName: keyof typeof icons;
}
