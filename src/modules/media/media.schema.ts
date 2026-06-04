import { z } from 'zod';

export const mediaIdSchema = z.object({
  id: z.string().min(1, 'Media ID is required'),
});

export const mediaQuerySchema = z.object({
  fileType: z.string().optional(),
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(20),
});

export type MediaQuery = z.infer<typeof mediaQuerySchema>;
