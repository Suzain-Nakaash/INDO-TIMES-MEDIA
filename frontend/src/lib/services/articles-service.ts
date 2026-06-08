import { apiClient } from '../api';
import type {
  ApiResponse,
  Article,
  CreateArticleInput,
  UpdateArticleInput,
  ArticleSearchParams,
  ArticleFilterParams,
  PaginationMeta,
} from '../types';

export const articlesService = {
  async getPublished(page = 1, limit = 10): Promise<{ articles: Article[]; meta: PaginationMeta }> {
    const { data } = await apiClient.get<ApiResponse<Article[]>>('/articles', {
      params: { page, limit },
    });
    return {
      articles: data.data,
      meta: data.meta?.pagination as PaginationMeta,
    };
  },

  async getBySlug(slug: string): Promise<Article> {
    const { data } = await apiClient.get<ApiResponse<Article>>(`/articles/slug/${slug}`);
    return data.data;
  },

  async getById(id: string): Promise<Article> {
    const { data } = await apiClient.get<ApiResponse<Article>>(`/articles/${id}`);
    return data.data;
  },

  async search(params: ArticleSearchParams): Promise<{ articles: Article[]; meta: PaginationMeta }> {
    const { data } = await apiClient.get<ApiResponse<Article[]>>('/articles/search', {
      params,
    });
    return {
      articles: data.data,
      meta: data.meta?.pagination as PaginationMeta,
    };
  },

  async filter(params: ArticleFilterParams): Promise<{ articles: Article[]; meta: PaginationMeta }> {
    const { data } = await apiClient.get<ApiResponse<Article[]>>('/articles/filter', {
      params,
    });
    return {
      articles: data.data,
      meta: data.meta?.pagination as PaginationMeta,
    };
  },

  async getAdmin(
    page = 1,
    limit = 10,
    status?: string
  ): Promise<{ articles: Article[]; meta: PaginationMeta }> {
    const { data } = await apiClient.get<ApiResponse<Article[]>>('/articles/admin', {
      params: { page, limit, status },
    });
    return {
      articles: data.data,
      meta: data.meta?.pagination as PaginationMeta,
    };
  },

  async create(input: CreateArticleInput): Promise<Article> {
    const { data } = await apiClient.post<ApiResponse<Article>>('/articles', input);
    return data.data;
  },

  async update(id: string, input: UpdateArticleInput): Promise<Article> {
    const { data } = await apiClient.put<ApiResponse<Article>>(`/articles/${id}`, input);
    return data.data;
  },

  async publish(id: string): Promise<Article> {
    const { data } = await apiClient.patch<ApiResponse<Article>>(`/articles/${id}/publish`);
    return data.data;
  },

  async draft(id: string): Promise<Article> {
    const { data } = await apiClient.patch<ApiResponse<Article>>(`/articles/${id}/draft`);
    return data.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/articles/${id}`);
  },
};
