import { Request, Response } from 'express';
import { asyncHandler } from '@/utils/asyncHandler';
import { ApiResponse } from '@/utils/ApiResponse';
import { newsletterService } from './newsletter.service';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Parser } = require('json2csv');

class NewsletterController {
  /**
   * POST /api/v1/newsletter/subscribe
   */
  subscribe = asyncHandler(async (req: Request, res: Response) => {
    const subscriber = await newsletterService.subscribe(req.body);
    res.status(201).json(ApiResponse.created(subscriber, 'Subscribed successfully'));
  });

  /**
   * POST /api/v1/newsletter/unsubscribe
   */
  unsubscribe = asyncHandler(async (req: Request, res: Response) => {
    await newsletterService.unsubscribe(req.body.email);
    res.status(200).json(ApiResponse.ok(null, 'Unsubscribed successfully'));
  });

  /**
   * GET /api/v1/newsletter/subscribers
   */
  findAll = asyncHandler(async (req: Request, res: Response) => {
    const { subscribers, meta } = await newsletterService.findAll(req.query as any);
    res.status(200).json(
      new ApiResponse(200, subscribers, 'Subscribers retrieved successfully', {
        pagination: meta,
      }),
    );
  });

  /**
   * GET /api/v1/newsletter/export
   */
  exportCsv = asyncHandler(async (_req: Request, res: Response) => {
    const subscribers = await newsletterService.exportSubscribers();

    const fields = ['email', 'subscribedAt'];
    const parser = new Parser({ fields });
    const csv = parser.parse(subscribers);

    const filename = `subscribers-${new Date().toISOString().split('T')[0]}.csv`;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.status(200).send(csv);
  });
}

export const newsletterController = new NewsletterController();
