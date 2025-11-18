/**
 * Articles API v2 - Bulk Operations
 *
 * POST /api/v2/articles/bulk - Perform bulk operations on multiple articles
 */

import { NextRequest, NextResponse } from 'next/server'
import { ServiceLocator } from '@/lib/di/container'
import { errorHandler } from '@/lib/services/error-service'
import { bulkArticleOperationSchema } from '@/lib/schemas/article-schemas'
import { authenticate, requireMinimumRole } from '@/lib/middleware/auth'
import { checkRateLimit, getRateLimitInfo } from '@/lib/middleware/rate-limit'

/**
 * POST /api/v2/articles/bulk
 * Performs bulk operation on multiple articles (max 50)
 *
 * Operations: 'publish' | 'archive' | 'delete' | 'restore'
 *
 * Request body:
 * {
 *   articleIds: string[], // Max 50 IDs
 *   operation: 'publish' | 'archive' | 'delete' | 'restore'
 * }
 *
 * @example
 * POST /api/v2/articles/bulk
 * Body: {
 *   articleIds: ['art-1', 'art-2', 'art-3'],
 *   operation: 'publish'
 * }
 *
 * Response:
 * {
 *   count: 3,
 *   operation: 'publish',
 *   articleIds: ['art-1', 'art-2', 'art-3']
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const articleService = ServiceLocator.getArticle()
    const logger = ServiceLocator.getLogger()
    const validation = ServiceLocator.getValidation()

    logger.setContext({ endpoint: '/api/v2/articles/bulk', method: 'POST' })

    // Require authentication
    const user = await authenticate(request)

    // Rate limiting
    await checkRateLimit(request, user)

    // Require minimum EDITOR role for bulk operations
    requireMinimumRole(user, 'EDITOR')

    // Add user context
    logger.setContext({ userId: user.id, userRole: user.role })

    // Parse request body
    const body = await request.json()

    // Validate bulk operation data
    const operation = validation.validate(bulkArticleOperationSchema, body)

    // Perform bulk operation (transactional, all-or-nothing)
    const count = await articleService.bulkOperation(operation, user.id)

    logger.info('Bulk operation completed successfully', {
      operation: operation.operation,
      count,
      requested: operation.articleIds.length,
    })

    // Get rate limit info for headers
    const rateLimitInfo = getRateLimitInfo(request, user)

    return NextResponse.json(
      {
        count,
        operation: operation.operation,
        articleIds: operation.articleIds,
      },
      {
        status: 200,
        headers: {
          'X-RateLimit-Limit': rateLimitInfo.limit.toString(),
          'X-RateLimit-Remaining': rateLimitInfo.remaining.toString(),
          'X-RateLimit-Reset': new Date(rateLimitInfo.reset).toISOString(),
        },
      }
    )
  } catch (error) {
    return errorHandler(error)
  } finally {
    const logger = ServiceLocator.getLogger()
    logger.clearContext()
  }
}
