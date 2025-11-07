'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRobot,
  faRefresh,
  faSpinner,
  faChartLine,
  faBell,
  faTasks,
  faFire,
  faLightbulb,
  faClock,
  faCheckCircle,
  faExclamationTriangle
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-purple-200 dark:border-purple-900 border-t-purple-600 dark:border-t-purple-400 rounded-full animate-spin"></div>
          <FontAwesomeIcon
            icon={faRobot}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl text-purple-600 dark:text-purple-400"
          />
        </div>
        <p className="mt-6 text-lg font-medium text-gray-600 dark:text-gray-300">Inicializando Copiloto Gemini 2.5 Pro...</p>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Carregando métricas e status do sistema</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl text-center max-w-md w-full border border-red-200 dark:border-red-900">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-3xl text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Erro ao Carregar</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-200"
          >
            <FontAwesomeIcon icon={faRefresh} />
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20">
      {/* Hero Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-purple-600/10 dark:from-purple-600/5 dark:via-pink-600/5 dark:to-purple-600/5"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDEyOCwgMTI4LCAxMjgsIDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>

        <div className="relative max-w-[2000px] mx-auto px-4 lg:px-6 py-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            {/* Left: Title & Status */}
            <div className="flex items-start gap-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-xl opacity-50 animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-2xl shadow-2xl">
                  <FontAwesomeIcon icon={faRobot} className="text-4xl text-white" />
                </div>
              </div>

              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                  Copiloto Gemini 2.5 Pro
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-semibold rounded-full">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Online
                  </span>
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  Sistema de Automação Inteligente com IA
                </p>
                {lastUpdate && (
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-2 flex items-center gap-2">
                    <FontAwesomeIcon icon={faClock} className="text-purple-500" />
                    Última atualização: {lastUpdate.toLocaleTimeString('pt-BR')}
                  </p>
                )}
              </div>
            </div>

            {/* Right: Controls */}
            <div className="flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-3 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer hover:bg-white dark:hover:bg-gray-800 transition-all shadow-sm">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="w-4 h-4 rounded cursor-pointer accent-purple-600"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Auto-atualizar (30s)
                </span>
              </label>

              <button
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
              >
                <FontAwesomeIcon icon={faRefresh} spin={loading} />
                Atualizar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[2000px] mx-auto px-4 lg:px-6 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column: Chat (1/3) */}
          <div className="xl:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Chat Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FontAwesomeIcon icon={faRobot} className="text-2xl text-white" />
                    <div>
                      <h2 className="text-lg font-bold text-white">Chat IA</h2>
                      <p className="text-sm text-white/80">Gemini 2.5 Pro</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/20 rounded-lg">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    <span className="text-xs font-semibold text-white">Ativo</span>
                  </div>
                </div>
                <div className="h-[calc(100vh-240px)]">
                  <CopilotChat />
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-xl shadow-lg text-white">
                  <FontAwesomeIcon icon={faChartLine} className="text-2xl mb-2 opacity-80" />
                  <p className="text-sm opacity-90">Métricas</p>
                  <p className="text-2xl font-bold">5</p>
                </div>
                <div className="bg-gradient-to-br from-pink-500 to-pink-600 p-4 rounded-xl shadow-lg text-white">
                  <FontAwesomeIcon icon={faBell} className="text-2xl mb-2 opacity-80" />
                  <p className="text-sm opacity-90">Alertas</p>
                  <p className="text-2xl font-bold">{metrics?.alerts?.active?.length || 0}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Dashboard (2/3) */}
          <div className="xl:col-span-2 space-y-6">
            {/* Metrics Overview */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <FontAwesomeIcon icon={faChartLine} className="text-white text-lg" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Visão Geral do Sistema</h2>
              </div>
              <MetricsOverview data={metrics || {}} />
            </div>

            {/* Alerts & Forecasts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-2xl transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                    <FontAwesomeIcon icon={faBell} className="text-white text-lg" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Alertas</h2>
                </div>
                <AlertsPanel alerts={metrics?.alerts?.active || []} />
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-2xl transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <FontAwesomeIcon icon={faChartLine} className="text-white text-lg" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Previsões</h2>
                </div>
                <ForecastsChart forecasts={metrics?.forecasts?.forecasts || []} />
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <FontAwesomeIcon icon={faLightbulb} className="text-white text-lg" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recomendações</h2>
              </div>
              <RecommendationsList recommendations={metrics?.recommendations || []} />
            </div>

            {/* Scheduler & Trending */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-2xl transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                    <FontAwesomeIcon icon={faTasks} className="text-white text-lg" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Tarefas</h2>
                </div>
                <SchedulerStatus
                  tasks={metrics?.scheduler?.tasks || []}
                  stats={metrics?.scheduler?.stats || { totalTasks: 0, enabledTasks: 0, totalRuns: 0 }}
                />
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-2xl transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                    <FontAwesomeIcon icon={faFire} className="text-white text-lg" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Trending</h2>
                </div>
                <TrendingTopics
                  topics={metrics?.trending?.top || []}
                  cache={metrics?.trending?.cache || { categories: [], totalTopics: 0, lastUpdated: {} }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
