/**
 * Tests for DI Container
 * Coverage target: >80%
 */

// Mock Next.js server modules BEFORE imports
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((body, init) => ({ body, status: init?.status || 200 })),
  },
}))

// Mock Prisma
jest.mock('@/lib/core/prisma', () => ({
  __esModule: true,
  prisma: require('@/lib/__mocks__/prisma').prismaMock,
}))

import 'reflect-metadata'
import { container, TOKENS, ServiceLocator, initializeContainer } from '../container'
import { LoggerService } from '@/lib/services/logger-service'
import { ValidationService } from '@/lib/services/validation-service'
import { ArticleService } from '@/lib/services/article-service'

describe('DI Container', () => {
  beforeEach(() => {
    // Reset container before each test
    ServiceLocator.reset()
  })

  describe('initializeContainer', () => {
    it('should register all services', () => {
      initializeContainer()

      expect(() => container.resolve(TOKENS.LoggerService)).not.toThrow()
      expect(() => container.resolve(TOKENS.ValidationService)).not.toThrow()
      expect(() => container.resolve(TOKENS.ArticleService)).not.toThrow()
    })

    it('should clear existing instances on re-initialization', () => {
      initializeContainer()
      const firstLogger = container.resolve(TOKENS.LoggerService)

      initializeContainer()
      const secondLogger = container.resolve(TOKENS.LoggerService)

      // After reset, should get new instance
      expect(firstLogger).not.toBe(secondLogger)
    })
  })

  describe('Service Resolution', () => {
    beforeEach(() => {
      initializeContainer()
    })

    it('should resolve LoggerService', () => {
      const logger = container.resolve<LoggerService>(TOKENS.LoggerService)

      expect(logger).toBeInstanceOf(LoggerService)
    })

    it('should resolve ValidationService', () => {
      const validation = container.resolve<ValidationService>(TOKENS.ValidationService)

      expect(validation).toBeInstanceOf(ValidationService)
    })

    it('should resolve ArticleService', () => {
      const articleService = container.resolve<ArticleService>(TOKENS.ArticleService)

      expect(articleService).toBeInstanceOf(ArticleService)
    })

    it('should return same instance on multiple resolves (singleton)', () => {
      const logger1 = container.resolve(TOKENS.LoggerService)
      const logger2 = container.resolve(TOKENS.LoggerService)

      expect(logger1).toBe(logger2)
    })

    it('should resolve services by class constructor', () => {
      const logger = container.resolve(LoggerService)

      expect(logger).toBeInstanceOf(LoggerService)
    })
  })

  describe('ServiceLocator', () => {
    beforeEach(() => {
      initializeContainer()
    })

    describe('getLogger', () => {
      it('should return LoggerService instance', () => {
        const logger = ServiceLocator.getLogger()

        expect(logger).toBeInstanceOf(LoggerService)
      })

      it('should return same instance on multiple calls', () => {
        const logger1 = ServiceLocator.getLogger()
        const logger2 = ServiceLocator.getLogger()

        expect(logger1).toBe(logger2)
      })
    })

    describe('getValidation', () => {
      it('should return ValidationService instance', () => {
        const validation = ServiceLocator.getValidation()

        expect(validation).toBeInstanceOf(ValidationService)
      })

      it('should return same instance on multiple calls', () => {
        const validation1 = ServiceLocator.getValidation()
        const validation2 = ServiceLocator.getValidation()

        expect(validation1).toBe(validation2)
      })
    })

    describe('getArticle', () => {
      it('should return ArticleService instance', () => {
        const articleService = ServiceLocator.getArticle()

        expect(articleService).toBeInstanceOf(ArticleService)
      })

      it('should return same instance on multiple calls', () => {
        const service1 = ServiceLocator.getArticle()
        const service2 = ServiceLocator.getArticle()

        expect(service1).toBe(service2)
      })
    })

    describe('reset', () => {
      it('should clear all instances', () => {
        const logger1 = ServiceLocator.getLogger()

        ServiceLocator.reset()

        const logger2 = ServiceLocator.getLogger()

        expect(logger1).not.toBe(logger2)
      })

      it('should re-initialize container after reset', () => {
        ServiceLocator.reset()

        expect(() => ServiceLocator.getLogger()).not.toThrow()
        expect(() => ServiceLocator.getValidation()).not.toThrow()
        expect(() => ServiceLocator.getArticle()).not.toThrow()
      })
    })
  })

  describe('Integration', () => {
    beforeEach(() => {
      initializeContainer()
    })

    it('should allow services to interact with each other', () => {
      const logger = ServiceLocator.getLogger()
      const articleService = ServiceLocator.getArticle()

      // Logger should work in ArticleService context
      logger.setContext({ test: 'integration' })

      // Should not throw
      expect(() => {
        logger.info('Test message')
      }).not.toThrow()
    })

    it('should maintain service state across multiple resolves', () => {
      const logger1 = ServiceLocator.getLogger()
      logger1.setContext({ userId: 'user-123' })

      const logger2 = ServiceLocator.getLogger()
      const context = logger2.getContext()

      expect(context).toEqual({ userId: 'user-123' })
    })

    it('should isolate instances after reset', () => {
      const logger1 = ServiceLocator.getLogger()
      logger1.setContext({ userId: 'user-123' })

      ServiceLocator.reset()

      const logger2 = ServiceLocator.getLogger()
      const context = logger2.getContext()

      expect(context).toEqual({})
    })
  })

  describe('TOKENS', () => {
    it('should have LoggerService token', () => {
      expect(TOKENS.LoggerService).toBe('LoggerService')
    })

    it('should have ValidationService token', () => {
      expect(TOKENS.ValidationService).toBe('ValidationService')
    })

    it('should have ArticleService token', () => {
      expect(TOKENS.ArticleService).toBe('ArticleService')
    })

    it('should have all expected tokens', () => {
      expect(Object.keys(TOKENS)).toContain('LoggerService')
      expect(Object.keys(TOKENS)).toContain('ValidationService')
      expect(Object.keys(TOKENS)).toContain('ArticleService')
    })
  })
})
