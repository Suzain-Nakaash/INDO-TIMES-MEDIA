import { Router } from 'express';
import { categoriesController } from './categories.controller';
import { authenticate } from '@/middleware/auth.middleware';
import { validate } from '@/middleware/validate.middleware';
import { cacheMiddleware } from '@/middleware/cache.middleware';
import { createCategorySchema, updateCategorySchema, categoryIdSchema } from './categories.schema';
import { CACHE_KEYS, CACHE_TTL } from '@/utils/constants';

const router = Router();

/**
 * @swagger
 * /api/v1/categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Technology
 *               description:
 *                 type: string
 *                 example: Technology and innovation news
 *     responses:
 *       201:
 *         description: Category created
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Category already exists
 */
router.post('/', authenticate, validate(createCategorySchema), categoriesController.create);

/**
 * @swagger
 * /api/v1/categories:
 *   get:
 *     summary: List all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Category' }
 */
router.get(
  '/',
  cacheMiddleware(CACHE_KEYS.categories, CACHE_TTL.categories),
  categoriesController.findAll,
);

/**
 * @swagger
 * /api/v1/categories/{id}:
 *   get:
 *     summary: Get a single category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Category details
 *       404:
 *         description: Category not found
 */
router.get('/:id', validate(categoryIdSchema, 'params'), categoriesController.findById);

/**
 * @swagger
 * /api/v1/categories/{id}:
 *   put:
 *     summary: Update a category
 *     tags: [Categories]
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
 *               name: { type: string }
 *               description: { type: string }
 *     responses:
 *       200:
 *         description: Category updated
 *       404:
 *         description: Category not found
 */
router.put(
  '/:id',
  authenticate,
  validate(categoryIdSchema, 'params'),
  validate(updateCategorySchema),
  categoriesController.update,
);

/**
 * @swagger
 * /api/v1/categories/{id}:
 *   delete:
 *     summary: Delete a category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Category deleted
 *       400:
 *         description: Category has articles
 *       404:
 *         description: Category not found
 */
router.delete(
  '/:id',
  authenticate,
  validate(categoryIdSchema, 'params'),
  categoriesController.delete,
);

export default router;
