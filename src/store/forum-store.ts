// src/store/forum-store.ts - with fixed type errors
import { create } from 'zustand';
import { ForumPost, ForumComment } from '../types/forum-types';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

interface ForumState {
  posts: ForumPost[];
  comments: Record<string, ForumComment[]>;
  loading: boolean;
  error: string | null;
  
  fetchPosts: () => Promise<void>;
  fetchComments: (postId: string) => Promise<void>;
  createPost: (title: string, content: string) => Promise<string>;
  createComment: (postId: string, content: string) => Promise<void>;
}

export const useForumStore = create<ForumState>((set, get) => ({
  posts: [],
  comments: {},
  loading: false,
  error: null,

  fetchPosts: async () => {
    set({ loading: true, error: null });
    try {
      // Fetch global posts from a collection that's allowed by your rules
      const globalPostsRef = firestore().collection('globalPosts');
      const postsSnapshot = await globalPostsRef.orderBy('createdAt', 'desc').get();
      
      const posts = postsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as ForumPost[];

      set({ posts, loading: false });
    } catch (error) {
      console.error('Error fetching posts:', error);
      
      // Try fallback approach if the first one fails
      try {
        const user = auth().currentUser;
        if (!user) throw new Error('User not authenticated');
        
        // Try accessing through the user's document
        const userPostsRef = firestore()
          .collection('users')
          .doc(user.uid)
          .collection('forumPosts');
          
        const userPostsSnapshot = await userPostsRef.orderBy('createdAt', 'desc').get();
        
        const posts = userPostsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as ForumPost[];
        
        set({ posts, loading: false });
      } catch (fallbackError) {
        set({ 
          error: 'Failed to load posts. Please check your connection.',
          loading: false 
        });
        console.error('Fallback error fetching posts:', fallbackError);
      }
    }
  },

  fetchComments: async (postId: string) => {
    set({ loading: true, error: null });
    try {
      // Try to fetch from global comments
      const commentsRef = firestore()
        .collection('globalComments')
        .where('postId', '==', postId);
        
      const commentsSnapshot = await commentsRef.orderBy('createdAt', 'asc').get();
      
      const comments = commentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as ForumComment[];

      set((state: ForumState) => ({
        ...state,
        comments: { 
          ...state.comments, 
          [postId]: comments 
        },
        loading: false
      }));
    } catch (error) {
      console.error('Error fetching comments:', error);
      
      // Try fallback approach
      try {
        const user = auth().currentUser;
        if (!user) throw new Error('User not authenticated');
        
        // Try user's comments collection
        const userCommentsRef = firestore()
          .collection('users')
          .doc(user.uid)
          .collection('forumComments')
          .where('postId', '==', postId);
          
        const userCommentsSnapshot = await userCommentsRef.orderBy('createdAt', 'asc').get();
        
        const comments = userCommentsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as ForumComment[];
        
        set((state: ForumState) => ({
          ...state,
          comments: { 
            ...state.comments, 
            [postId]: comments 
          },
          loading: false
        }));
      } catch (fallbackError) {
        set({ 
          error: 'Failed to load comments',
          loading: false 
        });
        console.error('Fallback error fetching comments:', fallbackError);
      }
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

      // Try adding to global posts
      const postRef = await firestore().collection('globalPosts').add(postData);
      
      const newPost = {
        id: postRef.id,
        ...postData,
        createdAt: Date.now(), // Use current time for UI until server timestamp syncs
      } as ForumPost;
      
      set((state: ForumState) => ({
        ...state,
        posts: [newPost, ...state.posts],
        loading: false
      }));
      
      return postRef.id;
    } catch (error) {
      console.error('Error creating post:', error);
      
      // Try fallback to user's collection
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
        const userPostRef = await firestore()
          .collection('users')
          .doc(user.uid)
          .collection('forumPosts')
          .add(postData);
          
        const newPost = {
          id: userPostRef.id,
          ...postData,
          createdAt: Date.now(),
        } as ForumPost;
        
        set((state: ForumState) => ({
          ...state,
          posts: [newPost, ...state.posts],
          loading: false
        }));
        
        return userPostRef.id;
      } catch (fallbackError) {
        set({ error: 'Failed to create post', loading: false });
        console.error('Fallback error creating post:', fallbackError);
        return '';
      }
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

      // Try adding to global comments
      const commentRef = await firestore().collection('globalComments').add(commentData);
      
      // Try updating the post's comment count
      await firestore().collection('globalPosts').doc(postId).update({
        commentCount: firestore.FieldValue.increment(1)
      });
      
      const newComment = {
        id: commentRef.id,
        ...commentData,
        createdAt: Date.now(),
      } as ForumComment;
      
      set((state: ForumState) => {
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
      
      // Try fallback to user's collection
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
        const userCommentRef = await firestore()
          .collection('users')
          .doc(user.uid)
          .collection('forumComments')
          .add(commentData);
          
        // Try updating the post's comment count
        try {
          await firestore()
            .collection('users')
            .doc(user.uid)
            .collection('forumPosts')
            .doc(postId)
            .update({
              commentCount: firestore.FieldValue.increment(1)
            });
        } catch (updateError) {
          console.log('Could not update comment count, but comment was created');
        }
        
        const newComment = {
          id: userCommentRef.id,
          ...commentData,
          createdAt: Date.now(),
        } as ForumComment;
        
        set((state: ForumState) => {
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
      } catch (fallbackError) {
        set({ error: 'Failed to create comment', loading: false });
        console.error('Fallback error creating comment:', fallbackError);
      }
    }
  }
}));