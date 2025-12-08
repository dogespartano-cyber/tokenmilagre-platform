/**
 * Integration Tests - GET /api/v2/articles/stats
 * Tests article statistics endpoint
 */

import request from 'supertest'
import {
  testUsers,
  authHeader,
  assertRateLimitHeaders,
} from '@/lib/__tests__/helpers/api-test-helpers'
import { prismaMock } from '@/lib/__mocks__/prisma'

// Mock modules
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

jest.mock('@/lib/core/prisma', () => ({
  __esModule: true,
  prisma: require('@/lib/__mocks__/prisma').prismaMock,
}))

const baseUrl = 'http://localhost:3000'

const mockStats = {
  total: 100,
  published: 60,
  draft: 30,
  archived: 10,
  byType: {
    NEWS: 50,
    EDUCATIONAL: 30,
    RESOURCE: 20,
  },
  byCategory: {
    'cat-1': 40,
    'cat-2': 35,
    'cat-3': 25,
  },
}

describe('GET /api/v2/articles/stats', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    // Mock stats queries
    prismaMock.article.count.mockImplementation((args: any) => {
      if (args?.where?.status === 'PUBLISHED') return Promise.resolve(60)
      if (args?.where?.status === 'DRAFT') return Promise.resolve(30)
      if (args?.where?.status === 'ARCHIVED') return Promise.resolve(10)
      if (args?.where?.type === 'NEWS') return Promise.resolve(50)
      if (args?.where?.type === 'EDUCATIONAL') return Promise.resolve(30)
      if (args?.where?.type === 'RESOURCE') return Promise.resolve(20)
      return Promise.resolve(100) // total
    })

    prismaMock.article.groupBy.mockResolvedValue([
      { categoryId: 'cat-1', _count: { id: 40 } },
      { categoryId: 'cat-2', _count: { id: 35 } },
      { categoryId: 'cat-3', _count: { id: 25 } },
    ] as any)
  })

  describe('Success Cases', () => {
    it('should return stats without authentication', async () => {
      const response = await request(baseUrl)
        .get('/api/v2/articles/stats')
        .expect(200)

      expect(response.body).toHaveProperty('total')
      expect(response.body).toHaveProperty('published')
      expect(response.body).toHaveProperty('draft')
      expect(response.body).toHaveProperty('archived')
      expect(response.body).toHaveProperty('byType')
      expect(response.body).toHaveProperty('byCategory')
      assertRateLimitHeaders(response)
    })

    it('should return stats with authentication', async () => {
      const response = await request(baseUrl)
        .get('/api/v2/articles/stats')
        .set(authHeader(testUsers.author))
        .expect(200)

      expect(response.body).toHaveProperty('total')
      assertRateLimitHeaders(response)
    })
  })

  describe('Response Structure', () => {
    it('should include all required stats fields', async () => {
      const response = await request(baseUrl)
        .get('/api/v2/articles/stats')
        .expect(200)

      expect(response.body).toHaveProperty('total')
      expect(response.body).toHaveProperty('published')
      expect(response.body).toHaveProperty('draft')
      expect(response.body).toHaveProperty('archived')
    })

    it('should include stats by type', async () => {
      const response = await request(baseUrl)
        .get('/api/v2/articles/stats')
        .expect(200)

      expect(response.body.byType).toHaveProperty('NEWS')
      expect(response.body.byType).toHaveProperty('EDUCATIONAL')
      expect(response.body.byType).toHaveProperty('RESOURCE')
    })

    it('should include stats by category', async () => {
      const response = await request(baseUrl)
        .get('/api/v2/articles/stats')
        .expect(200)

      expect(response.body).toHaveProperty('byCategory')
      expect(typeof response.body.byCategory).toBe('object')
    })

    it('should return numeric values', async () => {
      const response = await request(baseUrl)
        .get('/api/v2/articles/stats')
        .expect(200)

      expect(typeof response.body.total).toBe('number')
      expect(typeof response.body.published).toBe('number')
      expect(typeof response.body.draft).toBe('number')
      expect(typeof response.body.archived).toBe('number')
    })
  })

  describe('Data Accuracy', () => {
    it('should calculate total correctly', async () => {
      const response = await request(baseUrl)
        .get('/api/v2/articles/stats')
        .expect(200)

      expect(response.body.total).toBe(100)
    })

    it('should calculate published count correctly', async () => {
      const response = await request(baseUrl)
        .get('/api/v2/articles/stats')
        .expect(200)

      expect(response.body.published).toBe(60)
    })

    it('should calculate draft count correctly', async () => {
      const response = await request(baseUrl)
        .get('/api/v2/articles/stats')
        .expect(200)

      expect(response.body.draft).toBe(30)
    })

    it('should calculate archived count correctly', async () => {
      const response = await request(baseUrl)
        .get('/api/v2/articles/stats')
        .expect(200)

      expect(response.body.archived).toBe(10)
    })

    it('should calculate type distribution correctly', async () => {
      const response = await request(baseUrl)
        .get('/api/v2/articles/stats')
        .expect(200)

      expect(response.body.byType.NEWS).toBe(50)
      expect(response.body.byType.EDUCATIONAL).toBe(30)
      expect(response.body.byType.RESOURCE).toBe(20)
    })
  })

  describe('Empty Stats', () => {
    it('should handle zero articles', async () => {
      prismaMock.article.count.mockResolvedValue(0)
      prismaMock.article.groupBy.mockResolvedValue([])

      const response = await request(baseUrl)
        .get('/api/v2/articles/stats')
        .expect(200)

      expect(response.body.total).toBe(0)
      expect(response.body.published).toBe(0)
      expect(response.body.draft).toBe(0)
      expect(response.body.archived).toBe(0)
    })
  })

  describe('Rate Limiting', () => {
    it('should have rate limit for unauthenticated users', async () => {
      const response = await request(baseUrl)
        .get('/api/v2/articles/stats')
        .expect(200)

      const limit = parseInt(response.headers['x-ratelimit-limit'])
      expect(limit).toBe(50) // Unauthenticated limit
    })

    it('should have higher rate limit for authenticated users', async () => {
      const unauthResponse = await request(baseUrl)
        .get('/api/v2/articles/stats')
        .expect(200)

      const unauthLimit = parseInt(unauthResponse.headers['x-ratelimit-limit'])

      const authResponse = await request(baseUrl)
        .get('/api/v2/articles/stats')
        .set(authHeader(testUsers.author))
        .expect(200)

      const authLimit = parseInt(authResponse.headers['x-ratelimit-limit'])

      expect(authLimit).toBeGreaterThan(unauthLimit)
    })

    it('should track remaining requests', async () => {
      const response1 = await request(baseUrl)
        .get('/api/v2/articles/stats')
        .expect(200)

      const remaining1 = parseInt(response1.headers['x-ratelimit-remaining'])

      const response2 = await request(baseUrl)
        .get('/api/v2/articles/stats')
        .expect(200)

      const remaining2 = parseInt(response2.headers['x-ratelimit-remaining'])

      expect(remaining2).toBeLessThan(remaining1)
    })
  })

  describe('Error Handling', () => {
    it('should handle database errors gracefully', async () => {
      prismaMock.article.count.mockRejectedValue(
        new Error('Database connection failed')
      )

      const response = await request(baseUrl)
        .get('/api/v2/articles/stats')
        .expect(500)

      expect(response.body).toHaveProperty('error')
      expect(response.body.error.code).toBe('INTERNAL_ERROR')
    })

    it('should handle groupBy errors', async () => {
      prismaMock.article.groupBy.mockRejectedValue(
        new Error('GroupBy failed')
      )

      const response = await request(baseUrl)
        .get('/api/v2/articles/stats')
        .expect(500)

      expect(response.body.error.code).toBe('INTERNAL_ERROR')
    })
  })

  describe('Caching Headers', () => {
    it('should include rate limit reset time', async () => {
      const response = await request(baseUrl)
        .get('/api/v2/articles/stats')
        .expect(200)

      expect(response.headers).toHaveProperty('x-ratelimit-reset')
      const resetTime = new Date(response.headers['x-ratelimit-reset'])
      expect(resetTime.getTime()).toBeGreaterThan(Date.now())
    })
  })

  describe('Performance', () => {
    it('should return stats quickly', async () => {
      const start = Date.now()

      await request(baseUrl)
        .get('/api/v2/articles/stats')
        .expect(200)

      const duration = Date.now() - start

      // Should respond in less than 1 second
      expect(duration).toBeLessThan(1000)
    })
  })
})
