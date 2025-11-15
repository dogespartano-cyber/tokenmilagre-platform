/**
 * Application Constants
 * Centralized constants to avoid magic numbers and improve maintainability
 */

// ========================================
// SCROLL BEHAVIOR
// ========================================
export const SCROLL_TOP_THRESHOLD = 400; // px - Show "scroll to top" button after scrolling 400px

// ========================================
// UI LIMITS
// ========================================
export const MAX_VISIBLE_TAGS = 3; // Maximum tags shown per resource card
export const MAX_RELATED_RESOURCES = 3; // Maximum related resources displayed
export const MAX_VISIBLE_FAQ = 5; // Maximum FAQ items before "show more"

// ========================================
// PERFORMANCE
// ========================================
export const SEARCH_DEBOUNCE_MS = 500; // ms - Delay before executing search filter
export const SCROLL_THROTTLE_MS = 100; // ms - Throttle scroll event listener

// ========================================
// CACHE & REVALIDATION (ISR)
// ========================================
export const REVALIDATE_RESOURCES = 3600; // 1 hour - Resources change rarely
export const REVALIDATE_ARTICLES = 3600; // 1 hour - Educational content
export const REVALIDATE_NEWS = 300; // 5 minutes - News updates frequently

// ========================================
// PAGINATION
// ========================================
export const RESOURCES_PER_PAGE = 12; // Items per page (grid: 3 cols × 4 rows)
export const ARTICLES_PER_PAGE = 9; // Items per page (grid: 3 cols × 3 rows)

// ========================================
// API RATE LIMITING
// ========================================
export const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute window
export const RATE_LIMIT_MAX_REQUESTS = 100; // Max requests per window
