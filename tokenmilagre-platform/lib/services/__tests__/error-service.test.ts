/**
 * Tests for ErrorService
 * Coverage target: >80% (aiming for 95%+)
 */

import { NextResponse } from 'next/server'
import {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  ExternalAPIError,
  DatabaseError,
  errorHandler,
  withErrorHandling,
  assertExists,
  isOperationalError,
  handleCriticalError,
} from '../error-service'
import { logger } from '../logger-service'

// Mock logger
jest.mock('../logger-service', () => ({
  logger: {
    error: jest.fn(),
    warn: jest.fn(),
    fatal: jest.fn(),
  },
}))

// Mock NextResponse
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((body, init) => ({
      body,
      status: init?.status || 200,
    })),
  },
}))

describe('ErrorService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('AppError', () => {
    it('should create error with all properties', () => {
      const context = { userId: 'user123' }
      const error = new AppError('Test error', 500, 'TEST_ERROR', true, context)

      expect(error).toBeInstanceOf(Error)
      expect(error).toBeInstanceOf(AppError)
      expect(error.message).toBe('Test error')
      expect(error.statusCode).toBe(500)
      expect(error.code).toBe('TEST_ERROR')
      expect(error.isOperational).toBe(true)
      expect(error.context).toEqual(context)
      expect(error.timestamp).toBeInstanceOf(Date)
      expect(error.name).toBe('AppError')
    })

    it('should use default values when optional params not provided', () => {
      const error = new AppError('Simple error')

      expect(error.statusCode).toBe(500)
      expect(error.code).toBe('INTERNAL_ERROR')
      expect(error.isOperational).toBe(true)
      expect(error.context).toBeUndefined()
    })

    it('should capture stack trace', () => {
      const error = new AppError('Test error')

      expect(error.stack).toBeDefined()
      expect(error.stack).toContain('AppError')
    })

    it('should serialize to JSON in development', () => {
      process.env.NODE_ENV = 'development'
      const context = { field: 'email' }
      const error = new AppError('Validation failed', 400, 'VALIDATION_ERROR', true, context)

      const json = error.toJSON()

      expect(json.error).toMatchObject({
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        statusCode: 400,
        context,
      })
      expect(json.error.timestamp).toBeDefined()
      expect(json.error.stack).toBeDefined() // Stack included in dev
    })

    it('should serialize to JSON in production without stack', () => {
      process.env.NODE_ENV = 'production'
      const error = new AppError('Production error', 500)

      const json = error.toJSON()

      expect(json.error).toMatchObject({
        message: 'Production error',
        code: 'INTERNAL_ERROR',
        statusCode: 500,
      })
      expect(json.error.stack).toBeUndefined() // No stack in production
    })

    it('should maintain prototype chain for instanceof checks', () => {
      const error = new AppError('Test')

      expect(error instanceof Error).toBe(true)
      expect(error instanceof AppError).toBe(true)
    })
  })

  describe('ValidationError', () => {
    it('should create validation error with correct defaults', () => {
      const error = new ValidationError('Invalid email', { field: 'email' })

      expect(error).toBeInstanceOf(AppError)
      expect(error).toBeInstanceOf(ValidationError)
      expect(error.message).toBe('Invalid email')
      expect(error.statusCode).toBe(400)
      expect(error.code).toBe('VALIDATION_ERROR')
      expect(error.isOperational).toBe(true)
      expect(error.context).toEqual({ field: 'email' })
    })
  })

  describe('AuthenticationError', () => {
    it('should create authentication error with default message', () => {
      const error = new AuthenticationError()

      expect(error.message).toBe('Authentication required')
      expect(error.statusCode).toBe(401)
      expect(error.code).toBe('AUTHENTICATION_ERROR')
    })

    it('should create authentication error with custom message', () => {
      const error = new AuthenticationError('Token expired', { token: 'abc123' })

      expect(error.message).toBe('Token expired')
      expect(error.context).toEqual({ token: 'abc123' })
    })
  })

  describe('AuthorizationError', () => {
    it('should create authorization error with default message', () => {
      const error = new AuthorizationError()

      expect(error.message).toBe('Insufficient permissions')
      expect(error.statusCode).toBe(403)
      expect(error.code).toBe('AUTHORIZATION_ERROR')
    })

    it('should create authorization error with custom message', () => {
      const error = new AuthorizationError('Admin only', { role: 'USER' })

      expect(error.message).toBe('Admin only')
      expect(error.context).toEqual({ role: 'USER' })
    })
  })

  describe('NotFoundError', () => {
    it('should create not found error', () => {
      const error = new NotFoundError('Article not found', { articleId: '123' })

      expect(error.statusCode).toBe(404)
      expect(error.code).toBe('NOT_FOUND')
      expect(error.message).toBe('Article not found')
      expect(error.context).toEqual({ articleId: '123' })
    })
  })

  describe('ConflictError', () => {
    it('should create conflict error', () => {
      const error = new ConflictError('Slug already exists', { slug: 'test' })

      expect(error.statusCode).toBe(409)
      expect(error.code).toBe('CONFLICT')
      expect(error.message).toBe('Slug already exists')
    })
  })

  describe('RateLimitError', () => {
    it('should create rate limit error with default message', () => {
      const error = new RateLimitError()

      expect(error.message).toBe('Too many requests')
      expect(error.statusCode).toBe(429)
      expect(error.code).toBe('RATE_LIMIT_EXCEEDED')
    })

    it('should create rate limit error with context', () => {
      const error = new RateLimitError('API limit exceeded', { limit: 100, window: '1m' })

      expect(error.message).toBe('API limit exceeded')
      expect(error.context).toEqual({ limit: 100, window: '1m' })
    })
  })

  describe('ExternalAPIError', () => {
    it('should create external API error', () => {
      const error = new ExternalAPIError('Perplexity timeout', {
        service: 'perplexity',
        timeout: 30000,
      })

      expect(error.statusCode).toBe(502)
      expect(error.code).toBe('EXTERNAL_API_ERROR')
      expect(error.message).toBe('Perplexity timeout')
      expect(error.context).toEqual({ service: 'perplexity', timeout: 30000 })
    })
  })

  describe('DatabaseError', () => {
    it('should create database error', () => {
      const error = new DatabaseError('Insert failed', {
        operation: 'insert',
        table: 'Article',
      })

      expect(error.statusCode).toBe(500)
      expect(error.code).toBe('DATABASE_ERROR')
      expect(error.message).toBe('Insert failed')
      expect(error.context).toEqual({ operation: 'insert', table: 'Article' })
    })
  })

  describe('errorHandler', () => {
    it('should handle AppError with status >= 500', () => {
      const error = new DatabaseError('DB connection failed')

      const response = errorHandler(error)

      expect(logger.error).toHaveBeenCalledWith(
        'DB connection failed',
        error,
        error.context
      )
      expect(NextResponse.json).toHaveBeenCalledWith(
        error.toJSON(),
        { status: 500 }
      )
      expect(response.status).toBe(500)
    })

    it('should handle AppError with status >= 400 as warning', () => {
      const error = new ValidationError('Invalid input', { field: 'email' })

      const response = errorHandler(error)

      expect(logger.warn).toHaveBeenCalledWith('Invalid input', {
        field: 'email',
        code: 'VALIDATION_ERROR',
      })
      expect(NextResponse.json).toHaveBeenCalledWith(
        error.toJSON(),
        { status: 400 }
      )
      expect(response.status).toBe(400)
    })

    it('should handle native Error in development', () => {
      process.env.NODE_ENV = 'development'
      const error = new Error('Native error')

      const response = errorHandler(error)

      expect(logger.error).toHaveBeenCalledWith(
        'Unhandled error',
        error,
        expect.objectContaining({
          name: 'Error',
          isOperational: false,
        })
      )
      expect(NextResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.objectContaining({
            message: 'Native error',
            code: 'INTERNAL_ERROR',
            statusCode: 500,
            stack: expect.any(String),
          }),
        }),
        { status: 500 }
      )
    })

    it('should handle native Error in production with generic message', () => {
      process.env.NODE_ENV = 'production'
      const error = new Error('Sensitive error details')

      const response = errorHandler(error)

      expect(logger.error).toHaveBeenCalled()
      expect(NextResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.objectContaining({
            message: 'Internal server error', // Generic message in prod
            code: 'INTERNAL_ERROR',
            statusCode: 500,
          }),
        }),
        { status: 500 }
      )
      // Should not include stack in production
      const callArgs = (NextResponse.json as jest.Mock).mock.calls[0][0]
      expect(callArgs.error.stack).toBeUndefined()
    })

    it('should handle unknown error types', () => {
      const error = 'string error'

      const response = errorHandler(error)

      expect(logger.error).toHaveBeenCalledWith(
        'Unknown error type',
        expect.any(Error),
        expect.objectContaining({
          errorType: 'string',
          isOperational: false,
        })
      )
      expect(NextResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.objectContaining({
            message: 'An unexpected error occurred',
            code: 'UNKNOWN_ERROR',
            statusCode: 500,
          }),
        }),
        { status: 500 }
      )
    })

    it('should handle null error', () => {
      const response = errorHandler(null)

      expect(logger.error).toHaveBeenCalled()
      expect(response.status).toBe(500)
    })

    it('should handle undefined error', () => {
      const response = errorHandler(undefined)

      expect(logger.error).toHaveBeenCalled()
      expect(response.status).toBe(500)
    })
  })

  describe('withErrorHandling', () => {
    it('should wrap successful function execution', async () => {
      const mockFn = jest.fn().mockResolvedValue({ success: true })
      const wrappedFn = withErrorHandling(mockFn)

      const result = await wrappedFn('arg1', 'arg2')

      expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2')
      expect(result).toEqual({ success: true })
    })

    it('should catch and handle errors', async () => {
      const error = new ValidationError('Invalid data')
      const mockFn = jest.fn().mockRejectedValue(error)
      const wrappedFn = withErrorHandling(mockFn)

      const result = await wrappedFn('test')

      expect(mockFn).toHaveBeenCalledWith('test')
      expect(logger.warn).toHaveBeenCalled()
      expect(result).toBeDefined()
      // Result should be a NextResponse with error
    })

    it('should preserve function arguments', async () => {
      const mockFn = jest.fn(async (a: number, b: string, c: boolean) => {
        return { a, b, c }
      })
      const wrappedFn = withErrorHandling(mockFn)

      await wrappedFn(123, 'test', true)

      expect(mockFn).toHaveBeenCalledWith(123, 'test', true)
    })
  })

  describe('assertExists', () => {
    it('should not throw when value exists', () => {
      const value = { id: '123', name: 'Test' }

      expect(() => {
        assertExists(value, 'Value not found')
      }).not.toThrow()
    })

    it('should throw NotFoundError when value is null', () => {
      const value = null

      expect(() => {
        assertExists(value, 'Resource not found', { id: '123' })
      }).toThrow(NotFoundError)

      try {
        assertExists(value, 'Resource not found', { id: '123' })
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundError)
        expect((error as NotFoundError).message).toBe('Resource not found')
        expect((error as NotFoundError).context).toEqual({ id: '123' })
      }
    })

    it('should throw NotFoundError when value is undefined', () => {
      const value = undefined

      expect(() => {
        assertExists(value, 'Value is undefined')
      }).toThrow(NotFoundError)
    })

    it('should work as type assertion', () => {
      let value: string | null = 'test'
      assertExists(value, 'Value not found')
      // TypeScript should now know value is string, not string | null
      const length: number = value.length // This should not cause TS error
      expect(length).toBe(4)
    })
  })

  describe('isOperationalError', () => {
    it('should return true for operational AppError', () => {
      const error = new ValidationError('Invalid input')

      expect(isOperationalError(error)).toBe(true)
    })

    it('should return false for non-operational AppError', () => {
      const error = new AppError('Programming error', 500, 'ERROR', false)

      expect(isOperationalError(error)).toBe(false)
    })

    it('should return false for native Error', () => {
      const error = new Error('Native error')

      expect(isOperationalError(error)).toBe(false)
    })

    it('should return false for non-error values', () => {
      expect(isOperationalError('string')).toBe(false)
      expect(isOperationalError(null)).toBe(false)
      expect(isOperationalError(undefined)).toBe(false)
      expect(isOperationalError(123)).toBe(false)
    })
  })

  describe('handleCriticalError', () => {
    let exitSpy: jest.SpyInstance
    let setTimeoutSpy: jest.SpyInstance

    beforeEach(() => {
      // Mock process.exit to prevent test from actually exiting
      exitSpy = jest.spyOn(process, 'exit').mockImplementation((() => {
        return undefined as never
      }) as any)
      setTimeoutSpy = jest.spyOn(global, 'setTimeout')
    })

    afterEach(() => {
      exitSpy.mockRestore()
      setTimeoutSpy.mockRestore()
    })

    it('should log fatal error and schedule exit', () => {
      const error = new Error('Critical failure')

      expect(() => {
        handleCriticalError(error)
      }).not.toThrow()

      expect(logger.fatal).toHaveBeenCalledWith(
        'Critical error - shutting down',
        error
      )
      expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 1000)
    })

    it('should handle non-Error types', () => {
      handleCriticalError('critical string error')

      expect(logger.fatal).toHaveBeenCalledWith(
        'Critical error - shutting down',
        expect.any(Error)
      )
    })

    it('should call process.exit after timeout', () => {
      jest.useFakeTimers()

      const error = new Error('Critical')
      handleCriticalError(error)

      expect(process.exit).not.toHaveBeenCalled()

      // Fast-forward time
      jest.advanceTimersByTime(1000)

      expect(process.exit).toHaveBeenCalledWith(1)

      jest.useRealTimers()
    })
  })

  describe('error inheritance chain', () => {
    it('should maintain proper inheritance for all error types', () => {
      const errors = [
        new ValidationError('test'),
        new AuthenticationError('test'),
        new AuthorizationError('test'),
        new NotFoundError('test'),
        new ConflictError('test'),
        new RateLimitError('test'),
        new ExternalAPIError('test'),
        new DatabaseError('test'),
      ]

      errors.forEach((error) => {
        expect(error).toBeInstanceOf(Error)
        expect(error).toBeInstanceOf(AppError)
        expect(error.name).toBeTruthy()
        expect(error.code).toBeTruthy()
        expect(error.statusCode).toBeGreaterThanOrEqual(400)
        expect(error.isOperational).toBe(true)
      })
    })
  })

  describe('error context handling', () => {
    it('should preserve complex context objects', () => {
      const context = {
        userId: 'user123',
        request: {
          method: 'POST',
          url: '/api/articles',
          body: { title: 'Test' },
        },
        metadata: {
          timestamp: new Date().toISOString(),
          trace: 'abc-123',
        },
      }

      const error = new ValidationError('Complex context test', context)

      expect(error.context).toEqual(context)
      const json = error.toJSON()
      expect(json.error.context).toEqual(context)
    })

    it('should handle undefined context gracefully', () => {
      const error = new NotFoundError('No context')

      expect(error.context).toBeUndefined()
      const json = error.toJSON()
      expect(json.error.context).toBeUndefined()
    })
  })
})
