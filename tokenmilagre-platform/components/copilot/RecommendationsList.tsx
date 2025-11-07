'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLightbulb,
  faCheckCircle,
  faExclamationTriangle,
  faInfoCircle,
  faStar
} from '@fortawesome/free-solid-svg-icons';

interface Recommendation {
  id: string;
  type: string;
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact?: string;
  category?: string;
}

interface RecommendationsListProps {
  recommendations: Recommendation[];
}

export default function RecommendationsList({ recommendations }: RecommendationsListProps) {
  const priorityConfig = {
    high: {
      icon: faExclamationTriangle,
      color: 'text-red-600 dark:text-red-400',
      bg: 'bg-red-100 dark:bg-red-900/30',
      border: 'border-red-500',
      label: 'Alta Prioridade'
    },
    medium: {
      icon: faInfoCircle,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-100 dark:bg-amber-900/30',
      border: 'border-amber-500',
      label: 'Média Prioridade'
    },
    low: {
      icon: faCheckCircle,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      border: 'border-blue-500',
      label: 'Baixa Prioridade'
    }
  };

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <FontAwesomeIcon icon={faLightbulb} className="text-yellow-500" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Recomendações</h3>
        </div>
        <div className="flex flex-col items-center gap-2 py-12 text-gray-400 dark:text-gray-500">
          <FontAwesomeIcon icon={faStar} size="3x" />
          <p className="font-medium text-gray-600 dark:text-gray-400">Nenhuma recomendação no momento</p>
          <span className="text-sm">Sistema otimizado</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
      <div className="flex items-center gap-2 mb-4">
        <FontAwesomeIcon icon={faLightbulb} className="text-yellow-500" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Recomendações</h3>
        <span className="ml-auto px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full text-sm font-semibold">
          {recommendations.length}
        </span>
      </div>

      <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto">
        {recommendations.map((rec) => {
          const config = priorityConfig[rec.priority];

          return (
            <div
              key={rec.id}
              className={`bg-gray-50 dark:bg-gray-750 rounded-lg border-l-4 ${config.border} p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg ${config.bg} ${config.color} flex items-center justify-center flex-shrink-0`}>
                  <FontAwesomeIcon icon={config.icon} />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">{rec.title}</h4>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${config.bg} ${config.color}`}>
                      {config.label}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{rec.description}</p>

                  {rec.impact && (
                    <div className="px-3 py-2 bg-white dark:bg-gray-800 rounded text-sm">
                      <strong className="text-gray-900 dark:text-white">Impacto:</strong>{' '}
                      <span className="text-gray-600 dark:text-gray-400">{rec.impact}</span>
                    </div>
                  )}

                  {rec.category && (
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                      Categoria: {rec.category}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
