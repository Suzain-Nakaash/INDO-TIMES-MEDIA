import { z } from 'zod';

export const subscribeSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const unsubscribeSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const subscriberListSchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(20),
});

export type SubscribeInput = z.infer<typeof subscribeSchema>;
export type SubscriberListQuery = z.infer<typeof subscriberListSchema>;
