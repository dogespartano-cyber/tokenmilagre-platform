'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBook,
  faCalendarWeek,
  faUsers,
  faGraduationCap
} from '@fortawesome/free-solid-svg-icons';

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

interface StatsCardsProps {
  stats: AdminStats | null;
  loading: boolean;
}

export default function StatsCards({ stats, loading }: StatsCardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-lg p-3 border animate-pulse"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              borderColor: 'var(--border-light)'
            }}
          >
            <div className="h-8 w-8 rounded-full mb-2" style={{ backgroundColor: 'var(--bg-secondary)' }} />
            <div className="h-5 w-12 rounded mb-1" style={{ backgroundColor: 'var(--bg-secondary)' }} />
            <div className="h-3 w-20 rounded" style={{ backgroundColor: 'var(--bg-secondary)' }} />
          </div>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
      {/* Total Articles */}
      <div
        className="rounded-lg p-3 border transition-all duration-300 hover:scale-105"
        style={{
          backgroundColor: 'var(--bg-elevated)',
          borderColor: 'var(--border-light)'
        }}
      >
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center mb-2"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}
        >
          <FontAwesomeIcon icon={faBook} className="w-4 h-4 text-white" />
        </div>
        <p className="text-xl font-bold mb-0.5" style={{ color: 'var(--text-primary)' }}>
          {stats.totalArticles}
        </p>
        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          Total de Artigos
        </p>
        <div className="mt-1 flex gap-1.5 text-xs" style={{ color: 'var(--text-tertiary)' }}>
          <span>{stats.totalNews} notícias</span>
          <span>•</span>
          <span>{stats.totalEducational} educacionais</span>
        </div>
      </div>

      {/* Published This Week */}
      <div
        className="rounded-lg p-3 border transition-all duration-300 hover:scale-105"
        style={{
          backgroundColor: 'var(--bg-elevated)',
          borderColor: 'var(--border-light)'
        }}
      >
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center mb-2"
          style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
        >
          <FontAwesomeIcon icon={faCalendarWeek} className="w-4 h-4 text-white" />
        </div>
        <p className="text-xl font-bold mb-0.5" style={{ color: 'var(--text-primary)' }}>
          {stats.publishedThisWeek}
        </p>
        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          Publicados Esta Semana
        </p>
      </div>

      {/* Total Users */}
      <div
        className="rounded-lg p-3 border transition-all duration-300 hover:scale-105"
        style={{
          backgroundColor: 'var(--bg-elevated)',
          borderColor: 'var(--border-light)'
        }}
      >
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center mb-2"
          style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}
        >
          <FontAwesomeIcon icon={faUsers} className="w-4 h-4 text-white" />
        </div>
        <p className="text-xl font-bold mb-0.5" style={{ color: 'var(--text-primary)' }}>
          {stats.totalUsers}
        </p>
        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          Usuários Cadastrados
        </p>
      </div>

      {/* Educational by Level */}
      <div
        className="rounded-lg p-3 border transition-all duration-300 hover:scale-105"
        style={{
          backgroundColor: 'var(--bg-elevated)',
          borderColor: 'var(--border-light)'
        }}
      >
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center mb-2"
          style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
        >
          <FontAwesomeIcon icon={faGraduationCap} className="w-4 h-4 text-white" />
        </div>
        <p className="text-xl font-bold mb-0.5" style={{ color: 'var(--text-primary)' }}>
          {stats.totalEducational}
        </p>
        <p className="text-xs mb-1.5" style={{ color: 'var(--text-secondary)' }}>
          Artigos Educacionais
        </p>
        <div className="space-y-0.5 text-xs" style={{ color: 'var(--text-tertiary)' }}>
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
  );
}
