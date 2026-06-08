import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '../services/analytics-service';

export const analyticsKeys = {
  all: ['analytics'] as const,
  dashboard: () => [...analyticsKeys.all, 'dashboard'] as const,
  popular: (limit: number) => [...analyticsKeys.all, 'popular', limit] as const,
  views: () => [...analyticsKeys.all, 'views'] as const,
  traffic: () => [...analyticsKeys.all, 'traffic'] as const,
};

export function useDashboardMetrics() {
  return useQuery({
    queryKey: analyticsKeys.dashboard(),
    queryFn: () => analyticsService.getDashboard(),
    staleTime: 60 * 1000, // 1 minute
  });
}

export function usePopularArticles(limit = 10) {
  return useQuery({
    queryKey: analyticsKeys.popular(limit),
    queryFn: () => analyticsService.getPopular(limit),
    staleTime: 60 * 1000,
  });
}

export function useViewsBreakdown() {
  return useQuery({
    queryKey: analyticsKeys.views(),
    queryFn: () => analyticsService.getViews(),
    staleTime: 60 * 1000,
  });
}

export function useTrafficStats() {
  return useQuery({
    queryKey: analyticsKeys.traffic(),
    queryFn: () => analyticsService.getTraffic(),
    staleTime: 5 * 60 * 1000,
  });
}
