'use client';

import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faPaperPlane,
  faSpinner,
  faSave,
  faRobot,
  faCheckCircle,
  faEye,
  faCode
} from '@fortawesome/free-solid-svg-icons';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface EditSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  item: any; // Artigo ou Recurso
  itemType: 'news' | 'educational' | 'resource';
  onSave: (updatedItem: any) => void;
}

export default function EditSidebar({ isOpen, onClose, item, itemType, onSave }: EditSidebarProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [editedItem, setEditedItem] = useState<any>(item);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Update editedItem when item changes
  useEffect(() => {
    setEditedItem(item);
    setMessages([]);
  }, [item]);

  // Auto-scroll chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch('/api/refine-article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          article: editedItem,
          refinementPrompt: userMessage,
          articleType: itemType
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao processar');
      }

      const data = await response.json();

      // Atualizar item editado
      setEditedItem(data.article);

      // Adicionar resposta do Gemini
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '✅ **Alterações aplicadas!**\n\nConfira o preview atualizado abaixo. Você pode fazer mais ajustes ou salvar as mudanças.'
      }]);

    } catch (error: any) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `❌ **Erro:** ${error.message}`
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Determinar qual API usar baseado no tipo
      const apiEndpoint = itemType === 'resource'
        ? `/api/resources/${item.slug}`
        : `/api/articles/${item.slug}`;

      const response = await fetch(apiEndpoint, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedItem)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao salvar');
      }

      const data = await response.json();

      // Notificar pai e fechar sidebar
      onSave(data.data || editedItem);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '💾 **Salvo com sucesso!** As alterações foram aplicadas.'
      }]);

      setTimeout(() => {
        onClose();
      }, 1500);

    } catch (error: any) {
      alert(`Erro ao salvar: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className="fixed right-0 top-0 h-full w-full md:w-[800px] z-50 shadow-2xl transform transition-transform duration-300 flex flex-col"
        style={{ backgroundColor: 'var(--bg-primary)' }}
      >
        {/* Header */}
        <div
          className="px-6 py-4 border-b flex items-center justify-between"
          style={{ borderColor: 'var(--border-light)' }}
        >
          <div className="flex items-center gap-3">
            <FontAwesomeIcon icon={faRobot} className="text-2xl" style={{ color: 'var(--brand-primary)' }} />
            <div>
              <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Editar com IA
              </h2>
              <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                {itemType === 'resource' ? item.name : item.title}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Toggle Preview */}
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="px-3 py-2 rounded-lg font-semibold text-sm transition-colors"
              style={{
                backgroundColor: showPreview ? 'var(--brand-primary)' : 'var(--bg-secondary)',
                color: showPreview ? 'white' : 'var(--text-primary)'
              }}
            >
              <FontAwesomeIcon icon={showPreview ? faCode : faEye} className="mr-2" />
              {showPreview ? 'Chat' : 'Preview'}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-opacity-80 transition-colors"
              style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
        </div>

        {/* Content - Split View */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Preview or Chat */}
          {showPreview ? (
            /* Preview Area */
            <div className="flex-1 overflow-y-auto p-6" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              {itemType === 'resource' ? (
                /* Resource Preview */
                <div className="space-y-6">
                  {/* Hero Section */}
                  <div
                    className="rounded-2xl p-8 text-white"
                    style={{ background: editedItem.heroGradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                  >
                    <h1 className="text-4xl font-bold mb-3">
                      {editedItem.heroTitle || editedItem.name}
                    </h1>
                    <p className="text-lg opacity-90">
                      {editedItem.heroDescription || editedItem.shortDescription}
                    </p>
                  </div>

                  {/* Short Description */}
                  <div
                    className="rounded-xl p-4 border"
                    style={{
                      backgroundColor: 'var(--bg-elevated)',
                      borderColor: 'var(--border-light)'
                    }}
                  >
                    <p className="text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                      Descrição Curta:
                    </p>
                    <p style={{ color: 'var(--text-primary)' }}>
                      {editedItem.shortDescription}
                    </p>
                  </div>

                  {/* Features Preview */}
                  {editedItem.features && JSON.parse(typeof editedItem.features === 'string' ? editedItem.features : JSON.stringify(editedItem.features)).length > 0 && (
                    <div>
                      <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                        Funcionalidades ({JSON.parse(typeof editedItem.features === 'string' ? editedItem.features : JSON.stringify(editedItem.features)).length})
                      </h3>
                      <div className="grid grid-cols-1 gap-3">
                        {JSON.parse(typeof editedItem.features === 'string' ? editedItem.features : JSON.stringify(editedItem.features)).slice(0, 3).map((feature: any, idx: number) => (
                          <div
                            key={idx}
                            className="rounded-xl p-4 border"
                            style={{
                              backgroundColor: 'var(--bg-elevated)',
                              borderColor: 'var(--border-light)'
                            }}
                          >
                            <div className="flex items-start gap-3">
                              <span className="text-2xl">{feature.icon}</span>
                              <div>
                                <h4 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                                  {feature.title}
                                </h4>
                                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                  {feature.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                        {JSON.parse(typeof editedItem.features === 'string' ? editedItem.features : JSON.stringify(editedItem.features)).length > 3 && (
                          <p className="text-sm text-center" style={{ color: 'var(--text-tertiary)' }}>
                            ... e mais {JSON.parse(typeof editedItem.features === 'string' ? editedItem.features : JSON.stringify(editedItem.features)).length - 3} funcionalidades
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Pros/Cons Preview */}
                  {editedItem.pros && editedItem.cons && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-lg font-bold mb-3 text-green-600">
                          Prós ({JSON.parse(typeof editedItem.pros === 'string' ? editedItem.pros : JSON.stringify(editedItem.pros)).length})
                        </h3>
                        <ul className="space-y-2">
                          {JSON.parse(typeof editedItem.pros === 'string' ? editedItem.pros : JSON.stringify(editedItem.pros)).slice(0, 4).map((pro: string, idx: number) => (
                            <li key={idx} className="text-sm flex items-start gap-2">
                              <span className="text-green-500">✓</span>
                              <span style={{ color: 'var(--text-secondary)' }}>{pro}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold mb-3 text-red-600">
                          Contras ({JSON.parse(typeof editedItem.cons === 'string' ? editedItem.cons : JSON.stringify(editedItem.cons)).length})
                        </h3>
                        <ul className="space-y-2">
                          {JSON.parse(typeof editedItem.cons === 'string' ? editedItem.cons : JSON.stringify(editedItem.cons)).slice(0, 4).map((con: string, idx: number) => (
                            <li key={idx} className="text-sm flex items-start gap-2">
                              <span className="text-red-500">✗</span>
                              <span style={{ color: 'var(--text-secondary)' }}>{con}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  {editedItem.tags && (
                    <div>
                      <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                        Tags:
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {JSON.parse(typeof editedItem.tags === 'string' ? editedItem.tags : JSON.stringify(editedItem.tags)).map((tag: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-3 py-1 rounded-full text-sm"
                            style={{
                              backgroundColor: 'var(--bg-elevated)',
                              color: 'var(--text-primary)',
                              border: '1px solid var(--border-medium)'
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Article Preview */
                <div className="space-y-6">
                  <div>
                    <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                      {editedItem.title}
                    </h1>
                    <p className="text-lg mb-4" style={{ color: 'var(--text-secondary)' }}>
                      {editedItem.excerpt || editedItem.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--text-tertiary)' }}>
                      <span>📁 {editedItem.category}</span>
                      {editedItem.readTime && <span>⏱️ {editedItem.readTime}</span>}
                      {editedItem.level && <span>📊 {editedItem.level}</span>}
                    </div>
                  </div>

                  <div
                    className="prose prose-lg max-w-none"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    <ReactMarkdown>
                      {editedItem.content?.substring(0, 1000) || 'Sem conteúdo disponível...'}
                    </ReactMarkdown>
                    {editedItem.content?.length > 1000 && (
                      <p className="text-sm italic" style={{ color: 'var(--text-tertiary)' }}>
                        ... (preview limitado a 1000 caracteres)
                      </p>
                    )}
                  </div>

                  {editedItem.tags && (
                    <div>
                      <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                        Tags:
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {(Array.isArray(editedItem.tags) ? editedItem.tags : JSON.parse(editedItem.tags)).map((tag: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-3 py-1 rounded-full text-sm"
                            style={{
                              backgroundColor: 'var(--bg-elevated)',
                              color: 'var(--text-primary)',
                              border: '1px solid var(--border-medium)'
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* Chat Area */
            <div
              className="flex-1 overflow-y-auto p-4 space-y-4"
              ref={chatContainerRef}
            >
            {/* Initial Message */}
            {messages.length === 0 && (
              <div
                className="p-4 rounded-xl border"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderColor: 'var(--border-medium)'
                }}
              >
                <p className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  💬 Como posso ajudar?
                </p>
                <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                  Use linguagem natural para editar o conteúdo:
                </p>
                <ul className="text-sm space-y-1" style={{ color: 'var(--text-tertiary)' }}>
                  <li>• "Melhore o título para ser mais chamativo"</li>
                  <li>• "Adicione mais detalhes sobre segurança"</li>
                  <li>• "Corrija erros de português"</li>
                  <li>• "Simplifique a linguagem"</li>
                  <li>• "Expanda a seção de vantagens"</li>
                </ul>
              </div>
            )}

            {/* Messages */}
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-4 rounded-xl ${msg.role === 'user' ? 'rounded-br-none' : 'rounded-bl-none'}`}
                  style={{
                    backgroundColor: msg.role === 'user' ? 'var(--brand-primary)' : 'var(--bg-secondary)',
                    color: msg.role === 'user' ? 'white' : 'var(--text-primary)'
                  }}
                >
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => (
                        <p className="mb-2 last:mb-0">{children}</p>
                      ),
                      strong: ({ children }) => (
                        <strong className="font-bold">{children}</strong>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-disc list-inside space-y-1">{children}</ul>
                      )
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </div>
            ))}

            {/* Loading */}
            {loading && (
              <div className="flex justify-start">
                <div
                  className="p-4 rounded-xl rounded-bl-none"
                  style={{ backgroundColor: 'var(--bg-secondary)' }}
                >
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: 'var(--brand-primary)', animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: 'var(--brand-primary)', animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: 'var(--brand-primary)', animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div
          className="p-4 border-t"
          style={{ borderColor: 'var(--border-light)' }}
        >
          <div className="flex gap-3 mb-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
              placeholder="Digite suas instruções..."
              disabled={loading || saving}
              className="flex-1 px-4 py-3 rounded-xl border focus:outline-none transition-colors"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-medium)',
                color: 'var(--text-primary)'
              }}
            />
            <button
              onClick={handleSendMessage}
              disabled={!input.trim() || loading || saving}
              className="px-6 py-3 rounded-xl font-semibold transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: 'var(--brand-primary)',
                color: 'white'
              }}
            >
              {loading ? (
                <FontAwesomeIcon icon={faSpinner} spin />
              ) : (
                <FontAwesomeIcon icon={faPaperPlane} />
              )}
            </button>
          </div>

          {/* Save Button */}
          {messages.length > 0 && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full px-6 py-3 rounded-xl font-bold transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
              style={{
                backgroundColor: '#10B981',
                color: 'white'
              }}
            >
              {saving ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin />
                  Salvando...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faSave} />
                  Salvar Alterações
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </>
  );
}
