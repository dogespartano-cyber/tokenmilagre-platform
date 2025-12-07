/**
 * Admin Chat Module
 * Re-exports públicos seguindo estrutura fractal
 * 
 * @agi-module: admin-chat
 * @agi-pattern: fractal
 */

// Hook principal
export { useAdminChat } from './useAdminChat';

// Tipos públicos
export type {
    ChatMessage,
    UseAdminChatOptions,
    UseAdminChatReturn,
    ApiArticle,
    CanvasArticle
} from './types';

// Utilitários que podem ser úteis externamente
export {
    createUserMessage,
    createAssistantMessage
} from './utils';
