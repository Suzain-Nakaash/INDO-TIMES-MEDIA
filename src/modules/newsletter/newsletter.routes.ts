import { Router } from 'express';
import { newsletterController } from './newsletter.controller';
import { authenticate } from '@/middleware/auth.middleware';
import { validate } from '@/middleware/validate.middleware';
import { newsletterRateLimiter } from '@/middleware/rateLimiter.middleware';
import { subscribeSchema, unsubscribeSchema, subscriberListSchema } from './newsletter.schema';

const router = Router();

/**
 * @swagger
 * /api/v1/newsletter/subscribe:
 *   post:
 *     summary: Subscribe to newsletter
 *     tags: [Newsletter]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email: { type: string, format: email }
 *     responses:
 *       201:
 *         description: Subscribed successfully
 *       409:
 *         description: Already subscribed
 *       429:
 *         description: Rate limit exceeded
 */
router.post(
  '/subscribe',
  newsletterRateLimiter,
  validate(subscribeSchema),
  newsletterController.subscribe,
);

/**
 * @swagger
 * /api/v1/newsletter/unsubscribe:
 *   post:
 *     summary: Unsubscribe from newsletter
 *     tags: [Newsletter]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email: { type: string, format: email }
 *     responses:
 *       200:
 *         description: Unsubscribed successfully
 *       404:
 *         description: Email not found
 */
router.post(
  '/unsubscribe',
  validate(unsubscribeSchema),
  newsletterController.unsubscribe,
);

/**
 * @swagger
 * /api/v1/newsletter/subscribers:
 *   get:
 *     summary: List subscribers (admin)
 *     tags: [Newsletter]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200:
 *         description: Subscriber list
 */
router.get(
  '/subscribers',
  authenticate,
  validate(subscriberListSchema, 'query'),
  newsletterController.findAll,
);

/**
 * @swagger
 * /api/v1/newsletter/export:
 *   get:
 *     summary: Export subscribers as CSV
 *     tags: [Newsletter]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: CSV file download
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 */
router.get('/export', authenticate, newsletterController.exportCsv);

export default router;
