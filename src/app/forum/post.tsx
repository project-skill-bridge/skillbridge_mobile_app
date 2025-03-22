// src/app/forum/post.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useForumStore } from '@/src/store/forum-store';
import CommentItem from '@/src/components/forum/comment-item';
import CommentForm from '@/src/components/forum/comment-form';
import { Icons } from '@/src/constants/Icons';
import { formatDistanceToNow } from 'date-fns';

export default function PostDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { posts, comments, fetchComments, loading } = useForumStore();
  
  const post = posts.find(p => p.id === id);
  const postComments = comments[id || ''] || [];
  
  useEffect(() => {
    if (id) {
      fetchComments(id);
    }
  }, [id]);
  
  if (!post) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6277bf" />
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Icons.ArrowLeft size={24} color="#6277bf" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Discussion</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.postContainer}>
          <Text style={styles.postTitle}>{post.title}</Text>
          <Text style={styles.postContent}>{post.content}</Text>
          <View style={styles.postFooter}>
            <Text style={styles.postAuthor}>
              Posted by {post.authorName} • {formatDistanceToNow(post.createdAt, { addSuffix: true })}
            </Text>
          </View>
        </View>
        
        <View style={styles.commentsSection}>
          <Text style={styles.commentsTitle}>
            Comments ({postComments.length})
          </Text>
          
          {loading ? (
            <ActivityIndicator size="small" color="#6277bf" style={styles.loader} />
          ) : (
            <>
              {postComments.map(comment => (
                <CommentItem key={comment.id} comment={comment} />
              ))}
              
              {postComments.length === 0 && (
                <Text style={styles.noCommentsText}>
                  No comments yet. Be the first to respond!
                </Text>
              )}
            </>
          )}
        </View>
      </ScrollView>
      
      <View style={styles.commentFormContainer}>
        <CommentForm postId={id || ''} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f7',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#cad3ed',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6277bf',
  },
  placeholder: {
    width: 24,
  },
  content: {
    flex: 1,
  },
  postContainer: {
    backgroundColor: '#ffffff',
    padding: 16,
    margin: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  postTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
  },
  postContent: {
    fontSize: 16,
    color: '#333333',
    lineHeight: 24,
    marginBottom: 16,
  },
  postFooter: {
    borderTopWidth: 1,
    borderTopColor: '#cad3ed',
    paddingTop: 12,
  },
  postAuthor: {
    fontSize: 14,
    color: '#666666',
  },
  commentsSection: {
    padding: 16,
    paddingTop: 0,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
  },
  loader: {
    marginVertical: 16,
  },
  noCommentsText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginVertical: 16,
  },
  commentFormContainer: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#cad3ed',
  },
});