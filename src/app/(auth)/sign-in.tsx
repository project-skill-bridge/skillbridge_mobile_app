import * as React from "react";

import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Link } from "expo-router";
import ReactNativeModal from "react-native-modal";
import auth from "@react-native-firebase/auth";
import InputField from "@/src/components/input/Input-field";
import GoogleAuthButton from "@/src/components/ui/google-auth-provider";
import { theme } from "@/src/constants/Theme";
import { hp, wp } from "@/src/utils/common";
import InputGroup from "@/src/components/input/input-group";
import InputLabel from "@/src/components/input/input-label";
import ErrorMessage from "@/src/components/input/error-message";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormType, LoginSchema } from "@/src/schema";
import Button from "@/src/components/ui/button";
import { Icons } from "@/src/constants/Icons";

const SignInScreen = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "all",
  });
  const [isLoading, setIsLoading] = React.useState(false);

  const signInHandler = async (formData: LoginFormType) => {
    setIsLoading(true);
    try {
      const { email, password } = formData;
      await auth().signInWithEmailAndPassword(email, password);
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
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <Text style={styles.title}>Welcome 👋</Text>

        <View>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <View style={styles.inputContainer}>
              <InputGroup>
                <InputLabel>Email</InputLabel>
                <InputField
                  name="email"
                  control={control}
                  icon={
                    <Icons.Mail size={22} color={theme.colors.primaryText} />
                  }
                  placeholder="Enter your email"
                  keyboardType="email-address"
                />
                {errors.email?.message && (
                  <ErrorMessage message={errors.email.message} />
                )}
              </InputGroup>

              <InputGroup>
                <InputLabel>Password</InputLabel>
                <InputField
                  name="password"
                  control={control}
                  icon={
                    <Icons.LockKeyhole
                      size={24}
                      color={theme.colors.primaryText}
                    />
                  }
                  secureTextEntry={true}
                  placeholder="Enter your password"
                />
                {errors.password?.message && (
                  <ErrorMessage message={errors.password.message} />
                )}
              </InputGroup>
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

          <Button
            onPress={handleSubmit(signInHandler)}
            isLoading={isLoading}
            showShadow
          >
            <Text style={theme.buttonTextDefaultStyle}>Sign In</Text>
          </Button>

          <GoogleAuthButton />

          <Link href="/sign-up" style={styles.bottomText}>
            <Text>Don&apos;t have an account? </Text>
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
              We&apos;ve sent a verification code to
            </Text>

            <InputField
              name="Code"
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

            {/* <Button
              title="Verify Email"
              onPress={() => {}}
              // bgVariant="success"
              // className="mt-5"
            /> */}
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

            {/* <Button
              title="Browse Home"
              onPress={() => router.replace("/(tabs)/home")}
              // className="mt-5"
            /> */}
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
