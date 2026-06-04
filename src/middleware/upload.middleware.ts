import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import { ApiError } from '@/utils/ApiError';
import { ALL_ALLOWED_MIME_TYPES, MAX_FILE_SIZES } from '@/utils/constants';

/**
 * File filter — validates MIME type against allowed types
 */
const fileFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (ALL_ALLOWED_MIME_TYPES.includes(file.mimetype as never)) {
    cb(null, true);
  } else {
    cb(
      ApiError.badRequest(
        `File type "${file.mimetype}" is not supported. Allowed: images, videos, audio, PDFs, documents.`,
      ),
    );
  }
};

/**
 * Memory storage — files are held in memory as Buffers for direct
 * upload to Cloudinary/S3 without touching the filesystem.
 */
const storage = multer.memoryStorage();

/**
 * General file upload middleware
 * Max size: 100MB (video limit — individual types validated in service)
 */
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZES.video, // Use largest limit; validate per-type in service
    files: 10, // Max 10 files per request
  },
});

/**
 * Single file upload
 */
export const uploadSingle = upload.single('file');

/**
 * Multiple file upload (max 10)
 */
export const uploadMultiple = upload.array('files', 10);
