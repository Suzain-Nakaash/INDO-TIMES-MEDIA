import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { articlesService } from '../services/articles-service';
import type { CreateArticleInput, UpdateArticleInput, ArticleFilterParams } from '../types';

// ── Query Keys ──────────────────────────────────────────────

export const articleKeys = {
  all: ['articles'] as const,
  published: (page: number, limit: number) => [...articleKeys.all, 'published', page, limit] as const,
  admin: (page: number, limit: number, status?: string) =>
    [...articleKeys.all, 'admin', page, limit, status] as const,
  detail: (slug: string) => [...articleKeys.all, 'detail', slug] as const,
  detailById: (id: string) => [...articleKeys.all, 'detailById', id] as const,
  search: (q: string, page: number, limit: number) =>
    [...articleKeys.all, 'search', q, page, limit] as const,
  filter: (params: ArticleFilterParams) => [...articleKeys.all, 'filter', params] as const,
};

// ── Queries ─────────────────────────────────────────────────

export function usePublishedArticles(page = 1, limit = 10) {
  return useQuery({
    queryKey: articleKeys.published(page, limit),
    queryFn: () => articlesService.getPublished(page, limit),
  });
}

export function useArticle(slug: string) {
  return useQuery({
    queryKey: articleKeys.detail(slug),
    queryFn: () => articlesService.getBySlug(slug),
    enabled: !!slug,
  });
}

export function useArticleById(id: string) {
  return useQuery({
    queryKey: articleKeys.detailById(id),
    queryFn: () => articlesService.getById(id),
    enabled: !!id,
  });
}

export function useArticleSearch(q: string, page = 1, limit = 10) {
  return useQuery({
    queryKey: articleKeys.search(q, page, limit),
    queryFn: () => articlesService.search({ q, page, limit }),
    enabled: q.length > 0,
  });
}

export function useArticleFilter(params: ArticleFilterParams) {
  return useQuery({
    queryKey: articleKeys.filter(params),
    queryFn: () => articlesService.filter(params),
  });
}

export function useAdminArticles(page = 1, limit = 10, status?: string) {
  return useQuery({
    queryKey: articleKeys.admin(page, limit, status),
    queryFn: () => articlesService.getAdmin(page, limit, status),
  });
}

// ── Mutations ───────────────────────────────────────────────

export function useCreateArticle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateArticleInput) => articlesService.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: articleKeys.all });
    },
  });
}

export function useUpdateArticle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateArticleInput }) =>
      articlesService.update(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: articleKeys.all });
    },
  });
}

export function usePublishArticle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => articlesService.publish(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: articleKeys.all });
    },
  });
}

export function useDraftArticle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => articlesService.draft(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: articleKeys.all });
    },
  });
}

export function useDeleteArticle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => articlesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: articleKeys.all });
    },
  });
}
