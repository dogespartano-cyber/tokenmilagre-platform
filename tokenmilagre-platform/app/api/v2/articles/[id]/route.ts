/**
 * Articles API v2 - Single Article Operations
 *
 * GET    /api/v2/articles/[id] - Get article by ID
 * PATCH  /api/v2/articles/[id] - Update article
 * DELETE /api/v2/articles/[id] - Soft delete article
 */

import { NextRequest, NextResponse } from 'next/server'
import { ServiceLocator } from '@/lib/di/container'
import { errorHandler } from '@/lib/services/error-service'
import { authenticate, authenticateOptional, requireOwnershipOrAdmin } from '@/lib/middleware/auth'
import { checkRateLimit, getRateLimitInfo } from '@/lib/middleware/rate-limit'

// Force dynamic rendering to prevent build-time errors
export const dynamic = 'force-dynamic'

/**
 * GET /api/v2/articles/[id]
 * Gets a single article by ID
 *
 * @param id - Article ID (cuid)
 *
 * @example
 * GET /api/v2/articles/cm4x9y2z30000abc123def456
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const articleService = ServiceLocator.getArticle()
    const logger = ServiceLocator.getLogger()

    logger.setContext({ endpoint: `/api/v2/articles/${params.id}`, method: 'GET' })

    // Optional authentication
    const user = await authenticateOptional(request)

    // Rate limiting
    await checkRateLimit(request, user)

    // Add user context if authenticated
    if (user) {
      logger.setContext({ userId: user.id, userRole: user.role })
    }

    // Get article by ID
    const article = await articleService.getById(params.id)

    logger.info('Article fetched successfully', {
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

/**
 * PATCH /api/v2/articles/[id]
 * Updates an article (partial update)
 *
 * Request body (all fields optional):
 * {
 *   title?: string,
 *   slug?: string,
 *   content?: string,
 *   excerpt?: string,
 *   coverImage?: { url: string, alt: string } | null,
 *   type?: 'NEWS' | 'EDUCATIONAL' | 'RESOURCE',
 *   status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED',
 *   categoryId?: string,
 *   tagIds?: string[],
 *   citations?: Array<{ url: string, title?: string }>,
 *   relatedArticleIds?: string[],
 *   seo?: { metaTitle?: string, metaDescription?: string },
 *   publishedAt?: Date | null,
 *   featuredUntil?: Date | null
 * }
 *
 * @example
 * PATCH /api/v2/articles/cm4x9y2z30000abc123def456
 * Body: { title: "Updated Title", status: "PUBLISHED" }
 */
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const articleService = ServiceLocator.getArticle()
    const logger = ServiceLocator.getLogger()

    logger.setContext({ endpoint: `/api/v2/articles/${params.id}`, method: 'PATCH' })

    // Require authentication
    const user = await authenticate(request)

    // Rate limiting
    await checkRateLimit(request, user)

    // Add user context
    logger.setContext({ userId: user.id, userRole: user.role })

    // Get article to check ownership
    const existingArticle = await articleService.getById(params.id)

    // Check ownership or admin role
    requireOwnershipOrAdmin(user, existingArticle.authorId)

    // Parse request body
    const body = await request.json()

    // Update article (validation happens inside service)
    const article = await articleService.update(params.id, body, user.id)

    logger.info('Article updated successfully', {
      articleId: article.id,
      slug: article.slug,
      changes: Object.keys(body),
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

/**
 * DELETE /api/v2/articles/[id]
 * Soft deletes an article (sets deletedAt, status = DELETED)
 *
 * @example
 * DELETE /api/v2/articles/cm4x9y2z30000abc123def456
 */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const articleService = ServiceLocator.getArticle()
    const logger = ServiceLocator.getLogger()

    logger.setContext({ endpoint: `/api/v2/articles/${params.id}`, method: 'DELETE' })

    // Require authentication
    const user = await authenticate(request)

    // Rate limiting
    await checkRateLimit(request, user)

    // Add user context
    logger.setContext({ userId: user.id, userRole: user.role })

    // Get article to check ownership
    const existingArticle = await articleService.getById(params.id)

    // Check ownership or admin role
    requireOwnershipOrAdmin(user, existingArticle.authorId)

    // Soft delete article
    await articleService.delete(params.id, user.id)

    logger.info('Article soft-deleted successfully', {
      articleId: params.id,
    })

    // Get rate limit info for headers
    const rateLimitInfo = getRateLimitInfo(request, user)

    return NextResponse.json(
      { message: 'Article deleted successfully', id: params.id },
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
