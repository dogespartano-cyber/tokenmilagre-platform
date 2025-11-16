// Stub types for offline build
// Re-exports everything from @prisma/client including enums
export * from '@prisma/client';

// Re-export PrismaClient for convenience
export { PrismaClient } from '@prisma/client';

// Additional Prisma namespace types for compatibility
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
