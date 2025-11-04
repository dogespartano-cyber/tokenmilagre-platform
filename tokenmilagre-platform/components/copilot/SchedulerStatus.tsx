'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faClock,
  faCheckCircle,
  faTimesCircle,
  faPlayCircle,
  faPauseCircle
} from '@fortawesome/free-solid-svg-icons';

interface Task {
  name: string;
  description: string;
  schedule: string;
  enabled: boolean;
  lastRun?: string;
  runCount: number;
}

interface SchedulerStatusProps {
  tasks: Task[];
  stats: {
    totalTasks: number;
    enabledTasks: number;
    totalRuns: number;
    lastRun?: string;
  };
}

export default function SchedulerStatus({ tasks, stats }: SchedulerStatusProps) {
  const taskNameLabels: Record<string, string> = {
    daily_health_check: 'Health Check Diário',
    weekly_report: 'Relatório Semanal',
    monthly_report: 'Relatório Mensal',
    update_trending_topics: 'Atualizar Trending Topics',
    hourly_health_check: 'Health Check Horário'
  };

  return (
    <div className="scheduler-status">
      <div className="panel-header">
        <h3>Tarefas Agendadas</h3>
        <div className="stats-badges">
          <span className="badge enabled">{stats.enabledTasks} ativas</span>
          <span className="badge total">{stats.totalRuns} execuções</span>
        </div>
      </div>

      <div className="tasks-list">
        {tasks.map((task) => (
          <div key={task.name} className="task-card">
            <div className="task-header">
              <div className="task-info">
                <div className="task-name">
                  {taskNameLabels[task.name] || task.name}
                </div>
                <div className="task-description">{task.description}</div>
              </div>
              <div className="task-status">
                {task.enabled ? (
                  <span className="status-badge enabled">
                    <FontAwesomeIcon icon={faPlayCircle} />
                    Ativa
                  </span>
                ) : (
                  <span className="status-badge disabled">
                    <FontAwesomeIcon icon={faPauseCircle} />
                    Pausada
                  </span>
                )}
              </div>
            </div>

            <div className="task-details">
              <div className="detail-item">
                <FontAwesomeIcon icon={faClock} />
                <span className="detail-label">Agendamento:</span>
                <span className="detail-value">{task.schedule}</span>
              </div>

              {task.lastRun && (
                <div className="detail-item">
                  <FontAwesomeIcon icon={faCheckCircle} style={{ color: 'var(--color-success)' }} />
                  <span className="detail-label">Última execução:</span>
                  <span className="detail-value">
                    {new Date(task.lastRun).toLocaleString('pt-BR')}
                  </span>
                </div>
              )}

              <div className="detail-item">
                <span className="detail-label">Execuções:</span>
                <span className="detail-value count">{task.runCount}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {stats.lastRun && (
        <div className="last-run-info">
          Última tarefa executada: {new Date(stats.lastRun).toLocaleString('pt-BR')}
        </div>
      )}

      <style jsx>{`
        .scheduler-status {
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
          flex-wrap: wrap;
          gap: var(--spacing-sm);
        }

        .panel-header h3 {
          margin: 0;
          font-size: 1.25rem;
          color: var(--text-primary);
        }

        .stats-badges {
          display: flex;
          gap: var(--spacing-xs);
        }

        .badge {
          padding: 4px 10px;
          border-radius: var(--border-radius-full);
          font-size: 0.75rem;
          font-weight: 600;
        }

        .badge.enabled {
          background: var(--color-success);
          color: white;
        }

        .badge.total {
          background: var(--background-tertiary);
          color: var(--text-secondary);
        }

        .tasks-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
        }

        .task-card {
          background: var(--background-secondary);
          border-radius: var(--border-radius-md);
          padding: var(--spacing-md);
          transition: var(--transition-normal);
          border: 1px solid transparent;
        }

        .task-card:hover {
          background: var(--background-tertiary);
          border-color: var(--color-primary);
        }

        .task-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-sm);
        }

        .task-info {
          flex: 1;
        }

        .task-name {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .task-description {
          font-size: 0.8rem;
          color: var(--text-secondary);
          line-height: 1.4;
        }

        .task-status {
          flex-shrink: 0;
        }

        .status-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: var(--border-radius-full);
          font-size: 0.75rem;
          font-weight: 600;
        }

        .status-badge.enabled {
          background: var(--color-success);
          color: white;
        }

        .status-badge.disabled {
          background: var(--background-tertiary);
          color: var(--text-tertiary);
        }

        .task-details {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding-top: var(--spacing-sm);
          border-top: 1px solid var(--border-color);
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.8rem;
          color: var(--text-tertiary);
        }

        .detail-label {
          color: var(--text-secondary);
          font-weight: 500;
        }

        .detail-value {
          color: var(--text-primary);
        }

        .detail-value.count {
          font-weight: 600;
          color: var(--color-primary);
        }

        .last-run-info {
          margin-top: var(--spacing-md);
          padding: var(--spacing-sm) var(--spacing-md);
          background: var(--background-secondary);
          border-radius: var(--border-radius-md);
          font-size: 0.8rem;
          color: var(--text-secondary);
          text-align: center;
        }
      `}</style>
    </div>
  );
}
