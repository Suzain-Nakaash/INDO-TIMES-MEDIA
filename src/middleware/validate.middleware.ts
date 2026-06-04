import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ApiError } from '@/utils/ApiError';

type ValidationTarget = 'body' | 'params' | 'query';

/**
 * Generic Zod validation middleware.
 * Validates the specified request property (body, params, or query) against a Zod schema.
 */
export function validate(schema: ZodSchema, target: ValidationTarget = 'body') {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const data = schema.parse(req[target]);
      // Replace with parsed (and potentially transformed) data
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (req as any)[target] = data;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        next(ApiError.badRequest('Validation failed', formattedErrors));
      } else {
        next(error);
      }
    }
  };
}
