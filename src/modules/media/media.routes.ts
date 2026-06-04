import { Router } from 'express';
import { mediaController } from './media.controller';
import { authenticate } from '@/middleware/auth.middleware';
import { validate } from '@/middleware/validate.middleware';
import { uploadSingle } from '@/middleware/upload.middleware';
import { mediaIdSchema, mediaQuerySchema } from './media.schema';

const router = Router();

/**
 * @swagger
 * /api/v1/media/upload:
 *   post:
 *     summary: Upload a file (image, video, audio, PDF, document)
 *     tags: [Media]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file]
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: "Supported: images (10MB), videos (100MB), audio (50MB), PDFs (25MB), documents (25MB)"
 *     responses:
 *       201:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data: { $ref: '#/components/schemas/Media' }
 *       400:
 *         description: Invalid file type or size
 *       401:
 *         description: Unauthorized
 */
router.post('/upload', authenticate, uploadSingle, mediaController.upload);

/**
 * @swagger
 * /api/v1/media:
 *   get:
 *     summary: Get media library
 *     tags: [Media]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: fileType
 *         schema: { type: string, enum: [image, video, audio, pdf, document] }
 *         description: Filter by file type
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200:
 *         description: Media library
 */
router.get('/', authenticate, validate(mediaQuerySchema, 'query'), mediaController.findAll);

/**
 * @swagger
 * /api/v1/media/{id}:
 *   get:
 *     summary: Get a single media item
 *     tags: [Media]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Media item
 *       404:
 *         description: Media not found
 */
router.get('/:id', authenticate, validate(mediaIdSchema, 'params'), mediaController.findById);

/**
 * @swagger
 * /api/v1/media/{id}:
 *   delete:
 *     summary: Delete a media item
 *     tags: [Media]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Media deleted
 *       404:
 *         description: Media not found
 */
router.delete('/:id', authenticate, validate(mediaIdSchema, 'params'), mediaController.delete);

export default router;
