'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faNewspaper,
  faGraduationCap,
  faBox,
  faPaperPlane,
  faArrowLeft,
  faCheck,
  faSpinner,
  faCopy,
  faPen
} from '@fortawesome/free-solid-svg-icons';
import AdminRoute from '@/components/AdminRoute';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import ArticlePreview from '@/components/admin/ArticlePreview';
import { usePerplexityChat, type ProcessedArticle } from './_hooks/usePerplexityChat';
import {
  type ArticleType,
  ARTICLE_TYPE_CONFIG,
  PROMPT_SUGGESTIONS,
  MESSAGES,
  API_ENDPOINTS,
  CHAT_CONFIG,
  ANIMATION_DELAYS,
  getArticleRoute,
  getApiEndpoint
} from './_lib/constants';

// Tipos para componentes ReactMarkdown
interface MarkdownComponentProps {
  children?: React.ReactNode;
}

interface MarkdownLinkProps extends MarkdownComponentProps {
  href?: string;
}

interface MarkdownCodeProps extends MarkdownComponentProps {
  inline?: boolean;
}

const isDev = process.env.NODE_ENV === 'development';

// Helper para extrair mensagem de erro de forma type-safe
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

export default function CriarArtigoPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const refineSectionRef = useRef<HTMLDivElement>(null);

  const [prompt, setPrompt] = useState('');
  const [selectedType, setSelectedType] = useState<ArticleType | null>(null);
  const [generatedArticle, setGeneratedArticle] = useState<ProcessedArticle | null>(null);
  const [refinePrompt, setRefinePrompt] = useState('');
  const [refining, setRefining] = useState(false);
  const [copiedProcessed, setCopiedProcessed] = useState(false);
  const [generatingCover, setGeneratingCover] = useState(false);

  // Usar hook do Perplexity Chat
  const { conversation, loading, processing, sendMessage, addMessage } = usePerplexityChat({
    selectedType,
    onArticleGenerated: (article) => {
      setGeneratedArticle(article);
    },
    onError: (error) => {
      console.error('Erro no chat:', error);
    }
  });

  // Garantir que a página sempre inicie no topo
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // DEBUG: Monitorar mudanças na coverImage (apenas em desenvolvimento)
  useEffect(() => {
    if (isDev && generatedArticle?.coverImage) {
      console.log('🖼️ [DEBUG RENDER] generatedArticle.coverImage mudou:', {
        valor: generatedArticle.coverImage.substring(0, 100),
        tipo: typeof generatedArticle.coverImage,
        isArray: Array.isArray(generatedArticle.coverImage),
        isUrl: generatedArticle.coverImage.startsWith('/images/'),
        isBase64: generatedArticle.coverImage.startsWith('data:')
      });
    }
  }, [generatedArticle?.coverImage]);

  // Auto-scroll ao adicionar mensagens (somente dentro do container do chat)
  useEffect(() => {
    if (conversation.length > 0 && chatContainerRef.current) {
      // Rolar apenas o container do chat, não a página inteira
      const container = chatContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  }, [conversation]);

  // Auto-scroll durante streaming (otimizado para prevenir vazamento de memória)
  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    // Função que verifica se deve fazer auto-scroll
    const shouldAutoScroll = () => {
      const threshold = 100; // pixels de tolerância
      const position = container.scrollTop + container.clientHeight;
      const bottom = container.scrollHeight;
      return bottom - position < threshold;
    };

    // Função para rolar suavemente
    const scrollToBottom = () => {
      if (shouldAutoScroll()) {
        container.scrollTop = container.scrollHeight;
      }
    };

    // Usar MutationObserver apenas durante loading
    let observer: MutationObserver | null = null;

    if (loading && conversation.length > 0) {
      observer = new MutationObserver(scrollToBottom);
      observer.observe(container, {
        childList: true,
        subtree: true,
        characterData: true
      });
    }

    // Cleanup - garantir desconexão do observer
    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [loading]); // Dependência otimizada: apenas loading

  // Componentes do ReactMarkdown otimizados com useMemo
  const markdownComponents = useMemo(() => ({
    // Parágrafos
    p: ({ children }: MarkdownComponentProps) => (
      <p className="mb-3 last:mb-0 break-words" style={{ color: 'inherit' }}>
        {children}
      </p>
    ),
    // Títulos
    h1: ({ children }: MarkdownComponentProps) => (
      <h1 className="text-2xl font-bold mb-3 mt-4" style={{ color: 'inherit' }}>
        {children}
      </h1>
    ),
    h2: ({ children }: MarkdownComponentProps) => (
      <h2 className="text-xl font-bold mb-2 mt-4" style={{ color: 'inherit' }}>
        {children}
      </h2>
    ),
    h3: ({ children }: MarkdownComponentProps) => (
      <h3 className="text-lg font-bold mb-2 mt-3" style={{ color: 'inherit' }}>
        {children}
      </h3>
    ),
    // Texto em negrito
    strong: ({ children }: MarkdownComponentProps) => (
      <strong className="font-bold" style={{ color: 'inherit' }}>
        {children}
      </strong>
    ),
    // Texto em itálico
    em: ({ children }: MarkdownComponentProps) => (
      <em className="italic" style={{ color: 'inherit' }}>
        {children}
      </em>
    ),
    // Listas não ordenadas
    ul: ({ children }: MarkdownComponentProps) => (
      <ul className="list-disc list-inside mb-3 space-y-1" style={{ color: 'inherit' }}>
        {children}
      </ul>
    ),
    // Listas ordenadas
    ol: ({ children }: MarkdownComponentProps) => (
      <ol className="list-decimal list-inside mb-3 space-y-1" style={{ color: 'inherit' }}>
        {children}
      </ol>
    ),
    // Itens de lista
    li: ({ children }: MarkdownComponentProps) => (
      <li className="mb-1" style={{ color: 'inherit' }}>
        {children}
      </li>
    ),
    // Links
    a: ({ children, href }: MarkdownLinkProps) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:opacity-80"
        style={{ color: 'var(--brand-primary)' }}
      >
        {children}
      </a>
    ),
    // Código inline
    code: ({ inline, children }: MarkdownCodeProps) => {
      if (inline) {
        return (
          <code
            className="px-1.5 py-0.5 rounded text-sm font-mono"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-primary)'
            }}
          >
            {children}
          </code>
        );
      }
      return (
        <code className="block break-all whitespace-pre-wrap overflow-x-auto max-w-full text-sm font-mono">
          {children}
        </code>
      );
    },
    // Blocos de código
    pre: ({ children }: MarkdownComponentProps) => (
      <pre
        className="break-all whitespace-pre-wrap overflow-x-auto max-w-full p-3 rounded mb-3 text-sm font-mono"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          color: 'var(--text-primary)'
        }}
      >
        {children}
      </pre>
    ),
    // Citações
    blockquote: ({ children }: MarkdownComponentProps) => (
      <blockquote
        className="border-l-4 pl-4 py-2 mb-3 italic"
        style={{
          borderColor: 'var(--border-medium)',
          color: 'var(--text-secondary)'
        }}
      >
        {children}
      </blockquote>
    ),
    // Linha horizontal
    hr: () => (
      <hr className="my-4" style={{ borderColor: 'var(--border-light)' }} />
    ),
  }), []); // Sem dependências: criado uma vez apenas

  const handleSendMessage = async () => {
    if (!prompt.trim()) return;
    const userMessage = prompt.trim();
    setPrompt('');
    await sendMessage(userMessage);
  };

  const handleProcessWithGemini = async () => {
    if (!generatedArticle) return;

    try {
      // Feedback no chat
      addMessage({
        role: 'assistant',
        content: MESSAGES.article.processing
      });

      const geminiResponse = await fetch(API_ENDPOINTS.processGemini, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          article: generatedArticle,
          articleType: selectedType
        })
      });

      if (!geminiResponse.ok) {
        const errorData = await geminiResponse.json();
        throw new Error(errorData.error || MESSAGES.errors.gemini);
      }

      const { article: refinedArticle } = await geminiResponse.json();

      // Atualizar artigo com versão refinada (preservando capa se existir)
      setGeneratedArticle({
        ...refinedArticle,
        coverImage: generatedArticle.coverImage || refinedArticle.coverImage,
        coverImageAlt: generatedArticle.coverImageAlt || refinedArticle.coverImageAlt,
        type: selectedType
      });

      // Confirmação no chat
      addMessage({
        role: 'assistant',
        content: MESSAGES.article.refined
      });

    } catch (error: unknown) {
      console.error('Erro ao processar com Gemini:', error);
      addMessage({
        role: 'assistant',
        content: MESSAGES.errors.refine(getErrorMessage(error))
      });
    }
  };

  const handleCopyProcessedArticle = async () => {
    if (!generatedArticle) return;

    try {
      let textToCopy;
      if (selectedType === 'resource') {
        textToCopy = JSON.stringify(generatedArticle, null, 2);
      } else {
        textToCopy = `# ${generatedArticle.title || generatedArticle.name}\n\n${generatedArticle.excerpt || generatedArticle.description || generatedArticle.shortDescription || ''}\n\n${generatedArticle.content || ''}`;
      }
      await navigator.clipboard.writeText(textToCopy);
      setCopiedProcessed(true);
      setTimeout(() => setCopiedProcessed(false), ANIMATION_DELAYS.copiedFeedback);
    } catch (error) {
      console.error('Erro ao copiar:', error);
    }
  };

  const handleRefine = async () => {
    if (!refinePrompt.trim() || !generatedArticle) return;

    const refinementRequest = refinePrompt.trim();
    setRefinePrompt('');
    setRefining(true);

    try {
      const response = await fetch(API_ENDPOINTS.refineArticle, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          article: generatedArticle,
          refinementPrompt: refinementRequest,
          articleType: selectedType
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao refinar artigo');
      }

      const { article: refinedArticle } = await response.json();

      setGeneratedArticle({
        ...refinedArticle,
        type: selectedType
      });

      // Adicionar feedback no chat
      addMessage({ role: 'user', content: `🎨 Refinar: ${refinementRequest}` });
      addMessage({ role: 'assistant', content: MESSAGES.article.refinedManual });

    } catch (error: unknown) {
      console.error('Erro ao refinar:', error);
      addMessage({
        role: 'assistant',
        content: MESSAGES.errors.refine(getErrorMessage(error))
      });
    } finally {
      setRefining(false);
    }
  };

  const handlePublish = async () => {
    if (!generatedArticle || !session?.user?.id || !selectedType) return;

    try {
      // Usar API correta baseado no tipo
      const apiEndpoint = getApiEndpoint(selectedType);

      // Preparar tags: se já é string JSON, manter; se é array, stringificar
      const tagsToSend = typeof generatedArticle.tags === 'string'
        ? generatedArticle.tags
        : JSON.stringify(generatedArticle.tags || []);

      // Preparar citations: armazenar em factCheckSources
      const citationsToSend = generatedArticle.citations && generatedArticle.citations.length > 0
        ? JSON.stringify(generatedArticle.citations)
        : undefined;

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...generatedArticle,
          published: selectedType !== 'resource' ? true : undefined, // published só existe em articles
          authorId: selectedType !== 'resource' ? session.user.id : undefined, // authorId só existe em articles
          tags: tagsToSend,
          factCheckSources: selectedType !== 'resource' ? citationsToSend : undefined // citations armazenadas em factCheckSources
        })
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Erro ao publicar');
      }

      // Redirecionar baseado no tipo
      const url = getArticleRoute(selectedType, generatedArticle.slug);
      router.push(url);

    } catch (error: unknown) {
      alert(MESSAGES.errors.publish(getErrorMessage(error)));
    }
  };

  return (
    <AdminRoute allowEditor={true}>
      <div className="min-h-screen overflow-x-hidden" style={{ background: 'var(--bg-primary)' }}>
        <div className="container mx-auto px-4 py-8 max-w-[1600px]">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-70 mb-4"
              style={{ color: 'var(--text-secondary)' }}
            >
              <FontAwesomeIcon icon={faArrowLeft} />
              Voltar ao Dashboard
            </Link>

            <h1
              className="text-4xl font-bold font-[family-name:var(--font-poppins)] mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              Criar Artigo com IA
            </h1>
            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
              Converse livremente com a IA para criar artigos completos
            </p>
          </div>

          <div className="space-y-6">
              {/* Área de Conversa */}
              <div
                className="rounded-2xl border overflow-hidden"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderColor: 'var(--border-medium)',
                }}
              >
                {/* Mensagens */}
                <div
                  ref={chatContainerRef}
                  className="p-6 space-y-4 overflow-y-auto overflow-x-hidden"
                  style={{ maxHeight: CHAT_CONFIG.maxHeight }}
                >
                  {conversation.length === 0 && (
                    <div className="py-12">
                      <div className="text-6xl mb-4">🤖</div>
                      <h3
                        className="text-xl font-bold mb-2 text-left"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {selectedType ? MESSAGES.chat.welcome.withType : MESSAGES.chat.welcome.withoutType}
                      </h3>
                      <p className="text-left mb-6" style={{ color: 'var(--text-secondary)' }}>
                        {selectedType ? MESSAGES.chat.description.withType : MESSAGES.chat.description.withoutType}
                      </p>

                      {/* Sugestões de Prompts */}
                      {!selectedType && (
                        <div className="space-y-3">
                          <p className="text-sm font-semibold text-left mb-3" style={{ color: 'var(--text-tertiary)' }}>
                            {MESSAGES.chat.suggestions}
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {PROMPT_SUGGESTIONS.map((suggestion, idx) => (
                              <button
                                key={idx}
                                onClick={() => setPrompt(suggestion.prompt)}
                                className="text-left px-4 py-3 rounded-xl transition-all hover:brightness-110 border"
                                style={{
                                  backgroundColor: 'var(--bg-secondary)',
                                  borderColor: 'var(--border-medium)',
                                  color: 'var(--text-primary)'
                                }}
                              >
                                <div className="text-2xl mb-1">{suggestion.emoji}</div>
                                <span className="font-medium text-sm">{suggestion.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {conversation.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-4 rounded-xl break-words overflow-wrap-anywhere ${
                          msg.role === 'user' ? 'rounded-br-none' : 'rounded-bl-none'
                        }`}
                        style={{
                          backgroundColor: msg.role === 'user' ? 'var(--brand-primary)' : 'var(--bg-secondary)',
                          color: msg.role === 'user' ? 'var(--text-inverse)' : 'var(--text-primary)',
                          wordBreak: 'break-word',
                          overflowWrap: 'break-word'
                        }}
                      >
                        <div className="prose prose-sm max-w-none">
                          <ReactMarkdown components={markdownComponents}>
                            {msg.content}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  ))}

                  {loading && (
                    <div className="flex justify-start">
                      <div
                        className="p-4 rounded-xl rounded-bl-none"
                        style={{ backgroundColor: 'var(--bg-secondary)' }}
                      >
                        <div className="flex gap-2">
                          <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: 'var(--brand-primary)', animationDelay: ANIMATION_DELAYS.bounce1 }}></div>
                          <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: 'var(--brand-primary)', animationDelay: ANIMATION_DELAYS.bounce2 }}></div>
                          <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: 'var(--brand-primary)', animationDelay: ANIMATION_DELAYS.bounce3 }}></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {processing && (
                    <div className="flex justify-start">
                      <div
                        className="p-4 rounded-xl rounded-bl-none flex items-center gap-2"
                        style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                      >
                        <FontAwesomeIcon icon={faSpinner} spin />
                        Processando com Gemini...
                      </div>
                    </div>
                  )}

                  <div ref={chatEndRef} />
                </div>

                {/* Input */}
                <div
                  className="p-4 border-t"
                  style={{ borderColor: 'var(--border-light)' }}
                >
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Digite sua mensagem..."
                      disabled={loading || processing}
                      className="flex-1 px-4 py-3 rounded-xl border focus:outline-none transition-colors"
                      style={{
                        backgroundColor: 'var(--bg-secondary)',
                        borderColor: 'var(--border-medium)',
                        color: 'var(--text-primary)'
                      }}
                      aria-label="Campo de entrada para conversar com a IA"
                      aria-describedby="chat-description"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!prompt.trim() || loading || processing}
                      className="px-6 py-3 rounded-xl font-semibold transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        backgroundColor: 'var(--brand-primary)',
                        color: 'var(--text-inverse)'
                      }}
                      aria-label={loading ? 'Aguardando resposta da IA' : 'Enviar mensagem'}
                    >
                      <FontAwesomeIcon icon={faPaperPlane} />
                    </button>
                  </div>
                  <span id="chat-description" className="sr-only">
                    {selectedType
                      ? `Modo de criação de ${selectedType === 'news' ? 'notícias' : selectedType === 'educational' ? 'artigos educacionais' : 'recursos'} ativado`
                      : 'Modo de conversa livre ativado'
                    }
                  </span>

                  {/* Seletor de Tipo - Movido para baixo do input */}
                  <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border-light)' }}>
                    <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
                      Selecione o tipo de artigo:
                    </h3>
                    <div className="flex gap-2" role="group" aria-label="Selecione o tipo de artigo">
                      {/* Botão Notícia */}
                      <button
                        onClick={() => setSelectedType(selectedType === 'news' ? null : 'news')}
                        className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${
                          selectedType === 'news' ? '' : 'hover:opacity-80'
                        }`}
                        style={{
                          backgroundColor: selectedType === 'news' ? 'var(--brand-primary)' : 'var(--bg-secondary)',
                          color: selectedType === 'news' ? 'var(--text-inverse)' : 'var(--text-primary)'
                        }}
                        aria-pressed={selectedType === 'news'}
                        aria-label={`${ARTICLE_TYPE_CONFIG.news.ariaLabel} ${selectedType === 'news' ? '(selecionado)' : ''}`}
                      >
                        <FontAwesomeIcon icon={faNewspaper} />
                        {ARTICLE_TYPE_CONFIG.news.label}
                      </button>

                      {/* Botão Educação */}
                      <button
                        onClick={() => setSelectedType(selectedType === 'educational' ? null : 'educational')}
                        className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${
                          selectedType === 'educational' ? '' : 'hover:opacity-80'
                        }`}
                        style={{
                          backgroundColor: selectedType === 'educational' ? 'var(--brand-primary)' : 'var(--bg-secondary)',
                          color: selectedType === 'educational' ? 'var(--text-inverse)' : 'var(--text-primary)'
                        }}
                        aria-pressed={selectedType === 'educational'}
                        aria-label={`${ARTICLE_TYPE_CONFIG.educational.ariaLabel} ${selectedType === 'educational' ? '(selecionado)' : ''}`}
                      >
                        <FontAwesomeIcon icon={faGraduationCap} />
                        {ARTICLE_TYPE_CONFIG.educational.label}
                      </button>

                      {/* Botão Recurso */}
                      <button
                        onClick={() => setSelectedType(selectedType === 'resource' ? null : 'resource')}
                        className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${
                          selectedType === 'resource' ? '' : 'hover:opacity-80'
                        }`}
                        style={{
                          backgroundColor: selectedType === 'resource' ? 'var(--brand-primary)' : 'var(--bg-secondary)',
                          color: selectedType === 'resource' ? 'var(--text-inverse)' : 'var(--text-primary)'
                        }}
                        aria-pressed={selectedType === 'resource'}
                        aria-label={`${ARTICLE_TYPE_CONFIG.resource.ariaLabel} ${selectedType === 'resource' ? '(selecionado)' : ''}`}
                      >
                        <FontAwesomeIcon icon={faBox} />
                        {ARTICLE_TYPE_CONFIG.resource.label}
                      </button>
                    </div>

                    {selectedType && (
                      <div
                        className="mt-3 p-3 rounded-lg text-sm"
                        style={{
                          backgroundColor: 'rgba(34, 197, 94, 0.15)',
                          borderLeft: '3px solid #22C55E',
                          color: 'var(--text-primary)'
                        }}
                      >
                        ✅ <strong>Modo Criação Ativado:</strong> {ARTICLE_TYPE_CONFIG[selectedType].description}
                      </div>
                    )}

                    {!selectedType && (
                      <div
                        className="mt-3 p-3 rounded-lg text-sm"
                        style={{
                          backgroundColor: 'rgba(59, 130, 246, 0.1)',
                          color: 'var(--text-primary)'
                        }}
                        dangerouslySetInnerHTML={{ __html: MESSAGES.chat.modeInfo.free }}
                      />
                    )}
                  </div>
                </div>
              </div>


              {/* Preview do Artigo (quando gerado) */}
              {generatedArticle && (
                <div
                  className="rounded-2xl p-6 border"
                  style={{
                    backgroundColor: 'var(--bg-elevated)',
                    borderColor: 'var(--border-medium)',
                  }}
                >
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <h2
                        className="text-2xl font-bold font-[family-name:var(--font-poppins)]"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        Preview do Artigo
                      </h2>
                      {generatedArticle.coverImage && (
                        <span className="px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1" style={{
                          backgroundColor: '#10B981',
                          color: 'white'
                        }}>
                          🎨 Com capa
                        </span>
                      )}
                      {/* Badge de Citations */}
                      {generatedArticle.citations && generatedArticle.citations.length > 0 ? (
                        <span className="px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1" style={{
                          backgroundColor: '#3B82F6',
                          color: 'white'
                        }}>
                          📚 {generatedArticle.citations.length} fontes
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1" style={{
                          backgroundColor: '#EF4444',
                          color: 'white'
                        }}>
                          ⚠️ Sem fontes
                        </span>
                      )}
                    </div>

                    {/* Ferramentas */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <button
                        onClick={() => {
                          // Scroll até a caixa de refinamento usando ref
                          refineSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }}
                        className="px-4 py-2 rounded-lg font-semibold text-sm transition-all hover:brightness-110 flex items-center gap-2"
                        style={{
                          backgroundColor: 'var(--bg-secondary)',
                          borderColor: 'var(--border-medium)',
                          border: '1px solid',
                          color: 'var(--text-primary)'
                        }}
                        aria-label="Scroll até a seção de edição manual do artigo"
                      >
                        <FontAwesomeIcon icon={faPen} />
                        Editar Manualmente
                      </button>

                      {selectedType !== 'resource' && (
                        <button
                          onClick={async () => {
                            if (!generatedArticle || !selectedType) return;
                            setGeneratingCover(true);
                            try {
                              const response = await fetch(API_ENDPOINTS.regenerateCover, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                  article: generatedArticle,
                                  articleType: selectedType
                                })
                              });

                              if (!response.ok) {
                                const errorData = await response.json();
                                throw new Error(errorData.error || 'Erro ao gerar capa');
                              }

                              const { article } = await response.json();
                              setGeneratedArticle({ ...article, type: selectedType });
                              addMessage({
                                role: 'assistant',
                                content: MESSAGES.article.coverGenerated
                              });
                            } catch (error: unknown) {
                              console.error('Erro ao gerar capa:', error);
                              addMessage({
                                role: 'assistant',
                                content: MESSAGES.errors.cover(getErrorMessage(error))
                              });
                            } finally {
                              setGeneratingCover(false);
                            }
                          }}
                          disabled={generatingCover || !selectedType}
                          className="px-4 py-2 rounded-lg font-semibold text-sm transition-all hover:brightness-110 flex items-center gap-2 disabled:opacity-50"
                          style={{
                            backgroundColor: 'var(--bg-secondary)',
                            borderColor: 'var(--border-medium)',
                            border: '1px solid',
                            color: 'var(--text-primary)'
                          }}
                        >
                          {generatingCover ? (
                            <>
                              <FontAwesomeIcon icon={faSpinner} spin />
                              Gerando...
                            </>
                          ) : (
                            <>
                              🎨 {generatedArticle.coverImage ? 'Nova Capa' : 'Gerar Capa'}
                            </>
                          )}
                        </button>
                      )}

                      <button
                        onClick={handleProcessWithGemini}
                        disabled={processing}
                        className="px-4 py-2 rounded-lg font-semibold text-sm transition-all hover:brightness-110 flex items-center gap-2 disabled:opacity-50"
                        style={{
                          backgroundColor: 'var(--bg-secondary)',
                          borderColor: 'var(--border-medium)',
                          border: '1px solid',
                          color: 'var(--text-primary)'
                        }}
                        aria-label={processing ? 'Refinando artigo com Gemini' : 'Refinar conteúdo do artigo usando Gemini AI'}
                      >
                        {processing ? (
                          <>
                            <FontAwesomeIcon icon={faSpinner} spin />
                            Refinando...
                          </>
                        ) : (
                          <>
                            ✨ Refinar com Gemini
                          </>
                        )}
                      </button>

                      <button
                        onClick={handleCopyProcessedArticle}
                        className="px-4 py-2 rounded-lg font-semibold text-sm transition-all hover:brightness-110 flex items-center gap-2"
                        style={{
                          backgroundColor: copiedProcessed ? '#10B981' : 'var(--bg-secondary)',
                          borderColor: 'var(--border-medium)',
                          border: '1px solid',
                          color: copiedProcessed ? 'white' : 'var(--text-primary)'
                        }}
                        aria-label={copiedProcessed ? 'Conteúdo copiado para área de transferência' : 'Copiar conteúdo do artigo'}
                      >
                        <FontAwesomeIcon icon={copiedProcessed ? faCheck : faCopy} />
                        {copiedProcessed ? 'Copiado!' : 'Copiar'}
                      </button>
                    </div>

                    {/* Botão Publicar (destaque) */}
                    <button
                      onClick={handlePublish}
                      disabled={processing}
                      className="px-8 py-3 rounded-xl font-bold text-base transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
                      style={{
                        backgroundColor: '#10B981',
                        color: 'white'
                      }}
                      aria-label={processing ? 'Publicando artigo no sistema' : 'Publicar artigo gerado'}
                    >
                      {processing ? (
                        <>
                          <FontAwesomeIcon icon={faSpinner} spin />
                          Publicando...
                        </>
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faCheck} />
                          Publicar Artigo
                        </>
                      )}
                    </button>
                  </div>

                  {/* Divisor */}
                  <div className="border-t my-6" style={{ borderColor: 'var(--border-light)' }}></div>

                  {/* Preview do Artigo (idêntico ao publicado) */}
                  {selectedType !== 'resource' ? (
                    <ArticlePreview
                      article={{
                        ...generatedArticle,
                        content: generatedArticle.content || ''
                      }}
                      articleType={selectedType!}
                    />
                  ) : (
                    // Preview simplificado para Resources
                    <div className="space-y-6">
                      <div className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-light)' }}>
                        <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                          {generatedArticle.name}
                        </h3>
                        <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
                          {generatedArticle.shortDescription}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1 rounded-lg text-sm font-semibold" style={{
                            backgroundColor: 'var(--brand-primary)',
                            color: 'white'
                          }}>
                            {generatedArticle.category}
                          </span>
                          {generatedArticle.platforms?.map((platform: string, idx: number) => (
                            <span key={idx} className="px-3 py-1 rounded-lg text-sm" style={{
                              backgroundColor: 'var(--bg-secondary)',
                              borderColor: 'var(--border-medium)',
                              border: '1px solid',
                              color: 'var(--text-primary)'
                            }}>
                              {platform}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                        <p>✅ Resource criado e pronto para publicação</p>
                        <p className="mt-2">O preview completo estará disponível após a publicação na página de recursos.</p>
                      </div>
                    </div>
                  )}

                  {/* Caixa de Refinamento */}
                  <div
                    ref={refineSectionRef}
                    className="mt-6 pt-6 border-t"
                    style={{ borderColor: 'var(--border-light)' }}
                  >
                    <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                      🎨 Refinar Artigo com IA
                    </h3>
                    <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                      Descreva as alterações que deseja fazer no artigo:
                    </p>
                    <div className="flex gap-3">
                      <textarea
                        value={refinePrompt}
                        onChange={(e) => setRefinePrompt(e.target.value)}
                        placeholder="Ex: Adicione mais detalhes sobre..., Mude o tom para mais técnico, Simplifique a linguagem..."
                        disabled={refining}
                        rows={3}
                        className="flex-1 px-4 py-3 rounded-xl border focus:outline-none transition-colors resize-none"
                        style={{
                          backgroundColor: 'var(--bg-secondary)',
                          borderColor: 'var(--border-medium)',
                          color: 'var(--text-primary)'
                        }}
                        aria-label="Campo para descrever alterações desejadas no artigo"
                      />
                      <button
                        onClick={handleRefine}
                        disabled={!refinePrompt.trim() || refining}
                        className="px-6 py-3 rounded-xl font-semibold transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed self-end flex items-center gap-2"
                        style={{
                          backgroundColor: 'var(--brand-primary)',
                          color: 'var(--text-inverse)'
                        }}
                        aria-label={refining ? 'Processando refinamento' : 'Enviar solicitação de refinamento'}
                      >
                        {refining ? (
                          <>
                            <FontAwesomeIcon icon={faSpinner} spin />
                            Refinando...
                          </>
                        ) : (
                          <>
                            <FontAwesomeIcon icon={faPaperPlane} />
                            Refinar
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </AdminRoute>
  );
}
