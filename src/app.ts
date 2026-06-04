import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import { env } from '@/config/env';
import { swaggerSpec } from '@/config/swagger';
import { globalRateLimiter } from '@/middleware/rateLimiter.middleware';
import { errorHandler, notFoundHandler } from '@/middleware/error.middleware';
import { logger } from '@/config/logger';

// ── Route imports ──────────────────────────────────────────
import authRoutes from '@/modules/auth/auth.routes';
import categoriesRoutes from '@/modules/categories/categories.routes';
import articlesRoutes from '@/modules/articles/articles.routes';
import mediaRoutes from '@/modules/media/media.routes';
import commentsRoutes from '@/modules/comments/comments.routes';
import newsletterRoutes from '@/modules/newsletter/newsletter.routes';
import analyticsRoutes from '@/modules/analytics/analytics.routes';
import seoRoutes from '@/modules/seo/seo.routes';

const app = express();

// ── Security Middleware ────────────────────────────────────
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        scriptSrc: ["'self'"],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }),
);

// ── CORS ───────────────────────────────────────────────────
const corsOrigins = env.CORS_ORIGINS.split(',').map((o) => o.trim());
app.use(
  cors({
    origin: corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

// ── Body Parsing ───────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ── Rate Limiting ──────────────────────────────────────────
app.use(globalRateLimiter);

// ── Request Logging ────────────────────────────────────────
app.use((req, _res, next) => {
  logger.http(`${req.method} ${req.originalUrl}`, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });
  next();
});

// ── Health Check ───────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'IndoTimesMedia API is running',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
    version: '1.0.0',
  });
});

// ── Swagger Documentation ──────────────────────────────────
app.use(
  '/api/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'IndoTimesMedia API Documentation',
    customfavIcon: '',
    swaggerOptions: {
      persistAuthorization: true,
    },
  }),
);

// Serve raw OpenAPI spec
app.get('/api/docs.json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// ── API Routes ─────────────────────────────────────────────
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/categories', categoriesRoutes);
app.use('/api/v1/articles', articlesRoutes);
app.use('/api/v1/media', mediaRoutes);
app.use('/api/v1/comments', commentsRoutes);
app.use('/api/v1/newsletter', newsletterRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/seo', seoRoutes);

// ── 404 Handler ────────────────────────────────────────────
app.use(notFoundHandler);

// ── Global Error Handler ───────────────────────────────────
app.use(errorHandler);

export default app;
