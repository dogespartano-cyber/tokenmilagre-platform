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
  faPlus,
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import AdminRoute from '@/components/AdminRoute';
import ToastContainer from '@/components/ToastContainer';
import ConfirmDialog from '@/components/ConfirmDialog';
import { useToast } from '@/hooks/useToast';

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

// Type guards
function isResource(item: ContentItem): item is Resource {
  return 'type' in item && item.type === 'resource';
}

function isArticle(item: ContentItem): item is Article {
  return !isResource(item);
}

export default function GerenciarArtigosPage() {
  const router = useRouter();
  const toast = useToast();
  const [articles, setArticles] = useState<Article[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [publishingSlug, setPublishingSlug] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  // Filters
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'news' | 'educational' | 'resource'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');

  // Confirm dialog
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      setError(null);

      // ✅ REFATORAÇÃO 1: Paralelizar fetches com Promise.all
      const [articlesData, resourcesData] = await Promise.all([
        fetch(`/api/admin/articles?${new URLSearchParams({ published: 'all', limit: '100' })}`).then(r => r.json()),
        // ✅ REFATORAÇÃO 7: Passar parâmetro verified explícito
        fetch('/api/resources?verified=all').then(r => r.json())
      ]);

      if (!articlesData.success) {
        throw new Error(articlesData.error || 'Erro ao buscar artigos');
      }

      if (!resourcesData.success) {
        throw new Error(resourcesData.error || 'Erro ao buscar recursos');
      }

      setArticles(articlesData.data);
      setResources(resourcesData.data.map((r: any) => ({
        ...r,
        type: 'resource' as const
      })));
      setCurrentPage(1); // Reset to first page on data refresh
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // ✅ REFATORAÇÃO 4: Substituir alert/confirm por UI moderna
  const handleDelete = (slug: string, title: string, type: 'article' | 'resource') => {
    setConfirmDialog({
      isOpen: true,
      title: 'Confirmar exclusão',
      message: `Tem certeza que deseja deletar "${title}"? Esta ação não pode ser desfeita.`,
      onConfirm: async () => {
        setConfirmDialog({ ...confirmDialog, isOpen: false });
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

          toast.success('Item deletado com sucesso!');
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar';
          toast.error(errorMessage);
        } finally {
          setDeleting(null);
        }
      }
    });
  };

  // ✅ REFATORAÇÃO 3: Adicionar loading state para toggle publish
  const handleTogglePublish = async (slug: string, currentStatus: boolean) => {
    // Prevent multiple clicks
    if (publishingSlug === slug) return;

    setPublishingSlug(slug);
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

      toast.success(`Artigo ${!currentStatus ? 'publicado' : 'despublicado'} com sucesso!`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar';
      toast.error(errorMessage);
    } finally {
      setPublishingSlug(null);
    }
  };

  // ✅ REFATORAÇÃO 6: Usar type guards ao invés de assertions
  const handleEdit = (item: ContentItem) => {
    let itemType = 'news';

    if (isResource(item)) {
      itemType = 'resource';
    } else if (item.type === 'educational') {
      itemType = 'educational';
    }

    router.push(`/dashboard/editor?type=${itemType}&slug=${item.slug}`);
  };

  // ✅ REFATORAÇÃO 5: Simplificar lógica de filtros com helper function
  const filterContent = (items: ContentItem[]): ContentItem[] => {
    return items.filter(item => {
      // Search filter
      const title = isResource(item) ? item.name : item.title;
      if (search && !title.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }

      // Type filter
      if (typeFilter !== 'all' && item.type !== typeFilter) {
        return false;
      }

      // Status filter (only applies to articles)
      if (statusFilter !== 'all') {
        if (isResource(item)) {
          // Resources don't have draft status, exclude if filtering by draft
          return statusFilter !== 'draft';
        }
        // For articles
        return statusFilter === 'published' ? item.published : !item.published;
      }

      return true;
    });
  };

  // Unify content
  const allContent: ContentItem[] = [...articles, ...resources];

  // Apply filters
  const filteredContent = filterContent(allContent);

  // Sort by date
  const sortedContent = filteredContent.sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // ✅ REFATORAÇÃO 2: Adicionar paginação
  const totalPages = Math.ceil(sortedContent.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedContent = sortedContent.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AdminRoute allowEditor={false}>
      {/* Toast Notifications */}
      <ToastContainer toasts={toast.toasts} onClose={toast.close} />

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmLabel="Deletar"
        cancelLabel="Cancelar"
        variant="danger"
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
      />

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
                  {totalPages > 1 && ` • Página ${currentPage} de ${totalPages}`}
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
                    {paginatedContent.map((item, index) => {
                      // ✅ Use type guards instead of assertions
                      const itemIsResource = isResource(item);
                      const title = itemIsResource ? item.name : item.title;
                      const description = itemIsResource ? item.shortDescription : item.excerpt;
                      const isPublished = itemIsResource ? item.verified : item.published;

                      let typeIcon = faNewspaper;
                      let typeLabel = 'Notícia';
                      let typeBgColor = '#dbeafe';
                      let typeTextColor = '#1e40af';

                      if (itemIsResource) {
                        typeIcon = faBox;
                        typeLabel = 'Recurso';
                        typeBgColor = '#e0e7ff';
                        typeTextColor = '#4338ca';
                      } else if (item.type === 'educational') {
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
                            {itemIsResource ? (
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
                                onClick={() => handleTogglePublish(item.slug, item.published)}
                                disabled={publishingSlug === item.slug}
                                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold transition-all hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{
                                  backgroundColor: isPublished ? '#d1fae5' : '#fee2e2',
                                  color: isPublished ? '#065f46' : '#991b1b'
                                }}
                              >
                                {publishingSlug === item.slug ? (
                                  <FontAwesomeIcon icon={faSpinner} className="w-3 h-3 animate-spin" />
                                ) : (
                                  <FontAwesomeIcon icon={isPublished ? faCheckCircle : faTimesCircle} className="w-3 h-3" />
                                )}
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
                                  itemIsResource
                                    ? `/recursos/${item.slug}`
                                    : item.type === 'news'
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
                                onClick={() => handleDelete(item.slug, title, itemIsResource ? 'resource' : 'article')}
                                disabled={deleting === item.slug}
                                className="p-2 rounded-lg transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
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

          {/* Pagination Controls */}
          {!loading && totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-80"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderColor: 'var(--border-medium)',
                  color: 'var(--text-primary)',
                  border: '1px solid'
                }}
              >
                <FontAwesomeIcon icon={faChevronLeft} className="w-4 h-4" />
              </button>

              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  // Show first page, last page, current page, and pages around current
                  const showPage =
                    page === 1 ||
                    page === totalPages ||
                    Math.abs(page - currentPage) <= 1;

                  const showEllipsis =
                    (page === 2 && currentPage > 3) ||
                    (page === totalPages - 1 && currentPage < totalPages - 2);

                  if (showEllipsis) {
                    return (
                      <span
                        key={page}
                        className="px-4 py-2"
                        style={{ color: 'var(--text-tertiary)' }}
                      >
                        ...
                      </span>
                    );
                  }

                  if (!showPage) return null;

                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className="px-4 py-2 rounded-lg font-semibold transition-all hover:opacity-80"
                      style={{
                        backgroundColor: page === currentPage ? 'var(--brand-primary)' : 'var(--bg-elevated)',
                        color: page === currentPage ? 'white' : 'var(--text-primary)',
                        border: page === currentPage ? 'none' : '1px solid var(--border-medium)'
                      }}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-80"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderColor: 'var(--border-medium)',
                  color: 'var(--text-primary)',
                  border: '1px solid'
                }}
              >
                <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </AdminRoute>
  );
}
