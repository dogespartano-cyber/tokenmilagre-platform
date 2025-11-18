/**
 * useArticle Hook
 *
 * React Query hook for fetching a single article by ID or slug.
 * Provides automatic caching and background refetching.
 *
 * @example
 * ```typescript
 * function ArticlePage({ articleId }: { articleId: string }) {
 *   const { data: article, isLoading, error } = useArticle({ id: articleId })
 *
 *   if (isLoading) return <Spinner />
 *   if (error) return <Error message={error.message} />
 *   if (!article) return <NotFound />
 *
 *   return (
 *     <article>
 *       <h1>{article.title}</h1>
 *       <div dangerouslySetInnerHTML={{ __html: article.content }} />
 *     </article>
 *   )
 * }
 *
 * // Or by slug
 * function ArticleBySlug({ slug }: { slug: string }) {
 *   const { data: article } = useArticle({ slug })
 *   // ...
 * }
 * ```
 */

'use client'

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { articleKeys } from './query-keys'

// TODO: Import from proper type when schema-v2 is migrated
type ArticleWithRelations = any

/**
 * Fetches article by ID from API v2
 */
async function fetchArticleById(id: string): Promise<ArticleWithRelations> {
  const response = await fetch(`/api/v2/articles/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'Failed to fetch article')
  }

  return response.json()
}

/**
 * Fetches article by slug from API v2
 * Note: This requires adding a slug endpoint to the API (future enhancement)
 */
async function fetchArticleBySlug(slug: string): Promise<ArticleWithRelations> {
  // For now, we'll need to fetch by ID
  // TODO: Add /api/v2/articles/slug/[slug] endpoint
  throw new Error('Fetch by slug not yet implemented. Use ID instead.')
}

/**
 * Hook options
 */
export interface UseArticleOptions
  extends Omit<UseQueryOptions<ArticleWithRelations>, 'queryKey' | 'queryFn'> {
  /**
   * Article ID (cuid)
   */
  id?: string

  /**
   * Article slug (alternative to ID)
   */
  slug?: string
}

/**
 * React Query hook for fetching a single article
 *
 * @param options - Hook options with id or slug
 * @returns Query result with article data
 */
export function useArticle(options: UseArticleOptions) {
  const { id, slug, ...queryOptions } = options

  // Validate that either id or slug is provided
  if (!id && !slug) {
    throw new Error('useArticle: Either id or slug must be provided')
  }

  // Prefer id over slug
  const queryKey = id
    ? articleKeys.detail(id)
    : slug
      ? articleKeys.detailBySlug(slug)
      : []

  const queryFn = id
    ? () => fetchArticleById(id)
    : slug
      ? () => fetchArticleBySlug(slug)
      : undefined

  return useQuery<ArticleWithRelations>({
    queryKey,
    queryFn,
    staleTime: 1000 * 60 * 10, // 10 minutes (articles don't change often)
    gcTime: 1000 * 60 * 60, // 1 hour
    retry: 2,
    enabled: !!(id || slug), // Only run if id or slug exists
    refetchOnWindowFocus: false, // Don't refetch on window focus for articles
    ...queryOptions,
  })
}

/**
 * Hook for prefetching an article (useful for link hover)
 */
export function usePrefetchArticle() {
  // TODO: Implement with useQueryClient and prefetchQuery
  // Will be useful for hover prefetching on article links
}
