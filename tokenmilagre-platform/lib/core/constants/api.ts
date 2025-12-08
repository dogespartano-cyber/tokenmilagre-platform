/**
 * API Constants
 *
 * Centralized constants for API behavior and limits
 */

import { TIME_MS } from './time';

// ========================================
// RATE LIMITING
// ========================================
// Note: These values were migrated from root constants and may differ from strict core time constants.
// Maintaining backward compatibility.
export const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute window
export const RATE_LIMIT_MAX_REQUESTS = 100; // Max requests per window

// Core-aligned aliases (if needed in future)
export const API_CONFIG = {
    RATE_LIMIT: {
        WINDOW: TIME_MS.MINUTE,
        MAX: 100
    }
} as const;
