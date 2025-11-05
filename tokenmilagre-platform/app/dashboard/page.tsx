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
      title: '🤖 Copiloto Gemini',
      description: 'Assistente administrativo com poderes completos - Gemini 2.5 Pro',
      icon: faRobot,
      href: '/dashboard/copilot',
      gradient: 'linear-gradient(135deg, #7C3AED, #F59E0B)'
    },
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
              className="group relative rounded-2xl p-6 border shadow-md overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
              style={{
                background: 'linear-gradient(135deg, #3b82f615, var(--bg-elevated))',
                borderColor: 'var(--border-light)'
              }}
            >
              {/* Glow no topo no hover */}
              <div
                className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  boxShadow: '0 0 20px #3b82f640'
                }}
              />
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                  style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}
                >
                  <FontAwesomeIcon icon={faBook} className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-3xl font-bold mb-1 font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
                {stats.totalArticles}
              </p>
              <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                Total de Artigos
              </p>
              <div className="pt-3 border-t flex gap-2 text-xs" style={{ borderColor: 'var(--border-light)', color: 'var(--text-tertiary)' }}>
                <span>{stats.totalNews} notícias</span>
                <span>•</span>
                <span>{stats.totalEducational} educacionais</span>
              </div>
            </div>

            {/* Published This Week */}
            <div
              className="group relative rounded-2xl p-6 border shadow-md overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
              style={{
                background: 'linear-gradient(135deg, #10b98115, var(--bg-elevated))',
                borderColor: 'var(--border-light)'
              }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  boxShadow: '0 0 20px #10b98140'
                }}
              />
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                  style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
                >
                  <FontAwesomeIcon icon={faCalendarWeek} className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-3xl font-bold mb-1 font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
                {stats.publishedThisWeek}
              </p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Publicados Esta Semana
              </p>
            </div>

            {/* Total Users */}
            <div
              className="group relative rounded-2xl p-6 border shadow-md overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
              style={{
                background: 'linear-gradient(135deg, #8b5cf615, var(--bg-elevated))',
                borderColor: 'var(--border-light)'
              }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                  boxShadow: '0 0 20px #8b5cf640'
                }}
              />
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                  style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}
                >
                  <FontAwesomeIcon icon={faUsers} className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-3xl font-bold mb-1 font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
                {stats.totalUsers}
              </p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Usuários Cadastrados
              </p>
            </div>

            {/* Educational by Level */}
            <div
              className="group relative rounded-2xl p-6 border shadow-md overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
              style={{
                background: 'linear-gradient(135deg, #f59e0b15, var(--bg-elevated))',
                borderColor: 'var(--border-light)'
              }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  boxShadow: '0 0 20px #f59e0b40'
                }}
              />
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                  style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
                >
                  <FontAwesomeIcon icon={faGraduationCap} className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-3xl font-bold mb-1 font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
                {stats.totalEducational}
              </p>
              <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                Artigos Educacionais
              </p>
              <div className="pt-3 border-t space-y-1 text-xs" style={{ borderColor: 'var(--border-light)', color: 'var(--text-tertiary)' }}>
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

        {/* Feature Cards - NOVO DESIGN BASEADO EM EDUCAÇÃO */}
        <div>
          <h2 className="text-2xl font-bold mb-6 font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
            Ferramentas Administrativas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {features.map((feature) => (
              <Link
                key={feature.href}
                href={feature.href}
                className="group relative rounded-2xl p-6 overflow-hidden border shadow-md transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl cursor-pointer block"
                style={{
                  background: `linear-gradient(135deg, ${feature.gradient}08, var(--bg-elevated))`,
                  borderColor: 'var(--border-light)'
                }}
              >
                {/* Glow sutil no topo no hover */}
                <div
                  className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: feature.gradient,
                    boxShadow: `0 0 20px ${feature.gradient}40`
                  }}
                />

                {/* Content wrapper */}
                <div className="relative flex flex-col h-full">
                  {/* Header do Card */}
                  <div className="flex items-start justify-between mb-4">
                    {/* Ícone com gradiente */}
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                      style={{ background: feature.gradient }}
                    >
                      <FontAwesomeIcon icon={feature.icon} className="w-7 h-7 text-white" />
                    </div>

                    {/* Stats badge (se houver) */}
                    {feature.stats && (
                      <span
                        className="text-xs font-bold px-3 py-1.5 rounded-lg backdrop-blur-sm"
                        style={{
                          backgroundColor: `${feature.gradient}15`,
                          border: `1px solid ${feature.gradient}30`,
                          color: 'var(--brand-primary)'
                        }}
                      >
                        {feature.stats}
                      </span>
                    )}
                  </div>

                  {/* Título */}
                  <h3 className="font-bold text-xl mb-3 group-hover:text-brand-primary transition-colors min-h-[3rem]" style={{ color: 'var(--text-primary)' }}>
                    {feature.title}
                  </h3>

                  {/* Descrição */}
                  <p className="text-sm mb-4 leading-relaxed opacity-90 min-h-[2.5rem]" style={{ color: 'var(--text-secondary)' }}>
                    {feature.description}
                  </p>

                  {/* Spacer to push footer to bottom */}
                  <div className="flex-grow"></div>

                  {/* Footer */}
                  <div className="pt-3 border-t" style={{ borderColor: 'var(--border-light)' }}>
                    <div className="flex items-center justify-end">
                      {/* CTA com seta animada */}
                      <div className="flex items-center gap-2 text-sm font-bold group-hover:gap-3 transition-all" style={{ color: 'var(--text-primary)' }}>
                        Acessar
                        <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
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
