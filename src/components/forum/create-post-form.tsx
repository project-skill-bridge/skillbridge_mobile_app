// src/components/forum/create-post-form.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Alert } from 'react-native';
import { useForumStore } from '@/src/store/forum-store';
import { useRouter } from 'expo-router';
import Button from '@/src/components/ui/button';

const CreatePostForm: React.FC = () => {
  const router = useRouter();
  const createPost = useForumStore(state => state.createPost);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Error', 'Please enter both title and content for your post.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const postId = await createPost(title.trim(), content.trim());
      if (postId) {
        Alert.alert('Success', 'Your post has been created!');
        router.back();
      } else {
        Alert.alert('Error', 'Failed to create post. Please try again.');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('Error', 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Create a New Post</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.titleInput}
          placeholder="Enter a title for your post"
          value={title}
          onChangeText={setTitle}
          maxLength={100}
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Content</Text>
        <TextInput
          style={styles.contentInput}
          placeholder="Share your thoughts, questions, or experiences..."
          value={content}
          onChangeText={setContent}
          multiline
          textAlignVertical="top"
          maxLength={1000}
        />
      </View>
      
      <Button 
        onPress={handleSubmit} 
        style={styles.submitButton}
        disabled={isSubmitting}
      >
        <Text style={styles.submitButtonText}>
          {isSubmitting ? 'Posting...' : 'Create Post'}
        </Text>
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f7',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6277bf',
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  titleInput: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cad3ed',
    padding: 12,
    fontSize: 16,
  },
  contentInput: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cad3ed',
    padding: 12,
    fontSize: 16,
    minHeight: 150,
  },
  submitButton: {
    backgroundColor: '#6277bf',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CreatePostForm;