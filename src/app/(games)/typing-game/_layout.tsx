import * as React from "react";
import { Stack } from "expo-router";

const TypingGameLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="main-screen" options={{ headerShown: false }} />
      <Stack.Screen name="game-screen" options={{ headerShown: false }} />
    </Stack>
  );
};

export default TypingGameLayout;
