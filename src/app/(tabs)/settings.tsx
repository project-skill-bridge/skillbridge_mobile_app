// src/app/(tabs)/settings.tsx

import React, { useState } from "react";
import { ScrollView, StyleSheet, View, Text, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import ProfileSection from "../../components/settings/profile-section";
import SettingsSection from "../../components/settings/settings-section";
import SettingsItem from "../../components/settings/settings-item";
import { hp, wp } from "@/src/utils/common";
import { theme } from "@/src/constants/Theme";
import { Icons } from "@/src/constants/Icons";
import auth from "@react-native-firebase/auth";

export default function SettingsScreen() {
  const router = useRouter();

  // App settings state
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticFeedbackEnabled, setHapticFeedbackEnabled] = useState(true);

  const handleLanguageChange = () => {
    Alert.alert("Coming Soon", "Language settings will be available soon!");
  };

  const handleGameHistory = () => {
    Alert.alert("Game History", "View your previous games and performance.");
  };

  const handleHelpSupport = () => {
    Alert.alert(
      "Help & Support",
      "Need help? Contact us at support@skillbridge.com"
    );
  };

  const handleAbout = () => {
    Alert.alert(
      "About Skill-Bridge",
      "Version 1.0.0\n\nSkill-Bridge is an educational gaming platform designed to help children with special needs learn essential life skills through interactive games."
    );
  };

  const handleTerms = () => {
    Alert.alert(
      "Terms of Service",
      "By using Skill-Bridge, you agree to our terms of service which can be found on our website."
    );
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await auth().signOut();
            router.replace("/sign-in");
          } catch (error) {
            console.error("Logout error:", error);
            Alert.alert("Error", "Failed to logout. Please try again.");
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>Settings</Text>

        <ProfileSection />

        <SettingsSection title="App Settings">
          <SettingsItem
            title="Notifications"
            type="toggle"
            value={notificationsEnabled}
            onToggle={setNotificationsEnabled}
            IconComponent={<Icons.Bell size={22} color="#6277bf" />}
          />
          <SettingsItem
            title="Sound Effects"
            type="toggle"
            value={soundEnabled}
            onToggle={setSoundEnabled}
            IconComponent={<Icons.Volume2 size={22} color="#6277bf" />}
          />
          <SettingsItem
            title="Haptic Feedback"
            type="toggle"
            value={hapticFeedbackEnabled}
            onToggle={setHapticFeedbackEnabled}
            isLast={true}
          />
        </SettingsSection>

        <SettingsSection title="Preferences">
          <SettingsItem
            title="Language"
            subtitle="English"
            type="navigate"
            onPress={handleLanguageChange}
            isLast={true}
          />
        </SettingsSection>

        <SettingsSection title="Game Stats">
          <SettingsItem
            title="Game History"
            type="navigate"
            onPress={handleGameHistory}
            IconComponent={<Icons.ChartLine size={22} color="#6277bf" />}
          />
        </SettingsSection>

        <SettingsSection title="Support & About">
          <SettingsItem
            title="Help & Support"
            type="navigate"
            onPress={handleHelpSupport}
          />
          <SettingsItem
            title="About Skill-Bridge"
            type="navigate"
            onPress={handleAbout}
          />
          <SettingsItem
            title="Terms of Service"
            type="navigate"
            onPress={handleTerms}
            isLast={true}
          />
        </SettingsSection>

        <SettingsSection title="">
          <SettingsItem
            title="Logout"
            type="action"
            onPress={handleLogout}
            isDestructive={true}
            IconComponent={<Icons.LogOut size={22} color="#e85454" />}
            isLast={true}
          />
        </SettingsSection>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f7",
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f5f7",
    padding: wp(5),
  },
  heading: {
    fontSize: hp(3),
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.primary,
    marginBottom: hp(2),
    marginTop: hp(1),
  },
  bottomPadding: {
    height: hp(3),
  },
});
