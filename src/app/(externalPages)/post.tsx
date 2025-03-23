// src/app/(externalPages)/post.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useForumStore } from '../../store/forum-store';
import CommentForm from '../../components/forum/comment-form';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ForumPostScreen() {
  const { postId } = useLocalSearchParams();
  const { posts, comments, fetchComments, createComment, loading, error } = useForumStore();
  
  // Find the post from the store
  const post = posts.find(p => p.id === postId);
  
  useEffect(() => {
    if (postId) {
      fetchComments(postId as string);
    }
  }, [postId]);
  
  const handleAddComment = (content: string) => {
    createComment(postId as string, content);
  };
  
  const postComments = comments[postId as string] || [];
  
  if (!post) {
    return (
      <View style={styles.centered}>
        <Text>Post not found</Text>
      </View>
    );
  }
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.postContainer}>
          <Text style={styles.title}>{post.title}</Text>
          <Text style={styles.author}>Posted by {post.authorName}</Text>
          <Text style={styles.date}>
            {new Date(post.createdAt).toLocaleDateString()}
          </Text>
          <Text style={styles.content}>{post.content}</Text>
        </View>
        
        <View style={styles.commentsContainer}>
          <Text style={styles.commentsTitle}>
            Comments ({postComments.length})
          </Text>
          
          {loading && (
            <ActivityIndicator size="small" color="#0000ff" />
          )}
          
          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}
          
          {postComments.map(comment => (
            <View key={comment.id} style={styles.commentItem}>
              <Text style={styles.commentAuthor}>{comment.authorName}</Text>
              <Text style={styles.commentDate}>
                {new Date(comment.createdAt).toLocaleDateString()}
              </Text>
              <Text style={styles.commentContent}>{comment.content}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
      
      <CommentForm onSubmit={handleAddComment} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 22,
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
    marginBottom: 16,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
  },
  commentsContainer: {
    padding: 16,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  commentItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  commentDate: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  commentContent: {
    fontSize: 14,
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
  },
});