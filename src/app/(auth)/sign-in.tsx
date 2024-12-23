import Button from "@/src/components/ui/Button";
import InputField from "@/src/components/ui/InputField";
import OAuth from "@/src/components/ui/OAuth";
import { icons } from "@/src/constants/Icons";
import { theme } from "@/src/constants/Theme";
import { hp, wp } from "@/src/utils/common";
import { Link, router } from "expo-router";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import ReactNativeModal from "react-native-modal";

const SignInScreen = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const signInHandler = () => {
    console.log(form);
  };

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <Text style={styles.title}>Welcome 👋</Text>

        <View>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <View style={styles.inputContainer}>
              <InputField
                label="Email"
                placeholder="Enter email"
                icon={icons.email}
                value={form.email}
                onChangeText={(value) => setForm({ ...form, email: value })}
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

          <Link href="/sign-up" style={styles.forgotPassword}>
            <Text
              style={{
                color: theme.colors.primary,
                fontWeight: theme.fontWeights.bold,
              }}
            >
              Forgot Password
            </Text>
          </Link>

          <Button title="Sign In" onPress={signInHandler} />

          <OAuth />

          <Link href="/sign-up" style={styles.bottomText}>
            <Text>Don't have an account? </Text>
            <Text
              style={{
                color: theme.colors.primary,
                fontWeight: theme.fontWeights.bold,
              }}
            >
              Sign Up
            </Text>
          </Link>
        </View>

        {/* Verification Modal */}
        <ReactNativeModal isVisible={false}>
          <View className="bg-white px-4 py-9 rounded-2xl min-h-[300px]">
            <Text className="text-2xl font-JakartaBold">Verification</Text>

            <Text className=" text-gray-400 mb-2 font-JakartaMedium">
              We've sent a verification code to {form.email}
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
              onPress={() => router.replace("/(root)/(tabs)/home")}
              // className="mt-5"
            />
          </View>
        </ReactNativeModal>
      </View>
    </View>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  wrapper: {
    flex: 1,
    marginHorizontal: wp(8),
    paddingVertical: hp(12),
  },
  title: {
    fontSize: hp(3.1),
    fontWeight: theme.fontWeights.bold,
    textAlign: "center",
    color: theme.colors.primaryText,
    marginBottom: hp(8),
  },
  inputContainer: {
    gap: hp(2.5),
    marginBottom: hp(1.5),
  },
  bottomText: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: hp(6),
    textAlign: "center",
    color: theme.colors.secondaryText,
    fontWeight: theme.fontWeights.regular,
    fontSize: hp(2),
  },
  forgotPassword: {
    marginBottom: hp(4),
    textAlign: "right",
    color: theme.colors.secondaryText,
    fontWeight: theme.fontWeights.regular,
    fontSize: hp(1.8),
  },
});
