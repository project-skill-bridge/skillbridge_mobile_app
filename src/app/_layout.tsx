import * as React from "react";
import { StyleSheet, View } from "react-native";
import type { FirebaseAuthTypes } from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Stack, useRouter, useSegments } from "expo-router";
import { useUserStore } from "../store/user-store";
import Loader from "../components/ui/loader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppState } from "react-native";

const RootLayout = () => {
  GoogleSignin.configure({
    webClientId:
      "751692701677-82jgdl3r1bnhorb20462k0vi7ocud45g.apps.googleusercontent.com",
    scopes: ["email", "profile"],
  });

  // Set up app state change listener
  const appState = React.useRef(AppState.currentState);

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

        setUser({
          id: userSession.uid,
          name: user?.name,
          email: user?.email,
          mobile: user?.mobile,
          image: user?.image,
        });

        router.replace("/(tabs)/home");
      } else if ((!userSession && isRootGroup) || isOnboarding) {
        setUser(null);
        router.replace("/(auth)/sign-in");
      }
    };

    appInit();
  }, [userSession, initializing]);

  React.useEffect(() => {
    if (!initializing && userSession) {
      // Start tracking app usage time when user is logged in
      const trackAppUsage = async () => {
        try {
          // Get today's date as a string (YYYY-MM-DD)
          const today = new Date().toISOString().split("T")[0];
          let startTrackingTime = Date.now();

          // Load saved app usage time data
          const savedUsageTime = await AsyncStorage.getItem("app-usage-time");
          const appUsageTime = savedUsageTime ? JSON.parse(savedUsageTime) : {};

          // Initialize today's usage time if needed
          if (!appUsageTime[today]) {
            appUsageTime[today] = 0;
            await AsyncStorage.setItem(
              "app-usage-time",
              JSON.stringify(appUsageTime)
            );
          }

          const subscription = AppState.addEventListener(
            "change",
            (nextAppState) => {
              if (
                appState.current === "active" &&
                nextAppState.match(/inactive|background/)
              ) {
                // App is going to background, update usage time
                const now = Date.now();
                const sessionTime = now - startTrackingTime;

                // Update app usage time for today
                const updateUsageTime = async () => {
                  const savedUsageTime = await AsyncStorage.getItem(
                    "app-usage-time"
                  );
                  const appUsageTime = savedUsageTime
                    ? JSON.parse(savedUsageTime)
                    : {};
                  appUsageTime[today] =
                    (appUsageTime[today] || 0) + sessionTime;
                  await AsyncStorage.setItem(
                    "app-usage-time",
                    JSON.stringify(appUsageTime)
                  );
                };

                updateUsageTime();
              } else if (
                appState.current.match(/inactive|background/) &&
                nextAppState === "active"
              ) {
                // App is coming to foreground, reset tracking time
                startTrackingTime = Date.now();
              }

              appState.current = nextAppState;
            }
          );

          // Set up a timer to update usage time every minute even while app is active
          const usageTimer = setInterval(async () => {
            if (AppState.currentState === "active") {
              const now = Date.now();
              const sessionTime = now - startTrackingTime;
              startTrackingTime = now; // Reset for next interval

              // Update app usage time for today
              const savedUsageTime = await AsyncStorage.getItem(
                "app-usage-time"
              );
              const appUsageTime = savedUsageTime
                ? JSON.parse(savedUsageTime)
                : {};
              appUsageTime[today] = (appUsageTime[today] || 0) + sessionTime;
              await AsyncStorage.setItem(
                "app-usage-time",
                JSON.stringify(appUsageTime)
              );
            }
          }, 60000); // Update every minute

          return () => {
            subscription.remove();
            clearInterval(usageTimer);
          };
        } catch (error) {
          console.error("Error tracking app usage:", error);
        }
      };

      trackAppUsage();
    }
  }, [initializing, userSession]);

  React.useEffect(() => {
    if (!initializing && userSession) {
      // Start tracking app usage time when user is logged in
      const trackAppUsage = async () => {
        try {
          // Get today's date as a string (YYYY-MM-DD)
          const today = new Date().toISOString().split("T")[0];
          let startTrackingTime = Date.now();

          // Load saved app usage time data
          const savedUsageTime = await AsyncStorage.getItem("app-usage-time");
          const appUsageTime = savedUsageTime ? JSON.parse(savedUsageTime) : {};

          // Initialize today's usage time if needed
          if (!appUsageTime[today]) {
            appUsageTime[today] = 0;
            await AsyncStorage.setItem(
              "app-usage-time",
              JSON.stringify(appUsageTime)
            );
          }

          // Set up app state change listener
          const subscription = AppState.addEventListener(
            "change",
            (nextAppState) => {
              if (
                appState.current === "active" &&
                nextAppState.match(/inactive|background/)
              ) {
                // App is going to background, update usage time
                const now = Date.now();
                const sessionTime = now - startTrackingTime;

                // Update app usage time for today
                const updateUsageTime = async () => {
                  const savedUsageTime = await AsyncStorage.getItem(
                    "app-usage-time"
                  );
                  const appUsageTime = savedUsageTime
                    ? JSON.parse(savedUsageTime)
                    : {};
                  appUsageTime[today] =
                    (appUsageTime[today] || 0) + sessionTime;
                  await AsyncStorage.setItem(
                    "app-usage-time",
                    JSON.stringify(appUsageTime)
                  );
                };

                updateUsageTime();
              } else if (
                appState.current.match(/inactive|background/) &&
                nextAppState === "active"
              ) {
                // App is coming to foreground, reset tracking time
                startTrackingTime = Date.now();
              }

              appState.current = nextAppState;
            }
          );

          // Set up a timer to update usage time every minute even while app is active
          const usageTimer = setInterval(async () => {
            if (AppState.currentState === "active") {
              const now = Date.now();
              const sessionTime = now - startTrackingTime;
              startTrackingTime = now; // Reset for next interval

              // Update app usage time for today
              const savedUsageTime = await AsyncStorage.getItem(
                "app-usage-time"
              );
              const appUsageTime = savedUsageTime
                ? JSON.parse(savedUsageTime)
                : {};
              appUsageTime[today] = (appUsageTime[today] || 0) + sessionTime;
              await AsyncStorage.setItem(
                "app-usage-time",
                JSON.stringify(appUsageTime)
              );
            }
          }, 60000); // Update every minute

          return () => {
            subscription.remove();
            clearInterval(usageTimer);
          };
        } catch (error) {
          console.error("Error tracking app usage:", error);
        }
      };

      trackAppUsage();
    }
  }, [initializing, userSession]);

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
      <Stack.Screen name="(externalPages)" options={{ headerShown: false }} />
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
