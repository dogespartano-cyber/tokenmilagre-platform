'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faNewspaper,
  faGraduationCap,
  faUsers,
  faSpinner,
  faExclamationTriangle,
  faArrowRight,
  faCalendarWeek,
  faBook,
  faComments,
  faRobot
} from '@fortawesome/free-solid-svg-icons';
import AdminRoute from '@/components/AdminRoute';

interface AdminStats {
  totalArticles: number;
  totalNews: number;
  totalEducational: number;
  totalUsers: number;
  publishedThisWeek: number;
  educationalByLevel: {
    iniciante: number;
    intermediario: number;
    avancado: number;
  };
}

interface FeatureCard {
  title: string;
  description: string;
  icon: any;
  href: string;
  gradient: string;
  stats?: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Erro ao buscar estatísticas');
      }

      setStats(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const features: FeatureCard[] = [
    {
      title: 'Chat IA Colaborativa',
      description: 'Gemini e Perplexity conversando entre si - use @menções',
      icon: faRobot,
      href: '/dashboard/chat-ia',
      gradient: 'linear-gradient(135deg, #ec4899, #8b5cf6)'
    },
    {
      title: 'Gerenciar Artigos',
      description: 'Visualize, edite e delete artigos publicados',
      icon: faNewspaper,
      href: '/dashboard/artigos',
      gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)',
      stats: stats ? `${stats.totalArticles} artigos` : undefined
    },
    {
      title: 'Gerar com IA',
      description: 'Crie artigos automaticamente com Perplexity AI',
      icon: faRobot,
      href: '/dashboard/criar-artigo',
      gradient: 'linear-gradient(135deg, #10b981, #059669)'
    },
    {
      title: 'Usuários',
      description: 'Gerencie usuários e permissões',
      icon: faUsers,
      href: '/dashboard/usuarios',
      gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
      stats: stats ? `${stats.totalUsers} usuários` : undefined
    }
  ];

  return (
    <AdminRoute allowEditor={false}>
      <div className="container mx-auto px-4 py-8">
        {/* Error State */}
        {error && (
          <div
            className="rounded-xl p-4 mb-6 border flex items-start gap-3"
            style={{
              backgroundColor: '#fef2f2',
              borderColor: '#ef4444',
            }}
          >
            <FontAwesomeIcon icon={faExclamationTriangle} className="w-5 h-5 text-red-500 mt-0.5" />
            <div>
              <p className="font-semibold text-red-700">Erro ao carregar estatísticas</p>
              <p className="text-sm text-red-600">{error}</p>
              <button
                onClick={fetchStats}
                className="mt-2 text-sm font-semibold text-red-700 hover:underline"
              >
                Tentar novamente
              </button>
            </div>
          </div>
        )}

        {/* Stats Overview */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-2xl p-6 border animate-pulse"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderColor: 'var(--border-light)'
                }}
              >
                <div className="h-12 w-12 rounded-full mb-4" style={{ backgroundColor: 'var(--bg-secondary)' }} />
                <div className="h-8 w-20 rounded mb-2" style={{ backgroundColor: 'var(--bg-secondary)' }} />
                <div className="h-4 w-32 rounded" style={{ backgroundColor: 'var(--bg-secondary)' }} />
              </div>
            ))}
          </div>
        ) : stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Articles */}
            <div
              className="rounded-2xl p-6 border shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border-light)'
              }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}
              >
                <FontAwesomeIcon icon={faBook} className="w-6 h-6 text-white" />
              </div>
              <p className="text-3xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                {stats.totalArticles}
              </p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Total de Artigos
              </p>
              <div className="mt-3 flex gap-2 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                <span>{stats.totalNews} notícias</span>
                <span>•</span>
                <span>{stats.totalEducational} educacionais</span>
              </div>
            </div>

            {/* Published This Week */}
            <div
              className="rounded-2xl p-6 border shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border-light)'
              }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
              >
                <FontAwesomeIcon icon={faCalendarWeek} className="w-6 h-6 text-white" />
              </div>
              <p className="text-3xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                {stats.publishedThisWeek}
              </p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Publicados Esta Semana
              </p>
            </div>

            {/* Total Users */}
            <div
              className="rounded-2xl p-6 border shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border-light)'
              }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}
              >
                <FontAwesomeIcon icon={faUsers} className="w-6 h-6 text-white" />
              </div>
              <p className="text-3xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                {stats.totalUsers}
              </p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Usuários Cadastrados
              </p>
            </div>

            {/* Educational by Level */}
            <div
              className="rounded-2xl p-6 border shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border-light)'
              }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
              >
                <FontAwesomeIcon icon={faGraduationCap} className="w-6 h-6 text-white" />
              </div>
              <p className="text-3xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                {stats.totalEducational}
              </p>
              <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                Artigos Educacionais
              </p>
              <div className="space-y-1 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                <div className="flex justify-between">
                  <span>Iniciante:</span>
                  <span className="font-semibold">{stats.educationalByLevel.iniciante}</span>
                </div>
                <div className="flex justify-between">
                  <span>Intermediário:</span>
                  <span className="font-semibold">{stats.educationalByLevel.intermediario}</span>
                </div>
                <div className="flex justify-between">
                  <span>Avançado:</span>
                  <span className="font-semibold">{stats.educationalByLevel.avancado}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Feature Cards */}
        <div>
          <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
            Ferramentas Administrativas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {features.map((feature) => (
              <Link
                key={feature.href}
                href={feature.href}
                className="group relative rounded-2xl p-6 border overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderColor: 'var(--border-light)'
                }}
              >
                {/* Background Gradient Effect */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                  style={{ background: feature.gradient }}
                />

                <div className="relative z-10">
                  {/* Icon */}
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                    style={{ background: feature.gradient }}
                  >
                    <FontAwesomeIcon icon={feature.icon} className="w-7 h-7 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                    {feature.title}
                  </h3>
                  <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                    {feature.description}
                  </p>

                  {/* Stats */}
                  {feature.stats && (
                    <p className="text-sm font-semibold mb-3" style={{ color: 'var(--brand-primary)' }}>
                      {feature.stats}
                    </p>
                  )}

                  {/* Arrow */}
                  <div className="flex items-center gap-2 text-sm font-semibold transition-all duration-300 group-hover:gap-4" style={{ color: 'var(--brand-primary)' }}>
                    <span>Acessar</span>
                    <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AdminRoute>
  );
}
