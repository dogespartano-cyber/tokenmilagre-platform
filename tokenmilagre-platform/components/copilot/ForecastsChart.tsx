'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartLine,
  faTrendingUp,
  faTrendingDown,
  faMinus,
  faCalendar
} from '@fortawesome/free-solid-svg-icons';

interface Forecast {
  type: string;
  prediction: string;
  confidence: number;
  trend: 'up' | 'down' | 'stable';
  timestamp: string;
  impact?: string;
}

interface ForecastsChartProps {
  forecasts: Forecast[];
}

export default function ForecastsChart({ forecasts }: ForecastsChartProps) {
  const trendConfig = {
    up: {
      icon: faTrendingUp,
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-100 dark:bg-green-900/30',
      label: 'Em Alta'
    },
    down: {
      icon: faTrendingDown,
      color: 'text-red-600 dark:text-red-400',
      bg: 'bg-red-100 dark:bg-red-900/30',
      label: 'Em Baixa'
    },
    stable: {
      icon: faMinus,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      label: 'Estável'
    }
  };

  const typeLabels: Record<string, string> = {
    articles_count: 'Contagem de Artigos',
    average_quality: 'Qualidade Média',
    user_engagement: 'Engajamento de Usuários',
    content_freshness: 'Atualização de Conteúdo'
  };

  if (!forecasts || forecasts.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <FontAwesomeIcon icon={faChartLine} className="text-purple-500" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Previsões</h3>
        </div>
        <div className="flex flex-col items-center gap-2 py-12 text-gray-400 dark:text-gray-500">
          <FontAwesomeIcon icon={faChartLine} size="3x" />
          <p className="font-medium text-gray-600 dark:text-gray-400">Nenhuma previsão disponível</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
      <div className="flex items-center gap-2 mb-4">
        <FontAwesomeIcon icon={faChartLine} className="text-purple-500" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Previsões</h3>
        <span className="ml-auto px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full text-sm font-semibold">
          {forecasts.length} previsões
        </span>
      </div>

      <div className="flex flex-col gap-4">
        {forecasts.map((forecast, index) => {
          const trend = trendConfig[forecast.trend];
          const confidenceColor =
            forecast.confidence >= 80
              ? 'text-green-600 dark:text-green-400'
              : forecast.confidence >= 60
              ? 'text-amber-600 dark:text-amber-400'
              : 'text-red-600 dark:text-red-400';

          return (
            <div
              key={index}
              className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 dark:text-white mb-1">
                    {typeLabels[forecast.type] || forecast.type}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{forecast.prediction}</div>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${trend.bg} ${trend.color}`}>
                  <FontAwesomeIcon icon={trend.icon} />
                  {trend.label}
                </span>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 dark:text-gray-400">Confiança:</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          forecast.confidence >= 80
                            ? 'bg-green-500'
                            : forecast.confidence >= 60
                            ? 'bg-amber-500'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${forecast.confidence}%` }}
                      />
                    </div>
                    <span className={`font-semibold ${confidenceColor}`}>{forecast.confidence}%</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-500">
                  <FontAwesomeIcon icon={faCalendar} />
                  <span>{new Date(forecast.timestamp).toLocaleString('pt-BR')}</span>
                </div>
              </div>

              {forecast.impact && (
                <div className="mt-3 px-3 py-2 bg-white dark:bg-gray-800 rounded text-sm">
                  <strong className="text-gray-900 dark:text-white">Impacto:</strong>{' '}
                  <span className="text-gray-600 dark:text-gray-400">{forecast.impact}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
