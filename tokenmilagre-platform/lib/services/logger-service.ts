/**
 * LoggerService - Logging estruturado com Pino
 *
 * Features:
 * - Logs estruturados em JSON
 * - Níveis: debug, info, warn, error, fatal
 * - Context enrichment (userId, requestId, etc)
 * - Integration com Sentry para erros
 * - Pretty print em desenvolvimento
 * - Redação de campos sensíveis
 *
 * Usage:
 * ```typescript
 * import { logger } from '@/lib/services/logger-service'
 *
 * logger.info('User logged in', { userId: '123' })
 * logger.error('Failed to process', new Error('...'), { context: '...' })
 * ```
 */

import pino from 'pino'
import * as Sentry from '@sentry/nextjs'

// ============================================================================
// Types
// ============================================================================

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal'
}

export interface LogContext {
  userId?: string
  requestId?: string
  sessionId?: string
  articleId?: string
  batchId?: string
  ip?: string
  userAgent?: string
  method?: string
  url?: string
  statusCode?: number
  duration?: number
  [key: string]: any
}

export interface LoggerOptions {
  level?: LogLevel
  prettyPrint?: boolean
  redact?: string[]
}

// ============================================================================
// Logger Service
// ============================================================================

export class LoggerService {
  private logger: pino.Logger
  private context: LogContext = {}
  private readonly isDev: boolean
  private readonly isProd: boolean

  constructor(options: LoggerOptions = {}) {
    this.isDev = process.env.NODE_ENV === 'development'
    this.isProd = process.env.NODE_ENV === 'production'

    // Determine log level
    const level = options.level || (this.isDev ? LogLevel.DEBUG : LogLevel.INFO)

    // Pino configuration
    const pinoConfig: pino.LoggerOptions = {
      level,

      // Formatters
      formatters: {
        level: (label) => ({ level: label }),
      },

      // Redact sensitive fields
      redact: options.redact || [
        'password',
        'token',
        'authorization',
        'apiKey',
        'secret',
        'cookie',
        'session',
      ],

      // Base metadata
      base: {
        env: process.env.NODE_ENV,
        pid: process.pid,
      },

      // Timestamp
      timestamp: pino.stdTimeFunctions.isoTime,
    }

    // Pretty print in development if enabled
    if (this.isDev && options.prettyPrint !== false) {
      this.logger = pino({
        ...pinoConfig,
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
            singleLine: false,
          },
        },
      })
    } else {
      this.logger = pino(pinoConfig)
    }
  }

  /**
   * Set persistent context for all subsequent logs
   */
  setContext(context: LogContext): void {
    this.context = { ...this.context, ...context }
  }

  /**
   * Clear all context
   */
  clearContext(): void {
    this.context = {}
  }

  /**
   * Get current context
   */
  getContext(): LogContext {
    return { ...this.context }
  }

  /**
   * Create child logger with additional context
   */
  child(context: LogContext): LoggerService {
    const child = new LoggerService({
      level: this.logger.level as LogLevel,
      prettyPrint: this.isDev,
    })
    child.context = { ...this.context, ...context }
    child.logger = this.logger.child(child.context)
    return child
  }

  /**
   * DEBUG level - detailed information for debugging
   */
  debug(message: string, meta?: object): void {
    this.logger.debug({ ...this.context, ...meta }, message)
  }

  /**
   * INFO level - general informational messages
   */
  info(message: string, meta?: object): void {
    this.logger.info({ ...this.context, ...meta }, message)
  }

  /**
   * WARN level - warning messages
   */
  warn(message: string, meta?: object): void {
    this.logger.warn({ ...this.context, ...meta }, message)
  }

  /**
   * ERROR level - error messages (also sends to Sentry in production)
   */
  error(message: string, error?: Error, meta?: object): void {
    const logData = {
      ...this.context,
      ...meta,
      error: error ? this.serializeError(error) : undefined,
    }

    this.logger.error(logData, message)

    // Send to Sentry in production
    if (this.isProd && error) {
      this.sendToSentry(error, message, meta)
    }
  }

  /**
   * FATAL level - critical errors (always sends to Sentry)
   */
  fatal(message: string, error: Error, meta?: object): void {
    const logData = {
      ...this.context,
      ...meta,
      error: this.serializeError(error),
    }

    this.logger.fatal(logData, message)

    // Always send fatal errors to Sentry
    this.sendToSentry(error, message, meta, 'fatal')
  }

  /**
   * Log HTTP request
   */
  logRequest(method: string, url: string, meta?: object): void {
    this.info('HTTP Request', {
      method,
      url,
      ...meta,
    })
  }

  /**
   * Log HTTP response
   */
  logResponse(statusCode: number, duration: number, meta?: object): void {
    const level = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info'

    this[level]('HTTP Response', {
      statusCode,
      duration,
      ...meta,
    })
  }

  /**
   * Log user action
   */
  logAction(action: string, userId: string, meta?: object): void {
    this.info('User Action', {
      action,
      userId,
      ...meta,
    })
  }

  /**
   * Log performance metric
   */
  logMetric(metric: string, value: number, unit: string, meta?: object): void {
    this.info('Performance Metric', {
      metric,
      value,
      unit,
      ...meta,
    })
  }

  /**
   * Log database query
   */
  logQuery(query: string, duration: number, meta?: object): void {
    const level = duration > 1000 ? 'warn' : 'debug'

    this[level]('Database Query', {
      query,
      duration,
      slow: duration > 1000,
      ...meta,
    })
  }

  // ============================================================================
  // Private Methods
  // ============================================================================

  /**
   * Serialize error for logging
   */
  private serializeError(error: Error): object {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
      cause: error.cause,
    }
  }

  /**
   * Send error to Sentry
   */
  private sendToSentry(
    error: Error,
    message: string,
    meta?: object,
    level: 'error' | 'fatal' = 'error'
  ): void {
    Sentry.withScope((scope) => {
      // Set level
      scope.setLevel(level)

      // Add context as tags
      Object.entries(this.context).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          scope.setTag(key, String(value))
        }
      })

      // Add metadata as extra context
      if (meta) {
        scope.setContext('metadata', meta)
      }

      // Add message as extra
      scope.setExtra('logMessage', message)

      // Capture exception
      Sentry.captureException(error)
    })
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

export const logger = new LoggerService({
  prettyPrint: process.env.NODE_ENV === 'development',
})

// ============================================================================
// Helper: Measure execution time
// ============================================================================

export async function measureTime<T>(
  fn: () => Promise<T>,
  label: string,
  meta?: object
): Promise<T> {
  const startTime = Date.now()

  try {
    const result = await fn()
    const duration = Date.now() - startTime

    logger.logMetric(label, duration, 'ms', meta)

    return result
  } catch (error) {
    const duration = Date.now() - startTime

    logger.error(`${label} failed`, error as Error, {
      duration,
      ...meta,
    })

    throw error
  }
}
