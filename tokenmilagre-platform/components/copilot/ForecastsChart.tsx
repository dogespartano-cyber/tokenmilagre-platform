'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowUp,
  faArrowDown,
  faMinus,
  faChartLine,
  faCheckCircle,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';

interface Forecast {
  metric: string;
  current: number;
  predicted: number;
  change: number;
  changePercent: number;
  confidence: 'high' | 'medium' | 'low';
  trend: 'up' | 'down' | 'stable';
}

interface ForecastsChartProps {
  forecasts: Forecast[];
}

export default function ForecastsChart({ forecasts }: ForecastsChartProps) {
  const trendConfig = {
    up: {
      icon: faArrowUp,
      color: 'var(--color-success)',
      label: 'Crescimento'
    },
    down: {
      icon: faArrowDown,
      color: 'var(--color-error)',
      label: 'Declínio'
    },
    stable: {
      icon: faMinus,
      color: 'var(--text-tertiary)',
      label: 'Estável'
    }
  };

  const confidenceConfig = {
    high: {
      color: 'var(--color-success)',
      icon: faCheckCircle,
      label: 'Alta'
    },
    medium: {
      color: '#f59e0b',
      icon: faExclamationTriangle,
      label: 'Média'
    },
    low: {
      color: 'var(--color-error)',
      icon: faExclamationTriangle,
      label: 'Baixa'
    }
  };

  if (!forecasts || forecasts.length === 0) {
    return (
      <div className="forecasts-chart">
        <div className="panel-header">
          <h3>Previsões</h3>
        </div>
        <div className="empty-state">
          <FontAwesomeIcon icon={faChartLine} size="3x" style={{ color: 'var(--text-tertiary)' }} />
          <p>Dados insuficientes</p>
          <span>Aguardando dados históricos para gerar previsões</span>
        </div>

        <style jsx>{`
          .forecasts-chart {
            background: var(--card-background);
            border-radius: var(--border-radius-lg);
            padding: var(--spacing-lg);
            box-shadow: var(--card-shadow);
          }

          .panel-header {
            margin-bottom: var(--spacing-md);
          }

          .panel-header h3 {
            margin: 0;
            font-size: 1.25rem;
            color: var(--text-primary);
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
            text-align: center;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="forecasts-chart">
      <div className="panel-header">
        <h3>Previsões</h3>
        <span className="subtitle">Projeções baseadas em dados históricos</span>
      </div>

      <div className="forecasts-grid">
        {forecasts.map((forecast, index) => {
          const trendConf = trendConfig[forecast.trend];
          const confConf = confidenceConfig[forecast.confidence];
          const percentage = Math.abs(forecast.changePercent);

          return (
            <div key={index} className="forecast-card">
              <div className="forecast-header">
                <h4>{forecast.metric}</h4>
                <div className="confidence-badge" style={{ borderColor: confConf.color, color: confConf.color }}>
                  <FontAwesomeIcon icon={confConf.icon} />
                  <span>{confConf.label}</span>
                </div>
              </div>

              <div className="forecast-values">
                <div className="value-item">
                  <span className="value-label">Atual</span>
                  <span className="value-number">{forecast.current}</span>
                </div>

                <div className="arrow">
                  <FontAwesomeIcon icon={faArrowUp} style={{ color: trendConf.color }} />
                </div>

                <div className="value-item">
                  <span className="value-label">Previsto</span>
                  <span className="value-number predicted">{forecast.predicted}</span>
                </div>
              </div>

              <div className="forecast-change" style={{ backgroundColor: `${trendConf.color}15` }}>
                <FontAwesomeIcon icon={trendConf.icon} style={{ color: trendConf.color }} />
                <span style={{ color: trendConf.color }}>
                  {forecast.change > 0 ? '+' : ''}{forecast.change} ({percentage}%)
                </span>
                <span className="trend-label" style={{ color: trendConf.color }}>
                  {trendConf.label}
                </span>
              </div>

              {/* Visual Bar */}
              <div className="visual-bar">
                <div className="bar-container">
                  <div
                    className="bar current"
                    style={{
                      width: `${Math.min((forecast.current / Math.max(forecast.current, forecast.predicted)) * 100, 100)}%`,
                      background: 'var(--gradient-secondary)'
                    }}
                  >
                    <span className="bar-label">Atual</span>
                  </div>
                </div>
                <div className="bar-container">
                  <div
                    className="bar predicted"
                    style={{
                      width: `${Math.min((forecast.predicted / Math.max(forecast.current, forecast.predicted)) * 100, 100)}%`,
                      background: trendConf.color === 'var(--color-success)' ? 'var(--gradient-success)' : 'var(--gradient-warning)'
                    }}
                  >
                    <span className="bar-label">Previsto</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .forecasts-chart {
          background: var(--card-background);
          border-radius: var(--border-radius-lg);
          padding: var(--spacing-lg);
          box-shadow: var(--card-shadow);
        }

        .panel-header {
          margin-bottom: var(--spacing-md);
        }

        .panel-header h3 {
          margin: 0 0 4px 0;
          font-size: 1.25rem;
          color: var(--text-primary);
        }

        .subtitle {
          font-size: 0.875rem;
          color: var(--text-tertiary);
        }

        .forecasts-grid {
          display: grid;
          gap: var(--spacing-md);
        }

        .forecast-card {
          background: var(--background-secondary);
          border-radius: var(--border-radius-md);
          padding: var(--spacing-md);
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
          transition: var(--transition-normal);
        }

        .forecast-card:hover {
          background: var(--background-tertiary);
          transform: translateY(-2px);
          box-shadow: var(--card-shadow);
        }

        .forecast-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .forecast-header h4 {
          margin: 0;
          font-size: 1rem;
          color: var(--text-primary);
        }

        .confidence-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border: 1.5px solid;
          border-radius: var(--border-radius-full);
          font-size: 0.75rem;
          font-weight: 600;
        }

        .forecast-values {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--spacing-md);
        }

        .value-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
        }

        .value-label {
          font-size: 0.75rem;
          color: var(--text-tertiary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .value-number {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .value-number.predicted {
          color: var(--color-primary);
        }

        .arrow {
          font-size: 1.5rem;
          opacity: 0.3;
        }

        .forecast-change {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          padding: var(--spacing-sm) var(--spacing-md);
          border-radius: var(--border-radius-md);
          font-size: 0.875rem;
          font-weight: 600;
        }

        .trend-label {
          margin-left: auto;
          text-transform: uppercase;
          font-size: 0.75rem;
          letter-spacing: 0.5px;
        }

        .visual-bar {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .bar-container {
          position: relative;
          height: 32px;
          background: var(--background-primary);
          border-radius: var(--border-radius-sm);
          overflow: hidden;
        }

        .bar {
          height: 100%;
          display: flex;
          align-items: center;
          padding: 0 var(--spacing-sm);
          border-radius: var(--border-radius-sm);
          transition: width 0.5s ease;
        }

        .bar-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: white;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
}
