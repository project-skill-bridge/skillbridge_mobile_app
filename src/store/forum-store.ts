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
      // Using collectionGroup to query across all post collections
      const postsSnapshot = await firestore()
        .collectionGroup('posts')
        .orderBy('createdAt', 'desc')
        .get();
      
      const posts = postsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toMillis() || Date.now()
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
      // Using collectionGroup with a where clause to filter by postId
      const commentsSnapshot = await firestore()
        .collectionGroup('comments')
        .where('postId', '==', postId)
        .orderBy('createdAt', 'asc')
        .get();
      
      const comments = commentsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toMillis() || Date.now()
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
      
      // Generate a unique ID for the post
      const postId = firestore().collection('_').doc().id;
      
      const postData = {
        authorId: user.uid,
        authorName: user.displayName || 'Anonymous',
        title,
        content,
        createdAt: firestore.FieldValue.serverTimestamp(),
        commentCount: 0,
        postId, // Include postId in the document for queries
      };
      
      // Add to the nested collection structure matching your security rules
      await firestore()
      .collection('forum/posts')
      .doc(postId) 
      .set(postData);
        
      const newPost = {
        id: postId,
        ...postData,
        createdAt: Date.now(),
      } as ForumPost;
      
      set((state) => ({
        ...state,
        posts: [newPost, ...state.posts],
        loading: false
      }));
      
      return postId;
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
      
      // Generate a unique ID for the comment
      const commentId = firestore().collection('_').doc().id;
      
      const commentData = {
        postId,
        authorId: user.uid,
        authorName: user.displayName || 'Anonymous',
        content,
        createdAt: firestore.FieldValue.serverTimestamp(),
      };
      
      // Add to the nested collection structure matching your security rules
      await firestore()
        .collection('forum')
        .doc('comments')
        .collection(commentId)
        .doc(commentId) // Use the same ID for the document
        .set(commentData);
        
      // Update the post's comment count
      // Note: This is tricky with the nested structure - you may need a different approach
      try {
        // Try to find the post document to update its comment count
        const postDocs = await firestore()
          .collectionGroup('posts')
          .where('postId', '==', postId)
          .limit(1)
          .get();
          
        if (!postDocs.empty) {
          const postDoc = postDocs.docs[0];
          const postRef = postDoc.ref;
          await postRef.update({
            commentCount: firestore.FieldValue.increment(1)
          });
        }
      } catch (updateError) {
        console.log('Could not update comment count:', updateError);
      }
      
      const newComment = {
        id: commentId,
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