// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'util'

// Polyfills for Next.js Web APIs
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

// Mock Prisma Client for tests
jest.mock('@/lib/core/prisma', () => ({
  __esModule: true,
  prisma: require('./lib/__mocks__/prisma').prismaMock
}))

// Mock environment variables for tests
process.env.NEXTAUTH_URL = 'http://localhost:3000'
process.env.NEXTAUTH_SECRET = 'test-secret'
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test'

// Mock window.matchMedia (only in browser environment)
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  })
}

// Mock IntersectionObserver (only in browser environment)
if (typeof window !== 'undefined') {
  global.IntersectionObserver = class IntersectionObserver {
    constructor() { }
    disconnect() { }
    observe() { }
    takeRecords() {
      return []
    }
    unobserve() { }
  }
}

// Note: MSW polyfills are only loaded by tests that import __tests__/setup-msw.ts
// This avoids loading undici globally which requires complex Node polyfills
