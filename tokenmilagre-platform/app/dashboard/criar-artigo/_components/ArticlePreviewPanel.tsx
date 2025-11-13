/**
 * ArticlePreviewPanel Component
 * Preview e ações para artigos gerados
 */

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faCopy, faPen, faCheck } from '@fortawesome/free-solid-svg-icons';
import ArticlePreview from '@/components/admin/ArticlePreview';
import { type ArticleType, MESSAGES, API_ENDPOINTS, ANIMATION_DELAYS } from '../_lib/constants';
import type { ProcessedArticle } from '../_hooks/usePerplexityChat';

interface ArticlePreviewPanelProps {
  article: ProcessedArticle;
  articleType: ArticleType;
  copiedProcessed: boolean;
  generatingCover: boolean;
  processing: boolean;
  refineSectionRef: React.RefObject<HTMLDivElement | null>;
  onProcessWithGemini: () => void;
  onCopyArticle: () => void;
  onGenerateCover: () => Promise<void>;
  onPublish: () => void;
}

export default function ArticlePreviewPanel({
  article,
  articleType,
  copiedProcessed,
  generatingCover,
  processing,
  refineSectionRef,
  onProcessWithGemini,
  onCopyArticle,
  onGenerateCover,
  onPublish
}: ArticlePreviewPanelProps) {
  return (
    <div
      className="rounded-2xl p-6 border"
      style={{
        backgroundColor: 'var(--bg-elevated)',
        borderColor: 'var(--border-medium)',
      }}
    >
      <div className="mb-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <h2
            className="text-2xl font-bold font-[family-name:var(--font-poppins)]"
            style={{ color: 'var(--text-primary)' }}
          >
            Preview do Artigo
          </h2>
          {article.coverImage && (
            <span className="px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1" style={{
              backgroundColor: '#10B981',
              color: 'white'
            }}>
              🎨 Com capa
            </span>
          )}
          {/* Badge de Citations */}
          {article.citations && article.citations.length > 0 ? (
            <span className="px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1" style={{
              backgroundColor: '#3B82F6',
              color: 'white'
            }}>
              📚 {article.citations.length} fontes
            </span>
          ) : (
            <span className="px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1" style={{
              backgroundColor: '#EF4444',
              color: 'white'
            }}>
              ⚠️ Sem fontes
            </span>
          )}
        </div>

        {/* Ferramentas */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => {
              refineSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }}
            className="px-4 py-2 rounded-lg font-semibold text-sm transition-all hover:brightness-110 flex items-center gap-2"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-medium)',
              border: '1px solid',
              color: 'var(--text-primary)'
            }}
            aria-label="Scroll até a seção de edição manual do artigo"
          >
            <FontAwesomeIcon icon={faPen} />
            Editar Manualmente
          </button>

          {articleType !== 'resource' && (
            <button
              onClick={onGenerateCover}
              disabled={generatingCover}
              className="px-4 py-2 rounded-lg font-semibold text-sm transition-all hover:brightness-110 flex items-center gap-2 disabled:opacity-50"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-medium)',
                border: '1px solid',
                color: 'var(--text-primary)'
              }}
            >
              {generatingCover ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin />
                  Gerando...
                </>
              ) : (
                <>
                  🎨 {article.coverImage ? 'Nova Capa' : 'Gerar Capa'}
                </>
              )}
            </button>
          )}

          <button
            onClick={onProcessWithGemini}
            disabled={processing}
            className="px-4 py-2 rounded-lg font-semibold text-sm transition-all hover:brightness-110 flex items-center gap-2 disabled:opacity-50"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-medium)',
              border: '1px solid',
              color: 'var(--text-primary)'
            }}
            aria-label={processing ? 'Refinando artigo com Gemini' : 'Refinar conteúdo do artigo usando Gemini AI'}
          >
            {processing ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin />
                Refinando...
              </>
            ) : (
              <>
                ✨ Refinar com Gemini
              </>
            )}
          </button>

          <button
            onClick={onCopyArticle}
            className="px-4 py-2 rounded-lg font-semibold text-sm transition-all hover:brightness-110 flex items-center gap-2"
            style={{
              backgroundColor: copiedProcessed ? '#10B981' : 'var(--bg-secondary)',
              borderColor: 'var(--border-medium)',
              border: '1px solid',
              color: copiedProcessed ? 'white' : 'var(--text-primary)'
            }}
            aria-label={copiedProcessed ? 'Conteúdo copiado para área de transferência' : 'Copiar conteúdo do artigo'}
          >
            <FontAwesomeIcon icon={copiedProcessed ? faCheck : faCopy} />
            {copiedProcessed ? 'Copiado!' : 'Copiar'}
          </button>
        </div>

        {/* Botão Publicar (destaque) */}
        <button
          onClick={onPublish}
          disabled={processing}
          className="px-8 py-3 rounded-xl font-bold text-base transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
          style={{
            backgroundColor: '#10B981',
            color: 'white'
          }}
          aria-label={processing ? 'Publicando artigo no sistema' : 'Publicar artigo gerado'}
        >
          {processing ? (
            <>
              <FontAwesomeIcon icon={faSpinner} spin />
              Publicando...
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faCheck} />
              Publicar Artigo
            </>
          )}
        </button>
      </div>

      {/* Divisor */}
      <div className="border-t my-6" style={{ borderColor: 'var(--border-light)' }}></div>

      {/* Preview do Artigo */}
      {articleType !== 'resource' ? (
        <ArticlePreview
          article={{
            ...article,
            content: article.content || ''
          }}
          articleType={articleType}
        />
      ) : (
        // Preview simplificado para Resources
        <div className="space-y-6">
          <div className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-light)' }}>
            <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              {article.name}
            </h3>
            <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
              {article.shortDescription}
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-lg text-sm font-semibold" style={{
                backgroundColor: 'var(--brand-primary)',
                color: 'white'
              }}>
                {article.category}
              </span>
              {article.platforms?.map((platform: string, idx: number) => (
                <span key={idx} className="px-3 py-1 rounded-lg text-sm" style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderColor: 'var(--border-medium)',
                  border: '1px solid',
                  color: 'var(--text-primary)'
                }}>
                  {platform}
                </span>
              ))}
            </div>
          </div>
          <div className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
            <p>✅ Resource criado e pronto para publicação</p>
            <p className="mt-2">O preview completo estará disponível após a publicação na página de recursos.</p>
          </div>
        </div>
      )}
    </div>
  );
}
