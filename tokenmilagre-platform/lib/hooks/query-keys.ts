/**
 * React Query Key Factory
 *
 * Centralized query key management for consistent cache invalidation.
 * Follows hierarchical structure for granular cache control.
 *
 * @example
 * ```typescript
 * // Invalidate all articles queries
 * queryClient.invalidateQueries({ queryKey: articleKeys.all })
 *
 * // Invalidate specific article list
 * queryClient.invalidateQueries({ queryKey: articleKeys.list({ page: 1 }) })
 *
 * // Invalidate single article
 * queryClient.invalidateQueries({ queryKey: articleKeys.detail(articleId) })
 * ```
 */

import type { ArticleQuery } from '@/lib/services/article-service'

/**
 * Article query keys factory
 * Hierarchical structure:
 * - all: ['articles'] - Invalidates everything
 * - lists: ['articles', 'list'] - Invalidates all lists
 * - list: ['articles', 'list', { filters }] - Specific list
 * - details: ['articles', 'detail'] - Invalidates all details
 * - detail: ['articles', 'detail', id] - Specific article
 * - stats: ['articles', 'stats'] - Statistics
 */
export const articleKeys = {
  /**
   * Base key for all article queries
   */
  all: ['articles'] as const,

  /**
   * Base key for all article list queries
   */
  lists: () => [...articleKeys.all, 'list'] as const,

  /**
   * Key for specific article list with filters
   */
  list: (filters: Partial<ArticleQuery>) =>
    [...articleKeys.lists(), filters] as const,

  /**
   * Base key for all article detail queries
   */
  details: () => [...articleKeys.all, 'detail'] as const,

  /**
   * Key for specific article detail by ID
   */
  detail: (id: string) => [...articleKeys.details(), id] as const,

  /**
   * Key for specific article detail by slug
   */
  detailBySlug: (slug: string) => [...articleKeys.details(), 'slug', slug] as const,

  /**
   * Key for article statistics
   */
  stats: () => [...articleKeys.all, 'stats'] as const,
}

/**
 * Category query keys factory (for future use)
 */
export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) =>
    [...categoryKeys.lists(), filters] as const,
  details: () => [...categoryKeys.all, 'detail'] as const,
  detail: (id: string) => [...categoryKeys.details(), id] as const,
}

/**
 * Tag query keys factory (for future use)
 */
export const tagKeys = {
  all: ['tags'] as const,
  lists: () => [...tagKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) =>
    [...tagKeys.lists(), filters] as const,
  details: () => [...tagKeys.all, 'detail'] as const,
  detail: (id: string) => [...tagKeys.details(), id] as const,
}
