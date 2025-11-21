/**
 * Admin Articles API Route
 *
 * Handles article listing for admin dashboard with:
 * - Service layer integration (ArticleService)
 * - Zod validation for query parameters
 * - Structured logging with context
 * - Standardized response format
 * - Auth helpers for role-based access (EDITOR/ADMIN)
 * - Pagination support
 */

import { NextRequest } from 'next/server'
import { ServiceLocator } from '@/lib/di/container'
import { requireEditor } from '@/lib/helpers/auth-helpers'
import { paginatedResponse, errorResponse } from '@/lib/helpers/response-helpers'
import { z } from 'zod'

/**
 * Admin article query schema
 * Supports "all" values for published/type filters
 */
const adminArticleQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(100),
  published: z.enum(['all', 'true', 'false']).optional().default('all'),
  type: z.enum(['all', 'news', 'educational']).optional().default('all'),
  sortBy: z.enum(['createdAt', 'updatedAt', 'title']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

/**
 * GET /api/admin/articles - List articles for admin dashboard
 *
 * Protected: ADMIN or EDITOR role
 *
 * Query params:
 * - page: Page number (default 1)
 * - limit: Items per page (default 100, max 100)
 * - published: Filter by publish status (all/true/false, default: all)
 * - type: Filter by article type (all/news/educational, default: all)
 * - sortBy: Sort field (createdAt/updatedAt/title, default: createdAt)
 * - sortOrder: Sort direction (asc/desc, default: desc)
 */
export async function GET(request: NextRequest) {
  const auth = await requireEditor(request)
  if (!auth.success) return auth.response

  const logger = ServiceLocator.getLogger()
  logger.setContext({ endpoint: '/api/admin/articles', method: 'GET', userId: auth.user.id })

  try {
    const validation = ServiceLocator.getValidation()
    const articleService = ServiceLocator.getArticle()

    // Parse and validate query parameters
    const searchParams = request.nextUrl.searchParams
    const rawQuery = {
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
      published: searchParams.get('published'),
      type: searchParams.get('type'),
      sortBy: searchParams.get('sortBy'),
      sortOrder: searchParams.get('sortOrder'),
    }

    const query = validation.validate(adminArticleQuerySchema, rawQuery)

    // Transform query for service layer
    const serviceQuery: any = {
      page: query.page,
      limit: query.limit,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    }

    // Handle "all" filters - only add filter if not "all"
    if (query.published !== 'all') {
      serviceQuery.published = query.published === 'true'
    }

    if (query.type !== 'all') {
      serviceQuery.type = query.type
    }

    logger.info('Listing articles (admin)', {
      page: query.page,
      limit: query.limit,
      filters: { published: query.published, type: query.type }
    })

    // Fetch articles using service layer
    const result = await articleService.list(serviceQuery)

    // Format articles for admin dashboard
    const formattedArticles = result.articles.map((article) => ({
      id: article.id,
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt || '',
      category: article.category,
      type: article.type,
      level: article.level,
      sentiment: article.sentiment,
      published: article.published,
      createdAt: article.createdAt.toISOString(),
      author: {
        name: article.author?.name || article.author?.email || 'Unknown',
        email: article.author?.email || 'unknown@example.com'
      }
    }))

    logger.info('Articles listed successfully (admin)', {
      count: formattedArticles.length,
      total: result.total,
      page: result.page
    })

    return paginatedResponse(
      formattedArticles,
      result.page,
      result.limit,
      result.total
    )
  } catch (error) {
    logger.error('Error listing articles (admin)', error as Error)
    return errorResponse(error as Error)
  } finally {
    logger.clearContext()
  }
}
