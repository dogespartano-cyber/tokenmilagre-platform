/**
 * Articles API v2 - List & Create
 *
 * GET  /api/v2/articles - List articles with filters/pagination
 * POST /api/v2/articles - Create new article
 */

import { NextRequest, NextResponse } from 'next/server'
import { ServiceLocator } from '@/lib/di/container'
import { errorHandler } from '@/lib/services/error-service'
import { articleQuerySchema } from '@/lib/schemas/article-schemas'
import { authenticate, authenticateOptional, requireMinimumRole } from '@/lib/middleware/auth'
import { checkRateLimit, getRateLimitInfo } from '@/lib/middleware/rate-limit'

// Force dynamic rendering to prevent build-time errors
export const dynamic = 'force-dynamic'

/**
 * GET /api/v2/articles
 * Lists articles with filtering and pagination
 *
 * Query params:
 * - page: number (default: 1)
 * - limit: number (default: 10, max: 100)
 * - type: 'NEWS' | 'EDUCATIONAL' | 'RESOURCE'
 * - status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
 * - categoryId: string
 * - authorId: string
 * - tagId: string
 * - search: string
 * - sortBy: 'createdAt' | 'publishedAt' | 'updatedAt' | 'title' | 'readTime'
 * - sortOrder: 'asc' | 'desc'
 * - featured: boolean
 *
 * @example
 * GET /api/v2/articles?page=1&limit=10&type=NEWS&status=PUBLISHED
 */
export async function GET(request: NextRequest) {
  try {
    const articleService = ServiceLocator.getArticle()
    const logger = ServiceLocator.getLogger()
    const validation = ServiceLocator.getValidation()

    logger.setContext({ endpoint: '/api/v2/articles', method: 'GET' })

    // Optional authentication (public endpoint with enhanced features for authenticated users)
    const user = await authenticateOptional(request)

    // Rate limiting (different limits by role)
    await checkRateLimit(request, user)

    // Add user context to logger
    if (user) {
      logger.setContext({ userId: user.id, userRole: user.role })
    }

    // Parse query params
    const searchParams = request.nextUrl.searchParams
    const queryData = {
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
      type: searchParams.get('type'),
      status: searchParams.get('status'),
      categoryId: searchParams.get('categoryId'),
      authorId: searchParams.get('authorId'),
      tagId: searchParams.get('tagId'),
      search: searchParams.get('search'),
      sortBy: searchParams.get('sortBy'),
      sortOrder: searchParams.get('sortOrder'),
      featured: searchParams.get('featured'),
      includeDeleted: searchParams.get('includeDeleted'),
    }

    // Validate query params
    const query = validation.validate(articleQuerySchema, queryData)

    // Get articles
    const result = await articleService.list(query)

    logger.info('Articles listed successfully', {
      count: result.articles.length,
      total: result.total,
      page: result.page,
      totalPages: result.totalPages,
    })

    // Get rate limit info for headers
    const rateLimitInfo = getRateLimitInfo(request, user)

    // Return response with rate limit headers
    return NextResponse.json(result, {
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
 * POST /api/v2/articles
 * Creates a new article
 *
 * Request body:
 * {
 *   title: string,
 *   slug: string,
 *   content: string,
 *   type: 'NEWS' | 'EDUCATIONAL' | 'RESOURCE',
 *   categoryId: string,
 *   authorId: string,
 *   tagIds: string[],
 *   status?: 'DRAFT' | 'PUBLISHED',
 *   excerpt?: string,
 *   coverImage?: { url: string, alt: string, width?: number, height?: number },
 *   citations?: Array<{ url: string, title?: string }>,
 *   relatedArticleIds?: string[],
 *   seo?: { metaTitle?: string, metaDescription?: string, keywords?: string[] },
 *   publishedAt?: Date,
 *   featuredUntil?: Date
 * }
 *
 * @example
 * POST /api/v2/articles
 * Body: { title: "Bitcoin News", slug: "bitcoin-news", content: "...", type: "NEWS", ... }
 */
export async function POST(request: NextRequest) {
  try {
    const articleService = ServiceLocator.getArticle()
    const logger = ServiceLocator.getLogger()

    logger.setContext({ endpoint: '/api/v2/articles', method: 'POST' })

    // Require authentication for creating articles
    const user = await authenticate(request)

    // Rate limiting
    await checkRateLimit(request, user)

    // Require minimum AUTHOR role to create articles
    requireMinimumRole(user, 'AUTHOR')

    // Add user context to logger
    logger.setContext({ userId: user.id, userRole: user.role })

    // Parse request body
    const body = await request.json()

    // Use authenticated user's ID
    const userId = user.id

    // Create article (validation happens inside service)
    const article = await articleService.create(body, userId)

    logger.info('Article created successfully', {
      articleId: article.id,
      slug: article.slug,
      type: article.type,
      status: article.status,
    })

    // Get rate limit info for headers
    const rateLimitInfo = getRateLimitInfo(request, user)

    // Return response with rate limit headers
    return NextResponse.json(article, {
      status: 201,
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
