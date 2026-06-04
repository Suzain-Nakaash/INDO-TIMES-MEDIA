import { prisma } from '@/config/database';
import { DashboardMetrics, TrafficData } from '@/types';

class AnalyticsService {
  /**
   * Get dashboard metrics
   */
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const [
      totalArticles,
      publishedArticles,
      draftArticles,
      totalComments,
      pendingComments,
      totalSubscribers,
      totalMedia,
      viewsResult,
    ] = await Promise.all([
      prisma.article.count(),
      prisma.article.count({ where: { status: 'PUBLISHED' } }),
      prisma.article.count({ where: { status: 'DRAFT' } }),
      prisma.comment.count(),
      prisma.comment.count({ where: { approved: false } }),
      prisma.newsletter.count(),
      prisma.media.count(),
      prisma.article.aggregate({ _sum: { views: true } }),
    ]);

    return {
      totalArticles,
      publishedArticles,
      draftArticles,
      totalViews: viewsResult._sum.views || 0,
      totalComments,
      pendingComments,
      totalSubscribers,
      totalMedia,
    };
  }

  /**
   * Get top 10 most viewed articles
   */
  async getPopularArticles(limit = 10) {
    return prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { views: 'desc' },
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        views: true,
        publishedAt: true,
        category: {
          select: { name: true, slug: true },
        },
      },
    });
  }

  /**
   * Get total views breakdown (today, this week, this month, all-time)
   */
  async getViewsBreakdown() {
    const now = new Date();

    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [allTime, thisMonth, thisWeek, today] = await Promise.all([
      prisma.article.aggregate({ _sum: { views: true } }),
      prisma.article.aggregate({
        _sum: { views: true },
        where: {
          publishedAt: { gte: startOfMonth },
        },
      }),
      prisma.article.aggregate({
        _sum: { views: true },
        where: {
          publishedAt: { gte: startOfWeek },
        },
      }),
      prisma.article.aggregate({
        _sum: { views: true },
        where: {
          publishedAt: { gte: startOfToday },
        },
      }),
    ]);

    return {
      allTime: allTime._sum.views || 0,
      thisMonth: thisMonth._sum.views || 0,
      thisWeek: thisWeek._sum.views || 0,
      today: today._sum.views || 0,
    };
  }

  /**
   * Get traffic statistics — articles published per day over last 30 days
   */
  async getTrafficStats(): Promise<TrafficData[]> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const articles = await prisma.article.findMany({
      where: {
        publishedAt: { gte: thirtyDaysAgo },
        status: 'PUBLISHED',
      },
      select: {
        publishedAt: true,
        views: true,
      },
      orderBy: { publishedAt: 'asc' },
    });

    // Group by date
    const dailyViews = new Map<string, number>();

    // Initialize all 30 days with 0
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      dailyViews.set(dateStr, 0);
    }

    // Sum views per day
    for (const article of articles) {
      if (article.publishedAt) {
        const dateStr = article.publishedAt.toISOString().split('T')[0];
        const current = dailyViews.get(dateStr) || 0;
        dailyViews.set(dateStr, current + article.views);
      }
    }

    // Convert to array sorted by date
    return Array.from(dailyViews.entries())
      .map(([date, views]) => ({ date, views }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }
}

export const analyticsService = new AnalyticsService();
