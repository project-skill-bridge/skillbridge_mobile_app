import * as React from "react";

import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import auth from "@react-native-firebase/auth";
import { theme } from "@/src/constants/Theme";
import { hp, wp } from "@/src/utils/common";
import { images } from "@/src/constants/Images";
import InputField from "@/src/components/input/Input-field";
import InputGroup from "@/src/components/input/input-group";
import InputLabel from "@/src/components/input/input-label";
import ErrorMessage from "@/src/components/input/error-message";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateProfileSchema, UpdateProfileType } from "@/src/schema";
import Loader from "@/src/components/ui/loader";
import Button from "@/src/components/ui/button";
import { useUserStore } from "@/src/store/user-store";
import Icon from "@/src/constants/Icons";

const ProfileScreen = () => {
  const { user } = useUserStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateProfileType>({
    resolver: zodResolver(UpdateProfileSchema),
    defaultValues: {
      name: user?.name || "",
      mobile: user?.mobile || "Not Provided",
      password: "******",
    },
    mode: "all",
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [isNameEditable, setIsNameEditable] = React.useState(false);
  const [isMobileEditable, setIsMobileEditable] = React.useState(false);
  const [isPasswordEditable, setIsPasswordEditable] = React.useState(false);

  const logOutHandler = async () => {
    await auth().signOut();
  };

  const updateProfileHandler = async (data: UpdateProfileType) => {
    setIsLoading(true);
    console.log(data);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Your Profile</Text>
        <Pressable onPress={logOutHandler} style={styles.logout}>
          <Icon name="logout" size={20} />
        </Pressable>
      </View>

      {/* Profile Image */}
      <View style={styles.imageContainer}>
        <Image source={user?.image || images.avatar} resizeMode="contain" />
        <View style={styles.editImageIcon}>
          <Image source={images.editImage} resizeMode="contain" />
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
              <InputField
                name="name"
                control={control}
                rightIcon={<Icon name="edit" />}
                editable={isNameEditable}
              />
              {errors.name?.message && (
                <ErrorMessage message={errors.name.message} />
              )}
            </InputGroup>

            <InputGroup style={styles.inputGroup}>
              <InputLabel>Email</InputLabel>
              <InputField
                name="email"
                editable={false}
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
                rightIcon={<Icon name="edit" />}
                keyboardType="phone-pad"
                editable={isMobileEditable}
              />
              {errors.mobile?.message && (
                <ErrorMessage message={errors.mobile.message} />
              )}
            </InputGroup>

            <InputGroup style={styles.inputGroup}>
              <InputLabel>Password</InputLabel>
              <InputField
                name="password"
                control={control}
                rightIcon={<Icon name="edit" />}
                editable={isPasswordEditable}
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
          <Button
            style={{
              width: "30%",
              borderRadius: 8,
              alignSelf: "flex-end",
              paddingVertical: hp(1.5),
            }}
            title="Save"
            onPress={handleSubmit(updateProfileHandler)}
          />
        )}
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
    padding: hp(1.2),
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
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
});
