'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faNewspaper,
  faGraduationCap,
  faArrowLeft,
  faSpinner,
  faExclamationTriangle,
  faSearch,
  faFilter,
  faEye,
  faEdit,
  faTrash,
  faCheckCircle,
  faTimesCircle,
  faPlus
} from '@fortawesome/free-solid-svg-icons';
import AdminRoute from '@/components/AdminRoute';

interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  type: string;
  level?: string | null;
  sentiment?: string | null;
  published: boolean;
  createdAt: string;
  author: {
    name: string | null;
    email: string;
  };
}

export default function GerenciarArtigosPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'news' | 'educational'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        published: 'all',
        limit: '100'
      });

      const response = await fetch(`/api/articles?${params}`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Erro ao buscar artigos');
      }

      setArticles(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (slug: string, title: string) => {
    if (!confirm(`Tem certeza que deseja deletar "${title}"?`)) {
      return;
    }

    setDeleting(slug);
    try {
      const response = await fetch(`/api/articles/${slug}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Erro ao deletar artigo');
      }

      // Remove from list
      setArticles(articles.filter(a => a.slug !== slug));
      alert('Artigo deletado com sucesso!');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao deletar');
    } finally {
      setDeleting(null);
    }
  };

  const handleTogglePublish = async (slug: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/articles/${slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !currentStatus })
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Erro ao atualizar artigo');
      }

      // Update list
      setArticles(articles.map(a =>
        a.slug === slug ? { ...a, published: !currentStatus } : a
      ));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao atualizar');
    }
  };

  // Filter articles
  const filteredArticles = articles.filter(article => {
    // Search filter
    if (search && !article.title.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }

    // Type filter
    if (typeFilter !== 'all' && article.type !== typeFilter) {
      return false;
    }

    // Status filter
    if (statusFilter === 'published' && !article.published) {
      return false;
    }
    if (statusFilter === 'draft' && article.published) {
      return false;
    }

    return true;
  });

  return (
    <AdminRoute allowEditor={false}>
      <div className="min-h-screen" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/dashboard/admin"
              className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-70 mb-4"
              style={{ color: 'var(--text-secondary)' }}
            >
              <FontAwesomeIcon icon={faArrowLeft} />
              Voltar ao Admin
            </Link>

            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1
                  className="text-4xl font-bold font-[family-name:var(--font-poppins)] mb-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  <FontAwesomeIcon icon={faNewspaper} className="mr-3" />
                  Gerenciar Artigos
                </h1>
                <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                  {filteredArticles.length} artigo{filteredArticles.length !== 1 ? 's' : ''} encontrado{filteredArticles.length !== 1 ? 's' : ''}
                </p>
              </div>

              <Link
                href="/dashboard/criar-artigo"
                className="flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all hover:opacity-90 shadow-md"
                style={{
                  background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-hover))',
                  color: 'white'
                }}
              >
                <FontAwesomeIcon icon={faPlus} />
                Criar Novo Artigo
              </Link>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div
              className="rounded-xl p-4 mb-6 border flex items-start gap-3"
              style={{
                backgroundColor: '#fef2f2',
                borderColor: '#ef4444',
              }}
            >
              <FontAwesomeIcon icon={faExclamationTriangle} className="w-5 h-5 text-red-500 mt-0.5" />
              <div>
                <p className="font-semibold text-red-700">Erro</p>
                <p className="text-sm text-red-600">{error}</p>
                <button
                  onClick={fetchArticles}
                  className="mt-2 text-sm font-semibold text-red-700 hover:underline"
                >
                  Tentar novamente
                </button>
              </div>
            </div>
          )}

          {/* Filters */}
          <div
            className="rounded-2xl p-6 border shadow-lg mb-6"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              borderColor: 'var(--border-light)'
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  <FontAwesomeIcon icon={faSearch} className="mr-2" />
                  Buscar
                </label>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar por título..."
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none transition-colors"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-medium)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>

              {/* Type Filter */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  <FontAwesomeIcon icon={faFilter} className="mr-2" />
                  Tipo
                </label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as any)}
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none transition-colors"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-medium)',
                    color: 'var(--text-primary)'
                  }}
                >
                  <option value="all">Todos</option>
                  <option value="news">Notícias</option>
                  <option value="educational">Educacionais</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none transition-colors"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-medium)',
                    color: 'var(--text-primary)'
                  }}
                >
                  <option value="all">Todos</option>
                  <option value="published">Publicados</option>
                  <option value="draft">Rascunhos</option>
                </select>
              </div>
            </div>
          </div>

          {/* Articles Table */}
          {loading ? (
            <div className="flex justify-center py-12">
              <FontAwesomeIcon
                icon={faSpinner}
                className="w-12 h-12 animate-spin"
                style={{ color: 'var(--brand-primary)' }}
              />
            </div>
          ) : (
            <div
              className="rounded-2xl border shadow-lg overflow-hidden"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border-light)'
              }}
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead style={{ backgroundColor: 'var(--bg-secondary)' }}>
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                        Título
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                        Tipo
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                        Categoria
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                        Data
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredArticles.map((article, index) => (
                      <tr
                        key={article.id}
                        className="border-t transition-colors hover:bg-opacity-50"
                        style={{
                          borderColor: 'var(--border-light)',
                          backgroundColor: index % 2 === 0 ? 'transparent' : 'var(--bg-secondary)'
                        }}
                      >
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                              {article.title}
                            </p>
                            <p className="text-sm truncate max-w-md" style={{ color: 'var(--text-tertiary)' }}>
                              {article.excerpt}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold"
                            style={{
                              backgroundColor: article.type === 'news' ? '#dbeafe' : '#fef3c7',
                              color: article.type === 'news' ? '#1e40af' : '#92400e'
                            }}
                          >
                            <FontAwesomeIcon icon={article.type === 'news' ? faNewspaper : faGraduationCap} className="w-3 h-3" />
                            {article.type === 'news' ? 'Notícia' : 'Educacional'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                            {article.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleTogglePublish(article.slug, article.published)}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold transition-all hover:opacity-80"
                            style={{
                              backgroundColor: article.published ? '#d1fae5' : '#fee2e2',
                              color: article.published ? '#065f46' : '#991b1b'
                            }}
                          >
                            <FontAwesomeIcon icon={article.published ? faCheckCircle : faTimesCircle} className="w-3 h-3" />
                            {article.published ? 'Publicado' : 'Rascunho'}
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                            {new Date(article.createdAt).toLocaleDateString('pt-BR')}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            {/* View */}
                            <Link
                              href={article.type === 'news' ? `/dashboard/noticias/${article.slug}` : `/educacao/${article.slug}`}
                              className="p-2 rounded-lg transition-all hover:scale-110"
                              style={{
                                backgroundColor: 'var(--bg-secondary)',
                                color: 'var(--text-primary)'
                              }}
                              title="Visualizar"
                            >
                              <FontAwesomeIcon icon={faEye} className="w-4 h-4" />
                            </Link>

                            {/* Delete */}
                            <button
                              onClick={() => handleDelete(article.slug, article.title)}
                              disabled={deleting === article.slug}
                              className="p-2 rounded-lg transition-all hover:scale-110 disabled:opacity-50"
                              style={{
                                backgroundColor: '#fee2e2',
                                color: '#991b1b'
                              }}
                              title="Deletar"
                            >
                              {deleting === article.slug ? (
                                <FontAwesomeIcon icon={faSpinner} className="w-4 h-4 animate-spin" />
                              ) : (
                                <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Empty State */}
                {filteredArticles.length === 0 && !loading && (
                  <div className="py-12 text-center">
                    <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                      Nenhum artigo encontrado
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminRoute>
  );
}
