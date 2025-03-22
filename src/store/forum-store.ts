// src/store/forum-store.ts
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
      const postsSnapshot = await firestore()
        .collection('forum_posts')
        .orderBy('createdAt', 'desc')
        .get();
      
      const posts = postsSnapshot.docs.map(doc => {
        return {
          id: doc.id,
          ...doc.data(),
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
      const commentsSnapshot = await firestore()
        .collection('forum_comments')
        .where('postId', '==', postId)
        .orderBy('createdAt', 'asc')
        .get();
      
      const comments = commentsSnapshot.docs.map(doc => {
        return {
          id: doc.id,
          ...doc.data(),
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

      const newPost: Omit<ForumPost, 'id'> = {
        authorId: user.uid,
        authorName: user.displayName || 'Anonymous',
        title,
        content,
        createdAt: Date.now(),
        commentCount: 0,
      };

      const docRef = await firestore().collection('forum_posts').add(newPost);
      
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

      const newComment: Omit<ForumComment, 'id'> = {
        postId,
        authorId: user.uid,
        authorName: user.displayName || 'Anonymous',
        content,
        createdAt: Date.now(),
      };

      const batch = firestore().batch();
      
      // Add the comment
      const commentRef = firestore().collection('forum_comments').doc();
      batch.set(commentRef, newComment);
      
      // Update the post's comment count
      const postRef = firestore().collection('forum_posts').doc(postId);
      batch.update(postRef, {
        commentCount: firestore.FieldValue.increment(1)
      });
      
      await batch.commit();
      
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