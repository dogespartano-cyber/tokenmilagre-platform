// Stub types for offline build
import { PrismaClient as BasePrismaClient } from '@prisma/client';

export * from '@prisma/client';

// Re-export PrismaClient properly
export { BasePrismaClient as PrismaClient };

// Re-export enums
export enum Role {
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
  VIEWER = 'VIEWER'
}

export declare namespace Prisma {
  export type ArticleWhereInput = any;
  export type ArticleSelect = any;
  export type ArticleInclude = any;
  export type ArticleOrderByWithRelationInput = any;
  export type ArticleCreateInput = any;
  export type ArticleUpdateInput = any;
  export type UserWhereInput = any;
  export type ResourceWhereInput = any;
  export type CryptocurrencyWhereInput = any;
}
