/**
 * ArticlePreviewPanel Component
 * Preview e ações para artigos gerados
 * Inclui validação de veracidade com Gemini 3 Flash
 */

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faCopy, faPen, faCheck, faShieldAlt } from '@fortawesome/free-solid-svg-icons';
import ArticlePreview from '@/components/admin/ArticlePreview';
import { type ArticleType } from '../_lib/constants';
import type { ProcessedArticle } from '../_hooks/usePerplexityChat';
import ValidationResultPanel from './ValidationResultPanel';
import type { FactCheckResult } from '@/lib/shared/ai/gemini-validator';

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
  // Novas props para validação
  validating?: boolean;
  validationResult?: FactCheckResult | null;
  onValidate?: () => void;
  onClearValidation?: () => void;
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
  onPublish,
  // Validação
  validating = false,
  validationResult = null,
  onValidate,
  onClearValidation
}: ArticlePreviewPanelProps) {
  return (
    <div className="rounded-2xl p-6 border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-xl shadow-xl">
      <div className="mb-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <h2 className="text-2xl font-bold font-[family-name:var(--font-poppins)] text-gray-900 dark:text-white">
            Preview do Artigo
          </h2>
          {article.coverImage && (
            <span className="px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 bg-emerald-500 text-white">
              🎨 Com capa
            </span>
          )}
          {/* Badge de Citations */}
          {article.citations && article.citations.length > 0 ? (
            <span className="px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 bg-blue-500 text-white">
              📚 {article.citations.length} fontes
            </span>
          ) : (
            <span className="px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 bg-red-500 text-white">
              ⚠️ Sem fontes
            </span>
          )}
          {/* Badge de Validação */}
          {validationResult && (
            <span className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 text-white ${validationResult.status === 'verified' ? 'bg-emerald-500' :
              validationResult.status === 'partially_verified' ? 'bg-amber-500' :
                'bg-red-500'
              }`}>
              {validationResult.status === 'verified' ? '✓ Verificado' :
                validationResult.status === 'partially_verified' ? '⚠ Parcial' :
                  '✗ Não verificado'} ({validationResult.score}%)
            </span>
          )}
        </div>

        {/* Ferramentas */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => {
              refineSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }}
            className="px-4 py-2 rounded-lg font-semibold text-sm transition-all hover:brightness-110 flex items-center gap-2 border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10"
            aria-label="Scroll até a seção de edição manual do artigo"
          >
            <FontAwesomeIcon icon={faPen} />
            Editar Manualmente
          </button>

          {articleType !== 'resource' && (
            <button
              onClick={onGenerateCover}
              disabled={generatingCover}
              className="px-4 py-2 rounded-lg font-semibold text-sm transition-all hover:brightness-110 flex items-center gap-2 disabled:opacity-50 border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10"
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
            className="px-4 py-2 rounded-lg font-semibold text-sm transition-all hover:brightness-110 flex items-center gap-2 disabled:opacity-50 border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10"
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

          {/* NOVO: Botão de Validação */}
          {onValidate && articleType !== 'resource' && (
            <button
              onClick={onValidate}
              disabled={validating || processing}
              className="px-4 py-2 rounded-lg font-semibold text-sm transition-all hover:brightness-110 flex items-center gap-2 disabled:opacity-50 border border-purple-300 dark:border-purple-500/30 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/30"
              aria-label={validating ? 'Validando veracidade do artigo' : 'Validar veracidade do artigo com Gemini e Google Search'}
            >
              {validating ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin />
                  Validando...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faShieldAlt} />
                  🔍 Validar Veracidade
                </>
              )}
            </button>
          )}

          <button
            onClick={onCopyArticle}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all hover:brightness-110 flex items-center gap-2 border ${copiedProcessed
              ? 'bg-emerald-500 border-emerald-500 text-white'
              : 'border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10'
              }`}
            aria-label={copiedProcessed ? 'Conteúdo copiado para área de transferência' : 'Copiar conteúdo do artigo'}
          >
            <FontAwesomeIcon icon={copiedProcessed ? faCheck : faCopy} />
            {copiedProcessed ? 'Copiado!' : 'Copiar'}
          </button>
        </div>

        {/* Botão Publicar (destaque) */}
        <div className="flex justify-start">
          <button
            onClick={onPublish}
            disabled={processing}
            className="px-8 py-3 rounded-xl font-bold text-base transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg bg-teal-600 text-white shadow-teal-500/20 hover:shadow-teal-500/30"
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
      </div>

      {/* Resultado da Validação */}
      {validationResult && (
        <ValidationResultPanel
          result={validationResult}
          articleTitle={article.title || article.name || ''}
          articleContent={article.content || ''}
          onDismiss={onClearValidation}
        />
      )}

      {/* Divisor */}
      <div className="border-t border-gray-200 dark:border-white/10 my-6"></div>

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
          <div className="p-6 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              {article.name}
            </h3>
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              {article.shortDescription}
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-lg text-sm font-semibold bg-teal-600 text-white">
                {article.category}
              </span>
              {article.platforms?.map((platform: string, idx: number) => (
                <span key={idx} className="px-3 py-1 rounded-lg text-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-700 dark:text-gray-300">
                  {platform}
                </span>
              ))}
            </div>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p>✅ Resource criado e pronto para publicação</p>
            <p className="mt-2">O preview completo estará disponível após a publicação na página de recursos.</p>
          </div>
        </div>
      )}
    </div>
  );
}
