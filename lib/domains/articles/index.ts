/**
 * 🌀 Articles Domain - Public API
 * 
 * @agi-domain: articles
 * @agi-pattern: fractal auto-similar
 * @agi-entry-point: true
 * 
 * This is the public entry point for the articles domain.
 * All exports from this module are considered part of the public API.
 * 
 * Usage:
 * ```typescript
 * import { ArticleService, ArticleWithRelations } from '@/lib/domains/articles'
 * ```
 */

// ============================================
// TYPES (Public)
// ============================================
export type {
    ArticleWithRelations,
    ArticleListResult,
    ArticleStats,
    BulkOperationResult,
    ArticleCreateInput,
    ArticleUpdateInput,
    ArticleQuery,
    BulkArticleOperation,
    Citation,
    ArticleSEO,
    ArticleType,
    ArticleStatus,
    ArticleTypeValue,
    ArticleStatusValue,
    ArticleLevelValue,
    ContentTypeValue,
    FactCheckStatusValue,
    SentimentValue,
} from './types';

export {
    ARTICLE_TYPES,
    ARTICLE_STATUSES,
    ARTICLE_LEVELS,
    CONTENT_TYPES,
    FACT_CHECK_STATUSES,
    SENTIMENT_VALUES,
} from './types';

// ============================================
// SERVICES (Public)
// ============================================
export { ArticleCrudService } from './services/article-crud.service';
export { ArticleQueryService } from './services/article-query.service';
export { ArticleStatsService } from './services/article-stats.service';
export { ArticleBulkService } from './services/article-bulk.service';

// Re-export Legacy Facade
export { ArticleService, articleService } from '@/lib/services/article-service';

// ============================================
// SCHEMAS
// Re-exported from lib/schemas/article-schemas.ts
// ============================================
export {
    // Core schemas
    articleCreateSchema,
    articleUpdateSchema,
    articleQuerySchema,
    bulkArticleOperationSchema,
    // Sub-schemas
    citationSchema,
    citationCreateSchema,
    slugSchema as articleSlugSchema,  // Renamed to avoid collision with resources domain
    titleSchema,
    contentSchema,
    excerptSchema,
    coverImageSchema,
    relatedArticleIdsSchema,
    articleSEOSchema,
    // Enums
    articleTypeEnum,
    articleStatusEnum,
    // Current Prisma-compatible schemas
    articleCreateInputCurrent,
    articleUpdateInputCurrent,
} from '@/lib/schemas/article-schemas';

// ============================================
// HOOKS (Public)
// ============================================
export * from './hooks';
