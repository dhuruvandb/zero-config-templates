// Type definitions matching Prisma schema models
// These are manually defined to avoid module resolution issues with @prisma/client

export interface User {
  id: string;
  email: string;
  password: string;
  refreshTokens: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Item {
  id: string;
  name: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
