/**
 * Integration Tests - PATCH & DELETE /api/v2/articles/[id]
 * Tests article update and delete with ownership checks
 */

import request from 'supertest'
import {
  testUsers,
  authHeader,
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

const mockArticle = {
  id: 'art-1',
  title: 'Test Article',
  slug: 'test-article',
  content: '<p>Content</p>',
  type: 'NEWS',
  status: 'DRAFT',
  categoryId: 'cat-1',
  authorId: 'user-author', // Owned by author user
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
}

describe('PATCH /api/v2/articles/[id]', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    // Mock article retrieval
    prismaMock.article.findUnique.mockResolvedValue(mockArticle as any)

    // Mock successful update
    prismaMock.article.update.mockResolvedValue({
      ...mockArticle,
      title: 'Updated Title',
      updatedAt: new Date(),
    } as any)
  })

  describe('Authentication', () => {
    it('should reject unauthenticated requests', async () => {
      const response = await request(baseUrl)
        .patch('/api/v2/articles/art-1')
        .send({ title: 'Updated' })
        .expect(401)

      assertErrorResponse(response, 'AUTHENTICATION_ERROR', 401)
    })

    it('should reject expired tokens', async () => {
      const response = await request(baseUrl)
        .patch('/api/v2/articles/art-1')
        .set('Authorization', 'Bearer expired-token')
        .send({ title: 'Updated' })
        .expect(401)

      assertErrorResponse(response, 'AUTHENTICATION_ERROR', 401)
    })
  })

  describe('Authorization - Ownership', () => {
    it('should allow owner to update their article', async () => {
      const response = await request(baseUrl)
        .patch('/api/v2/articles/art-1')
        .set(authHeader(testUsers.author)) // Owner
        .send({ title: 'Updated Title' })
        .expect(200)

      expect(response.body).toHaveProperty('title', 'Updated Title')
      assertRateLimitHeaders(response)
    })

    it('should allow admin to update any article', async () => {
      const response = await request(baseUrl)
        .patch('/api/v2/articles/art-1')
        .set(authHeader(testUsers.admin)) // Not owner, but admin
        .send({ title: 'Updated Title' })
        .expect(200)

      expect(response.body).toHaveProperty('title', 'Updated Title')
    })

    it('should reject non-owner non-admin', async () => {
      const response = await request(baseUrl)
        .patch('/api/v2/articles/art-1')
        .set(authHeader(testUsers.editor)) // Different user
        .send({ title: 'Updated Title' })
        .expect(403)

      assertErrorResponse(response, 'AUTHORIZATION_ERROR', 403)
    })

    it('should reject reader role', async () => {
      const response = await request(baseUrl)
        .patch('/api/v2/articles/art-1')
        .set(authHeader(testUsers.reader))
        .send({ title: 'Updated Title' })
        .expect(403)

      assertErrorResponse(response, 'AUTHORIZATION_ERROR', 403)
    })
  })

  describe('Validation', () => {
    it('should update single field', async () => {
      const response = await request(baseUrl)
        .patch('/api/v2/articles/art-1')
        .set(authHeader(testUsers.author))
        .send({ title: 'New Title' })
        .expect(200)

      expect(prismaMock.article.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ title: 'New Title' }),
        })
      )
    })

    it('should update multiple fields', async () => {
      await request(baseUrl)
        .patch('/api/v2/articles/art-1')
        .set(authHeader(testUsers.author))
        .send({
          title: 'New Title',
          content: '<p>New content</p>',
          status: 'PUBLISHED',
        })
        .expect(200)

      expect(prismaMock.article.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            title: 'New Title',
            content: expect.any(String),
            status: 'PUBLISHED',
          }),
        })
      )
    })

    it('should reject invalid status', async () => {
      const response = await request(baseUrl)
        .patch('/api/v2/articles/art-1')
        .set(authHeader(testUsers.author))
        .send({ status: 'INVALID_STATUS' })
        .expect(400)

      assertErrorResponse(response, 'VALIDATION_ERROR', 400)
    })

    it('should reject invalid type', async () => {
      const response = await request(baseUrl)
        .patch('/api/v2/articles/art-1')
        .set(authHeader(testUsers.author))
        .send({ type: 'INVALID_TYPE' })
        .expect(400)

      assertErrorResponse(response, 'VALIDATION_ERROR', 400)
    })

    it('should sanitize HTML content on update', async () => {
      await request(baseUrl)
        .patch('/api/v2/articles/art-1')
        .set(authHeader(testUsers.author))
        .send({
          content: '<p>Safe</p><script>alert("xss")</script>',
        })
        .expect(200)

      const updatedArticle = prismaMock.article.update.mock.calls[0][0]
      expect(updatedArticle.data.content).not.toContain('<script>')
    })
  })

  describe('Not Found', () => {
    it('should return 404 for non-existent article', async () => {
      prismaMock.article.findUnique.mockResolvedValue(null)

      const response = await request(baseUrl)
        .patch('/api/v2/articles/non-existent')
        .set(authHeader(testUsers.author))
        .send({ title: 'Updated' })
        .expect(404)

      assertErrorResponse(response, 'NOT_FOUND', 404)
    })
  })

  describe('Rate Limiting', () => {
    it('should enforce rate limits', async () => {
      const response = await request(baseUrl)
        .patch('/api/v2/articles/art-1')
        .set(authHeader(testUsers.author))
        .send({ title: 'Updated' })
        .expect(200)

      assertRateLimitHeaders(response)
    })
  })
})

describe('DELETE /api/v2/articles/[id]', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    // Mock article retrieval
    prismaMock.article.findUnique.mockResolvedValue(mockArticle as any)

    // Mock successful soft delete
    prismaMock.article.update.mockResolvedValue({
      ...mockArticle,
      status: 'DELETED',
      deletedAt: new Date(),
    } as any)
  })

  describe('Authentication', () => {
    it('should reject unauthenticated requests', async () => {
      const response = await request(baseUrl)
        .delete('/api/v2/articles/art-1')
        .expect(401)

      assertErrorResponse(response, 'AUTHENTICATION_ERROR', 401)
    })
  })

  describe('Authorization - Ownership', () => {
    it('should allow owner to delete their article', async () => {
      const response = await request(baseUrl)
        .delete('/api/v2/articles/art-1')
        .set(authHeader(testUsers.author)) // Owner
        .expect(200)

      expect(response.body).toHaveProperty('message')
      expect(response.body).toHaveProperty('id', 'art-1')
      assertRateLimitHeaders(response)
    })

    it('should allow admin to delete any article', async () => {
      const response = await request(baseUrl)
        .delete('/api/v2/articles/art-1')
        .set(authHeader(testUsers.admin))
        .expect(200)

      expect(response.body).toHaveProperty('message')
    })

    it('should reject non-owner non-admin', async () => {
      const response = await request(baseUrl)
        .delete('/api/v2/articles/art-1')
        .set(authHeader(testUsers.editor))
        .expect(403)

      assertErrorResponse(response, 'AUTHORIZATION_ERROR', 403)
    })

    it('should reject reader role', async () => {
      const response = await request(baseUrl)
        .delete('/api/v2/articles/art-1')
        .set(authHeader(testUsers.reader))
        .expect(403)

      assertErrorResponse(response, 'AUTHORIZATION_ERROR', 403)
    })
  })

  describe('Soft Delete Behavior', () => {
    it('should perform soft delete (set deletedAt)', async () => {
      await request(baseUrl)
        .delete('/api/v2/articles/art-1')
        .set(authHeader(testUsers.author))
        .expect(200)

      expect(prismaMock.article.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            status: 'DELETED',
            deletedAt: expect.any(Date),
          }),
        })
      )
    })

    it('should not actually delete from database', async () => {
      await request(baseUrl)
        .delete('/api/v2/articles/art-1')
        .set(authHeader(testUsers.author))
        .expect(200)

      // Should use update, not delete
      expect(prismaMock.article.update).toHaveBeenCalled()
      expect(prismaMock.article.delete).not.toHaveBeenCalled()
    })
  })

  describe('Not Found', () => {
    it('should return 404 for non-existent article', async () => {
      prismaMock.article.findUnique.mockResolvedValue(null)

      const response = await request(baseUrl)
        .delete('/api/v2/articles/non-existent')
        .set(authHeader(testUsers.author))
        .expect(404)

      assertErrorResponse(response, 'NOT_FOUND', 404)
    })
  })

  describe('Rate Limiting', () => {
    it('should enforce rate limits', async () => {
      const response = await request(baseUrl)
        .delete('/api/v2/articles/art-1')
        .set(authHeader(testUsers.author))
        .expect(200)

      assertRateLimitHeaders(response)
    })
  })

  describe('Error Handling', () => {
    it('should handle database errors gracefully', async () => {
      prismaMock.article.update.mockRejectedValue(
        new Error('Database error')
      )

      const response = await request(baseUrl)
        .delete('/api/v2/articles/art-1')
        .set(authHeader(testUsers.author))
        .expect(500)

      assertErrorResponse(response, 'INTERNAL_ERROR', 500)
    })
  })
})
