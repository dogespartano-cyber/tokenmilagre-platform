/**
 * Article Detail API Route
 *
 * Handles individual article operations with:
 * - Service layer integration (ArticleService)
 * - Zod validation for inputs
 * - Structured logging with context
 * - Standardized response format
 * - Auth helpers for role-based access
 * - Legacy news.json fallback support
 */

import { NextRequest } from 'next/server'
import { ServiceLocator } from '@/lib/di/container'
import { requireAdmin, requireEditor } from '@/lib/shared/helpers/auth-helpers'
import { successResponse, errorResponse, notFoundResponse } from '@/lib/shared/helpers/response-helpers'
import { articleUpdateInputCurrent } from '@/lib/schemas/article-schemas'
import { promises as fs } from 'fs'
import path from 'path'

interface NewsItem {
  id: string
  slug?: string
  title: string
  summary: string
  content?: string
  url: string
  source: string
  sources?: string[]
  publishedAt: string
  category: string[]
  sentiment: 'positive' | 'neutral' | 'negative'
  keywords: string[]
  factChecked?: boolean
  lastVerified?: string
}

/**
 * GET /api/articles/[slug] - Get article by slug
 *
 * Public endpoint (no authentication required)
 * Supports fallback to legacy news.json for backwards compatibility
 *
 * @param slug - Article slug (URL-friendly identifier)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const logger = ServiceLocator.getLogger()

  try {
    const { slug } = await params

    logger.setContext({ endpoint: `/api/articles/${slug}`, method: 'GET' })
    logger.info('Fetching article by slug', { slug })

    const articleService = ServiceLocator.getArticle()

    // 1. Try to find in database (curated articles)
    const article = await articleService.getBySlug(slug)

    if (article) {
      // Format article for API response
      const formattedArticle: NewsItem = {
        id: article.id,
        slug: article.slug,
        title: article.title,
        summary: article.excerpt || '',
        content: article.content,
        url: `/noticias/${article.slug}`,
        source: '$MILAGRE Research',
        sources: ['$MILAGRE Research'],
        publishedAt: article.createdAt.toISOString(),
        category: [article.category.charAt(0).toUpperCase() + article.category.slice(1)],
        sentiment: article.sentiment as 'positive' | 'neutral' | 'negative',
        keywords: JSON.parse(article.tags || '[]'),
        factChecked: true,
        lastVerified: article.updatedAt.toISOString(),
      }

      logger.info('Article found in database', { id: article.id, slug })
      return successResponse(formattedArticle)
    }

    // 2. Fallback: Try to find in legacy news.json
    try {
      const newsFilePath = path.join(process.cwd(), 'data', 'news.json')
      const fileContent = await fs.readFile(newsFilePath, 'utf-8')
      const news: NewsItem[] = JSON.parse(fileContent)

      const newsArticle = news.find(item => item.slug === slug || item.id === slug)

      if (newsArticle) {
        logger.info('Article found in legacy news.json', { slug })
        return successResponse(newsArticle)
      }
    } catch (error) {
      logger.warn('Error reading legacy news.json', { slug, error: (error as Error).message })
    }

    // 3. Not found anywhere
    logger.info('Article not found', { slug })
    return notFoundResponse('Artigo não encontrado')
  } catch (error) {
    logger.error('Error fetching article', error as Error)
    return errorResponse(error as Error)
  } finally {
    logger.clearContext()
  }
}

/**
 * DELETE /api/articles/[slug] - Delete article
 *
 * Protected: ADMIN only
 *
 * @param slug - Article slug
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const auth = await requireAdmin(request)
  if (!auth.success) return auth.response

  const logger = ServiceLocator.getLogger()

  try {
    const { slug } = await params

    logger.setContext({ endpoint: `/api/articles/${slug}`, method: 'DELETE', userId: auth.user.id })
    logger.info('Deleting article', { slug })

    const articleService = ServiceLocator.getArticle()

    // Get article to retrieve ID
    const article = await articleService.getBySlug(slug)

    if (!article) {
      logger.warn('Article not found for deletion', { slug })
      return notFoundResponse('Artigo não encontrado')
    }

    // Delete article using service layer
    await articleService.delete(article.id, auth.user.id)

    logger.info('Article deleted successfully', { id: article.id, slug })

    return successResponse({ message: 'Artigo deletado com sucesso' })
  } catch (error) {
    logger.error('Error deleting article', error as Error)
    return errorResponse(error as Error)
  } finally {
    logger.clearContext()
  }
}

/**
 * PATCH /api/articles/[slug] - Update article
 *
 * Protected: ADMIN or EDITOR role
 *
 * @param slug - Article slug
 *
 * Body params: Partial article update (see articleUpdateInputCurrent schema)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const auth = await requireEditor(request)
  if (!auth.success) return auth.response

  const logger = ServiceLocator.getLogger()

  try {
    const { slug } = await params

    logger.setContext({ endpoint: `/api/articles/${slug}`, method: 'PATCH', userId: auth.user.id })

    const validation = ServiceLocator.getValidation()
    const articleService = ServiceLocator.getArticle()

    // Get article to retrieve ID
    const article = await articleService.getBySlug(slug)

    if (!article) {
      logger.warn('Article not found for update', { slug })
      return notFoundResponse('Artigo não encontrado')
    }

    // Parse and validate request body
    const body = await request.json()

    logger.info('Updating article', { id: article.id, slug, fields: Object.keys(body) })

    // Validate using Zod schema (partial update)
    const validated = validation.validate(articleUpdateInputCurrent, body)

    // Update article using service layer
    const updatedArticle = await articleService.update(article.id, validated, auth.user.id)

    logger.info('Article updated successfully', {
      id: updatedArticle.id,
      slug: updatedArticle.slug
    })

    return successResponse(updatedArticle)
  } catch (error) {
    logger.error('Error updating article', error as Error)
    return errorResponse(error as Error)
  } finally {
    logger.clearContext()
  }
}
