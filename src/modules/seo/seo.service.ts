import { prisma } from '@/config/database';
import { env } from '@/config/env';

class SeoService {
  /**
   * Generate XML sitemap for all published articles + categories
   */
  async generateSitemap(): Promise<string> {
    const [articles, categories] = await Promise.all([
      prisma.article.findMany({
        where: { status: 'PUBLISHED' },
        select: {
          slug: true,
          updatedAt: true,
          publishedAt: true,
        },
        orderBy: { publishedAt: 'desc' },
      }),
      prisma.category.findMany({
        select: {
          slug: true,
          updatedAt: true,
        },
      }),
    ]);

    const baseUrl = env.SITE_URL;

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
    xml += '        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n';

    // Homepage
    xml += '  <url>\n';
    xml += `    <loc>${baseUrl}</loc>\n`;
    xml += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
    xml += '    <changefreq>hourly</changefreq>\n';
    xml += '    <priority>1.0</priority>\n';
    xml += '  </url>\n';

    // Categories
    for (const category of categories) {
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}/category/${category.slug}</loc>\n`;
      xml += `    <lastmod>${category.updatedAt.toISOString()}</lastmod>\n`;
      xml += '    <changefreq>daily</changefreq>\n';
      xml += '    <priority>0.8</priority>\n';
      xml += '  </url>\n';
    }

    // Articles
    for (const article of articles) {
      const lastmod = article.updatedAt || article.publishedAt || new Date();
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}/article/${article.slug}</loc>\n`;
      xml += `    <lastmod>${lastmod.toISOString()}</lastmod>\n`;
      xml += '    <changefreq>weekly</changefreq>\n';
      xml += '    <priority>0.9</priority>\n';
      xml += '  </url>\n';
    }

    xml += '</urlset>';

    return xml;
  }

  /**
   * Generate robots.txt
   */
  generateRobotsTxt(): string {
    const baseUrl = env.SITE_URL;

    return [
      'User-agent: *',
      'Allow: /',
      '',
      '# Disallow admin and API routes',
      'Disallow: /api/',
      'Disallow: /admin/',
      '',
      '# Allow SEO endpoints',
      'Allow: /api/v1/seo/sitemap.xml',
      '',
      `Sitemap: ${baseUrl}/api/v1/seo/sitemap.xml`,
      '',
      `Host: ${baseUrl}`,
    ].join('\n');
  }

  /**
   * Generate Open Graph + JSON-LD metadata for an article
   */
  async getArticleMeta(slug: string) {
    const article = await prisma.article.findUnique({
      where: { slug },
      include: {
        category: {
          select: { name: true, slug: true },
        },
      },
    });

    if (!article || article.status !== 'PUBLISHED') {
      return null;
    }

    const baseUrl = env.SITE_URL;
    const articleUrl = `${baseUrl}/article/${article.slug}`;

    // Open Graph metadata
    const openGraph = {
      'og:title': article.seoTitle || article.title,
      'og:description': article.seoDescription || article.summary || '',
      'og:url': articleUrl,
      'og:type': 'article',
      'og:site_name': env.SITE_NAME,
      'og:image': article.featuredImage || '',
      'og:locale': 'en_IN',
      'article:published_time': article.publishedAt?.toISOString() || '',
      'article:modified_time': article.updatedAt.toISOString(),
      'article:section': article.category.name,
      'article:tag': article.tags,
    };

    // Twitter Card
    const twitterCard = {
      'twitter:card': 'summary_large_image',
      'twitter:title': article.seoTitle || article.title,
      'twitter:description': article.seoDescription || article.summary || '',
      'twitter:image': article.featuredImage || '',
    };

    // JSON-LD Structured Data (NewsArticle)
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      headline: article.title,
      description: article.seoDescription || article.summary || '',
      image: article.featuredImage ? [article.featuredImage] : [],
      datePublished: article.publishedAt?.toISOString() || '',
      dateModified: article.updatedAt.toISOString(),
      url: articleUrl,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': articleUrl,
      },
      publisher: {
        '@type': 'Organization',
        name: env.SITE_NAME,
        url: baseUrl,
      },
      articleSection: article.category.name,
      keywords: article.tags.join(', '),
      wordCount: article.content.split(/\s+/).length,
    };

    // Canonical URL
    const canonical = articleUrl;

    return {
      title: article.seoTitle || article.title,
      description: article.seoDescription || article.summary || '',
      canonical,
      openGraph,
      twitterCard,
      jsonLd,
    };
  }
}

export const seoService = new SeoService();
