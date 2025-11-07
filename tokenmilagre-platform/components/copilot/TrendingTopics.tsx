'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFire,
  faNewspaper,
  faGraduationCap,
  faExclamationCircle,
  faBolt,
  faInfoCircle,
  faClock
} from '@fortawesome/free-solid-svg-icons';

interface TrendingTopic {
  title: string;
  category: string;
  urgency: 'high' | 'medium' | 'low';
  type: 'news' | 'educational';
}

interface TrendingTopicsProps {
  topics: TrendingTopic[];
  cache: {
    categories: string[];
    totalTopics: number;
    lastUpdated: Record<string, string>;
  };
}

export default function TrendingTopics({ topics, cache }: TrendingTopicsProps) {
  const urgencyConfig = {
    high: {
      icon: faExclamationCircle,
      color: 'text-red-600 dark:text-red-400',
      bg: 'bg-red-100 dark:bg-red-900/30',
      label: 'Alta'
    },
    medium: {
      icon: faBolt,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-100 dark:bg-amber-900/30',
      label: 'Média'
    },
    low: {
      icon: faInfoCircle,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      label: 'Baixa'
    }
  };

  const typeConfig = {
    news: {
      icon: faNewspaper,
      label: 'Notícia',
      color: 'text-purple-600 dark:text-purple-400'
    },
    educational: {
      icon: faGraduationCap,
      label: 'Educacional',
      color: 'text-green-600 dark:text-green-400'
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
      <div className="flex items-center gap-2 mb-4">
        <FontAwesomeIcon icon={faFire} className="text-orange-500" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Trending Topics</h3>
        <span className="ml-auto px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-semibold">
          {topics.length} tópicos
        </span>
      </div>

      <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto">
        {topics.map((topic, index) => {
          const urgency = urgencyConfig[topic.urgency];
          const type = typeConfig[topic.type];

          return (
            <div
              key={index}
              className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <FontAwesomeIcon icon={type.icon} className={type.color} />
                    <span className="font-semibold text-gray-900 dark:text-white">{topic.title}</span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {topic.category}
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${urgency.bg} ${urgency.color}`}>
                  <FontAwesomeIcon icon={urgency.icon} />
                  {urgency.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {cache.lastUpdated && Object.keys(cache.lastUpdated).length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <FontAwesomeIcon icon={faClock} />
          <span>
            Atualizado: {new Date(Object.values(cache.lastUpdated)[0]).toLocaleString('pt-BR')}
          </span>
        </div>
      )}
    </div>
  );
}
