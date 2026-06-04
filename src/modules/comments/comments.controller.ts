import { Request, Response } from 'express';
import { asyncHandler } from '@/utils/asyncHandler';
import { ApiResponse } from '@/utils/ApiResponse';
import { commentsService } from './comments.service';

class CommentsController {
  /**
   * POST /api/v1/comments
   */
  create = asyncHandler(async (req: Request, res: Response) => {
    const comment = await commentsService.create(req.body);
    res.status(201).json(
      ApiResponse.created(comment, 'Comment submitted successfully. Awaiting moderation.'),
    );
  });

  /**
   * GET /api/v1/comments (admin)
   */
  findAll = asyncHandler(async (req: Request, res: Response) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { comments, meta } = await commentsService.findAll(req.query as any);
    res.status(200).json(
      new ApiResponse(200, comments, 'Comments retrieved successfully', { pagination: meta }),
    );
  });

  /**
   * GET /api/v1/comments/article/:articleId
   */
  findByArticle = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const { comments, meta } = await commentsService.findByArticle(
      req.params.articleId as string,
      page,
      limit,
    );
    res.status(200).json(
      new ApiResponse(200, comments, 'Comments retrieved successfully', { pagination: meta }),
    );
  });

  /**
   * PATCH /api/v1/comments/:id/approve
   */
  approve = asyncHandler(async (req: Request, res: Response) => {
    const comment = await commentsService.approve(req.params.id as string);
    res.status(200).json(ApiResponse.ok(comment, 'Comment approved successfully'));
  });

  /**
   * PATCH /api/v1/comments/:id/reject
   */
  reject = asyncHandler(async (req: Request, res: Response) => {
    await commentsService.reject(req.params.id as string);
    res.status(200).json(ApiResponse.ok(null, 'Comment rejected and deleted'));
  });

  /**
   * DELETE /api/v1/comments/:id
   */
  delete = asyncHandler(async (req: Request, res: Response) => {
    await commentsService.delete(req.params.id as string);
    res.status(200).json(ApiResponse.ok(null, 'Comment deleted successfully'));
  });
}

export const commentsController = new CommentsController();
