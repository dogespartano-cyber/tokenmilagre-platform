/**
 * Articles API v2 - Statistics
 *
 * GET /api/v2/articles/stats - Get article statistics
 */

import { NextRequest, NextResponse } from 'next/server'
import { ServiceLocator } from '@/lib/di/container'
import { errorHandler } from '@/lib/services/error-service'
import { authenticateOptional } from '@/lib/middleware/auth'
import { checkRateLimit, getRateLimitInfo } from '@/lib/middleware/rate-limit'

export const dynamic = 'force-dynamic'

/**
 * GET /api/v2/articles/stats
 * Gets article statistics
 *
 * Response:
 * {
 *   total: number,
 *   published: number,
 *   draft: number,
 *   archived: number,
 *   byType: { NEWS: number, EDUCATIONAL: number, RESOURCE: number },
 *   byCategory: { [categoryId]: number }
 * }
 *
 * @example
 * GET /api/v2/articles/stats
 */
export async function GET(request: NextRequest) {
  try {
    const articleService = ServiceLocator.getArticle()
    const logger = ServiceLocator.getLogger()

    logger.setContext({ endpoint: '/api/v2/articles/stats', method: 'GET' })

    // Optional authentication
    const user = await authenticateOptional(request)

    // Rate limiting
    await checkRateLimit(request, user)

    // Add user context if authenticated
    if (user) {
      logger.setContext({ userId: user.id, userRole: user.role })
    }

    // Get article statistics
    const stats = await articleService.getStats()

    logger.info('Article statistics fetched successfully', {
      total: stats.total,
      published: stats.published,
      draft: stats.draft,
      archived: stats.archived,
    })

    // Get rate limit info for headers
    const rateLimitInfo = getRateLimitInfo(request, user)

    return NextResponse.json(stats, {
      status: 200,
      headers: {
        'X-RateLimit-Limit': rateLimitInfo.limit.toString(),
        'X-RateLimit-Remaining': rateLimitInfo.remaining.toString(),
        'X-RateLimit-Reset': new Date(rateLimitInfo.reset).toISOString(),
      },
    })
  } catch (error) {
    return errorHandler(error)
  } finally {
    const logger = ServiceLocator.getLogger()
    logger.clearContext()
  }
}
