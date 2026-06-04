import { Request, Response, NextFunction } from 'express';
import { getCache, setCache } from '@/config/redis';
import { logger } from '@/config/logger';

/**
 * Redis cache middleware factory.
 * Caches the full JSON response for GET requests.
 *
 * @param keyPrefix - Cache key prefix (e.g., 'cache:articles:list')
 * @param ttlSeconds - Time-to-live in seconds
 */
export function cacheMiddleware(keyPrefix: string, ttlSeconds: number) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Build cache key from prefix + full URL (includes query params)
    const cacheKey = `${keyPrefix}:${req.originalUrl}`;

    try {
      const cachedData = await getCache<object>(cacheKey);

      if (cachedData) {
        logger.debug(`Cache HIT: ${cacheKey}`);
        res.json(cachedData);
        return;
      }

      logger.debug(`Cache MISS: ${cacheKey}`);

      // Override res.json to intercept the response and cache it
      const originalJson = res.json.bind(res);
      res.json = ((data: object) => {
        // Only cache successful responses
        if (res.statusCode >= 200 && res.statusCode < 300) {
          setCache(cacheKey, data, ttlSeconds).catch(() => {
            // Silently fail — caching is non-critical
          });
        }
        return originalJson(data);
      }) as Response['json'];

      next();
    } catch {
      // If Redis fails, just continue without caching
      next();
    }
  };
}
