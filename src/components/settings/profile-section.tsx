import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useUserStore } from '@/src/store/user-store';
import { Images } from '@/src/constants/Images';
import { hp, wp } from '@/src/utils/common';
import { theme } from '@/src/constants/Theme';

const ProfileSection: React.FC = () => {
  const router = useRouter();
  const { user } = useUserStore();
  
  const handleEditProfile = () => {
    // Navigate to the existing profile tab
    router.push('/(tabs)/profile');
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Image 
            source={user?.image || Images.avatar} 
            style={styles.avatar}
            resizeMode="contain" 
          />
        </View>
        <View style={styles.userInfoContainer}>
          <Text style={styles.userName}>{user?.name || 'User'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'No email provided'}</Text>
          
          {user?.mobile && (
            <Text style={styles.userMobile}>{user.mobile}</Text>
          )}
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.editButton} 
        onPress={handleEditProfile}
      >
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: wp(20),
    height: wp(20),
    borderRadius: wp(10),
  },
  userInfoContainer: {
    flex: 1,
  },
  userName: {
    fontSize: hp(2.5),
    fontWeight: theme.fontWeights.bold,
    color: '#000000',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: hp(1.8),
    color: '#666666',
    marginBottom: 4,
  },
  userMobile: {
    fontSize: hp(1.8),
    color: '#666666',
  },
  editButton: {
    backgroundColor: '#6277bf',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  editButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ProfileSection;