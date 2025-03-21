import * as React from "react";

import { Stack } from "expo-router";

const AuthLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="profile" options={{ headerShown: false }} />
      <Stack.Screen name="streak" options={{ headerShown: false }} />
    </Stack>
  );
};

export default AuthLayout;
