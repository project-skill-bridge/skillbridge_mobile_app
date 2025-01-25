import * as React from "react";
import { ActivityIndicator, StyleSheet,  View } from "react-native";

import { theme } from "@/src/constants/Theme";
import { hp } from "@/src/utils/common";

const outlineStyle = {
  borderWidth: 1,
  borderColor: theme.colors.outline,
  padding: hp(1.3),
  borderRadius: 100,
};

interface LoaderProps {
  outline?: boolean;
}

const Loader = ({ outline }: LoaderProps) => {
  return (
    <View style={[styles.loader, outline && outlineStyle]}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  );
};

export default Loader;

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
