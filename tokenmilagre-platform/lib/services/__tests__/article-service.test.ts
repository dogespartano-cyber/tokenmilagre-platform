/**
 * Tests for ArticleService
 * Coverage target: 99%+ (comprehensive edge case coverage)
 */

// Create singleton mock logger BEFORE DI container mock
const mockLogger = {
  setContext: jest.fn(),
  clearContext: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}

// Create singleton mock validation
const mockValidation = {
  validate: jest.fn((schema, data) => data),
  sanitizeHtml: jest.fn((html) => html.replace(/<script[^>]*>.*?<\/script>/gi, '')),
  calculateReadTime: jest.fn(() => 2),
  normalizeCitation: jest.fn((citation) => ({
    ...citation,
    domain: 'example.com',
  })),
}

// Mock DI container BEFORE imports (return singleton instances)
jest.mock('@/lib/di/container', () => ({
  ServiceLocator: {
    getLogger: jest.fn(() => mockLogger),
    getValidation: jest.fn(() => mockValidation),
  },
}))

// Mock Next.js BEFORE imports
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((body, init) => ({ body, status: init?.status || 200 })),
  },
}))

// Mock services (use inline objects to avoid hoisting issues)
jest.mock('../logger-service', () => ({
  logger: {
    setContext: jest.fn(),
    clearContext: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}))

jest.mock('../validation-service', () => ({
  validationService: {
    validate: jest.fn((schema, data) => data),
    sanitizeHtml: jest.fn((html) => html.replace(/<script[^>]*>.*?<\/script>/gi, '')),
    calculateReadTime: jest.fn(() => 2),
    normalizeCitation: jest.fn((citation) => ({
      ...citation,
      domain: 'example.com',
    })),
  },
}))

import { ArticleService } from '../article-service'
import { prismaMock } from '@/lib/__mocks__/prisma'
import {
  NotFoundError,
  ConflictError,
  ValidationError,
} from '../error-service'

describe('ArticleService', () => {
  let service: ArticleService

  const mockUserId = 'user-123'
  const mockCategoryId = 'cat-123'
  const mockTagId = 'tag-123'
  const mockArticleId = 'art-123'

  const mockArticleData = {
    title: 'Bitcoin Atinge US$ 100 mil em Marco Histórico',
    slug: 'bitcoin-atinge-us-100-mil',
    content: 'Lorem ipsum dolor sit amet. '.repeat(50), // >100 chars
    type: 'NEWS' as const,
    categoryId: mockCategoryId,
    authorId: mockUserId,
    tagIds: [mockTagId],
    status: 'DRAFT' as const,
  }

  const mockArticle = {
    id: mockArticleId,
    ...mockArticleData,
    excerpt: null,
    coverImage: null,
    readTime: 2,
    seo: null,
    publishedAt: null,
    featuredUntil: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    author: { id: mockUserId, name: 'Test User', email: 'test@example.com' },
    category: { id: mockCategoryId, name: 'Bitcoin', slug: 'bitcoin' },
    tags: [{ tag: { id: mockTagId, name: 'Crypto', slug: 'crypto' } }],
    citations: [],
    relatedFrom: [],
  }

  beforeEach(() => {
    service = new ArticleService()
    jest.clearAllMocks()
  })

  describe('create', () => {
    it('should create article successfully', async () => {
      // Mock relationship checks
      prismaMock.article.findUnique.mockResolvedValue(null) // Slug doesn't exist
      prismaMock.category.findUnique.mockResolvedValue({ id: mockCategoryId } as any)
      prismaMock.tag.findMany.mockResolvedValue([{ id: mockTagId }] as any)

      // Mock article creation
      prismaMock.article.create.mockResolvedValue(mockArticle as any)

      const result = await service.create(mockArticleData, mockUserId)

      expect(result).toMatchObject({
        id: mockArticleId,
        title: mockArticleData.title,
        slug: mockArticleData.slug,
      })

      expect(prismaMock.article.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            title: mockArticleData.title,
            slug: mockArticleData.slug,
            type: mockArticleData.type,
          }),
        })
      )

      expect(mockLogger.info).toHaveBeenCalledWith(
        'Article created successfully',
        expect.objectContaining({ articleId: mockArticleId })
      )
    })

    it('should throw ConflictError if slug already exists', async () => {
      prismaMock.article.findUnique.mockResolvedValue({ id: 'existing-id' } as any)

      await expect(service.create(mockArticleData, mockUserId)).rejects.toThrow(ConflictError)

      expect(mockLogger.error).toHaveBeenCalledWith(
        'Error creating article',
        expect.any(Error),
        expect.any(Object)
      )
    })

    it('should auto-calculate readTime if not provided', async () => {
      prismaMock.article.findUnique.mockResolvedValue(null)
      prismaMock.category.findUnique.mockResolvedValue({ id: mockCategoryId } as any)
      prismaMock.tag.findMany.mockResolvedValue([{ id: mockTagId }] as any)
      prismaMock.article.create.mockResolvedValue(mockArticle as any)

      await service.create(mockArticleData, mockUserId)

      expect(prismaMock.article.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            readTime: expect.any(Number),
          }),
        })
      )
    })

    it('should throw NotFoundError if category does not exist', async () => {
      prismaMock.article.findUnique.mockResolvedValue(null)
      prismaMock.category.findUnique.mockResolvedValue(null)

      await expect(service.create(mockArticleData, mockUserId)).rejects.toThrow(NotFoundError)
    })

    it('should throw NotFoundError if tag does not exist', async () => {
      prismaMock.article.findUnique.mockResolvedValue(null)
      prismaMock.category.findUnique.mockResolvedValue({ id: mockCategoryId } as any)
      prismaMock.tag.findMany.mockResolvedValue([]) // No tags found

      await expect(service.create(mockArticleData, mockUserId)).rejects.toThrow(NotFoundError)
    })

    it('should create citations with normalized domains', async () => {
      const dataWithCitations = {
        ...mockArticleData,
        citations: [
          { url: 'https://www.example.com/article', title: 'Test Article' },
        ],
      }

      prismaMock.article.findUnique.mockResolvedValue(null)
      prismaMock.category.findUnique.mockResolvedValue({ id: mockCategoryId } as any)
      prismaMock.tag.findMany.mockResolvedValue([{ id: mockTagId }] as any)
      prismaMock.article.create.mockResolvedValue(mockArticle as any)

      await service.create(dataWithCitations, mockUserId)

      expect(prismaMock.article.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            citations: expect.objectContaining({
              create: expect.arrayContaining([
                expect.objectContaining({
                  domain: 'example.com',
                }),
              ]),
            }),
          }),
        })
      )
    })

    it('should sanitize HTML content', async () => {
      const dataWithHtml = {
        ...mockArticleData,
        content: '<p>Safe content</p><script>alert("xss")</script>',
      }

      prismaMock.article.findUnique.mockResolvedValue(null)
      prismaMock.category.findUnique.mockResolvedValue({ id: mockCategoryId } as any)
      prismaMock.tag.findMany.mockResolvedValue([{ id: mockTagId }] as any)
      prismaMock.article.create.mockResolvedValue(mockArticle as any)

      await service.create(dataWithHtml, mockUserId)

      const createCall = (prismaMock.article.create as jest.Mock).mock.calls[0][0]
      expect(createCall.data.content).not.toContain('<script>')
      expect(createCall.data.content).toContain('Safe content')
    })
  })

  describe('getById', () => {
    it('should get article by ID', async () => {
      prismaMock.article.findUnique.mockResolvedValue(mockArticle as any)

      const result = await service.getById(mockArticleId)

      expect(result).toMatchObject({
        id: mockArticleId,
        title: mockArticleData.title,
      })

      expect(prismaMock.article.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: mockArticleId },
        })
      )
    })

    it('should throw NotFoundError if article does not exist', async () => {
      prismaMock.article.findUnique.mockResolvedValue(null)

      await expect(service.getById('nonexistent')).rejects.toThrow(NotFoundError)
    })
  })

  describe('getBySlug', () => {
    it('should get article by slug', async () => {
      prismaMock.article.findUnique.mockResolvedValue(mockArticle as any)

      const result = await service.getBySlug(mockArticleData.slug)

      expect(result.slug).toBe(mockArticleData.slug)

      expect(prismaMock.article.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { slug: mockArticleData.slug },
        })
      )
    })

    it('should throw NotFoundError if slug does not exist', async () => {
      prismaMock.article.findUnique.mockResolvedValue(null)

      await expect(service.getBySlug('nonexistent-slug')).rejects.toThrow(NotFoundError)
    })
  })

  describe('list', () => {
    it('should list articles with pagination', async () => {
      const articles = [mockArticle, { ...mockArticle, id: 'art-456' }]

      prismaMock.article.count.mockResolvedValue(2)
      prismaMock.article.findMany.mockResolvedValue(articles as any)

      const result = await service.list({ page: 1, limit: 10 })

      expect(result).toMatchObject({
        articles: expect.arrayContaining([expect.objectContaining({ id: mockArticleId })]),
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1,
      })

      expect(prismaMock.article.count).toHaveBeenCalled()
      expect(prismaMock.article.findMany).toHaveBeenCalled()
    })

    it('should filter by type', async () => {
      prismaMock.article.count.mockResolvedValue(1)
      prismaMock.article.findMany.mockResolvedValue([mockArticle] as any)

      await service.list({ page: 1, limit: 10, type: 'NEWS' })

      expect(prismaMock.article.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ type: 'NEWS' }),
        })
      )
    })

    it('should filter by status', async () => {
      prismaMock.article.count.mockResolvedValue(1)
      prismaMock.article.findMany.mockResolvedValue([mockArticle] as any)

      await service.list({ page: 1, limit: 10, status: 'PUBLISHED' })

      expect(prismaMock.article.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ status: 'PUBLISHED' }),
        })
      )
    })

    it('should search by title and content', async () => {
      prismaMock.article.count.mockResolvedValue(1)
      prismaMock.article.findMany.mockResolvedValue([mockArticle] as any)

      await service.list({ page: 1, limit: 10, search: 'Bitcoin' })

      expect(prismaMock.article.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.any(Array),
          }),
        })
      )
    })

    it('should sort articles', async () => {
      prismaMock.article.count.mockResolvedValue(1)
      prismaMock.article.findMany.mockResolvedValue([mockArticle] as any)

      await service.list({ page: 1, limit: 10, sortBy: 'publishedAt', sortOrder: 'desc' })

      expect(prismaMock.article.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { publishedAt: 'desc' },
        })
      )
    })
  })

  describe('update', () => {
    it('should update article successfully', async () => {
      const updates = { title: 'Updated Title' }
      const updatedArticle = { ...mockArticle, title: 'Updated Title' }

      prismaMock.article.findFirst.mockResolvedValue(mockArticle as any)
      prismaMock.article.update.mockResolvedValue(updatedArticle as any)

      const result = await service.update(mockArticleId, updates, mockUserId)

      expect(result.title).toBe('Updated Title')

      expect(prismaMock.article.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: mockArticleId },
          data: expect.objectContaining({ title: 'Updated Title' }),
        })
      )

      expect(mockLogger.info).toHaveBeenCalledWith(
        'Article updated successfully',
        expect.any(Object)
      )
    })

    it('should throw NotFoundError if article does not exist', async () => {
      prismaMock.article.findFirst.mockResolvedValue(null)

      await expect(service.update('nonexistent', { title: 'Test' }, mockUserId)).rejects.toThrow(
        NotFoundError
      )
    })

    it('should check slug uniqueness on update', async () => {
      const updates = { slug: 'new-slug' }

      prismaMock.article.findFirst.mockResolvedValue(mockArticle as any)
      prismaMock.article.findUnique.mockResolvedValue({ id: 'other-id' } as any)

      await expect(service.update(mockArticleId, updates, mockUserId)).rejects.toThrow(
        ConflictError
      )
    })

    it('should allow same slug for same article', async () => {
      const updates = { title: 'New Title' }

      prismaMock.article.findFirst.mockResolvedValue(mockArticle as any)
      prismaMock.article.update.mockResolvedValue({ ...mockArticle, ...updates } as any)

      await service.update(mockArticleId, updates, mockUserId)

      expect(prismaMock.article.update).toHaveBeenCalled()
    })

    it('should recalculate readTime if content changes', async () => {
      const updates = { content: 'New content '.repeat(100) }

      prismaMock.article.findFirst.mockResolvedValue(mockArticle as any)
      prismaMock.article.update.mockResolvedValue({ ...mockArticle, ...updates } as any)

      await service.update(mockArticleId, updates, mockUserId)

      const updateCall = (prismaMock.article.update as jest.Mock).mock.calls[0][0]
      expect(updateCall.data.readTime).toBeDefined()
    })

    it('should verify relationships on update', async () => {
      const updates = { categoryId: 'new-cat-123' }

      prismaMock.article.findFirst.mockResolvedValue(mockArticle as any)
      prismaMock.category.findUnique.mockResolvedValue(null)

      await expect(service.update(mockArticleId, updates, mockUserId)).rejects.toThrow(
        NotFoundError
      )
    })

    it('should update tags when provided', async () => {
      const updates = { tagIds: ['tag-1', 'tag-2'] }

      prismaMock.article.findFirst.mockResolvedValue(mockArticle as any)
      prismaMock.tag.findMany.mockResolvedValue([{ id: 'tag-1' }, { id: 'tag-2' }] as any)
      prismaMock.article.update.mockResolvedValue({ ...mockArticle, ...updates } as any)

      await service.update(mockArticleId, updates, mockUserId)

      expect(prismaMock.article.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            tags: expect.objectContaining({
              deleteMany: {},
              create: expect.any(Array),
            }),
          }),
        })
      )
    })

    it('should update citations when provided', async () => {
      const updates = {
        citations: [{ url: 'https://example.com', title: 'Test' }],
      }

      prismaMock.article.findFirst.mockResolvedValue(mockArticle as any)
      prismaMock.article.update.mockResolvedValue({ ...mockArticle, ...updates } as any)

      await service.update(mockArticleId, updates, mockUserId)

      expect(prismaMock.article.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            citations: expect.objectContaining({
              deleteMany: {},
              create: expect.any(Array),
            }),
          }),
        })
      )
    })

    it('should update related articles when provided', async () => {
      const updates = { relatedArticleIds: ['art-1', 'art-2'] }

      prismaMock.article.findFirst.mockResolvedValue(mockArticle as any)
      prismaMock.article.findMany.mockResolvedValue([{ id: 'art-1' }, { id: 'art-2' }] as any)
      prismaMock.article.update.mockResolvedValue({ ...mockArticle, ...updates } as any)

      await service.update(mockArticleId, updates, mockUserId)

      expect(prismaMock.article.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            relatedFrom: expect.objectContaining({
              deleteMany: {},
              create: expect.any(Array),
            }),
          }),
        })
      )
    })
  })

  describe('delete', () => {
    it('should permanently delete article', async () => {
      prismaMock.article.findUnique.mockResolvedValue(mockArticle as any)
      prismaMock.article.delete.mockResolvedValue(mockArticle as any)

      await service.delete(mockArticleId, mockUserId)

      expect(prismaMock.article.delete).toHaveBeenCalledWith({
        where: { id: mockArticleId },
      })

      expect(mockLogger.info).toHaveBeenCalledWith(
        'Article deleted successfully',
        expect.objectContaining({ id: mockArticleId })
      )
    })

    it('should throw NotFoundError if article does not exist', async () => {
      prismaMock.article.findUnique.mockResolvedValue(null)

      await expect(service.delete('nonexistent', mockUserId)).rejects.toThrow(NotFoundError)
    })
  })

  // Note: soft delete, hardDelete, and restore are not implemented in current schema
  // These would require adding deletedAt field to Article model

  describe('bulkOperation', () => {
    const articleIds = ['art-1', 'art-2', 'art-3']

    it('should publish articles in bulk', async () => {
      const operation = { articleIds, operation: 'publish' as const }

      prismaMock.$transaction.mockImplementation(async (callback: any) => {
        return callback({
          article: {
            updateMany: jest.fn().mockResolvedValue({ count: 3 }),
          },
        })
      })

      const count = await service.bulkOperation(operation, mockUserId)

      expect(count).toBe(3)

      expect(mockLogger.info).toHaveBeenCalledWith(
        'Bulk operation completed',
        expect.objectContaining({ count: 3, operation: 'publish' })
      )
    })

    it('should archive articles in bulk', async () => {
      const operation = { articleIds, operation: 'archive' as const }

      prismaMock.$transaction.mockImplementation(async (callback: any) => {
        return callback({
          article: {
            updateMany: jest.fn().mockResolvedValue({ count: 3 }),
          },
        })
      })

      const count = await service.bulkOperation(operation, mockUserId)

      expect(count).toBe(3)
    })

    it('should delete articles in bulk', async () => {
      const operation = { articleIds, operation: 'delete' as const }

      prismaMock.$transaction.mockImplementation(async (callback: any) => {
        return callback({
          article: {
            updateMany: jest.fn().mockResolvedValue({ count: 3 }),
          },
        })
      })

      const count = await service.bulkOperation(operation, mockUserId)

      expect(count).toBe(3)
    })

    it('should restore articles in bulk', async () => {
      const operation = { articleIds, operation: 'restore' as const }

      prismaMock.$transaction.mockImplementation(async (callback: any) => {
        return callback({
          article: {
            updateMany: jest.fn().mockResolvedValue({ count: 3 }),
          },
        })
      })

      const count = await service.bulkOperation(operation, mockUserId)

      expect(count).toBe(3)
    })

    it('should throw ValidationError if too many articles', async () => {
      const tooMany = Array.from({ length: 51 }, (_, i) => `art-${i}`)
      const operation = { articleIds: tooMany, operation: 'publish' as const }

      await expect(service.bulkOperation(operation, mockUserId)).rejects.toThrow(ValidationError)
    })

    it('should use transaction for atomicity', async () => {
      const operation = { articleIds, operation: 'publish' as const }

      prismaMock.$transaction.mockImplementation(async (callback: any) => {
        return callback({
          article: {
            updateMany: jest.fn().mockResolvedValue({ count: 3 }),
          },
        })
      })

      await service.bulkOperation(operation, mockUserId)

      expect(prismaMock.$transaction).toHaveBeenCalled()
    })
  })

  describe('getStats', () => {
    it('should return article statistics', async () => {
      prismaMock.article.count.mockResolvedValueOnce(100) // total
      prismaMock.article.count.mockResolvedValueOnce(50) // published
      prismaMock.article.count.mockResolvedValueOnce(30) // draft
      prismaMock.article.count.mockResolvedValueOnce(20) // archived

      prismaMock.article.groupBy
        .mockResolvedValueOnce([
          { type: 'NEWS', _count: 60 },
          { type: 'EDUCATIONAL', _count: 40 },
        ] as any)
        .mockResolvedValueOnce([
          { categoryId: 'cat-1', _count: 70 },
          { categoryId: 'cat-2', _count: 30 },
        ] as any)

      const stats = await service.getStats()

      expect(stats).toMatchObject({
        total: 100,
        published: 50,
        draft: 30,
        archived: 20,
        byType: { NEWS: 60, EDUCATIONAL: 40 },
        byCategory: { 'cat-1': 70, 'cat-2': 30 },
      })
    })
  })

  describe('verifyRelationships (private)', () => {
    it('should verify all relationships exist', async () => {
      const data = {
        ...mockArticleData,
        relatedArticleIds: ['art-related-1'],
      }

      prismaMock.article.findUnique.mockResolvedValue(null)
      prismaMock.category.findUnique.mockResolvedValue({ id: mockCategoryId } as any)
      prismaMock.tag.findMany.mockResolvedValue([{ id: mockTagId }] as any)
      prismaMock.article.findMany.mockResolvedValue([{ id: 'art-related-1' }] as any)
      prismaMock.article.create.mockResolvedValue(mockArticle as any)

      await service.create(data, mockUserId)

      expect(prismaMock.category.findUnique).toHaveBeenCalled()
      expect(prismaMock.tag.findMany).toHaveBeenCalled()
      expect(prismaMock.article.findMany).toHaveBeenCalled()
    })

    it('should throw if related articles do not exist', async () => {
      const data = {
        ...mockArticleData,
        relatedArticleIds: ['art-1', 'art-2'],
      }

      prismaMock.article.findUnique.mockResolvedValue(null)
      prismaMock.category.findUnique.mockResolvedValue({ id: mockCategoryId } as any)
      prismaMock.tag.findMany.mockResolvedValue([{ id: mockTagId }] as any)
      prismaMock.article.findMany.mockResolvedValue([{ id: 'art-1' }] as any) // Only 1 found

      await expect(service.create(data, mockUserId)).rejects.toThrow(NotFoundError)
    })
  })

  describe('context management', () => {
    it('should set and clear context on create', async () => {
      prismaMock.article.findUnique.mockResolvedValue(null)
      prismaMock.category.findUnique.mockResolvedValue({ id: mockCategoryId } as any)
      prismaMock.tag.findMany.mockResolvedValue([{ id: mockTagId }] as any)
      prismaMock.article.create.mockResolvedValue(mockArticle as any)

      await service.create(mockArticleData, mockUserId)

      expect(mockLogger.setContext).toHaveBeenCalledWith(
        expect.objectContaining({ operation: 'article.create' })
      )
      expect(mockLogger.clearContext).toHaveBeenCalled()
    })

    it('should clear context even on error', async () => {
      prismaMock.article.findUnique.mockResolvedValue({ id: 'existing' } as any)

      await expect(service.create(mockArticleData, mockUserId)).rejects.toThrow()

      expect(mockLogger.clearContext).toHaveBeenCalled()
    })
  })
})
