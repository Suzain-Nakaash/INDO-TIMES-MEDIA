import { apiClient } from '../api';
import type { ApiResponse, Media, MediaQuery, PaginationMeta } from '../types';

export const mediaService = {
  async upload(file: File): Promise<Media> {
    const formData = new FormData();
    formData.append('file', file);

    const { data } = await apiClient.post<ApiResponse<Media>>('/media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data.data;
  },

  async getAll(query: MediaQuery = {}): Promise<{ media: Media[]; meta: PaginationMeta }> {
    const { data } = await apiClient.get<ApiResponse<Media[]>>('/media', {
      params: {
        page: query.page || 1,
        limit: query.limit || 20,
        fileType: query.fileType,
      },
    });
    return {
      media: data.data,
      meta: data.meta?.pagination as PaginationMeta,
    };
  },

  async getById(id: string): Promise<Media> {
    const { data } = await apiClient.get<ApiResponse<Media>>(`/media/${id}`);
    return data.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/media/${id}`);
  },
};
