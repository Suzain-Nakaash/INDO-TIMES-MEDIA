import { Request, Response } from 'express';
import { asyncHandler } from '@/utils/asyncHandler';
import { ApiResponse } from '@/utils/ApiResponse';
import { ApiError } from '@/utils/ApiError';
import { mediaService } from './media.service';

class MediaController {
  /**
   * POST /api/v1/media/upload
   */
  upload = asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
      throw ApiError.badRequest('No file uploaded. Please attach a file with field name "file".');
    }

    const media = await mediaService.upload(req.file);
    res.status(201).json(ApiResponse.created(media, 'File uploaded successfully'));
  });

  /**
   * GET /api/v1/media
   */
  findAll = asyncHandler(async (req: Request, res: Response) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { media, meta } = await mediaService.findAll(req.query as any);
    res.status(200).json(
      new ApiResponse(200, media, 'Media library retrieved successfully', { pagination: meta }),
    );
  });

  /**
   * GET /api/v1/media/:id
   */
  findById = asyncHandler(async (req: Request, res: Response) => {
    const media = await mediaService.findById(req.params.id as string);
    res.status(200).json(ApiResponse.ok(media, 'Media retrieved successfully'));
  });

  /**
   * DELETE /api/v1/media/:id
   */
  delete = asyncHandler(async (req: Request, res: Response) => {
    await mediaService.delete(req.params.id as string);
    res.status(200).json(ApiResponse.ok(null, 'Media deleted successfully'));
  });
}

export const mediaController = new MediaController();
