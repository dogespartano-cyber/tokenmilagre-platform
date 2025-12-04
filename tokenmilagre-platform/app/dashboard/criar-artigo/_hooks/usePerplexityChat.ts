/**
 * usePerplexityChat Hook
 * Manages Perplexity AI chat integration for article creation
 *
 * Features:
 * - Conversation state management
 * - Streaming and non-streaming responses
 * - JSON detection and article processing
 * - Citation extraction
 * - Error handling
 */

import { useState, useCallback } from 'react';
import { processArticleLocally, validateProcessedArticle } from '@/lib/article-processor-client';
import { API_ENDPOINTS, MESSAGES, type ArticleType } from '../_lib/constants';

// ============================================================================
// Types
// ============================================================================

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface ProcessedArticle {
  title: string;
  slug: string;
  excerpt?: string;
  description?: string;
  content?: string;
  category: string;
  tags?: string | string[];
  sentiment?: 'positive' | 'neutral' | 'negative';
  level?: string;
  readTime?: string;
  coverImage?: string;
  coverImageAlt?: string;
  type?: ArticleType;
  citations?: string[];
  // Resource fields
  name?: string;
  shortDescription?: string;
  officialUrl?: string;
  platforms?: string[];
  quiz?: any[]; // Array de perguntas do quiz
}

export interface UsePerplexityChatOptions {
  selectedType: ArticleType | null;
  onArticleGenerated?: (article: ProcessedArticle) => void;
  onError?: (error: string) => void;
}

export interface UsePerplexityChatReturn {
  conversation: Message[];
  loading: boolean;
  processing: boolean;
  sendMessage: (prompt: string) => Promise<void>;
  clearConversation: () => void;
  addMessage: (message: Message) => void;
}

// ============================================================================
// Helper Functions
// ============================================================================

const isDev = process.env.NODE_ENV === 'development';

/**
 * Helper para extrair mensagem de erro de forma type-safe
 */
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

/**
 * Função para sanitizar JSON removendo quebras de linha literais
 */
function sanitizeJSON(jsonString: string): string {
  return jsonString
    .replace(/\r\n/g, ' ')  // Windows line breaks
    .replace(/\n/g, ' ')    // Unix line breaks
    .replace(/\r/g, ' ')    // Old Mac line breaks
    .replace(/\t/g, ' ')    // Tabs por espaços
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')  // Remove caracteres de controle ASCII
    .trim();
}

/**
 * Detecta e extrai JSON de texto
 */
function detectJSON(text: string): ProcessedArticle | null {
  if (isDev) {
    console.log('🔍 [detectJSON] Tentando detectar JSON no texto...');
    console.log('📄 Primeiros 200 chars:', text.substring(0, 200));
  }

  // Estratégia 1: Markdown code blocks
  const jsonMatch = text.match(/```json\n?([\s\S]*?)```/);
  if (jsonMatch) {
    if (isDev) console.log('✅ JSON encontrado em markdown block');
    try {
      const sanitized = sanitizeJSON(jsonMatch[1]);
      if (isDev) console.log('🧹 JSON sanitizado (primeiros 200 chars):', sanitized.substring(0, 200));
      const parsed = JSON.parse(sanitized);
      if (isDev) console.log('✅ JSON parseado com sucesso:', Object.keys(parsed));
      return parsed;
    } catch (e) {
      if (isDev) console.error('❌ Erro ao parsear JSON do markdown:', e);
    }
  }

  // Estratégia 2: Extrair do primeiro { ao último }
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');

  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    const extracted = text.substring(firstBrace, lastBrace + 1);
    if (isDev) console.log('🔍 Tentando extrair JSON bruto (chars ' + firstBrace + ' a ' + lastBrace + ')');
    try {
      const sanitized = sanitizeJSON(extracted);
      if (isDev) console.log('🧹 JSON sanitizado (primeiros 200 chars):', sanitized.substring(0, 200));
      const parsed = JSON.parse(sanitized);
      if (isDev) console.log('✅ JSON parseado com sucesso:', Object.keys(parsed));
      return parsed;
    } catch (e) {
      if (isDev) console.error('❌ Erro ao parsear JSON extraído:', e);
    }
  }

  if (isDev) console.log('❌ Nenhum JSON válido encontrado');
  return null;
}

// ============================================================================
// Hook
// ============================================================================

export function usePerplexityChat({
  selectedType,
  onArticleGenerated,
  onError
}: UsePerplexityChatOptions): UsePerplexityChatReturn {
  const [conversation, setConversation] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);

  /**
   * Adiciona mensagem à conversa
   */
  const addMessage = useCallback((message: Message) => {
    setConversation(prev => [...prev, message]);
  }, []);

  /**
   * Limpa toda a conversa
   */
  const clearConversation = useCallback(() => {
    setConversation([]);
  }, []);

  /**
   * Processa artigo detectado e notifica callback
   */
  const processDetectedArticle = useCallback((
    detectedArticle: ProcessedArticle,
    citations: string[] = []
  ) => {
    try {
      if (isDev) {
        console.log('📝 Artigo detectado, processando localmente...');
        console.log('📊 Artigo bruto:', detectedArticle);
        console.log('📚 Citations a serem adicionadas:', citations);
      }

      const processedArticle = processArticleLocally(detectedArticle, selectedType!);
      if (isDev) console.log('🔧 Artigo processado:', processedArticle);

      const validation = validateProcessedArticle(processedArticle, selectedType!);
      if (isDev) console.log('✅ Validação:', validation);

      if (!validation.valid) {
        console.warn(MESSAGES.article.validationWarning(validation.errors));
      }

      // Substituir JSON por mensagem de sucesso
      setConversation(prev => {
        const newConv = [...prev];
        newConv[newConv.length - 1] = {
          role: 'assistant',
          content: MESSAGES.article.generated(
            processedArticle.title || 'Sem título',
            processedArticle.slug || 'sem-slug',
            processedArticle.readTime || '1 min',
            citations.length
          )
        };
        return newConv;
      });

      // Adicionar citations ao artigo processado
      const articleWithCitations = {
        ...processedArticle,
        type: selectedType,
        citations
      };

      if (isDev) console.log('✅ Artigo pronto com citations!', citations);

      // Notificar callback
      if (onArticleGenerated) {
        onArticleGenerated(articleWithCitations);
      }

    } catch (error: unknown) {
      console.error('❌ Erro ao processar artigo localmente:', error);
      const errorMsg = MESSAGES.errors.processArticle(getErrorMessage(error));
      setConversation(prev => [...prev, {
        role: 'assistant',
        content: errorMsg
      }]);
      if (onError) {
        onError(getErrorMessage(error));
      }
    }
  }, [selectedType, onArticleGenerated, onError]);

  /**
   * Envia mensagem para Perplexity e processa resposta
   */
  const sendMessage = useCallback(async (prompt: string) => {
    if (!prompt.trim()) return;

    const userMessage = prompt.trim();

    // Adicionar mensagem do usuário
    setConversation(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      // 1. Chamar Perplexity
      const response = await fetch(API_ENDPOINTS.chatPerplexity, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...conversation, { role: 'user', content: userMessage }],
          articleType: selectedType
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || MESSAGES.errors.perplexity);
      }

      // 2. Se está gerando artigo, resposta é JSON (não streaming)
      if (selectedType) {
        const jsonResponse = await response.json();
        const content = jsonResponse.content;
        const citations = jsonResponse.citations || [];

        if (isDev) {
          console.log('📥 Resposta não-streaming recebida');
          console.log('📝 Content length:', content.length);
          console.log('📚 Citations:', citations.length);
        }

        // Adicionar resposta completa à conversa
        setConversation(prev => [...prev, { role: 'assistant', content }]);

        // Detectar e processar JSON
        const detectedArticle = detectJSON(content);

        if (detectedArticle) {
          processDetectedArticle(detectedArticle, citations);
        } else {
          if (isDev) console.log('ℹ️ Resposta não contém JSON de artigo');
        }

        setLoading(false);
        setProcessing(false);
        return;
      }

      // 3. Modo conversa: processar streaming
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = '';

      if (reader) {
        // Adicionar mensagem vazia que será preenchida pelo streaming
        setConversation(prev => [...prev, { role: 'assistant', content: '' }]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          accumulatedText += chunk;

          // Atualizar última mensagem com texto acumulado
          setConversation(prev => {
            const newConv = [...prev];
            newConv[newConv.length - 1] = { role: 'assistant', content: accumulatedText };
            return newConv;
          });
        }

        // Detectar se é JSON (artigo gerado)
        const detectedArticle = detectJSON(accumulatedText);

        if (detectedArticle) {
          processDetectedArticle(detectedArticle);
        } else {
          if (isDev) console.log('ℹ️ Resposta não contém JSON de artigo - é uma conversa normal');
        }
      }

    } catch (error: unknown) {
      console.error('Erro:', error);
      const errorMsg = MESSAGES.errors.generic(getErrorMessage(error));
      setConversation(prev => [...prev, {
        role: 'assistant',
        content: errorMsg
      }]);
      if (onError) {
        onError(getErrorMessage(error));
      }
    } finally {
      setLoading(false);
      setProcessing(false);
    }
  }, [conversation, selectedType, processDetectedArticle, onError]);

  return {
    conversation,
    loading,
    processing,
    sendMessage,
    clearConversation,
    addMessage
  };
}
