/**
 * Validation Constants
 *
 * Centralized validation rules and constraints
 */

export const PASSWORD_CONSTRAINTS = {
    /** Minimum password length */
    MIN_LENGTH: 6,

    /** Maximum password length */
    MAX_LENGTH: 128,

    /** Regex for password validation (at least one letter and one number) */
    PATTERN: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/,
} as const;

export const EMAIL_CONSTRAINTS = {
    /** Email validation regex */
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

    /** Maximum email length */
    MAX_LENGTH: 255,
} as const;

export const SLUG_CONSTRAINTS = {
    /** Slug validation regex (lowercase, numbers, hyphens) */
    PATTERN: /^[a-z0-9-]+$/,

    /** Minimum slug length */
    MIN_LENGTH: 3,

    /** Maximum slug length */
    MAX_LENGTH: 200,
} as const;

export const ARTICLE_CONSTRAINTS = {
    /** Title constraints */
    TITLE: {
        MIN_LENGTH: 10,
        MAX_LENGTH: 200,
    },

    /** Excerpt constraints */
    EXCERPT: {
        MIN_LENGTH: 50,
        MAX_LENGTH: 500,
    },

    /** Content constraints */
    CONTENT: {
        MIN_LENGTH: 100,
        MAX_LENGTH: 50000,
    },

    /** Tags constraints */
    TAGS: {
        MIN_COUNT: 1,
        MAX_COUNT: 10,
        MAX_TAG_LENGTH: 50,
    },
} as const;

export const USER_CONSTRAINTS = {
    /** Name constraints */
    NAME: {
        MIN_LENGTH: 2,
        MAX_LENGTH: 100,
    },
} as const;
