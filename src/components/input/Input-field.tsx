import * as React from "react";

import {
  View,
  TouchableWithoutFeedback,
  TextInput,
  Keyboard,
  StyleSheet,
  Pressable,
} from "react-native";
import { Controller } from "react-hook-form";
import { InputFieldProps } from "../../types/type";
import { hp, wp } from "@/src/utils/common";
import { theme } from "@/src/constants/Theme";
import { Icons } from "@/src/constants/Icons";

const InputField = ({
  name,
  control,
  placeholder,
  value: inputValue,
  icon: Icon,
  secureTextEntry = false,
  onRightIconPress,
  rightIcon: RightIcon,
  ...props
}: InputFieldProps) => {
  const [showPassword, setShowPassword] = React.useState(secureTextEntry);
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.isVisible}>
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.focused,
          !isFocused && styles.disabled,
        ]}
      >
        {Icon}

        <Controller
          name={name}
          control={control}
          render={({ field: { value, onBlur, onChange } }) => (
            <TextInput
              style={styles.input}
              onChangeText={onChange}
              placeholder={placeholder}
              value={inputValue || value}
              secureTextEntry={showPassword}
              onFocus={() => setIsFocused(true)}
              onBlur={() => {
                setIsFocused(false);
                onBlur();
              }}
              {...props}
            />
          )}
        />

        {name === "password" && secureTextEntry && (
          <Pressable onPress={() => setShowPassword((prev: boolean) => !prev)}>
            {showPassword ? (
              <Icons.EyeOff color={theme.colors.primaryText} />
            ) : (
              <Icons.Eye color={theme.colors.primaryText} />
            )}
          </Pressable>
        )}

        {/* Add support for custom right icon with press handler */}
        {RightIcon && onRightIconPress && (
          <Pressable onPress={onRightIconPress}>
            {RightIcon}
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
    paddingVertical: hp(1.7),
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
  disabled: {
    color: "#AAAAAA",
    backgroundColor: "#EEEEEE",
  },
});