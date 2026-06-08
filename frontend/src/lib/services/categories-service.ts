import { apiClient } from '../api';
import type { ApiResponse, Category, CreateCategoryInput, UpdateCategoryInput } from '../types';

export const categoriesService = {
  async getAll(): Promise<Category[]> {
    const { data } = await apiClient.get<ApiResponse<Category[]>>('/categories');
    return data.data;
  },

  async getById(id: string): Promise<Category> {
    const { data } = await apiClient.get<ApiResponse<Category>>(`/categories/${id}`);
    return data.data;
  },

  async create(input: CreateCategoryInput): Promise<Category> {
    const { data } = await apiClient.post<ApiResponse<Category>>('/categories', input);
    return data.data;
  },

  async update(id: string, input: UpdateCategoryInput): Promise<Category> {
    const { data } = await apiClient.put<ApiResponse<Category>>(`/categories/${id}`, input);
    return data.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/categories/${id}`);
  },
};
