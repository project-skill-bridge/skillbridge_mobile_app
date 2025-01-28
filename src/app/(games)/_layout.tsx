import { Stack } from "expo-router";

const GameLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="typing-game" options={{ headerShown: false }} />
      {/* <Stack.Screen name="baloon-pop" options={{ headerShown: false }} /> */}
    </Stack>
  );
};

export default GameLayout;
