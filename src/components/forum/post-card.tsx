// src/components/forum/post-card.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ForumPost } from '../../types/forum-types';
import { useForumStore } from '../../store/forum-store';
import auth from '@react-native-firebase/auth';

type PostCardProps = {
  post: ForumPost;
};

export default function PostCard({ post }: PostCardProps) {
  const router = useRouter();
  const { deletePost } = useForumStore();
  const currentUser = auth().currentUser;
  const isAuthor = currentUser && currentUser.uid === post.authorId;

  const handlePress = () => {
    router.push(`/post?postId=${post.id}`);
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Post",
      "Are you sure you want to delete this post?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete", 
          onPress: () => deletePost(post.id),
          style: "destructive"
        }
      ]
    );
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.header}>
        <Text style={styles.title}>{post.title}</Text>
        {isAuthor && (
          <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        )}
      </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    flex: 1,
  },
  deleteButton: {
    backgroundColor: '#ff3b30',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 12,
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