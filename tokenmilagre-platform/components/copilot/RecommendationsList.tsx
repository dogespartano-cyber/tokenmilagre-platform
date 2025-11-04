'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLightbulb,
  faCheckSquare,
  faChartLine,
  faCog,
  faFire,
  faExclamationCircle,
  faExclamationTriangle,
  faBolt,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons';

interface Recommendation {
  id: string;
  category: 'content' | 'quality' | 'growth' | 'automation' | 'trending';
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  action: string;
  impact: string;
  effort: 'low' | 'medium' | 'high';
  basedOn: string;
}

interface RecommendationsListProps {
  recommendations: Recommendation[];
}

export default function RecommendationsList({ recommendations }: RecommendationsListProps) {
  const categoryConfig = {
    content: {
      icon: faCheckSquare,
      color: 'var(--color-primary)',
      label: 'Conteúdo'
    },
    quality: {
      icon: faLightbulb,
      color: '#f59e0b',
      label: 'Qualidade'
    },
    growth: {
      icon: faChartLine,
      color: 'var(--color-success)',
      label: 'Crescimento'
    },
    automation: {
      icon: faCog,
      color: 'var(--color-secondary)',
      label: 'Automação'
    },
    trending: {
      icon: faFire,
      color: 'var(--color-error)',
      label: 'Trending'
    }
  };

  const priorityConfig = {
    critical: {
      icon: faExclamationCircle,
      color: 'var(--color-error)',
      label: 'Crítico'
    },
    high: {
      icon: faExclamationTriangle,
      color: 'var(--color-warning)',
      label: 'Alto'
    },
    medium: {
      icon: faBolt,
      color: '#f59e0b',
      label: 'Médio'
    },
    low: {
      icon: faInfoCircle,
      color: 'var(--color-info)',
      label: 'Baixo'
    }
  };

  const effortConfig = {
    low: { label: 'Fácil', color: 'var(--color-success)' },
    medium: { label: 'Médio', color: '#f59e0b' },
    high: { label: 'Difícil', color: 'var(--color-error)' }
  };

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="recommendations-list">
        <div className="panel-header">
          <h3>Recomendações</h3>
          <span className="count-badge">0</span>
        </div>
        <div className="empty-state">
          <FontAwesomeIcon icon={faLightbulb} size="3x" style={{ color: 'var(--text-tertiary)' }} />
          <p>Nenhuma recomendação</p>
          <span>Sistema analisando dados...</span>
        </div>

        <style jsx>{`
          .recommendations-list {
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

          .count-badge {
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
    <div className="recommendations-list">
      <div className="panel-header">
        <h3>Recomendações Inteligentes</h3>
        <span className="count-badge">{recommendations.length}</span>
      </div>

      <div className="recommendations-grid">
        {recommendations.map((rec) => {
          const catConf = categoryConfig[rec.category];
          const priConf = priorityConfig[rec.priority];
          const effConf = effortConfig[rec.effort];

          return (
            <div key={rec.id} className="recommendation-card">
              {/* Header */}
              <div className="rec-header">
                <div className="category-badge" style={{ backgroundColor: `${catConf.color}15`, color: catConf.color }}>
                  <FontAwesomeIcon icon={catConf.icon} />
                  <span>{catConf.label}</span>
                </div>
                <div className="priority-badge" style={{ backgroundColor: priConf.color }}>
                  <FontAwesomeIcon icon={priConf.icon} />
                  <span>{priConf.label}</span>
                </div>
              </div>

              {/* Title */}
              <h4 className="rec-title">{rec.title}</h4>

              {/* Description */}
              <p className="rec-description">{rec.description}</p>

              {/* Action */}
              <div className="rec-action">
                <strong>Ação sugerida:</strong>
                <p>{rec.action}</p>
              </div>

              {/* Footer */}
              <div className="rec-footer">
                <div className="rec-meta">
                  <span className="meta-item">
                    <strong>Impacto:</strong> {rec.impact}
                  </span>
                  <span className="meta-item" style={{ color: effConf.color }}>
                    <strong>Esforço:</strong> {effConf.label}
                  </span>
                </div>
                <span className="rec-source">{rec.basedOn}</span>
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .recommendations-list {
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

        .count-badge {
          background: var(--gradient-primary);
          color: white;
          padding: 4px 12px;
          border-radius: var(--border-radius-full);
          font-size: 0.875rem;
          font-weight: 600;
        }

        .recommendations-grid {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
          max-height: 800px;
          overflow-y: auto;
        }

        .recommendation-card {
          background: var(--background-secondary);
          border-radius: var(--border-radius-md);
          padding: var(--spacing-md);
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
          transition: var(--transition-normal);
          border: 1px solid transparent;
        }

        .recommendation-card:hover {
          background: var(--background-tertiary);
          border-color: var(--color-primary);
          transform: translateY(-2px);
          box-shadow: var(--card-shadow);
        }

        .rec-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: var(--spacing-sm);
          flex-wrap: wrap;
        }

        .category-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: var(--border-radius-full);
          font-size: 0.75rem;
          font-weight: 600;
        }

        .priority-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: var(--border-radius-full);
          font-size: 0.7rem;
          font-weight: 600;
          color: white;
        }

        .rec-title {
          margin: 0;
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
          line-height: 1.4;
        }

        .rec-description {
          margin: 0;
          font-size: 0.875rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .rec-action {
          padding: var(--spacing-sm);
          background: var(--background-primary);
          border-left: 3px solid var(--color-primary);
          border-radius: var(--border-radius-sm);
          font-size: 0.875rem;
        }

        .rec-action strong {
          display: block;
          color: var(--text-primary);
          margin-bottom: 4px;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .rec-action p {
          margin: 0;
          color: var(--text-secondary);
        }

        .rec-footer {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
          padding-top: var(--spacing-xs);
          border-top: 1px solid var(--border-color);
        }

        .rec-meta {
          display: flex;
          gap: var(--spacing-md);
          flex-wrap: wrap;
        }

        .meta-item {
          font-size: 0.75rem;
          color: var(--text-tertiary);
        }

        .meta-item strong {
          color: var(--text-secondary);
        }

        .rec-source {
          font-size: 0.7rem;
          color: var(--text-tertiary);
          font-style: italic;
        }
      `}</style>
    </div>
  );
}
