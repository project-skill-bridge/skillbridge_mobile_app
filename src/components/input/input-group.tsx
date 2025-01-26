import * as React from "react";

import { StyleProp, StyleSheet, View } from "react-native";
import { ViewStyle } from "react-native/Libraries/StyleSheet/StyleSheetTypes";

interface InputGroupProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const InputGroup = ({ children, style }: InputGroupProps) => {
  return <View style={[styles.container, style]}>{children}</View>;
};

export default InputGroup;

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
});
