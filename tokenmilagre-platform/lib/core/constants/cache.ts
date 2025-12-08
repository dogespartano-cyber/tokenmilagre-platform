/**
 * Cache Constants (ISR)
 *
 * Centralized constants for Next.js Revalidation (Seconds)
 * NOT to be confused with TIME_MS (Milliseconds)
 */

// ========================================
// REVALIDATION (seconds)
// ========================================
export const REVALIDATE_RESOURCES = 3600; // 1 hour - Resources change rarely
export const REVALIDATE_ARTICLES = 3600; // 1 hour - Educational content
export const REVALIDATE_NEWS = 300; // 5 minutes - News updates frequently

export const CACHE_TAGS = {
    RESOURCES: 'resources',
    ARTICLES: 'articles',
    NEWS: 'news',
} as const;
