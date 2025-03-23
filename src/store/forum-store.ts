// src/store/forum-store.ts
import { create } from 'zustand';
import { ForumPost, ForumComment } from '../types/forum-types';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

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
      const user = auth().currentUser;
      if (!user) throw new Error('User not authenticated');
      
      // Use a path similar to your working "games" collection
      const postsRef = firestore()
        .collection('users')
        .doc(user.uid)
        .collection('forum_posts');
        
      const postsSnapshot = await postsRef.orderBy('createdAt', 'desc').get();
      
      const posts = postsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toMillis() || Date.now()
      })) as ForumPost[];

      set({ posts, loading: false });
    } catch (error) {
      console.error('Error fetching posts:', error);
      set({ 
        error: 'Failed to load posts. Please check your connection.',
        loading: false,
        posts: [] // Reset posts on error
      });
    }
  },

  fetchComments: async (postId: string) => {
    set({ loading: true, error: null });
    try {
      const user = auth().currentUser;
      if (!user) throw new Error('User not authenticated');
      
      const commentsRef = firestore()
        .collection('users')
        .doc(user.uid)
        .collection('forum_comments')
        .where('postId', '==', postId);
        
      const commentsSnapshot = await commentsRef.orderBy('createdAt', 'asc').get();
      
      const comments = commentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toMillis() || Date.now()
      })) as ForumComment[];

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
      
      const postData = {
        authorId: user.uid,
        authorName: user.displayName || 'Anonymous',
        title,
        content,
        createdAt: firestore.FieldValue.serverTimestamp(),
        commentCount: 0,
      };
      
      // Add to user's posts collection
      const postRef = await firestore()
        .collection('users')
        .doc(user.uid)
        .collection('forum_posts')
        .add(postData);
        
      const newPost = {
        id: postRef.id,
        ...postData,
        createdAt: Date.now(),
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
      
      const commentData = {
        postId,
        authorId: user.uid,
        authorName: user.displayName || 'Anonymous',
        content,
        createdAt: firestore.FieldValue.serverTimestamp(),
      };
      
      // Add to user's comments collection
      const commentRef = await firestore()
        .collection('users')
        .doc(user.uid)
        .collection('forum_comments')
        .add(commentData);
        
      // Update the post's comment count
      await firestore()
        .collection('users')
        .doc(user.uid)
        .collection('forum_posts')
        .doc(postId)
        .update({
          commentCount: firestore.FieldValue.increment(1)
        });
      
      const newComment = {
        id: commentRef.id,
        ...commentData,
        createdAt: Date.now(),
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