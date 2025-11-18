/**
 * Articles API v2 - Restore Deleted Article
 *
 * POST /api/v2/articles/[id]/restore - Restore soft-deleted article
 */

import { NextRequest, NextResponse } from 'next/server'
import { ServiceLocator } from '@/lib/di/container'
import { errorHandler } from '@/lib/services/error-service'
import { authenticate, requireMinimumRole } from '@/lib/middleware/auth'
import { checkRateLimit, getRateLimitInfo } from '@/lib/middleware/rate-limit'

// Force dynamic rendering to prevent build-time errors
export const dynamic = 'force-dynamic'

/**
 * POST /api/v2/articles/[id]/restore
 * Restores a soft-deleted article (sets deletedAt = null, status = DRAFT)
 *
 * @example
 * POST /api/v2/articles/cm4x9y2z30000abc123def456/restore
 */
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const articleService = ServiceLocator.getArticle()
    const logger = ServiceLocator.getLogger()

    logger.setContext({
      endpoint: `/api/v2/articles/${params.id}/restore`,
      method: 'POST',
    })

    // Require authentication
    const user = await authenticate(request)

    // Rate limiting
    await checkRateLimit(request, user)

    // Require minimum EDITOR role to restore articles
    requireMinimumRole(user, 'EDITOR')

    // Add user context
    logger.setContext({ userId: user.id, userRole: user.role })

    // Restore article
    const article = await articleService.restore(params.id, user.id)

    logger.info('Article restored successfully', {
      articleId: article.id,
      slug: article.slug,
    })

    // Get rate limit info for headers
    const rateLimitInfo = getRateLimitInfo(request, user)

    return NextResponse.json(article, {
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
