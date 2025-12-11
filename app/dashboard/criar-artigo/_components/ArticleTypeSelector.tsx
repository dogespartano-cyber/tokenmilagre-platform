/**
 * ArticleTypeSelector Component
 * Permite selecionar o tipo de artigo (news, educational, resource)
 */

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNewspaper, faGraduationCap, faBox } from '@fortawesome/free-solid-svg-icons';
import { type ArticleType, ARTICLE_TYPE_CONFIG, MESSAGES } from '../_lib/constants';

interface ArticleTypeSelectorProps {
  selectedType: ArticleType | null;
  onTypeChange: (type: ArticleType | null) => void;
}

export default function ArticleTypeSelector({ selectedType, onTypeChange }: ArticleTypeSelectorProps) {
  const toggleType = (type: ArticleType) => {
    onTypeChange(selectedType === type ? null : type);
  };

  return (
    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-white/10">
      <h3 className="text-sm font-semibold mb-3 text-gray-500 dark:text-gray-400">
        Selecione o tipo de artigo:
      </h3>

      <div className="flex gap-2" role="group" aria-label="Selecione o tipo de artigo">
        {/* Botão Notícia */}
        <button
          onClick={() => toggleType('news')}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${selectedType === 'news'
              ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/20'
              : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10'
            }`}
          aria-pressed={selectedType === 'news'}
          aria-label={`${ARTICLE_TYPE_CONFIG.news.ariaLabel} ${selectedType === 'news' ? '(selecionado)' : ''}`}
        >
          <FontAwesomeIcon icon={faNewspaper} />
          {ARTICLE_TYPE_CONFIG.news.label}
        </button>

        {/* Botão Educação */}
        <button
          onClick={() => toggleType('educational')}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${selectedType === 'educational'
              ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/20'
              : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10'
            }`}
          aria-pressed={selectedType === 'educational'}
          aria-label={`${ARTICLE_TYPE_CONFIG.educational.ariaLabel} ${selectedType === 'educational' ? '(selecionado)' : ''}`}
        >
          <FontAwesomeIcon icon={faGraduationCap} />
          {ARTICLE_TYPE_CONFIG.educational.label}
        </button>

        {/* Botão Recurso */}
        <button
          onClick={() => toggleType('resource')}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${selectedType === 'resource'
              ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/20'
              : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10'
            }`}
          aria-pressed={selectedType === 'resource'}
          aria-label={`${ARTICLE_TYPE_CONFIG.resource.ariaLabel} ${selectedType === 'resource' ? '(selecionado)' : ''}`}
        >
          <FontAwesomeIcon icon={faBox} />
          {ARTICLE_TYPE_CONFIG.resource.label}
        </button>
      </div>

      {/* Feedback de modo selecionado */}
      {selectedType && (
        <div className="mt-3 p-3 rounded-lg text-sm bg-teal-500/10 border-l-4 border-teal-500 text-gray-700 dark:text-gray-200">
          ✅ <strong>Modo Criação Ativado:</strong> {ARTICLE_TYPE_CONFIG[selectedType].description}
        </div>
      )}

      {/* Modo conversa livre */}
      {!selectedType && (
        <div
          className="mt-3 p-3 rounded-lg text-sm bg-blue-500/10 text-gray-700 dark:text-gray-200"
          dangerouslySetInnerHTML={{ __html: MESSAGES.chat.modeInfo.free }}
        />
      )}
    </div>
  );
}
