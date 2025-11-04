'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRobot,
  faRefresh,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';

// Import components
import CopilotChat from '@/components/copilot/CopilotChat';
import MetricsOverview from '@/components/copilot/MetricsOverview';
import AlertsPanel from '@/components/copilot/AlertsPanel';
import ForecastsChart from '@/components/copilot/ForecastsChart';
import RecommendationsList from '@/components/copilot/RecommendationsList';
import SchedulerStatus from '@/components/copilot/SchedulerStatus';
import TrendingTopics from '@/components/copilot/TrendingTopics';

interface CopilotMetrics {
  timestamp: string;
  status: string;
  monitoring?: any;
  alerts?: any;
  scheduler?: any;
  trending?: any;
  forecasts?: any;
  recommendations?: any;
  tools?: any;
}

export default function CopilotDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [metrics, setMetrics] = useState<CopilotMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Check authentication
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
      router.push('/dashboard');
    }
  }, [status, session, router]);

  // Fetch metrics
  const fetchMetrics = async () => {
    try {
      setError(null);
      const response = await fetch('/api/copilot/metrics');

      if (!response.ok) {
        throw new Error('Falha ao buscar métricas');
      }

      const data = await response.json();
      setMetrics(data);
      setLastUpdate(new Date());
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar métricas');
      console.error('Error fetching metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role === 'ADMIN') {
      fetchMetrics();
    }
  }, [status, session]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchMetrics();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Manual refresh
  const handleRefresh = () => {
    setLoading(true);
    fetchMetrics();
  };

  if (status === 'loading' || loading) {
    return (
      <div className="copilot-dashboard loading">
        <FontAwesomeIcon icon={faSpinner} spin size="3x" />
        <p>Carregando métricas do copiloto...</p>
        <style jsx>{`
          .copilot-dashboard.loading { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; gap: var(--spacing-md); color: var(--text-tertiary); }
          .copilot-dashboard.loading p { color: var(--text-secondary); }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="copilot-dashboard error">
        <div className="error-card">
          <h2>Erro ao Carregar</h2>
          <p>{error}</p>
          <button onClick={handleRefresh} className="retry-button">
            <FontAwesomeIcon icon={faRefresh} />
            Tentar Novamente
          </button>
        </div>
        <style jsx>{`
          .copilot-dashboard.error { display: flex; align-items: center; justify-content: center; min-height: 60vh; }
          .error-card { background: var(--card-background); padding: var(--spacing-xl); border-radius: var(--border-radius-lg); box-shadow: var(--card-shadow); text-align: center; max-width: 400px; }
          .error-card h2 { color: var(--color-error); margin-bottom: var(--spacing-md); }
          .error-card p { color: var(--text-secondary); margin-bottom: var(--spacing-lg); }
          .retry-button { padding: var(--spacing-sm) var(--spacing-lg); background: var(--gradient-primary); color: white; border: none; border-radius: var(--border-radius-md); font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: var(--spacing-sm); transition: var(--transition-normal); }
          .retry-button:hover { transform: translateY(-2px); box-shadow: var(--card-shadow-hover); }
        `}</style>
      </div>
    );
  }

  return (
    <div className="copilot-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-title">
            <FontAwesomeIcon icon={faRobot} className="header-icon" />
            <div>
              <h1>Copiloto Gemini 2.5 Pro</h1>
              <p className="header-subtitle">Sistema de Automação Inteligente</p>
            </div>
          </div>
          <div className="header-actions">
            <label className="auto-refresh-toggle">
              <input type="checkbox" checked={autoRefresh} onChange={(e) => setAutoRefresh(e.target.checked)} />
              <span>Auto-atualizar (30s)</span>
            </label>
            <button onClick={handleRefresh} className="refresh-button" disabled={loading}>
              <FontAwesomeIcon icon={faRefresh} spin={loading} />
              Atualizar
            </button>
          </div>
        </div>
        {lastUpdate && <div className="last-update">Última atualização: {lastUpdate.toLocaleTimeString('pt-BR')}</div>}
      </div>

      {/* Two Column Layout */}
      <div className="two-column-layout">
        {/* Left: Chat (40%) */}
        <div className="chat-column">
          <CopilotChat />
        </div>

        {/* Right: Dashboard (60%) */}
        <div className="dashboard-column">
          <div className="dashboard-content">
            <div className="section full-width"><MetricsOverview data={metrics || {}} /></div>
            <div className="section half"><AlertsPanel alerts={metrics?.alerts?.active || []} /></div>
            <div className="section half"><ForecastsChart forecasts={metrics?.forecasts?.forecasts || []} /></div>
            <div className="section full-width"><RecommendationsList recommendations={metrics?.recommendations || []} /></div>
            <div className="section half"><SchedulerStatus tasks={metrics?.scheduler?.tasks || []} stats={metrics?.scheduler?.stats || { totalTasks: 0, enabledTasks: 0, totalRuns: 0 }} /></div>
            <div className="section half"><TrendingTopics topics={metrics?.trending?.top || []} cache={metrics?.trending?.cache || { categories: [], totalTopics: 0, lastUpdated: {} }} /></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .copilot-dashboard {
          padding: var(--spacing-lg);
          max-width: 100%;
          margin: 0 auto;
          height: calc(100vh - 120px);
          display: flex;
          flex-direction: column;
        }

        .dashboard-header {
          margin-bottom: var(--spacing-lg);
          background: var(--card-background);
          padding: var(--spacing-lg);
          border-radius: var(--border-radius-lg);
          box-shadow: var(--card-shadow);
          flex-shrink: 0;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: var(--spacing-lg);
          flex-wrap: wrap;
        }

        .header-title {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
        }

        .header-title :global(.header-icon) {
          font-size: 2.5rem;
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .header-title h1 {
          margin: 0;
          font-size: 1.75rem;
          color: var(--text-primary);
        }

        .header-subtitle {
          margin: 0;
          font-size: 0.875rem;
          color: var(--text-tertiary);
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
        }

        .auto-refresh-toggle {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          font-size: 0.875rem;
          color: var(--text-secondary);
          user-select: none;
        }

        .auto-refresh-toggle input {
          cursor: pointer;
        }

        .refresh-button {
          padding: var(--spacing-sm) var(--spacing-md);
          background: var(--gradient-primary);
          color: white;
          border: none;
          border-radius: var(--border-radius-md);
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          transition: var(--transition-normal);
        }

        .refresh-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: var(--card-shadow-hover);
        }

        .refresh-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .last-update {
          margin-top: var(--spacing-sm);
          font-size: 0.8rem;
          color: var(--text-tertiary);
          text-align: right;
        }

        /* Two Column Layout */
        .two-column-layout {
          display: grid;
          grid-template-columns: 40% 60%;
          gap: var(--spacing-lg);
          flex: 1;
          overflow: hidden;
        }

        .chat-column {
          display: flex;
          flex-direction: column;
          min-height: 0;
        }

        .dashboard-column {
          display: flex;
          flex-direction: column;
          min-height: 0;
          overflow-y: auto;
        }

        .dashboard-content {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--spacing-lg);
        }

        .section.full-width {
          grid-column: 1 / -1;
        }

        .section.half {
          grid-column: span 1;
        }

        /* Responsive */
        @media (max-width: 1400px) {
          .two-column-layout {
            grid-template-columns: 45% 55%;
          }
        }

        @media (max-width: 1024px) {
          .two-column-layout {
            grid-template-columns: 1fr;
            grid-template-rows: 500px 1fr;
          }

          .dashboard-content {
            grid-template-columns: 1fr;
          }

          .section.half {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 768px) {
          .copilot-dashboard {
            padding: var(--spacing-md);
          }

          .header-content {
            flex-direction: column;
            align-items: flex-start;
          }

          .header-title {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--spacing-sm);
          }

          .header-actions {
            width: 100%;
            flex-direction: column;
            align-items: stretch;
          }

          .refresh-button {
            width: 100%;
            justify-content: center;
          }

          .two-column-layout {
            grid-template-rows: 400px 1fr;
          }
        }
      `}</style>
    </div>
  );
}
