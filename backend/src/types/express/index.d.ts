declare namespace Express {
  export interface Request {
    userId?: string;
    user?: {
      id: string;
      role: 'uzman' | 'danisan';
      _id?: string;
    };
  }
} 