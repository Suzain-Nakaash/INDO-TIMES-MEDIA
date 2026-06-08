import { apiClient } from '../api';
import type { ApiResponse, SEOMetadata } from '../types';

export const seoService = {
  async getArticleMeta(slug: string): Promise<SEOMetadata> {
    const { data } = await apiClient.get<ApiResponse<SEOMetadata>>(`/seo/article/${slug}/meta`);
    return data.data;
  },

  async getSitemap(): Promise<string> {
    const { data } = await apiClient.get<string>('/seo/sitemap.xml', {
      responseType: 'text',
    });
    return data;
  },

  async getRobots(): Promise<string> {
    const { data } = await apiClient.get<string>('/seo/robots.txt', {
      responseType: 'text',
    });
    return data;
  },
};
