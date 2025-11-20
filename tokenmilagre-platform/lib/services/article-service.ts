/**
 * ArticleService - Complete Article CRUD Operations
 *
 * Centralized service for all article-related operations with:
 * - Complete CRUD operations with Prisma
 * - Automatic slug generation and validation
 * - Read time calculation
 * - Structured logging with LoggerService
 * - Error handling with ErrorService
 * - Validation with ValidationService
 * - Type safety and DI integration
 *
 * @example
 * ```typescript
 * import { ServiceLocator } from '@/lib/di/container'
 *
 * const articleService = ServiceLocator.getArticle()
 * const article = await articleService.create(data, userId)
 * const articles = await articleService.list({ page: 1, limit: 12 })
 * ```
 */

import { prisma } from '@/lib/prisma'
import { Article, Prisma } from '@/lib/generated/prisma'
import { ServiceLocator } from '@/lib/di/container'
import { PAGINATION } from '@/lib/constants/pagination'
import { NotFoundError, ConflictError, ValidationError } from './error-service'
import type {
  ArticleQueryCurrent as ArticleQuery,
  ArticleCreateInputCurrent as ArticleCreateInput,
  ArticleUpdateInputCurrent as ArticleUpdateInput,
  BulkArticleOperationCurrent as BulkArticleOperation,
} from '@/lib/schemas/article-schemas'

/**
 * Article with author relation
 */
export type ArticleWithRelations = Article & {
  author?: { id: string; name: string | null; email: string }
}

/**
 * Paginated article list result
 */
export interface ArticleListResult {
  articles: ArticleWithRelations[]
  total: number
  page: number
  limit: number
  totalPages: number
  hasMore: boolean
}

/**
 * Article statistics
 */
export interface ArticleStats {
  total: number
  published: number
  draft: number
  byType: Record<string, number>
  byCategory: Record<string, number>
  bySentiment: Record<string, number>
  avgFactCheckScore: number | null
  withFactCheck: number
}

/**
 * Bulk operation result
 */
export interface BulkOperationResult {
  count: number
  articleIds: string[]
}

/**
 * Article Service
 * Handles all article CRUD operations with Clean Architecture patterns
 */
export class ArticleService {
  // Lazy initialization to avoid circular dependency
  private get logger() {
    return ServiceLocator.getLogger()
  }

  private get validation() {
    return ServiceLocator.getValidation()
  }

  /**
   * Create a new article
   *
   * @param data - Article creation data
   * @param userId - User ID creating the article
   * @returns Created article with author relation
   */
  async create(data: ArticleCreateInput, userId: string): Promise<ArticleWithRelations> {
    this.logger.setContext({ operation: 'article.create', userId, slug: data.slug })

    try {
      this.logger.info('Creating article', { title: data.title, type: data.type })

      // Check slug uniqueness
      const existing = await prisma.article.findUnique({
        where: { slug: data.slug },
        select: { id: true },
      })

      if (existing) {
        throw new ConflictError(`Article with slug "${data.slug}" already exists`)
      }

      // Verify relationships if IDs are provided
      if (data.categoryId || data.tagIds || data.relatedArticleIds) {
        await this.verifyRelationships({
          categoryId: data.categoryId,
          tagIds: data.tagIds,
          relatedArticleIds: data.relatedArticleIds,
        })
      }

      // Auto-calculate readTime if not provided (returns "X min" format)
      let readTime: string
      if (data.readTime) {
        // Convert to string format if number provided
        readTime = typeof data.readTime === 'number'
          ? `${data.readTime} min`
          : data.readTime
      } else {
        // calculateReadTime returns number, convert to "X min" format
        const minutes = this.validation.calculateReadTime(data.content)
        readTime = `${minutes} min`
      }

      // Sanitize content
      const sanitizedContent = this.validation.sanitizeHtml(data.content)

      // Prepare tags array - use tagIds if provided, otherwise tags
      const tagsArray = data.tagIds || data.tags || []

      // Create article with proper Prisma types
      const createData: any = {
        title: data.title,
        slug: data.slug,
        content: sanitizedContent,
        type: data.type || 'news',
        excerpt: data.excerpt,
        published: data.published ?? false,
        authorId: data.authorId || userId,
        category: data.category,
        tags: JSON.stringify(tagsArray),
        sentiment: data.sentiment || 'neutral',
        level: data.level,
        contentType: data.contentType,
        readTime,
        warningLevel: data.warningLevel,
        securityTips: data.securityTips ? JSON.stringify(data.securityTips) : null,
        coverImage: data.coverImage,
        coverImageAlt: data.coverImageAlt,
        relatedArticles: data.relatedArticles ? JSON.stringify(data.relatedArticles) : null,
        projectHighlight: data.projectHighlight ?? false,
        factCheckScore: data.factCheckScore,
        factCheckSources: data.factCheckSources ? JSON.stringify(data.factCheckSources) : null,
        factCheckDate: data.factCheckDate,
        factCheckStatus: data.factCheckStatus,
      }

      // Add citations if provided
      if (data.citations && data.citations.length > 0) {
        createData.citations = {
          create: data.citations.map((citation, index) => {
            const normalized = this.validation.normalizeCitation(citation)
            return {
              url: normalized.url,
              title: normalized.title,
              domain: normalized.domain,
              order: citation.order ?? index,
              verified: citation.verified ?? false,
            }
          }),
        }
      }

      const article = await prisma.article.create({
        data: createData,
        include: {
          author: {
            select: { id: true, name: true, email: true },
          },
        },
      })

      this.logger.info('Article created successfully', { articleId: article.id, slug: article.slug })

      return article
    } catch (error) {
      this.logger.error('Error creating article', error as Error, { slug: data.slug })
      throw error
    } finally {
      this.logger.clearContext()
    }
  }

  /**
   * Get article by ID
   *
   * @param id - Article ID
   * @returns Article with author
   * @throws NotFoundError if article not found
   */
  async getById(id: string): Promise<ArticleWithRelations> {
    this.logger.setContext({ operation: 'article.getById', id })

    try {
      const article = await prisma.article.findUnique({
        where: { id },
        include: {
          author: {
            select: { id: true, name: true, email: true },
          },
        },
      })

      if (!article) {
        throw new NotFoundError(`Article with ID "${id}" not found`)
      }

      this.logger.info('Article found by ID', { id, slug: article.slug })

      return article
    } catch (error) {
      this.logger.error('Error getting article by ID', error as Error, { id })
      throw error
    } finally {
      this.logger.clearContext()
    }
  }

  /**
   * Get article by slug
   *
   * @param slug - Article slug
   * @returns Article with author
   * @throws NotFoundError if article not found
   */
  async getBySlug(slug: string): Promise<ArticleWithRelations> {
    this.logger.setContext({ operation: 'article.getBySlug', slug })

    try {
      const article = await prisma.article.findUnique({
        where: { slug },
        include: {
          author: {
            select: { id: true, name: true, email: true },
          },
        },
      })

      if (!article) {
        throw new NotFoundError(`Article with slug "${slug}" not found`)
      }

      this.logger.info('Article found by slug', { id: article.id, slug })

      return article
    } catch (error) {
      this.logger.error('Error getting article by slug', error as Error, { slug })
      throw error
    } finally {
      this.logger.clearContext()
    }
  }

  /**
   * List articles with pagination and filters
   *
   * @param query - Query parameters for filtering and pagination
   * @returns Paginated list of articles
   */
  async list(query: Partial<ArticleQuery> = {}): Promise<ArticleListResult> {
    const page = query.page ?? PAGINATION.DEFAULT_PAGE
    const limit = Math.min(query.limit ?? PAGINATION.DEFAULT_LIMIT, PAGINATION.MAX_LIMIT)
    const skip = (page - 1) * limit

    this.logger.setContext({ operation: 'article.list', page, limit })

    try {
      // Build where clause
      const where: Prisma.ArticleWhereInput = {}

      if (query.published !== undefined) {
        where.published = query.published
      }

      if (query.type) {
        where.type = query.type
      }

      if ((query as any).status) {
        (where as any).status = (query as any).status
      }

      if (query.category) {
        where.category = query.category
      }

      if (query.authorId) {
        where.authorId = query.authorId
      }

      if (query.search) {
        where.OR = [
          { title: { contains: query.search, mode: 'insensitive' } },
          { content: { contains: query.search, mode: 'insensitive' } },
          { excerpt: { contains: query.search, mode: 'insensitive' } },
        ]
      }

      if (query.sentiment) {
        where.sentiment = query.sentiment
      }

      if (query.level) {
        where.level = query.level
      }

      if (query.projectHighlight !== undefined) {
        where.projectHighlight = query.projectHighlight
      }

      // Build orderBy
      const orderBy: Prisma.ArticleOrderByWithRelationInput = {}
      if (query.sortBy) {
        (orderBy as any)[query.sortBy] = query.sortOrder || 'desc'
      } else {
        orderBy.createdAt = 'desc'
      }

      // Execute queries in parallel
      const [articles, total] = await Promise.all([
        prisma.article.findMany({
          where,
          orderBy,
          skip,
          take: limit,
          include: {
            author: {
              select: { id: true, name: true, email: true },
            },
          },
        }),
        prisma.article.count({ where }),
      ])

      const totalPages = Math.ceil(total / limit)
      const hasMore = page < totalPages

      this.logger.info('Articles listed successfully', {
        count: articles.length,
        total,
        page,
        totalPages,
      })

      return {
        articles,
        total,
        page,
        limit,
        totalPages,
        hasMore,
      }
    } catch (error) {
      this.logger.error('Error listing articles', error as Error, { page, limit })
      throw error
    } finally {
      this.logger.clearContext()
    }
  }

  /**
   * Update article
   *
   * @param id - Article ID
   * @param data - Update data
   * @param userId - User ID performing the update
   * @returns Updated article with author
   */
  async update(
    id: string,
    data: Partial<ArticleUpdateInput>,
    userId: string
  ): Promise<ArticleWithRelations> {
    this.logger.setContext({ operation: 'article.update', id, userId })

    try {
      this.logger.info('Updating article', { id, fields: Object.keys(data) })

      // Check if article exists
      const existing = await prisma.article.findUnique({
        where: { id },
        select: { id: true, slug: true },
      })

      if (!existing) {
        throw new NotFoundError(`Article with ID "${id}" not found`)
      }

      // Verify relationships if IDs are provided
      if (data.categoryId || data.tagIds || data.relatedArticleIds) {
        await this.verifyRelationships({
          categoryId: data.categoryId,
          tagIds: data.tagIds,
          relatedArticleIds: data.relatedArticleIds,
        })
      }

      // If updating slug, check uniqueness
      if (data.slug && data.slug !== existing.slug) {
        const slugExists = await prisma.article.findUnique({
          where: { slug: data.slug },
          select: { id: true },
        })

        if (slugExists) {
          throw new ConflictError(`Article with slug "${data.slug}" already exists`)
        }
      }

      // Prepare update data
      const updateData: Prisma.ArticleUpdateInput = {}

      if (data.title !== undefined) updateData.title = data.title
      if (data.slug !== undefined) updateData.slug = data.slug
      if (data.content !== undefined) {
        updateData.content = this.validation.sanitizeHtml(data.content)
        // Auto-recalculate readTime when content changes (unless explicitly provided)
        if (data.readTime === undefined) {
          const minutes = this.validation.calculateReadTime(data.content)
          updateData.readTime = `${minutes} min`
        }
      }
      if (data.excerpt !== undefined) updateData.excerpt = data.excerpt
      if (data.type !== undefined) updateData.type = data.type
      if (data.published !== undefined) updateData.published = data.published
      if (data.category !== undefined) updateData.category = data.category
      if (data.categoryId !== undefined) updateData.category = data.categoryId

      // Handle tags update - support both JSON string array and relationship updates
      if (data.tagIds !== undefined) {
        updateData.tags = JSON.stringify(data.tagIds)
      } else if (data.tags !== undefined) {
        updateData.tags = JSON.stringify(data.tags)
      }
      if (data.sentiment !== undefined) updateData.sentiment = data.sentiment
      if (data.level !== undefined) updateData.level = data.level
      if (data.contentType !== undefined) updateData.contentType = data.contentType
      if (data.readTime !== undefined) {
        // Ensure readTime is in string format "X min"
        updateData.readTime = typeof data.readTime === 'number'
          ? `${data.readTime} min`
          : data.readTime
      }
      if (data.warningLevel !== undefined) updateData.warningLevel = data.warningLevel
      if (data.securityTips !== undefined) {
        updateData.securityTips = JSON.stringify(data.securityTips)
      }
      if (data.coverImage !== undefined) updateData.coverImage = data.coverImage
      if (data.coverImageAlt !== undefined) updateData.coverImageAlt = data.coverImageAlt
      if (data.relatedArticles !== undefined) {
        updateData.relatedArticles = JSON.stringify(data.relatedArticles)
      }
      if (data.projectHighlight !== undefined) updateData.projectHighlight = data.projectHighlight
      if (data.factCheckScore !== undefined) updateData.factCheckScore = data.factCheckScore
      if (data.factCheckSources !== undefined) {
        updateData.factCheckSources = JSON.stringify(data.factCheckSources)
      }
      if (data.factCheckDate !== undefined) updateData.factCheckDate = data.factCheckDate
      if (data.factCheckStatus !== undefined) updateData.factCheckStatus = data.factCheckStatus

      // Update article
      const article = await prisma.article.update({
        where: { id },
        data: updateData,
        include: {
          author: {
            select: { id: true, name: true, email: true },
          },
        },
      })

      this.logger.info('Article updated successfully', { id, slug: article.slug })

      return article
    } catch (error) {
      this.logger.error('Error updating article', error as Error, { id })
      throw error
    } finally {
      this.logger.clearContext()
    }
  }

  /**
   * Delete article (permanent deletion)
   *
   * @param id - Article ID
   * @param userId - User ID performing the deletion
   */
  async delete(id: string, userId: string): Promise<void> {
    this.logger.setContext({ operation: 'article.delete', id, userId })

    try {
      this.logger.info('Deleting article', { id })

      const article = await prisma.article.findUnique({
        where: { id },
        select: { id: true, slug: true },
      })

      if (!article) {
        throw new NotFoundError(`Article with ID "${id}" not found`)
      }

      await prisma.article.delete({
        where: { id },
      })

      this.logger.info('Article deleted successfully', { id, slug: article.slug })
    } catch (error) {
      this.logger.error('Error deleting article', error as Error, { id })
      throw error
    } finally {
      this.logger.clearContext()
    }
  }

  /**
   * Restore deleted article (for soft delete - not implemented in current schema)
   * This is a placeholder for future implementation
   */
  async restore(id: string, userId: string): Promise<ArticleWithRelations> {
    throw new Error('Restore not implemented - current schema does not support soft deletes')
  }

  /**
   * Bulk operations on articles
   *
   * @param operation - Bulk operation configuration
   * @param userId - User ID performing the operation
   * @returns Result with count and affected IDs
   */
  async bulkOperation(operation: BulkArticleOperation, userId?: string): Promise<BulkOperationResult> {
    this.logger.setContext({ operation: 'article.bulkOperation', userId })

    try {
      this.logger.info('Executing bulk operation', {
        action: operation.action,
        articleIds: operation.articleIds.length,
      })

      let result: Prisma.BatchPayload
      const articleIds = operation.articleIds

      switch (operation.action) {
        case 'publish':
          result = await prisma.article.updateMany({
            where: { id: { in: articleIds } },
            data: { published: true },
          })
          break

        case 'unpublish':
          result = await prisma.article.updateMany({
            where: { id: { in: articleIds } },
            data: { published: false },
          })
          break

        case 'delete':
          result = await prisma.article.deleteMany({
            where: { id: { in: articleIds } },
          })
          break

        case 'updateCategory':
          if (!operation.data?.category) {
            throw new ValidationError('Category is required for updateCategory action')
          }
          result = await prisma.article.updateMany({
            where: { id: { in: articleIds } },
            data: { category: operation.data.category },
          })
          break

        default:
          throw new ValidationError(`Unknown bulk action: ${operation.action}`)
      }

      this.logger.info('Bulk operation completed', {
        action: operation.action,
        count: result.count,
      })

      return {
        count: result.count,
        articleIds,
      }
    } catch (error) {
      this.logger.error('Error in bulk operation', error as Error, {
        action: operation.action,
      })
      throw error
    } finally {
      this.logger.clearContext()
    }
  }

  /**
   * Get article statistics
   *
   * @returns Article statistics
   */
  async getStats(): Promise<ArticleStats> {
    this.logger.setContext({ operation: 'article.getStats' })

    try {
      this.logger.info('Fetching article statistics')

      const [
        total,
        published,
        draft,
        byType,
        byCategory,
        bySentiment,
        factCheckStats,
      ] = await Promise.all([
        prisma.article.count(),
        prisma.article.count({ where: { published: true } }),
        prisma.article.count({ where: { published: false } }),
        prisma.article.groupBy({
          by: ['type'],
          _count: true,
        }),
        prisma.article.groupBy({
          by: ['category'],
          _count: true,
        }),
        prisma.article.groupBy({
          by: ['sentiment'],
          _count: true,
        }),
        prisma.article.aggregate({
          _avg: { factCheckScore: true },
          _count: { factCheckScore: true },
        }),
      ])

      const stats: ArticleStats = {
        total,
        published,
        draft,
        byType: Object.fromEntries(byType.map((t) => [t.type, t._count])),
        byCategory: Object.fromEntries(byCategory.map((c) => [c.category, c._count])),
        bySentiment: Object.fromEntries(bySentiment.map((s) => [s.sentiment, s._count])),
        avgFactCheckScore: factCheckStats._avg.factCheckScore,
        withFactCheck: factCheckStats._count.factCheckScore,
      }

      this.logger.info('Article statistics fetched', stats)

      return stats
    } catch (error) {
      this.logger.error('Error fetching article statistics', error as Error)
      throw error
    } finally {
      this.logger.clearContext()
    }
  }

  /**
   * Verify that related entities exist
   *
   * @param data - Relationship IDs to verify
   * @throws NotFoundError if any related entity does not exist
   * @private
   */
  private async verifyRelationships(data: {
    categoryId?: string
    tagIds?: string[]
    relatedArticleIds?: string[]
  }): Promise<void> {
    // Verify category exists
    if (data.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: data.categoryId },
        select: { id: true },
      })

      if (!category) {
        throw new NotFoundError(`Category with ID "${data.categoryId}" not found`)
      }
    }

    // Verify tags exist
    if (data.tagIds && data.tagIds.length > 0) {
      const tags = await prisma.tag.findMany({
        where: { id: { in: data.tagIds } },
        select: { id: true },
      })

      if (tags.length !== data.tagIds.length) {
        const foundIds = tags.map((t) => t.id)
        const missingIds = data.tagIds.filter((id) => !foundIds.includes(id))
        throw new NotFoundError(`Tags not found: ${missingIds.join(', ')}`)
      }
    }

    // Verify related articles exist
    if (data.relatedArticleIds && data.relatedArticleIds.length > 0) {
      const articles = await prisma.article.findMany({
        where: { id: { in: data.relatedArticleIds } },
        select: { id: true },
      })

      if (articles.length !== data.relatedArticleIds.length) {
        const foundIds = articles.map((a) => a.id)
        const missingIds = data.relatedArticleIds.filter((id) => !foundIds.includes(id))
        throw new NotFoundError(`Related articles not found: ${missingIds.join(', ')}`)
      }
    }
  }

  /**
   * Calculate read time based on content length
   * Assumes 200 words per minute reading speed
   *
   * @param content - Article content (markdown or plain text)
   * @returns Read time string (e.g., "5 min")
   */
  private calculateReadTime(content: string): string {
    const wordsPerMinute = 200
    const wordCount = content.split(/\s+/).length
    const minutes = Math.ceil(wordCount / wordsPerMinute)
    return `${minutes} min`
  }
}

// Export singleton instance
export const articleService = new ArticleService()
