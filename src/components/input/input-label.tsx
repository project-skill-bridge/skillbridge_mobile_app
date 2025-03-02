import * as React from "react";

import { StyleProp, StyleSheet, Text } from "react-native";
import { hp } from "@/src/utils/common";
import { theme } from "@/src/constants/Theme";
import { TextStyle } from "react-native/Libraries/StyleSheet/StyleSheetTypes";

interface InputLabelProps {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
}

const InputLabel = ({ children, style }: InputLabelProps) => {
  return <Text style={[styles.label, style]}>{children}</Text>;
};

export default InputLabel;

const styles = StyleSheet.create({
  label: {
    fontSize: hp(2.1),
    color: theme.colors.primaryText,
    fontWeight: theme.fontWeights.semiBold,
  },
});
