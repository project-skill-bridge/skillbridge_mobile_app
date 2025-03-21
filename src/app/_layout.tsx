import * as React from "react";

import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { Stack, useRouter, useSegments } from "expo-router";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";
import Loader from "@/src/components/ui/loader";
import { useUserStore } from "../store/user-store";
import firestore from "@react-native-firebase/firestore";

const RootLayout = () => {
  GoogleSignin.configure({
    webClientId:
      "751692701677-82jgdl3r1bnhorb20462k0vi7ocud45g.apps.googleusercontent.com",
    scopes: ["email", "profile"],
  });

  const [initializing, setInitializing] = React.useState(true);
  const [userSession, setUserSession] =
    React.useState<FirebaseAuthTypes.User | null>();
  const router = useRouter();
  const segments = useSegments();

  const { setUser } = useUserStore();

  const onAuthStateChanged = (user: FirebaseAuthTypes.User | null) => {
    setUserSession(user);
    if (initializing) setInitializing(false);
  };

  React.useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  React.useEffect(() => {
    if (initializing) return;

    const isRootGroup = segments[0] === "(tabs)";

    if (userSession && !isRootGroup) {
      firestore()
        .collection("users")
        .doc(userSession?.uid)
        .get()
        .then((doc) => {
          const user = doc.data();
          if (user) {
            setUser({
              name: user.name,
              email: user.email,
              mobile: user.mobile,
              image: user.image,
            });
          }
        });
      router.replace("/(tabs)/home");
    } else if (!userSession && isRootGroup) {
      setUser(null);
      router.replace("/(auth)/sign-in");
    }
  }, [userSession, initializing]);

  if (initializing) {
    return <Loader />;
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(games)" options={{ headerShown: false }} />
    </Stack>
  );
};

export default RootLayout;
