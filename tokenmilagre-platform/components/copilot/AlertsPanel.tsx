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
      color: 'var(--color-error)',
      label: 'Crítico',
      gradient: 'var(--gradient-error)'
    },
    high: {
      icon: faExclamationTriangle,
      color: 'var(--color-warning)',
      label: 'Alto',
      gradient: 'var(--gradient-warning)'
    },
    medium: {
      icon: faBolt,
      color: '#f59e0b',
      label: 'Médio',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
    },
    low: {
      icon: faInfoCircle,
      color: 'var(--color-info)',
      label: 'Baixo',
      gradient: 'var(--gradient-info)'
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
      <div className="alerts-panel">
        <div className="panel-header">
          <h3>Alertas Ativos</h3>
          <span className="alert-count">0</span>
        </div>
        <div className="empty-state">
          <FontAwesomeIcon icon={faInfoCircle} size="3x" style={{ color: 'var(--text-tertiary)' }} />
          <p>Nenhum alerta ativo</p>
          <span>Sistema operando normalmente</span>
        </div>

        <style jsx>{`
          .alerts-panel {
            background: var(--card-background);
            border-radius: var(--border-radius-lg);
            padding: var(--spacing-lg);
            box-shadow: var(--card-shadow);
          }

          .panel-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: var(--spacing-md);
          }

          .panel-header h3 {
            margin: 0;
            font-size: 1.25rem;
            color: var(--text-primary);
          }

          .alert-count {
            background: var(--background-tertiary);
            padding: 4px 12px;
            border-radius: var(--border-radius-full);
            font-size: 0.875rem;
            font-weight: 600;
            color: var(--text-secondary);
          }

          .empty-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: var(--spacing-sm);
            padding: var(--spacing-xl) 0;
            color: var(--text-tertiary);
          }

          .empty-state p {
            margin: 0;
            font-weight: 500;
            color: var(--text-secondary);
          }

          .empty-state span {
            font-size: 0.875rem;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="alerts-panel">
      <div className="panel-header">
        <h3>Alertas Ativos</h3>
        <span className="alert-count">{alerts.length}</span>
      </div>

      <div className="alerts-list">
        {alerts.map((alert) => {
          const config = priorityConfig[alert.priority];
          return (
            <div key={alert.id} className="alert-card" style={{ borderLeftColor: config.color }}>
              <div className="alert-icon" style={{ background: config.gradient }}>
                <FontAwesomeIcon icon={config.icon} />
              </div>

              <div className="alert-content">
                <div className="alert-header">
                  <span className="alert-type">{typeLabels[alert.type] || alert.type}</span>
                  <span className="alert-priority" style={{ backgroundColor: config.color }}>
                    {config.label}
                  </span>
                </div>

                <p className="alert-message">{alert.message}</p>

                {alert.action && (
                  <div className="alert-action">
                    <strong>Ação:</strong> {alert.action}
                  </div>
                )}

                <div className="alert-footer">
                  <FontAwesomeIcon icon={faClock} />
                  <span>{new Date(alert.timestamp).toLocaleString('pt-BR')}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .alerts-panel {
          background: var(--card-background);
          border-radius: var(--border-radius-lg);
          padding: var(--spacing-lg);
          box-shadow: var(--card-shadow);
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-md);
        }

        .panel-header h3 {
          margin: 0;
          font-size: 1.25rem;
          color: var(--text-primary);
        }

        .alert-count {
          background: var(--color-error);
          color: white;
          padding: 4px 12px;
          border-radius: var(--border-radius-full);
          font-size: 0.875rem;
          font-weight: 600;
        }

        .alerts-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
          max-height: 600px;
          overflow-y: auto;
        }

        .alert-card {
          background: var(--background-secondary);
          border-radius: var(--border-radius-md);
          border-left: 4px solid;
          padding: var(--spacing-md);
          display: flex;
          gap: var(--spacing-md);
          transition: var(--transition-normal);
        }

        .alert-card:hover {
          background: var(--background-tertiary);
          transform: translateX(4px);
        }

        .alert-icon {
          width: 40px;
          height: 40px;
          border-radius: var(--border-radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.25rem;
          flex-shrink: 0;
        }

        .alert-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
        }

        .alert-header {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
        }

        .alert-type {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .alert-priority {
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: 600;
          color: white;
        }

        .alert-message {
          margin: 0;
          color: var(--text-primary);
          font-weight: 500;
        }

        .alert-action {
          padding: var(--spacing-xs) var(--spacing-sm);
          background: var(--background-primary);
          border-radius: var(--border-radius-sm);
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .alert-action strong {
          color: var(--text-primary);
        }

        .alert-footer {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          color: var(--text-tertiary);
          margin-top: 4px;
        }
      `}</style>
    </div>
  );
}
