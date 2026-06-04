import { Request, Response } from 'express';
import { asyncHandler } from '@/utils/asyncHandler';
import { ApiResponse } from '@/utils/ApiResponse';
import { ApiError } from '@/utils/ApiError';
import { seoService } from './seo.service';

class SeoController {
  /**
   * GET /api/v1/seo/sitemap.xml
   */
  sitemap = asyncHandler(async (_req: Request, res: Response) => {
    const xml = await seoService.generateSitemap();
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.status(200).send(xml);
  });

  /**
   * GET /api/v1/seo/robots.txt
   */
  robots = asyncHandler(async (_req: Request, res: Response) => {
    const robotsTxt = seoService.generateRobotsTxt();
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.status(200).send(robotsTxt);
  });

  /**
   * GET /api/v1/seo/article/:slug/meta
   */
  articleMeta = asyncHandler(async (req: Request, res: Response) => {
    const meta = await seoService.getArticleMeta(req.params.slug as string);

    if (!meta) {
      throw ApiError.notFound('Article not found or not published');
    }

    res.status(200).json(ApiResponse.ok(meta, 'Article SEO metadata retrieved'));
  });
}

export const seoController = new SeoController();
