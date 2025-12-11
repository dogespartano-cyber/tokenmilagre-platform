/**
 * 🌀 Admin Chat Domain - Types
 * 
 * @agi-domain: admin-chat
 * @agi-pattern: fractal auto-similar
 * 
 * Tipos e interfaces compartilhadas para o sistema de Admin Chat.
 */

// Extensões de Window para dados temporários do chat
declare global {
    interface Window {
        __pendingEdit?: { instruction?: string; articles: ApiArticle[] };
        __pendingDelete?: string;
    }
}

/**
 * Artigo retornado pela API
 */
export interface ApiArticle {
    id: string;
    slug: string;
    title: string;
    summary?: string;
    content?: string;
    category?: string;
    publishedAt: string;
    sentiment?: 'positive' | 'neutral' | 'negative';
    level?: string;
    keywords?: string[];
}

/**
 * Artigo no Canvas de edição
 */
export interface CanvasArticle {
    slug: string;
    title: string;
    content: string;
    summary?: string;
    category?: string;
    tags?: string[];
}

/**
 * Mensagem do chat
 */
export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    metadata?: {
        canvasArticle?: CanvasArticle;
        instruction?: string;
    };
}

/**
 * Opções do hook useAdminChat
 */
export interface UseAdminChatOptions {
    pageData?: Record<string, unknown>;
    model?: 'sonar' | 'sonar-pro';
    provider?: 'perplexity' | 'gemini';
    onApply?: (suggestion: string) => void;
    maxMessages?: number;
    selectedText?: string;
}

/**
 * Retorno do hook useAdminChat
 */
export interface UseAdminChatReturn {
    messages: ChatMessage[];
    loading: boolean;
    error: string | null;
    sendMessage: (content: string) => Promise<void>;
    clearHistory: () => void;
    exportHistory: () => void;
}

/**
 * Ações suportadas pelo Admin Chat
 */
export type ChatAction =
    | 'generate-article-request'
    | 'publish-article'
    | 'list-articles'
    | 'search-articles'
    | 'delete-article'
    | 'show-stats'
    | 'edit-article'
    | 'confirm-delete';

/**
 * Resposta da API com ação especial
 */
export interface ChatActionResponse {
    action: ChatAction;
    data: Record<string, unknown>;
}

/**
 * Resposta direta (sem ação)
 */
export interface ChatDirectResponse {
    isDirectResponse: true;
    content: string;
}

/**
 * Resposta do Gemini
 */
export interface GeminiResponse {
    success: boolean;
    message?: string;
    error?: string;
}
