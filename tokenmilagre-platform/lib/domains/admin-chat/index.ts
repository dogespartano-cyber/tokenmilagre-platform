/**
 * 🌀 Admin Chat Domain - Public API
 * 
 * @agi-domain: admin-chat
 * @agi-pattern: fractal auto-similar
 * @agi-entry-point: true
 * 
 * This is the public entry point for the admin-chat domain.
 * All exports from this module are considered part of the public API.
 * 
 * Usage:
 * ```typescript
 * import { useAdminChat } from '@/lib/domains/admin-chat'
 * ```
 */

// ============================================
// HOOK (Public)
// ============================================
export { useAdminChat } from './useAdminChat';

// ============================================
// TYPES (Public)
// ============================================
export type {
    ChatMessage,
    UseAdminChatOptions,
    UseAdminChatReturn,
    ApiArticle,
    CanvasArticle,
    ChatAction,
    ChatActionResponse,
    ChatDirectResponse,
    GeminiResponse,
} from './types';

// ============================================
// UTILITIES (Public)
// ============================================
export {
    createUserMessage,
    createAssistantMessage,
} from './utils';

// ============================================
// API FUNCTIONS (Public)
// For external use when needed
// ============================================
export {
    fetchArticles,
    fetchArticleBySlug,
    generateArticle,
    deleteArticle,
    applyGeminiEdit,
} from './api';
