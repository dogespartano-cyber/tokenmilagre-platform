'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faNewspaper,
  faGraduationCap,
  faBox,
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

interface Resource {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  category: string;
  type: 'resource';
  verified: boolean;
  createdAt: string;
}

type ContentItem = Article | Resource;

export default function GerenciarArtigosPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'news' | 'educational' | 'resource'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);

      // Fetch articles
      const articlesParams = new URLSearchParams({
        published: 'all',
        limit: '100'
      });
      const articlesResponse = await fetch(`/api/admin/articles?${articlesParams}`);
      const articlesData = await articlesResponse.json();

      if (!articlesData.success) {
        throw new Error(articlesData.error || 'Erro ao buscar artigos');
      }

      // Fetch resources
      const resourcesResponse = await fetch('/api/resources');
      const resourcesData = await resourcesResponse.json();

      if (!resourcesData.success) {
        throw new Error(resourcesData.error || 'Erro ao buscar recursos');
      }

      setArticles(articlesData.data);
      setResources(resourcesData.data.map((r: any) => ({
        ...r,
        type: 'resource' as const
      })));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (slug: string, title: string, type: 'article' | 'resource') => {
    if (!confirm(`Tem certeza que deseja deletar "${title}"?`)) {
      return;
    }

    setDeleting(slug);
    try {
      const endpoint = type === 'resource' ? `/api/resources/${slug}` : `/api/articles/${slug}`;
      const response = await fetch(endpoint, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Erro ao deletar');
      }

      // Remove from list
      if (type === 'resource') {
        setResources(resources.filter(r => r.slug !== slug));
      } else {
        setArticles(articles.filter(a => a.slug !== slug));
      }
      alert('Item deletado com sucesso!');
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

  const handleEdit = (item: ContentItem) => {
    // Determine type
    let itemType = 'news';
    if ('type' in item && item.type === 'resource') {
      itemType = 'resource';
    } else if ('type' in item && item.type === 'educational') {
      itemType = 'educational';
    }

    // Redirect to editor page
    router.push(`/dashboard/editor?type=${itemType}&slug=${item.slug}`);
  };

  // Unify and filter content
  const allContent: ContentItem[] = [
    ...articles,
    ...resources
  ];

  const filteredContent = allContent.filter(item => {
    // Search filter
    const title = 'title' in item ? item.title : item.name;
    if (search && !title.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }

    // Type filter
    if (typeFilter !== 'all' && item.type !== typeFilter) {
      return false;
    }

    // Status filter (only for articles)
    if ('published' in item) {
      if (statusFilter === 'published' && !item.published) {
        return false;
      }
      if (statusFilter === 'draft' && item.published) {
        return false;
      }
    } else {
      // Resources don't have published status, skip if filtering by draft
      if (statusFilter === 'draft') {
        return false;
      }
    }

    return true;
  });

  // Sort by date
  const sortedContent = filteredContent.sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <AdminRoute allowEditor={false}>
      <div className="min-h-screen" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container mx-auto px-4 py-8">
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

            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1
                  className="text-4xl font-bold font-[family-name:var(--font-poppins)] mb-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  <FontAwesomeIcon icon={faNewspaper} className="mr-3" />
                  Gerenciar Conteúdo
                </h1>
                <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                  {sortedContent.length} item{sortedContent.length !== 1 ? 's' : ''} encontrado{sortedContent.length !== 1 ? 's' : ''}
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
                Criar Novo
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
                  onClick={fetchContent}
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
                  <option value="resource">Recursos</option>
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

          {/* Content Table */}
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
                    {sortedContent.map((item, index) => {
                      const isResource = 'type' in item && item.type === 'resource';
                      const title = isResource ? (item as Resource).name : (item as Article).title;
                      const description = isResource ? (item as Resource).shortDescription : (item as Article).excerpt;
                      const isPublished = isResource ? (item as Resource).verified : (item as Article).published;

                      let typeIcon = faNewspaper;
                      let typeLabel = 'Notícia';
                      let typeBgColor = '#dbeafe';
                      let typeTextColor = '#1e40af';

                      if (isResource) {
                        typeIcon = faBox;
                        typeLabel = 'Recurso';
                        typeBgColor = '#e0e7ff';
                        typeTextColor = '#4338ca';
                      } else if ((item as Article).type === 'educational') {
                        typeIcon = faGraduationCap;
                        typeLabel = 'Educacional';
                        typeBgColor = '#fef3c7';
                        typeTextColor = '#92400e';
                      }

                      return (
                        <tr
                          key={item.id}
                          className="border-t transition-colors hover:bg-opacity-50"
                          style={{
                            borderColor: 'var(--border-light)',
                            backgroundColor: index % 2 === 0 ? 'transparent' : 'var(--bg-secondary)'
                          }}
                        >
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                                {title}
                              </p>
                              <p className="text-sm truncate max-w-md" style={{ color: 'var(--text-tertiary)' }}>
                                {description}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold"
                              style={{
                                backgroundColor: typeBgColor,
                                color: typeTextColor
                              }}
                            >
                              <FontAwesomeIcon icon={typeIcon} className="w-3 h-3" />
                              {typeLabel}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                              {item.category}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {isResource ? (
                              <span
                                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold"
                                style={{
                                  backgroundColor: isPublished ? '#d1fae5' : '#fee2e2',
                                  color: isPublished ? '#065f46' : '#991b1b'
                                }}
                              >
                                <FontAwesomeIcon icon={isPublished ? faCheckCircle : faTimesCircle} className="w-3 h-3" />
                                {isPublished ? 'Verificado' : 'Não Verificado'}
                              </span>
                            ) : (
                              <button
                                onClick={() => handleTogglePublish(item.slug, (item as Article).published)}
                                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold transition-all hover:opacity-80"
                                style={{
                                  backgroundColor: isPublished ? '#d1fae5' : '#fee2e2',
                                  color: isPublished ? '#065f46' : '#991b1b'
                                }}
                              >
                                <FontAwesomeIcon icon={isPublished ? faCheckCircle : faTimesCircle} className="w-3 h-3" />
                                {isPublished ? 'Publicado' : 'Rascunho'}
                              </button>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                              {new Date(item.createdAt).toLocaleDateString('pt-BR')}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              {/* View */}
                              <Link
                                href={
                                  isResource
                                    ? `/recursos/${item.slug}`
                                    : (item as Article).type === 'news'
                                    ? `/dashboard/noticias/${item.slug}`
                                    : `/educacao/${item.slug}`
                                }
                                className="p-2 rounded-lg transition-all hover:scale-110"
                                style={{
                                  backgroundColor: 'var(--bg-secondary)',
                                  color: 'var(--text-primary)'
                                }}
                                title="Visualizar"
                              >
                                <FontAwesomeIcon icon={faEye} className="w-4 h-4" />
                              </Link>

                              {/* Edit */}
                              <button
                                onClick={() => handleEdit(item)}
                                className="p-2 rounded-lg transition-all hover:scale-110"
                                style={{
                                  backgroundColor: '#dbeafe',
                                  color: '#1e40af'
                                }}
                                title="Editar com IA"
                              >
                                <FontAwesomeIcon icon={faEdit} className="w-4 h-4" />
                              </button>

                              {/* Delete */}
                              <button
                                onClick={() => handleDelete(item.slug, title, isResource ? 'resource' : 'article')}
                                disabled={deleting === item.slug}
                                className="p-2 rounded-lg transition-all hover:scale-110 disabled:opacity-50"
                                style={{
                                  backgroundColor: '#fee2e2',
                                  color: '#991b1b'
                                }}
                                title="Deletar"
                              >
                                {deleting === item.slug ? (
                                  <FontAwesomeIcon icon={faSpinner} className="w-4 h-4 animate-spin" />
                                ) : (
                                  <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* Empty State */}
                {sortedContent.length === 0 && !loading && (
                  <div className="py-12 text-center">
                    <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                      Nenhum conteúdo encontrado
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
