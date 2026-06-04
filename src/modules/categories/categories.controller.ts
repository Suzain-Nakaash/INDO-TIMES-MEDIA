import { Request, Response } from 'express';
import { asyncHandler } from '@/utils/asyncHandler';
import { ApiResponse } from '@/utils/ApiResponse';
import { categoriesService } from './categories.service';

class CategoriesController {
  /**
   * POST /api/v1/categories
   */
  create = asyncHandler(async (req: Request, res: Response) => {
    const category = await categoriesService.create(req.body);
    res.status(201).json(ApiResponse.created(category, 'Category created successfully'));
  });

  /**
   * GET /api/v1/categories
   */
  findAll = asyncHandler(async (_req: Request, res: Response) => {
    const categories = await categoriesService.findAll();
    res.status(200).json(ApiResponse.ok(categories, 'Categories retrieved successfully'));
  });

  /**
   * GET /api/v1/categories/:id
   */
  findById = asyncHandler(async (req: Request, res: Response) => {
    const category = await categoriesService.findById(req.params.id as string);
    res.status(200).json(ApiResponse.ok(category, 'Category retrieved successfully'));
  });

  /**
   * PUT /api/v1/categories/:id
   */
  update = asyncHandler(async (req: Request, res: Response) => {
    const category = await categoriesService.update(req.params.id as string, req.body);
    res.status(200).json(ApiResponse.ok(category, 'Category updated successfully'));
  });

  /**
   * DELETE /api/v1/categories/:id
   */
  delete = asyncHandler(async (req: Request, res: Response) => {
    await categoriesService.delete(req.params.id as string);
    res.status(200).json(ApiResponse.ok(null, 'Category deleted successfully'));
  });
}

export const categoriesController = new CategoriesController();
