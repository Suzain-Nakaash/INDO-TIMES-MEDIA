import { Router } from 'express';
import { seoController } from './seo.controller';
import { cacheMiddleware } from '@/middleware/cache.middleware';
import { CACHE_KEYS, CACHE_TTL } from '@/utils/constants';

const router = Router();

/**
 * @swagger
 * /api/v1/seo/sitemap.xml:
 *   get:
 *     summary: Auto-generated XML sitemap
 *     tags: [SEO]
 *     responses:
 *       200:
 *         description: XML sitemap
 *         content:
 *           application/xml:
 *             schema:
 *               type: string
 */
router.get(
  '/sitemap.xml',
  cacheMiddleware(CACHE_KEYS.sitemap, CACHE_TTL.sitemap),
  seoController.sitemap,
);

/**
 * @swagger
 * /api/v1/seo/robots.txt:
 *   get:
 *     summary: Robots.txt file
 *     tags: [SEO]
 *     responses:
 *       200:
 *         description: Robots.txt content
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 */
router.get('/robots.txt', seoController.robots);

/**
 * @swagger
 * /api/v1/seo/article/{slug}/meta:
 *   get:
 *     summary: Get SEO metadata for an article
 *     tags: [SEO]
 *     description: Returns Open Graph, Twitter Card, JSON-LD structured data, and canonical URL
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Article SEO metadata
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     title: { type: string }
 *                     description: { type: string }
 *                     canonical: { type: string, format: uri }
 *                     openGraph: { type: object }
 *                     twitterCard: { type: object }
 *                     jsonLd: { type: object }
 *       404:
 *         description: Article not found
 */
router.get(
  '/article/:slug/meta',
  cacheMiddleware(CACHE_KEYS.seoMeta, CACHE_TTL.seoMeta),
  seoController.articleMeta,
);

export default router;
