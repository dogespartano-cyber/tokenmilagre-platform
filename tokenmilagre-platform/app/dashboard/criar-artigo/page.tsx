'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRobot,
  faNewspaper,
  faGraduationCap,
  faSpinner,
  faCheck,
  faExclamationTriangle,
  faEdit,
  faSave,
  faEye,
  faArrowLeft,
  faInfoCircle,
  faDollarSign,
  faBoxes
} from '@fortawesome/free-solid-svg-icons';
import AdminRoute from '@/components/AdminRoute';

interface GeneratedArticle {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  level?: string;
  tags: string[];
  readTime: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
}

interface Usage {
  inputTokens: number;
  outputTokens: number;
  estimatedCost: number;
}

export default function CriarArtigoPage() {
  const router = useRouter();
  const { data: session } = useSession();

  // Form state
  const [topic, setTopic] = useState('');
  const [type, setType] = useState<'news' | 'educational' | 'resource'>('news');
  const [model, setModel] = useState<'sonar' | 'sonar-pro'>('sonar');

  // Generation state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [article, setArticle] = useState<GeneratedArticle | null>(null);
  const [usage, setUsage] = useState<Usage | null>(null);

  // Edit state
  const [editing, setEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');

  // Publishing state
  const [publishing, setPublishing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('Preencha o tópico do artigo');
      return;
    }

    setLoading(true);
    setError(null);
    setArticle(null);

    try {
      const response = await fetch('/api/generate-article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          type,
          model
        })
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Erro ao gerar artigo');
      }

      setArticle(data.data);
      setEditedContent(data.data.content);
      setUsage(data.usage);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const confirmPublish = async () => {
    if (!article) return;

    if (!session?.user?.id) {
      setError('Sessão expirada. Faça login novamente.');
      setShowConfirmModal(false);
      return;
    }

    setPublishing(true);
    setError(null);
    setShowConfirmModal(false);

    try {
      // Para recursos, usar endpoint diferente
      if (type === 'resource') {
        const response = await fetch('/api/resources', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...article,
            content: editing ? editedContent : article.content
          })
        });

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || 'Erro ao publicar recurso');
        }

        router.push(`/recursos/${article.slug}`);
      } else {
        // Para artigos (news/educational)
        const response = await fetch('/api/articles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: article.title,
            slug: article.slug,
            excerpt: article.excerpt,
            content: editing ? editedContent : article.content,
            category: article.category,
            level: article.level,
            tags: JSON.stringify(article.tags),
            type: type === 'news' ? 'news' : 'educational',
            sentiment: article.sentiment || 'neutral',
            published: true,
            readTime: article.readTime,
            authorId: session.user.id
          })
        });

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || 'Erro ao publicar artigo');
        }

        // Redirect to article
        const url = type === 'news'
          ? `/dashboard/noticias/${article.slug}`
          : `/educacao/${article.slug}`;

        router.push(url);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao publicar');
      setPublishing(false);
    }
  };

  return (
    <AdminRoute allowEditor={true}>
      <div className="min-h-screen relative overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
        {/* Animated background blur orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-96 h-96 rounded-full blur-3xl animate-pulse" style={{ background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15), transparent)' }}></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full blur-3xl animate-pulse" style={{ background: 'radial-gradient(circle, rgba(59, 130, 246, 0.12), transparent)', animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl animate-pulse" style={{ background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1), transparent)', animationDelay: '2s' }}></div>
        </div>

        <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard/noticias"
            className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-70 mb-4"
            style={{ color: 'var(--text-secondary)' }}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Voltar
          </Link>

          <h1
            className="text-4xl font-bold font-[family-name:var(--font-poppins)] mb-2"
            style={{ color: 'var(--text-primary)' }}
          >
            <FontAwesomeIcon icon={faRobot} className="mr-3" />
            Criar Conteúdo com IA
          </h1>
          <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
            Gere notícias, artigos educacionais e recursos completos usando Perplexity AI
          </p>
        </div>

        <div className="grid lg:grid-cols-[420px_1fr] gap-8">
          {/* Form Sidebar */}
          <div
            className="group rounded-2xl p-6 border h-fit sticky top-24 backdrop-blur-2xl transition-all duration-300 hover:shadow-2xl"
            style={{
              backgroundColor: 'rgba(var(--bg-elevated-rgb), 0.85)',
              borderColor: 'var(--border-medium)',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.15)',
            }}
          >
            <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
              Configuração
            </h2>

            <div className="space-y-4">
              {/* Topic */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Tópico / Assunto
                </label>
                <textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Ex: Bitcoin atinge novo recorde de preço"
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none transition-colors resize-none"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-medium)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Tipo de Conteúdo
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setType('news')}
                    className={`px-3 py-3 rounded-lg border-2 font-semibold transition-all duration-300 ${
                      type === 'news'
                        ? ''
                        : 'hover:brightness-110'
                    }`}
                    style={{
                      backgroundColor: type === 'news' ? 'var(--brand-primary)' : 'rgba(var(--bg-secondary-rgb), 0.6)',
                      borderColor: type === 'news' ? 'var(--brand-primary)' : 'var(--border-medium)',
                      color: type === 'news' ? 'var(--text-inverse)' : 'var(--text-primary)',
                      filter: type === 'news' ? 'drop-shadow(0 0 8px var(--brand-primary))' : 'none'
                    }}
                  >
                    <FontAwesomeIcon icon={faNewspaper} className="mr-1" />
                    <span className="text-sm">Notícia</span>
                  </button>
                  <button
                    onClick={() => setType('educational')}
                    className={`px-3 py-3 rounded-lg border-2 font-semibold transition-all duration-300 ${
                      type === 'educational'
                        ? ''
                        : 'hover:brightness-110'
                    }`}
                    style={{
                      backgroundColor: type === 'educational' ? 'var(--brand-primary)' : 'rgba(var(--bg-secondary-rgb), 0.6)',
                      borderColor: type === 'educational' ? 'var(--brand-primary)' : 'var(--border-medium)',
                      color: type === 'educational' ? 'var(--text-inverse)' : 'var(--text-primary)',
                      filter: type === 'educational' ? 'drop-shadow(0 0 8px var(--brand-primary))' : 'none'
                    }}
                  >
                    <FontAwesomeIcon icon={faGraduationCap} className="mr-1" />
                    <span className="text-sm">Educação</span>
                  </button>
                  <button
                    onClick={() => setType('resource')}
                    className={`px-3 py-3 rounded-lg border-2 font-semibold transition-all duration-300 ${
                      type === 'resource'
                        ? ''
                        : 'hover:brightness-110'
                    }`}
                    style={{
                      backgroundColor: type === 'resource' ? 'var(--brand-primary)' : 'rgba(var(--bg-secondary-rgb), 0.6)',
                      borderColor: type === 'resource' ? 'var(--brand-primary)' : 'var(--border-medium)',
                      color: type === 'resource' ? 'var(--text-inverse)' : 'var(--text-primary)',
                      filter: type === 'resource' ? 'drop-shadow(0 0 8px var(--brand-primary))' : 'none'
                    }}
                  >
                    <FontAwesomeIcon icon={faBoxes} className="mr-1" />
                    <span className="text-sm">Recursos</span>
                  </button>
                </div>
              </div>

              {/* Info: IA determina categoria e nível */}
              <div
                className="rounded-lg p-3 border text-sm backdrop-blur-md transition-all duration-300"
                style={{
                  backgroundColor: 'rgba(var(--bg-secondary-rgb), 0.7)',
                  borderColor: 'var(--border-medium)',
                  color: 'var(--text-secondary)'
                }}
              >
                <FontAwesomeIcon icon={faRobot} className="mr-2 animate-pulse" style={{ color: 'var(--brand-primary)' }} />
                <strong>IA Inteligente:</strong> A categoria
                {type === 'educational' && ', nível'}
                {type === 'resource' && ' e características'}
                {' '}serão determinados automaticamente com base no tópico.
              </div>

              {/* Model */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Modelo
                </label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value as any)}
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none transition-colors"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-medium)',
                    color: 'var(--text-primary)'
                  }}
                >
                  <option value="sonar">Sonar (Básico) - ~$0.007/artigo</option>
                  <option value="sonar-pro">Sonar Pro (Avançado) - ~$0.03/artigo</option>
                </select>
                <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
                  {model === 'sonar'
                    ? '~700 artigos/mês com $5'
                    : '~160 artigos/mês com $5'}
                </p>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={loading || !topic.trim()}
                className="w-full px-6 py-3 rounded-lg font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110"
                style={{
                  background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-hover))',
                  color: 'var(--text-inverse)',
                  filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15))'
                }}
              >
                {loading ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} className="mr-2 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faRobot} className="mr-2" />
                    Gerar Conteúdo
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Preview Area */}
          <div className="space-y-6">
            {/* Error */}
            {error && (
              <div
                className="rounded-xl p-4 border flex items-start gap-3 backdrop-blur-xl animate-shake"
                style={{
                  backgroundColor: 'rgba(var(--bg-elevated-rgb), 0.85)',
                  borderColor: 'var(--error)',
                  boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.15)'
                }}
              >
                <FontAwesomeIcon icon={faExclamationTriangle} className="w-5 h-5 animate-pulse" style={{ color: 'var(--error)' }} />
                <div>
                  <p className="font-semibold" style={{ color: 'var(--error)' }}>Erro</p>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{error}</p>
                </div>
              </div>
            )}

            {/* Usage Stats */}
            {usage && (
              <div
                className="rounded-xl p-4 border backdrop-blur-2xl transition-all duration-300 hover:brightness-105"
                style={{
                  backgroundColor: 'rgba(var(--bg-elevated-rgb), 0.85)',
                  borderColor: 'var(--border-medium)',
                  boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.15)',
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <FontAwesomeIcon icon={faDollarSign} style={{ color: 'var(--brand-primary)' }} />
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Uso da API
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p style={{ color: 'var(--text-tertiary)' }}>Input:</p>
                    <p className="font-mono" style={{ color: 'var(--text-primary)' }}>
                      {usage.inputTokens} tokens
                    </p>
                  </div>
                  <div>
                    <p style={{ color: 'var(--text-tertiary)' }}>Output:</p>
                    <p className="font-mono" style={{ color: 'var(--text-primary)' }}>
                      {usage.outputTokens} tokens
                    </p>
                  </div>
                  <div>
                    <p style={{ color: 'var(--text-tertiary)' }}>Custo:</p>
                    <p className="font-mono font-bold" style={{ color: 'var(--brand-primary)' }}>
                      ${usage.estimatedCost.toFixed(6)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Article Preview */}
            {article && (
              <div
                className="rounded-2xl p-6 border backdrop-blur-2xl transition-all duration-300 hover:brightness-105"
                style={{
                  backgroundColor: 'rgba(var(--bg-elevated-rgb), 0.85)',
                  borderColor: 'var(--border-medium)',
                  boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.15)',
                }}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b" style={{ borderColor: 'var(--border-light)' }}>
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faCheck} className="text-green-500" />
                    <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                      Artigo Gerado
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditing(!editing)}
                      className="px-4 py-2 rounded-lg border font-semibold transition-all duration-300 backdrop-blur-sm hover:brightness-110"
                      style={{
                        backgroundColor: editing ? 'var(--brand-primary)' : 'rgba(var(--bg-secondary-rgb), 0.6)',
                        borderColor: editing ? 'var(--brand-primary)' : 'var(--border-medium)',
                        color: editing ? 'var(--text-inverse)' : 'var(--text-primary)',
                        filter: editing ? 'drop-shadow(0 0 6px var(--brand-primary))' : 'none'
                      }}
                    >
                      <FontAwesomeIcon icon={editing ? faEye : faEdit} className="mr-2" />
                      {editing ? 'Preview' : 'Editar'}
                    </button>
                    <button
                      onClick={() => setShowConfirmModal(true)}
                      disabled={publishing}
                      className="px-6 py-2 rounded-lg font-bold transition-all duration-300 disabled:opacity-50 hover:brightness-110"
                      style={{
                        background: 'linear-gradient(135deg, var(--success), #059669)',
                        color: 'white',
                        filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15))'
                      }}
                    >
                      {publishing ? (
                        <>
                          <FontAwesomeIcon icon={faSpinner} className="mr-2 animate-spin" />
                          Publicando...
                        </>
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faSave} className="mr-2" />
                          Publicar
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Metadata */}
                <div className="mb-6 pb-4 border-b" style={{ borderColor: 'var(--border-light)' }}>
                  <h2 className="text-3xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                    {article.title}
                  </h2>
                  <p className="text-lg mb-3" style={{ color: 'var(--text-secondary)' }}>
                    {article.excerpt}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full text-sm font-semibold" style={{
                      backgroundColor: 'var(--brand-primary)',
                      color: 'var(--text-inverse)'
                    }}>
                      {article.category}
                    </span>
                    {article.level && (
                      <span className="px-3 py-1 rounded-full text-sm font-semibold" style={{
                        backgroundColor: 'var(--bg-secondary)',
                        color: 'var(--text-primary)'
                      }}>
                        {article.level}
                      </span>
                    )}
                    <span className="px-3 py-1 rounded-full text-sm font-semibold" style={{
                      backgroundColor: 'var(--bg-secondary)',
                      color: 'var(--text-primary)'
                    }}>
                      {article.readTime}
                    </span>
                    {article.tags.map((tag, index) => (
                      <span key={index} className="px-3 py-1 rounded-full text-sm" style={{
                        backgroundColor: 'var(--bg-secondary)',
                        color: 'var(--text-tertiary)'
                      }}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Content */}
                {editing ? (
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                      Editar Conteúdo (Markdown)
                    </label>
                    <textarea
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      rows={25}
                      className="w-full px-4 py-3 rounded-lg border focus:outline-none transition-colors font-mono text-sm resize-none"
                      style={{
                        backgroundColor: 'var(--bg-secondary)',
                        borderColor: 'var(--border-medium)',
                        color: 'var(--text-primary)'
                      }}
                    />
                  </div>
                ) : (
                  <div
                    className="prose prose-lg max-w-none"
                    style={{ color: 'var(--text-primary)' }}
                    dangerouslySetInnerHTML={{
                      __html: require('marked').marked(editing ? editedContent : article.content)
                    }}
                  />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Modal de Confirmação */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div
              className="w-full max-w-md rounded-2xl border-2 p-6 backdrop-blur-2xl animate-scaleIn"
              style={{
                backgroundColor: 'rgba(var(--bg-elevated-rgb), 0.95)',
                borderColor: 'var(--border-strong)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
              }}
            >
              <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                Confirmar Publicação
              </h3>
              <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
                Tem certeza que deseja publicar este artigo? Ele ficará visível publicamente.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 rounded-lg border-2 font-semibold transition-all duration-300 backdrop-blur-sm hover:brightness-110"
                  style={{
                    backgroundColor: 'rgba(var(--bg-secondary-rgb), 0.6)',
                    borderColor: 'var(--border-medium)',
                    color: 'var(--text-primary)'
                  }}
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmPublish}
                  disabled={publishing}
                  className="px-4 py-2 rounded-lg font-bold transition-all duration-300 disabled:opacity-50 hover:brightness-110"
                  style={{
                    background: 'linear-gradient(135deg, var(--success), #059669)',
                    color: 'white',
                    filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15))'
                  }}
                >
                  {publishing ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} className="mr-2 animate-spin" />
                      Publicando...
                    </>
                  ) : (
                    'Confirmar'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </AdminRoute>
  );
}
