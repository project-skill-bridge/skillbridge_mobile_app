// src/components/forum/comment-form.tsx
import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Button from '../ui/button';

type CommentFormProps = {
  onSubmit: (comment: string) => void;
};

export default function CommentForm({ onSubmit }: CommentFormProps) {
  const [comment, setComment] = useState('');
  
  const handleSubmit = () => {
    if (comment.trim()) {
      onSubmit(comment);
      setComment('');
    }
  };
  
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={comment}
        onChangeText={setComment}
        placeholder="Write a comment..."
        multiline
      />
      {/* Using children prop instead of label */}
      <Button 
        onPress={handleSubmit} 
        disabled={!comment.trim()}
      >
        Post Comment
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  input: {
    height: 80,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
    textAlignVertical: 'top',
  },
});