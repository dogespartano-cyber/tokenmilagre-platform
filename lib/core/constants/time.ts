/**
 * Time Constants
 *
 * Centralized time intervals and durations in milliseconds
 */

export const TIME_MS = {
    /** 1 second in milliseconds */
    SECOND: 1000,

    /** 1 minute in milliseconds */
    MINUTE: 60 * 1000,

    /** 1 hour in milliseconds */
    HOUR: 60 * 60 * 1000,

    /** 1 day in milliseconds */
    DAY: 24 * 60 * 60 * 1000,

    /** 1 week in milliseconds */
    WEEK: 7 * 24 * 60 * 60 * 1000,

    /** 30 days in milliseconds */
    MONTH: 30 * 24 * 60 * 60 * 1000,
} as const;

export const CACHE_TTL = {
    /** Cache TTL for static data (1 hour) */
    STATIC: TIME_MS.HOUR,

    /** Cache TTL for dynamic data (5 minutes) */
    DYNAMIC: 5 * TIME_MS.MINUTE,

    /** Cache TTL for user sessions (7 days) */
    SESSION: 7 * TIME_MS.DAY,

    /** Cache TTL for API responses (10 minutes) */
    API_RESPONSE: 10 * TIME_MS.MINUTE,
} as const;

export const RATE_LIMIT = {
    /** Rate limit window (15 minutes) */
    WINDOW: 15 * TIME_MS.MINUTE,

    /** Max requests per window for authenticated users */
    AUTH_MAX_REQUESTS: 100,

    /** Max requests per window for unauthenticated users */
    ANON_MAX_REQUESTS: 20,
} as const;
