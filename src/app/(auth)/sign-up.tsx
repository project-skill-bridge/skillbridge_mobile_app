import * as React from "react";

import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Link } from "expo-router";
import { hp, wp } from "@/src/utils/common";
import { theme } from "@/src/constants/Theme";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import auth from "@react-native-firebase/auth";
import Button from "@/src/components/ui/button";
import InputField from "@/src/components/input/Input-field";
import GoogleAuthButton from "@/src/components/ui/google-auth-provider";
import { RegisterFormType, RegisterSchema } from "@/src/schema";
import InputGroup from "@/src/components/input/input-group";
import InputLabel from "@/src/components/input/input-label";
import ErrorMessage from "@/src/components/input/error-message";
import firestore from "@react-native-firebase/firestore";
import { Icons } from "@/src/constants/Icons";
import { ModalState } from "@/src/types/type";
import Modal from "@/src/components/ui/modal";

const SignUpScreen = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
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

  const [isVisible, setIsVisible] = React.useState<ModalState>({
    visible: false,
    message: "",
    type: null,
  });

  const signUpHandler = async (formData: RegisterFormType) => {
    try {
      const { email, password } = formData;
      const { user } = await auth().createUserWithEmailAndPassword(
        email,
        password
      );
      await user.sendEmailVerification();

      await firestore().collection("users").doc(user.uid).set({
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
    } catch (error) {
      if (error instanceof Error) {
        setIsVisible({
          visible: true,
          message: error.message,
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
                  icon={
                    <Icons.User size={22} color={theme.colors.primaryText} />
                  }
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
                <InputLabel>Mobile</InputLabel>
                <InputField
                  name="mobile"
                  control={control}
                  icon={
                    <Icons.Smartphone
                      size={22}
                      color={theme.colors.primaryText}
                    />
                  }
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

          <Button
            onPress={handleSubmit(signUpHandler)}
            isLoading={isSubmitting}
            showShadow
          >
            <Text style={theme.buttonTextDefaultStyle}>Sign Up</Text>
          </Button>

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

        {/*Modal */}
        <Modal
          type={isVisible.type}
          isVisible={isVisible.visible}
          setCloseModel={() =>
            setIsVisible({ visible: false, message: "", type: null })
          }
          message={isVisible.message}
        />
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
