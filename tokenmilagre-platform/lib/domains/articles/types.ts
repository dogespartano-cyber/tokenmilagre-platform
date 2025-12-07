/**
 * 🌀 Articles Domain - Types
 * 
 * @agi-domain: articles
 * @agi-pattern: fractal auto-similar
 * 
 * All types and interfaces for the articles domain.
 * Re-exports from article-service.ts and article-schemas.ts
 */

// ============================================
// RE-EXPORTS FROM SERVICE
// These types are defined in article-service.ts
// ============================================
export type {
    ArticleWithRelations,
    ArticleListResult,
    ArticleStats,
    BulkOperationResult,
} from '@/lib/services/article-service';

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
