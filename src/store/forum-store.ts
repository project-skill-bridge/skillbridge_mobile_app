// src/store/forum-store.ts
import { create } from 'zustand';
import { ForumPost, ForumComment } from '../types/forum-types';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

// Helper function to safely convert Firestore timestamps
const safeTimestamp = (timestamp: any): number => {
  if (!timestamp) return Date.now();

  // For React Native Firebase timestamps
  if (timestamp && timestamp.toDate && typeof timestamp.toDate === 'function') {
    return timestamp.toDate().getTime();
  }

  // For server timestamps that are already numbers
  if (typeof timestamp === 'number') {
    return timestamp;
  }

  // For any other timestamp-like object
  if (timestamp && timestamp.seconds) {
    return timestamp.seconds * 1000;
  }

  return Date.now();
};

interface ForumState {
  posts: ForumPost[];
  comments: Record<string, ForumComment[]>;
  loading: boolean;
  error: string | null;
}

export const useForumStore = create<ForumState & {
  fetchPosts: () => Promise<void>;
  fetchComments: (postId: string) => Promise<void>;
  createPost: (title: string, content: string) => Promise<string>;
  createComment: (postId: string, content: string) => Promise<void>;
}>((set) => ({
  posts: [],
  comments: {},
  loading: false,
  error: null,

  fetchPosts: async () => {
    set({ loading: true, error: null });
    try {
      // Fetch posts from the top-level posts collection
      const postsSnapshot = await firestore()
        .collection('posts')
        .orderBy('createdAt', 'desc')
        .get();

      const posts = postsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: safeTimestamp(data.createdAt),
          updatedAt: safeTimestamp(data.updatedAt),
          // Ensure other expected fields are present
          title: data.title || '',
          content: data.content || '',
          authorId: data.authorId || '',
          authorName: data.authorName || 'Anonymous',
          commentCount: data.commentCount || 0
        } as ForumPost;
      });

      set({ posts, loading: false });
    } catch (error) {
      console.error('Error fetching posts:', error);
      set({
        error: 'Failed to load posts. Please check your connection.',
        loading: false
      });
    }
  },

  fetchComments: async (postId: string) => {
    set({ loading: true, error: null });
    try {
      // Fetch comments from the nested subcollection
      const commentsSnapshot = await firestore()
        .collection('posts')
        .doc(postId)
        .collection('comments')
        .orderBy('createdAt', 'asc')
        .get();

      const comments = commentsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          postId,
          authorId: data.userId || '', // Map userId to authorId for consistency
          authorName: data.authorName || 'Anonymous',
          content: data.text || '', // Map text to content for consistency
          createdAt: safeTimestamp(data.createdAt),
          updatedAt: safeTimestamp(data.updatedAt)
        } as ForumComment;
      });

      set((state) => ({
        ...state,
        comments: { ...state.comments, [postId]: comments },
        loading: false
      }));
    } catch (error) {
      console.error('Error fetching comments:', error);
      set((state) => ({
        ...state,
        error: 'Failed to load comments',
        loading: false
      }));
    }
  },

  createPost: async (title: string, content: string) => {
    set({ loading: true, error: null });
    try {
      const user = auth().currentUser;
      if (!user) throw new Error('User not authenticated');

      const now = firestore.FieldValue.serverTimestamp();

      const postData = {
        authorId: user.uid,
        authorName: user.displayName || 'Anonymous',
        title,
        content,
        createdAt: now,
        updatedAt: now,
        commentCount: 0
      };

      // Add document to the posts collection
      const postRef = await firestore()
        .collection('posts')
        .add(postData);

      const newPost = {
        id: postRef.id,
        ...postData,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      } as ForumPost;

      set((state) => ({
        ...state,
        posts: [newPost, ...state.posts],
        loading: false
      }));

      return postRef.id;
    } catch (error) {
      console.error('Error creating post:', error);
      set({ error: 'Failed to create post', loading: false });
      return '';
    }
  },

  createComment: async (postId: string, content: string) => {
    set({ loading: true, error: null });
    try {
      const user = auth().currentUser;
      if (!user) throw new Error('User not authenticated');

      const now = firestore.FieldValue.serverTimestamp();

      const commentData = {
        userId: user.uid, // Using userId as per your schema
        authorName: user.displayName || 'Anonymous',
        text: content,    // Using text as per your schema
        createdAt: now,
        updatedAt: now,
      };

      // Add to the comments subcollection under the specific post
      const commentRef = await firestore()
        .collection('posts')
        .doc(postId)
        .collection('comments')
        .add(commentData);

      // Try to update the post's comment count
      try {
        await firestore()
          .collection('posts')
          .doc(postId)
          .update({
            commentCount: firestore.FieldValue.increment(1)
          });
      } catch (updateError) {
        console.error('Could not update comment count:', updateError);
      }

      // Update local state for UI
      const newComment = {
        id: commentRef.id,
        postId,
        authorId: user.uid,
        authorName: user.displayName || 'Anonymous',
        content,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      } as ForumComment;
      
      set((state) => {
        const updatedPosts = state.posts.map(post => 
          post.id === postId 
            ? { ...post, commentCount: (post.commentCount || 0) + 1 } 
            : post
        );
        
        const postComments = state.comments[postId] || [];
        return {
          ...state,
          posts: updatedPosts,
          comments: {
            ...state.comments,
            [postId]: [...postComments, newComment]
          },
          loading: false
        };
      });
    } catch (error) {
      console.error('Error creating comment:', error);
      set({ error: 'Failed to create comment', loading: false });
    }
  }
}));