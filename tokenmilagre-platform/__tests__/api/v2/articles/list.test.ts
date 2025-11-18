/**
 * Integration Tests - GET /api/v2/articles
 * Tests article listing with filters, pagination, auth, and rate limiting
 */

import request from 'supertest'
import { testUsers, authHeader, assertRateLimitHeaders } from '@/lib/__tests__/helpers/api-test-helpers'
import { prismaMock } from '@/lib/__mocks__/prisma'

// Mock Next.js server
jest.mock('next/server', () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    json: jest.fn((body, init) => ({
      status: init?.status || 200,
      headers: new Map(Object.entries(init?.headers || {})),
      json: async () => body,
    })),
  },
}))

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  prisma: require('@/lib/__mocks__/prisma').prismaMock,
}))

// Base URL for tests
const baseUrl = 'http://localhost:3000'

describe('GET /api/v2/articles', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    // Mock default article list response
    prismaMock.article.findMany.mockResolvedValue([
      {
        id: 'art-1',
        title: 'Test Article 1',
        slug: 'test-article-1',
        content: '<p>Content 1</p>',
        type: 'NEWS',
        status: 'PUBLISHED',
        categoryId: 'cat-1',
        authorId: 'user-1',
        readTime: 5,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        deletedAt: null,
        publishedAt: new Date('2024-01-01'),
        featuredUntil: null,
        excerpt: null,
        coverImage: null,
        seo: null,
      } as any,
    ])

    prismaMock.article.count.mockResolvedValue(1)
  })

  describe('Success Cases', () => {
    it('should list articles without authentication', async () => {
      const response = await request(baseUrl)
        .get('/api/v2/articles')
        .expect(200)

      expect(response.body).toHaveProperty('articles')
      expect(response.body).toHaveProperty('total')
      expect(response.body).toHaveProperty('page')
      expect(response.body).toHaveProperty('limit')
      expect(response.body).toHaveProperty('totalPages')

      expect(Array.isArray(response.body.articles)).toBe(true)
      assertRateLimitHeaders(response)
    })

    it('should list articles with authentication', async () => {
      const response = await request(baseUrl)
        .get('/api/v2/articles')
        .set(authHeader(testUsers.author))
        .expect(200)

      expect(response.body).toHaveProperty('articles')
      assertRateLimitHeaders(response)
    })

    it('should return empty array when no articles exist', async () => {
      prismaMock.article.findMany.mockResolvedValue([])
      prismaMock.article.count.mockResolvedValue(0)

      const response = await request(baseUrl)
        .get('/api/v2/articles')
        .expect(200)

      expect(response.body.articles).toEqual([])
      expect(response.body.total).toBe(0)
      expect(response.body.totalPages).toBe(0)
    })
  })

  describe('Pagination', () => {
    it('should paginate results correctly', async () => {
      const response = await request(baseUrl)
        .get('/api/v2/articles')
        .query({ page: 2, limit: 5 })
        .expect(200)

      expect(response.body.page).toBe(2)
      expect(response.body.limit).toBe(5)
    })

    it('should use default pagination values', async () => {
      const response = await request(baseUrl)
        .get('/api/v2/articles')
        .expect(200)

      expect(response.body.page).toBe(1)
      expect(response.body.limit).toBe(10)
    })

    it('should enforce max limit', async () => {
      const response = await request(baseUrl)
        .get('/api/v2/articles')
        .query({ limit: 200 })
        .expect(200)

      expect(response.body.limit).toBeLessThanOrEqual(100)
    })
  })

  describe('Filtering', () => {
    it('should filter by type', async () => {
      await request(baseUrl)
        .get('/api/v2/articles')
        .query({ type: 'NEWS' })
        .expect(200)

      expect(prismaMock.article.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ type: 'NEWS' }),
        })
      )
    })

    it('should filter by status', async () => {
      await request(baseUrl)
        .get('/api/v2/articles')
        .query({ status: 'PUBLISHED' })
        .expect(200)

      expect(prismaMock.article.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ status: 'PUBLISHED' }),
        })
      )
    })

    it('should filter by categoryId', async () => {
      await request(baseUrl)
        .get('/api/v2/articles')
        .query({ categoryId: 'cat-1' })
        .expect(200)

      expect(prismaMock.article.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ categoryId: 'cat-1' }),
        })
      )
    })

    it('should filter by search term', async () => {
      await request(baseUrl)
        .get('/api/v2/articles')
        .query({ search: 'bitcoin' })
        .expect(200)

      expect(prismaMock.article.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              expect.objectContaining({ title: expect.any(Object) }),
              expect.objectContaining({ content: expect.any(Object) }),
            ]),
          }),
        })
      )
    })

    it('should filter by featured', async () => {
      await request(baseUrl)
        .get('/api/v2/articles')
        .query({ featured: 'true' })
        .expect(200)

      expect(prismaMock.article.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            featuredUntil: expect.objectContaining({
              gt: expect.any(Date),
            }),
          }),
        })
      )
    })
  })

  describe('Sorting', () => {
    it('should sort by createdAt desc by default', async () => {
      const response = await request(baseUrl)
        .get('/api/v2/articles')
        .expect(200)

      expect(prismaMock.article.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { createdAt: 'desc' },
        })
      )
    })

    it('should sort by custom field', async () => {
      await request(baseUrl)
        .get('/api/v2/articles')
        .query({ sortBy: 'title', sortOrder: 'asc' })
        .expect(200)

      expect(prismaMock.article.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { title: 'asc' },
        })
      )
    })
  })

  describe('Rate Limiting', () => {
    it('should have higher rate limit for authenticated users', async () => {
      // Unauthenticated request
      const unauthResponse = await request(baseUrl)
        .get('/api/v2/articles')
        .expect(200)

      const unauthLimit = parseInt(unauthResponse.headers['x-ratelimit-limit'])

      // Authenticated request
      const authResponse = await request(baseUrl)
        .get('/api/v2/articles')
        .set(authHeader(testUsers.author))
        .expect(200)

      const authLimit = parseInt(authResponse.headers['x-ratelimit-limit'])

      // Authenticated should have higher limit
      expect(authLimit).toBeGreaterThan(unauthLimit)
    })

    it('should have highest rate limit for admin', async () => {
      const adminResponse = await request(baseUrl)
        .get('/api/v2/articles')
        .set(authHeader(testUsers.admin))
        .expect(200)

      const adminLimit = parseInt(adminResponse.headers['x-ratelimit-limit'])

      const authorResponse = await request(baseUrl)
        .get('/api/v2/articles')
        .set(authHeader(testUsers.author))
        .expect(200)

      const authorLimit = parseInt(authorResponse.headers['x-ratelimit-limit'])

      expect(adminLimit).toBeGreaterThan(authorLimit)
    })

    it('should track rate limit remaining correctly', async () => {
      const response1 = await request(baseUrl)
        .get('/api/v2/articles')
        .expect(200)

      const remaining1 = parseInt(response1.headers['x-ratelimit-remaining'])

      const response2 = await request(baseUrl)
        .get('/api/v2/articles')
        .expect(200)

      const remaining2 = parseInt(response2.headers['x-ratelimit-remaining'])

      // Second request should have fewer remaining
      expect(remaining2).toBeLessThan(remaining1)
    })
  })

  describe('Validation Errors', () => {
    it('should reject invalid type', async () => {
      const response = await request(baseUrl)
        .get('/api/v2/articles')
        .query({ type: 'INVALID_TYPE' })
        .expect(400)

      expect(response.body).toHaveProperty('error')
      expect(response.body.error.code).toBe('VALIDATION_ERROR')
    })

    it('should reject invalid status', async () => {
      const response = await request(baseUrl)
        .get('/api/v2/articles')
        .query({ status: 'INVALID_STATUS' })
        .expect(400)

      expect(response.body).toHaveProperty('error')
      expect(response.body.error.code).toBe('VALIDATION_ERROR')
    })

    it('should reject invalid page number', async () => {
      const response = await request(baseUrl)
        .get('/api/v2/articles')
        .query({ page: 0 })
        .expect(400)

      expect(response.body.error.code).toBe('VALIDATION_ERROR')
    })

    it('should reject invalid limit', async () => {
      const response = await request(baseUrl)
        .get('/api/v2/articles')
        .query({ limit: 0 })
        .expect(400)

      expect(response.body.error.code).toBe('VALIDATION_ERROR')
    })
  })

  describe('Error Handling', () => {
    it('should handle database errors gracefully', async () => {
      prismaMock.article.findMany.mockRejectedValue(
        new Error('Database connection failed')
      )

      const response = await request(baseUrl)
        .get('/api/v2/articles')
        .expect(500)

      expect(response.body).toHaveProperty('error')
      expect(response.body.error.code).toBe('INTERNAL_ERROR')
    })

    it('should handle validation service errors', async () => {
      const response = await request(baseUrl)
        .get('/api/v2/articles')
        .query({ sortBy: 'invalid_field' })
        .expect(400)

      expect(response.body.error.code).toBe('VALIDATION_ERROR')
    })
  })

  describe('Response Structure', () => {
    it('should include all required fields in response', async () => {
      const response = await request(baseUrl)
        .get('/api/v2/articles')
        .expect(200)

      expect(response.body).toHaveProperty('articles')
      expect(response.body).toHaveProperty('total')
      expect(response.body).toHaveProperty('page')
      expect(response.body).toHaveProperty('limit')
      expect(response.body).toHaveProperty('totalPages')
    })

    it('should include article relationships', async () => {
      const response = await request(baseUrl)
        .get('/api/v2/articles')
        .expect(200)

      if (response.body.articles.length > 0) {
        const article = response.body.articles[0]
        expect(article).toHaveProperty('author')
        expect(article).toHaveProperty('category')
        expect(article).toHaveProperty('tags')
      }
    })

    it('should not include deleted articles by default', async () => {
      prismaMock.article.findMany.mockResolvedValue([
        {
          id: 'art-1',
          deletedAt: null,
        } as any,
      ])

      await request(baseUrl)
        .get('/api/v2/articles')
        .expect(200)

      expect(prismaMock.article.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            deletedAt: null,
          }),
        })
      )
    })
  })
})
