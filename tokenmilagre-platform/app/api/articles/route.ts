/**
 * Articles API Route
 *
 * Handles article listing (GET) and creation (POST) with:
 * - Service layer integration (ArticleService)
 * - Zod validation for all inputs
 * - Structured logging with context
 * - Standardized response format
 * - Auth helpers for role-based access
 */

import { NextRequest } from 'next/server'
import { ServiceLocator } from '@/lib/di/container'
import { successResponse, errorResponse } from '@/lib/helpers/response-helpers'
import { requireEditor } from '@/lib/helpers/auth-helpers'
import { articleQueryInputCurrent, articleCreateInputCurrent } from '@/lib/schemas/article-schemas'

// Helper para parse seguro de JSON
function safeJSONParse<T>(json: string | null | undefined, fallback: T): T {
  if (!json) return fallback;
  try {
    return JSON.parse(json);
  } catch (e) {
    console.error('Erro ao fazer parse de JSON:', e);
    return fallback;
  }
}

/**
 * GET /api/articles - List articles with pagination and filters
 *
 * Query params:
 * - page: Page number (default 1)
 * - limit: Items per page (default 12, max 100)
 * - category: Filter by category
 * - published: Filter by published status (true/false/all)
 * - type: Filter by type (news/educational)
 * - level: Filter by level (iniciante/intermediario/avancado)
 * - search/query: Text search across title, excerpt, content, tags
 * - sortBy: Sort field (default: createdAt)
 * - sortOrder: Sort direction (asc/desc, default: desc)
 */
export async function GET(request: NextRequest) {
  const logger = ServiceLocator.getLogger()
  logger.setContext({ endpoint: '/api/articles', method: 'GET' })

  try {
    const validation = ServiceLocator.getValidation()
    const articleService = ServiceLocator.getArticle()

    // Parse and validate query parameters
    const searchParams = request.nextUrl.searchParams
    const rawQuery = {
      page: searchParams.get('page') || undefined,
      limit: searchParams.get('limit') || undefined,
      category: searchParams.get('category') || undefined,
      published: searchParams.get('published') || undefined,
      type: searchParams.get('type') || undefined,
      level: searchParams.get('level') || undefined,
      search: searchParams.get('search') || searchParams.get('query') || undefined,
      sortBy: searchParams.get('sortBy') || undefined,
      sortOrder: searchParams.get('sortOrder') || undefined,
    }

    const query = validation.validate(articleQueryInputCurrent, rawQuery)

    logger.info('Listing articles', {
      page: query.page,
      limit: query.limit,
      filters: { category: query.category, type: query.type, level: query.level }
    })

    // Fetch articles using service layer
    const result = await articleService.list(query)

    // Transform articles for API response
    const formattedArticles = result.articles.map((article) => {
      // Parse citations from factCheckSources
      const citations = safeJSONParse<string[]>(article.factCheckSources, []);

      const baseData = {
        id: article.id,
        slug: article.slug,
        title: article.title,
        summary: article.excerpt || '',
        content: article.content,
        publishedAt: article.createdAt.toISOString(),
        author: article.author?.name || article.author?.email || 'Unknown',
        citations,
        coverImage: article.coverImage || undefined,
        coverImageAlt: article.coverImageAlt || undefined,
      }

      // Educational article format
      if (article.type === 'educational') {
        return {
          ...baseData,
          type: article.type,
          level: article.level || 'iniciante',
          contentType: article.contentType || 'Artigo',
          readTime: article.readTime || '5 min',
          category: article.category,
        }
      }

      // News article format
      return {
        ...baseData,
        type: article.type,
        url: `/dashboard/noticias/${article.slug}`,
        source: '$MILAGRE Research',
        sources: ['$MILAGRE Research'],
        category: [article.category.charAt(0).toUpperCase() + article.category.slice(1)],
        sentiment: article.sentiment as 'positive' | 'neutral' | 'negative',
        keywords: safeJSONParse<string[]>(article.tags, []),
        factChecked: true,
        lastVerified: article.updatedAt.toISOString(),
      }
    })

    logger.info('Articles listed successfully', {
      count: formattedArticles.length,
      total: result.total,
      page: result.page,
    })

    return successResponse({
      data: formattedArticles,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
        hasMore: result.hasMore,
        count: formattedArticles.length,
      },
    })
  } catch (error) {
    logger.error('Error listing articles', error as Error)
    return errorResponse(error as Error)
  } finally {
    logger.clearContext()
  }
}

/**
 * POST /api/articles - Create new article
 *
 * Requires: ADMIN or EDITOR role
 *
 * Body params:
 * - title: Article title (required)
 * - slug: URL-friendly slug (required)
 * - content: Article content (required)
 * - category: Article category (required)
 * - excerpt: Short description
 * - tags: Array of tags or JSON string
 * - published: Publication status (default: false)
 * - type: Article type (news/educational, default: news)
 * - level: Education level (iniciante/intermediario/avancado)
 * - sentiment: Sentiment (positive/neutral/negative, default: neutral)
 * - readTime: Estimated read time (auto-calculated if not provided)
 * - authorId: Override author (defaults to current user)
 * - factCheckSources: Citations (JSON array of URLs)
 * - coverImage: Cover image URL
 * - coverImageAlt: Cover image alt text
 */
export async function POST(request: NextRequest) {
  const auth = await requireEditor(request)
  if (!auth.success) return auth.response

  const logger = ServiceLocator.getLogger()
  logger.setContext({ endpoint: '/api/articles', method: 'POST', userId: auth.user.id })

  try {
    const validation = ServiceLocator.getValidation()
    const articleService = ServiceLocator.getArticle()

    // Parse and validate request body
    const body = await request.json()

    logger.info('Creating article', { slug: body.slug, type: body.type })

    // Validate using Zod schema
    const validated = validation.validate(articleCreateInputCurrent, body)

    // Create article using service layer
    // Service handles JSON stringification and authorId fallback
    const article = await articleService.create(validated, auth.user.id)

    logger.info('Article created successfully', {
      articleId: article.id,
      slug: article.slug,
      published: article.published
    })

    return successResponse(article)
  } catch (error) {
    logger.error('Error creating article', error as Error)
    return errorResponse(error as Error)
  } finally {
    logger.clearContext()
  }
}
