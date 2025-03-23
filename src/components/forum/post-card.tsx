// src/components/forum/post-card.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ForumPost } from '../../types/forum-types';

type PostCardProps = {
  post: ForumPost;
};

export default function PostCard({ post }: PostCardProps) {
  const router = useRouter();

  const handlePress = () => {
    // Updated to use the (externalPages) path
    router.push({
      pathname: '/(externalPages)/post',
      params: { postId: post.id }
    });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Text style={styles.title}>{post.title}</Text>
      <Text style={styles.author}>Posted by {post.authorName}</Text>
      <Text style={styles.date}>
        {new Date(post.createdAt).toLocaleDateString()}
      </Text>
      <Text style={styles.content} numberOfLines={3}>
        {post.content}
      </Text>
      <View style={styles.footer}>
        <Text style={styles.commentCount}>
          {post.commentCount || 0} comments
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  author: {
    fontSize: 14,
    color: '#666',
  },
  date: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  content: {
    fontSize: 16,
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  commentCount: {
    fontSize: 14,
    color: '#666',
  },
});