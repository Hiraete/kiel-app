import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: 'uzman' | 'danisan';
        _id?: string;
      };
    }
  }
}

export {}; 