/**
 * useRestoreArticle Hook
 *
 * React Query mutation hook for restoring soft-deleted articles.
 * Automatically adds article back to cache and invalidates affected queries.
 *
 * @example
 * ```typescript
 * function RestoreArticleButton({ articleId }: { articleId: string }) {
 *   const restoreArticle = useRestoreArticle()
 *
 *   const handleRestore = async () => {
 *     try {
 *       const article = await restoreArticle.mutateAsync(articleId)
 *       toast.success(`Article "${article.title}" restored!`)
 *     } catch (error) {
 *       toast.error(error.message)
 *     }
 *   }
 *
 *   return (
 *     <button onClick={handleRestore} disabled={restoreArticle.isPending}>
 *       {restoreArticle.isPending ? 'Restoring...' : 'Restore Article'}
 *     </button>
 *   )
 * }
 * ```
 */

'use client'

import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query'
import { articleKeys } from './query-keys'

// TODO: Import from proper type when schema-v2 is migrated
type ArticleWithRelations = any

/**
 * Restores article via API v2
 */
async function restoreArticle(id: string): Promise<ArticleWithRelations> {
  const response = await fetch(`/api/v2/articles/${id}/restore`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'Failed to restore article')
  }

  return response.json()
}

/**
 * Hook options
 */
export interface UseRestoreArticleOptions
  extends Omit<
    UseMutationOptions<ArticleWithRelations, Error, string>,
    'mutationFn'
  > {}

/**
 * React Query mutation hook for restoring articles
 *
 * @param options - Mutation options
 * @returns Mutation result
 */
export function useRestoreArticle(options: UseRestoreArticleOptions = {}) {
  const queryClient = useQueryClient()

  return useMutation<ArticleWithRelations, Error, string>({
    mutationFn: restoreArticle,

    onSuccess: (data, id) => {
      // Set restored article in cache
      queryClient.setQueryData(articleKeys.detail(id), data)

      // Invalidate all lists (article is now visible again)
      queryClient.invalidateQueries({ queryKey: articleKeys.lists() })

      // Invalidate stats (counts changed)
      queryClient.invalidateQueries({ queryKey: articleKeys.stats() })
    },

    ...options,
  })
}

/**
 * Hook for batch restoring multiple articles
 */
export function useRestoreArticles(options: UseRestoreArticleOptions = {}) {
  const restoreArticle = useRestoreArticle(options)

  return {
    ...restoreArticle,
    mutate: (ids: string[]) => {
      // Restore articles sequentially
      ids.forEach((id) => {
        restoreArticle.mutate(id)
      })
    },
    mutateAsync: async (ids: string[]) => {
      // Restore articles in parallel
      return Promise.all(ids.map((id) => restoreArticle.mutateAsync(id)))
    },
  }
}
