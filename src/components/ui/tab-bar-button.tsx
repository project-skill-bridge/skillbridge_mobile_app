// src/components/ui/tab-bar-button.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { hp, wp } from '@/src/utils/common';
import { Icons } from '@/src/constants/Icons';
import { theme } from '@/src/constants/Theme';

interface TabBarButtonProps {
  label: string;
  isFocused: boolean;
  onPress: () => void;
  routeName: string;
}

const TabBarButton: React.FC<TabBarButtonProps> = ({
  label,
  isFocused,
  onPress,
  routeName,
}) => {
  // Get the appropriate icon based on the route name
  const getIcon = () => {
    const color = isFocused ? '#6277bf' : '#8c8c8c';
    const size = hp(2.8);

    switch (routeName) {
      case 'home':
        return <Icons.Home color={color} size={size} />;
      case 'progress':
        return <Icons.BarChart color={color} size={size} />;
      case 'forum':
        return <Icons.MessageCircle color={color} size={size} />;
      case 'settings':
        return <Icons.Settings color={color} size={size} />;
      default:
        return <Icons.Home color={color} size={size} />;
    }
  };

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      activeOpacity={0.7}

    >
      {getIcon()}
      <Text
        style={[
          styles.label,
          { color: isFocused ? '#6277bf' : '#8c8c8c' },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};



const styles = StyleSheet.create({
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(1),
  },
  label: {
    fontSize: hp(1.6),
    marginTop: hp(0.5),
    fontWeight: '500',
  },
});

export default TabBarButton;