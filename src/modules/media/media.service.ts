import { prisma } from '@/config/database';
import { uploadToCloudinary, deleteFromCloudinary } from '@/config/cloudinary';
import { uploadToS3, deleteFromS3 } from '@/config/s3';
import { ApiError } from '@/utils/ApiError';
import { createPaginationMeta } from '@/utils/pagination';
import { getFileCategory, MAX_FILE_SIZES } from '@/utils/constants';
import { logger } from '@/config/logger';
import { MediaQuery } from './media.schema';
import crypto from 'crypto';

class MediaService {
  /**
   * Upload a file — routes to Cloudinary (images/videos) or S3 (PDFs, audio, docs)
   */
  async upload(file: Express.Multer.File) {
    const fileCategory = getFileCategory(file.mimetype);

    if (fileCategory === 'unknown') {
      throw ApiError.badRequest(`Unsupported file type: ${file.mimetype}`);
    }

    // Validate file size per category
    const maxSize = MAX_FILE_SIZES[fileCategory as keyof typeof MAX_FILE_SIZES];
    if (maxSize && file.size > maxSize) {
      throw ApiError.badRequest(
        `File too large. Maximum size for ${fileCategory}: ${Math.round(maxSize / (1024 * 1024))}MB`,
      );
    }

    let url: string;
    let fileName = file.originalname;

    try {
      if (fileCategory === 'image' || fileCategory === 'video') {
        // Upload to Cloudinary
        const result = await uploadToCloudinary(file.buffer, {
          folder: fileCategory === 'image' ? 'images' : 'videos',
          resourceType: fileCategory as 'image' | 'video',
        });
        url = result.secure_url;
        fileName = result.original_filename || fileName;
      } else {
        // Upload to S3 (PDFs, audio, documents)
        const uniqueKey = `${fileCategory}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}-${file.originalname}`;
        url = await uploadToS3(file.buffer, uniqueKey, file.mimetype);
      }
    } catch (error) {
      logger.error('File upload failed', { error, fileCategory, mimetype: file.mimetype });
      throw ApiError.internal('File upload failed. Please try again.');
    }

    // Save metadata to database
    const media = await prisma.media.create({
      data: {
        fileName,
        fileType: fileCategory,
        url,
        size: file.size,
      },
    });

    return media;
  }

  /**
   * Get media library with pagination and optional type filter
   */
  async findAll(query: MediaQuery) {
    const skip = (query.page - 1) * query.limit;

    const where = query.fileType ? { fileType: query.fileType } : {};

    const [media, total] = await Promise.all([
      prisma.media.findMany({
        where,
        orderBy: { uploadedAt: 'desc' },
        skip,
        take: query.limit,
      }),
      prisma.media.count({ where }),
    ]);

    const meta = createPaginationMeta(total, query.page, query.limit);
    return { media, meta };
  }

  /**
   * Get a single media item by ID
   */
  async findById(id: string) {
    const media = await prisma.media.findUnique({ where: { id } });

    if (!media) {
      throw ApiError.notFound('Media not found');
    }

    return media;
  }

  /**
   * Delete a media item (removes from storage + DB)
   */
  async delete(id: string) {
    const media = await this.findById(id);

    try {
      if (media.fileType === 'image' || media.fileType === 'video') {
        // Extract Cloudinary public_id from URL
        const publicId = this.extractCloudinaryPublicId(media.url);
        if (publicId) {
          await deleteFromCloudinary(
            publicId,
            media.fileType as 'image' | 'video',
          );
        }
      } else {
        // Extract S3 key from URL
        const key = this.extractS3Key(media.url);
        if (key) {
          await deleteFromS3(key);
        }
      }
    } catch (error) {
      logger.warn('Failed to delete file from storage', { error, mediaId: id });
      // Continue with DB deletion even if storage deletion fails
    }

    await prisma.media.delete({ where: { id } });
  }

  // ── Private helpers ───────────────────────────────────────

  private extractCloudinaryPublicId(url: string): string | null {
    try {
      // Cloudinary URLs: https://res.cloudinary.com/<cloud>/image/upload/v123/folder/file.ext
      const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/);
      return match ? match[1] : null;
    } catch {
      return null;
    }
  }

  private extractS3Key(url: string): string | null {
    try {
      const urlObj = new URL(url);
      // Remove leading slash and bucket name from path
      const parts = urlObj.pathname.split('/').filter(Boolean);
      // If path style: /bucket/key → return key parts
      if (parts.length >= 2) {
        return parts.slice(1).join('/');
      }
      return parts.join('/');
    } catch {
      return null;
    }
  }
}

export const mediaService = new MediaService();
