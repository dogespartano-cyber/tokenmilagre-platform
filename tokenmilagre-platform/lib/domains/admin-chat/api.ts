/**
 * 🌀 Admin Chat Domain - API
 * 
 * @agi-domain: admin-chat
 * @agi-pattern: fractal auto-similar
 * 
 * Funções para comunicação com APIs do Admin Chat.
 */

import type { UseAdminChatOptions } from './types';

interface APIRequestConfig {
    messages: Array<{ role: string; content: string }>;
    pathname: string;
    pageData?: Record<string, unknown>;
    model: string;
    provider: 'perplexity' | 'gemini';
    selectedText?: string;
    signal?: AbortSignal;
}

/**
 * Envia mensagem para a API apropriada (Perplexity ou Gemini)
 */
export async function sendChatRequest(config: APIRequestConfig): Promise<Response> {
    const { messages, pathname, pageData, model, provider, selectedText, signal } = config;

    // Limitar número de mensagens enviadas (economizar tokens)
    const limitedMessages = messages.slice(-10);

    // Escolher endpoint baseado no provider
    const apiEndpoint = provider === 'gemini' ? '/api/editor-chat' : '/api/admin-chat';

    // Determinar modo de edição
    const editMode = selectedText ? 'selection' : 'full';

    const requestBody = provider === 'gemini'
        ? {
            messages: limitedMessages,
            selectedText,
            fullContent: pageData?.content,
            editMode
        }
        : {
            messages: limitedMessages,
            pathname,
            pageData,
            model
        };

    console.log(`🎯 [AdminChat API] Usando ${provider === 'gemini' ? 'Gemini 2.5 Pro' : 'Perplexity Sonar'} | Modo: ${editMode}`);

    return fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
        signal
    });
}

/**
 * Busca artigos da API
 */
export async function fetchArticles(params: {
    query?: string;
    limit?: number
}): Promise<{ success: boolean; data?: unknown[]; pagination?: { total: number }; error?: string }> {
    const { query, limit = 10 } = params;
    const url = query
        ? `/api/articles?query=${encodeURIComponent(query)}&limit=${limit}`
        : `/api/articles?limit=${limit}`;

    const response = await fetch(url);
    return response.json();
}

/**
 * Busca artigo por slug
 */
export async function fetchArticleBySlug(slug: string): Promise<{ success: boolean; data?: unknown; error?: string }> {
    const response = await fetch(`/api/articles/${slug}`);
    return response.json();
}

/**
 * Gera artigo via API
 */
export async function generateArticle(data: Record<string, unknown>): Promise<{
    success: boolean;
    data?: { title: string; category: string; tags: string[] };
    validation?: { score: number };
    error?: string;
    debug?: string;
}> {
    const response = await fetch('/api/generate-article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return response.json();
}

/**
 * Deleta artigo via API
 */
export async function deleteArticle(slug: string): Promise<{ success: boolean; error?: string }> {
    const response = await fetch(`/api/articles/${slug}`, {
        method: 'DELETE'
    });
    return response.json();
}

/**
 * Aplica edição via Gemini
 */
export async function applyGeminiEdit(params: {
    content: string;
    instruction: string;
    selectedText?: string;
}): Promise<{ success: boolean; editedContent?: string; error?: string }> {
    const response = await fetch('/api/editor-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            messages: [{ role: 'user', content: params.instruction }],
            selectedText: params.selectedText,
            fullContent: params.content,
            editMode: params.selectedText ? 'selection' : 'full'
        })
    });
    return response.json();
}
