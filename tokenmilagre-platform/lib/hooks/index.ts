/**
 * React Query Hooks - Barrel Export
 *
 * Centralized export for all article-related hooks.
 * Provides clean import statements and better tree-shaking.
 *
 * @example
 * ```typescript
 * import {
 *   useArticles,
 *   useArticle,
 *   useCreateArticle,
 *   useUpdateArticle,
 *   useDeleteArticle,
 * } from '@/lib/hooks'
 * ```
 */

// Query keys
export { articleKeys, categoryKeys, tagKeys } from './query-keys'

// Query hooks
export { useArticles, useInfiniteArticles } from './useArticles'
export type { UseArticlesOptions } from './useArticles'

export { useArticle, usePrefetchArticle } from './useArticle'
export type { UseArticleOptions } from './useArticle'

export { useArticleStats } from './useArticleStats'
export type { UseArticleStatsOptions } from './useArticleStats'

// Mutation hooks
export { useCreateArticle, useCreateArticleWithSlug } from './useCreateArticle'
export type { UseCreateArticleOptions } from './useCreateArticle'

export {
  useUpdateArticle,
  usePublishArticle,
  useArchiveArticle,
} from './useUpdateArticle'
export type { UseUpdateArticleOptions, UpdateArticleVariables } from './useUpdateArticle'

export { useDeleteArticle, useDeleteArticles } from './useDeleteArticle'
export type { UseDeleteArticleOptions, DeleteArticleResponse } from './useDeleteArticle'

export { useRestoreArticle, useRestoreArticles } from './useRestoreArticle'
export type { UseRestoreArticleOptions } from './useRestoreArticle'

export {
  useBulkOperation,
  useBulkPublish,
  useBulkArchive,
  useBulkDelete,
  useBulkRestore,
} from './useBulkOperation'
export type { UseBulkOperationOptions, BulkOperationResponse } from './useBulkOperation'
