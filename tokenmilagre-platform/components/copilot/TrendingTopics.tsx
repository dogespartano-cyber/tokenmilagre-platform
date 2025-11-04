'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFire,
  faNewspaper,
  faGraduationCap,
  faExclamationCircle,
  faBolt,
  faInfoCircle
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
      color: 'var(--color-error)',
      label: 'Alta'
    },
    medium: {
      icon: faBolt,
      color: '#f59e0b',
      label: 'Média'
    },
    low: {
      icon: faInfoCircle,
      color: 'var(--color-info)',
      label: 'Baixa'
    }
  };

  const typeConfig = {
    news: {
      icon: faNewspaper,
      label: 'Notícia'
    },
    educational: {
      icon: faGraduationCap,
      label: 'Educacional'
    }
  };

  if (!topics || topics.length === 0) {
    return (
      <div className="trending-topics">
        <div className="panel-header">
          <h3>Tópicos em Alta</h3>
        </div>
        <div className="empty-state">
          <FontAwesomeIcon icon={faFire} size="3x" style={{ color: 'var(--text-tertiary)' }} />
          <p>Nenhum tópico trending</p>
          <span>Cache será atualizado em breve</span>
        </div>

        <style jsx>{`
          .trending-topics {
            background: var(--card-background);
            border-radius: var(--border-radius-lg);
            padding: var(--spacing-lg);
            box-shadow: var(--card-shadow);
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
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="trending-topics">
      <div className="panel-header">
        <h3>Tópicos em Alta</h3>
        <div className="cache-info">
          <FontAwesomeIcon icon={faFire} style={{ color: 'var(--color-error)' }} />
          <span>{cache.totalTopics} tópicos</span>
        </div>
      </div>

      {cache.categories.length > 0 && (
        <div className="cache-status">
          <span className="status-label">Categorias:</span>
          <div className="categories-list">
            {cache.categories.map(cat => (
              <span key={cat} className="category-badge">{cat}</span>
            ))}
          </div>
        </div>
      )}

      <div className="topics-list">
        {topics.map((topic, index) => {
          const urgConf = urgencyConfig[topic.urgency];
          const typeConf = typeConfig[topic.type];

          return (
            <div key={index} className="topic-card">
              <div className="topic-header">
                <div className="urgency-indicator" style={{ backgroundColor: urgConf.color }}>
                  <FontAwesomeIcon icon={urgConf.icon} />
                </div>
                <div className="topic-title">{topic.title}</div>
              </div>

              <div className="topic-footer">
                <span className="category-tag">{topic.category}</span>
                <div className="topic-meta">
                  <span className="urgency-badge" style={{ color: urgConf.color }}>
                    <FontAwesomeIcon icon={urgConf.icon} />
                    {urgConf.label}
                  </span>
                  <span className="type-badge">
                    <FontAwesomeIcon icon={typeConf.icon} />
                    {typeConf.label}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .trending-topics {
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

        .cache-info {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.875rem;
          color: var(--text-secondary);
          font-weight: 600;
        }

        .cache-status {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          margin-bottom: var(--spacing-md);
          padding: var(--spacing-sm) var(--spacing-md);
          background: var(--background-secondary);
          border-radius: var(--border-radius-md);
          flex-wrap: wrap;
        }

        .status-label {
          font-size: 0.8rem;
          color: var(--text-secondary);
          font-weight: 600;
        }

        .categories-list {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .category-badge {
          padding: 2px 8px;
          background: var(--gradient-primary);
          color: white;
          border-radius: var(--border-radius-full);
          font-size: 0.7rem;
          font-weight: 600;
        }

        .topics-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
          max-height: 500px;
          overflow-y: auto;
        }

        .topic-card {
          background: var(--background-secondary);
          border-radius: var(--border-radius-md);
          padding: var(--spacing-md);
          transition: var(--transition-normal);
          border: 1px solid transparent;
        }

        .topic-card:hover {
          background: var(--background-tertiary);
          border-color: var(--color-primary);
          transform: translateX(4px);
        }

        .topic-header {
          display: flex;
          gap: var(--spacing-sm);
          margin-bottom: var(--spacing-sm);
        }

        .urgency-indicator {
          width: 32px;
          height: 32px;
          border-radius: var(--border-radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .topic-title {
          flex: 1;
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-primary);
          line-height: 1.4;
        }

        .topic-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: var(--spacing-sm);
          flex-wrap: wrap;
        }

        .category-tag {
          padding: 4px 10px;
          background: var(--background-primary);
          border-radius: var(--border-radius-full);
          font-size: 0.7rem;
          font-weight: 600;
          color: var(--text-secondary);
          text-transform: capitalize;
        }

        .topic-meta {
          display: flex;
          gap: var(--spacing-sm);
          align-items: center;
        }

        .urgency-badge, .type-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.7rem;
          font-weight: 600;
        }

        .type-badge {
          color: var(--text-tertiary);
        }
      `}</style>
    </div>
  );
}
