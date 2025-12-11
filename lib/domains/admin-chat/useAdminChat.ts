/**
 * 🌀 Admin Chat Domain - useAdminChat Hook
 * 
 * @agi-domain: admin-chat
 * @agi-pattern: fractal auto-similar
 * @agi-note: Refatorado de 1018 linhas para ~250 linhas
 *            Lógica delegada para handlers especializados
 * 
 * Hook orquestrador para gerenciar Admin Chat.
 */

'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

import type {
    ApiArticle,
    CanvasArticle,
    ChatMessage,
    UseAdminChatOptions,
    UseAdminChatReturn
} from './types';

import {
    MAX_MESSAGES,
    loadHistory,
    saveHistory,
    clearStoredHistory,
    exportHistoryAsFile,
    createUserMessage,
    createAssistantMessage,
    getErrorMessage
} from './utils';

import { sendChatRequest } from './api';

import {
    handleGenerateArticle,
    handleListArticles,
    handleSearchArticles,
    handleShowStats,
    handlePublishArticle,
    handleEditArticle,
    handleConfirmDelete,
    handleExecuteDelete
} from './handlers';

/**
 * Hook customizado para gerenciar Admin Chat
 * Versão refatorada com separação de responsabilidades
 */
export function useAdminChat(options: UseAdminChatOptions = {}): UseAdminChatReturn {
    const {
        pageData,
        model = 'sonar',
        provider = 'perplexity',
        maxMessages = MAX_MESSAGES,
        selectedText
    } = options;

    const pathname = usePathname();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);
    const lastListedArticlesRef = useRef<ApiArticle[]>([]);
    const currentCanvasArticleRef = useRef<CanvasArticle | null>(null);

    // Helper para adicionar mensagens
    const addMessage = useCallback((msg: ChatMessage) => {
        setMessages(prev => [...prev, msg]);
    }, []);

    // Escutar mudanças no artigo do canvas
    useEffect(() => {
        const handleCanvasChange = (event: Event) => {
            const customEvent = event as CustomEvent;
            currentCanvasArticleRef.current = customEvent.detail.article;
        };

        window.addEventListener('canvas-article-changed', handleCanvasChange);
        return () => window.removeEventListener('canvas-article-changed', handleCanvasChange);
    }, []);

    // Carregar histórico ao montar
    useEffect(() => {
        const history = loadHistory();
        if (history.length > 0) {
            setMessages(history);
        }
    }, []);

    // Salvar histórico quando mudar
    useEffect(() => {
        if (messages.length > 0) {
            saveHistory(messages);
        }
    }, [messages]);

    /**
     * Processa ações especiais da resposta
     */
    const processAction = useCallback(async (action: string, data: Record<string, unknown>) => {
        switch (action) {
            case 'generate-article-request':
                await handleGenerateArticle(
                    data as { type: string; topic: string },
                    addMessage
                );
                break;

            case 'list-articles':
                await handleListArticles(
                    data as { limit?: number },
                    addMessage,
                    (articles) => { lastListedArticlesRef.current = articles; }
                );
                break;

            case 'search-articles':
                await handleSearchArticles(
                    data as { query: string; limit?: number },
                    addMessage
                );
                break;

            case 'show-stats':
                await handleShowStats(addMessage);
                break;

            case 'publish-article':
                handlePublishArticle(data, addMessage, { current: messages }, setMessages);
                break;

            case 'edit-article':
                await handleEditArticle(
                    data as { query: string; instruction?: string; articleNumber?: number },
                    addMessage,
                    lastListedArticlesRef.current
                );
                break;

            case 'confirm-delete':
                await handleConfirmDelete(
                    data as { slug: string },
                    addMessage
                );
                break;
        }
    }, [addMessage, messages]);

    /**
     * Envia mensagem e processa resposta
     */
    const sendMessage = useCallback(async (content: string) => {
        if (!content.trim() || loading) return;

        // Verificar confirmação de deleção pendente
        if (window.__pendingDelete && content.toUpperCase().trim() === 'SIM') {
            setLoading(true);
            addMessage(createUserMessage(content));
            await handleExecuteDelete(window.__pendingDelete, addMessage);
            setLoading(false);
            return;
        }

        if (window.__pendingDelete && content.toUpperCase().trim() === 'NÃO') {
            delete window.__pendingDelete;
            addMessage(createUserMessage(content));
            addMessage(createAssistantMessage('❌ Operação cancelada.'));
            return;
        }

        // Adicionar mensagem do usuário
        const userMessage = createUserMessage(content);
        addMessage(userMessage);
        setLoading(true);
        setError(null);

        abortControllerRef.current = new AbortController();

        try {
            const apiMessages = [...messages, userMessage].map(msg => ({
                role: msg.role,
                content: msg.content
            }));

            const response = await sendChatRequest({
                messages: apiMessages,
                pathname,
                pageData,
                model,
                provider,
                selectedText,
                signal: abortControllerRef.current.signal
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao enviar mensagem');
            }

            const contentType = response.headers.get('content-type');

            // Processar resposta JSON
            if (provider === 'gemini' || contentType?.includes('application/json')) {
                const data = await response.json();

                // Resposta do Gemini
                if (provider === 'gemini' && data.success && data.message) {
                    addMessage(createAssistantMessage(data.message));
                    setLoading(false);
                    return;
                }

                // Resposta direta
                if (data.isDirectResponse) {
                    addMessage(createAssistantMessage(data.content));
                    setLoading(false);
                    return;
                }

                // Ação especial
                if (data.action) {
                    await processAction(data.action, data.data || {});
                    setLoading(false);
                    return;
                }
            }

            // Processar streaming
            if (response.body) {
                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let accumulatedContent = '';
                const assistantMessageId = `assistant-${Date.now()}`;

                setMessages(prev => [...prev, {
                    id: assistantMessageId,
                    role: 'assistant',
                    content: '',
                    timestamp: new Date()
                }]);

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value, { stream: true });
                    accumulatedContent += chunk;

                    setMessages(prev =>
                        prev.map(msg =>
                            msg.id === assistantMessageId
                                ? { ...msg, content: accumulatedContent }
                                : msg
                        )
                    );
                }
            }

            setLoading(false);

        } catch (err: unknown) {
            if ((err as Error).name === 'AbortError') {
                console.log('Requisição cancelada');
            } else {
                console.error('Erro ao enviar mensagem:', err);
                setError(getErrorMessage(err));
            }
            setLoading(false);
        }
    }, [messages, pathname, pageData, model, provider, selectedText, loading, addMessage, processAction]);

    /**
     * Limpa histórico de mensagens
     */
    const clearHistory = useCallback(() => {
        setMessages([]);
        clearStoredHistory();
    }, []);

    /**
     * Exporta histórico como JSON
     */
    const exportHistory = useCallback(() => {
        exportHistoryAsFile(messages);
    }, [messages]);

    return {
        messages,
        loading,
        error,
        sendMessage,
        clearHistory,
        exportHistory
    };
}
