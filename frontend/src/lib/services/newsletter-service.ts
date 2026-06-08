import { apiClient } from '../api';
import type { ApiResponse, NewsletterSubscriber, PaginationMeta } from '../types';

export const newsletterService = {
  async subscribe(email: string): Promise<NewsletterSubscriber> {
    const { data } = await apiClient.post<ApiResponse<NewsletterSubscriber>>(
      '/newsletter/subscribe',
      { email }
    );
    return data.data;
  },

  async unsubscribe(email: string): Promise<void> {
    await apiClient.post('/newsletter/unsubscribe', { email });
  },

  async getSubscribers(
    page = 1,
    limit = 20
  ): Promise<{ subscribers: NewsletterSubscriber[]; meta: PaginationMeta }> {
    const { data } = await apiClient.get<ApiResponse<NewsletterSubscriber[]>>(
      '/newsletter/subscribers',
      { params: { page, limit } }
    );
    return {
      subscribers: data.data,
      meta: data.meta?.pagination as PaginationMeta,
    };
  },

  async exportCsv(): Promise<Blob> {
    const { data } = await apiClient.get('/newsletter/export', {
      responseType: 'blob',
    });
    return data as Blob;
  },
};
