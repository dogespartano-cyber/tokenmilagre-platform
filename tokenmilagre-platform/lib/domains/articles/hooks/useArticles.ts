/**
 * useArticles Hook
 *
 * React Query hook for fetching paginated article lists with filters.
 * Provides automatic caching, background refetching, and optimistic updates.
 *
 * @example
 * ```typescript
 * function ArticleList() {
 *   const { data, isLoading, error, refetch } = useArticles({
 *     page: 1,
 *     limit: 10,
 *     status: 'PUBLISHED',
 *   })
 *
 *   if (isLoading) return <Spinner />
 *   if (error) return <Error message={error.message} />
 *
 *   return (
 *     <div>
 *       {data.articles.map(article => (
 *         <ArticleCard key={article.id} article={article} />
 *       ))}
 *       <Pagination total={data.totalPages} current={data.page} />
 *     </div>
 *   )
 * }
 * ```
 */

'use client'

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { articleKeys } from './query-keys'
import type { ArticleQuery } from '@/lib/schemas/article-schemas'
import type { ArticleListResult } from '@/lib/domains/articles/types'

/**
 * Fetches articles from API v2
 */
async function fetchArticles(query: Partial<ArticleQuery>): Promise<ArticleListResult> {
  const params = new URLSearchParams()

  // Add query parameters
  if (query.page) params.set('page', query.page.toString())
  if (query.limit) params.set('limit', query.limit.toString())
  if (query.type) params.set('type', query.type)
  if (query.status) params.set('status', query.status)
  if (query.categoryId) params.set('categoryId', query.categoryId)
  if (query.authorId) params.set('authorId', query.authorId)
  if (query.tagId) params.set('tagId', query.tagId)
  if (query.search) params.set('search', query.search)
  if (query.sortBy) params.set('sortBy', query.sortBy)
  if (query.sortOrder) params.set('sortOrder', query.sortOrder)
  if (query.featured !== undefined) params.set('featured', query.featured.toString())
  if (query.includeDeleted) params.set('includeDeleted', query.includeDeleted.toString())

  const url = `/api/v2/articles?${params.toString()}`

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Include cookies for auth
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'Failed to fetch articles')
  }

  return response.json()
}

/**
 * Hook options
 */
export interface UseArticlesOptions
  extends Omit<UseQueryOptions<ArticleListResult>, 'queryKey' | 'queryFn'> {
  /**
   * Query filters
   */
  query?: Partial<ArticleQuery>
}

/**
 * React Query hook for fetching articles
 *
 * @param options - Hook options with query filters
 * @returns Query result with articles data
 */
export function useArticles(options: UseArticlesOptions = {}) {
  const { query = {}, ...queryOptions } = options

  // Default query values
  const finalQuery: Partial<ArticleQuery> = {
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    ...query,
  }

  return useQuery<ArticleListResult>({
    queryKey: articleKeys.list(finalQuery),
    queryFn: () => fetchArticles(finalQuery),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
    retry: 2,
    refetchOnWindowFocus: true,
    ...queryOptions,
  })
}

/**
 * Hook for infinite scroll articles (future enhancement)
 */
export function useInfiniteArticles(
  baseQuery: Partial<ArticleQuery> = {}
) {
  // TODO: Implement with useInfiniteQuery
  // Will be useful for infinite scroll UI
}
