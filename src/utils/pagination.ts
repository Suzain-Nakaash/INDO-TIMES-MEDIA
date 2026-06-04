import { Request } from 'express';

export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * Parse pagination parameters from request query.
 * Defaults: page=1, limit=10, maxLimit=100
 */
export function parsePagination(req: Request): PaginationParams {
  let page = parseInt(req.query.page as string) || 1;
  let limit = parseInt(req.query.limit as string) || 10;

  // Enforce bounds
  page = Math.max(1, page);
  limit = Math.min(Math.max(1, limit), 100);

  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

/**
 * Generate pagination metadata
 */
export function createPaginationMeta(
  total: number,
  page: number,
  limit: number,
): PaginationMeta {
  const totalPages = Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}
