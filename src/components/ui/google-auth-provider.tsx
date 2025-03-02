import * as React from "react";

import { View, Text, StyleSheet, Image } from "react-native";
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import Button from "./button";
import { theme } from "@/src/constants/Theme";
import firestore from "@react-native-firebase/firestore";
import { Images } from "@/src/constants/Images";

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

      <Button
        variant="outline"
        showShadow={false}
        onPress={googleSignInHandler}
        isLoading={isLoading}
      >
        <Text style={theme.buttonTextOutlineStyle}>Continue with Google</Text>
        <Image source={Images.google} />
      </Button>
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
