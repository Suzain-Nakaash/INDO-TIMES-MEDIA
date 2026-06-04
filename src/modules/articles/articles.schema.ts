import { z } from 'zod';

export const createArticleSchema = z.object({
  title: z.string().min(1, 'Title is required').max(300),
  summary: z.string().max(1000).optional(),
  content: z.string().min(1, 'Content is required'),
  featuredImage: z.string().url().optional().nullable(),
  categoryId: z.string().min(1, 'Category ID is required'),
  seoTitle: z.string().max(70).optional(),
  seoDescription: z.string().max(160).optional(),
  tags: z.array(z.string().max(50)).max(20).optional().default([]),
  status: z.enum(['DRAFT', 'PUBLISHED']).optional().default('DRAFT'),
});

export const updateArticleSchema = z.object({
  title: z.string().min(1).max(300).optional(),
  summary: z.string().max(1000).optional().nullable(),
  content: z.string().min(1).optional(),
  featuredImage: z.string().url().optional().nullable(),
  categoryId: z.string().optional(),
  seoTitle: z.string().max(70).optional().nullable(),
  seoDescription: z.string().max(160).optional().nullable(),
  tags: z.array(z.string().max(50)).max(20).optional(),
});

export const articleIdSchema = z.object({
  id: z.string().min(1, 'Article ID is required'),
});

export const articleSlugSchema = z.object({
  slug: z.string().min(1, 'Slug is required'),
});

export const articleSearchSchema = z.object({
  q: z.string().min(1, 'Search query is required').max(200),
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(10),
});

export const articleFilterSchema = z.object({
  categoryId: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  tags: z.string().optional(), // comma-separated
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(10),
  sortBy: z.enum(['createdAt', 'publishedAt', 'views', 'title']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type CreateArticleInput = z.infer<typeof createArticleSchema>;
export type UpdateArticleInput = z.infer<typeof updateArticleSchema>;
export type ArticleSearchQuery = z.infer<typeof articleSearchSchema>;
export type ArticleFilterQuery = z.infer<typeof articleFilterSchema>;
