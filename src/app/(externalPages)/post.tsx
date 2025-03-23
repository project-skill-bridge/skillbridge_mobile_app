// src/app/(externalPages)/post.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useForumStore } from '../../store/forum-store';
import CommentForm from '../../components/forum/comment-form';
import { SafeAreaView } from 'react-native-safe-area-context';
import auth from '@react-native-firebase/auth';

export default function ForumPostScreen() {
  const { postId } = useLocalSearchParams();
  const { posts, comments, fetchComments, createComment, deleteComment, loading, error } = useForumStore();
  const router = useRouter();
  
  // Find the post from the store
  const post = posts.find(p => p.id === postId);
  const currentUser = auth().currentUser;
  
  useEffect(() => {
    if (postId) {
      fetchComments(postId as string);
    }
  }, [postId]);
  
  const handleAddComment = (content: string) => {
    createComment(postId as string, content);
  };

  const handleDeleteComment = (commentId: string) => {
    deleteComment(postId as string, commentId);
  };
  
  const postComments = comments[postId as string] || [];
  
  if (!post) {
    return (
      <View style={styles.centered}>
        <Text style={styles.notFoundText}>Post not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.postContainer}>
          <Text style={styles.title}>{post.title}</Text>
          <View style={styles.authorRow}>
            <Text style={styles.author}>Posted by {post.authorName}</Text>
            <Text style={styles.date}>
              {new Date(post.createdAt).toLocaleDateString()}
            </Text>
          </View>
          <Text style={styles.content}>{post.content}</Text>
        </View>
        
        <View style={styles.commentsContainer}>
          <Text style={styles.commentsTitle}>
            Comments ({postComments.length})
          </Text>
          
          {loading && (
            <ActivityIndicator size="small" color="#6277bf" style={styles.loader} />
          )}
          
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
          
          {postComments.length === 0 && !loading && (
            <View style={styles.noCommentsContainer}>
              <Text style={styles.noCommentsText}>No comments yet. Be the first to comment!</Text>
            </View>
          )}
          
          {postComments.map(comment => (
            <View key={comment.id} style={styles.commentItem}>
              <View style={styles.commentHeader}>
                <Text style={styles.commentAuthor}>{comment.authorName}</Text>
                {currentUser && currentUser.uid === comment.authorId && (
                  <TouchableOpacity 
                    onPress={() => handleDeleteComment(comment.id)}
                    hitSlop={{top: 10, right: 10, bottom: 10, left: 10}}
                  >
                    <Text style={styles.deleteCommentText}>Delete</Text>
                  </TouchableOpacity>
                )}
              </View>
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
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  notFoundText: {
    fontSize: 18,
    color: '#6277bf',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#6277bf',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  backButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  postContainer: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#cad3ed',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#6277bf',
  },
  authorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  author: {
    fontSize: 14,
    color: '#6277bf',
    fontWeight: '500',
  },
  date: {
    fontSize: 14,
    color: '#6277bf',
    opacity: 0.7,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333333',
  },
  commentsContainer: {
    padding: 20,
  },
  commentsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#6277bf',
  },
  loader: {
    marginVertical: 20,
  },
  errorContainer: {
    backgroundColor: '#ff8f8f',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#ffffff',
    textAlign: 'center',
  },
  noCommentsContainer: {
    padding: 20,
    backgroundColor: '#cad3ed',
    borderRadius: 8,
    alignItems: 'center',
  },
  noCommentsText: {
    color: '#6277bf',
    fontStyle: 'italic',
  },
  commentItem: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#f8f9fd',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#6277bf',
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  commentAuthor: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#6277bf',
  },
  deleteCommentText: {
    fontSize: 13,
    color: '#e85454',
    fontWeight: '600',
  },
  commentDate: {
    fontSize: 12,
    color: '#6277bf',
    opacity: 0.7,
    marginBottom: 8,
  },
  commentContent: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333333',
  },
});