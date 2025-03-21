import * as React from "react";

import { Stack } from "expo-router";

const GamesLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="eye-contact/game-screen"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="tap-and-type/main-screen"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="tap-and-type/game-screen"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="circle-burst/game-screen"
        options={{ headerShown: false }}
      />
    </Stack>
  );
};

export default GamesLayout;
