'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHeartbeat,
  faExclamationTriangle,
  faTools,
  faChartLine,
  faCheckCircle,
  faTimesCircle
} from '@fortawesome/free-solid-svg-icons';

interface MetricsOverviewProps {
  data: {
    monitoring?: {
      status: 'healthy' | 'warning' | 'critical';
      totalAlerts: number;
      summary: string;
      lastCheck: string;
    };
    alerts?: {
      stats: {
        active: number;
        byPriority: {
          critical: number;
          high: number;
          medium: number;
          low: number;
        };
      };
    };
    scheduler?: {
      stats: {
        totalTasks: number;
        enabledTasks: number;
        totalRuns: number;
      };
    };
    tools?: {
      total: number;
      basic: number;
      advanced: number;
      admin: number;
    };
  };
}

export default function MetricsOverview({ data }: MetricsOverviewProps) {
  const statusConfig = {
    healthy: {
      color: 'border-green-500',
      bgColor: 'bg-green-500',
      textColor: 'text-green-600',
      icon: faCheckCircle,
      label: 'Saudável'
    },
    warning: {
      color: 'border-yellow-500',
      bgColor: 'bg-yellow-500',
      textColor: 'text-yellow-600',
      icon: faExclamationTriangle,
      label: 'Atenção'
    },
    critical: {
      color: 'border-red-500',
      bgColor: 'bg-red-500',
      textColor: 'text-red-600',
      icon: faTimesCircle,
      label: 'Crítico'
    }
  };

  const status = data.monitoring?.status || 'healthy';
  const config = statusConfig[status];

  return (
    <div className="flex flex-col gap-6">
      {/* Main Status Card */}
      <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 border-l-4 ${config.color} shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200`}>
        <div className="flex items-center gap-2 mb-4">
          <FontAwesomeIcon icon={config.icon} className={config.textColor} />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Status do Sistema</h3>
        </div>
        <div className="flex flex-col gap-2">
          <div className={`inline-block px-3 py-1 rounded ${config.bgColor} text-white text-xs font-semibold w-fit`}>
            {config.label.toUpperCase()}
          </div>
          <p className="text-gray-600 dark:text-gray-400">{data.monitoring?.summary || 'Carregando...'}</p>
          {data.monitoring?.lastCheck && (
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Última verificação: {new Date(data.monitoring.lastCheck).toLocaleString('pt-BR')}
            </p>
          )}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Alerts Metric */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 flex gap-4 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center text-2xl text-white flex-shrink-0">
            <FontAwesomeIcon icon={faExclamationTriangle} />
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <div className="text-3xl font-bold text-gray-900 dark:text-white leading-none">
              {data.alerts?.stats.active || 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Alertas Ativos</div>
            {data.alerts && data.alerts.stats.active > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {data.alerts.stats.byPriority.critical > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded bg-red-500 text-white font-semibold">
                    {data.alerts.stats.byPriority.critical} crítico(s)
                  </span>
                )}
                {data.alerts.stats.byPriority.high > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded bg-yellow-500 text-white font-semibold">
                    {data.alerts.stats.byPriority.high} alto(s)
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Scheduler Metric */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 flex gap-4 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-2xl text-white flex-shrink-0">
            <FontAwesomeIcon icon={faHeartbeat} />
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <div className="text-3xl font-bold text-gray-900 dark:text-white leading-none">
              {data.scheduler?.stats.enabledTasks || 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Tarefas Ativas</div>
            {data.scheduler && (
              <div className="text-xs text-gray-500 dark:text-gray-500">
                {data.scheduler.stats.totalRuns} execuções totais
              </div>
            )}
          </div>
        </div>

        {/* Tools Metric */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 flex gap-4 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-2xl text-white flex-shrink-0">
            <FontAwesomeIcon icon={faTools} />
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <div className="text-3xl font-bold text-gray-900 dark:text-white leading-none">
              {data.tools?.total || 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Ferramentas</div>
            {data.tools && (
              <div className="text-xs text-gray-500 dark:text-gray-500">
                {data.tools.basic} básicas, {data.tools.advanced} avançadas
              </div>
            )}
          </div>
        </div>

        {/* Forecasts Metric */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 flex gap-4 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-2xl text-white flex-shrink-0">
            <FontAwesomeIcon icon={faChartLine} />
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <div className="text-3xl font-bold text-gray-900 dark:text-white leading-none">2</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Previsões</div>
            <div className="text-xs text-gray-500 dark:text-gray-500">Artigos & Qualidade</div>
          </div>
        </div>
      </div>
    </div>
  );
}
