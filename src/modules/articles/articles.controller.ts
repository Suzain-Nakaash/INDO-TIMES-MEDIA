import { Request, Response } from 'express';
import { asyncHandler } from '@/utils/asyncHandler';
import { ApiResponse } from '@/utils/ApiResponse';
import { articlesService } from './articles.service';

class ArticlesController {
  /**
   * POST /api/v1/articles
   */
  create = asyncHandler(async (req: Request, res: Response) => {
    const article = await articlesService.create(req.body);
    res.status(201).json(ApiResponse.created(article, 'Article created successfully'));
  });

  /**
   * GET /api/v1/articles (public — published only)
   */
  findPublished = asyncHandler(async (req: Request, res: Response) => {
    const { articles, meta } = await articlesService.findPublished(req);
    res.status(200).json(
      new ApiResponse(200, articles, 'Articles retrieved successfully', { pagination: meta }),
    );
  });

  /**
   * GET /api/v1/articles/admin (admin — all statuses)
   */
  findAll = asyncHandler(async (req: Request, res: Response) => {
    const { articles, meta } = await articlesService.findAll(req);
    res.status(200).json(
      new ApiResponse(200, articles, 'Articles retrieved successfully', { pagination: meta }),
    );
  });

  /**
   * GET /api/v1/articles/:id
   */
  findById = asyncHandler(async (req: Request, res: Response) => {
    const isAdmin = !!req.admin;
    const article = await articlesService.findById(req.params.id as string, !isAdmin);
    res.status(200).json(ApiResponse.ok(article, 'Article retrieved successfully'));
  });

  /**
   * GET /api/v1/articles/slug/:slug
   */
  findBySlug = asyncHandler(async (req: Request, res: Response) => {
    const article = await articlesService.findBySlug(req.params.slug as string);
    res.status(200).json(ApiResponse.ok(article, 'Article retrieved successfully'));
  });

  /**
   * PUT /api/v1/articles/:id
   */
  update = asyncHandler(async (req: Request, res: Response) => {
    const article = await articlesService.update(req.params.id as string, req.body);
    res.status(200).json(ApiResponse.ok(article, 'Article updated successfully'));
  });

  /**
   * PATCH /api/v1/articles/:id/publish
   */
  publish = asyncHandler(async (req: Request, res: Response) => {
    const article = await articlesService.publish(req.params.id as string);
    res.status(200).json(ApiResponse.ok(article, 'Article published successfully'));
  });

  /**
   * PATCH /api/v1/articles/:id/draft
   */
  draft = asyncHandler(async (req: Request, res: Response) => {
    const article = await articlesService.draft(req.params.id as string);
    res.status(200).json(ApiResponse.ok(article, 'Article reverted to draft'));
  });

  /**
   * DELETE /api/v1/articles/:id
   */
  delete = asyncHandler(async (req: Request, res: Response) => {
    await articlesService.delete(req.params.id as string);
    res.status(200).json(ApiResponse.ok(null, 'Article deleted successfully'));
  });

  /**
   * GET /api/v1/articles/search
   */
  search = asyncHandler(async (req: Request, res: Response) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { articles, meta } = await articlesService.search(req.query as any);
    res.status(200).json(
      new ApiResponse(200, articles, 'Search results', { pagination: meta }),
    );
  });

  /**
   * GET /api/v1/articles/filter
   */
  filter = asyncHandler(async (req: Request, res: Response) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { articles, meta } = await articlesService.filter(req.query as any);
    res.status(200).json(
      new ApiResponse(200, articles, 'Filtered articles', { pagination: meta }),
    );
  });
}

export const articlesController = new ArticlesController();
