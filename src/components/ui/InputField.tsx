import * as React from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  TextInput,
  Keyboard,
  StyleSheet,
  Pressable,
} from "react-native";

import { InputFieldProps } from "../../types/type";
import { hp, wp } from "@/src/utils/common";
import { theme } from "@/src/constants/Theme";
import { icons } from "@/src/constants/Icons";

const InputField = ({
  label,
  leftIcon,
  rightIcon,
  value,
  placeholder,
  onChangeText,
  secureTextEntry = false,
}: InputFieldProps) => {
  const [showPassword, setShowPassword] = React.useState(secureTextEntry);
  const [isFocused, setIsFocused] = React.useState(false);

  const showPasswordHandler = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.label}>{label}</Text>

        <View style={[styles.inputContainer, isFocused && styles.focused]}>
          {leftIcon && leftIcon}
          <TextInput
            value={value}
            style={styles.input}
            placeholder={placeholder}
            secureTextEntry={showPassword}
            onChangeText={onChangeText}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />

          {rightIcon && rightIcon}
          {label === "Password" && !rightIcon && (
            <Pressable onPress={showPasswordHandler}>
              {showPassword ? icons.eyeOff : icons.eye}
            </Pressable>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default InputField;

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  label: {
    fontSize: hp(2.1),
    color: theme.colors.primaryText,
    fontWeight: theme.fontWeights.semiBold,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: theme.colors.lightGray,
    paddingVertical: hp(2),
    paddingHorizontal: wp(5),
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "transparent",
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: hp(2),
    color: theme.colors.primaryText,
  },
  focused: {
    borderColor: theme.colors.primary,
  },
});
