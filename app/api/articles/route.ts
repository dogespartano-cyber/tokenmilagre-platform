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
import { paginatedResponse, successResponse, errorResponse } from '@/lib/shared/helpers/response-helpers'
import { requireEditor } from '@/lib/shared/helpers/auth-helpers'
import { articleQueryInputCurrent, articleCreateInputCurrent } from '@/lib/schemas/article-schemas'

export const dynamic = 'force-dynamic';

// Interface para erros de validação Zod
interface ZodValidationIssue {
  path: (string | number)[]
  message: string
  code: string
}

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
        url: `/noticias/${article.slug}`,
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

    return paginatedResponse(
      formattedArticles,
      result.page,
      result.limit,
      result.total
    )
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
// ... imports ...

export async function POST(request: NextRequest) {
  // 1. Wrap Auth Check in Try/Catch to debug Auth failures properly
  let auth;
  try {
    auth = await requireEditor(request)
  } catch (authError: unknown) {
    const error = authError as Error
    console.error('❌ [POST /api/articles] Critical Auth Error:', error);
    return errorResponse('Authentication System Failure: ' + error.message, 500, {
      stack: error.stack,
      type: 'AuthSystemError'
    });
  }

  if (!auth.success) return auth.response

  const logger = ServiceLocator.getLogger()
  logger.setContext({ endpoint: '/api/articles', method: 'POST', userId: auth.user.id })

  try {
    const validation = ServiceLocator.getValidation()
    const articleService = ServiceLocator.getArticle()

    // Parse and validate request body
    const body = await request.json()

    logger.info('Creating article - Request body received', {
      title: body.title,
      slug: body.slug,
      type: body.type,
      category: body.category,
      categoryId: body.categoryId,
      hasContent: !!body.content,
      contentLength: body.content?.length,
      hasTags: !!body.tags,
      tags: body.tags,
      published: body.published,
      excerpt: body.excerpt?.substring(0, 50),
      authorId: body.authorId // Log authorId if present
    })

    // Validate using Zod schema
    let validated;
    try {
      validated = validation.validate(articleCreateInputCurrent, body)
    } catch (validationError: unknown) {
      const valError = validationError as { issues?: ZodValidationIssue[] }
      // Log validation error details to server console
      console.error('❌ [Validation Failed] Body that failed:', JSON.stringify(body, null, 2));
      console.error('❌ [Validation Failed] Error:', valError);

      // Return specific 400 response immediately for Zod errors
      if (valError.issues) {
        const zodErrors = valError.issues.map((issue: ZodValidationIssue) => ({
          path: issue.path.join('.'),
          message: issue.message,
          code: issue.code
        }))
        return errorResponse(
          'Validation failed: ' + zodErrors.map((e: { path: string; message: string }) => `${e.path}: ${e.message}`).join('; '),
          400,
          { validationErrors: zodErrors }
        )
      }
      throw validationError; // Re-throw to be caught by outer catch
    }

    // Create article using service layer
    // Service handles JSON stringification and authorId fallback
    const article = await articleService.create(validated, auth.user.id)

    logger.info('Article created successfully', {
      articleId: article.id,
      slug: article.slug,
      published: article.published
    })

    return successResponse(article)
  } catch (error: any) {
    // 🐛 ENHANCED LOGGING - Log full error details to server console
    console.error('❌ [POST /api/articles] Error creating article:', {
      errorName: error.name,
      errorMessage: error.message,
      errorStack: error.stack,
      errorDetails: error.details,
      zodIssues: error.issues,
      // Full error object for debugging
      fullError: JSON.stringify(error, Object.getOwnPropertyNames(error), 2)
    });

    logger.error('Error creating article', error as Error, {
      name: error.name,
      message: error.message,
      stack: error.stack
    })

    // Explicitly handle standard Error types to expose message
    const errorDetails = {
      name: error.name,
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      details: error.details,
      issues: error.issues
    };

    // If it's a known operational error, use its status code, otherwise 500
    // But force return the MESSAGE in the body so the user sees it
    return errorResponse(
      error.message || 'Internal Server Error',
      error.statusCode || 500,
      errorDetails
    );
  } finally {
    logger.clearContext()
  }
}
