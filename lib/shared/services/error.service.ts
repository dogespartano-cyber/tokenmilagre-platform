/**
 * ErrorService - Centralized Error Handling System
 *
 * Provides a hierarchical custom error system with:
 * - Type-safe error classes for different scenarios
 * - Automatic logging integration
 * - Sentry integration with context
 * - HTTP status code mapping
 * - Error serialization for APIs
 * - Operational vs programming error distinction
 *
 * @example
 * ```typescript
 * import { ValidationError, NotFoundError, errorHandler } from '@/lib/services/error-service'
 *
 * // Throw specific errors
 * throw new ValidationError('Invalid email format', { field: 'email' })
 * throw new NotFoundError('Article not found', { articleId: '123' })
 *
 * // Use in API routes
 * export async function GET(request: Request) {
 *   try {
 *     // ... logic
 *   } catch (error) {
 *     return errorHandler(error)
 *   }
 * }
 * ```
 */

import { NextResponse } from 'next/server'
import { logger } from './logger.service'

/**
 * Base error class for all application errors
 * Extends native Error with additional context and metadata
 */
export class AppError extends Error {
  /** HTTP status code associated with this error */
  public readonly statusCode: number

  /** Machine-readable error code for client handling */
  public readonly code: string

  /** Whether this is an operational error (expected) or programming error (bug) */
  public readonly isOperational: boolean

  /** Additional context/metadata for debugging */
  public readonly context?: Record<string, unknown>

  /** Timestamp when error occurred */
  public readonly timestamp: Date

  /**
   * Creates a new AppError instance
   *
   * @param message - Human-readable error message
   * @param statusCode - HTTP status code (default: 500)
   * @param code - Machine-readable error code
   * @param isOperational - Whether error is operational (default: true)
   * @param context - Additional context for debugging
   */
  constructor(
    message: string,
    statusCode: number = 500,
    code: string = 'INTERNAL_ERROR',
    isOperational: boolean = true,
    context?: Record<string, unknown>
  ) {
    super(message)

    // Maintains proper stack trace for where error was thrown (V8 only)
    Error.captureStackTrace(this, this.constructor)

    this.name = this.constructor.name
    this.statusCode = statusCode
    this.code = code
    this.isOperational = isOperational
    this.context = context
    this.timestamp = new Date()

    // Ensure instanceof works correctly
    Object.setPrototypeOf(this, new.target.prototype)
  }

  /**
   * Serializes error to JSON for API responses
   * Excludes sensitive information in production
   *
   * @returns Serialized error object
   */
  toJSON(): Record<string, unknown> {
    const isProd = process.env.NODE_ENV === 'production'

    return {
      error: {
        message: this.message,
        code: this.code,
        statusCode: this.statusCode,
        timestamp: this.timestamp.toISOString(),
        ...(this.context && { context: this.context }),
        // Only include stack trace in non-production
        ...(!isProd && { stack: this.stack }),
      },
    }
  }
}

/**
 * Validation Error (400 Bad Request)
 * Used when request data fails validation
 *
 * @example
 * ```typescript
 * throw new ValidationError('Email is required', { field: 'email', value: '' })
 * ```
 */
export class ValidationError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 400, 'VALIDATION_ERROR', true, context)
  }
}

/**
 * Authentication Error (401 Unauthorized)
 * Used when user is not authenticated
 *
 * @example
 * ```typescript
 * throw new AuthenticationError('Token expired')
 * ```
 */
export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required', context?: Record<string, unknown>) {
    super(message, 401, 'AUTHENTICATION_ERROR', true, context)
  }
}

/**
 * Authorization Error (403 Forbidden)
 * Used when user lacks necessary permissions
 *
 * @example
 * ```typescript
 * throw new AuthorizationError('Only admins can delete articles', { userId, role: 'USER' })
 * ```
 */
export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions', context?: Record<string, unknown>) {
    super(message, 403, 'AUTHORIZATION_ERROR', true, context)
  }
}

/**
 * Not Found Error (404 Not Found)
 * Used when requested resource doesn't exist
 *
 * @example
 * ```typescript
 * throw new NotFoundError('Article not found', { articleId: '123' })
 * ```
 */
export class NotFoundError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 404, 'NOT_FOUND', true, context)
  }
}

/**
 * Conflict Error (409 Conflict)
 * Used when request conflicts with current state
 *
 * @example
 * ```typescript
 * throw new ConflictError('Article slug already exists', { slug: 'bitcoin-news' })
 * ```
 */
export class ConflictError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 409, 'CONFLICT', true, context)
  }
}

/**
 * Rate Limit Error (429 Too Many Requests)
 * Used when rate limit is exceeded
 *
 * @example
 * ```typescript
 * throw new RateLimitError('Too many requests', { limit: 100, window: '1m' })
 * ```
 */
export class RateLimitError extends AppError {
  constructor(
    message: string = 'Too many requests',
    context?: Record<string, unknown>
  ) {
    super(message, 429, 'RATE_LIMIT_EXCEEDED', true, context)
  }
}

/**
 * External API Error (502 Bad Gateway)
 * Used when external service (Perplexity, OpenAI) fails
 *
 * @example
 * ```typescript
 * throw new ExternalAPIError('Perplexity API timeout', {
 *   service: 'perplexity',
 *   endpoint: '/chat/completions',
 *   timeout: 30000
 * })
 * ```
 */
export class ExternalAPIError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 502, 'EXTERNAL_API_ERROR', true, context)
  }
}

/**
 * Database Error (500 Internal Server Error)
 * Used for database operation failures
 *
 * @example
 * ```typescript
 * throw new DatabaseError('Failed to insert article', {
 *   operation: 'insert',
 *   table: 'Article'
 * })
 * ```
 */
export class DatabaseError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 500, 'DATABASE_ERROR', true, context)
  }
}

/**
 * Error handler middleware for Next.js API routes
 * Logs error, sends to Sentry if necessary, and returns appropriate response
 *
 * @param error - Error to handle
 * @returns NextResponse with error details
 *
 * @example
 * ```typescript
 * export async function POST(request: Request) {
 *   try {
 *     const data = await request.json()
 *     // ... business logic
 *     return NextResponse.json({ success: true })
 *   } catch (error) {
 *     return errorHandler(error)
 *   }
 * }
 * ```
 */
export function errorHandler(error: unknown): NextResponse {
  // Handle known AppError instances
  if (error instanceof AppError) {
    // Log based on severity
    if (error.statusCode >= 500) {
      logger.error(error.message, error, error.context)
    } else if (error.statusCode >= 400) {
      logger.warn(error.message, { ...error.context, code: error.code })
    }

    return NextResponse.json(error.toJSON(), { status: error.statusCode })
  }

  // Handle native Error instances
  if (error instanceof Error) {
    logger.error('Unhandled error', error, {
      name: error.name,
      isOperational: false,
    })

    const isDev = process.env.NODE_ENV === 'development'

    return NextResponse.json(
      {
        error: {
          message: isDev ? error.message : 'Internal server error',
          code: 'INTERNAL_ERROR',
          statusCode: 500,
          timestamp: new Date().toISOString(),
          ...(isDev && { stack: error.stack }),
        },
      },
      { status: 500 }
    )
  }

  // Handle unknown error types
  logger.error('Unknown error type', new Error(String(error)), {
    errorType: typeof error,
    isOperational: false,
  })

  return NextResponse.json(
    {
      error: {
        message: 'An unexpected error occurred',
        code: 'UNKNOWN_ERROR',
        statusCode: 500,
        timestamp: new Date().toISOString(),
      },
    },
    { status: 500 }
  )
}

/**
 * Wraps an async function with error handling
 * Useful for creating safe versions of functions that might throw
 *
 * @param fn - Async function to wrap
 * @returns Wrapped function that catches and handles errors
 *
 * @example
 * ```typescript
 * const safeCreateArticle = withErrorHandling(async (data) => {
 *   // ... article creation logic
 *   return article
 * })
 *
 * const result = await safeCreateArticle(articleData)
 * ```
 */
export function withErrorHandling<T extends (...args: any[]) => Promise<any>>(
  fn: T
): (...args: Parameters<T>) => Promise<ReturnType<T> | NextResponse> {
  return async (...args: Parameters<T>) => {
    try {
      return await fn(...args)
    } catch (error) {
      return errorHandler(error)
    }
  }
}

/**
 * Validates that a value is not null or undefined
 * Throws NotFoundError if validation fails
 *
 * @param value - Value to check
 * @param message - Error message
 * @param context - Additional context
 * @returns The value if it exists
 *
 * @example
 * ```typescript
 * const article = await prisma.article.findUnique({ where: { id } })
 * assertExists(article, 'Article not found', { articleId: id })
 * // TypeScript now knows article is not null
 * ```
 */
export function assertExists<T>(
  value: T | null | undefined,
  message: string,
  context?: Record<string, unknown>
): asserts value is T {
  if (value === null || value === undefined) {
    throw new NotFoundError(message, context)
  }
}

/**
 * Type guard to check if error is operational
 *
 * @param error - Error to check
 * @returns True if error is operational
 *
 * @example
 * ```typescript
 * if (isOperationalError(error)) {
 *   // Handle expected error
 * } else {
 *   // This is a programming error - needs investigation
 *   logger.fatal('Programming error detected', error)
 * }
 * ```
 */
export function isOperationalError(error: unknown): boolean {
  if (error instanceof AppError) {
    return error.isOperational
  }
  return false
}

/**
 * Gracefully handles process termination on critical errors
 * Should only be used in server context for unrecoverable errors
 *
 * @param error - Critical error
 *
 * @example
 * ```typescript
 * process.on('unhandledRejection', (error) => {
 *   logger.fatal('Unhandled rejection', error as Error)
 *   handleCriticalError(error)
 * })
 * ```
 */
export function handleCriticalError(error: unknown): void {
  logger.fatal('Critical error - shutting down', error instanceof Error ? error : new Error(String(error)))

  // Give logger time to flush
  setTimeout(() => {
    process.exit(1)
  }, 1000)
}
