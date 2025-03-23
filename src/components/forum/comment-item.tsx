// src/components/forum/comment-item.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ForumComment } from '@/src/types/forum-types';
import { formatDistanceToNow } from 'date-fns';

interface CommentItemProps {
  comment: ForumComment;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.authorName}>{comment.authorName}</Text>
        <Text style={styles.timestamp}>
          {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
        </Text>
      </View>
      
      <Text style={styles.content}>{comment.content}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#cad3ed',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  authorName: {
    fontWeight: '600',
    fontSize: 14,
    color: '#000000',
  },
  timestamp: {
    fontSize: 12,
    color: '#666666',
  },
  content: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
  },
});

export default CommentItem;