'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faSpinner,
  faPaperPlane,
  faSave,
  faRobot,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import AdminRoute from '@/components/AdminRoute';
import ReactMarkdown from 'react-markdown';
import ResourceDetailClient from '@/app/recursos/[slug]/ResourceDetailClient';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

function EditorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get('type'); // 'resource', 'news', 'educational'
  const slug = searchParams.get('slug');

  const [item, setItem] = useState<any>(null);
  const [editedItem, setEditedItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Chat states
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!type || !slug) {
      setError('Parâmetros inválidos');
      setLoading(false);
      return;
    }

    fetchItem();
  }, [type, slug]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchItem = async () => {
    try {
      setLoading(true);

      const endpoint = type === 'resource'
        ? `/api/resources/${slug}`
        : `/api/articles/${slug}`;

      const response = await fetch(endpoint);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Erro ao buscar item');
      }

      let fetchedItem = data.data;

      // Parse JSON fields for resources
      if (type === 'resource' && fetchedItem) {
        fetchedItem = {
          ...fetchedItem,
          platforms: typeof fetchedItem.platforms === 'string' ? JSON.parse(fetchedItem.platforms) : fetchedItem.platforms,
          tags: typeof fetchedItem.tags === 'string' ? JSON.parse(fetchedItem.tags) : fetchedItem.tags,
          features: typeof fetchedItem.features === 'string' ? JSON.parse(fetchedItem.features) : fetchedItem.features,
          howToStartSteps: typeof fetchedItem.howToStartSteps === 'string' ? JSON.parse(fetchedItem.howToStartSteps) : fetchedItem.howToStartSteps,
          pros: typeof fetchedItem.pros === 'string' ? JSON.parse(fetchedItem.pros) : fetchedItem.pros,
          cons: typeof fetchedItem.cons === 'string' ? JSON.parse(fetchedItem.cons) : fetchedItem.cons,
          faq: typeof fetchedItem.faq === 'string' ? JSON.parse(fetchedItem.faq) : fetchedItem.faq,
          securityTips: typeof fetchedItem.securityTips === 'string' ? JSON.parse(fetchedItem.securityTips) : fetchedItem.securityTips,
          whyGoodContent: typeof fetchedItem.whyGoodContent === 'string' ? JSON.parse(fetchedItem.whyGoodContent) : fetchedItem.whyGoodContent,
          relatedResources: fetchedItem.relatedResources ? (typeof fetchedItem.relatedResources === 'string' ? JSON.parse(fetchedItem.relatedResources) : fetchedItem.relatedResources) : [],
          hero: {
            title: fetchedItem.heroTitle || fetchedItem.name,
            description: fetchedItem.heroDescription || fetchedItem.shortDescription,
            gradient: fetchedItem.heroGradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          },
          whyGood: {
            title: fetchedItem.whyGoodTitle || `Por que ${fetchedItem.name}?`,
            content: typeof fetchedItem.whyGoodContent === 'string' ? JSON.parse(fetchedItem.whyGoodContent) : fetchedItem.whyGoodContent
          },
          howToStart: {
            title: fetchedItem.howToStartTitle || 'Como Começar',
            steps: typeof fetchedItem.howToStartSteps === 'string' ? JSON.parse(fetchedItem.howToStartSteps) : fetchedItem.howToStartSteps
          },
          prosAndCons: {
            pros: typeof fetchedItem.pros === 'string' ? JSON.parse(fetchedItem.pros) : fetchedItem.pros,
            cons: typeof fetchedItem.cons === 'string' ? JSON.parse(fetchedItem.cons) : fetchedItem.cons
          }
        };
      }

      setItem(fetchedItem);
      setEditedItem(fetchedItem);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  // Templates de prompts rápidos
  const promptTemplates = [
    { icon: '✨', label: 'Melhorar SEO', prompt: 'Otimize o título e tags para SEO sem alterar o conteúdo' },
    { icon: '📝', label: 'Simplificar', prompt: 'Simplifique a linguagem para iniciantes mantendo as informações' },
    { icon: '📚', label: 'Expandir', prompt: 'Adicione mais exemplos práticos e detalhes técnicos' },
    { icon: '🎯', label: 'Título Impactante', prompt: 'Reescreva o título para ser mais chamativo e incluir dados específicos' },
    { icon: '🔍', label: 'Corrigir Português', prompt: 'Corrija erros de gramática, ortografia e pontuação' },
  ];

  // Sugestões inteligentes da IA
  const handleSuggestImprovements = async () => {
    setMessages(prev => [...prev, {
      role: 'user',
      content: '🤖 Analisar e sugerir melhorias'
    }]);

    setChatLoading(true);
    try {
      const response = await fetch('/api/suggest-improvements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ article: editedItem, articleType: type })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao gerar sugestões');
      }

      const data = await response.json();

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.suggestions
      }]);
    } catch (error: any) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `❌ **Erro:** ${error.message}`
      }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || chatLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setChatLoading(true);

    try {
      const response = await fetch('/api/refine-article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          article: editedItem,
          refinementPrompt: userMessage,
          articleType: type
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao processar');
      }

      const data = await response.json();

      // Parse JSON fields for resources before updating
      let updatedArticle = data.article;
      if (type === 'resource' && updatedArticle) {
        updatedArticle = {
          ...updatedArticle,
          platforms: typeof updatedArticle.platforms === 'string' ? JSON.parse(updatedArticle.platforms) : updatedArticle.platforms,
          tags: typeof updatedArticle.tags === 'string' ? JSON.parse(updatedArticle.tags) : updatedArticle.tags,
          features: typeof updatedArticle.features === 'string' ? JSON.parse(updatedArticle.features) : updatedArticle.features,
          howToStartSteps: typeof updatedArticle.howToStartSteps === 'string' ? JSON.parse(updatedArticle.howToStartSteps) : updatedArticle.howToStartSteps,
          pros: typeof updatedArticle.pros === 'string' ? JSON.parse(updatedArticle.pros) : updatedArticle.pros,
          cons: typeof updatedArticle.cons === 'string' ? JSON.parse(updatedArticle.cons) : updatedArticle.cons,
          faq: typeof updatedArticle.faq === 'string' ? JSON.parse(updatedArticle.faq) : updatedArticle.faq,
          securityTips: typeof updatedArticle.securityTips === 'string' ? JSON.parse(updatedArticle.securityTips) : updatedArticle.securityTips,
          whyGoodContent: typeof updatedArticle.whyGoodContent === 'string' ? JSON.parse(updatedArticle.whyGoodContent) : updatedArticle.whyGoodContent,
          relatedResources: updatedArticle.relatedResources ? (typeof updatedArticle.relatedResources === 'string' ? JSON.parse(updatedArticle.relatedResources) : updatedArticle.relatedResources) : [],
          hero: {
            title: updatedArticle.heroTitle || updatedArticle.name,
            description: updatedArticle.heroDescription || updatedArticle.shortDescription,
            gradient: updatedArticle.heroGradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          },
          whyGood: {
            title: updatedArticle.whyGoodTitle || `Por que ${updatedArticle.name}?`,
            content: typeof updatedArticle.whyGoodContent === 'string' ? JSON.parse(updatedArticle.whyGoodContent) : updatedArticle.whyGoodContent
          },
          howToStart: {
            title: updatedArticle.howToStartTitle || 'Como Começar',
            steps: typeof updatedArticle.howToStartSteps === 'string' ? JSON.parse(updatedArticle.howToStartSteps) : updatedArticle.howToStartSteps
          },
          prosAndCons: {
            pros: typeof updatedArticle.pros === 'string' ? JSON.parse(updatedArticle.pros) : updatedArticle.pros,
            cons: typeof updatedArticle.cons === 'string' ? JSON.parse(updatedArticle.cons) : updatedArticle.cons
          }
        };
      }

      // Atualizar item editado - dispara re-render do preview
      setEditedItem(updatedArticle);

      // Construir mensagem de sucesso com validação
      let successMessage = '✅ **Alterações aplicadas!**\n\n';

      // Adicionar informação de validação se disponível
      if (data.validation) {
        const { score, valid, errors, warnings } = data.validation;

        // Badge de qualidade
        const qualityEmoji = score >= 90 ? '🌟' : score >= 80 ? '✨' : score >= 70 ? '👍' : '⚠️';
        successMessage += `${qualityEmoji} **Qualidade**: ${score}/100 ${valid ? '(Válido)' : '(Precisa de ajustes)'}\n\n`;

        // Erros
        if (errors.length > 0) {
          successMessage += `❌ **Erros encontrados** (${errors.length}):\n`;
          errors.forEach((error: string) => {
            successMessage += `  • ${error}\n`;
          });
          successMessage += '\n';
        }

        // Avisos
        if (warnings.length > 0) {
          successMessage += `⚠️ **Avisos** (${warnings.length}):\n`;
          warnings.forEach((warning: string) => {
            successMessage += `  • ${warning}\n`;
          });
          successMessage += '\n';
        }
      }

      successMessage += 'Confira o preview atualizado à esquerda. Você pode continuar editando ou salvar as mudanças.';

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: successMessage
      }]);

    } catch (error: any) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `❌ **Erro:** ${error.message}`
      }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const apiEndpoint = type === 'resource'
        ? `/api/resources/${slug}`
        : `/api/articles/${slug}`;

      // Para recursos, converter objetos aninhados de volta para formato flat
      let dataToSave = editedItem;
      if (type === 'resource') {
        dataToSave = {
          ...editedItem,
          // Extrair campos do objeto hero se existir
          heroTitle: editedItem.hero?.title || editedItem.heroTitle,
          heroDescription: editedItem.hero?.description || editedItem.heroDescription,
          heroGradient: editedItem.hero?.gradient || editedItem.heroGradient,
          // Extrair campos do objeto whyGood se existir
          whyGoodTitle: editedItem.whyGood?.title || editedItem.whyGoodTitle,
          whyGoodContent: editedItem.whyGood?.content || editedItem.whyGoodContent,
          // Extrair campos do objeto howToStart se existir
          howToStartTitle: editedItem.howToStart?.title || editedItem.howToStartTitle,
          howToStartSteps: editedItem.howToStart?.steps || editedItem.howToStartSteps,
          // Extrair campos do objeto prosAndCons se existir
          pros: editedItem.prosAndCons?.pros || editedItem.pros,
          cons: editedItem.prosAndCons?.cons || editedItem.cons,
        };
        // Remover objetos aninhados que não existem no banco
        delete dataToSave.hero;
        delete dataToSave.whyGood;
        delete dataToSave.howToStart;
        delete dataToSave.prosAndCons;
      }

      const response = await fetch(apiEndpoint, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSave)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao salvar');
      }

      alert('✅ Salvo com sucesso!');
      router.push('/dashboard/artigos');

    } catch (error: any) {
      alert(`Erro ao salvar: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (!type || !slug) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="text-center">
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-5xl mb-4 text-red-500" />
          <p className="text-xl" style={{ color: 'var(--text-primary)' }}>Parâmetros inválidos</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <FontAwesomeIcon icon={faSpinner} spin className="text-5xl" style={{ color: 'var(--brand-primary)' }} />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="text-center">
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-5xl mb-4 text-red-500" />
          <p className="text-xl mb-4" style={{ color: 'var(--text-primary)' }}>{error || 'Item não encontrado'}</p>
          <button
            onClick={() => router.push('/dashboard/artigos')}
            className="px-6 py-3 rounded-lg font-bold"
            style={{ backgroundColor: 'var(--brand-primary)', color: 'white' }}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      {/* Header */}
      <div
        className="px-6 py-4 border-b flex items-center justify-between"
        style={{
          backgroundColor: 'var(--bg-elevated)',
          borderColor: 'var(--border-light)'
        }}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/dashboard/artigos')}
            className="p-2 rounded-lg hover:bg-opacity-80 transition-colors"
            style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Editor com IA
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
              {type === 'resource' ? item.name : item.title}
            </p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || messages.length === 0}
          className="px-6 py-3 rounded-lg font-bold transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: '#10B981', color: 'white' }}
        >
          {saving ? (
            <>
              <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
              Salvando...
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faSave} className="mr-2" />
              Salvar Alterações
            </>
          )}
        </button>
      </div>

      {/* Split Screen */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Preview Real */}
        <div className="flex-1 overflow-y-auto border-r" style={{ borderColor: 'var(--border-light)' }}>
          {type === 'resource' && editedItem ? (
            <ResourceDetailClient resource={editedItem} relatedResources={[]} />
          ) : (
            /* Article Preview */
            <div className="container mx-auto px-4 py-8">
              <article className="max-w-4xl mx-auto">
                <h1 className="text-5xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                  {editedItem.title}
                </h1>
                <p className="text-xl mb-8" style={{ color: 'var(--text-secondary)' }}>
                  {editedItem.excerpt || editedItem.description}
                </p>
                <div className="flex items-center gap-4 mb-8 text-sm" style={{ color: 'var(--text-tertiary)' }}>
                  <span>📁 {editedItem.category}</span>
                  {editedItem.readTime && <span>⏱️ {editedItem.readTime}</span>}
                  {editedItem.level && <span>📊 {editedItem.level}</span>}
                </div>
                <div className="prose prose-lg max-w-none" style={{ color: 'var(--text-primary)' }}>
                  <ReactMarkdown>{editedItem.content || ''}</ReactMarkdown>
                </div>
              </article>
            </div>
          )}
        </div>

        {/* Right: Chat Gemini */}
        <div className="w-[400px] flex flex-col" style={{ backgroundColor: 'var(--bg-elevated)' }}>
          {/* Chat Header */}
          <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--border-light)' }}>
            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon={faRobot} className="text-2xl" style={{ color: 'var(--brand-primary)' }} />
              <div>
                <h2 className="font-bold" style={{ color: 'var(--text-primary)' }}>
                  Assistente IA
                </h2>
                <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                  Powered by Gemini 2.5 Flash
                </p>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={chatContainerRef}>
            {/* Initial Message */}
            {messages.length === 0 && (
              <div
                className="p-4 rounded-xl border"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderColor: 'var(--border-medium)'
                }}
              >
                <p className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  💬 Como posso ajudar?
                </p>
                <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                  Use linguagem natural para editar:
                </p>
                <ul className="text-sm space-y-1" style={{ color: 'var(--text-tertiary)' }}>
                  <li>• "Melhore o título"</li>
                  <li>• "Adicione mais detalhes sobre segurança"</li>
                  <li>• "Corrija erros de português"</li>
                  <li>• "Simplifique a linguagem"</li>
                  <li>• "Expanda a seção X"</li>
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
                    backgroundColor: msg.role === 'user' ? 'var(--brand-primary)' : 'var(--bg-primary)',
                    color: msg.role === 'user' ? 'white' : 'var(--text-primary)'
                  }}
                >
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
            ))}

            {/* Loading */}
            {chatLoading && (
              <div className="flex justify-start">
                <div className="p-4 rounded-xl rounded-bl-none" style={{ backgroundColor: 'var(--bg-primary)' }}>
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: 'var(--brand-primary)', animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: 'var(--brand-primary)', animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: 'var(--brand-primary)', animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t" style={{ borderColor: 'var(--border-light)' }}>
            {/* Quick Actions */}
            <div className="mb-3 space-y-2">
              {/* Suggest Button */}
              <button
                onClick={handleSuggestImprovements}
                disabled={chatLoading || saving}
                className="w-full px-4 py-2 rounded-lg font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                style={{
                  backgroundColor: '#8B5CF6',
                  color: 'white'
                }}
              >
                🤖 Analisar e Sugerir Melhorias
              </button>

              {/* Template Buttons */}
              <div className="flex flex-wrap gap-2">
                {promptTemplates.map((template, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInput(template.prompt)}
                    disabled={chatLoading || saving}
                    className="px-3 py-1 rounded-lg text-xs font-semibold transition-all hover:opacity-80 disabled:opacity-50"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border-medium)'
                    }}
                    title={template.prompt}
                  >
                    {template.icon} {template.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                placeholder="Digite suas instruções..."
                disabled={chatLoading || saving}
                className="flex-1 px-4 py-3 rounded-xl border focus:outline-none transition-colors"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderColor: 'var(--border-medium)',
                  color: 'var(--text-primary)'
                }}
              />
              <button
                onClick={handleSendMessage}
                disabled={!input.trim() || chatLoading || saving}
                className="px-6 py-3 rounded-xl font-semibold transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: 'var(--brand-primary)', color: 'white' }}
              >
                {chatLoading ? (
                  <FontAwesomeIcon icon={faSpinner} spin />
                ) : (
                  <FontAwesomeIcon icon={faPaperPlane} />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EditorPage() {
  return (
    <AdminRoute allowEditor={false}>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          <FontAwesomeIcon icon={faSpinner} spin className="text-5xl" style={{ color: 'var(--brand-primary)' }} />
        </div>
      }>
        <EditorContent />
      </Suspense>
    </AdminRoute>
  );
}
