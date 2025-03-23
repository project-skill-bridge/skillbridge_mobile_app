// src/app/forum/create.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useForumStore } from '../../store/forum-store';
import CreatePostForm from '../../components/forum/create-post-form';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CreatePostScreen() {
  const { createPost } = useForumStore();
  const router = useRouter();

  const handleSubmit = async (title: string, content: string) => {
    const postId = await createPost(title, content);
    if (postId) {
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <CreatePostForm onSubmit={handleSubmit} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});