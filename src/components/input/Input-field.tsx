import * as React from "react";

import {
  View,
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
import { Controller } from "react-hook-form";

const InputField = ({
  name,
  control,
  leftIcon,
  rightIcon,
  placeholder,
  secureTextEntry = false,
}: InputFieldProps) => {
  const [showPassword, setShowPassword] = React.useState(secureTextEntry);
  const [isFocused, setIsFocused] = React.useState(false);

  const showPasswordHandler = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.inputContainer, isFocused && styles.focused]}>
        {leftIcon && leftIcon}

        <Controller
          name={name}
          control={control}
          render={({ field: { value, onBlur, onChange } }) => (
            <TextInput
              value={value}
              style={styles.input}
              placeholder={placeholder}
              secureTextEntry={showPassword}
              onFocus={() => setIsFocused(true)}
              onChangeText={onChange}
              onBlur={() => {
                setIsFocused(false);
                onBlur();
              }}
            />
          )}
        />

        {rightIcon && rightIcon}

        {name === "password" && secureTextEntry && (
          <Pressable onPress={showPasswordHandler}>
            {showPassword ? icons.eyeOff : icons.eye}
          </Pressable>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default InputField;

const styles = StyleSheet.create({
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
