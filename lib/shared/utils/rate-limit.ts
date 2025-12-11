/**
 * Simple In-Memory Rate Limiting Utility
 *
 * Provides basic rate limiting functionality using in-memory storage.
 * For production environments, consider using Redis-based rate limiting.
 *
 * @example
 * ```typescript
 * import { checkRateLimit } from '@/lib/shared/utils/rate-limit'
 *
 * if (!checkRateLimit(userId, 10, 60000)) {
 *   throw new Error('Rate limit exceeded')
 * }
 * ```
 */

interface RateLimitEntry {
  count: number
  resetTime: number
}

// In-memory storage (resets on server restart)
const rateLimitMap = new Map<string, RateLimitEntry>()

/**
 * Check if user has exceeded rate limit
 *
 * @param identifier - Unique identifier (userId, IP, etc)
 * @param limit - Maximum requests allowed in window
 * @param windowMs - Time window in milliseconds (default: 60000 = 1 minute)
 * @returns true if request is allowed, false if rate limit exceeded
 */
export function checkRateLimit(
  identifier: string,
  limit: number = 10,
  windowMs: number = 60 * 1000
): boolean {
  const now = Date.now()
  const userLimit = rateLimitMap.get(identifier)

  // First request or window expired - allow and create new entry
  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    })
    return true
  }

  // Limit exceeded
  if (userLimit.count >= limit) {
    return false
  }

  // Increment count and allow
  userLimit.count++
  return true
}

/**
 * Reset rate limit for specific identifier
 *
 * @param identifier - Unique identifier to reset
 */
export function resetRateLimit(identifier: string): void {
  rateLimitMap.delete(identifier)
}

/**
 * Clear all rate limit entries (useful for testing)
 */
export function clearAllRateLimits(): void {
  rateLimitMap.clear()
}

/**
 * Get current rate limit status for identifier
 *
 * @param identifier - Unique identifier to check
 * @returns Current count and reset time, or null if no limit set
 */
export function getRateLimitStatus(identifier: string): RateLimitEntry | null {
  return rateLimitMap.get(identifier) || null
}
