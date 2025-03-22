// src/components/forum/comment-form.tsx
import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useForumStore } from '@/src/store/forum-store';
import { Icons } from '@/src/constants/Icons';

interface CommentFormProps {
  postId: string;
}

const CommentForm: React.FC<CommentFormProps> = ({ postId }) => {
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createComment = useForumStore(state => state.createComment);
  
  const handleSubmit = async () => {
    if (!comment.trim()) return;
    
    setIsSubmitting(true);
    try {
      await createComment(postId, comment.trim());
      setComment('');
    } catch (error) {
      console.error('Error creating comment:', error);
      Alert.alert('Error', 'Failed to post comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Add a comment..."
        value={comment}
        onChangeText={setComment}
        multiline
        maxLength={500}
      />
      <TouchableOpacity 
        style={[
          styles.sendButton,
          (!comment.trim() || isSubmitting) && styles.disabledButton
        ]}
        onPress={handleSubmit}
        disabled={!comment.trim() || isSubmitting}
      >
        <Icons.Send size={20} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#cad3ed',
    marginVertical: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#6277bf',
    borderRadius: 20,
    padding: 8,
    marginLeft: 8,
  },
  disabledButton: {
    backgroundColor: '#cad3ed',
  },
});

export default CommentForm;