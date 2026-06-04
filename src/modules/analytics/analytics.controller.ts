import { Request, Response } from 'express';
import { asyncHandler } from '@/utils/asyncHandler';
import { ApiResponse } from '@/utils/ApiResponse';
import { analyticsService } from './analytics.service';

class AnalyticsController {
  /**
   * GET /api/v1/analytics/dashboard
   */
  dashboard = asyncHandler(async (_req: Request, res: Response) => {
    const metrics = await analyticsService.getDashboardMetrics();
    res.status(200).json(ApiResponse.ok(metrics, 'Dashboard metrics retrieved'));
  });

  /**
   * GET /api/v1/analytics/popular
   */
  popular = asyncHandler(async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 10;
    const articles = await analyticsService.getPopularArticles(limit);
    res.status(200).json(ApiResponse.ok(articles, 'Popular articles retrieved'));
  });

  /**
   * GET /api/v1/analytics/views
   */
  views = asyncHandler(async (_req: Request, res: Response) => {
    const breakdown = await analyticsService.getViewsBreakdown();
    res.status(200).json(ApiResponse.ok(breakdown, 'Views breakdown retrieved'));
  });

  /**
   * GET /api/v1/analytics/traffic
   */
  traffic = asyncHandler(async (_req: Request, res: Response) => {
    const trafficData = await analyticsService.getTrafficStats();
    res.status(200).json(ApiResponse.ok(trafficData, 'Traffic statistics retrieved'));
  });
}

export const analyticsController = new AnalyticsController();
