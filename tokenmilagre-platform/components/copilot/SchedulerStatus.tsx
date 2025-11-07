'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faClock,
  faCheckCircle,
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
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Tarefas Agendadas</h3>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-semibold">
            {stats.enabledTasks} ativas
          </span>
          <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-semibold">
            {stats.totalRuns} execuções
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto">
        {tasks.map((task) => (
          <div key={task.name} className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <div className="font-semibold text-gray-900 dark:text-white mb-1">
                  {taskNameLabels[task.name] || task.name}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{task.description}</div>
              </div>
              <div>
                {task.enabled ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-semibold">
                    <FontAwesomeIcon icon={faPlayCircle} />
                    Ativa
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-xs font-semibold">
                    <FontAwesomeIcon icon={faPauseCircle} />
                    Pausada
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2 text-sm">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <FontAwesomeIcon icon={faClock} className="w-4" />
                <span className="font-medium">Agendamento:</span>
                <span>{task.schedule}</span>
              </div>

              {task.lastRun && (
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <FontAwesomeIcon icon={faCheckCircle} className="w-4" />
                  <span className="font-medium">Última execução:</span>
                  <span>{new Date(task.lastRun).toLocaleString('pt-BR')}</span>
                </div>
              )}

              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <span className="font-medium">Execuções:</span>
                <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded font-semibold">
                  {task.runCount}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {stats.lastRun && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
          Última tarefa executada: {new Date(stats.lastRun).toLocaleString('pt-BR')}
        </div>
      )}
    </div>
  );
}
