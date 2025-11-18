/**
 * useArticleStats Hook
 *
 * React Query hook for fetching article statistics.
 * Provides counts by status, type, and category.
 *
 * @example
 * ```typescript
 * function DashboardStats() {
 *   const { data: stats, isLoading } = useArticleStats()
 *
 *   if (isLoading) return <Spinner />
 *
 *   return (
 *     <div className="stats-grid">
 *       <StatCard title="Total Articles" value={stats.total} />
 *       <StatCard title="Published" value={stats.published} />
 *       <StatCard title="Draft" value={stats.draft} />
 *       <StatCard title="Archived" value={stats.archived} />
 *     </div>
 *   )
 * }
 * ```
 */

'use client'

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { articleKeys } from './query-keys'
import type { ArticleStats } from '@/lib/services/article-service'

/**
 * Fetches article statistics from API v2
 */
async function fetchArticleStats(): Promise<ArticleStats> {
  const response = await fetch('/api/v2/articles/stats', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'Failed to fetch article statistics')
  }

  return response.json()
}

/**
 * Hook options
 */
export interface UseArticleStatsOptions
  extends Omit<UseQueryOptions<ArticleStats>, 'queryKey' | 'queryFn'> {}

/**
 * React Query hook for fetching article statistics
 *
 * @param options - Hook options
 * @returns Query result with statistics data
 */
export function useArticleStats(options: UseArticleStatsOptions = {}) {
  return useQuery<ArticleStats>({
    queryKey: articleKeys.stats(),
    queryFn: fetchArticleStats,
    staleTime: 1000 * 60 * 5, // 5 minutes (stats don't change often)
    gcTime: 1000 * 60 * 30, // 30 minutes
    retry: 2,
    refetchOnWindowFocus: false,
    ...options,
  })
}
