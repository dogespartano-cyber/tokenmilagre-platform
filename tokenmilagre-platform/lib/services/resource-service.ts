/**
 * ResourceService - Complete Resource CRUD Operations
 *
 * Centralized service for all resource-related operations with:
 * - Complete CRUD operations with Prisma
 * - Automatic slug validation
 * - Structured logging with LoggerService
 * - Error handling with ErrorService
 * - Validation with ValidationService
 * - Type safety and DI integration
 *
 * @example
 * ```typescript
 * import { ServiceLocator } from '@/lib/di/container'
 *
 * const resourceService = ServiceLocator.getResource()
 * const resource = await resourceService.create(data, userId)
 * const resources = await resourceService.list({ category: 'wallets' })
 * ```
 */

import { prisma } from '@/lib/prisma'
import { Resource, Prisma } from '@/lib/generated/prisma'
import { ServiceLocator } from '@/lib/di/container'
import { PAGINATION } from '@/lib/constants/pagination'

/**
 * Resource query parameters
 */
export interface ResourceQuery {
  page?: number
  limit?: number
  category?: string
  verified?: boolean
  search?: string
  interactiveType?: string
  sortBy?: keyof Resource
  sortOrder?: 'asc' | 'desc'
}

/**
 * Resource creation input
 */
export interface ResourceCreateInput {
  slug: string
  name: string
  category: string
  verified?: boolean
  shortDescription: string
  officialUrl: string
  platforms: string[]
  tags: string[]
  heroTitle: string
  heroDescription: string
  heroGradient: string
  whyGoodTitle: string
  whyGoodContent: string[]
  features: Array<{ icon: string; title: string; description: string }>
  howToStartTitle: string
  howToStartSteps: Array<{ number: number; title: string; description: string }>
  pros: string[]
  cons: string[]
  faq: Array<{ question: string; answer: string }>
  securityTips: Array<{ icon: string; title: string; description: string }>
  securityAudit?: string
  securityAuditDate?: Date
  auditedByCommunity?: boolean
  toolConfig?: any
  interactiveType?: string
  showCompatibleWallets?: boolean
  relatedResources?: string[]
}

/**
 * Resource update input
 */
export type ResourceUpdateInput = Partial<ResourceCreateInput>

/**
 * Paginated resource list result
 */
export interface ResourceListResult {
  resources: Resource[]
  total: number
  page: number
  limit: number
  totalPages: number
  hasMore: boolean
}

/**
 * Resource statistics
 */
export interface ResourceStats {
  total: number
  verified: number
  byCategory: Record<string, number>
  byInteractiveType: Record<string, number>
  totalViews: number
  avgViewsPerResource: number
}

/**
 * Resource Service
 * Handles all resource CRUD operations with Clean Architecture patterns
 */
export class ResourceService {
  // Lazy initialization to avoid circular dependency
  private get logger() {
    return ServiceLocator.getLogger()
  }

  private get validation() {
    return ServiceLocator.getValidation()
  }

  /**
   * Create a new resource
   *
   * @param data - Resource creation data
   * @param userId - User ID creating the resource
   * @returns Created resource
   */
  async create(data: ResourceCreateInput, userId?: string): Promise<Resource> {
    this.logger.setContext({ operation: 'resource.create', userId, slug: data.slug })

    try {
      this.logger.info('Creating resource', { name: data.name, category: data.category })

      // Check slug uniqueness
      const existing = await prisma.resource.findUnique({
        where: { slug: data.slug },
        select: { id: true },
      })

      if (existing) {
        throw new Error(`Resource with slug "${data.slug}" already exists`)
      }

      // Create resource
      const resource = await prisma.resource.create({
        data: {
          slug: data.slug,
          name: data.name,
          category: data.category,
          verified: data.verified ?? true,
          shortDescription: data.shortDescription,
          officialUrl: data.officialUrl,
          platforms: JSON.stringify(data.platforms),
          tags: JSON.stringify(data.tags),
          heroTitle: data.heroTitle,
          heroDescription: data.heroDescription,
          heroGradient: data.heroGradient,
          whyGoodTitle: data.whyGoodTitle,
          whyGoodContent: JSON.stringify(data.whyGoodContent),
          features: JSON.stringify(data.features),
          howToStartTitle: data.howToStartTitle,
          howToStartSteps: JSON.stringify(data.howToStartSteps),
          pros: JSON.stringify(data.pros),
          cons: JSON.stringify(data.cons),
          faq: JSON.stringify(data.faq),
          securityTips: JSON.stringify(data.securityTips),
          securityAudit: data.securityAudit,
          securityAuditDate: data.securityAuditDate,
          auditedByCommunity: data.auditedByCommunity ?? false,
          toolConfig: data.toolConfig ? JSON.stringify(data.toolConfig) : null,
          interactiveType: data.interactiveType,
          showCompatibleWallets: data.showCompatibleWallets ?? false,
          relatedResources: data.relatedResources ? JSON.stringify(data.relatedResources) : null,
        },
      })

      this.logger.info('Resource created successfully', { resourceId: resource.id, slug: resource.slug })

      return resource
    } catch (error) {
      this.logger.error('Error creating resource', error as Error, { slug: data.slug })
      throw error
    } finally {
      this.logger.clearContext()
    }
  }

  /**
   * Get resource by ID
   *
   * @param id - Resource ID
   * @returns Resource or null
   */
  async getById(id: string): Promise<Resource | null> {
    this.logger.setContext({ operation: 'resource.getById', id })

    try {
      const resource = await prisma.resource.findUnique({
        where: { id },
      })

      if (resource) {
        this.logger.info('Resource found by ID', { id, slug: resource.slug })
      } else {
        this.logger.warn('Resource not found by ID', { id })
      }

      return resource
    } catch (error) {
      this.logger.error('Error getting resource by ID', error as Error, { id })
      throw error
    } finally {
      this.logger.clearContext()
    }
  }

  /**
   * Get resource by slug
   *
   * @param slug - Resource slug
   * @param incrementViews - Whether to increment view count (default: false)
   * @returns Resource or null
   */
  async getBySlug(slug: string, incrementViews: boolean = false): Promise<Resource | null> {
    this.logger.setContext({ operation: 'resource.getBySlug', slug })

    try {
      let resource: Resource | null

      if (incrementViews) {
        // Increment views atomically
        resource = await prisma.resource.update({
          where: { slug },
          data: { views: { increment: 1 } },
        })
        this.logger.info('Resource found and view incremented', { id: resource.id, slug })
      } else {
        resource = await prisma.resource.findUnique({
          where: { slug },
        })
        if (resource) {
          this.logger.info('Resource found by slug', { id: resource.id, slug })
        }
      }

      if (!resource) {
        this.logger.warn('Resource not found by slug', { slug })
      }

      return resource
    } catch (error) {
      this.logger.error('Error getting resource by slug', error as Error, { slug })
      throw error
    } finally {
      this.logger.clearContext()
    }
  }

  /**
   * List resources with pagination and filters
   *
   * @param query - Query parameters for filtering and pagination
   * @returns Paginated list of resources
   */
  async list(query: ResourceQuery = {}): Promise<ResourceListResult> {
    const page = query.page ?? PAGINATION.DEFAULT_PAGE
    const limit = Math.min(query.limit ?? PAGINATION.DEFAULT_LIMIT, PAGINATION.MAX_LIMIT)
    const skip = (page - 1) * limit

    this.logger.setContext({ operation: 'resource.list', page, limit })

    try {
      // Build where clause
      const where: Prisma.ResourceWhereInput = {}

      if (query.category) {
        where.category = query.category
      }

      if (query.verified !== undefined) {
        where.verified = query.verified
      }

      if (query.interactiveType) {
        where.interactiveType = query.interactiveType
      }

      if (query.search) {
        where.OR = [
          { name: { contains: query.search, mode: 'insensitive' } },
          { shortDescription: { contains: query.search, mode: 'insensitive' } },
        ]
      }

      // Build orderBy
      const orderBy: Prisma.ResourceOrderByWithRelationInput = {}
      if (query.sortBy) {
        orderBy[query.sortBy] = query.sortOrder || 'desc'
      } else {
        orderBy.createdAt = 'desc'
      }

      // Execute queries in parallel
      const [resources, total] = await Promise.all([
        prisma.resource.findMany({
          where,
          orderBy,
          skip,
          take: limit,
        }),
        prisma.resource.count({ where }),
      ])

      const totalPages = Math.ceil(total / limit)
      const hasMore = page < totalPages

      this.logger.info('Resources listed successfully', {
        count: resources.length,
        total,
        page,
        totalPages,
      })

      return {
        resources,
        total,
        page,
        limit,
        totalPages,
        hasMore,
      }
    } catch (error) {
      this.logger.error('Error listing resources', error as Error, { page, limit })
      throw error
    } finally {
      this.logger.clearContext()
    }
  }

  /**
   * Update resource
   *
   * @param id - Resource ID
   * @param data - Update data
   * @param userId - User ID performing the update
   * @returns Updated resource
   */
  async update(
    id: string,
    data: ResourceUpdateInput,
    userId?: string
  ): Promise<Resource> {
    this.logger.setContext({ operation: 'resource.update', id, userId })

    try {
      this.logger.info('Updating resource', { id, fields: Object.keys(data) })

      // Check if resource exists
      const existing = await prisma.resource.findUnique({
        where: { id },
        select: { id: true, slug: true },
      })

      if (!existing) {
        throw new Error(`Resource with ID "${id}" not found`)
      }

      // If updating slug, check uniqueness
      if (data.slug && data.slug !== existing.slug) {
        const slugExists = await prisma.resource.findUnique({
          where: { slug: data.slug },
          select: { id: true },
        })

        if (slugExists) {
          throw new Error(`Resource with slug "${data.slug}" already exists`)
        }
      }

      // Prepare update data
      const updateData: Prisma.ResourceUpdateInput = {}

      if (data.slug !== undefined) updateData.slug = data.slug
      if (data.name !== undefined) updateData.name = data.name
      if (data.category !== undefined) updateData.category = data.category
      if (data.verified !== undefined) updateData.verified = data.verified
      if (data.shortDescription !== undefined) updateData.shortDescription = data.shortDescription
      if (data.officialUrl !== undefined) updateData.officialUrl = data.officialUrl
      if (data.platforms !== undefined) updateData.platforms = JSON.stringify(data.platforms)
      if (data.tags !== undefined) updateData.tags = JSON.stringify(data.tags)
      if (data.heroTitle !== undefined) updateData.heroTitle = data.heroTitle
      if (data.heroDescription !== undefined) updateData.heroDescription = data.heroDescription
      if (data.heroGradient !== undefined) updateData.heroGradient = data.heroGradient
      if (data.whyGoodTitle !== undefined) updateData.whyGoodTitle = data.whyGoodTitle
      if (data.whyGoodContent !== undefined) updateData.whyGoodContent = JSON.stringify(data.whyGoodContent)
      if (data.features !== undefined) updateData.features = JSON.stringify(data.features)
      if (data.howToStartTitle !== undefined) updateData.howToStartTitle = data.howToStartTitle
      if (data.howToStartSteps !== undefined) updateData.howToStartSteps = JSON.stringify(data.howToStartSteps)
      if (data.pros !== undefined) updateData.pros = JSON.stringify(data.pros)
      if (data.cons !== undefined) updateData.cons = JSON.stringify(data.cons)
      if (data.faq !== undefined) updateData.faq = JSON.stringify(data.faq)
      if (data.securityTips !== undefined) updateData.securityTips = JSON.stringify(data.securityTips)
      if (data.securityAudit !== undefined) updateData.securityAudit = data.securityAudit
      if (data.securityAuditDate !== undefined) updateData.securityAuditDate = data.securityAuditDate
      if (data.auditedByCommunity !== undefined) updateData.auditedByCommunity = data.auditedByCommunity
      if (data.toolConfig !== undefined) updateData.toolConfig = JSON.stringify(data.toolConfig)
      if (data.interactiveType !== undefined) updateData.interactiveType = data.interactiveType
      if (data.showCompatibleWallets !== undefined) updateData.showCompatibleWallets = data.showCompatibleWallets
      if (data.relatedResources !== undefined) updateData.relatedResources = JSON.stringify(data.relatedResources)

      // Update last verified
      updateData.lastVerified = new Date()

      // Update resource
      const resource = await prisma.resource.update({
        where: { id },
        data: updateData,
      })

      this.logger.info('Resource updated successfully', { id, slug: resource.slug })

      return resource
    } catch (error) {
      this.logger.error('Error updating resource', error as Error, { id })
      throw error
    } finally {
      this.logger.clearContext()
    }
  }

  /**
   * Delete resource
   *
   * @param id - Resource ID
   * @param userId - User ID performing the deletion
   */
  async delete(id: string, userId?: string): Promise<void> {
    this.logger.setContext({ operation: 'resource.delete', id, userId })

    try {
      this.logger.info('Deleting resource', { id })

      const resource = await prisma.resource.findUnique({
        where: { id },
        select: { id: true, slug: true },
      })

      if (!resource) {
        throw new Error(`Resource with ID "${id}" not found`)
      }

      await prisma.resource.delete({
        where: { id },
      })

      this.logger.info('Resource deleted successfully', { id, slug: resource.slug })
    } catch (error) {
      this.logger.error('Error deleting resource', error as Error, { id })
      throw error
    } finally {
      this.logger.clearContext()
    }
  }

  /**
   * Get resource statistics
   *
   * @returns Resource statistics
   */
  async getStats(): Promise<ResourceStats> {
    this.logger.setContext({ operation: 'resource.getStats' })

    try {
      this.logger.info('Fetching resource statistics')

      const [
        total,
        verified,
        byCategory,
        byInteractiveType,
        viewsAggregate,
      ] = await Promise.all([
        prisma.resource.count(),
        prisma.resource.count({ where: { verified: true } }),
        prisma.resource.groupBy({
          by: ['category'],
          _count: true,
        }),
        prisma.resource.groupBy({
          by: ['interactiveType'],
          _count: true,
        }),
        prisma.resource.aggregate({
          _sum: { views: true },
          _avg: { views: true },
        }),
      ])

      const stats: ResourceStats = {
        total,
        verified,
        byCategory: Object.fromEntries(byCategory.map((c) => [c.category, c._count])),
        byInteractiveType: Object.fromEntries(
          byInteractiveType
            .filter((t) => t.interactiveType !== null)
            .map((t) => [t.interactiveType!, t._count])
        ),
        totalViews: viewsAggregate._sum.views ?? 0,
        avgViewsPerResource: Math.round(viewsAggregate._avg.views ?? 0),
      }

      this.logger.info('Resource statistics fetched', stats)

      return stats
    } catch (error) {
      this.logger.error('Error fetching resource statistics', error as Error)
      throw error
    } finally {
      this.logger.clearContext()
    }
  }

  /**
   * Get resources by category
   *
   * @param category - Resource category
   * @param limit - Maximum number of resources to return
   * @returns List of resources
   */
  async getByCategory(category: string, limit: number = 12): Promise<Resource[]> {
    this.logger.setContext({ operation: 'resource.getByCategory', category, limit })

    try {
      const resources = await prisma.resource.findMany({
        where: { category, verified: true },
        orderBy: { views: 'desc' },
        take: limit,
      })

      this.logger.info('Resources fetched by category', { category, count: resources.length })

      return resources
    } catch (error) {
      this.logger.error('Error getting resources by category', error as Error, { category })
      throw error
    } finally {
      this.logger.clearContext()
    }
  }

  /**
   * Get popular resources
   *
   * @param limit - Maximum number of resources to return
   * @returns List of popular resources
   */
  async getPopular(limit: number = 10): Promise<Resource[]> {
    this.logger.setContext({ operation: 'resource.getPopular', limit })

    try {
      const resources = await prisma.resource.findMany({
        where: { verified: true },
        orderBy: { views: 'desc' },
        take: limit,
      })

      this.logger.info('Popular resources fetched', { count: resources.length })

      return resources
    } catch (error) {
      this.logger.error('Error getting popular resources', error as Error)
      throw error
    } finally {
      this.logger.clearContext()
    }
  }

  /**
   * Search resources
   *
   * @param query - Search query
   * @param limit - Maximum number of resources to return
   * @returns List of matching resources
   */
  async search(query: string, limit: number = 20): Promise<Resource[]> {
    this.logger.setContext({ operation: 'resource.search', query, limit })

    try {
      const resources = await prisma.resource.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { shortDescription: { contains: query, mode: 'insensitive' } },
            { category: { contains: query, mode: 'insensitive' } },
          ],
          verified: true,
        },
        orderBy: { views: 'desc' },
        take: limit,
      })

      this.logger.info('Resources searched', { query, count: resources.length })

      return resources
    } catch (error) {
      this.logger.error('Error searching resources', error as Error, { query })
      throw error
    } finally {
      this.logger.clearContext()
    }
  }
}

// Export singleton instance
export const resourceService = new ResourceService()
