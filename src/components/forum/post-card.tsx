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
    <TouchableOpacity style={styles.container} onPress={handlePress} activeOpacity={0.7}>
      <View style={styles.header}>
        <Text style={styles.title}>{post.title}</Text>
        {isAuthor && (
          <TouchableOpacity onPress={handleDelete} style={styles.deleteButton} hitSlop={{top: 10, right: 10, bottom: 10, left: 10}}>
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
        <View style={styles.commentBadge}>
          <Text style={styles.commentCount}>
            {post.commentCount || 0} comments
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#6277bf',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#cad3ed',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    flex: 1,
    color: '#6277bf',
  },
  deleteButton: {
    backgroundColor: '#e85454',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginLeft: 8,
  },
  deleteButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  author: {
    fontSize: 14,
    color: '#6277bf',
    fontWeight: '500',
  },
  date: {
    fontSize: 12,
    color: '#6277bf',
    opacity: 0.7,
    marginBottom: 12,
  },
  content: {
    fontSize: 15,
    marginBottom: 16,
    lineHeight: 22,
    color: '#333333',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  commentBadge: {
    backgroundColor: '#cad3ed',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  commentCount: {
    fontSize: 12,
    color: '#6277bf',
    fontWeight: '600',
  },
});