'use client';

import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRobot,
  faPaperPlane,
  faTrash,
  faDownload,
  faChevronLeft,
  faChevronRight,
  faSpinner,
  faExclamationTriangle,
  faCheck,
  faInfoCircle,
  faCopy
} from '@fortawesome/free-solid-svg-icons';
import { useAdminChat } from '@/hooks/useAdminChat';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface AdminChatSidebarProps {
  pageData?: Record<string, any>;
  model?: 'sonar' | 'sonar-pro';
  provider?: 'perplexity' | 'gemini'; // Novo: escolher provider
  onApplyContent?: (content: string, originalText?: string, editMode?: 'selection' | 'full') => void;
  selectedText?: string; // Novo: texto selecionado
}

export default function AdminChatSidebar({
  pageData,
  model = 'sonar',
  provider = 'gemini', // Padrão: Gemini para editor
  onApplyContent,
  selectedText
}: AdminChatSidebarProps) {
  const [isOpen, setIsOpen] = useState(false); // Inicia oculto
  const [inputValue, setInputValue] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { messages, loading, error, sendMessage, clearHistory, exportHistory } = useAdminChat({
    pageData,
    model,
    provider,
    selectedText,
    onApply: onApplyContent
  });

  // Auto-scroll ao adicionar mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input quando abrir
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!inputValue.trim() || loading) return;

    await sendMessage(inputValue);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(messageId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
  };

  const detectCodeBlocks = (content: string): boolean => {
    return content.includes('```');
  };

  return (
    <>
      {/* Toggle Button (quando fechado) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed right-4 bottom-4 z-50 w-14 h-14 rounded-full shadow-2xl transition-all duration-300 hover:scale-110"
          style={{
            background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-hover))',
            color: 'var(--text-inverse)'
          }}
          aria-label="Abrir AI Assistant"
        >
          <FontAwesomeIcon icon={faRobot} className="text-xl animate-pulse" />
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full z-40 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          width: '420px',
          maxWidth: '100vw'
        }}
      >
        <div
          className="h-full flex flex-col border-l shadow-2xl backdrop-blur-xl"
          style={{
            backgroundColor: 'rgba(var(--bg-elevated-rgb), 0.95)',
            borderColor: 'var(--border-medium)'
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between p-4 border-b"
            style={{ borderColor: 'var(--border-light)' }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-hover))' }}
              >
                <FontAwesomeIcon icon={faRobot} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>
                  AI Assistant
                </h3>
                <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                  {provider === 'gemini' ? 'Gemini 2.5 Pro' : `Perplexity ${model === 'sonar-pro' ? 'Pro' : 'Sonar'}`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={exportHistory}
                disabled={messages.length === 0}
                className="p-2 rounded-lg hover:brightness-110 transition-all disabled:opacity-30"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-secondary)'
                }}
                aria-label="Exportar histórico"
                title="Exportar histórico"
              >
                <FontAwesomeIcon icon={faDownload} />
              </button>

              <button
                onClick={() => {
                  if (confirm('Limpar todo o histórico?')) {
                    clearHistory();
                  }
                }}
                disabled={messages.length === 0}
                className="p-2 rounded-lg hover:brightness-110 transition-all disabled:opacity-30"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-secondary)'
                }}
                aria-label="Limpar histórico"
                title="Limpar histórico"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg hover:brightness-110 transition-all"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-secondary)'
                }}
                aria-label="Fechar AI Assistant"
              >
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </div>
          </div>

          {/* Context Info */}
          {pageData && (
            <div
              className="p-3 border-b text-xs"
              style={{
                backgroundColor: 'rgba(var(--brand-primary-rgb), 0.1)',
                borderColor: 'var(--border-light)',
                color: 'var(--text-secondary)'
              }}
            >
              <FontAwesomeIcon icon={faInfoCircle} className="mr-2" style={{ color: 'var(--brand-primary)' }} />
              <strong>Contexto:</strong> {pageData.title || 'Criar Artigo'}
            </div>
          )}

          {/* Messages Area */}
          <div
            className="flex-1 overflow-y-auto p-4 space-y-4"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: 'var(--border-medium) transparent'
            }}
          >
            {messages.length === 0 && (
              <div className="text-center py-12">
                <div
                  className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(var(--brand-primary-rgb), 0.1)' }}
                >
                  <FontAwesomeIcon icon={faRobot} className="text-3xl" style={{ color: 'var(--brand-primary)' }} />
                </div>
                <p className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Como posso ajudar?
                </p>
                <p className="text-sm px-4" style={{ color: 'var(--text-secondary)' }}>
                  Peça sugestões, valide conteúdo, pesquise informações ou edite artigos em tempo real.
                </p>

                {/* Quick commands */}
                <div className="mt-6 space-y-2 px-4">
                  <p className="text-xs font-semibold" style={{ color: 'var(--text-tertiary)' }}>
                    Comandos disponíveis:
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <button
                      onClick={() => setInputValue('/create news ')}
                      className="px-3 py-1 rounded-full text-xs font-semibold transition-all hover:brightness-110"
                      style={{
                        backgroundColor: 'var(--brand-primary)',
                        color: 'var(--text-inverse)'
                      }}
                    >
                      /create news
                    </button>
                    <button
                      onClick={() => setInputValue('/create educational ')}
                      className="px-3 py-1 rounded-full text-xs font-semibold transition-all hover:brightness-110"
                      style={{
                        backgroundColor: 'var(--brand-primary)',
                        color: 'var(--text-inverse)'
                      }}
                    >
                      /create educational
                    </button>
                    <button
                      onClick={() => setInputValue('/validate')}
                      className="px-3 py-1 rounded-full text-xs font-semibold transition-all hover:brightness-110"
                      style={{
                        backgroundColor: 'var(--bg-secondary)',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      /validate
                    </button>
                    <button
                      onClick={() => setInputValue('/publish')}
                      className="px-3 py-1 rounded-full text-xs font-semibold transition-all hover:brightness-110"
                      style={{
                        backgroundColor: 'var(--success)',
                        color: 'white'
                      }}
                    >
                      /publish
                    </button>
                  </div>
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 ${
                    message.role === 'user'
                      ? 'rounded-br-none'
                      : 'rounded-bl-none'
                  }`}
                  style={{
                    backgroundColor: message.role === 'user'
                      ? 'var(--brand-primary)'
                      : 'var(--bg-secondary)',
                    color: message.role === 'user'
                      ? 'var(--text-inverse)'
                      : 'var(--text-primary)'
                  }}
                >
                  {message.role === 'assistant' ? (
                    <div className="prose prose-sm max-w-none">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: ({ children }) => (
                            <p className="mb-2 leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                              {children}
                            </p>
                          ),
                          code: ({ className, children }) => {
                            const isBlock = className?.includes('language-');
                            return isBlock ? (
                              <code
                                className={`block p-3 rounded-lg text-sm font-mono overflow-x-auto ${className}`}
                                style={{
                                  backgroundColor: 'rgba(var(--bg-elevated-rgb), 0.5)',
                                  color: 'var(--text-primary)'
                                }}
                              >
                                {children}
                              </code>
                            ) : (
                              <code
                                className="px-1.5 py-0.5 rounded text-sm font-mono"
                                style={{
                                  backgroundColor: 'rgba(var(--bg-elevated-rgb), 0.5)',
                                  color: 'var(--brand-primary)'
                                }}
                              >
                                {children}
                              </code>
                            );
                          },
                          strong: ({ children }) => (
                            <strong className="font-bold" style={{ color: 'var(--text-primary)' }}>
                              {children}
                            </strong>
                          ),
                          ul: ({ children }) => (
                            <ul className="list-disc list-inside space-y-1 my-2" style={{ color: 'var(--text-primary)' }}>
                              {children}
                            </ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="list-decimal list-inside space-y-1 my-2" style={{ color: 'var(--text-primary)' }}>
                              {children}
                            </ol>
                          ),
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  )}

                  {/* Actions */}
                  {message.role === 'assistant' && (
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t" style={{ borderColor: 'var(--border-light)' }}>
                      <button
                        onClick={() => handleCopy(message.content, message.id)}
                        className="text-xs px-2 py-1 rounded transition-all hover:brightness-110"
                        style={{
                          backgroundColor: 'rgba(var(--bg-elevated-rgb), 0.5)',
                          color: 'var(--text-secondary)'
                        }}
                        title="Copiar"
                      >
                        <FontAwesomeIcon
                          icon={copiedId === message.id ? faCheck : faCopy}
                          className="mr-1"
                        />
                        {copiedId === message.id ? 'Copiado' : 'Copiar'}
                      </button>

                      {detectCodeBlocks(message.content) && onApplyContent && (
                        <button
                          onClick={() => {
                            // Extrair código markdown
                            const codeMatch = message.content.match(/```(?:markdown)?\n([\s\S]*?)\n```/);
                            if (codeMatch) {
                              const extractedContent = codeMatch[1];

                              // 🔍 Detectar modo de edição baseado no conteúdo da mensagem
                              const isTrechoEdit = message.content.includes('**Mudanças**:') && extractedContent.length < 1000;
                              const detectedMode: 'selection' | 'full' = isTrechoEdit ? 'selection' : 'full';

                              // 🔍 Tentar extrair texto original da mensagem anterior do usuário
                              const messageIndex = messages.findIndex(m => m.id === message.id);
                              let originalText: string | undefined;

                              if (messageIndex > 0 && detectedMode === 'selection') {
                                const userMessage = messages[messageIndex - 1];
                                if (userMessage.role === 'user') {
                                  // Tentar extrair texto entre aspas
                                  const quotedMatch = userMessage.content.match(/"([^"]+)"/);
                                  if (quotedMatch) {
                                    originalText = quotedMatch[1];
                                  }
                                }
                              }

                              console.log('✅ [Aplicar] Modo:', detectedMode, '| Original text:', originalText?.substring(0, 100));

                              if (detectedMode === 'selection' && originalText) {
                                // Modo trecho: aplicar merge inteligente
                                onApplyContent(extractedContent, originalText, 'selection');
                              } else if (detectedMode === 'selection' && !originalText) {
                                // Trecho detectado mas sem texto original - avisar
                                const confirmed = confirm(
                                  `🎯 EDIÇÃO DE TRECHO DETECTADA\n\n` +
                                  `A IA retornou apenas o trecho editado (${extractedContent.length} caracteres).\n\n` +
                                  `Não foi possível detectar o texto original automaticamente.\n\n` +
                                  `Deseja aplicar como artigo completo?`
                                );

                                if (confirmed) {
                                  onApplyContent(extractedContent, undefined, 'full');
                                }
                              } else {
                                // Modo completo: substituir tudo
                                const minExpectedSize = 500;

                                if (extractedContent.length < minExpectedSize) {
                                  const confirmed = confirm(
                                    `⚠️ ATENÇÃO\n\n` +
                                    `O conteúdo tem apenas ${extractedContent.length} caracteres.\n\n` +
                                    `Isso pode ser apenas um TRECHO.\n\n` +
                                    `Deseja continuar?\n\n` +
                                    `💡 Dica: Peça "retorne o artigo completo com a correção"`
                                  );

                                  if (!confirmed) {
                                    return;
                                  }
                                }

                                onApplyContent(extractedContent, undefined, 'full');
                              }
                            }
                          }}
                          className="text-xs px-2 py-1 rounded font-semibold transition-all hover:brightness-110"
                          style={{
                            backgroundColor: 'var(--success)',
                            color: 'white'
                          }}
                          title="Aplicar sugestão"
                        >
                          <FontAwesomeIcon icon={faCheck} className="mr-1" />
                          Aplicar
                        </button>
                      )}
                    </div>
                  )}

                  <p className="text-xs mt-2 opacity-60">
                    {message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div
                  className="max-w-[85%] rounded-2xl rounded-bl-none p-3"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-primary)'
                  }}
                >
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                  Pensando...
                </div>
              </div>
            )}

            {error && (
              <div
                className="rounded-lg p-3 border flex items-start gap-2"
                style={{
                  backgroundColor: 'rgba(var(--error-rgb), 0.1)',
                  borderColor: 'var(--error)',
                  color: 'var(--error)'
                }}
              >
                <FontAwesomeIcon icon={faExclamationTriangle} className="mt-0.5" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div
            className="p-4 border-t"
            style={{ borderColor: 'var(--border-light)' }}
          >
            <div className="flex gap-2">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Pergunte algo ou use /validate, /titles, /tags..."
                rows={2}
                disabled={loading}
                className="flex-1 px-3 py-2 rounded-lg border resize-none focus:outline-none transition-colors"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderColor: 'var(--border-medium)',
                  color: 'var(--text-primary)'
                }}
              />
              <button
                onClick={handleSend}
                disabled={loading || !inputValue.trim()}
                className="px-4 rounded-lg font-bold transition-all disabled:opacity-50 hover:brightness-110"
                style={{
                  background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-hover))',
                  color: 'var(--text-inverse)'
                }}
                aria-label="Enviar mensagem"
              >
                <FontAwesomeIcon icon={loading ? faSpinner : faPaperPlane} className={loading ? 'animate-spin' : ''} />
              </button>
            </div>
            <p className="text-xs mt-2 text-center" style={{ color: 'var(--text-tertiary)' }}>
              Enter para enviar • Shift+Enter para nova linha
            </p>
          </div>
        </div>
      </div>

      {/* Overlay (quando aberto em mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
