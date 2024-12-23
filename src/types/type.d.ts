import { TextInputProps } from "react-native";

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
