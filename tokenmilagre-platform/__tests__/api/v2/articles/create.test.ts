/**
 * Integration Tests - POST /api/v2/articles
 * Tests article creation with auth, authorization, validation, and rate limiting
 */

import request from 'supertest'
import {
  testUsers,
  authHeader,
  createTestArticle,
  assertRateLimitHeaders,
  assertErrorResponse,
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

jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  prisma: require('@/lib/__mocks__/prisma').prismaMock,
}))

const baseUrl = 'http://localhost:3000'

describe('POST /api/v2/articles', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    // Mock successful article creation
    prismaMock.article.findUnique.mockResolvedValue(null) // No duplicate slug
    prismaMock.category.findUnique.mockResolvedValue({ id: 'cat-1' } as any)
    prismaMock.tag.findMany.mockResolvedValue([{ id: 'tag-1' }] as any)
    prismaMock.article.create.mockResolvedValue({
      id: 'art-new',
      title: 'Test Article',
      slug: 'test-article',
      content: '<p>Content</p>',
      type: 'NEWS',
      status: 'DRAFT',
      categoryId: 'cat-1',
      authorId: 'user-author',
      readTime: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      publishedAt: null,
      featuredUntil: null,
      excerpt: null,
      coverImage: null,
      seo: null,
      author: {
        id: 'user-author',
        name: 'Test Author',
        email: 'author@test.com',
      },
      category: {
        id: 'cat-1',
        name: 'Technology',
        slug: 'technology',
      },
      tags: [],
      citations: [],
      relatedArticles: [],
      relatedByArticles: [],
    } as any)
  })

  describe('Authentication', () => {
    it('should reject unauthenticated requests', async () => {
      const articleData = createTestArticle()

      const response = await request(baseUrl)
        .post('/api/v2/articles')
        .send(articleData)
        .expect(401)

      assertErrorResponse(response, 'AUTHENTICATION_ERROR', 401)
    })

    it('should reject requests with expired token', async () => {
      const articleData = createTestArticle()

      const response = await request(baseUrl)
        .post('/api/v2/articles')
        .set('Authorization', 'Bearer expired-token')
        .send(articleData)
        .expect(401)

      assertErrorResponse(response, 'AUTHENTICATION_ERROR', 401)
    })

    it('should reject requests from inactive users', async () => {
      const articleData = createTestArticle()

      const response = await request(baseUrl)
        .post('/api/v2/articles')
        .set(authHeader(testUsers.inactive))
        .send(articleData)
        .expect(401)

      assertErrorResponse(response, 'AUTHENTICATION_ERROR', 401)
    })
  })

  describe('Authorization', () => {
    it('should allow AUTHOR role to create articles', async () => {
      const articleData = createTestArticle()

      const response = await request(baseUrl)
        .post('/api/v2/articles')
        .set(authHeader(testUsers.author))
        .send(articleData)
        .expect(201)

      expect(response.body).toHaveProperty('id')
      expect(response.body).toHaveProperty('title', articleData.title)
      assertRateLimitHeaders(response)
    })

    it('should allow EDITOR role to create articles', async () => {
      const articleData = createTestArticle()

      const response = await request(baseUrl)
        .post('/api/v2/articles')
        .set(authHeader(testUsers.editor))
        .send(articleData)
        .expect(201)

      expect(response.body).toHaveProperty('id')
    })

    it('should allow ADMIN role to create articles', async () => {
      const articleData = createTestArticle()

      const response = await request(baseUrl)
        .post('/api/v2/articles')
        .set(authHeader(testUsers.admin))
        .send(articleData)
        .expect(201)

      expect(response.body).toHaveProperty('id')
    })

    it('should reject READER role', async () => {
      const articleData = createTestArticle()

      const response = await request(baseUrl)
        .post('/api/v2/articles')
        .set(authHeader(testUsers.reader))
        .send(articleData)
        .expect(403)

      assertErrorResponse(response, 'AUTHORIZATION_ERROR', 403)
    })
  })

  describe('Validation', () => {
    it('should reject missing title', async () => {
      const articleData = createTestArticle({ title: undefined })

      const response = await request(baseUrl)
        .post('/api/v2/articles')
        .set(authHeader(testUsers.author))
        .send(articleData)
        .expect(400)

      assertErrorResponse(response, 'VALIDATION_ERROR', 400)
      expect(response.body.error.context).toHaveProperty('fieldErrors')
    })

    it('should reject missing slug', async () => {
      const articleData = createTestArticle({ slug: undefined })

      const response = await request(baseUrl)
        .post('/api/v2/articles')
        .set(authHeader(testUsers.author))
        .send(articleData)
        .expect(400)

      assertErrorResponse(response, 'VALIDATION_ERROR', 400)
    })

    it('should reject missing content', async () => {
      const articleData = createTestArticle({ content: undefined })

      const response = await request(baseUrl)
        .post('/api/v2/articles')
        .set(authHeader(testUsers.author))
        .send(articleData)
        .expect(400)

      assertErrorResponse(response, 'VALIDATION_ERROR', 400)
    })

    it('should reject invalid type', async () => {
      const articleData = createTestArticle({ type: 'INVALID_TYPE' })

      const response = await request(baseUrl)
        .post('/api/v2/articles')
        .set(authHeader(testUsers.author))
        .send(articleData)
        .expect(400)

      assertErrorResponse(response, 'VALIDATION_ERROR', 400)
    })

    it('should reject invalid status', async () => {
      const articleData = createTestArticle({ status: 'INVALID_STATUS' })

      const response = await request(baseUrl)
        .post('/api/v2/articles')
        .set(authHeader(testUsers.author))
        .send(articleData)
        .expect(400)

      assertErrorResponse(response, 'VALIDATION_ERROR', 400)
    })

    it('should reject title too long', async () => {
      const articleData = createTestArticle({
        title: 'a'.repeat(300), // Over 255 limit
      })

      const response = await request(baseUrl)
        .post('/api/v2/articles')
        .set(authHeader(testUsers.author))
        .send(articleData)
        .expect(400)

      assertErrorResponse(response, 'VALIDATION_ERROR', 400)
    })

    it('should reject invalid tagIds', async () => {
      const articleData = createTestArticle({
        tagIds: ['not-a-cuid'],
      })

      const response = await request(baseUrl)
        .post('/api/v2/articles')
        .set(authHeader(testUsers.author))
        .send(articleData)
        .expect(400)

      assertErrorResponse(response, 'VALIDATION_ERROR', 400)
    })

    it('should reject too many tags', async () => {
      const articleData = createTestArticle({
        tagIds: Array(15).fill('tag-1'), // Over 10 limit
      })

      const response = await request(baseUrl)
        .post('/api/v2/articles')
        .set(authHeader(testUsers.author))
        .send(articleData)
        .expect(400)

      assertErrorResponse(response, 'VALIDATION_ERROR', 400)
    })
  })

  describe('Business Logic', () => {
    it('should reject duplicate slug', async () => {
      // Mock existing article with same slug
      prismaMock.article.findUnique.mockResolvedValue({
        id: 'art-existing',
        slug: 'test-article',
      } as any)

      const articleData = createTestArticle({ slug: 'test-article' })

      const response = await request(baseUrl)
        .post('/api/v2/articles')
        .set(authHeader(testUsers.author))
        .send(articleData)
        .expect(409)

      assertErrorResponse(response, 'CONFLICT', 409)
      expect(response.body.error.context).toHaveProperty('slug')
    })

    it('should reject non-existent categoryId', async () => {
      prismaMock.category.findUnique.mockResolvedValue(null)

      const articleData = createTestArticle({ categoryId: 'non-existent' })

      const response = await request(baseUrl)
        .post('/api/v2/articles')
        .set(authHeader(testUsers.author))
        .send(articleData)
        .expect(404)

      assertErrorResponse(response, 'NOT_FOUND', 404)
    })

    it('should sanitize HTML content', async () => {
      const articleData = createTestArticle({
        content: '<p>Safe content</p><script>alert("xss")</script>',
      })

      await request(baseUrl)
        .post('/api/v2/articles')
        .set(authHeader(testUsers.author))
        .send(articleData)
        .expect(201)

      // Verify sanitization was called
      const createdArticle = prismaMock.article.create.mock.calls[0][0]
      expect(createdArticle.data.content).not.toContain('<script>')
    })

    it('should auto-calculate readTime if not provided', async () => {
      const articleData = createTestArticle({
        content: '<p>' + 'word '.repeat(500) + '</p>', // ~500 words
        readTime: undefined,
      })

      await request(baseUrl)
        .post('/api/v2/articles')
        .set(authHeader(testUsers.author))
        .send(articleData)
        .expect(201)

      const createdArticle = prismaMock.article.create.mock.calls[0][0]
      expect(createdArticle.data.readTime).toBeGreaterThan(0)
    })

    it('should normalize citations', async () => {
      const articleData = createTestArticle({
        citations: [
          {
            url: 'https://example.com/article',
            title: 'Source Article',
          },
        ],
      })

      await request(baseUrl)
        .post('/api/v2/articles')
        .set(authHeader(testUsers.author))
        .send(articleData)
        .expect(201)

      const createdArticle = prismaMock.article.create.mock.calls[0][0]
      expect(createdArticle.data.citations.create[0]).toHaveProperty('domain')
    })
  })

  describe('Rate Limiting', () => {
    it('should enforce rate limits for authors', async () => {
      const articleData = createTestArticle()

      const response = await request(baseUrl)
        .post('/api/v2/articles')
        .set(authHeader(testUsers.author))
        .send(articleData)
        .expect(201)

      const limit = parseInt(response.headers['x-ratelimit-limit'])
      const remaining = parseInt(response.headers['x-ratelimit-remaining'])

      expect(limit).toBe(200) // AUTHOR limit
      expect(remaining).toBeLessThanOrEqual(limit)
    })

    it('should have higher rate limit for admins', async () => {
      const articleData = createTestArticle()

      const response = await request(baseUrl)
        .post('/api/v2/articles')
        .set(authHeader(testUsers.admin))
        .send(articleData)
        .expect(201)

      const limit = parseInt(response.headers['x-ratelimit-limit'])
      expect(limit).toBe(1000) // ADMIN limit
    })
  })

  describe('Response Structure', () => {
    it('should return created article with all fields', async () => {
      const articleData = createTestArticle()

      const response = await request(baseUrl)
        .post('/api/v2/articles')
        .set(authHeader(testUsers.author))
        .send(articleData)
        .expect(201)

      expect(response.body).toHaveProperty('id')
      expect(response.body).toHaveProperty('title')
      expect(response.body).toHaveProperty('slug')
      expect(response.body).toHaveProperty('content')
      expect(response.body).toHaveProperty('type')
      expect(response.body).toHaveProperty('status')
      expect(response.body).toHaveProperty('createdAt')
      expect(response.body).toHaveProperty('updatedAt')
    })

    it('should return article with relationships', async () => {
      const articleData = createTestArticle()

      const response = await request(baseUrl)
        .post('/api/v2/articles')
        .set(authHeader(testUsers.author))
        .send(articleData)
        .expect(201)

      expect(response.body).toHaveProperty('author')
      expect(response.body).toHaveProperty('category')
      expect(response.body).toHaveProperty('tags')
      expect(response.body.author).toHaveProperty('name')
      expect(response.body.category).toHaveProperty('name')
    })
  })

  describe('Error Handling', () => {
    it('should handle database errors gracefully', async () => {
      prismaMock.article.create.mockRejectedValue(
        new Error('Database connection failed')
      )

      const articleData = createTestArticle()

      const response = await request(baseUrl)
        .post('/api/v2/articles')
        .set(authHeader(testUsers.author))
        .send(articleData)
        .expect(500)

      assertErrorResponse(response, 'INTERNAL_ERROR', 500)
    })

    it('should handle malformed JSON', async () => {
      const response = await request(baseUrl)
        .post('/api/v2/articles')
        .set(authHeader(testUsers.author))
        .set('Content-Type', 'application/json')
        .send('{ invalid json }')
        .expect(400)

      expect(response.body).toHaveProperty('error')
    })
  })
})
