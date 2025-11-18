/**
 * Authentication Fixtures for E2E Tests
 * Provides authenticated contexts for different user roles
 */

import { test as base } from '@playwright/test'
import { sign } from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key'

export type UserRole = 'ADMIN' | 'EDITOR' | 'AUTHOR' | 'READER'

export interface TestUser {
  userId: string
  email: string
  name: string
  role: UserRole
  isActive: boolean
}

/**
 * Pre-configured test users
 */
export const testUsers: Record<string, TestUser> = {
  admin: {
    userId: 'e2e-admin',
    email: 'admin@e2e.test',
    name: 'Admin User',
    role: 'ADMIN',
    isActive: true,
  },
  editor: {
    userId: 'e2e-editor',
    email: 'editor@e2e.test',
    name: 'Editor User',
    role: 'EDITOR',
    isActive: true,
  },
  author: {
    userId: 'e2e-author',
    email: 'author@e2e.test',
    name: 'Author User',
    role: 'AUTHOR',
    isActive: true,
  },
  reader: {
    userId: 'e2e-reader',
    email: 'reader@e2e.test',
    name: 'Reader User',
    role: 'READER',
    isActive: true,
  },
}

/**
 * Generates JWT token for user
 */
function generateToken(user: TestUser): string {
  return sign(
    {
      userId: user.userId,
      email: user.email,
      name: user.name,
      role: user.role,
      isActive: user.isActive,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour
    },
    JWT_SECRET
  )
}

/**
 * Extended test fixtures with authentication
 */
export const test = base.extend<{
  authenticatedContext: {
    user: TestUser
    token: string
  }
}>({
  authenticatedContext: async ({ browser }, use, testInfo) => {
    // Extract user role from test title or use default
    const testTitle = testInfo.title.toLowerCase()
    let user: TestUser

    if (testTitle.includes('admin')) {
      user = testUsers.admin
    } else if (testTitle.includes('editor')) {
      user = testUsers.editor
    } else if (testTitle.includes('author')) {
      user = testUsers.author
    } else if (testTitle.includes('reader')) {
      user = testUsers.reader
    } else {
      user = testUsers.author // Default
    }

    const token = generateToken(user)

    // Create new context with auth cookie
    const context = await browser.newContext({
      extraHTTPHeaders: {
        Authorization: `Bearer ${token}`,
      },
    })

    // Add auth cookie
    await context.addCookies([
      {
        name: 'auth_token',
        value: token,
        domain: 'localhost',
        path: '/',
      },
    ])

    await use({ user, token })

    await context.close()
  },
})

export { expect } from '@playwright/test'
