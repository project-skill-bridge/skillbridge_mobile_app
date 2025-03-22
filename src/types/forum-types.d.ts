// src/types/forum-types.d.ts
export interface ForumPost {
    id: string;
    authorId: string;
    authorName: string;
    title: string;
    content: string;
    createdAt: number; // timestamp
    commentCount: number;
  }
  
  export interface ForumComment {
    id: string;
    postId: string;
    authorId: string;
    authorName: string;
    content: string;
    createdAt: number;
  }