import * as React from "react";

import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Link } from "expo-router";
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
import Modal from "@/src/components/ui/modal";
import { ModalState } from "@/src/types/type";

const SignInScreen = () => {
  const {
    control,
    handleSubmit,
    getValues,
    getFieldState,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "all",
  });

  const [isVisible, setIsVisible] = React.useState<ModalState>({
    visible: false,
    message: "",
    type: "",
  });

  const signInHandler = async (formData: LoginFormType) => {
    try {
      const { email, password } = formData;
      await auth().signInWithEmailAndPassword(email, password);
    } catch (error) {
      if (error instanceof Error) {
        setIsVisible({
          visible: true,
          message: "Invalid email or password",
          type: "error",
        });
      } else {
        setIsVisible({
          visible: true,
          message: "An error occurred. Please try again.",
          type: "error",
        });
      }
    }
  };

  const handleForgotPassword = async () => {
    const email = getValues("email");

    if (!email.trim() || getFieldState("email").invalid) {
      setIsVisible({
        visible: true,
        message: "Please enter your email address",
        type: "error",
      });
      return;
    }

    try {
      await auth().sendPasswordResetEmail(email);
      setIsVisible({
        visible: true,
        message: "An email has been sent to your email address.",
        type: "success",
      });
    } catch {
      setIsVisible({
        visible: true,
        message: "An error occurred. Please try again.",
        type: "error",
      });
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

          <Pressable
            style={styles.forgotPassword}
            onPress={handleForgotPassword}
          >
            <Text
              style={{
                color: theme.colors.primary,
                fontWeight: theme.fontWeights.bold,
              }}
            >
              Forgot Password
            </Text>
          </Pressable>

          <Button
            onPress={handleSubmit(signInHandler)}
            isLoading={isSubmitting}
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

        {/*Modal */}
        <Modal
          type={isVisible.type}
          isVisible={isVisible.visible}
          setCloseModel={() =>
            setIsVisible({ visible: false, message: "", type: "" })
          }
          message={isVisible.message}
        />
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
    alignSelf: "flex-end",
    color: theme.colors.secondaryText,
    fontWeight: theme.fontWeights.regular,
    fontSize: hp(1.8),
  },
});
