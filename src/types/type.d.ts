import * as React from "react";

import { PressableProps, StyleProp, TextInputProps } from "react-native";
import { ViewStyle } from "react-native/Libraries/StyleSheet/StyleSheetTypes";
import { Control } from "react-hook-form";

declare interface InputFieldProps extends TextInputProps {
  name: string;
  control?: Control<T>;
  leftIcon?: React.JSX.Element;
  rightIcon?: React.JSX.Element;
  secureTextEntry?: boolean;
  onRightIconPress?: () => void;
}

declare interface ButtonProps extends PressableProps {
  variant?: "default" | "secondary" | "outline" | "icon";
  isLoading?: boolean;
  style?: StyleProp<ViewStyle>;
  showShadow?: boolean;
  children: React.ReactNode;
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
