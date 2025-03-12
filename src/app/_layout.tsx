import * as React from "react";

import { StyleSheet, View } from "react-native";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Stack, useRouter, useSegments } from "expo-router";
import { useUserStore } from "../store/user-store";
import Loader from "../components/ui/loader";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

    const appInit = async () => {
      const isOnboarding = JSON.parse(
        (await AsyncStorage.getItem("isOnboarding")) as string
      );

      if (!isOnboarding) {
        await AsyncStorage.setItem("sound", JSON.stringify(true));
        await AsyncStorage.setItem("music", JSON.stringify(true));
      }

      if (userSession && !isRootGroup) {
        const doc = await firestore()
          .collection("users")
          .doc(userSession?.uid)
          .get();

        const user = doc.data();

        if (user) {
          setUser({
            id: userSession.uid,
            name: user.name,
            email: user.email,
            mobile: user.mobile,
            image: user.image,
          });
        }
        router.replace("/(tabs)/home");
      } else if ((!userSession && isRootGroup) || isOnboarding) {
        setUser(null);
        router.replace("/(auth)/sign-in");
      }
    };

    appInit();
  }, [userSession, initializing]);

  if (initializing) {
    return (
      <View style={styles.loader}>
        <Loader size={30} />
      </View>
    );
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

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
