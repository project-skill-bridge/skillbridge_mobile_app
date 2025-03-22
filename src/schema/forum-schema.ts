import { z } from "zod";

export const CreatePostSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title cannot exceed 100 characters"),
  content: z.string().min(10, "Content must be at least 10 characters").max(1000, "Content cannot exceed 1000 characters"),
  tags: z.array(z.string()).optional(),
});

export const CreateCommentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty").max(500, "Comment cannot exceed 500 characters"),
});

export type CreatePostType = z.infer<typeof CreatePostSchema>;
export type CreateCommentType = z.infer<typeof CreateCommentSchema>;