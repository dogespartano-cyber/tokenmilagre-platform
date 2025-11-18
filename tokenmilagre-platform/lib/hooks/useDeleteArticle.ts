/**
 * useDeleteArticle Hook
 *
 * React Query mutation hook for soft-deleting articles with optimistic updates.
 * Automatically removes article from cache and invalidates affected queries.
 *
 * @example
 * ```typescript
 * function DeleteArticleButton({ articleId }: { articleId: string }) {
 *   const deleteArticle = useDeleteArticle()
 *
 *   const handleDelete = async () => {
 *     if (!confirm('Are you sure you want to delete this article?')) return
 *
 *     try {
 *       await deleteArticle.mutateAsync(articleId)
 *       toast.success('Article deleted')
 *       router.push('/articles')
 *     } catch (error) {
 *       toast.error(error.message)
 *     }
 *   }
 *
 *   return (
 *     <button onClick={handleDelete} disabled={deleteArticle.isPending}>
 *       {deleteArticle.isPending ? 'Deleting...' : 'Delete Article'}
 *     </button>
 *   )
 * }
 * ```
 */

'use client'

import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query'
import { articleKeys } from './query-keys'
import type { PaginatedArticles } from '@/lib/services/article-service'

/**
 * Delete article response
 */
export interface DeleteArticleResponse {
  message: string
  id: string
}

/**
 * Deletes article via API v2 (soft delete)
 */
async function deleteArticle(id: string): Promise<DeleteArticleResponse> {
  const response = await fetch(`/api/v2/articles/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'Failed to delete article')
  }

  return response.json()
}

/**
 * Hook options
 */
export interface UseDeleteArticleOptions
  extends Omit<
    UseMutationOptions<DeleteArticleResponse, Error, string>,
    'mutationFn'
  > {
  /**
   * Enable optimistic updates (default: true)
   */
  optimistic?: boolean
}

/**
 * React Query mutation hook for deleting articles
 *
 * @param options - Mutation options
 * @returns Mutation result
 */
export function useDeleteArticle(options: UseDeleteArticleOptions = {}) {
  const queryClient = useQueryClient()
  const { optimistic = true, ...mutationOptions } = options

  return useMutation<DeleteArticleResponse, Error, string>({
    mutationFn: deleteArticle,

    // Optimistic update
    onMutate: async (id) => {
      if (!optimistic) return

      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: articleKeys.detail(id) })
      await queryClient.cancelQueries({ queryKey: articleKeys.lists() })

      // Snapshot previous values
      const previousArticle = queryClient.getQueryData(articleKeys.detail(id))
      const previousLists = queryClient.getQueriesData<PaginatedArticles>({
        queryKey: articleKeys.lists(),
      })

      // Optimistically remove article from all lists
      previousLists.forEach(([queryKey, listData]) => {
        if (listData) {
          const filteredArticles = listData.articles.filter(
            (article) => article.id !== id
          )

          queryClient.setQueryData<PaginatedArticles>(queryKey, {
            ...listData,
            articles: filteredArticles,
            total: listData.total - 1,
          })
        }
      })

      // Remove article detail from cache
      queryClient.removeQueries({ queryKey: articleKeys.detail(id) })

      // Return context for rollback
      return { previousArticle, previousLists }
    },

    // If mutation fails, rollback
    onError: () => {
      // TODO: Implement proper rollback when React Query v5 context is properly typed
      // For now, just invalidate queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: articleKeys.all })
    },

    onSuccess: (data, id) => {
      // Ensure article is removed from cache
      queryClient.removeQueries({ queryKey: articleKeys.detail(id) })

      // Invalidate lists and stats
      queryClient.invalidateQueries({ queryKey: articleKeys.lists() })
      queryClient.invalidateQueries({ queryKey: articleKeys.stats() })
    },

    ...mutationOptions,
  })
}

/**
 * Hook for batch deleting multiple articles
 */
export function useDeleteArticles(options: UseDeleteArticleOptions = {}) {
  const deleteArticle = useDeleteArticle(options)

  return {
    ...deleteArticle,
    mutate: (ids: string[]) => {
      // Delete articles sequentially
      ids.forEach((id) => {
        deleteArticle.mutate(id)
      })
    },
    mutateAsync: async (ids: string[]) => {
      // Delete articles in parallel
      return Promise.all(ids.map((id) => deleteArticle.mutateAsync(id)))
    },
  }
}
