import { useState, useCallback, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

// Extensões de Window para dados temporários do chat
declare global {
  interface Window {
    __pendingEdit?: { instruction?: string; articles: ApiArticle[] };
    __pendingDelete?: string;
  }
}

// Tipos para artigos da API
interface ApiArticle {
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

interface CanvasArticle {
  slug: string;
  title: string;
  content: string;
  summary?: string;
  category?: string;
  tags?: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: {
    canvasArticle?: {
      slug: string;
      title: string;
      content: string;
      summary?: string;
      category?: string;
      tags?: string[];
    };
    instruction?: string;
  };
}

export interface UseAdminChatOptions {
  pageData?: Record<string, unknown>;
  model?: 'sonar' | 'sonar-pro';
  provider?: 'perplexity' | 'gemini'; // Novo: escolher provider
  onApply?: (suggestion: string) => void;
  maxMessages?: number;
  selectedText?: string; // Novo: texto selecionado pelo usuário
}

export interface UseAdminChatReturn {
  messages: ChatMessage[];
  loading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  clearHistory: () => void;
  exportHistory: () => void;
}

const STORAGE_KEY = 'admin-chat-history';
const MAX_MESSAGES = 50;

// Helper para extrair mensagem de erro de forma type-safe
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return getErrorMessage(error);
  return String(error);
}

/**
 * Hook customizado para gerenciar Admin Chat
 */
export function useAdminChat(options: UseAdminChatOptions = {}): UseAdminChatReturn {
  const {
    pageData,
    model = 'sonar',
    provider = 'perplexity', // Padrão: Perplexity
    onApply,
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

  // Escutar mudanças no artigo do canvas
  useEffect(() => {
    const handleCanvasChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      currentCanvasArticleRef.current = customEvent.detail.article;
    };

    window.addEventListener('canvas-article-changed', handleCanvasChange);
    return () => window.removeEventListener('canvas-article-changed', handleCanvasChange);
  }, []);

  // Carregar histórico do localStorage ao montar
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Array<Omit<ChatMessage, 'timestamp'> & { timestamp: string }>;
        // Converter timestamps de string para Date
        const messagesWithDates = parsed.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(messagesWithDates);
      }
    } catch (err) {
      console.error('Erro ao carregar histórico:', err);
    }
  }, []);

  // Salvar histórico no localStorage quando mudar
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      } catch (err) {
        console.error('Erro ao salvar histórico:', err);
      }
    }
  }, [messages]);

  /**
   * Envia mensagem e processa resposta
   */
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || loading) return;

    // Adicionar mensagem do usuário
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    setError(null);

    // Criar AbortController para cancelar requisição se necessário
    abortControllerRef.current = new AbortController();

    try {
      // Preparar mensagens para API
      const apiMessages = [...messages, userMessage].map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Limitar número de mensagens enviadas (economizar tokens)
      const limitedMessages = apiMessages.slice(-10);

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

      console.log(`🎯 [useAdminChat] Usando ${provider === 'gemini' ? 'Gemini 2.5 Pro (latest)' : 'Perplexity Sonar'} | Modo: ${editMode}`);

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao enviar mensagem');
      }

      // Verificar se é resposta direta (JSON)
      const contentType = response.headers.get('content-type');

      // Gemini sempre retorna JSON (não usa streaming)
      if (provider === 'gemini' || contentType?.includes('application/json')) {
        const data = await response.json();

        // Resposta do Gemini
        if (provider === 'gemini' && data.success && data.message) {
          const assistantMessage: ChatMessage = {
            id: `assistant-${Date.now()}`,
            role: 'assistant',
            content: data.message,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, assistantMessage]);

          setLoading(false);
          return;
        }

        // Resposta direta (validação, etc) - Para Perplexity
        if (data.isDirectResponse) {
          const assistantMessage: ChatMessage = {
            id: `assistant-${Date.now()}`,
            role: 'assistant',
            content: data.content,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, assistantMessage]);
          setLoading(false);
          return;
        }

        // Ação especial: Requisição para gerar artigo
        if (data.action === 'generate-article-request') {
          // Mostrar mensagem de carregamento
          const loadingMessage: ChatMessage = {
            id: `assistant-loading-${Date.now()}`,
            role: 'assistant',
            content: `🤖 **Gerando artigo...**\n\nTipo: ${data.data.type}\nTópico: ${data.data.topic}\n\nAguarde, isso pode levar alguns segundos...`,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, loadingMessage]);

          // Fazer requisição para gerar artigo
          try {
            const generateResponse = await fetch('/api/generate-article', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data.data)
            });

            const generateData = await generateResponse.json();

            if (generateData.success) {
              // Artigo gerado com sucesso
              const successMessage: ChatMessage = {
                id: `assistant-${Date.now()}`,
                role: 'assistant',
                content: `✅ **Artigo gerado com sucesso!**\n\n**Título**: ${generateData.data.title}\n**Categoria**: ${generateData.data.category}\n**Tags**: ${generateData.data.tags.join(', ')}\n\n${generateData.validation ? `**Score de Validação**: ${generateData.validation.score}/100\n\n` : ''}O artigo aparecerá na tela principal. Use \`/validate\` para validar, \`/improve [seção]\` para melhorar ou \`/publish\` para publicar.`,
                timestamp: new Date()
              };
              setMessages(prev => [...prev, successMessage]);

              // Disparar evento para página
              window.dispatchEvent(new CustomEvent('article-generated', {
                detail: generateData.data
              }));
            } else {
              // Erro ao gerar
              let errorContent = `❌ **Erro ao gerar artigo**: ${generateData.error}`;

              // Adicionar debug se disponível
              if (generateData.debug) {
                errorContent += `\n\n**Debug** (primeiros caracteres da resposta):\n\`\`\`\n${generateData.debug}\n\`\`\`\n\nA IA não retornou JSON válido. Tente novamente ou reformule o tópico.`;
              }

              const errorMessage: ChatMessage = {
                id: `assistant-${Date.now()}`,
                role: 'assistant',
                content: errorContent,
                timestamp: new Date()
              };
              setMessages(prev => [...prev, errorMessage]);
            }
          } catch (error: unknown) {
            const errorMessage: ChatMessage = {
              id: `assistant-${Date.now()}`,
              role: 'assistant',
              content: `❌ **Erro ao gerar artigo**: ${getErrorMessage(error)}`,
              timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
          }

          setLoading(false);
          return;
        }

        // Ação especial: Publicar artigo
        if (data.action === 'publish-article') {
          const assistantMessage: ChatMessage = {
            id: `assistant-${Date.now()}`,
            role: 'assistant',
            content: `📤 **Publicando artigo...**\n\nPor favor, aguarde.`,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, assistantMessage]);

          // Disparar evento para página
          window.dispatchEvent(new CustomEvent('publish-article', {
            detail: data.data
          }));

          // Escutar resposta de publicação
          const handlePublished = (event: Event) => {
            const customEvent = event as CustomEvent;

            if (customEvent.detail.success) {
              const successMessage: ChatMessage = {
                id: `assistant-${Date.now()}`,
                role: 'assistant',
                content: `✅ **Artigo publicado com sucesso!**\n\nRedirecionando para o artigo...`,
                timestamp: new Date()
              };
              setMessages(prev => [...prev, successMessage]);
            } else {
              const errorMessage: ChatMessage = {
                id: `assistant-${Date.now()}`,
                role: 'assistant',
                content: `❌ **Erro ao publicar**: ${customEvent.detail.error}`,
                timestamp: new Date()
              };
              setMessages(prev => [...prev, errorMessage]);
            }

            window.removeEventListener('article-published', handlePublished);
          };

          window.addEventListener('article-published', handlePublished);

          setLoading(false);
          return;
        }

        // 🆕 Ação especial: Listar artigos
        if (data.action === 'list-articles') {
          try {
            const listResponse = await fetch(`/api/articles?limit=${data.data.limit || 10}`);
            const listData = await listResponse.json();

            if (listData.success && listData.data) {
              const articles = listData.data;
              const pagination = listData.pagination;

              // Salvar artigos listados para contexto
              lastListedArticlesRef.current = articles;

              // Calcular estatísticas
              const newsCount = articles.filter((a: ApiArticle) => a.sentiment).length;
              const educationalCount = articles.filter((a: ApiArticle) => a.level).length;

              let content = `📄 **Artigos Publicados** (${articles.length} de ${pagination.total})\n\n`;

              articles.forEach((article: ApiArticle, index: number) => {
                const date = new Date(article.publishedAt).toLocaleDateString('pt-BR');
                const type = article.sentiment ? '📰' : '📚';
                content += `${index + 1}. ${type} **${article.title}**\n`;
                content += `   • Slug: \`${article.slug}\`\n`;
                content += `   • Categoria: ${article.category || 'Sem categoria'}\n`;
                content += `   • Publicado: ${date}\n\n`;
              });

              content += `\n**Estatísticas**:\n`;
              content += `• Total: ${pagination.total}\n`;
              content += `• Notícias: ${newsCount}\n`;
              content += `• Educacionais: ${educationalCount}\n`;

              const assistantMessage: ChatMessage = {
                id: `assistant-${Date.now()}`,
                role: 'assistant',
                content,
                timestamp: new Date()
              };
              setMessages(prev => [...prev, assistantMessage]);
            } else {
              throw new Error(listData.error || 'Erro ao listar artigos');
            }
          } catch (error: unknown) {
            const errorMessage: ChatMessage = {
              id: `assistant-${Date.now()}`,
              role: 'assistant',
              content: `❌ **Erro ao listar artigos**: ${getErrorMessage(error)}`,
              timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
          }

          setLoading(false);
          return;
        }

        // 🆕 Ação especial: Buscar artigos
        if (data.action === 'search-articles') {
          try {
            const searchResponse = await fetch(`/api/articles?query=${encodeURIComponent(data.data.query)}&limit=${data.data.limit || 10}`);
            const searchData = await searchResponse.json();

            if (searchData.success && searchData.data) {
              const articles = searchData.data;
              let content = `🔍 **Resultados da busca**: "${data.data.query}"\n\n`;

              if (articles.length === 0) {
                content += `Nenhum artigo encontrado com o termo "${data.data.query}".\n\n`;
                content += `Tente buscar por outros termos ou crie um novo artigo sobre este tópico.`;
              } else {
                content += `Encontrei **${articles.length}** artigo(s):\n\n`;

                articles.forEach((article: ApiArticle, index: number) => {
                  const date = new Date(article.publishedAt).toLocaleDateString('pt-BR');
                  const type = article.sentiment ? '📰' : '📚';
                  content += `${index + 1}. ${type} **${article.title}**\n`;
                  content += `   • Slug: \`${article.slug}\`\n`;
                  content += `   • Categoria: ${article.category || 'Sem categoria'}\n`;
                  content += `   • Publicado: ${date}\n\n`;
                });
              }

              const assistantMessage: ChatMessage = {
                id: `assistant-${Date.now()}`,
                role: 'assistant',
                content,
                timestamp: new Date()
              };
              setMessages(prev => [...prev, assistantMessage]);
            } else {
              throw new Error(searchData.error || 'Erro ao buscar artigos');
            }
          } catch (error: unknown) {
            const errorMessage: ChatMessage = {
              id: `assistant-${Date.now()}`,
              role: 'assistant',
              content: `❌ **Erro ao buscar artigos**: ${getErrorMessage(error)}`,
              timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
          }

          setLoading(false);
          return;
        }

        // 🆕 Ação especial: Deletar artigo
        if (data.action === 'delete-article') {
          try {
            // Primeiro buscar artigos que correspondem à query
            const searchResponse = await fetch(`/api/articles?query=${encodeURIComponent(data.data.query)}&limit=5`);
            const searchData = await searchResponse.json();

            if (searchData.success && searchData.data && searchData.data.length > 0) {
              const articles = searchData.data;
              // Se encontrou artigos, perguntar qual deletar
              let content = `🗑️ **Artigos encontrados** com "${data.data.query}":\n\n`;

              articles.forEach((article: ApiArticle, index: number) => {
                const date = new Date(article.publishedAt).toLocaleDateString('pt-BR');
                content += `${index + 1}. **${article.title}**\n`;
                content += `   • Slug: \`${article.slug}\`\n`;
                content += `   • Publicado: ${date}\n\n`;
              });

              content += `\n⚠️ **Para deletar um artigo**, responda com o slug exato:\n`;
              content += `\`/delete [slug]\`\n\n`;
              content += `Exemplo: \`/delete ${articles[0].slug}\``;

              const assistantMessage: ChatMessage = {
                id: `assistant-${Date.now()}`,
                role: 'assistant',
                content,
                timestamp: new Date()
              };
              setMessages(prev => [...prev, assistantMessage]);
            } else {
              const errorMessage: ChatMessage = {
                id: `assistant-${Date.now()}`,
                role: 'assistant',
                content: `❌ Nenhum artigo encontrado com "${data.data.query}".`,
                timestamp: new Date()
              };
              setMessages(prev => [...prev, errorMessage]);
            }
          } catch (error: unknown) {
            const errorMessage: ChatMessage = {
              id: `assistant-${Date.now()}`,
              role: 'assistant',
              content: `❌ **Erro ao buscar artigos**: ${getErrorMessage(error)}`,
              timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
          }

          setLoading(false);
          return;
        }

        // 🆕 Ação especial: Estatísticas
        if (data.action === 'show-stats') {
          try {
            const statsResponse = await fetch('/api/articles?limit=1000'); // Buscar todos para calcular stats
            const statsData = await statsResponse.json();

            if (statsData.success && statsData.data && statsData.pagination) {
              const articles = statsData.data;
              const total = statsData.pagination.total;

              // Calcular estatísticas
              const newsCount = articles.filter((a: ApiArticle) => a.sentiment).length;
              const educationalCount = articles.filter((a: ApiArticle) => a.level).length;

              const content = `📊 **Estatísticas do Blog**\n\n` +
                `• **Total de artigos**: ${total}\n` +
                `• **Notícias**: ${newsCount} (${total > 0 ? Math.round(newsCount / total * 100) : 0}%)\n` +
                `• **Artigos educacionais**: ${educationalCount} (${total > 0 ? Math.round(educationalCount / total * 100) : 0}%)\n\n` +
                `Use "Liste os artigos" para ver os artigos publicados.`;

              const assistantMessage: ChatMessage = {
                id: `assistant-${Date.now()}`,
                role: 'assistant',
                content,
                timestamp: new Date()
              };
              setMessages(prev => [...prev, assistantMessage]);
            } else {
              throw new Error(statsData.error || 'Erro ao buscar estatísticas');
            }
          } catch (error: unknown) {
            const errorMessage: ChatMessage = {
              id: `assistant-${Date.now()}`,
              role: 'assistant',
              content: `❌ **Erro ao buscar estatísticas**: ${getErrorMessage(error)}`,
              timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
          }

          setLoading(false);
          return;
        }

        // 🆕 Ação especial: Editar artigo (abre canvas)
        if (data.action === 'edit-article') {
          try {
            const { query, instruction, articleNumber } = data.data;

            let articles: ApiArticle[] = [];

            // Se mencionou número de artigo e temos lista recente, usar da lista
            if (articleNumber && lastListedArticlesRef.current.length > 0) {
              const index = articleNumber - 1; // Converter para índice (1-based to 0-based)
              if (index >= 0 && index < lastListedArticlesRef.current.length) {
                articles = [lastListedArticlesRef.current[index]];
              } else {
                throw new Error(`Artigo ${articleNumber} não encontrado na lista. Você listou ${lastListedArticlesRef.current.length} artigos.`);
              }
            } else {
              // Buscar artigos que correspondem à query
              const searchResponse = await fetch(`/api/articles?query=${encodeURIComponent(query)}&limit=5`);
              const searchData = await searchResponse.json();

              if (!searchData.success || !searchData.data || searchData.data.length === 0) {
                throw new Error('Nenhum artigo encontrado');
              }

              articles = searchData.data;
            }

            // Se encontrou múltiplos artigos, perguntar qual
            if (articles.length > 1) {
              let content = `📝 **Artigos encontrados** com "${query}":\n\n`;

              articles.forEach((article: ApiArticle, index: number) => {
                const date = new Date(article.publishedAt).toLocaleDateString('pt-BR');
                content += `${index + 1}. **${article.title}**\n`;
                content += `   • Slug: \`${article.slug}\`\n`;
                content += `   • Publicado: ${date}\n\n`;
              });

              content += `\n⚠️ **Qual artigo você quer editar?** Responda com o número ou slug:\n\n`;
              content += `Exemplo: \`1\` ou \`${articles[0].slug}\``;

              const assistantMessage: ChatMessage = {
                id: `assistant-${Date.now()}`,
                role: 'assistant',
                content,
                timestamp: new Date()
              };
              setMessages(prev => [...prev, assistantMessage]);

              // Salvar instrução para próxima mensagem
              window.__pendingEdit = { instruction, articles };
            } else {
              // Apenas um artigo encontrado, abrir canvas
              const article = articles[0];

              // Buscar conteúdo completo do artigo
              const articleResponse = await fetch(`/api/articles/${article.slug}`);
              const articleData = await articleResponse.json();

              if (!articleData.success) {
                throw new Error('Erro ao buscar artigo completo');
              }

              const fullArticle = articleData.data;

              // Disparar evento para abrir canvas
              window.dispatchEvent(new CustomEvent('open-article-canvas', {
                detail: {
                  article: {
                    slug: fullArticle.slug,
                    title: fullArticle.title,
                    content: fullArticle.content,
                    summary: fullArticle.summary,
                    category: fullArticle.category,
                    tags: fullArticle.keywords
                  },
                  instruction
                }
              }));

              const successMessage: ChatMessage = {
                id: `assistant-${Date.now()}`,
                role: 'assistant',
                content: `📝 **Canvas aberto!**\n\n**Artigo**: ${fullArticle.title}\n\nVocê pode editar o artigo no canvas à direita. ${instruction ? `\n\n**Sugestão**: ${instruction}` : ''}\n\nQuando terminar, clique em **Salvar** no canvas.`,
                timestamp: new Date(),
                metadata: {
                  canvasArticle: {
                    slug: fullArticle.slug,
                    title: fullArticle.title,
                    content: fullArticle.content,
                    summary: fullArticle.summary,
                    category: fullArticle.category,
                    tags: fullArticle.keywords
                  },
                  instruction
                }
              };
              setMessages(prev => [...prev, successMessage]);
            }
          } catch (error: unknown) {
            const errorMessage: ChatMessage = {
              id: `assistant-${Date.now()}`,
              role: 'assistant',
              content: `❌ **Erro ao abrir artigo**: ${getErrorMessage(error)}`,
              timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
          }

          setLoading(false);
          return;
        }

        // 🆕 Ação especial: Confirmar e deletar artigo
        if (data.action === 'confirm-delete') {
          try {
            const slug = data.data.slug;

            // Buscar informações do artigo antes de deletar
            const articleResponse = await fetch(`/api/articles/${slug}`);
            const articleData = await articleResponse.json();

            if (!articleData.success) {
              throw new Error('Artigo não encontrado');
            }

            const article = articleData.data;

            // Pedir confirmação
            const confirmMessage: ChatMessage = {
              id: `assistant-${Date.now()}`,
              role: 'assistant',
              content: `⚠️ **Confirmação de Deleção**\n\n` +
                `Você está prestes a deletar:\n\n` +
                `**Título**: ${article.title}\n` +
                `**Slug**: \`${slug}\`\n` +
                `**Publicado em**: ${new Date(article.publishedAt).toLocaleDateString('pt-BR')}\n\n` +
                `⚠️ **Esta ação é IRREVERSÍVEL!**\n\n` +
                `Digite \`SIM\` para confirmar ou \`NÃO\` para cancelar.`,
              timestamp: new Date()
            };
            setMessages(prev => [...prev, confirmMessage]);

            // Salvar slug para próxima mensagem
            window.__pendingDelete = slug;

          } catch (error: unknown) {
            const errorMessage: ChatMessage = {
              id: `assistant-${Date.now()}`,
              role: 'assistant',
              content: `❌ **Erro**: ${getErrorMessage(error)}`,
              timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
          }

          setLoading(false);
          return;
        }
      }

      // 🆕 Processar seleção de artigo para editar (abre canvas)
      if (window.__pendingEdit) {
        const { instruction, articles } = window.__pendingEdit;
        const userInput = content.trim();

        // Verificar se é um número (índice)
        const indexMatch = userInput.match(/^(\d+)$/);
        let selectedArticle = null;

        if (indexMatch) {
          const index = parseInt(indexMatch[1], 10) - 1;
          if (index >= 0 && index < articles.length) {
            selectedArticle = articles[index];
          }
        } else {
          // Verificar se é um slug válido
          selectedArticle = articles.find((a: ApiArticle) => a.slug === userInput);
        }

        if (selectedArticle) {
          delete window.__pendingEdit;

          try {
            // Buscar conteúdo completo do artigo
            const articleResponse = await fetch(`/api/articles/${selectedArticle.slug}`);
            const articleData = await articleResponse.json();

            if (!articleData.success) {
              throw new Error('Erro ao buscar artigo completo');
            }

            const fullArticle = articleData.data;

            // Disparar evento para abrir canvas
            window.dispatchEvent(new CustomEvent('open-article-canvas', {
              detail: {
                article: {
                  slug: fullArticle.slug,
                  title: fullArticle.title,
                  content: fullArticle.content,
                  summary: fullArticle.summary,
                  category: fullArticle.category,
                  tags: fullArticle.keywords
                },
                instruction
              }
            }));

            const successMessage: ChatMessage = {
              id: `assistant-${Date.now()}`,
              role: 'assistant',
              content: `📝 **Canvas aberto!**\n\n**Artigo**: ${fullArticle.title}\n\nVocê pode editar o artigo no canvas à direita. ${instruction ? `\n\n**Sugestão**: ${instruction}` : ''}\n\nQuando terminar, clique em **Salvar** no canvas.`,
              timestamp: new Date(),
              metadata: {
                canvasArticle: {
                  slug: fullArticle.slug,
                  title: fullArticle.title,
                  content: fullArticle.content,
                  summary: fullArticle.summary,
                  category: fullArticle.category,
                  tags: fullArticle.keywords
                },
                instruction
              }
            };
            setMessages(prev => [...prev, successMessage]);
          } catch (error: unknown) {
            const errorMessage: ChatMessage = {
              id: `assistant-${Date.now()}`,
              role: 'assistant',
              content: `❌ **Erro ao abrir artigo**: ${getErrorMessage(error)}`,
              timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
          }

          setLoading(false);
          return;
        }
      }

      // 🆕 Processar confirmação de delete
      if (window.__pendingDelete && content.toUpperCase().trim() === 'SIM') {
        const slug = window.__pendingDelete;
        delete window.__pendingDelete;

        try {
          const deleteResponse = await fetch(`/api/articles/${slug}`, {
            method: 'DELETE'
          });

          const deleteData = await deleteResponse.json();

          if (deleteData.success) {
            const successMessage: ChatMessage = {
              id: `assistant-${Date.now()}`,
              role: 'assistant',
              content: `✅ **Artigo deletado com sucesso!**\n\n` +
                `O artigo foi removido permanentemente do banco de dados.`,
              timestamp: new Date()
            };
            setMessages(prev => [...prev, successMessage]);
          } else {
            throw new Error(deleteData.error || 'Erro ao deletar artigo');
          }
        } catch (error: unknown) {
          const errorMessage: ChatMessage = {
            id: `assistant-${Date.now()}`,
            role: 'assistant',
            content: `❌ **Erro ao deletar**: ${getErrorMessage(error)}`,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, errorMessage]);
        }

        setLoading(false);
        return;
      }

      // 🆕 Cancelar delete
      if (window.__pendingDelete && (content.toUpperCase().trim() === 'NÃO' || content.toUpperCase().trim() === 'NAO')) {
        delete window.__pendingDelete;

        const cancelMessage: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: `❌ **Deleção cancelada.**\n\nO artigo não foi removido.`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, cancelMessage]);

        setLoading(false);
        return;
      }

      // 🎯 Se há artigo no canvas E mensagem parece ser instrução de edição, processar automaticamente
      const canvasArticle = currentCanvasArticleRef.current;
      const isEditInstruction = /^(remov[ae]|corrij[ae]|adicion[e]|mud[e]|alter[e]|substitu[ai]|tir[e]|apag[ue]|delet[e]|atualiz[e])/i.test(content);

      if (canvasArticle && isEditInstruction) {
        try {
          // Mostrar mensagem de processamento
          const processingMessage: ChatMessage = {
            id: `assistant-${Date.now()}`,
            role: 'assistant',
            content: `🤖 **Aplicando edição...**\n\n**Instrução**: ${content}\n\nAguarde enquanto processo a edição...`,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, processingMessage]);

          // Chamar IA para processar edição
          const editResponse = await fetch('/api/admin-chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              messages: [
                {
                  role: 'user',
                  content: `Você é um editor de conteúdo. Edite o seguinte artigo seguindo a instrução do usuário.\n\n**Instrução do usuário**: ${content}\n\n**Título atual**: ${canvasArticle.title}\n\n**Conteúdo atual**:\n${canvasArticle.content}\n\n**IMPORTANTE**: Retorne APENAS o conteúdo editado em markdown, sem explicações. Mantenha a formatação markdown original.`
                }
              ],
              pathname: '/dashboard',
              model: 'sonar'
            })
          });

          if (!editResponse.ok) {
            throw new Error('Erro ao processar edição');
          }

          // Ler stream da resposta
          const reader = editResponse.body?.getReader();
          const decoder = new TextDecoder();
          let editedContent = '';

          if (reader) {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              editedContent += decoder.decode(value, { stream: true });
            }
          }

          // Aplicar edição no canvas (sem salvar)
          window.dispatchEvent(new CustomEvent('apply-canvas-edit', {
            detail: {
              content: editedContent.trim()
            }
          }));

          // Mostrar mensagem de sucesso
          const successMessage: ChatMessage = {
            id: `assistant-${Date.now()}`,
            role: 'assistant',
            content: `✅ **Edição aplicada!**\n\n**Instrução**: ${content}\n\nA edição foi aplicada no canvas. Revise as mudanças e clique em **Salvar** quando estiver satisfeito.`,
            timestamp: new Date(),
            metadata: {
              canvasArticle,
              instruction: content
            }
          };
          setMessages(prev => [...prev, successMessage]);
          setLoading(false);
          return;
        } catch (error: unknown) {
          const errorMessage: ChatMessage = {
            id: `assistant-${Date.now()}`,
            role: 'assistant',
            content: `❌ **Erro ao aplicar edição**: ${getErrorMessage(error)}\n\nTente novamente ou edite manualmente no canvas.`,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, errorMessage]);
          setLoading(false);
          return;
        }
      }

      // Processar streaming
      if (!response.body) {
        throw new Error('Response body is null');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = '';

      // Criar mensagem do assistente (vazia inicialmente)
      const assistantMessageId = `assistant-${Date.now()}`;
      setMessages(prev => [
        ...prev,
        {
          id: assistantMessageId,
          role: 'assistant',
          content: '',
          timestamp: new Date()
        }
      ]);

      // Ler stream
      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulatedContent += chunk;

        // Atualizar mensagem do assistente com conteúdo acumulado
        setMessages(prev =>
          prev.map(msg =>
            msg.id === assistantMessageId
              ? { ...msg, content: accumulatedContent }
              : msg
          )
        );
      }

      setLoading(false);

    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('Requisição cancelada');
      } else {
        console.error('Erro ao enviar mensagem:', err);
        setError(err.message || 'Erro ao enviar mensagem');
      }
      setLoading(false);
    }
  }, [messages, pathname, pageData, model, loading]);

  /**
   * Limpa histórico de mensagens
   */
  const clearHistory = useCallback(() => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  /**
   * Exporta histórico como JSON
   */
  const exportHistory = useCallback(() => {
    const dataStr = JSON.stringify(messages, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `chat-history-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
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
