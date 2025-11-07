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
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <FontAwesomeIcon icon={faSpinner} spin size="3x" className="text-purple-500" />
        <p className="text-gray-500">Carregando métricas do copiloto...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center max-w-md">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Erro ao Carregar</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
          >
            <FontAwesomeIcon icon={faRefresh} />
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 max-w-[2000px] mx-auto h-[calc(100vh-120px)] flex flex-col">
      {/* Header */}
      <div className="mb-6 bg-white dark:bg-gray-800 p-4 lg:p-6 rounded-xl shadow-md flex-shrink-0">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center gap-4">
            <FontAwesomeIcon
              icon={faRobot}
              className="text-4xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Copiloto Gemini 2.5 Pro
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Sistema de Automação Inteligente
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 w-full lg:w-auto">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 dark:text-gray-400 select-none">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded cursor-pointer"
              />
              <span>Auto-atualizar (30s)</span>
            </label>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:transform-none"
            >
              <FontAwesomeIcon icon={faRefresh} spin={loading} />
              Atualizar
            </button>
          </div>
        </div>
        {lastUpdate && (
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-right">
            Última atualização: {lastUpdate.toLocaleTimeString('pt-BR')}
          </div>
        )}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-6 flex-1 overflow-hidden">
        {/* Left: Chat (40%) */}
        <div className="flex flex-col min-h-0">
          <CopilotChat />
        </div>

        {/* Right: Dashboard (60%) */}
        <div className="flex flex-col min-h-0 overflow-y-auto">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="xl:col-span-2">
              <MetricsOverview data={metrics || {}} />
            </div>
            <div>
              <AlertsPanel alerts={metrics?.alerts?.active || []} />
            </div>
            <div>
              <ForecastsChart forecasts={metrics?.forecasts?.forecasts || []} />
            </div>
            <div className="xl:col-span-2">
              <RecommendationsList recommendations={metrics?.recommendations || []} />
            </div>
            <div>
              <SchedulerStatus
                tasks={metrics?.scheduler?.tasks || []}
                stats={metrics?.scheduler?.stats || { totalTasks: 0, enabledTasks: 0, totalRuns: 0 }}
              />
            </div>
            <div>
              <TrendingTopics
                topics={metrics?.trending?.top || []}
                cache={metrics?.trending?.cache || { categories: [], totalTopics: 0, lastUpdated: {} }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
