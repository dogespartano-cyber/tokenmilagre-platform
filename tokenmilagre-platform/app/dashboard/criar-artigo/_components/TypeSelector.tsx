/**
 * TypeSelector Component
 * Permite selecionar o tipo de artigo (notícia, educacional ou recurso)
 */

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNewspaper, faGraduationCap, faBox } from '@fortawesome/free-solid-svg-icons';

export type ArticleType = 'news' | 'educational' | 'resource';

interface TypeSelectorProps {
  selectedType: ArticleType | null;
  onSelectType: (type: ArticleType) => void;
}

export default function TypeSelector({ selectedType, onSelectType }: TypeSelectorProps) {
  const types: Array<{ id: ArticleType; label: string; icon: typeof faNewspaper; description: string }> = [
    {
      id: 'news',
      label: 'Notícia',
      icon: faNewspaper,
      description: 'Notícias sobre o mercado cripto'
    },
    {
      id: 'educational',
      label: 'Educacional',
      icon: faGraduationCap,
      description: 'Artigo educativo sobre blockchain e cripto'
    },
    {
      id: 'resource',
      label: 'Recurso',
      icon: faBox,
      description: 'Ferramenta, wallet ou exchange'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {types.map(({ id, label, icon, description }) => (
        <button
          key={id}
          onClick={() => onSelectType(id)}
          className={`p-6 rounded-lg border-2 transition-all ${
            selectedType === id
              ? 'border-yellow-500 bg-yellow-500/10'
              : 'border-gray-700 hover:border-gray-600 bg-gray-800'
          }`}
        >
          <FontAwesomeIcon icon={icon} className="text-3xl mb-3" />
          <h3 className="text-xl font-bold mb-1">{label}</h3>
          <p className="text-sm text-gray-400">{description}</p>
        </button>
      ))}
    </div>
  );
}
