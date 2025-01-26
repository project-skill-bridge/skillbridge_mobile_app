import * as React from "react";

import { View, Text, StyleSheet } from "react-native";
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import Button from "./button";
import { theme } from "@/src/constants/Theme";
import { icons } from "@/src/constants/Icons";
import Loader from "./loader";
import firestore from "@react-native-firebase/firestore";

const GoogleAuthButton = () => {
  const [isLoading, setIsLoading] = React.useState(false);

  const googleSignInHandler = async () => {
    setIsLoading(true);
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      const signInResult = await GoogleSignin.signIn();

      const idToken = signInResult.data?.idToken ?? null;
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      const { user, additionalUserInfo } = await auth().signInWithCredential(
        googleCredential
      );

      if (!additionalUserInfo?.isNewUser) {
        return;
      }

      await firestore().collection("users").doc(user.uid).set({
        name: user.displayName,
        email: user.email,
        mobile: user.phoneNumber,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View>
      <View style={styles.divider}>
        <View style={styles.line} />
        <Text>Or </Text>
        <View style={styles.line} />
      </View>

      {isLoading ? (
        <Loader outline />
      ) : (
        <Button
          title="Continue with Google"
          bgVariant="outline"
          textVariant="secondary"
          showShadow={false}
          onPress={googleSignInHandler}
          icon={icons.google}
        />
      )}
    </View>
  );
};

export default GoogleAuthButton;

const styles = StyleSheet.create({
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginVertical: 10,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.outline,
  },
});
