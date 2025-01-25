import * as React from "react";
import { StyleSheet, Text, View } from "react-native";

import Button from "@/src/components/ui/Button";
import auth from "@react-native-firebase/auth";

const HomeScreen = () => {
  return (
    <View style={{ padding: 20 }}>
      <Text>HomeScreen</Text>
      <Button title="sign out" onPress={() => auth().signOut()} />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
