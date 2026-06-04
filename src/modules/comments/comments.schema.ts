import { z } from 'zod';

export const createCommentSchema = z.object({
  articleId: z.string().min(1, 'Article ID is required'),
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  comment: z.string().min(1, 'Comment is required').max(2000),
});

export const commentIdSchema = z.object({
  id: z.string().min(1, 'Comment ID is required'),
});

export const commentArticleIdSchema = z.object({
  articleId: z.string().min(1, 'Article ID is required'),
});

export const commentListSchema = z.object({
  approved: z
    .enum(['true', 'false', 'all'])
    .optional()
    .default('all'),
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(20),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type CommentListQuery = z.infer<typeof commentListSchema>;
