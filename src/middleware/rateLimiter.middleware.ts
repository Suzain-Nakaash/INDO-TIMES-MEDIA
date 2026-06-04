import rateLimit from 'express-rate-limit';
import { env } from '@/config/env';

/**
 * Global rate limiter — applies to all routes
 */
export const globalRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    statusCode: 429,
    message: 'Too many requests, please try again later.',
  },
});

/**
 * Strict rate limiter for authentication endpoints
 * 5 attempts per 15 minutes
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    statusCode: 429,
    message: 'Too many login attempts, please try again in 15 minutes.',
  },
  skipSuccessfulRequests: true,
});

/**
 * Rate limiter for public comment submissions
 * 3 comments per IP per 15 minutes
 */
export const commentRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    statusCode: 429,
    message: 'Too many comments submitted, please try again later.',
  },
});

/**
 * Rate limiter for newsletter subscriptions
 * 3 subscriptions per IP per hour
 */
export const newsletterRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    statusCode: 429,
    message: 'Too many subscription attempts, please try again later.',
  },
});
