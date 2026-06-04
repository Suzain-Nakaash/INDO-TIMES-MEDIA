import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { ApiError } from '@/utils/ApiError';
import { env } from '@/config/env';
import { logger } from '@/config/logger';

/**
 * Global error handling middleware.
 * Catches all errors and returns a standardized JSON response.
 */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  // Log the error
  logger.error(err.message, {
    stack: err.stack,
    name: err.name,
  });

  // ── Handle our custom ApiError ──────────────────────────
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      statusCode: err.statusCode,
      message: err.message,
      errors: err.errors,
      ...(env.NODE_ENV === 'development' && { stack: err.stack }),
    });
    return;
  }

  // ── Handle Prisma errors ────────────────────────────────
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    let statusCode = 400;
    let message = 'Database error';

    switch (err.code) {
      case 'P2002': {
        statusCode = 409;
        const target = (err.meta?.target as string[]) || [];
        message = `A record with this ${target.join(', ')} already exists`;
        break;
      }
      case 'P2025':
        statusCode = 404;
        message = 'Record not found';
        break;
      case 'P2003':
        statusCode = 400;
        message = 'Invalid reference — related record not found';
        break;
      case 'P2014':
        statusCode = 400;
        message = 'Invalid relation — this change would violate a required relation';
        break;
      default:
        message = `Database error: ${err.code}`;
    }

    res.status(statusCode).json({
      success: false,
      statusCode,
      message,
      ...(env.NODE_ENV === 'development' && { prismaCode: err.code, stack: err.stack }),
    });
    return;
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    res.status(400).json({
      success: false,
      statusCode: 400,
      message: 'Invalid data provided',
      ...(env.NODE_ENV === 'development' && { stack: err.stack }),
    });
    return;
  }

  // ── Handle JWT errors ───────────────────────────────────
  if (err.name === 'JsonWebTokenError') {
    res.status(401).json({
      success: false,
      statusCode: 401,
      message: 'Invalid token',
    });
    return;
  }

  if (err.name === 'TokenExpiredError') {
    res.status(401).json({
      success: false,
      statusCode: 401,
      message: 'Token has expired',
    });
    return;
  }

  // ── Handle Multer errors ────────────────────────────────
  if (err.name === 'MulterError') {
    res.status(400).json({
      success: false,
      statusCode: 400,
      message: `File upload error: ${err.message}`,
    });
    return;
  }

  // ── Handle Syntax errors (bad JSON body) ────────────────
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({
      success: false,
      statusCode: 400,
      message: 'Invalid JSON in request body',
    });
    return;
  }

  // ── Fallback for unknown errors ─────────────────────────
  const statusCode = 500;
  res.status(statusCode).json({
    success: false,
    statusCode,
    message: env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    ...(env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}

/**
 * 404 Not Found handler — catch-all for unmatched routes
 */
export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
}
