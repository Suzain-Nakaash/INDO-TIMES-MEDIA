import { Router } from 'express';
import { commentsController } from './comments.controller';
import { authenticate } from '@/middleware/auth.middleware';
import { validate } from '@/middleware/validate.middleware';
import { commentRateLimiter } from '@/middleware/rateLimiter.middleware';
import {
  createCommentSchema,
  commentIdSchema,
  commentArticleIdSchema,
  commentListSchema,
} from './comments.schema';

const router = Router();

/**
 * @swagger
 * /api/v1/comments:
 *   post:
 *     summary: Submit a comment (public, requires moderation)
 *     tags: [Comments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [articleId, name, email, comment]
 *             properties:
 *               articleId: { type: string }
 *               name: { type: string, example: "John Doe" }
 *               email: { type: string, format: email }
 *               comment: { type: string, maxLength: 2000 }
 *     responses:
 *       201:
 *         description: Comment submitted (pending moderation)
 *       400:
 *         description: Validation error
 *       429:
 *         description: Rate limit exceeded
 */
router.post(
  '/',
  commentRateLimiter,
  validate(createCommentSchema),
  commentsController.create,
);

/**
 * @swagger
 * /api/v1/comments:
 *   get:
 *     summary: List all comments (admin)
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: approved
 *         schema: { type: string, enum: [true, false, all], default: all }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200:
 *         description: Comments list
 */
router.get(
  '/',
  authenticate,
  validate(commentListSchema, 'query'),
  commentsController.findAll,
);

/**
 * @swagger
 * /api/v1/comments/article/{articleId}:
 *   get:
 *     summary: Get approved comments for an article
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: articleId
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200:
 *         description: Approved comments
 */
router.get(
  '/article/:articleId',
  validate(commentArticleIdSchema, 'params'),
  commentsController.findByArticle,
);

/**
 * @swagger
 * /api/v1/comments/{id}/approve:
 *   patch:
 *     summary: Approve a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Comment approved
 */
router.patch(
  '/:id/approve',
  authenticate,
  validate(commentIdSchema, 'params'),
  commentsController.approve,
);

/**
 * @swagger
 * /api/v1/comments/{id}/reject:
 *   patch:
 *     summary: Reject (delete) a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Comment rejected and deleted
 */
router.patch(
  '/:id/reject',
  authenticate,
  validate(commentIdSchema, 'params'),
  commentsController.reject,
);

/**
 * @swagger
 * /api/v1/comments/{id}:
 *   delete:
 *     summary: Delete a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Comment deleted
 */
router.delete(
  '/:id',
  authenticate,
  validate(commentIdSchema, 'params'),
  commentsController.delete,
);

export default router;
