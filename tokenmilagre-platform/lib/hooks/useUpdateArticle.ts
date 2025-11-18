/**
 * useUpdateArticle Hook
 *
 * React Query mutation hook for updating articles with optimistic updates.
 * Automatically updates cache and invalidates affected queries.
 *
 * @example
 * ```typescript
 * function EditArticleForm({ article }: { article: Article }) {
 *   const updateArticle = useUpdateArticle()
 *
 *   const handleSubmit = async (updates: Partial<ArticleUpdateInput>) => {
 *     try {
 *       const updated = await updateArticle.mutateAsync({
 *         id: article.id,
 *         data: updates,
 *       })
 *       toast.success('Article updated!')
 *     } catch (error) {
 *       toast.error(error.message)
 *     }
 *   }
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <input name="title" defaultValue={article.title} />
 *       <button disabled={updateArticle.isPending}>
 *         {updateArticle.isPending ? 'Saving...' : 'Save Changes'}
 *       </button>
 *     </form>
 *   )
 * }
 * ```
 */

'use client'

import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query'
import { articleKeys } from './query-keys'
import type { ArticleUpdateInput } from '@/lib/schemas/article-schemas'
import type { ArticleWithRelations, PaginatedArticles } from '@/lib/services/article-service'

/**
 * Update article mutation variables
 */
export interface UpdateArticleVariables {
  /**
   * Article ID to update
   */
  id: string

  /**
   * Partial update data
   */
  data: ArticleUpdateInput
}

/**
 * Updates article via API v2
 */
async function updateArticle({
  id,
  data,
}: UpdateArticleVariables): Promise<ArticleWithRelations> {
  const response = await fetch(`/api/v2/articles/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'Failed to update article')
  }

  return response.json()
}

/**
 * Hook options
 */
export interface UseUpdateArticleOptions
  extends Omit<
    UseMutationOptions<ArticleWithRelations, Error, UpdateArticleVariables>,
    'mutationFn'
  > {
  /**
   * Enable optimistic updates (default: true)
   */
  optimistic?: boolean
}

/**
 * React Query mutation hook for updating articles
 *
 * @param options - Mutation options
 * @returns Mutation result
 */
export function useUpdateArticle(options: UseUpdateArticleOptions = {}) {
  const queryClient = useQueryClient()
  const { optimistic = true, ...mutationOptions } = options

  return useMutation<ArticleWithRelations, Error, UpdateArticleVariables>({
    mutationFn: updateArticle,

    // Optimistic update
    onMutate: async ({ id, data }) => {
      if (!optimistic) return

      // Cancel outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: articleKeys.detail(id) })
      await queryClient.cancelQueries({ queryKey: articleKeys.lists() })

      // Snapshot the previous value
      const previousArticle = queryClient.getQueryData<ArticleWithRelations>(
        articleKeys.detail(id)
      )
      const previousLists = queryClient.getQueriesData<PaginatedArticles>({
        queryKey: articleKeys.lists(),
      })

      // Optimistically update article detail
      if (previousArticle) {
        queryClient.setQueryData<ArticleWithRelations>(articleKeys.detail(id), {
          ...previousArticle,
          ...data,
          updatedAt: new Date(),
        } as ArticleWithRelations)
      }

      // Optimistically update article in all lists
      previousLists.forEach(([queryKey, listData]) => {
        if (listData) {
          const updatedArticles = listData.articles.map((article) =>
            article.id === id
              ? ({ ...article, ...data, updatedAt: new Date() } as ArticleWithRelations)
              : article
          )

          queryClient.setQueryData<PaginatedArticles>(queryKey, {
            ...listData,
            articles: updatedArticles,
          })
        }
      })

      // Return context with previous values for rollback
      return { previousArticle, previousLists }
    },

    // If mutation fails, refetch to get fresh data
    onError: () => {
      // TODO: Implement proper rollback when React Query v5 context is properly typed
      queryClient.invalidateQueries({ queryKey: articleKeys.all })
    },

    onSuccess: (data, variables) => {
      // Update article detail in cache
      queryClient.setQueryData(articleKeys.detail(variables.id), data)

      // Invalidate lists and stats
      queryClient.invalidateQueries({ queryKey: articleKeys.lists() })
      queryClient.invalidateQueries({ queryKey: articleKeys.stats() })
    },


    ...mutationOptions,
  })
}

/**
 * Hook for publishing an article (convenience wrapper)
 */
export function usePublishArticle(options: UseUpdateArticleOptions = {}) {
  const updateArticle = useUpdateArticle(options)

  return {
    ...updateArticle,
    mutate: (id: string) => {
      updateArticle.mutate({
        id,
        data: {
          status: 'PUBLISHED',
          publishedAt: new Date(),
        },
      })
    },
    mutateAsync: (id: string) => {
      return updateArticle.mutateAsync({
        id,
        data: {
          status: 'PUBLISHED',
          publishedAt: new Date(),
        },
      })
    },
  }
}

/**
 * Hook for archiving an article (convenience wrapper)
 */
export function useArchiveArticle(options: UseUpdateArticleOptions = {}) {
  const updateArticle = useUpdateArticle(options)

  return {
    ...updateArticle,
    mutate: (id: string) => {
      updateArticle.mutate({
        id,
        data: { status: 'ARCHIVED' },
      })
    },
    mutateAsync: (id: string) => {
      return updateArticle.mutateAsync({
        id,
        data: { status: 'ARCHIVED' },
      })
    },
  }
}
