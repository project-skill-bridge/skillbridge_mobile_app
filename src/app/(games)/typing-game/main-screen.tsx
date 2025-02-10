import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import Button from "@/src/components/ui/button";

const MainScreen = () => {
    const router = useRouter();
  return (
    <View>
      <Text>MainScreen</Text>
      <Button onPress={() => router.push("/(games)/typing-game/game-screen")} title="Start Game" / >
    </View>
  );
};

export default MainScreen;

const styles = StyleSheet.create({});
