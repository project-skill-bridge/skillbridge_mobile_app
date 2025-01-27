import * as React from "react";

import { StyleProp, TextInputProps } from "react-native";
import { ViewStyle } from "react-native/Libraries/StyleSheet/StyleSheetTypes";
import { Control } from "react-hook-form";

declare interface InputFieldProps extends TextInputProps {
  name: string;
  control?: Control<T>;
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
  routeName: string;
}

declare interface User {
  name: string;
  email: string;
  mobile?: string;
  image?: string;
}
