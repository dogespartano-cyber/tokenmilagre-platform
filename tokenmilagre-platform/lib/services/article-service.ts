/**
 * ArticleService - Article CRUD Operations
 *
 * Centralized service for all article-related operations with:
 * - Complete CRUD operations
 * - Automatic slug generation
 * - Read time calculation
 * - Relationship management (tags, citations, related articles)
 * - Soft deletes
 * - Bulk operations with transactions
 * - Integration with LoggerService, ErrorService, ValidationService
 *
 * @example
 * ```typescript
 * import { articleService } from '@/lib/services/article-service'
 *
 * // Create article
 * const article = await articleService.create(data, userId)
 *
 * // Get article by slug
 * const article = await articleService.getBySlug('bitcoin-news')
 *
 * // Update article
 * await articleService.update(id, updates, userId)
 *
 * // Soft delete
 * await articleService.delete(id, userId)
 * ```
 */

import { prisma } from '@/lib/prisma'
import { Article, Prisma } from '@/lib/generated/prisma'
import { logger } from './logger-service'
import {
  NotFoundError,
  ConflictError,
  ValidationError,
  DatabaseError,
  assertExists,
} from './error-service'
import { validationService } from './validation-service'
import {
  ArticleCreateInput,
  ArticleUpdateInput,
  ArticleQuery,
  BulkArticleOperation,
  articleCreateSchema,
  articleUpdateSchema,
} from '@/lib/schemas/article-schemas'

/**
 * Article with relations
 */
export type ArticleWithRelations = Article & {
  author?: { id: string; name: string | null; email: string }
  category?: { id: string; name: string; slug: string }
  tags?: Array<{ tag: { id: string; name: string; slug: string } }>
  citations?: Array<{ id: string; url: string; title: string | null; domain: string | null }>
  relatedFrom?: Array<{ toArticle: Article }>
}

/**
 * Paginated article response
 */
export interface PaginatedArticles {
  articles: ArticleWithRelations[]
  total: number
  page: number
  limit: number
  totalPages: number
}

/**
 * Article statistics
 */
export interface ArticleStats {
  total: number
  published: number
  draft: number
  archived: number
  byType: Record<string, number>
  byCategory: Record<string, number>
}

/**
 * Article Service Options
 */
export interface ArticleServiceOptions {
  /** Whether to include deleted articles in queries */
  includeDeleted?: boolean

  /** Maximum articles per bulk operation */
  maxBulkSize?: number
}

/**
 * Converts status from schema format (UPPERCASE) to Prisma format (lowercase)
 */
function normalizeStatus(status: string | undefined): string | undefined {
  if (!status) return undefined
  const normalized = status.toLowerCase()
  // Map DELETED to archived since DELETED is not in the enum
  if (normalized === 'deleted') return 'archived'
  if (normalized === 'draft' || normalized === 'published' || normalized === 'archived') {
    return normalized
  }
  return undefined
}

/**
 * Converts type from schema format (UPPERCASE) to Prisma format (lowercase)
 */
function normalizeType(type: string | undefined): string | undefined {
  if (!type) return undefined
  const normalized = type.toLowerCase()
  if (normalized === 'news' || normalized === 'educational') {
    return normalized
  }
  // Map RESOURCE to news as fallback since RESOURCE is not in the enum
  if (normalized === 'resource') return 'news'
  return undefined
}

/**
 * Article Service
 * Handles all article CRUD operations
 */
export class ArticleService {
  private readonly options: Required<ArticleServiceOptions>

  constructor(options: ArticleServiceOptions = {}) {
    this.options = {
      includeDeleted: options.includeDeleted ?? false,
      maxBulkSize: options.maxBulkSize ?? 50,
    }
  }

  /**
   * Creates a new article
   * - Validates all data
   * - Ensures slug uniqueness
   * - Auto-calculates readTime if not provided
   * - Creates relationships (tags, citations, related articles)
   *
   * @param data - Article creation data
   * @param userId - User ID creating the article
   * @returns Created article with relations
   */
  async create(data: ArticleCreateInput, userId: string): Promise<ArticleWithRelations> {
    logger.setContext({ operation: 'article.create', userId, slug: data.slug })

    try {
      // Validate data
      const validated = validationService.validate(articleCreateSchema, data)

      // Check slug uniqueness
      const existing = await prisma.article.findUnique({
        where: { slug: validated.slug },
        select: { id: true },
      })

      if (existing) {
        throw new ConflictError('Slug já existe', { slug: validated.slug })
      }

      // Auto-calculate readTime if not provided
      const readTime = validated.readTime ?? validationService.calculateReadTime(validated.content)

      // Sanitize content
      const sanitizedContent = validationService.sanitizeHtml(validated.content)

      // Verify relationships exist
      await this.verifyRelationships({
        categoryId: validated.categoryId,
        tagIds: validated.tagIds,
        relatedArticleIds: validated.relatedArticleIds,
      })

      // Normalize enums to lowercase
      const status = normalizeStatus(validated.status) ?? 'draft'
      const type = normalizeType(validated.type) ?? 'news'

      // Create article with relationships
      const article = await prisma.article.create({
        data: {
          title: validated.title,
          slug: validated.slug,
          content: sanitizedContent,
          excerpt: validated.excerpt || '',
          type,
          status,
          authorId: validated.authorId,
          ...(validated.categoryId && { categoryId: validated.categoryId }),
          readTime: `${readTime} min`,

          coverImage: validated.coverImage?.url,
          coverImageAlt: validated.coverImage?.alt,
          // Note: seo field not present in schema v2
          // Create tags relationship
          ...(validated.tagIds && validated.tagIds.length > 0
            ? {
              tags: {
                create: validated.tagIds.map((tagId) => ({
                  tagId,
                })),
              },
            }
            : {}),
          // Create citations if provided
          ...(validated.citations && validated.citations.length > 0
            ? {
              citations: {
                create: validated.citations.map((citation, index) => {
                  const normalized = validationService.normalizeCitation(citation)
                  return {
                    url: normalized.url,
                    title: normalized.title,
                    domain: normalized.domain,
                    order: citation.order ?? index,
                    verified: citation.verified ?? false,
                  }
                }),
              },
            }
            : {}),
          // Create related articles if provided
          ...(validated.relatedArticleIds && validated.relatedArticleIds.length > 0
            ? {
              relatedFrom: {
                create: validated.relatedArticleIds.map((relatedId) => ({
                  toArticleId: relatedId,
                })),
              },
            }
            : {}),
        },
        include: {
          author: { select: { id: true, name: true, email: true } },
          category: { select: { id: true, name: true, slug: true } },
          tags: { include: { tag: true } },
          citations: { orderBy: { order: 'asc' } },
          relatedFrom: { include: { toArticle: true } },
        },
      })

      logger.info('Article created successfully', {
        articleId: article.id,
        slug: article.slug,
        type: article.type,
        status: article.status,
      })

      return article as ArticleWithRelations
    } catch (error) {
      logger.error('Failed to create article', error as Error, {
        slug: data.slug,
        userId,
      })
      throw error
    } finally {
      logger.clearContext()
    }
  }

  /**
   * Gets article by ID
   *
   * @param id - Article ID
   * @param includeDeleted - Whether to include deleted articles
   * @returns Article with relations
   */
  async getById(id: string, includeDeleted: boolean = false): Promise<ArticleWithRelations> {
    logger.debug('Fetching article by ID', { articleId: id })

    const article = await prisma.article.findFirst({
      where: {
        id,
        ...(includeDeleted ? {} : { deletedAt: null }),
      },
      include: {
        author: { select: { id: true, name: true, email: true } },
        category: { select: { id: true, name: true, slug: true } },
        tags: { include: { tag: true } },
        citations: { orderBy: { order: 'asc' } },
        relatedFrom: { include: { toArticle: true } },
      },
    })

    assertExists(article, 'Artigo não encontrado', { articleId: id })

    logger.debug('Article fetched successfully', {
      articleId: article.id,
      slug: article.slug,
    })

    return article as ArticleWithRelations
  }

  /**
   * Gets article by slug (public-facing)
   *
   * @param slug - Article slug
   * @returns Article with relations
   */
  async getBySlug(slug: string): Promise<ArticleWithRelations> {
    logger.debug('Fetching article by slug', { slug })

    const article = await prisma.article.findFirst({
      where: {
        slug,
        deletedAt: null,
      },
      include: {
        author: { select: { id: true, name: true, email: true } },
        category: { select: { id: true, name: true, slug: true } },
        tags: { include: { tag: true } },
        citations: { orderBy: { order: 'asc' } },
        relatedFrom: { include: { toArticle: true } },
      },
    })

    assertExists(article, 'Artigo não encontrado', { slug })

    return article as ArticleWithRelations
  }

  /**
   * Lists articles with filtering and pagination
   *
   * @param query - Query parameters
   * @returns Paginated articles
   */
  async list(query: ArticleQuery): Promise<PaginatedArticles> {
    logger.debug('Listing articles', { query })

    const { page, limit, sortBy, sortOrder, includeDeleted, ...filters } = query

    // Normalize status and type filters
    const normalizedStatus = normalizeStatus(filters.status)
    const normalizedType = normalizeType(filters.type)

    // Build where clause
    const where: Prisma.ArticleWhereInput = {
      ...(includeDeleted ? {} : { deletedAt: null }),
      ...(normalizedType && { type: normalizedType }),
      ...(normalizedStatus && { status: normalizedStatus }),
      ...(filters.categoryId && { categoryId: filters.categoryId }),
      ...(filters.authorId && { authorId: filters.authorId }),
      ...(filters.tagId && { tags: { some: { tagId: filters.tagId } } }),
      // Note: featuredUntil field not present in schema v2
      ...(filters.search && {
        OR: [
          { title: { contains: filters.search, mode: 'insensitive' } },
          { content: { contains: filters.search, mode: 'insensitive' } },
          { excerpt: { contains: filters.search, mode: 'insensitive' } },
        ],
      }),
    }

    // Get total count
    const total = await prisma.article.count({ where })

    // Get paginated articles
    const articles = await prisma.article.findMany({
      where,
      include: {
        author: { select: { id: true, name: true, email: true } },
        category: { select: { id: true, name: true, slug: true } },
        tags: { include: { tag: true } },
        citations: { orderBy: { order: 'asc' } },
      },
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    })

    const totalPages = Math.ceil(total / limit)

    logger.info('Articles listed successfully', {
      count: articles.length,
      total,
      page,
      totalPages,
    })

    return {
      articles: articles as ArticleWithRelations[],
      total,
      page,
      limit,
      totalPages,
    }
  }

  /**
   * Updates an article
   * - Validates updates
   * - Handles relationship updates
   * - Checks slug uniqueness if changed
   *
   * @param id - Article ID
   * @param data - Update data
   * @param userId - User ID performing update
   * @returns Updated article
   */
  async update(
    id: string,
    data: ArticleUpdateInput,
    userId: string
  ): Promise<ArticleWithRelations> {
    logger.setContext({ operation: 'article.update', articleId: id, userId })

    try {
      // Validate update data
      const validated = validationService.validate(articleUpdateSchema, data)

      // Check article exists
      const existing = await this.getById(id)

      // Check slug uniqueness if changed
      if (validated.slug && validated.slug !== existing.slug) {
        const slugExists = await prisma.article.findUnique({
          where: { slug: validated.slug },
          select: { id: true },
        })

        if (slugExists && slugExists.id !== id) {
          throw new ConflictError('Slug já existe', { slug: validated.slug })
        }
      }

      // Verify relationships if provided
      if (validated.categoryId || validated.tagIds || validated.relatedArticleIds) {
        await this.verifyRelationships({
          categoryId: validated.categoryId,
          tagIds: validated.tagIds,
          relatedArticleIds: validated.relatedArticleIds,
        })
      }

      // Sanitize content if provided
      const sanitizedContent = validated.content
        ? validationService.sanitizeHtml(validated.content)
        : undefined

      // Recalculate readTime if content changed
      const readTimeMinutes =
        validated.content && !validated.readTime
          ? validationService.calculateReadTime(validated.content)
          : validated.readTime

      // Format readTime as string (e.g., "5 min")
      const readTime = readTimeMinutes ? `${readTimeMinutes} min` : undefined

      // Normalize enums
      const status = normalizeStatus(validated.status)
      const type = normalizeType(validated.type)

      // Build update data
      const updateData: Prisma.ArticleUpdateInput = {
        ...(validated.title && { title: validated.title }),
        ...(validated.slug && { slug: validated.slug }),
        ...(sanitizedContent && { content: sanitizedContent }),
        ...(validated.excerpt !== undefined && { excerpt: validated.excerpt }),
        ...(validated.coverImage !== undefined && {
          coverImage: validated.coverImage?.url ?? null,
          coverImageAlt: validated.coverImage?.alt ?? null,
        }),
        ...(type && { type }),
        ...(status && { status }),
        ...(validated.categoryId && { categoryId: validated.categoryId }),
        ...(readTime && { readTime }),
        // Note: seo field not present in schema v2

        updatedAt: new Date(),
      }

      // Update tags if provided
      if (validated.tagIds) {
        updateData.tags = {
          deleteMany: {},
          create: validated.tagIds.map((tagId) => ({ tagId })),
        }
      }

      // Update citations if provided
      if (validated.citations) {
        updateData.citations = {
          deleteMany: {},
          create: validated.citations.map((citation, index) => {
            const normalized = validationService.normalizeCitation(citation)
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

      // Update related articles if provided
      if (validated.relatedArticleIds) {
        updateData.relatedFrom = {
          deleteMany: {},
          create: validated.relatedArticleIds.map((relatedId) => ({
            toArticleId: relatedId,
          })),
        }
      }

      // Update article
      const article = await prisma.article.update({
        where: { id },
        data: updateData,
        include: {
          author: { select: { id: true, name: true, email: true } },
          category: { select: { id: true, name: true, slug: true } },
          tags: { include: { tag: true } },
          citations: { orderBy: { order: 'asc' } },
          relatedFrom: { include: { toArticle: true } },
        },
      })

      logger.info('Article updated successfully', {
        articleId: article.id,
        slug: article.slug,
        changes: Object.keys(validated),
      })

      return article as ArticleWithRelations
    } catch (error) {
      logger.error('Failed to update article', error as Error, {
        articleId: id,
        userId,
      })
      throw error
    } finally {
      logger.clearContext()
    }
  }

  /**
   * Soft deletes an article
   *
   * @param id - Article ID
   * @param userId - User ID performing deletion
   */
  async delete(id: string, userId: string): Promise<void> {
    logger.setContext({ operation: 'article.delete', articleId: id, userId })

    try {
      // Check article exists
      await this.getById(id)

      // Soft delete (set deletedAt and move to archived status)
      await prisma.article.update({
        where: { id },
        data: {
          deletedAt: new Date(),
          status: 'archived',
        },
      })

      logger.info('Article soft-deleted successfully', { articleId: id })
    } catch (error) {
      logger.error('Failed to delete article', error as Error, {
        articleId: id,
        userId,
      })
      throw error
    } finally {
      logger.clearContext()
    }
  }

  /**
   * Permanently deletes an article (admin only)
   *
   * @param id - Article ID
   * @param userId - Admin user ID
   */
  async hardDelete(id: string, userId: string): Promise<void> {
    logger.setContext({ operation: 'article.hardDelete', articleId: id, userId })

    try {
      await prisma.article.delete({ where: { id } })

      logger.warn('Article permanently deleted', { articleId: id, userId })
    } catch (error) {
      logger.error('Failed to permanently delete article', error as Error, {
        articleId: id,
      })
      throw error
    } finally {
      logger.clearContext()
    }
  }

  /**
   * Restores a soft-deleted article
   *
   * @param id - Article ID
   * @param userId - User ID performing restoration
   */
  async restore(id: string, userId: string): Promise<ArticleWithRelations> {
    logger.setContext({ operation: 'article.restore', articleId: id, userId })

    try {
      // Check article exists (including deleted)
      const article = await this.getById(id, true)

      if (!article.deletedAt) {
        throw new ValidationError('Artigo não está deletado', { articleId: id })
      }

      // Restore
      const restored = await prisma.article.update({
        where: { id },
        data: {
          deletedAt: null,
          status: 'draft',
        },
        include: {
          author: { select: { id: true, name: true, email: true } },
          category: { select: { id: true, name: true, slug: true } },
          tags: { include: { tag: true } },
          citations: { orderBy: { order: 'asc' } },
          relatedFrom: { include: { toArticle: true } },
        },
      })

      logger.info('Article restored successfully', { articleId: id })

      return restored as ArticleWithRelations
    } catch (error) {
      logger.error('Failed to restore article', error as Error, {
        articleId: id,
      })
      throw error
    } finally {
      logger.clearContext()
    }
  }

  /**
   * Bulk operation on multiple articles
   * - Atomic transaction (all or nothing)
   * - Validates article count
   *
   * @param operation - Bulk operation data
   * @param userId - User ID performing operation
   */
  async bulkOperation(operation: BulkArticleOperation, userId: string): Promise<number> {
    logger.setContext({ operation: 'article.bulk', userId, action: operation.operation })

    try {
      if (operation.articleIds.length > this.options.maxBulkSize) {
        throw new ValidationError('Muitos artigos para operação em lote', {
          count: operation.articleIds.length,
          max: this.options.maxBulkSize,
        })
      }

      let count = 0

      // Use transaction for atomicity
      await prisma.$transaction(async (tx) => {
        switch (operation.operation) {
          case 'publish':
            const publishResult = await tx.article.updateMany({
              where: { id: { in: operation.articleIds }, deletedAt: null },
              data: { status: 'published' },
            })
            count = publishResult.count
            break

          case 'archive':
            const archiveResult = await tx.article.updateMany({
              where: { id: { in: operation.articleIds }, deletedAt: null },
              data: { status: 'archived' },
            })
            count = archiveResult.count
            break

          case 'delete':
            const deleteResult = await tx.article.updateMany({
              where: { id: { in: operation.articleIds }, deletedAt: null },
              data: { deletedAt: new Date(), status: 'archived' },
            })
            count = deleteResult.count
            break

          case 'restore':
            const restoreResult = await tx.article.updateMany({
              where: { id: { in: operation.articleIds }, deletedAt: { not: null } },
              data: { deletedAt: null, status: 'draft' },
            })
            count = restoreResult.count
            break
        }
      })

      logger.info('Bulk operation completed', {
        operation: operation.operation,
        count,
        requested: operation.articleIds.length,
      })

      return count
    } catch (error) {
      logger.error('Bulk operation failed', error as Error, {
        operation: operation.operation,
        count: operation.articleIds.length,
      })
      throw error
    } finally {
      logger.clearContext()
    }
  }

  /**
   * Gets article statistics
   *
   * @returns Article statistics
   */
  async getStats(): Promise<ArticleStats> {
    logger.debug('Fetching article statistics')

    const [total, published, draft, archived, byType, byCategory] = await Promise.all([
      prisma.article.count({ where: { deletedAt: null } }),
      prisma.article.count({ where: { status: 'published', deletedAt: null } }),
      prisma.article.count({ where: { status: 'draft', deletedAt: null } }),
      prisma.article.count({ where: { status: 'archived', deletedAt: null } }),
      prisma.article.groupBy({
        by: ['type'],
        where: { deletedAt: null },
        _count: true,
      }),
      prisma.article.groupBy({
        by: ['categoryId'],
        where: { deletedAt: null },
        _count: true,
      }),
    ])

    return {
      total,
      published,
      draft,
      archived,
      byType: Object.fromEntries(byType.map((item) => [item.type, item._count])),
      byCategory: Object.fromEntries(byCategory.map((item) => [item.categoryId, item._count])),
    }
  }

  /**
   * Verifies that related entities exist
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
      assertExists(category, 'Categoria não encontrada', { categoryId: data.categoryId })
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
        throw new NotFoundError('Tags não encontradas', { missingTagIds: missingIds })
      }
    }

    // Verify related articles exist
    if (data.relatedArticleIds && data.relatedArticleIds.length > 0) {
      const articles = await prisma.article.findMany({
        where: { id: { in: data.relatedArticleIds }, deletedAt: null },
        select: { id: true },
      })

      if (articles.length !== data.relatedArticleIds.length) {
        const foundIds = articles.map((a) => a.id)
        const missingIds = data.relatedArticleIds.filter((id) => !foundIds.includes(id))
        throw new NotFoundError('Artigos relacionados não encontrados', {
          missingArticleIds: missingIds,
        })
      }
    }
  }
}

/**
 * Singleton instance
 */
export const articleService = new ArticleService()
