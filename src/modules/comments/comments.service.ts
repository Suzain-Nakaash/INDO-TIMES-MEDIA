import { prisma } from '@/config/database';
import { ApiError } from '@/utils/ApiError';
import { createPaginationMeta } from '@/utils/pagination';
import { CreateCommentInput, CommentListQuery } from './comments.schema';
import xss from 'xss';

class CommentsService {
  /**
   * Submit a public comment (requires moderation)
   */
  async create(input: CreateCommentInput) {
    // Verify article exists and is published
    const article = await prisma.article.findUnique({
      where: { id: input.articleId },
    });

    if (!article) {
      throw ApiError.notFound('Article not found');
    }

    if (article.status !== 'PUBLISHED') {
      throw ApiError.badRequest('Cannot comment on unpublished articles');
    }

    // Sanitize input to prevent XSS
    const comment = await prisma.comment.create({
      data: {
        articleId: input.articleId,
        name: xss(input.name),
        email: input.email.toLowerCase().trim(),
        comment: xss(input.comment),
        approved: false,
      },
    });

    return comment;
  }

  /**
   * List all comments (admin, filterable by approval status)
   */
  async findAll(query: CommentListQuery) {
    const skip = (query.page - 1) * query.limit;

    const where: Record<string, unknown> = {};
    if (query.approved === 'true') where.approved = true;
    else if (query.approved === 'false') where.approved = false;

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where,
        include: {
          article: {
            select: { id: true, title: true, slug: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: query.limit,
      }),
      prisma.comment.count({ where }),
    ]);

    const meta = createPaginationMeta(total, query.page, query.limit);
    return { comments, meta };
  }

  /**
   * Get approved comments for a specific article
   */
  async findByArticle(articleId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const where = { articleId, approved: true };

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.comment.count({ where }),
    ]);

    const meta = createPaginationMeta(total, page, limit);
    return { comments, meta };
  }

  /**
   * Approve a comment
   */
  async approve(id: string) {
    const comment = await prisma.comment.findUnique({ where: { id } });

    if (!comment) {
      throw ApiError.notFound('Comment not found');
    }

    if (comment.approved) {
      throw ApiError.badRequest('Comment is already approved');
    }

    return prisma.comment.update({
      where: { id },
      data: { approved: true },
    });
  }

  /**
   * Reject (delete) a comment
   */
  async reject(id: string) {
    const comment = await prisma.comment.findUnique({ where: { id } });

    if (!comment) {
      throw ApiError.notFound('Comment not found');
    }

    await prisma.comment.delete({ where: { id } });
  }

  /**
   * Delete a comment
   */
  async delete(id: string) {
    const comment = await prisma.comment.findUnique({ where: { id } });

    if (!comment) {
      throw ApiError.notFound('Comment not found');
    }

    await prisma.comment.delete({ where: { id } });
  }
}

export const commentsService = new CommentsService();
