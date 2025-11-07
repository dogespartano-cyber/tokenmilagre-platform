'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faExclamationCircle,
  faExclamationTriangle,
  faBolt,
  faInfoCircle,
  faClock
} from '@fortawesome/free-solid-svg-icons';

interface Alert {
  id: string;
  type: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  action?: string;
  timestamp: string;
}

interface AlertsPanelProps {
  alerts: Alert[];
}

export default function AlertsPanel({ alerts }: AlertsPanelProps) {
  const priorityConfig = {
    critical: {
      icon: faExclamationCircle,
      color: 'border-red-500',
      bgColor: 'bg-red-500',
      badgeBg: 'bg-red-500',
      label: 'Crítico',
      gradient: 'bg-gradient-to-br from-red-500 to-red-600'
    },
    high: {
      icon: faExclamationTriangle,
      color: 'border-yellow-500',
      bgColor: 'bg-yellow-500',
      badgeBg: 'bg-yellow-500',
      label: 'Alto',
      gradient: 'bg-gradient-to-br from-yellow-500 to-orange-500'
    },
    medium: {
      icon: faBolt,
      color: 'border-amber-500',
      bgColor: 'bg-amber-500',
      badgeBg: 'bg-amber-500',
      label: 'Médio',
      gradient: 'bg-gradient-to-br from-amber-500 to-amber-600'
    },
    low: {
      icon: faInfoCircle,
      color: 'border-blue-500',
      bgColor: 'bg-blue-500',
      badgeBg: 'bg-blue-500',
      label: 'Baixo',
      gradient: 'bg-gradient-to-br from-blue-500 to-cyan-500'
    }
  };

  const typeLabels: Record<string, string> = {
    quality: 'Qualidade',
    freshness: 'Atualização',
    media: 'Mídia',
    quota: 'Quota API',
    database: 'Banco de Dados'
  };

  if (!alerts || alerts.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Alertas Ativos</h3>
          <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-sm font-semibold text-gray-600 dark:text-gray-400">
            0
          </span>
        </div>
        <div className="flex flex-col items-center gap-2 py-12 text-gray-400 dark:text-gray-500">
          <FontAwesomeIcon icon={faInfoCircle} size="3x" />
          <p className="font-medium text-gray-600 dark:text-gray-400">Nenhum alerta ativo</p>
          <span className="text-sm">Sistema operando normalmente</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Alertas Ativos</h3>
        <span className="px-3 py-1 bg-red-500 text-white rounded-full text-sm font-semibold">
          {alerts.length}
        </span>
      </div>

      <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto">
        {alerts.map((alert) => {
          const config = priorityConfig[alert.priority];
          return (
            <div
              key={alert.id}
              className={`bg-gray-50 dark:bg-gray-750 rounded-lg border-l-4 ${config.color} p-4 flex gap-4 hover:bg-gray-100 dark:hover:bg-gray-700 hover:translate-x-1 transition-all duration-200`}
            >
              <div className={`w-10 h-10 rounded-lg ${config.gradient} flex items-center justify-center text-white text-xl flex-shrink-0`}>
                <FontAwesomeIcon icon={config.icon} />
              </div>

              <div className="flex-1 flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                    {typeLabels[alert.type] || alert.type}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold text-white ${config.badgeBg}`}>
                    {config.label}
                  </span>
                </div>

                <p className="text-gray-900 dark:text-white font-medium">{alert.message}</p>

                {alert.action && (
                  <div className="px-3 py-2 bg-white dark:bg-gray-800 rounded text-sm text-gray-600 dark:text-gray-400">
                    <strong className="text-gray-900 dark:text-white">Ação:</strong> {alert.action}
                  </div>
                )}

                <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-500 mt-1">
                  <FontAwesomeIcon icon={faClock} />
                  <span>{new Date(alert.timestamp).toLocaleString('pt-BR')}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
