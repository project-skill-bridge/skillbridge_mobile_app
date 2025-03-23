// Updated forum-store.ts implementation that works with existing security rules
import { create } from 'zustand';
import { ForumPost, ForumComment } from '../types/forum-types';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

interface ForumStore {
  posts: ForumPost[];
  comments: Record<string, ForumComment[]>;
  loading: boolean;
  error: string | null;
  
  fetchPosts: () => Promise<void>;
  fetchComments: (postId: string) => Promise<void>;
  createPost: (title: string, content: string) => Promise<string>;
  createComment: (postId: string, content: string) => Promise<void>;
}

export const useForumStore = create<ForumStore>((set, get) => ({
  posts: [],
  comments: {},
  loading: false,
  error: null,

  fetchPosts: async () => {
    set({ loading: true, error: null });
    try {
      // Get current user
      const user = auth().currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Access the global forum posts collection through a different path
      // that your security rules might already allow
      const postsSnapshot = await firestore()
        .collection('public')
        .doc('forum')
        .collection('posts')
        .orderBy('createdAt', 'desc')
        .get();
      
      const posts = postsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt || Date.now(),
        } as ForumPost;
      });

      set({ posts, loading: false });
    } catch (error) {
      set({ error: 'Failed to load posts', loading: false });
      console.error('Error fetching posts:', error);
    }
  },

  fetchComments: async (postId: string) => {
    set({ loading: true, error: null });
    try {
      // Get current user
      const user = auth().currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Access comments through the public collection
      const commentsSnapshot = await firestore()
        .collection('public')
        .doc('forum')
        .collection('comments')
        .where('postId', '==', postId)
        .orderBy('createdAt', 'asc')
        .get();
      
      const comments = commentsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt || Date.now(),
        } as ForumComment;
      });

      set(state => ({
        comments: {
          ...state.comments,
          [postId]: comments
        },
        loading: false
      }));
    } catch (error) {
      set({ error: 'Failed to load comments', loading: false });
      console.error('Error fetching comments:', error);
    }
  },

  createPost: async (title: string, content: string) => {
    set({ loading: true, error: null });
    try {
      const user = auth().currentUser;
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Get user data from the user's document
      const userDoc = await firestore()
        .collection('users')
        .doc(user.uid)
        .get();
      
      const userData = userDoc.data();
      const authorName = userData?.displayName || user.displayName || 'Anonymous';

      const newPost: Omit<ForumPost, 'id'> = {
        authorId: user.uid,
        authorName,
        title,
        content,
        createdAt: Date.now(),
        commentCount: 0,
      };

      // Store the post in the public forum collection
      const docRef = await firestore()
        .collection('public')
        .doc('forum')
        .collection('posts')
        .add(newPost);
      
      // Update local state
      const createdPost = { id: docRef.id, ...newPost } as ForumPost;
      set(state => ({
        posts: [createdPost, ...state.posts],
        loading: false
      }));
      
      return docRef.id;
    } catch (error) {
      set({ error: 'Failed to create post', loading: false });
      console.error('Error creating post:', error);
      return '';
    }
  },

  createComment: async (postId: string, content: string) => {
    set({ loading: true, error: null });
    try {
      const user = auth().currentUser;
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Get user data
      const userDoc = await firestore()
        .collection('users')
        .doc(user.uid)
        .get();
      
      const userData = userDoc.data();
      const authorName = userData?.displayName || user.displayName || 'Anonymous';

      const newComment: Omit<ForumComment, 'id'> = {
        postId,
        authorId: user.uid,
        authorName,
        content,
        createdAt: Date.now(),
      };

      // Add the comment to the public forum collection
      const commentRef = await firestore()
        .collection('public')
        .doc('forum')
        .collection('comments')
        .add(newComment);
      
      // Update the post's comment count
      await firestore()
        .collection('public')
        .doc('forum')
        .collection('posts')
        .doc(postId)
        .update({
          commentCount: firestore.FieldValue.increment(1)
        });
      
      // Update local state
      const createdComment = { id: commentRef.id, ...newComment } as ForumComment;
      set(state => {
        const updatedPosts = state.posts.map(post => 
          post.id === postId 
            ? { ...post, commentCount: post.commentCount + 1 } 
            : post
        );
        
        const postComments = state.comments[postId] || [];
        return {
          posts: updatedPosts,
          comments: {
            ...state.comments,
            [postId]: [...postComments, createdComment]
          },
          loading: false
        };
      });
    } catch (error) {
      set({ error: 'Failed to create comment', loading: false });
      console.error('Error creating comment:', error);
    }
  }
}));