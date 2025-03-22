// src/components/forum/post-card.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ForumPost } from '@/src/types/forum-types';
import { useRouter } from 'expo-router';
import { Icons } from '@/src/constants/Icons';
import { formatDistanceToNow } from 'date-fns';

interface PostCardProps {
  post: ForumPost;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const router = useRouter();
  
const navigateToPost = () => {
  // Cast the path to 'any' to bypass TypeScript's strict checking
  router.push(`/forum/post/${post.id}` as any);
}
  
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={navigateToPost}
      activeOpacity={0.8}
    >
      <Text style={styles.title}>{post.title}</Text>
      <Text style={styles.content} numberOfLines={2}>{post.content}</Text>
      
      <View style={styles.footer}>
        <Text style={styles.authorInfo}>
          Posted by {post.authorName} • {formatDistanceToNow(post.createdAt, { addSuffix: true })}
        </Text>
        
        <View style={styles.commentInfo}>
          <Icons.MessageCircle size={16} color="#6277bf" />
          <Text style={styles.commentCount}>{post.commentCount}</Text>
        </View>
      </View>
    </TouchableOpacity>
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
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
  },
  content: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#cad3ed',
    paddingTop: 12,
  },
  authorInfo: {
    fontSize: 12,
    color: '#666666',
  },
  commentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentCount: {
    marginLeft: 4,
    fontSize: 12,
    color: '#6277bf',
  },
});

export default PostCard;