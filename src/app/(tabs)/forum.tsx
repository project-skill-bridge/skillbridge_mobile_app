// src/app/(tabs)/forum.tsx
import React, { useEffect } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useForumStore } from '../../store/forum-store';
import PostCard from '../../components/forum/post-card';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ForumScreen() {
  const { posts, fetchPosts, loading, error } = useForumStore();
  const router = useRouter();

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = () => {
    router.push('/(externalPages)/create-post');
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>Forum</Text>
        <TouchableOpacity 
          style={styles.createButton} 
          onPress={handleCreatePost}
        >
          <Text style={styles.createButtonText}>Create Post</Text>
        </TouchableOpacity>
      </View>

      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <PostCard post={item} />}
        contentContainerStyle={styles.listContent}
        refreshing={loading}
        onRefresh={fetchPosts}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  createButton: {
    backgroundColor: '#007bff', // Blue color matching your UI
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  listContent: {
    padding: 16,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 8,
  },
});