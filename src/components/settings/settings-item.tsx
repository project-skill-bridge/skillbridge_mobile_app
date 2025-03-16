// Create src/components/settings/settings-item.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type SettingsItemType = 'toggle' | 'navigate' | 'action';

interface SettingsItemProps {
  icon?: string;
  title: string;
  subtitle?: string;
  type: SettingsItemType;
  value?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
  isDestructive?: boolean;
  isLast?: boolean;
}

const SettingsItem: React.FC<SettingsItemProps> = ({ 
  icon, 
  title, 
  subtitle, 
  type, 
  value, 
  onPress, 
  onToggle,
  isDestructive = false,
  isLast = false
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
      {icon && (
        <View style={styles.iconContainer}>
          <Ionicons 
            name={icon as any} 
            size={22} 
            color={isDestructive ? '#e85454' : '#6277bf'} 
          />
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
        <Ionicons 
          name="chevron-forward" 
          size={20} 
          color="#999999" 
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
  },
  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#cad3ed',
  },
  iconContainer: {
    width: 28,
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
  },
  destructiveText: {
    color: '#e85454',
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
  },
});

export default SettingsItem;