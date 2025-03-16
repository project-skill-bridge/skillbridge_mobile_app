// src/app/(tabs)/settings.tsx

import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import SettingsSection from '../../components/settings/settings-section';
import SettingsItem from '../../components/settings/settings-item';
import { hp, wp } from '@/src/utils/common';
import { theme } from '@/src/constants/Theme';
import { Icons } from '@/src/constants/Icons';

export default function SettingsScreen() {
  // Settings state
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticFeedbackEnabled, setHapticFeedbackEnabled] = useState(true);



  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>Settings</Text>
        
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
            // Check if you have a Volume icon in your Icons object
            // If not, you can leave IconComponent prop out
          />
          <SettingsItem
            title="Haptic Feedback"
            type="toggle"
            value={hapticFeedbackEnabled}
            onToggle={setHapticFeedbackEnabled}
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