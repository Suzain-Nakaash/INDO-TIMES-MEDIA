import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '@/config/env';
import { redis } from '@/config/redis';
import { ApiError } from '@/utils/ApiError';
import { CACHE_KEYS } from '@/utils/constants';
import { JwtPayload } from '@/types';

/**
 * Middleware to verify JWT access token from Authorization header.
 * Attaches admin info to req.admin on success.
 */
export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw ApiError.unauthorized('Access token is required');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw ApiError.unauthorized('Access token is required');
    }

    // Check if token is blacklisted (logged out)
    const isBlacklisted = await redis.get(`${CACHE_KEYS.tokenBlacklist}:${token}`);
    if (isBlacklisted) {
      throw ApiError.unauthorized('Token has been revoked');
    }

    // Verify token
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;

    if (decoded.type !== 'access') {
      throw ApiError.unauthorized('Invalid token type');
    }

    // Attach admin info to request
    req.admin = {
      id: decoded.id,
      email: decoded.email,
    };

    next();
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else if (error instanceof jwt.TokenExpiredError) {
      next(ApiError.unauthorized('Access token has expired'));
    } else if (error instanceof jwt.JsonWebTokenError) {
      next(ApiError.unauthorized('Invalid access token'));
    } else {
      next(ApiError.unauthorized('Authentication failed'));
    }
  }
};

/**
 * Optional auth middleware — does not fail if no token is provided,
 * but still attaches admin info if a valid token is present.
 */
export const optionalAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.split(' ')[1];
    if (!token) return next();

    const isBlacklisted = await redis.get(`${CACHE_KEYS.tokenBlacklist}:${token}`);
    if (isBlacklisted) return next();

    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;
    if (decoded.type === 'access') {
      req.admin = { id: decoded.id, email: decoded.email };
    }

    next();
  } catch {
    // Silently continue without auth
    next();
  }
};
