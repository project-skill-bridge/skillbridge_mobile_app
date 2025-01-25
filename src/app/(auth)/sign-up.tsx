import * as React from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Link, router } from "expo-router";
import ReactNativeModal from "react-native-modal";
import auth from "@react-native-firebase/auth";
import Button from "@/src/components/ui/Button";
import InputField from "@/src/components/ui/InputField";
import OAuth from "@/src/components/ui/OAuth";
import { hp, wp } from "@/src/utils/common";
import { theme } from "@/src/constants/Theme";
import { icons } from "@/src/constants/Icons";
import Loader from "@/src/components/ui/Loader";

const SignUpScreen = () => {
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
  });
  const [isLoading, setIsLoading] = React.useState(false);

  const signUpHandler = async () => {
    setIsLoading(true);
    try {
      await auth().createUserWithEmailAndPassword(form.email, form.password);
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
    <ScrollView style={styles.container}>
      <View style={styles.wrapper}>
        <Text style={styles.title}>Create Your Account</Text>

        <View>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <View style={styles.inputContainer}>
              <InputField
                label="Name"
                placeholder="Enter name"
                icon={icons.person}
                value={form.name}
                onChangeText={(value) => setForm({ ...form, name: value })}
              />
              <InputField
                label="Email"
                placeholder="Enter email"
                icon={icons.email}
                value={form.email}
                keyboardType="email-address"
                onChangeText={(value) => setForm({ ...form, email: value })}
              />
              <InputField
                label="Mobile"
                placeholder="Enter mobile number"
                icon={icons.mobile}
                value={form.mobile}
                keyboardType="phone-pad"
                onChangeText={(value) => setForm({ ...form, mobile: value })}
              />
              <InputField
                label="Password"
                placeholder="Enter password"
                secureTextEntry={true}
                icon={icons.lock}
                value={form.password}
                onChangeText={(value) => setForm({ ...form, password: value })}
              />
            </View>
          </KeyboardAvoidingView>

          {isLoading ? (
            <Loader />
          ) : (
            <Button title="Sign Up" onPress={signUpHandler} />
          )}

          <OAuth />

          <Link href="/sign-in" style={styles.bottomText}>
            <Text>Already have an account? </Text>
            <Text
              style={{
                color: theme.colors.primary,
                fontWeight: theme.fontWeights.bold,
              }}
            >
              Log in
            </Text>
          </Link>
        </View>

        {/* Verification Modal */}
        <ReactNativeModal isVisible={false}>
          <View className="bg-white px-4 py-9 rounded-2xl min-h-[300px]">
            <Text className="text-2xl font-JakartaBold">Verification</Text>

            <Text className=" text-gray-400 mb-2 font-JakartaMedium">
              We&apos;ve sent a verification code to {form.email}
            </Text>

            <InputField
              label="Code"
              // icon={icons.lock}
              placeholder="123456"
              // value={verification.code}
              keyboardType="numeric"
              // onChangeText={(code) =>
              //   setVerification({ ...verification, code })
              // }
            />

            {/* {verification.error && (
            <Text className="text-red-500 text-sm mt-1">
              {verification.error}
            </Text>
          )} */}

            <Button
              title="Verify Email"
              onPress={() => {}}
              // bgVariant="success"
              // className="mt-5"
            />
          </View>
        </ReactNativeModal>

        <ReactNativeModal isVisible={false}>
          <View className="bg-white px-4 py-9 rounded-2xl min-h-[300px]">
            <Image
              // source={images.check}
              className="w-[110px] h-[110px] mx-auto my-5"
            />

            <Text className="text-3xl font-JakartaBold text-center">
              Verified!
            </Text>

            <Text className="text-center text-gray-400 text-base mt-2 font-JakartaMedium">
              You have successfully verified your account
            </Text>

            <Button
              title="Browse Home"
              onPress={() => router.replace("/(tabs)/home")}
              // className="mt-5"
            />
          </View>
        </ReactNativeModal>
      </View>
    </ScrollView>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  wrapper: {
    flex: 1,
    marginHorizontal: wp(8),
    paddingVertical: hp(3),
  },
  title: {
    fontSize: hp(3.1),
    fontWeight: theme.fontWeights.bold,
    textAlign: "center",
    color: theme.colors.primaryText,
    marginBottom: hp(4),
  },
  inputContainer: {
    gap: hp(2.5),
    marginBottom: hp(4),
  },
  bottomText: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: hp(4),
    textAlign: "center",
    color: theme.colors.secondaryText,
    fontWeight: theme.fontWeights.regular,
    fontSize: hp(2),
  },
});
