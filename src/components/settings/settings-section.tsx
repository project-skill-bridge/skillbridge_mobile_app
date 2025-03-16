// src/components/settings/settings-section.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { hp } from '@/src/utils/common';
import { theme } from '@/src/constants/Theme';

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({ title, children }) => {
  return (
    <View style={styles.section}>
      {title ? <Text style={styles.sectionTitle}>{title}</Text> : null}
      <View style={styles.sectionContent}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: hp(2),
  },
  sectionTitle: {
    fontSize: hp(2),
    fontWeight: theme.fontWeights.bold,
    color: '#6277bf',
    marginBottom: hp(1),
    paddingHorizontal: 4,
  },
  sectionContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});

export default SettingsSection;