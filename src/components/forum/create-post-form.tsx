// src/components/forum/create-post-form.tsx
import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

type CreatePostFormProps = {
  onSubmit: (title: string, content: string) => void;
};

export default function CreatePostForm({ onSubmit }: CreatePostFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const router = useRouter();

  const handleSubmit = () => {
    if (title.trim() && content.trim()) {
      onSubmit(title, content);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create a New Post</Text>
      
      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.titleInput}
        value={title}
        onChangeText={setTitle}
        placeholder="Enter a title"
        placeholderTextColor="#6277bf80"
      />
      
      <Text style={styles.label}>Content</Text>
      <TextInput
        style={styles.contentInput}
        value={content}
        onChangeText={setContent}
        placeholder="What's on your mind?"
        multiline
        placeholderTextColor="#6277bf80"
      />
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.cancelButton} 
          onPress={() => router.back()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.submitButton, 
            (!title.trim() || !content.trim()) && styles.disabledButton
          ]} 
          onPress={handleSubmit}
          disabled={!title.trim() || !content.trim()}
        >
          <Text style={styles.submitButtonText}>Publish Post</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#ffffff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#6277bf',
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#6277bf',
  },
  titleInput: {
    borderWidth: 1,
    borderColor: '#cad3ed',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
    color: '#6277bf',
    backgroundColor: '#f8f9fd',
  },
  contentInput: {
    borderWidth: 1,
    borderColor: '#cad3ed',
    borderRadius: 12,
    padding: 12,
    marginBottom: 30,
    height: 200,
    textAlignVertical: 'top',
    fontSize: 16,
    color: '#6277bf',
    backgroundColor: '#f8f9fd',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: '#ff8f8f',
    borderRadius: 25,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#6277bf',
    borderRadius: 25,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#cad3ed',
  },
  submitButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});