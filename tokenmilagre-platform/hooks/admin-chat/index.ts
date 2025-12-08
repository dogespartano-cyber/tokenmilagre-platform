/**
 * 🔄 Re-export for backward compatibility
 * 
 * @deprecated Import from '@/lib/domains/admin-chat' instead
 * 
 * This file re-exports admin-chat from the new domain location
 * to maintain compatibility with existing imports.
 */

// Hook principal
export { useAdminChat } from '@/lib/domains/admin-chat';

// Tipos públicos
export type {
    ChatMessage,
    UseAdminChatOptions,
    UseAdminChatReturn,
    ApiArticle,
    CanvasArticle
} from '@/lib/domains/admin-chat';

// Utilitários que podem ser úteis externamente
export {
    createUserMessage,
    createAssistantMessage
} from '@/lib/domains/admin-chat';
