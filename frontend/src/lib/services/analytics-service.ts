import { apiClient } from '../api';
import type { ApiResponse, DashboardMetrics, ViewsBreakdown, TrafficData, PopularArticle } from '../types';

export const analyticsService = {
  async getDashboard(): Promise<DashboardMetrics> {
    const { data } = await apiClient.get<ApiResponse<DashboardMetrics>>('/analytics/dashboard');
    return data.data;
  },

  async getPopular(limit = 10): Promise<PopularArticle[]> {
    const { data } = await apiClient.get<ApiResponse<PopularArticle[]>>('/analytics/popular', {
      params: { limit },
    });
    return data.data;
  },

  async getViews(): Promise<ViewsBreakdown> {
    const { data } = await apiClient.get<ApiResponse<ViewsBreakdown>>('/analytics/views');
    return data.data;
  },

  async getTraffic(): Promise<TrafficData[]> {
    const { data } = await apiClient.get<ApiResponse<TrafficData[]>>('/analytics/traffic');
    return data.data;
  },
};
