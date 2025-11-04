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
      color: 'var(--color-success)',
      icon: faCheckCircle,
      label: 'Saudável'
    },
    warning: {
      color: 'var(--color-warning)',
      icon: faExclamationTriangle,
      label: 'Atenção'
    },
    critical: {
      color: 'var(--color-error)',
      icon: faTimesCircle,
      label: 'Crítico'
    }
  };

  const status = data.monitoring?.status || 'healthy';
  const config = statusConfig[status];

  return (
    <div className="metrics-overview">
      {/* Main Status Card */}
      <div className="status-card" style={{ borderLeftColor: config.color }}>
        <div className="status-header">
          <FontAwesomeIcon icon={config.icon} style={{ color: config.color }} />
          <h3>Status do Sistema</h3>
        </div>
        <div className="status-content">
          <div className="status-badge" style={{ backgroundColor: config.color }}>
            {config.label.toUpperCase()}
          </div>
          <p className="status-summary">{data.monitoring?.summary || 'Carregando...'}</p>
          {data.monitoring?.lastCheck && (
            <p className="status-time">
              Última verificação: {new Date(data.monitoring.lastCheck).toLocaleString('pt-BR')}
            </p>
          )}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="metrics-grid">
        {/* Alerts Metric */}
        <div className="metric-card">
          <div className="metric-icon" style={{ background: 'var(--gradient-warning)' }}>
            <FontAwesomeIcon icon={faExclamationTriangle} />
          </div>
          <div className="metric-content">
            <div className="metric-value">{data.alerts?.stats.active || 0}</div>
            <div className="metric-label">Alertas Ativos</div>
            {data.alerts && data.alerts.stats.active > 0 && (
              <div className="metric-breakdown">
                {data.alerts.stats.byPriority.critical > 0 && (
                  <span className="priority-badge critical">
                    {data.alerts.stats.byPriority.critical} crítico(s)
                  </span>
                )}
                {data.alerts.stats.byPriority.high > 0 && (
                  <span className="priority-badge high">
                    {data.alerts.stats.byPriority.high} alto(s)
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Scheduler Metric */}
        <div className="metric-card">
          <div className="metric-icon" style={{ background: 'var(--gradient-primary)' }}>
            <FontAwesomeIcon icon={faHeartbeat} />
          </div>
          <div className="metric-content">
            <div className="metric-value">{data.scheduler?.stats.enabledTasks || 0}</div>
            <div className="metric-label">Tarefas Ativas</div>
            {data.scheduler && (
              <div className="metric-detail">
                {data.scheduler.stats.totalRuns} execuções totais
              </div>
            )}
          </div>
        </div>

        {/* Tools Metric */}
        <div className="metric-card">
          <div className="metric-icon" style={{ background: 'var(--gradient-secondary)' }}>
            <FontAwesomeIcon icon={faTools} />
          </div>
          <div className="metric-content">
            <div className="metric-value">{data.tools?.total || 0}</div>
            <div className="metric-label">Ferramentas</div>
            {data.tools && (
              <div className="metric-detail">
                {data.tools.basic} básicas, {data.tools.advanced} avançadas
              </div>
            )}
          </div>
        </div>

        {/* Forecasts Metric */}
        <div className="metric-card">
          <div className="metric-icon" style={{ background: 'var(--gradient-success)' }}>
            <FontAwesomeIcon icon={faChartLine} />
          </div>
          <div className="metric-content">
            <div className="metric-value">2</div>
            <div className="metric-label">Previsões</div>
            <div className="metric-detail">Artigos & Qualidade</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .metrics-overview {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-lg);
        }

        .status-card {
          background: var(--card-background);
          border-radius: var(--border-radius-lg);
          padding: var(--spacing-lg);
          border-left: 4px solid;
          box-shadow: var(--card-shadow);
          transition: var(--transition-normal);
        }

        .status-card:hover {
          box-shadow: var(--card-shadow-hover);
          transform: translateY(-2px);
        }

        .status-header {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          margin-bottom: var(--spacing-md);
        }

        .status-header h3 {
          margin: 0;
          font-size: 1.25rem;
          color: var(--text-primary);
        }

        .status-content {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
        }

        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: var(--border-radius-sm);
          color: white;
          font-size: 0.75rem;
          font-weight: 600;
          width: fit-content;
        }

        .status-summary {
          color: var(--text-secondary);
          margin: 0;
        }

        .status-time {
          color: var(--text-tertiary);
          font-size: 0.875rem;
          margin: 0;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: var(--spacing-md);
        }

        .metric-card {
          background: var(--card-background);
          border-radius: var(--border-radius-md);
          padding: var(--spacing-md);
          display: flex;
          gap: var(--spacing-md);
          box-shadow: var(--card-shadow);
          transition: var(--transition-normal);
        }

        .metric-card:hover {
          box-shadow: var(--card-shadow-hover);
          transform: translateY(-2px);
        }

        .metric-icon {
          width: 48px;
          height: 48px;
          border-radius: var(--border-radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          color: white;
          flex-shrink: 0;
        }

        .metric-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .metric-value {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1;
        }

        .metric-label {
          font-size: 0.875rem;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .metric-detail {
          font-size: 0.75rem;
          color: var(--text-tertiary);
        }

        .metric-breakdown {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          margin-top: 4px;
        }

        .priority-badge {
          font-size: 0.7rem;
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: 600;
          color: white;
        }

        .priority-badge.critical {
          background: var(--color-error);
        }

        .priority-badge.high {
          background: var(--color-warning);
        }
      `}</style>
    </div>
  );
}
