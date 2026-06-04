import { Router } from 'express';
import { articlesController } from './articles.controller';
import { authenticate, optionalAuth } from '@/middleware/auth.middleware';
import { validate } from '@/middleware/validate.middleware';
import { cacheMiddleware } from '@/middleware/cache.middleware';
import {
  createArticleSchema,
  updateArticleSchema,
  articleIdSchema,
  articleSlugSchema,
  articleSearchSchema,
  articleFilterSchema,
} from './articles.schema';
import { CACHE_KEYS, CACHE_TTL } from '@/utils/constants';

const router = Router();

/**
 * @swagger
 * /api/v1/articles:
 *   post:
 *     summary: Create a new article
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, content, categoryId]
 *             properties:
 *               title: { type: string }
 *               summary: { type: string }
 *               content: { type: string, description: "Supports HTML, rich text, embedded content" }
 *               featuredImage: { type: string, format: uri }
 *               categoryId: { type: string }
 *               seoTitle: { type: string, maxLength: 70 }
 *               seoDescription: { type: string, maxLength: 160 }
 *               tags: { type: array, items: { type: string } }
 *               status: { type: string, enum: [DRAFT, PUBLISHED], default: DRAFT }
 *     responses:
 *       201:
 *         description: Article created
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/', authenticate, validate(createArticleSchema), articlesController.create);

/**
 * @swagger
 * /api/v1/articles/search:
 *   get:
 *     summary: Search articles
 *     tags: [Articles]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema: { type: string }
 *         description: Search query
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: Search results
 */
router.get('/search', validate(articleSearchSchema, 'query'), articlesController.search);

/**
 * @swagger
 * /api/v1/articles/filter:
 *   get:
 *     summary: Filter articles
 *     tags: [Articles]
 *     parameters:
 *       - in: query
 *         name: categoryId
 *         schema: { type: string }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [DRAFT, PUBLISHED, ARCHIVED] }
 *       - in: query
 *         name: tags
 *         schema: { type: string }
 *         description: Comma-separated tags
 *       - in: query
 *         name: startDate
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: endDate
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: sortBy
 *         schema: { type: string, enum: [createdAt, publishedAt, views, title], default: createdAt }
 *       - in: query
 *         name: sortOrder
 *         schema: { type: string, enum: [asc, desc], default: desc }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: Filtered articles
 */
router.get('/filter', validate(articleFilterSchema, 'query'), articlesController.filter);

/**
 * @swagger
 * /api/v1/articles/admin:
 *   get:
 *     summary: List all articles (admin — all statuses)
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [DRAFT, PUBLISHED, ARCHIVED] }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: All articles
 */
router.get('/admin', authenticate, articlesController.findAll);

/**
 * @swagger
 * /api/v1/articles/slug/{slug}:
 *   get:
 *     summary: Get article by slug (public)
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Article details
 *       404:
 *         description: Article not found
 */
router.get(
  '/slug/:slug',
  validate(articleSlugSchema, 'params'),
  cacheMiddleware(CACHE_KEYS.articleSlug, CACHE_TTL.articleSingle),
  articlesController.findBySlug,
);

/**
 * @swagger
 * /api/v1/articles/{id}:
 *   get:
 *     summary: Get article by ID
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Article details
 *       404:
 *         description: Article not found
 */
router.get(
  '/:id',
  optionalAuth,
  validate(articleIdSchema, 'params'),
  articlesController.findById,
);

/**
 * @swagger
 * /api/v1/articles/{id}:
 *   put:
 *     summary: Update an article
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               summary: { type: string }
 *               content: { type: string }
 *               featuredImage: { type: string }
 *               categoryId: { type: string }
 *               seoTitle: { type: string }
 *               seoDescription: { type: string }
 *               tags: { type: array, items: { type: string } }
 *     responses:
 *       200:
 *         description: Article updated
 */
router.put(
  '/:id',
  authenticate,
  validate(articleIdSchema, 'params'),
  validate(updateArticleSchema),
  articlesController.update,
);

/**
 * @swagger
 * /api/v1/articles/{id}/publish:
 *   patch:
 *     summary: Publish an article
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Article published
 */
router.patch(
  '/:id/publish',
  authenticate,
  validate(articleIdSchema, 'params'),
  articlesController.publish,
);

/**
 * @swagger
 * /api/v1/articles/{id}/draft:
 *   patch:
 *     summary: Revert article to draft
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Article reverted to draft
 */
router.patch(
  '/:id/draft',
  authenticate,
  validate(articleIdSchema, 'params'),
  articlesController.draft,
);

/**
 * @swagger
 * /api/v1/articles/{id}:
 *   delete:
 *     summary: Delete an article
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Article deleted
 */
router.delete(
  '/:id',
  authenticate,
  validate(articleIdSchema, 'params'),
  articlesController.delete,
);

/**
 * @swagger
 * /api/v1/articles:
 *   get:
 *     summary: List published articles (public)
 *     tags: [Articles]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: Published articles
 */
router.get(
  '/',
  cacheMiddleware(CACHE_KEYS.articleList, CACHE_TTL.articleList),
  articlesController.findPublished,
);

export default router;
