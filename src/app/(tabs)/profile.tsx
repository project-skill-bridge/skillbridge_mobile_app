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
import { useForm } from "react-hook-form";
import auth from "@react-native-firebase/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import firestore from "@react-native-firebase/firestore";
import { theme } from "@/src/constants/Theme";
import { hp, wp } from "@/src/utils/common";
import { Images } from "@/src/constants/Images";
import InputField from "@/src/components/input/Input-field";
import InputGroup from "@/src/components/input/input-group";
import InputLabel from "@/src/components/input/input-label";
import ErrorMessage from "@/src/components/input/error-message";
import { UpdateProfileSchema, UpdateProfileType } from "@/src/schema";
import Button from "@/src/components/ui/button";
import { useUserStore } from "@/src/store/user-store";
import { Icons } from "@/src/constants/Icons";
import { ModalState, User } from "@/src/types/type";
import Modal from "@/src/components/ui/modal";

const ProfileScreen = () => {
  const { user, setUser } = useUserStore();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    getFieldState,
  } = useForm<UpdateProfileType>({
    resolver: zodResolver(UpdateProfileSchema),
    defaultValues: {
      name: user?.name || "",
      mobile: user?.mobile || "",
      password: "******",
    },
    mode: "all",
  });

  const [isVisible, setIsVisible] = React.useState<ModalState>({
    visible: false,
    message: "",
    type: "",
  });

  const logOutHandler = async () => {
    await auth().signOut();
  };

  const updateProfileHandler = async ({
    name,
    password,
    mobile,
  }: UpdateProfileType) => {
    try {
      const userRef = firestore().collection("users").doc(user?.id);
      await userRef.update({
        name,
        mobile,
      });

      if (getFieldState("password").isDirty) {
        await auth().currentUser?.updatePassword(password);
      }

      setUser({ ...user, name, mobile } as User);
    } catch {
      setIsVisible({
        visible: true,
        message: "An error occurred. Please try again.",
        type: "error",
      });
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Your Profile</Text>
        <Button onPress={logOutHandler} style={styles.logout} variant="icon">
          <Icons.LogOut size={20} color="black" />
        </Button>
      </View>

      {/* Profile Image */}
      <View style={styles.imageContainer}>
        <Image source={user?.image || Images.avatar} resizeMode="contain" />
        <View style={styles.editImageIcon}>
          <Image source={Images.editImage} resizeMode="contain" />
        </View>
      </View>

      {/* User Info */}
      <View style={styles.userInforContainer}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.inputGroupContainer}>
            <InputGroup style={styles.inputGroup}>
              <InputLabel>Name</InputLabel>
              <InputField name="name" control={control} />
              {errors.name?.message && (
                <ErrorMessage message={errors.name.message} />
              )}
            </InputGroup>

            <InputGroup style={styles.inputGroup}>
              <InputLabel>Email</InputLabel>
              <InputField
                name="email"
                control={control}
                value={user?.email}
                keyboardType="email-address"
              />
            </InputGroup>

            <InputGroup style={styles.inputGroup}>
              <InputLabel>Mobile</InputLabel>
              <InputField
                name="mobile"
                control={control}
                keyboardType="phone-pad"
              />
              {errors.mobile?.message && (
                <ErrorMessage message={errors.mobile.message} />
              )}
            </InputGroup>

            <InputGroup style={styles.inputGroup}>
              <InputLabel>Password</InputLabel>
              <InputField name="password" control={control} secureTextEntry />
              {errors.password?.message && (
                <ErrorMessage message={errors.password.message} />
              )}
            </InputGroup>
          </View>
        </KeyboardAvoidingView>

        <Button
          style={styles.button}
          onPress={handleSubmit(updateProfileHandler)}
          isLoading={isSubmitting}
        >
          <Text style={theme.buttonTextDefaultStyle}>
            {isSubmitting ? "Submitting" : "Save"}
          </Text>
        </Button>

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
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    height: "100%",
    paddingHorizontal: wp(5),
    paddingVertical: hp(2),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp(2),
  },
  headerText: {
    fontSize: hp(3),
    fontWeight: theme.fontWeights.bold,
  },
  logout: {
    backgroundColor: "white",
    borderRadius: "50%",
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    marginBottom: hp(2),
  },
  editImageIcon: {
    position: "absolute",
    bottom: 5,
    right: "37%",
    backgroundColor: "white",
    padding: hp(0.8),
    borderRadius: "50%",
  },
  userInforContainer: {
    gap: hp(2),
    backgroundColor: "white",
    paddingHorizontal: wp(5),
    paddingVertical: hp(2),
    borderRadius: 16,
  },
  inputGroupContainer: {
    gap: hp(1.5),
  },
  inputGroup: {
    gap: hp(0.2),
  },
  button: {
    borderRadius: 10,
  },
});
