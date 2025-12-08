/**
 * API Integration Test Helpers
 *
 * Provides utilities for testing API routes with Supertest.
 * Includes auth token generation, test data factories, and assertion helpers.
 */

import { sign } from 'jsonwebtoken'
import type { UserRole } from '@/lib/shared/middleware/auth'

/**
 * JWT secret for tests (same as in auth middleware)
 */
const JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key'

/**
 * Test user data
 */
export interface TestUser {
  userId: string
  email: string
  name: string
  role: UserRole
  isActive: boolean
}

/**
 * Pre-configured test users for different roles
 */
export const testUsers = {
  admin: {
    userId: 'user-admin',
    email: 'admin@test.com',
    name: 'Test Admin',
    role: 'ADMIN' as UserRole,
    isActive: true,
  },
  editor: {
    userId: 'user-editor',
    email: 'editor@test.com',
    name: 'Test Editor',
    role: 'EDITOR' as UserRole,
    isActive: true,
  },
  author: {
    userId: 'user-author',
    email: 'author@test.com',
    name: 'Test Author',
    role: 'AUTHOR' as UserRole,
    isActive: true,
  },
  reader: {
    userId: 'user-reader',
    email: 'reader@test.com',
    name: 'Test Reader',
    role: 'READER' as UserRole,
    isActive: true,
  },
  inactive: {
    userId: 'user-inactive',
    email: 'inactive@test.com',
    name: 'Inactive User',
    role: 'READER' as UserRole,
    isActive: false,
  },
}

/**
 * Generates JWT token for test user
 */
export function generateAuthToken(user: TestUser): string {
  return sign(
    {
      userId: user.userId,
      email: user.email,
      name: user.name,
      role: user.role,
      isActive: user.isActive,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour
    },
    JWT_SECRET
  )
}

/**
 * Generates expired JWT token for testing
 */
export function generateExpiredAuthToken(user: TestUser): string {
  return sign(
    {
      userId: user.userId,
      email: user.email,
      name: user.name,
      role: user.role,
      isActive: user.isActive,
      iat: Math.floor(Date.now() / 1000) - 7200, // 2 hours ago
      exp: Math.floor(Date.now() / 1000) - 3600, // Expired 1 hour ago
    },
    JWT_SECRET
  )
}

/**
 * Creates Authorization header with Bearer token
 */
export function authHeader(user: TestUser): Record<string, string> {
  const token = generateAuthToken(user)
  return {
    Authorization: `Bearer ${token}`,
  }
}

/**
 * Test article data factory
 */
export function createTestArticle(overrides?: Partial<any>) {
  return {
    title: 'Test Article',
    slug: 'test-article-' + Date.now(),
    content: '<p>Test content</p>',
    type: 'NEWS',
    categoryId: 'cat-test',
    authorId: 'user-author',
    tagIds: ['tag-1'],
    status: 'DRAFT',
    ...overrides,
  }
}

/**
 * Assertion helpers for rate limit headers
 */
export function assertRateLimitHeaders(response: any) {
  expect(response.headers).toHaveProperty('x-ratelimit-limit')
  expect(response.headers).toHaveProperty('x-ratelimit-remaining')
  expect(response.headers).toHaveProperty('x-ratelimit-reset')

  // Validate header values
  const limit = parseInt(response.headers['x-ratelimit-limit'])
  const remaining = parseInt(response.headers['x-ratelimit-remaining'])

  expect(limit).toBeGreaterThan(0)
  expect(remaining).toBeGreaterThanOrEqual(0)
  expect(remaining).toBeLessThanOrEqual(limit)
}

/**
 * Assertion helpers for error responses
 */
export function assertErrorResponse(
  response: any,
  expectedCode: string,
  expectedStatus: number
) {
  expect(response.status).toBe(expectedStatus)
  expect(response.body).toHaveProperty('error')
  expect(response.body.error).toHaveProperty('code', expectedCode)
  expect(response.body.error).toHaveProperty('message')
  expect(response.body.error).toHaveProperty('timestamp')
}

/**
 * Wait helper for rate limit tests
 */
export async function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Generates multiple requests to trigger rate limit
 */
export async function triggerRateLimit(
  requestFn: () => Promise<any>,
  limit: number
): Promise<any[]> {
  const requests = []
  for (let i = 0; i < limit + 5; i++) {
    requests.push(requestFn())
  }
  return Promise.all(requests)
}
