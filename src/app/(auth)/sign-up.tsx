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
import { hp, wp } from "@/src/utils/common";
import { theme } from "@/src/constants/Theme";
import { icons } from "@/src/constants/Icons";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import auth from "@react-native-firebase/auth";
import Button from "@/src/components/ui/button";
import InputField from "@/src/components/input/Input-field";
import GoogleAuthButton from "@/src/components/ui/google-button";
import Loader from "@/src/components/ui/loader";
import ReactNativeModal from "react-native-modal";
import { RegisterFormType, RegisterSchema } from "@/src/schema";
import InputGroup from "@/src/components/input/input-group";
import InputLabel from "@/src/components/input/input-label";
import ErrorMessage from "@/src/components/input/error-message";
import firestore from "@react-native-firebase/firestore";

const SignUpScreen = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormType>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
      password: "",
    },
    mode: "all",
  });
  const [isLoading, setIsLoading] = React.useState(false);

  const signUpHandler = async (formData: RegisterFormType) => {
    setIsLoading(true);
    try {
      const { email, password } = formData;
      const { user } = await auth().createUserWithEmailAndPassword(
        email,
        password
      );

      await firestore().collection("users").doc(user.uid).set({
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
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
    <ScrollView style={styles.container}>
      <View style={styles.wrapper}>
        <Text style={styles.title}>Create Your Account</Text>

        <View>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <View style={styles.inputContainer}>
              <InputGroup>
                <InputLabel>Name</InputLabel>
                <InputField
                  name="name"
                  control={control}
                  leftIcon={icons.person}
                  placeholder="Enter your name"
                />
                {errors.name?.message && (
                  <ErrorMessage message={errors.name.message} />
                )}
              </InputGroup>

              <InputGroup>
                <InputLabel>Email</InputLabel>
                <InputField
                  name="email"
                  control={control}
                  leftIcon={icons.email}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                />
                {errors.email?.message && (
                  <ErrorMessage message={errors.email.message} />
                )}
              </InputGroup>

              <InputGroup>
                <InputLabel>Mobile</InputLabel>
                <InputField
                  name="mobile"
                  control={control}
                  leftIcon={icons.mobile}
                  keyboardType="phone-pad"
                  placeholder="Enter your mobile number"
                />
                {errors.mobile?.message && (
                  <ErrorMessage message={errors.mobile.message} />
                )}
              </InputGroup>

              <InputGroup>
                <InputLabel>Password</InputLabel>
                <InputField
                  name="password"
                  control={control}
                  leftIcon={icons.lock}
                  secureTextEntry={true}
                  placeholder="Enter your password"
                />
                {errors.password?.message && (
                  <ErrorMessage message={errors.password.message} />
                )}
              </InputGroup>
            </View>
          </KeyboardAvoidingView>

          {isLoading ? (
            <Loader />
          ) : (
            <Button title="Sign Up" onPress={handleSubmit(signUpHandler)} />
          )}

          <GoogleAuthButton />

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
              {/* We&apos;ve sent a verification code to {email} */}
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
