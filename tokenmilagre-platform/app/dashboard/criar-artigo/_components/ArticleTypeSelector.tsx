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
    <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border-light)' }}>
      <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
        Selecione o tipo de artigo:
      </h3>

      <div className="flex gap-2" role="group" aria-label="Selecione o tipo de artigo">
        {/* Botão Notícia */}
        <button
          onClick={() => toggleType('news')}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${
            selectedType === 'news' ? '' : 'hover:opacity-80'
          }`}
          style={{
            backgroundColor: selectedType === 'news' ? 'var(--brand-primary)' : 'var(--bg-secondary)',
            color: selectedType === 'news' ? 'var(--text-inverse)' : 'var(--text-primary)'
          }}
          aria-pressed={selectedType === 'news'}
          aria-label={`${ARTICLE_TYPE_CONFIG.news.ariaLabel} ${selectedType === 'news' ? '(selecionado)' : ''}`}
        >
          <FontAwesomeIcon icon={faNewspaper} />
          {ARTICLE_TYPE_CONFIG.news.label}
        </button>

        {/* Botão Educação */}
        <button
          onClick={() => toggleType('educational')}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${
            selectedType === 'educational' ? '' : 'hover:opacity-80'
          }`}
          style={{
            backgroundColor: selectedType === 'educational' ? 'var(--brand-primary)' : 'var(--bg-secondary)',
            color: selectedType === 'educational' ? 'var(--text-inverse)' : 'var(--text-primary)'
          }}
          aria-pressed={selectedType === 'educational'}
          aria-label={`${ARTICLE_TYPE_CONFIG.educational.ariaLabel} ${selectedType === 'educational' ? '(selecionado)' : ''}`}
        >
          <FontAwesomeIcon icon={faGraduationCap} />
          {ARTICLE_TYPE_CONFIG.educational.label}
        </button>

        {/* Botão Recurso */}
        <button
          onClick={() => toggleType('resource')}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${
            selectedType === 'resource' ? '' : 'hover:opacity-80'
          }`}
          style={{
            backgroundColor: selectedType === 'resource' ? 'var(--brand-primary)' : 'var(--bg-secondary)',
            color: selectedType === 'resource' ? 'var(--text-inverse)' : 'var(--text-primary)'
          }}
          aria-pressed={selectedType === 'resource'}
          aria-label={`${ARTICLE_TYPE_CONFIG.resource.ariaLabel} ${selectedType === 'resource' ? '(selecionado)' : ''}`}
        >
          <FontAwesomeIcon icon={faBox} />
          {ARTICLE_TYPE_CONFIG.resource.label}
        </button>
      </div>

      {/* Feedback de modo selecionado */}
      {selectedType && (
        <div
          className="mt-3 p-3 rounded-lg text-sm"
          style={{
            backgroundColor: 'rgba(34, 197, 94, 0.15)',
            borderLeft: '3px solid #22C55E',
            color: 'var(--text-primary)'
          }}
        >
          ✅ <strong>Modo Criação Ativado:</strong> {ARTICLE_TYPE_CONFIG[selectedType].description}
        </div>
      )}

      {/* Modo conversa livre */}
      {!selectedType && (
        <div
          className="mt-3 p-3 rounded-lg text-sm"
          style={{
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            color: 'var(--text-primary)'
          }}
          dangerouslySetInnerHTML={{ __html: MESSAGES.chat.modeInfo.free }}
        />
      )}
    </div>
  );
}
