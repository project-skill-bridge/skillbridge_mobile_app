import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

import auth from "@react-native-firebase/auth";
import Loader from "../components/ui/Loader";

const RootLayout = () => {
  GoogleSignin.configure({
    webClientId:
      "751692701677-82jgdl3r1bnhorb20462k0vi7ocud45g.apps.googleusercontent.com",
    scopes: ["email", "profile"],
  });

  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>();
  const router = useRouter();
  const segments = useSegments();

  const onAuthStateChanged = (user: FirebaseAuthTypes.User | null) => {
    setUser(user);
    if (initializing) setInitializing(false);
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  useEffect(() => {
    if (initializing) return;

    const isRootGroup = segments[0] === "(tabs)";

    if (user && !isRootGroup) {
      router.replace("/(tabs)/home");
    } else if (!user && isRootGroup) {
      router.push("/(auth)/sign-in");
    }
  }, [user, initializing]);

  if (initializing) {
    return <Loader />;
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
};

export default RootLayout;
