// Update src/app/(tabs)/settings.tsx to add the preferences section

import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Text, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import ProfileSection from '../../components/settings/profile-section';
import SettingsSection from '../../components/settings/settings-section';
import SettingsItem from '../../components/settings/settings-item';
import { hp, wp } from '@/src/utils/common';
import { theme } from '@/src/constants/Theme';
import { Icons } from '@/src/constants/Icons';

export default function SettingsScreen() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticFeedbackEnabled, setHapticFeedbackEnabled] = useState(true);
  
  const handleLanguageChange = () => {
    Alert.alert("Coming Soon", "Language settings will be available soon!");
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>Settings</Text>
        
        {/* Profile Section */}
        <ProfileSection />
        
        {/* App Settings */}
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
        
        {/* Preferences */}
        <SettingsSection title="Preferences">
          <SettingsItem
            title="Language"
            subtitle="English"
            type="navigate"
            onPress={handleLanguageChange}
            isLast={true}
          />
        </SettingsSection>
        
        {/* Bottom padding for scrolling */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f7',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f7',
    padding: wp(5),
  },
  heading: {
    fontSize: hp(3),
    fontWeight: theme.fontWeights.bold,
    color: '#6277bf',
    marginBottom: hp(2),
    marginTop: hp(1),
  },
  bottomPadding: {
    height: hp(3),
  },
});