// src/types/forum-types.d.ts
export interface ForumPost {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: number;
  updatedAt?: number;
  commentCount: number;
}

export interface ForumComment {
  id: string;
  postId: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: number;
  updatedAt?: number;
}