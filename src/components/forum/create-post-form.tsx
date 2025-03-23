// src/components/forum/create-post-form.tsx
import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import Button from '../ui/button';
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
        placeholder="Enter post title"
      />
      
      <Text style={styles.label}>Content</Text>
      <TextInput
        style={styles.contentInput}
        value={content}
        onChangeText={setContent}
        placeholder="Write your post content here..."
        multiline
      />
      
      <View style={styles.buttonContainer}>
        {/* Using children prop instead of label */}
        <Button 
          onPress={() => router.back()} 
          style={styles.cancelButton}
        >
          Cancel
        </Button>
        
        {/* Using children prop instead of label */}
        <Button 
          onPress={handleSubmit} 
          disabled={!title.trim() || !content.trim()}
        >
          Create Post
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  titleInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  contentInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 12,
    marginBottom: 24,
    height: 200,
    textAlignVertical: 'top',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: '#999',
  },
});