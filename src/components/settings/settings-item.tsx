import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { hp, wp } from '@/src/utils/common';
import { Icons } from '@/src/constants/Icons';

type SettingsItemType = 'toggle' | 'navigate' | 'action';

interface SettingsItemProps {
  title: string;
  subtitle?: string;
  type: SettingsItemType;
  value?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
  isDestructive?: boolean;
  isLast?: boolean;
  IconComponent?: React.ReactNode;
}

const SettingsItem: React.FC<SettingsItemProps> = ({ 
  title, 
  subtitle, 
  type, 
  value, 
  onPress, 
  onToggle,
  isDestructive = false,
  isLast = false,
  IconComponent
}) => {
  const handlePress = () => {
    if (type !== 'toggle' && onPress) {
      onPress();
    }
  };

  return (
    <TouchableOpacity 
      style={[
        styles.item, 
        !isLast && styles.itemBorder
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {IconComponent && (
        <View style={styles.iconContainer}>
          {IconComponent}
        </View>
      )}
      
      <View style={styles.textContainer}>
        <Text style={[
          styles.title, 
          isDestructive && styles.destructiveText
        ]}>
          {title}
        </Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      
      {type === 'toggle' && (
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: '#cad3ed', true: '#6277bf' }}
          thumbColor={'#ffffff'}
          ios_backgroundColor="#cad3ed"
        />
      )}
      
      {type === 'navigate' && (
        <Icons.ChevronLeft size={20} color="#999999" style={{ transform: [{ scaleX: -1 }] }} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(4),
    backgroundColor: '#ffffff',
  },
  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#cad3ed',
  },
  iconContainer: {
    width: wp(7),
    alignItems: 'center',
    marginRight: wp(3),
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: hp(2),
    color: '#000000',
    fontWeight: '500',
  },
  destructiveText: {
    color: '#e85454',
  },
  subtitle: {
    fontSize: hp(1.5),
    color: '#666666',
    marginTop: hp(0.3),
  },
});

export default SettingsItem;