// src/components/forum/comment-form.tsx
import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';

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
      <TouchableOpacity 
        style={[styles.button, !comment.trim() && styles.disabledButton]} 
        onPress={handleSubmit}
        disabled={!comment.trim()}
      >
        <Text style={styles.buttonText}>Post Comment</Text>
      </TouchableOpacity>
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
  button: {
    backgroundColor: '#007bff', // Blue color matching your UI
    borderRadius: 4,
    paddingVertical: 12,
  },
  disabledButton: {
    backgroundColor: '#b3d7ff',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});