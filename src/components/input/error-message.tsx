import * as React from "react";

import { StyleProp, StyleSheet, Text } from "react-native";
import { hp } from "@/src/utils/common";
import { TextStyle } from "react-native/Libraries/StyleSheet/StyleSheetTypes";

interface ErrorMessageProps {
  message: string;
  style?: StyleProp<TextStyle>;
}

const ErrorMessage = ({ message, style }: ErrorMessageProps) => {
  return <Text style={[styles.error, style]}>{message}</Text>;
};

export default ErrorMessage;

const styles = StyleSheet.create({
  error: {
    color: "red",
    fontSize: hp(1.8),
  },
});
