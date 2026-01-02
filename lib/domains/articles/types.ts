/**
 * 🌀 Articles Domain - Types
 * 
 * @agi-domain: articles
 * @agi-pattern: fractal auto-similar
 * 
 * All types and interfaces for the articles domain.
 * Re-exports from article-service.ts and article-schemas.ts
 */

import { Article, Citation } from '@/lib/generated/prisma';

// ============================================
// DOMAIN ENTITIES
// Moved from article-service.ts to avoid circular deps
// ============================================

/**
 * Article with author relation
 */
export type ArticleWithRelations = Article & {
    author?: { id: string; name: string | null; email: string }
    citations?: Citation[]
}

/**
 * Paginated article list result
 */
export interface ArticleListResult {
    articles: ArticleWithRelations[]
    total: number
    page: number
    limit: number
    totalPages: number
    hasMore: boolean
}

/**
 * Article statistics
 */
export interface ArticleStats {
    total: number
    published: number
    draft: number
    byType: Record<string, number>
    byCategory: Record<string, number>
    bySentiment: Record<string, number>
    avgFactCheckScore: number | null
    withFactCheck: number
}

/**
 * Bulk operation result
 */
export interface BulkOperationResult {
    count: number
    articleIds: string[]
}

// ============================================
// RE-EXPORTS FROM SCHEMAS
// These types are defined in article-schemas.ts
// ============================================
export type {
    ArticleCreateInput,
    ArticleUpdateInput,
    ArticleQuery,
    BulkArticleOperation,
    Citation,
    ArticleSEO,
    ArticleType,
    ArticleStatus,
} from '@/lib/schemas/article-schemas';

// ============================================
// ARTICLE TYPES (String literals matching Prisma)
// ============================================

/**
 * Article types supported by the platform
 */
export const ARTICLE_TYPES = ['news', 'educational'] as const;
export type ArticleTypeValue = typeof ARTICLE_TYPES[number];

/**
 * Article status values
 */
export const ARTICLE_STATUSES = ['DRAFT', 'PUBLISHED', 'ARCHIVED'] as const;
export type ArticleStatusValue = typeof ARTICLE_STATUSES[number];

/**
 * Article level (for educational content)
 */
export const ARTICLE_LEVELS = ['beginner', 'intermediate', 'advanced'] as const;
export type ArticleLevelValue = typeof ARTICLE_LEVELS[number];

/**
 * Content types for articles
 */
export const CONTENT_TYPES = ['article', 'guide', 'tutorial', 'review'] as const;
export type ContentTypeValue = typeof CONTENT_TYPES[number];

/**
 * Fact check status values
 */
export const FACT_CHECK_STATUSES = ['pending', 'verified', 'disputed'] as const;
export type FactCheckStatusValue = typeof FACT_CHECK_STATUSES[number];

/**
 * Sentiment values for news
 */
export const SENTIMENT_VALUES = ['positive', 'negative', 'neutral'] as const;
export type SentimentValue = typeof SENTIMENT_VALUES[number];
