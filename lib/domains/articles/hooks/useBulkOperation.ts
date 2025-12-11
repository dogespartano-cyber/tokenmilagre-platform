/**
 * useBulkOperation Hook
 *
 * React Query mutation hook for performing bulk operations on multiple articles.
 * Supports publish, archive, delete, and restore operations (max 50 articles).
 *
 * @example
 * ```typescript
 * function BulkActionsToolbar({ selectedIds }: { selectedIds: string[] }) {
 *   const bulkOperation = useBulkOperation()
 *
 *   const handlePublish = async () => {
 *     try {
 *       const result = await bulkOperation.mutateAsync({
 *         articleIds: selectedIds,
 *         operation: 'publish',
 *       })
 *       toast.success(`${result.count} articles published`)
 *     } catch (error) {
 *       toast.error(error.message)
 *     }
 *   }
 *
 *   return (
 *     <div>
 *       <button onClick={handlePublish} disabled={bulkOperation.isPending}>
 *         Publish Selected ({selectedIds.length})
 *       </button>
 *     </div>
 *   )
 * }
 * ```
 */

'use client'

import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query'
import { articleKeys } from './query-keys'
import type { BulkArticleOperation } from '@/lib/schemas/article-schemas'

/**
 * Bulk operation response
 */
export interface BulkOperationResponse {
  count: number
  operation: 'publish' | 'archive' | 'delete' | 'restore'
  articleIds: string[]
}

/**
 * Performs bulk operation via API v2
 */
async function bulkOperation(
  operation: BulkArticleOperation
): Promise<BulkOperationResponse> {
  const response = await fetch('/api/v2/articles/bulk', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(operation),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'Failed to perform bulk operation')
  }

  return response.json()
}

/**
 * Hook options
 */
export interface UseBulkOperationOptions
  extends Omit<
    UseMutationOptions<BulkOperationResponse, Error, BulkArticleOperation>,
    'mutationFn'
  > {}

/**
 * React Query mutation hook for bulk operations
 *
 * @param options - Mutation options
 * @returns Mutation result
 */
export function useBulkOperation(options: UseBulkOperationOptions = {}) {
  const queryClient = useQueryClient()

  return useMutation<BulkOperationResponse, Error, BulkArticleOperation>({
    mutationFn: bulkOperation,

    onSuccess: (data) => {
      // Invalidate all affected article details
      data.articleIds.forEach((id) => {
        queryClient.invalidateQueries({ queryKey: articleKeys.detail(id) })
      })

      // Invalidate all lists (articles status changed)
      queryClient.invalidateQueries({ queryKey: articleKeys.lists() })

      // Invalidate stats (counts changed)
      queryClient.invalidateQueries({ queryKey: articleKeys.stats() })
    },

    ...options,
  })
}

/**
 * Hook for bulk publishing articles (convenience wrapper)
 */
export function useBulkPublish(options: UseBulkOperationOptions = {}) {
  const bulkOp = useBulkOperation(options)

  return {
    ...bulkOp,
    mutate: (articleIds: string[]) => {
      bulkOp.mutate({
        articleIds,
        operation: 'publish',
      })
    },
    mutateAsync: (articleIds: string[]) => {
      return bulkOp.mutateAsync({
        articleIds,
        operation: 'publish',
      })
    },
  }
}

/**
 * Hook for bulk archiving articles (convenience wrapper)
 */
export function useBulkArchive(options: UseBulkOperationOptions = {}) {
  const bulkOp = useBulkOperation(options)

  return {
    ...bulkOp,
    mutate: (articleIds: string[]) => {
      bulkOp.mutate({
        articleIds,
        operation: 'archive',
      })
    },
    mutateAsync: (articleIds: string[]) => {
      return bulkOp.mutateAsync({
        articleIds,
        operation: 'archive',
      })
    },
  }
}

/**
 * Hook for bulk deleting articles (convenience wrapper)
 */
export function useBulkDelete(options: UseBulkOperationOptions = {}) {
  const bulkOp = useBulkOperation(options)

  return {
    ...bulkOp,
    mutate: (articleIds: string[]) => {
      bulkOp.mutate({
        articleIds,
        operation: 'delete',
      })
    },
    mutateAsync: (articleIds: string[]) => {
      return bulkOp.mutateAsync({
        articleIds,
        operation: 'delete',
      })
    },
  }
}

/**
 * Hook for bulk restoring articles (convenience wrapper)
 */
export function useBulkRestore(options: UseBulkOperationOptions = {}) {
  const bulkOp = useBulkOperation(options)

  return {
    ...bulkOp,
    mutate: (articleIds: string[]) => {
      bulkOp.mutate({
        articleIds,
        operation: 'restore',
      })
    },
    mutateAsync: (articleIds: string[]) => {
      return bulkOp.mutateAsync({
        articleIds,
        operation: 'restore',
      })
    },
  }
}
