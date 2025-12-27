'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDatabase,
  faTrash,
  faExclamationTriangle,
  faCheck,
  faSpinner,
  faChevronDown,
  faChevronUp,
  faEdit,
  faNewspaper,
  faGraduationCap,
  faToolbox,
  faTimes,
  faClipboard
} from '@fortawesome/free-solid-svg-icons';
import { DraftStorageService, type DraftArticle, type PublishErrorLog } from '@/lib/shared/services/draft-storage.service';

interface CacheManagerProps {
  onDraftSelect?: (draft: DraftArticle) => void;
  onClose?: () => void;
}

export default function CacheManager({ onDraftSelect, onClose }: CacheManagerProps) {
  const [drafts, setDrafts] = useState<DraftArticle[]>([]);
  const [errorLogs, setErrorLogs] = useState<Array<{ articleTitle: string } & PublishErrorLog>>([]);
  const [expandedDraft, setExpandedDraft] = useState<string | null>(null);
  const [showLogs, setShowLogs] = useState(false);
  const [filter, setFilter] = useState<'all' | 'errors' | 'news' | 'educational' | 'resource'>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setDrafts(DraftStorageService.getAllDrafts());
    setErrorLogs(DraftStorageService.getErrorLogs());
  };

  const handleDelete = (id: string) => {
    if (confirm('Remover este rascunho?')) {
      DraftStorageService.removeDraft(id);
      loadData();
    }
  };

  const handleClearAll = () => {
    if (confirm('Limpar TODOS os rascunhos? Esta ação não pode ser desfeita.')) {
      DraftStorageService.clearAll();
      loadData();
    }
  };

  const handleClearLogs = () => {
    DraftStorageService.clearErrorLogs();
    setErrorLogs([]);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'news': return faNewspaper;
      case 'educational': return faGraduationCap;
      case 'resource': return faToolbox;
      default: return faDatabase;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'news': return 'Notícia';
      case 'educational': return 'Educacional';
      case 'resource': return 'Recurso';
      default: return type;
    }
  };

  const filteredDrafts = drafts.filter(d => {
    if (filter === 'all') return true;
    if (filter === 'errors') return !!d.error;
    return d.type === filter;
  });

  const stats = DraftStorageService.getStats();

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white/90 dark:bg-white/5 backdrop-blur-xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FontAwesomeIcon icon={faDatabase} className="w-5 h-5 " />
          <div>
<h3 className="title-newtab">Gerenciador de Cache</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {stats.total} rascunho(s) • {stats.withErrors} com erro(s)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowLogs(!showLogs)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${showLogs
              ? 'bg-red-500/10 border border-red-500/20'
              : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/10'
              }`}
          >
            Logs ({errorLogs.length})
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400"
            >
              <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="p-3 border-b border-gray-200 dark:border-white/10 flex flex-wrap gap-2">
        {(['all', 'errors', 'news', 'educational', 'resource'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === f
              ? 'bg-teal-500 text-white'
              : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10'
              }`}
          >
            {f === 'all' && 'Todos'}
            {f === 'errors' && `❌ Com Erros (${stats.withErrors})`}
            {f === 'news' && `📰 Notícias (${stats.byType.news})`}
            {f === 'educational' && `📚 Educacional (${stats.byType.educational})`}
            {f === 'resource' && `🔧 Recursos (${stats.byType.resource})`}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="max-h-[400px] overflow-y-auto">
        {showLogs ? (
          // Error Logs View
          <div className="p-4 space-y-3">
            {errorLogs.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                Nenhum log de erro registrado
              </p>
            ) : (
              <>
                <div className="flex justify-end mb-2">
                  <button
                    onClick={handleClearLogs}
                    className="text-xs hover:"
                  >
                    Limpar logs
                  </button>
                </div>
                {errorLogs.map((log, i) => (
                  <div key={i} className="p-3 rounded-lg border border-red-500/20 bg-red-500/5">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="font-medium text-sm text-gray-900 dark:text-white truncate">
                        {log.articleTitle}
                      </span>
                      <span className="text-[10px] text-gray-500 shrink-0">
                        {new Date(log.timestamp).toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <p className="text-xs mb-2">{log.message}</p>
                    {log.details && (
                      <div className="text-[10px] text-gray-500 bg-black/20 p-2 rounded font-mono overflow-x-auto">
                        {log.details.validationErrors?.map((e, j) => (
                          <div key={j}>• {e}</div>
                        ))}
                        {log.details.field && <div>Campo: {log.details.field}</div>}
                        {log.details.httpStatus && <div>HTTP: {log.details.httpStatus}</div>}
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        ) : (
          // Drafts View
          <div className="divide-y divide-gray-200 dark:divide-white/10">
            {filteredDrafts.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                Nenhum rascunho encontrado
              </p>
            ) : (
              filteredDrafts.map((draft) => (
                <div key={draft.id} className="p-3">
                  <div className="flex items-start gap-3">
                    {/* Type Icon */}
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${draft.error ? 'bg-red-500/10 ' : 'bg-teal-500/10 '
                      }`}>
                      <FontAwesomeIcon icon={draft.error ? faExclamationTriangle : getTypeIcon(draft.type)} className="w-4 h-4" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-medium text-sm text-gray-900 dark:text-white truncate">
                            {draft.data.title || draft.data.name || 'Sem título'}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400">
                              {getTypeLabel(draft.type)}
                            </span>
                            <span className="text-[10px] text-gray-500">
                              {new Date(draft.timestamp).toLocaleString('pt-BR')}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => setExpandedDraft(expandedDraft === draft.id ? null : draft.id)}
                            className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400"
                            title="Detalhes"
                          >
                            <FontAwesomeIcon icon={expandedDraft === draft.id ? faChevronUp : faChevronDown} className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => copyToClipboard(JSON.stringify(draft.data, null, 2))}
                            className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400"
                            title="Copiar JSON"
                          >
                            <FontAwesomeIcon icon={faClipboard} className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDelete(draft.id)}
                            className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-500/10 "
                            title="Remover"
                          >
                            <FontAwesomeIcon icon={faTrash} className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Error Message */}
                      {draft.error && (
                        <div className="mt-2 p-2 rounded bg-red-500/5 border border-red-500/20">
                          <p className="text-xs ">{draft.error}</p>
                        </div>
                      )}

                      {/* Expanded Details */}
                      {expandedDraft === draft.id && (
                        <div className="mt-3 p-3 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-gray-500">Categoria:</span>
                              <span className="ml-1 text-gray-900 dark:text-white">{draft.data.category || 'N/A'}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Slug:</span>
                              <span className="ml-1 text-gray-900 dark:text-white font-mono">{draft.data.slug || 'N/A'}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Excerpt:</span>
                              <span className="ml-1 text-gray-900 dark:text-white">{draft.data.excerpt?.length || 0} chars</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Content:</span>
                              <span className="ml-1 text-gray-900 dark:text-white">{draft.data.content?.length || 0} chars</span>
                            </div>
                          </div>
                          {draft.errorDetails && (
                            <div className="mt-2 pt-2 border-t border-gray-200 dark:border-white/10">
                              <p className="text-[10px] text-gray-500 mb-1">Detalhes do erro:</p>
                              <pre className="text-[10px] bg-black/20 p-2 rounded overflow-x-auto">
                                {JSON.stringify(draft.errorDetails.details, null, 2)}
                              </pre>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      {drafts.length > 0 && !showLogs && (
        <div className="p-3 border-t border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/5 flex justify-end">
          <button
            onClick={handleClearAll}
            className="px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-red-500/10 border border-red-500/20"
          >
            <FontAwesomeIcon icon={faTrash} className="w-3 h-3 mr-1" />
            Limpar Todos
          </button>
        </div>
      )}
    </div>
  );
}
