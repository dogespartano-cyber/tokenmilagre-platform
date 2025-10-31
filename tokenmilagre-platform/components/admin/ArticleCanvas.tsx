'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSave, faSpinner, faEye, faCode, faUndo } from '@fortawesome/free-solid-svg-icons';
import ReactMarkdown from 'react-markdown';

interface ArticleCanvasProps {
  isOpen: boolean;
  article: {
    id?: string;
    slug: string;
    title: string;
    content: string;
    summary?: string;
    category?: string;
    tags?: string[];
  } | null;
  onClose: () => void;
  onSave: (updatedArticle: any) => Promise<void>;
}

export default function ArticleCanvas({ isOpen, article, onClose, onSave }: ArticleCanvasProps) {
  const [editedContent, setEditedContent] = useState('');
  const [editedTitle, setEditedTitle] = useState('');
  const [editedSummary, setEditedSummary] = useState('');
  const [isSaving, setSaving] = useState(false);
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  const [hasChanges, setHasChanges] = useState(false);

  // Sincronizar com artigo quando abrir
  useEffect(() => {
    if (article && isOpen) {
      setEditedContent(article.content);
      setEditedTitle(article.title);
      setEditedSummary(article.summary || '');
      setHasChanges(false);

      // Disparar evento informando que canvas foi aberto com este artigo
      window.dispatchEvent(new CustomEvent('canvas-article-changed', {
        detail: { article }
      }));
    } else if (!isOpen) {
      // Canvas fechado
      window.dispatchEvent(new CustomEvent('canvas-article-changed', {
        detail: { article: null }
      }));
    }
  }, [article, isOpen]);

  // Escutar evento para aplicar edições automáticas
  useEffect(() => {
    const handleApplyEdit = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { content, title, summary } = customEvent.detail;

      if (content !== undefined) setEditedContent(content);
      if (title !== undefined) setEditedTitle(title);
      if (summary !== undefined) setEditedSummary(summary);
    };

    window.addEventListener('apply-canvas-edit', handleApplyEdit);
    return () => window.removeEventListener('apply-canvas-edit', handleApplyEdit);
  }, []);

  // Detectar mudanças
  useEffect(() => {
    if (article) {
      const changed =
        editedContent !== article.content ||
        editedTitle !== article.title ||
        editedSummary !== (article.summary || '');
      setHasChanges(changed);
    }
  }, [editedContent, editedTitle, editedSummary, article]);

  const handleSave = async () => {
    if (!article || !hasChanges) return;

    setSaving(true);
    try {
      await onSave({
        slug: article.slug,
        title: editedTitle,
        content: editedContent,
        summary: editedSummary
      });
      setHasChanges(false);
    } catch (error) {
      console.error('Erro ao salvar:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (article) {
      setEditedContent(article.content);
      setEditedTitle(article.title);
      setEditedSummary(article.summary || '');
      setHasChanges(false);
    }
  };

  const handleClose = () => {
    if (hasChanges) {
      if (confirm('Você tem alterações não salvas. Deseja fechar mesmo assim?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  if (!isOpen || !article) return null;

  return (
    <div className="fixed inset-0 z-50 flex" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      {/* Canvas - Lado direito */}
      <div
        className="ml-auto h-full w-full lg:w-2/3 flex flex-col shadow-2xl animate-slide-in"
        style={{ backgroundColor: 'var(--bg-primary)' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-4 border-b"
          style={{ borderColor: 'var(--border-medium)', backgroundColor: 'var(--bg-elevated)' }}
        >
          <div className="flex items-center gap-4 flex-1">
            <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Editando Artigo
            </h2>
            {hasChanges && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{
                backgroundColor: 'var(--brand-primary)',
                color: 'white'
              }}>
                Alterações não salvas
              </span>
            )}
          </div>

          {/* Botões de ação */}
          <div className="flex items-center gap-2">
            {/* Toggle Edit/Preview */}
            <button
              onClick={() => setViewMode(viewMode === 'edit' ? 'preview' : 'edit')}
              className="px-4 py-2 rounded-lg font-semibold transition-all hover:opacity-80"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-primary)'
              }}
            >
              <FontAwesomeIcon icon={viewMode === 'edit' ? faEye : faCode} className="w-4 h-4 mr-2" />
              {viewMode === 'edit' ? 'Preview' : 'Editar'}
            </button>

            {/* Reset */}
            {hasChanges && (
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-lg font-semibold transition-all hover:opacity-80"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-secondary)'
                }}
                title="Desfazer alterações"
              >
                <FontAwesomeIcon icon={faUndo} className="w-4 h-4" />
              </button>
            )}

            {/* Salvar */}
            <button
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              className="px-6 py-2 rounded-lg font-bold transition-all hover:opacity-90 disabled:opacity-50"
              style={{
                backgroundColor: hasChanges ? 'var(--brand-primary)' : 'var(--bg-secondary)',
                color: hasChanges ? 'white' : 'var(--text-tertiary)'
              }}
            >
              {isSaving ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faSave} className="w-4 h-4 mr-2" />
                  Salvar
                </>
              )}
            </button>

            {/* Fechar */}
            <button
              onClick={handleClose}
              className="p-2 rounded-lg transition-all hover:bg-opacity-80"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-primary)'
              }}
            >
              <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {viewMode === 'edit' ? (
            <>
              {/* Título */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Título
                </label>
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 font-bold text-lg transition-all focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-medium)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>

              {/* Resumo */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Resumo
                </label>
                <textarea
                  value={editedSummary}
                  onChange={(e) => setEditedSummary(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none focus:ring-2 focus:ring-brand-primary resize-none"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-medium)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>

              {/* Conteúdo Markdown */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Conteúdo (Markdown)
                </label>
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  rows={20}
                  className="w-full px-4 py-3 rounded-xl border-2 font-mono text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-primary resize-none"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-medium)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>

              {/* Info */}
              <div className="pt-4 border-t" style={{ borderColor: 'var(--border-light)' }}>
                <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                  <strong>Slug:</strong> {article.slug}
                </p>
                {article.category && (
                  <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
                    <strong>Categoria:</strong> {article.category}
                  </p>
                )}
                {article.tags && article.tags.length > 0 && (
                  <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
                    <strong>Tags:</strong> {article.tags.join(', ')}
                  </p>
                )}
              </div>
            </>
          ) : (
            // Preview Mode
            <div className="prose prose-lg max-w-none" style={{ color: 'var(--text-primary)' }}>
              <h1>{editedTitle}</h1>
              {editedSummary && (
                <p className="lead text-xl" style={{ color: 'var(--text-secondary)' }}>
                  {editedSummary}
                </p>
              )}
              <ReactMarkdown
                components={{
                  h1: ({ children }) => <h1 style={{ color: 'var(--text-primary)' }}>{children}</h1>,
                  h2: ({ children }) => <h2 style={{ color: 'var(--text-primary)' }}>{children}</h2>,
                  h3: ({ children }) => <h3 style={{ color: 'var(--text-primary)' }}>{children}</h3>,
                  p: ({ children }) => <p style={{ color: 'var(--text-secondary)' }}>{children}</p>,
                  a: ({ href, children }) => (
                    <a href={href} style={{ color: 'var(--brand-primary)' }} target="_blank" rel="noopener noreferrer">
                      {children}
                    </a>
                  ),
                  ul: ({ children }) => <ul style={{ color: 'var(--text-secondary)' }}>{children}</ul>,
                  ol: ({ children }) => <ol style={{ color: 'var(--text-secondary)' }}>{children}</ol>,
                  blockquote: ({ children }) => (
                    <blockquote style={{
                      borderLeftColor: 'var(--brand-primary)',
                      backgroundColor: 'var(--bg-secondary)',
                      color: 'var(--text-secondary)'
                    }}>
                      {children}
                    </blockquote>
                  ),
                  code: ({ children }) => (
                    <code style={{
                      backgroundColor: 'var(--bg-secondary)',
                      color: 'var(--brand-primary)',
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}>
                      {children}
                    </code>
                  ),
                }}
              >
                {editedContent}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }

        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
