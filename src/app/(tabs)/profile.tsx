import * as React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import auth from "@react-native-firebase/auth";
import { icons } from "@/src/constants/Icons";
import { theme } from "@/src/constants/Theme";
import { hp, wp } from "@/src/utils/common";
import { images } from "@/src/constants/Images";
import InputField from "@/src/components/ui/InputField";

const ProfileScreen = () => {
  const logOutHandler = async () => {
    await auth().signOut();
  };

  return (
    <View style={styles.container}>
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
        <InputField label="Name" rightIcon={icons.edit} value="Jennifer" />
        <InputField label="Email" value="test@testgmail.com" />
        <InputField
          label="Phone Number"
          rightIcon={icons.edit}
          value="01726252422"
        />
        <InputField label="Password" rightIcon={icons.edit} value="********" />
      </View>
    </View>
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
