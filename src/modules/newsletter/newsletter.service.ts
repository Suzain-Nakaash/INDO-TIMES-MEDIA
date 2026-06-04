import { prisma } from '@/config/database';
import { ApiError } from '@/utils/ApiError';
import { createPaginationMeta } from '@/utils/pagination';
import { SubscribeInput, SubscriberListQuery } from './newsletter.schema';

class NewsletterService {
  /**
   * Subscribe an email to the newsletter
   */
  async subscribe(input: SubscribeInput) {
    const email = input.email.toLowerCase().trim();

    const existing = await prisma.newsletter.findUnique({
      where: { email },
    });

    if (existing) {
      throw ApiError.conflict('This email is already subscribed');
    }

    return prisma.newsletter.create({
      data: { email },
    });
  }

  /**
   * Unsubscribe an email from the newsletter
   */
  async unsubscribe(email: string) {
    const normalizedEmail = email.toLowerCase().trim();

    const existing = await prisma.newsletter.findUnique({
      where: { email: normalizedEmail },
    });

    if (!existing) {
      throw ApiError.notFound('Email not found in subscriber list');
    }

    await prisma.newsletter.delete({
      where: { email: normalizedEmail },
    });
  }

  /**
   * List subscribers with pagination
   */
  async findAll(query: SubscriberListQuery) {
    const skip = (query.page - 1) * query.limit;

    const [subscribers, total] = await Promise.all([
      prisma.newsletter.findMany({
        orderBy: { subscribedAt: 'desc' },
        skip,
        take: query.limit,
      }),
      prisma.newsletter.count(),
    ]);

    const meta = createPaginationMeta(total, query.page, query.limit);
    return { subscribers, meta };
  }

  /**
   * Export all subscribers as an array for CSV generation
   */
  async exportSubscribers() {
    return prisma.newsletter.findMany({
      orderBy: { subscribedAt: 'desc' },
      select: {
        email: true,
        subscribedAt: true,
      },
    });
  }
}

export const newsletterService = new NewsletterService();
