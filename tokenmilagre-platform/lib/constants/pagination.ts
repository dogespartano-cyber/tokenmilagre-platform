/**
 * Pagination Constants
 *
 * Centralized pagination configuration for consistent behavior across the platform
 */

export const PAGINATION = {
  /** Default page number when not specified */
  DEFAULT_PAGE: 1,

  /** Default number of items per page */
  DEFAULT_LIMIT: 12,

  /** Maximum items per page (security limit) */
  MAX_LIMIT: 100,

  /** Minimum items per page */
  MIN_LIMIT: 1,

  /** Default limit for infinite scroll/cursor pagination */
  INFINITE_SCROLL_LIMIT: 20,
} as const;

export const ARTICLE_LIMITS = {
  /** Limit for article listing in news page */
  NEWS_PAGE: 12,

  /** Limit for educational articles */
  EDUCATION_PAGE: 12,

  /** Limit for related articles sidebar */
  RELATED_ARTICLES: 4,

  /** Limit for article search results */
  SEARCH_RESULTS: 20,

  /** Limit for admin article management */
  ADMIN_LIST: 50,
} as const;
