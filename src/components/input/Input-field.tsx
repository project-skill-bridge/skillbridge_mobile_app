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
import { Controller } from "react-hook-form";
import Icon from "@/src/constants/Icons";

const InputField = ({
  name,
  control,
  placeholder,
  editable = true,
  onRightIconPress,
  value: inputValue,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  secureTextEntry = false,
}: InputFieldProps) => {
  const [showPassword, setShowPassword] = React.useState(secureTextEntry);
  const [isFocused, setIsFocused] = React.useState(false);

  const showPasswordHandler = () => {
    setShowPassword((prev: boolean) => !prev);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.focused,
          !editable && styles.disabled,
        ]}
      >
        {LeftIcon}

        <Controller
          name={name}
          control={control}
          render={({ field: { value, onBlur, onChange } }) => (
            <TextInput
              value={inputValue || value}
              style={styles.input}
              placeholder={placeholder}
              secureTextEntry={showPassword}
              onFocus={() => setIsFocused(true)}
              onChangeText={onChange}
              onBlur={() => {
                setIsFocused(false);
                onBlur();
              }}
              editable={editable}
            />
          )}
        />

        {RightIcon && (
          <Pressable onPress={onRightIconPress}>{RightIcon}</Pressable>
        )}

        {name === "password" && secureTextEntry && (
          <Pressable onPress={showPasswordHandler}>
            {showPassword ? (
              <Icon name="eyeOff" color={theme.colors.primaryText} />
            ) : (
              <Icon name="eye" color={theme.colors.primaryText} />
            )}
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
    paddingVertical: hp(1.5),
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
