/**
 * ArticlePreviewPanel Component
 * Preview e ações para artigos gerados
 */

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faCopy, faCheck } from '@fortawesome/free-solid-svg-icons';
import ArticlePreview from '@/components/admin/ArticlePreview';
import { type ArticleType } from '../_lib/constants';
import type { ProcessedArticle } from '../_hooks/usePerplexityChat';

interface ArticlePreviewPanelProps {
    article: ProcessedArticle;
    articleType: ArticleType;
    copiedProcessed: boolean;
    processing: boolean;
    onCopyArticle: () => void;
    onPublish: () => void;
}

export default function ArticlePreviewPanel({
    article,
    articleType,
    copiedProcessed,
    processing,
    onCopyArticle,
    onPublish,
}: ArticlePreviewPanelProps) {
    return (
        <div className="rounded-2xl p-6 border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-xl shadow-xl">
            <div className="mb-6">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                    <h2 className="text-2xl title-newtab ">
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
                </div>

                {/* Ferramentas */}
                <div className="flex flex-wrap gap-2 mb-4">
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
                        <h3 className="title-newtab text-xl mb-4">
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
