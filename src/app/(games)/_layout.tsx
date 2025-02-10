import * as React from "react";

import { Stack } from "expo-router";

const GamesLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="typing-game" options={{ headerShown: false }} />
      {/* <Stack.Screen name="baloon-pop-game" options={{ headerShown: false }} /> */}
    </Stack>
  );
};

export default GamesLayout;
