import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";
import Button from "./Button";
import { theme } from "@/src/constants/Theme";
import { icons } from "@/src/constants/Icons";

const OAuth = () => {
  const googleSignInHandler = async () => {};

  return (
    <View>
      <View style={styles.divider}>
        <View style={styles.line} />
        <Text>Or </Text>
        <View style={styles.line} />
      </View>

      <Button
        title="Continue with Google"
        bgVariant="outline"
        textVariant="secondary"
        showShadow={false}
        onPress={googleSignInHandler}
        icon={icons.google}
      />
    </View>
  );
};

export default OAuth;

const styles = StyleSheet.create({
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginVertical: 10,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.outline,
  },
});
