'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faSpinner,
  faSave,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import AdminRoute from '@/components/AdminRoute';
import ReactMarkdown from 'react-markdown';
import ResourceDetailClient from '@/app/recursos/[slug]/ResourceDetailClient';
import AdminChatSidebar from '@/components/admin/AdminChatSidebar';
import { AdminChatProvider, useAdminChatContext } from '@/contexts/AdminChatContext';

function EditorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get('type'); // 'resource', 'news', 'educational'
  const slug = searchParams.get('slug');

  const { pageData, setPageData } = useAdminChatContext();

  const [item, setItem] = useState<any>(null);
  const [editedItem, setEditedItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!type || !slug) {
      setError('Parâmetros inválidos');
      setLoading(false);
      return;
    }

    fetchItem();
  }, [type, slug]);

  // Atualizar pageData quando editedItem mudar
  useEffect(() => {
    if (editedItem) {
      setPageData({
        title: type === 'resource' ? editedItem.name : editedItem.title,
        content: editedItem.content || '',
        type: type,
        category: editedItem.category,
        tags: editedItem.tags,
        excerpt: editedItem.excerpt || editedItem.shortDescription || '',
        slug: slug,
        fullArticle: editedItem
      });
    }
  }, [editedItem, type, slug, setPageData]);

  // Listener para eventos de edição do chat
  useEffect(() => {
    const handleApplyEdit = (event: any) => {
      const { content } = event.detail;
      if (content && editedItem) {
        setEditedItem({
          ...editedItem,
          content: content
        });
      }
    };

    const handleArticleGenerated = (event: any) => {
      const article = event.detail;
      if (article) {
        // Atualizar com artigo gerado/refinado
        setEditedItem({
          ...editedItem,
          ...article
        });
      }
    };

    window.addEventListener('apply-canvas-edit', handleApplyEdit);
    window.addEventListener('article-generated', handleArticleGenerated);

    return () => {
      window.removeEventListener('apply-canvas-edit', handleApplyEdit);
      window.removeEventListener('article-generated', handleArticleGenerated);
    };
  }, [editedItem]);

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
          disabled={saving}
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

      {/* Preview Full Screen */}
      <div className="flex-1 overflow-y-auto">
        {type === 'resource' && editedItem ? (
          <ResourceDetailClient resource={editedItem} relatedResources={[]} />
        ) : (
          /* Article Preview - Mesmos estilos da página publicada */
          <div className="py-8">
            <div className="flex gap-8" style={{ paddingLeft: '55px', paddingRight: '1rem' }}>
              <div className="flex-1 max-w-4xl space-y-8">
                {/* Header do Artigo */}
                <div className="space-y-6">
                  {/* Meta info */}
                  <div className="flex flex-wrap items-center gap-3">
                    {editedItem.level && (
                      <span
                        className="px-3 py-1 rounded-lg text-sm font-semibold"
                        style={{
                          backgroundColor: editedItem.level === 'iniciante' ? '#22c55e' : editedItem.level === 'intermediario' ? '#3b82f6' : '#a855f7',
                          color: 'white'
                        }}
                      >
                        {editedItem.level === 'iniciante' ? 'Iniciante' : editedItem.level === 'intermediario' ? 'Intermediário' : 'Avançado'}
                      </span>
                    )}
                    {editedItem.type && (
                      <span
                        className="px-3 py-1 rounded-lg text-sm font-semibold"
                        style={{
                          backgroundColor: 'var(--bg-secondary)',
                          color: 'var(--text-primary)'
                        }}
                      >
                        {editedItem.type}
                      </span>
                    )}
                    {editedItem.readTime && (
                      <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                        📖 {editedItem.readTime}
                      </span>
                    )}
                  </div>

                  {/* Título */}
                  <h1 className="text-4xl md:text-5xl font-bold leading-tight font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
                    {editedItem.title}
                  </h1>

                  {/* Descrição */}
                  <p className="text-xl leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {editedItem.excerpt || editedItem.description}
                  </p>

                  {/* Tags */}
                  {editedItem.tags && Array.isArray(editedItem.tags) && editedItem.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {editedItem.tags.map((tag: string, index: number) => (
                        <span
                          key={index}
                          className="px-3 py-1 rounded-lg text-sm"
                          style={{
                            backgroundColor: 'var(--bg-secondary)',
                            color: 'var(--text-tertiary)'
                          }}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div className="border-t" style={{ borderColor: 'var(--border-light)' }}></div>

                {/* Conteúdo do Artigo */}
                <article
                  className="prose prose-lg max-w-none"
                  style={{ color: 'var(--text-primary)' }}
                >
                  <ReactMarkdown
                    components={{
                      h1: ({ children }) => (
                        <h1 className="text-3xl font-bold mt-8 mb-4 font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
                          {children}
                        </h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-2xl font-bold mt-8 mb-4 font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-xl font-bold mt-6 mb-3 font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
                          {children}
                        </h3>
                      ),
                      p: ({ children }) => (
                        <p className="mb-4 leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                          {children}
                        </p>
                      ),
                      ul: ({ children }) => (
                        <ul className="mb-4 space-y-2 list-disc list-inside" style={{ color: 'var(--text-primary)' }}>
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="mb-4 space-y-2 list-decimal list-inside" style={{ color: 'var(--text-primary)' }}>
                          {children}
                        </ol>
                      ),
                      li: ({ children }) => (
                        <li className="ml-4" style={{ color: 'var(--text-primary)' }}>
                          {children}
                        </li>
                      ),
                      strong: ({ children }) => (
                        <strong className="font-bold" style={{ color: 'var(--text-primary)' }}>
                          {children}
                        </strong>
                      ),
                      code: ({ children }) => (
                        <code
                          className="px-2 py-1 rounded text-sm font-mono"
                          style={{
                            backgroundColor: 'var(--bg-secondary)',
                            color: 'var(--brand-primary)'
                          }}
                        >
                          {children}
                        </code>
                      ),
                      blockquote: ({ children }) => (
                        <blockquote
                          className="pl-4 border-l-4 italic my-4"
                          style={{
                            borderColor: 'var(--brand-primary)',
                            color: 'var(--text-secondary)'
                          }}
                        >
                          {children}
                        </blockquote>
                      ),
                    }}
                  >
                    {editedItem.content || ''}
                  </ReactMarkdown>
                </article>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AdminChatSidebar - Substituindo chat built-in */}
      <AdminChatSidebar
        pageData={pageData}
        provider="gemini"
        onApplyContent={(content) => {
          if (editedItem) {
            setEditedItem({
              ...editedItem,
              content: content
            });
          }
        }}
      />
    </div>
  );
}

function EditorWithContext() {
  return (
    <AdminChatProvider>
      <EditorContent />
    </AdminChatProvider>
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
        <EditorWithContext />
      </Suspense>
    </AdminRoute>
  );
}
