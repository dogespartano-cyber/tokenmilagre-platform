/**
 * Rate Limiting Middleware
 *
 * Implements rate limiting with role-based quotas to prevent API abuse.
 * Uses sliding window algorithm with in-memory store (upgradeable to Redis).
 *
 * @example
 * ```typescript
 * import { checkRateLimit } from '@/lib/shared/middleware/rate-limit'
 *
 * export async function GET(request: NextRequest) {
 *   const user = await authenticate(request)
 *   await checkRateLimit(request, user)
 *
 *   // Request is within rate limits
 *   const articleService = ServiceLocator.getArticle()
 *   const articles = await articleService.list({ page: 1, limit: 10 })
 *   return NextResponse.json(articles)
 * }
 * ```
 */

import { NextRequest } from 'next/server'
import { RateLimitError } from '@/lib/services/error-service'
import { ServiceLocator } from '@/lib/di/container'
import type { AuthUser, UserRole } from './auth'

/**
 * Rate limit configuration per role
 */
interface RateLimitConfig {
  /**
   * Maximum requests allowed in the time window
   */
  maxRequests: number

  /**
   * Time window in seconds
   */
  windowSeconds: number

  /**
   * Burst allowance (extra requests allowed in short bursts)
   */
  burstAllowance?: number
}

/**
 * Rate limit tracking entry
 */
interface RateLimitEntry {
  /**
   * Array of request timestamps in the current window
   */
  requests: number[]

  /**
   * Last request timestamp
   */
  lastRequest: number

  /**
   * Number of requests in current window
   */
  count: number
}

/**
 * In-memory rate limit store
 * Key: userId or IP address
 * Value: Rate limit tracking entry
 */
const rateLimitStore = new Map<string, RateLimitEntry>()

/**
 * Rate limit configurations by role
 * ADMIN > EDITOR > AUTHOR > READER
 */
const RATE_LIMITS: Record<UserRole, RateLimitConfig> = {
  ADMIN: {
    maxRequests: 1000,
    windowSeconds: 60, // 1000 requests per minute
    burstAllowance: 100,
  },
  EDITOR: {
    maxRequests: 500,
    windowSeconds: 60, // 500 requests per minute
    burstAllowance: 50,
  },
  AUTHOR: {
    maxRequests: 200,
    windowSeconds: 60, // 200 requests per minute
    burstAllowance: 20,
  },
  READER: {
    maxRequests: 100,
    windowSeconds: 60, // 100 requests per minute
    burstAllowance: 10,
  },
}

/**
 * Default rate limit for unauthenticated requests (by IP)
 */
const DEFAULT_RATE_LIMIT: RateLimitConfig = {
  maxRequests: 50,
  windowSeconds: 60, // 50 requests per minute
  burstAllowance: 5,
}

/**
 * Cleanup interval for removing old entries (5 minutes)
 */
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000

/**
 * Last cleanup timestamp
 */
let lastCleanup = Date.now()

/**
 * Checks rate limit for the request
 * Tracks by userId (authenticated) or IP (unauthenticated)
 *
 * @param request - Next.js request object
 * @param user - Authenticated user (optional)
 * @throws RateLimitError if rate limit exceeded
 */
export async function checkRateLimit(
  request: NextRequest,
  user?: AuthUser | null
): Promise<void> {
  const logger = ServiceLocator.getLogger()

  // Get identifier (userId or IP)
  const identifier = user?.id || getClientIP(request)
  const config = user ? RATE_LIMITS[user.role] : DEFAULT_RATE_LIMIT

  // Get or create rate limit entry
  let entry = rateLimitStore.get(identifier)
  const now = Date.now()

  if (!entry) {
    entry = {
      requests: [now],
      lastRequest: now,
      count: 1,
    }
    rateLimitStore.set(identifier, entry)
    return
  }

  // Remove requests outside the time window
  const windowStart = now - config.windowSeconds * 1000
  entry.requests = entry.requests.filter((timestamp) => timestamp > windowStart)

  // Add current request
  entry.requests.push(now)
  entry.lastRequest = now
  entry.count = entry.requests.length

  // Check if limit exceeded
  const maxAllowed = config.maxRequests + (config.burstAllowance || 0)
  if (entry.count > maxAllowed) {
    const retryAfter = Math.ceil(
      (entry.requests[0] + config.windowSeconds * 1000 - now) / 1000
    )

    logger.warn('Rate limit exceeded', {
      identifier,
      role: user?.role || 'UNAUTHENTICATED',
      count: entry.count,
      limit: maxAllowed,
      retryAfter,
    })

    throw new RateLimitError(
      'Limite de requisições excedido. Tente novamente mais tarde.',
      {
        limit: maxAllowed,
        remaining: 0,
        reset: entry.requests[0] + config.windowSeconds * 1000,
        retryAfter,
      }
    )
  }

  // Periodic cleanup of old entries
  if (now - lastCleanup > CLEANUP_INTERVAL_MS) {
    cleanupOldEntries(now)
    lastCleanup = now
  }

  logger.debug('Rate limit check passed', {
    identifier,
    role: user?.role || 'UNAUTHENTICATED',
    count: entry.count,
    limit: maxAllowed,
    remaining: maxAllowed - entry.count,
  })
}

/**
 * Gets rate limit info for the request
 * Useful for adding rate limit headers to response
 *
 * @param request - Next.js request object
 * @param user - Authenticated user (optional)
 * @returns Rate limit information
 */
export function getRateLimitInfo(
  request: NextRequest,
  user?: AuthUser | null
): {
  limit: number
  remaining: number
  reset: number
  retryAfter?: number
} {
  const identifier = user?.id || getClientIP(request)
  const config = user ? RATE_LIMITS[user.role] : DEFAULT_RATE_LIMIT
  const entry = rateLimitStore.get(identifier)

  const maxAllowed = config.maxRequests + (config.burstAllowance || 0)
  const now = Date.now()

  if (!entry) {
    return {
      limit: maxAllowed,
      remaining: maxAllowed,
      reset: now + config.windowSeconds * 1000,
    }
  }

  // Remove requests outside window
  const windowStart = now - config.windowSeconds * 1000
  const currentRequests = entry.requests.filter(
    (timestamp) => timestamp > windowStart
  )

  const remaining = Math.max(0, maxAllowed - currentRequests.length)
  const reset =
    currentRequests.length > 0
      ? currentRequests[0] + config.windowSeconds * 1000
      : now + config.windowSeconds * 1000

  return {
    limit: maxAllowed,
    remaining,
    reset,
    retryAfter: remaining === 0 ? Math.ceil((reset - now) / 1000) : undefined,
  }
}

/**
 * Extracts client IP from request
 * Checks common proxy headers first, falls back to socket
 *
 * @param request - Next.js request object
 * @returns Client IP address
 */
function getClientIP(request: NextRequest): string {
  // Check X-Forwarded-For header (most common)
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }

  // Check X-Real-IP header
  const realIP = request.headers.get('x-real-ip')
  if (realIP) {
    return realIP
  }

  // Check CF-Connecting-IP (Cloudflare)
  const cfIP = request.headers.get('cf-connecting-ip')
  if (cfIP) {
    return cfIP
  }

  // Fallback to unknown
  return 'unknown'
}

/**
 * Removes old entries from rate limit store
 * Keeps store size manageable
 *
 * @param now - Current timestamp
 */
function cleanupOldEntries(now: number): void {
  const logger = ServiceLocator.getLogger()
  let removed = 0

  // Remove entries with no recent requests (older than 10 minutes)
  const cutoff = now - 10 * 60 * 1000

  for (const [identifier, entry] of rateLimitStore.entries()) {
    if (entry.lastRequest < cutoff) {
      rateLimitStore.delete(identifier)
      removed++
    }
  }

  if (removed > 0) {
    logger.debug('Rate limit store cleanup completed', {
      removed,
      remaining: rateLimitStore.size,
    })
  }
}

/**
 * Resets rate limit for a specific identifier
 * Useful for testing or manual overrides
 *
 * @param identifier - User ID or IP address
 */
export function resetRateLimit(identifier: string): void {
  rateLimitStore.delete(identifier)
  const logger = ServiceLocator.getLogger()
  logger.info('Rate limit reset', { identifier })
}

/**
 * Gets current rate limit store statistics
 * Useful for monitoring
 *
 * @returns Rate limit store statistics
 */
export function getRateLimitStats(): {
  totalEntries: number
  totalRequests: number
} {
  let totalRequests = 0

  for (const entry of rateLimitStore.values()) {
    totalRequests += entry.count
  }

  return {
    totalEntries: rateLimitStore.size,
    totalRequests,
  }
}

/**
 * Clears entire rate limit store
 * Useful for testing
 */
export function clearRateLimitStore(): void {
  rateLimitStore.clear()
  const logger = ServiceLocator.getLogger()
  logger.info('Rate limit store cleared')
}
