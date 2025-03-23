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
        placeholderTextColor="#6277bf"
      />
      <TouchableOpacity 
        style={[styles.button, !comment.trim() && styles.disabledButton]} 
        onPress={handleSubmit}
        disabled={!comment.trim()}
      >
        <Text style={styles.buttonText}>Post</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#cad3ed',
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: '#cad3ed',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    textAlignVertical: 'top',
    color: '#6277bf',
  },
  button: {
    backgroundColor: '#6277bf',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#cad3ed',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});