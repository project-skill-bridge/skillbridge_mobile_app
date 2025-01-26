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
import { icons } from "@/src/constants/Icons";
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

const ProfileScreen = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateProfileType>({
    resolver: zodResolver(UpdateProfileSchema),
    defaultValues: {
      name: "",
      mobile: "",
      password: "",
    },
    mode: "all",
  });
  const [isLoading, setIsLoading] = React.useState(false);

  const logOutHandler = async () => {
    await auth().signOut();
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Your Profile</Text>
        <Pressable onPress={logOutHandler} style={styles.logout}>
          {icons.logout}
        </Pressable>
      </View>

      {/* Profile Image */}
      <View style={styles.imageContainer}>
        <Image source={images.avatar} resizeMode="contain" />
        <View style={styles.editImageIcon}>
          <Image source={images.editImage} resizeMode="contain" />
        </View>
      </View>

      {/* User Info */}
      <View style={styles.userInforContainer}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={{}}>
            <InputGroup>
              <InputLabel>Name</InputLabel>
              <InputField
                name="name"
                control={control}
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
                placeholder="Enter your email"
                keyboardType="email-address"
              />
            </InputGroup>

            <InputGroup>
              <InputLabel>Mobile</InputLabel>
              <InputField
                name="mobile"
                control={control}
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
                // secureTextEntry={true}
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
          <Button title="Save Changes" onPress={handleSubmit(() => {})} />
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
    paddingVertical: hp(5),
    gap: hp(2),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    paddingVertical: hp(4),
    borderRadius: 16,
  },
});
