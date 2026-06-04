import { Prisma, ArticleStatus } from '@prisma/client';
import { prisma } from '@/config/database';
import { deleteCachePattern } from '@/config/redis';
import { ApiError } from '@/utils/ApiError';
import { createUniqueArticleSlug } from '@/utils/slugify';
import { parsePagination, createPaginationMeta, PaginationMeta } from '@/utils/pagination';
import { CACHE_KEYS } from '@/utils/constants';
import {
  CreateArticleInput,
  UpdateArticleInput,
  ArticleSearchQuery,
  ArticleFilterQuery,
} from './articles.schema';
import { Request } from 'express';

const articleInclude = {
  category: {
    select: { id: true, name: true, slug: true },
  },
  _count: {
    select: { comments: { where: { approved: true } } },
  },
};

class ArticlesService {
  /**
   * Create a new article
   */
  async create(input: CreateArticleInput) {
    // Verify category exists
    const category = await prisma.category.findUnique({
      where: { id: input.categoryId },
    });
    if (!category) {
      throw ApiError.badRequest('Category not found');
    }

    const slug = await createUniqueArticleSlug(input.title);

    const article = await prisma.article.create({
      data: {
        title: input.title,
        slug,
        summary: input.summary,
        content: input.content,
        featuredImage: input.featuredImage,
        categoryId: input.categoryId,
        status: input.status || 'DRAFT',
        seoTitle: input.seoTitle || input.title,
        seoDescription: input.seoDescription || input.summary,
        tags: input.tags || [],
        publishedAt: input.status === 'PUBLISHED' ? new Date() : null,
      },
      include: articleInclude,
    });

    await this.invalidateCache();
    return article;
  }

  /**
   * Get published articles (public, paginated)
   */
  async findPublished(req: Request) {
    const { page, limit, skip } = parsePagination(req);

    const where: Prisma.ArticleWhereInput = {
      status: 'PUBLISHED',
    };

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        include: articleInclude,
        orderBy: { publishedAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.article.count({ where }),
    ]);

    const meta = createPaginationMeta(total, page, limit);
    return { articles, meta };
  }

  /**
   * Get all articles for admin (all statuses, paginated)
   */
  async findAll(req: Request) {
    const { page, limit, skip } = parsePagination(req);
    const status = req.query.status as ArticleStatus | undefined;

    const where: Prisma.ArticleWhereInput = {};
    if (status) {
      where.status = status;
    }

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        include: articleInclude,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.article.count({ where }),
    ]);

    const meta = createPaginationMeta(total, page, limit);
    return { articles, meta };
  }

  /**
   * Get a single article by ID
   */
  async findById(id: string, incrementViews = false) {
    const article = await prisma.article.findUnique({
      where: { id },
      include: {
        ...articleInclude,
        comments: {
          where: { approved: true },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!article) {
      throw ApiError.notFound('Article not found');
    }

    // Increment view count for public access
    if (incrementViews && article.status === 'PUBLISHED') {
      await prisma.article.update({
        where: { id },
        data: { views: { increment: 1 } },
      });
    }

    return article;
  }

  /**
   * Get a single article by slug (public)
   */
  async findBySlug(slug: string) {
    const article = await prisma.article.findUnique({
      where: { slug, status: 'PUBLISHED' },
      include: {
        ...articleInclude,
        comments: {
          where: { approved: true },
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    });

    if (!article) {
      throw ApiError.notFound('Article not found');
    }

    // Increment view count
    await prisma.article.update({
      where: { id: article.id },
      data: { views: { increment: 1 } },
    });

    return article;
  }

  /**
   * Update an article
   */
  async update(id: string, input: UpdateArticleInput) {
    await this.findById(id); // Throws if not found

    const data: Prisma.ArticleUpdateInput = {};

    if (input.title) {
      data.title = input.title;
      data.slug = await createUniqueArticleSlug(input.title);
    }
    if (input.summary !== undefined) data.summary = input.summary;
    if (input.content) data.content = input.content;
    if (input.featuredImage !== undefined) data.featuredImage = input.featuredImage;
    if (input.categoryId) {
      const category = await prisma.category.findUnique({ where: { id: input.categoryId } });
      if (!category) throw ApiError.badRequest('Category not found');
      data.category = { connect: { id: input.categoryId } };
    }
    if (input.seoTitle !== undefined) data.seoTitle = input.seoTitle;
    if (input.seoDescription !== undefined) data.seoDescription = input.seoDescription;
    if (input.tags) data.tags = input.tags;

    const article = await prisma.article.update({
      where: { id },
      data,
      include: articleInclude,
    });

    await this.invalidateCache();
    return article;
  }

  /**
   * Publish an article
   */
  async publish(id: string) {
    const article = await this.findById(id);

    if (article.status === 'PUBLISHED') {
      throw ApiError.badRequest('Article is already published');
    }

    const updated = await prisma.article.update({
      where: { id },
      data: {
        status: 'PUBLISHED',
        publishedAt: new Date(),
      },
      include: articleInclude,
    });

    await this.invalidateCache();
    return updated;
  }

  /**
   * Revert article to draft
   */
  async draft(id: string) {
    const article = await this.findById(id);

    if (article.status === 'DRAFT') {
      throw ApiError.badRequest('Article is already a draft');
    }

    const updated = await prisma.article.update({
      where: { id },
      data: {
        status: 'DRAFT',
        publishedAt: null,
      },
      include: articleInclude,
    });

    await this.invalidateCache();
    return updated;
  }

  /**
   * Delete an article
   */
  async delete(id: string) {
    await this.findById(id);
    await prisma.article.delete({ where: { id } });
    await this.invalidateCache();
  }

  /**
   * Search articles by title, content, and tags
   */
  async search(query: ArticleSearchQuery): Promise<{ articles: unknown[]; meta: PaginationMeta }> {
    const skip = (query.page - 1) * query.limit;

    const where: Prisma.ArticleWhereInput = {
      status: 'PUBLISHED',
      OR: [
        { title: { contains: query.q, mode: 'insensitive' } },
        { content: { contains: query.q, mode: 'insensitive' } },
        { summary: { contains: query.q, mode: 'insensitive' } },
        { tags: { has: query.q } },
      ],
    };

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        include: articleInclude,
        orderBy: { publishedAt: 'desc' },
        skip,
        take: query.limit,
      }),
      prisma.article.count({ where }),
    ]);

    const meta = createPaginationMeta(total, query.page, query.limit);
    return { articles, meta };
  }

  /**
   * Filter articles by category, tags, date range, status
   */
  async filter(query: ArticleFilterQuery): Promise<{ articles: unknown[]; meta: PaginationMeta }> {
    const skip = (query.page - 1) * query.limit;

    const where: Prisma.ArticleWhereInput = {};

    if (query.categoryId) {
      where.categoryId = query.categoryId;
    }

    if (query.status) {
      where.status = query.status;
    } else {
      where.status = 'PUBLISHED'; // Default to published for public
    }

    if (query.tags) {
      const tagList = query.tags.split(',').map((t) => t.trim());
      where.tags = { hasSome: tagList };
    }

    if (query.startDate || query.endDate) {
      where.publishedAt = {};
      if (query.startDate) where.publishedAt.gte = query.startDate;
      if (query.endDate) where.publishedAt.lte = query.endDate;
    }

    const orderBy: Prisma.ArticleOrderByWithRelationInput = {
      [query.sortBy]: query.sortOrder,
    };

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        include: articleInclude,
        orderBy,
        skip,
        take: query.limit,
      }),
      prisma.article.count({ where }),
    ]);

    const meta = createPaginationMeta(total, query.page, query.limit);
    return { articles, meta };
  }

  // ── Private helpers ───────────────────────────────────────

  private async invalidateCache() {
    await Promise.all([
      deleteCachePattern(`${CACHE_KEYS.articleList}*`),
      deleteCachePattern(`${CACHE_KEYS.articleSingle}*`),
      deleteCachePattern(`${CACHE_KEYS.articleSlug}*`),
      deleteCachePattern(`${CACHE_KEYS.sitemap}*`),
    ]);
  }
}

export const articlesService = new ArticlesService();
