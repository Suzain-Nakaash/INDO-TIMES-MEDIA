import swaggerJsdoc from 'swagger-jsdoc';
import { env } from './env';

const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'IndoTimesMedia API',
      version: '1.0.0',
      description:
        'Enterprise-grade backend CMS and API for IndoTimesMedia digital newspaper platform. Provides complete content management, media handling, analytics, and SEO services.',
      contact: {
        name: 'IndoTimesMedia API Support',
        email: 'api@indotimesmedia.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: env.API_BASE_URL,
        description: env.NODE_ENV === 'production' ? 'Production Server' : 'Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT access token',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            statusCode: { type: 'integer', example: 400 },
            message: { type: 'string', example: 'Validation error' },
            errors: {
              type: 'array',
              items: { type: 'object' },
            },
          },
        },
        Pagination: {
          type: 'object',
          properties: {
            page: { type: 'integer', example: 1 },
            limit: { type: 'integer', example: 10 },
            total: { type: 'integer', example: 100 },
            totalPages: { type: 'integer', example: 10 },
            hasNext: { type: 'boolean', example: true },
            hasPrev: { type: 'boolean', example: false },
          },
        },
        Admin: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string', format: 'email' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Category: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            slug: { type: 'string' },
            description: { type: 'string', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Article: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            slug: { type: 'string' },
            summary: { type: 'string', nullable: true },
            content: { type: 'string' },
            featuredImage: { type: 'string', nullable: true },
            categoryId: { type: 'string' },
            category: { $ref: '#/components/schemas/Category' },
            status: { type: 'string', enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'] },
            seoTitle: { type: 'string', nullable: true },
            seoDescription: { type: 'string', nullable: true },
            views: { type: 'integer' },
            tags: { type: 'array', items: { type: 'string' } },
            publishedAt: { type: 'string', format: 'date-time', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Media: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            fileName: { type: 'string' },
            fileType: { type: 'string' },
            url: { type: 'string' },
            size: { type: 'integer' },
            uploadedAt: { type: 'string', format: 'date-time' },
          },
        },
        Comment: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            articleId: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            comment: { type: 'string' },
            approved: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Newsletter: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string', format: 'email' },
            subscribedAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
    tags: [
      { name: 'Auth', description: 'Authentication endpoints' },
      { name: 'Categories', description: 'Category management' },
      { name: 'Articles', description: 'Article management' },
      { name: 'Media', description: 'Media upload and management' },
      { name: 'Comments', description: 'Comment moderation' },
      { name: 'Newsletter', description: 'Newsletter management' },
      { name: 'Analytics', description: 'Analytics and dashboard' },
      { name: 'SEO', description: 'SEO services (sitemap, robots, metadata)' },
    ],
  },
  apis: ['./src/modules/**/*.routes.ts'],
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);
