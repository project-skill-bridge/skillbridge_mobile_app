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
import { useState } from "react";

const InputField = ({
  label,
  icon,
  value,
  placeholder,
  onChangeText,
  secureTextEntry = false,
}: InputFieldProps) => {
  const [showPassword, setShowPassword] = useState(secureTextEntry);
  const [isFocused, setIsFocused] = useState(false);

  const showPasswordHandler = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.label}>{label}</Text>

        <View style={[styles.inputContainer, isFocused && styles.focused]}>
          {icon && icon}
          <TextInput
            value={value}
            style={styles.input}
            placeholder={placeholder}
            secureTextEntry={showPassword}
            onChangeText={onChangeText}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          {label === "Password" && (
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
    paddingVertical: hp(1.2),
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
