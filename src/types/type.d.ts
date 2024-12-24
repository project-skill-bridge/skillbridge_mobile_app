import { TextInputProps } from "react-native";
import { icons } from "../constants/Icons";

declare interface InputFieldProps extends TextInputProps {
  label: string;
  icon?: any;
  secureTextEntry?: boolean;
}

declare interface ButtonProps {
  title: string;
  onPress: () => void;
  bgVariant?: "primary" | "secondary" | "outline";
  textVariant?: "primary" | "secondary";
  icon?: any;
  style?: StyleProp<ViewStyle>;
  showShadow?: boolean;
}

declare interface TabIconProps {
  focused: boolean;
  icon: any;
}

declare interface TabBarButtonProps {
  onPress: () => void;
  onLongPress: () => void;
  routeName: keyof typeof icons;
}
