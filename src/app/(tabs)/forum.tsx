// src/app/(tabs)/forum.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForumStore } from '@/src/store/forum-store';
import PostCard from '@/src/components/forum/post-card';
import { Icons } from '@/src/constants/Icons';
import { useRouter } from 'expo-router';

export default function ForumScreen() {
  const router = useRouter();
  const { posts, fetchPosts, loading } = useForumStore();
  const [refreshing, setRefreshing] = useState(false);
  
  useEffect(() => {
    fetchPosts();
  }, []);
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  };
  
  const navigateToCreatePost = () => {
    // Use a relative path without the leading slash and cast to 'any' to bypass type checking
    router.push('forum/create' as any);
  }
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Parent Forum</Text>
      </View>
      
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PostCard post={item} />}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={handleRefresh}
            colors={['#6277bf']}
            tintColor="#6277bf"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No posts yet. Be the first to start a discussion!</Text>
          </View>
        }
      />
      
      <TouchableOpacity 
        style={styles.fabButton}
        onPress={navigateToCreatePost}
      >
        <Icons.Plus size={24} color="#ffffff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f7',
  },
  header: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#cad3ed',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6277bf',
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  fabButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6277bf',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});