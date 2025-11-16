// Stub types for offline build - Independent from @prisma/client generation
// This allows TypeScript compilation without downloading Prisma engines
// In production, Vercel will generate the real Prisma Client with full types

// Enum definitions from schema
export enum Role {
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
  VIEWER = 'VIEWER'
}

// Base types
export type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
export interface JsonObject {
  [key: string]: JsonValue;
}
export type JsonArray = JsonValue[];

// PrismaClient class (all models from schema.prisma)
export class PrismaClient {
  constructor(options?: any);
  account: any;
  session: any;
  verificationToken: any;
  user: any;
  article: any;
  resource: any;
  cryptocurrency: any;
  copilotActivity: any;
  automationTask: any;
  copilotReport: any;
  communityStory: any;
  socialProject: any;
  projectMap: any;
  userProgress: any;
  $connect(): Promise<void>;
  $disconnect(): Promise<void>;
  $transaction<T>(fn: (prisma: PrismaClient) => Promise<T>): Promise<T>;
  $executeRaw(query: any, ...values: any[]): Promise<number>;
  $queryRaw<T = unknown>(query: any, ...values: any[]): Promise<T>;
}

// Prisma namespace
export namespace Prisma {
  export class PrismaClientKnownRequestError extends Error {
    code: string;
    meta?: object;
    clientVersion: string;
  }

  export class PrismaClientUnknownRequestError extends Error {
    clientVersion: string;
  }

  export class PrismaClientRustPanicError extends Error {
    clientVersion: string;
  }

  export class PrismaClientInitializationError extends Error {
    clientVersion: string;
  }

  export class PrismaClientValidationError extends Error {
    clientVersion: string;
  }

  // Generic types for queries
  export type ArticleWhereInput = any;
  export type ArticleSelect = any;
  export type ArticleInclude = any;
  export type ArticleOrderByWithRelationInput = any;
  export type ArticleCreateInput = any;
  export type ArticleUpdateInput = any;
  export type UserWhereInput = any;
  export type UserSelect = any;
  export type UserInclude = any;
  export type UserCreateInput = any;
  export type UserUpdateInput = any;
  export type ResourceWhereInput = any;
  export type ResourceSelect = any;
  export type ResourceCreateInput = any;
  export type CryptocurrencyWhereInput = any;
  export type CryptocurrencySelect = any;
  export type CryptocurrencyCreateInput = any;
  export type SocialProjectWhereInput = any;
  export type DonationWhereInput = any;
}

// Export Prisma namespace as default export compatibility
export { Prisma };
