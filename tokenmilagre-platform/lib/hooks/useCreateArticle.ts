/**
 * useCreateArticle Hook
 *
 * React Query mutation hook for creating articles with optimistic updates.
 * Automatically invalidates article list cache after successful creation.
 *
 * @example
 * ```typescript
 * function CreateArticleForm() {
 *   const createArticle = useCreateArticle()
 *
 *   const handleSubmit = async (data: ArticleCreateInput) => {
 *     try {
 *       const article = await createArticle.mutateAsync(data)
 *       toast.success(`Article "${article.title}" created!`)
 *       router.push(`/articles/${article.id}`)
 *     } catch (error) {
 *       toast.error(error.message)
 *     }
 *   }
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <input name="title" required />
 *       <button disabled={createArticle.isPending}>
 *         {createArticle.isPending ? 'Creating...' : 'Create Article'}
 *       </button>
 *     </form>
 *   )
 * }
 * ```
 */

'use client'

import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query'
import { articleKeys } from './query-keys'
import type { ArticleCreateInput } from '@/lib/schemas/article-schemas'

// TODO: Import from proper type when schema-v2 is migrated
type ArticleWithRelations = any

/**
 * Creates article via API v2
 */
async function createArticle(data: ArticleCreateInput): Promise<ArticleWithRelations> {
  const response = await fetch('/api/v2/articles', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'Failed to create article')
  }

  return response.json()
}

/**
 * Hook options
 */
export interface UseCreateArticleOptions
  extends Omit<
    UseMutationOptions<ArticleWithRelations, Error, ArticleCreateInput>,
    'mutationFn'
  > {}

/**
 * React Query mutation hook for creating articles
 *
 * @param options - Mutation options
 * @returns Mutation result
 */
export function useCreateArticle(options: UseCreateArticleOptions = {}) {
  const queryClient = useQueryClient()

  return useMutation<ArticleWithRelations, Error, ArticleCreateInput>({
    mutationFn: createArticle,

    // Optimistic update (optional, can be enabled)
    // onMutate: async (newArticle) => {
    //   // Cancel outgoing refetches
    //   await queryClient.cancelQueries({ queryKey: articleKeys.lists() })
    //
    //   // Snapshot previous value
    //   const previousArticles = queryClient.getQueryData(articleKeys.lists())
    //
    //   // Optimistically update to the new value
    //   queryClient.setQueryData(articleKeys.lists(), (old: any) => {
    //     // Add optimistic article to list
    //     return {
    //       ...old,
    //       articles: [
    //         {
    //           id: 'temp-' + Date.now(),
    //           ...newArticle,
    //           createdAt: new Date(),
    //           updatedAt: new Date(),
    //         },
    //         ...(old?.articles || []),
    //       ],
    //     }
    //   })
    //
    //   return { previousArticles }
    // },

    // If mutation fails, rollback
    // onError: (err, newArticle, context) => {
    //   if (context?.previousArticles) {
    //     queryClient.setQueryData(articleKeys.lists(), context.previousArticles)
    //   }
    // },

    // Always refetch after error or success
    onSettled: () => {
      // Invalidate all article lists (they might need to show the new article)
      queryClient.invalidateQueries({ queryKey: articleKeys.lists() })

      // Invalidate stats (total count changed)
      queryClient.invalidateQueries({ queryKey: articleKeys.stats() })
    },

    onSuccess: (data) => {
      // Set the newly created article in cache
      queryClient.setQueryData(articleKeys.detail(data.id), data)
    },

    ...options,
  })
}

/**
 * Hook for creating article with auto-generated slug
 */
export function useCreateArticleWithSlug(options: UseCreateArticleOptions = {}) {
  const createArticle = useCreateArticle(options)

  return {
    ...createArticle,
    mutate: (data: Omit<ArticleCreateInput, 'slug'> & { slug?: string }) => {
      // Auto-generate slug from title if not provided
      const slug =
        data.slug ||
        data.title
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_]+/g, '-')
          .replace(/-+/g, '-')
          .substring(0, 100)

      return createArticle.mutate({ ...data, slug } as ArticleCreateInput)
    },
    mutateAsync: async (data: Omit<ArticleCreateInput, 'slug'> & { slug?: string }) => {
      const slug =
        data.slug ||
        data.title
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_]+/g, '-')
          .replace(/-+/g, '-')
          .substring(0, 100)

      return createArticle.mutateAsync({ ...data, slug } as ArticleCreateInput)
    },
  }
}
