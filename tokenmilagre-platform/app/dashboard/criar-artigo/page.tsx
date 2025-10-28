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
  faDollarSign
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
  const [type, setType] = useState<'news' | 'educational'>('news');
  const [category, setCategory] = useState('bitcoin');
  const [level, setLevel] = useState<'iniciante' | 'intermediario' | 'avancado'>('intermediario');
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

  const categories = type === 'news'
    ? ['bitcoin', 'ethereum', 'defi', 'politica', 'nfts', 'altcoins', 'regulacao', 'mercado']
    : ['blockchain', 'trading', 'defi', 'nfts', 'seguranca', 'desenvolvimento'];

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
          category,
          level: type === 'educational' ? level : undefined,
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao publicar');
      setPublishing(false);
    }
  };

  return (
    <AdminRoute allowEditor={true}>
      <div className="min-h-screen" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container mx-auto px-4 py-8">
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
            Criar Artigo com IA
          </h1>
          <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
            Gere artigos educacionais e notícias usando Perplexity AI
          </p>
        </div>

        {/* Info Card */}
        <div
          className="rounded-xl p-4 mb-6 border flex items-start gap-3"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            borderColor: 'var(--border-light)',
          }}
        >
          <FontAwesomeIcon
            icon={faInfoCircle}
            className="w-5 h-5 mt-0.5"
            style={{ color: 'var(--brand-primary)' }}
          />
          <div className="flex-1">
            <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
              Como funciona
            </p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              O sistema gera artigos seguindo as regras da plataforma: remove títulos H1 duplicados,
              fontes e notas de transparência. Para notícias, aplica estrutura jornalística
              (Fato → Contexto → Impacto → Visão → Reflexão → Desafios).
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-[400px_1fr] gap-6">
          {/* Form Sidebar */}
          <div
            className="rounded-2xl p-6 border shadow-lg h-fit sticky top-24"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              borderColor: 'var(--border-light)',
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
                  Tipo de Artigo
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setType('news')}
                    className={`px-4 py-3 rounded-lg border-2 font-semibold transition-all ${
                      type === 'news' ? 'shadow-md' : ''
                    }`}
                    style={{
                      backgroundColor: type === 'news' ? 'var(--brand-primary)' : 'var(--bg-secondary)',
                      borderColor: type === 'news' ? 'var(--brand-primary)' : 'var(--border-medium)',
                      color: type === 'news' ? 'var(--text-inverse)' : 'var(--text-primary)'
                    }}
                  >
                    <FontAwesomeIcon icon={faNewspaper} className="mr-2" />
                    Notícia
                  </button>
                  <button
                    onClick={() => setType('educational')}
                    className={`px-4 py-3 rounded-lg border-2 font-semibold transition-all ${
                      type === 'educational' ? 'shadow-md' : ''
                    }`}
                    style={{
                      backgroundColor: type === 'educational' ? 'var(--brand-primary)' : 'var(--bg-secondary)',
                      borderColor: type === 'educational' ? 'var(--brand-primary)' : 'var(--border-medium)',
                      color: type === 'educational' ? 'var(--text-inverse)' : 'var(--text-primary)'
                    }}
                  >
                    <FontAwesomeIcon icon={faGraduationCap} className="mr-2" />
                    Educacional
                  </button>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Categoria
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none transition-colors"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-medium)',
                    color: 'var(--text-primary)'
                  }}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Level (only for educational) */}
              {type === 'educational' && (
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                    Nível
                  </label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value as any)}
                    className="w-full px-4 py-2 rounded-lg border focus:outline-none transition-colors"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      borderColor: 'var(--border-medium)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    <option value="iniciante">Iniciante</option>
                    <option value="intermediario">Intermediário</option>
                    <option value="avancado">Avançado</option>
                  </select>
                </div>
              )}

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
                className="w-full px-6 py-3 rounded-lg font-bold transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                style={{
                  background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-hover))',
                  color: 'var(--text-inverse)'
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
                    Gerar Artigo
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
                className="rounded-xl p-4 border flex items-start gap-3"
                style={{
                  backgroundColor: '#fef2f2',
                  borderColor: '#ef4444',
                }}
              >
                <FontAwesomeIcon icon={faExclamationTriangle} className="w-5 h-5 text-red-500" />
                <div>
                  <p className="font-semibold text-red-700">Erro</p>
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              </div>
            )}

            {/* Usage Stats */}
            {usage && (
              <div
                className="rounded-xl p-4 border"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderColor: 'var(--border-light)',
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
                className="rounded-2xl p-6 border shadow-lg"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderColor: 'var(--border-light)',
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
                      className="px-4 py-2 rounded-lg border font-semibold transition-all hover:opacity-80"
                      style={{
                        backgroundColor: editing ? 'var(--brand-primary)' : 'var(--bg-secondary)',
                        borderColor: 'var(--border-medium)',
                        color: editing ? 'var(--text-inverse)' : 'var(--text-primary)'
                      }}
                    >
                      <FontAwesomeIcon icon={editing ? faEye : faEdit} className="mr-2" />
                      {editing ? 'Preview' : 'Editar'}
                    </button>
                    <button
                      onClick={() => setShowConfirmModal(true)}
                      disabled={publishing}
                      className="px-6 py-2 rounded-lg font-bold transition-all hover:opacity-90 disabled:opacity-50 shadow-md"
                      style={{
                        background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                        color: 'white'
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
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div
              className="w-full max-w-md rounded-2xl border-2 shadow-2xl p-6"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border-medium)'
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
                  className="px-4 py-2 rounded-lg border-2 font-semibold transition-all hover:opacity-80"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-medium)',
                    color: 'var(--text-primary)'
                  }}
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmPublish}
                  disabled={publishing}
                  className="px-4 py-2 rounded-lg font-bold transition-all hover:opacity-90 disabled:opacity-50 shadow-md"
                  style={{
                    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                    color: 'white'
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
