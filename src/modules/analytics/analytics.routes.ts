import { Router } from 'express';
import { analyticsController } from './analytics.controller';
import { authenticate } from '@/middleware/auth.middleware';
import { cacheMiddleware } from '@/middleware/cache.middleware';
import { CACHE_KEYS, CACHE_TTL } from '@/utils/constants';

const router = Router();

/**
 * @swagger
 * /api/v1/analytics/dashboard:
 *   get:
 *     summary: Get dashboard metrics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard metrics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalArticles: { type: integer }
 *                     publishedArticles: { type: integer }
 *                     draftArticles: { type: integer }
 *                     totalViews: { type: integer }
 *                     totalComments: { type: integer }
 *                     pendingComments: { type: integer }
 *                     totalSubscribers: { type: integer }
 *                     totalMedia: { type: integer }
 */
router.get(
  '/dashboard',
  authenticate,
  cacheMiddleware(CACHE_KEYS.analytics, CACHE_TTL.analytics),
  analyticsController.dashboard,
);

/**
 * @swagger
 * /api/v1/analytics/popular:
 *   get:
 *     summary: Get popular articles
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: Top articles by views
 */
router.get(
  '/popular',
  authenticate,
  cacheMiddleware(CACHE_KEYS.analytics, CACHE_TTL.analytics),
  analyticsController.popular,
);

/**
 * @swagger
 * /api/v1/analytics/views:
 *   get:
 *     summary: Get views breakdown (today, week, month, all-time)
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Views breakdown
 */
router.get(
  '/views',
  authenticate,
  cacheMiddleware(CACHE_KEYS.analytics, CACHE_TTL.analytics),
  analyticsController.views,
);

/**
 * @swagger
 * /api/v1/analytics/traffic:
 *   get:
 *     summary: Get traffic statistics (last 30 days)
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daily traffic data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date: { type: string, format: date }
 *                       views: { type: integer }
 */
router.get(
  '/traffic',
  authenticate,
  cacheMiddleware(CACHE_KEYS.analytics, CACHE_TTL.analytics),
  analyticsController.traffic,
);

export default router;
