/**
 * Admin Chat Utilities
 * Funções utilitárias para o sistema de Admin Chat
 * 
 * @agi-module: admin-chat/utils
 */

import type { ChatMessage } from './types';

export const STORAGE_KEY = 'admin-chat-history';
export const MAX_MESSAGES = 50;

/**
 * Helper para extrair mensagem de erro de forma type-safe
 */
export function getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    return String(error);
}

/**
 * Cria uma mensagem do usuário
 */
export function createUserMessage(content: string): ChatMessage {
    return {
        id: `user-${Date.now()}`,
        role: 'user',
        content: content.trim(),
        timestamp: new Date()
    };
}

/**
 * Cria uma mensagem do assistente
 */
export function createAssistantMessage(
    content: string,
    metadata?: ChatMessage['metadata']
): ChatMessage {
    return {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content,
        timestamp: new Date(),
        metadata
    };
}

/**
 * Carrega histórico do localStorage
 */
export function loadHistory(): ChatMessage[] {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved) as Array<Omit<ChatMessage, 'timestamp'> & { timestamp: string }>;
            return parsed.map(msg => ({
                ...msg,
                timestamp: new Date(msg.timestamp)
            }));
        }
    } catch (err) {
        console.error('Erro ao carregar histórico:', err);
    }
    return [];
}

/**
 * Salva histórico no localStorage
 */
export function saveHistory(messages: ChatMessage[]): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (err) {
        console.error('Erro ao salvar histórico:', err);
    }
}

/**
 * Limpa histórico do localStorage
 */
export function clearStoredHistory(): void {
    localStorage.removeItem(STORAGE_KEY);
}

/**
 * Exporta histórico como arquivo JSON
 */
export function exportHistoryAsFile(messages: ChatMessage[]): void {
    const dataStr = JSON.stringify(messages, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `chat-history-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
}
