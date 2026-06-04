import { Admin } from '@prisma/client';

// Augment Express Request to include admin property
declare global {
  namespace Express {
    interface Request {
      admin?: Pick<Admin, 'id' | 'email'>;
    }
  }
}

export {};
