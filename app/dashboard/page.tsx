'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useClerk } from '@clerk/nextjs';
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
 faRobot,
 faSignOutAlt,
 faMagic
} from '@fortawesome/free-solid-svg-icons';
import AdminRoute from '@/components/admin/AdminRoute';
import BuildInfoBadge from '@/components/shared/BuildInfoBadge';

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
 const { signOut } = useClerk();
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

   // Map API response to expected component structure
   const apiData = data.data;
   const mappedStats: AdminStats = {
    totalArticles: apiData.articles.total,
    totalNews: apiData.articles.byType?.news || 0,
    totalEducational: apiData.articles.byType?.educational || 0,
    totalUsers: apiData.users.total,
    publishedThisWeek: apiData.articles.publishedThisWeek,
    educationalByLevel: apiData.articles.educationalByLevel || {
     iniciante: 0,
     intermediario: 0,
     avancado: 0,
    },
   };

   setStats(mappedStats);
  } catch (err) {
   setError(err instanceof Error ? err.message : 'Erro desconhecido');
  } finally {
   setLoading(false);
  }
 };

 const features: FeatureCard[] = [
  {
   title: 'Criar Artigo',
   description: 'Crie artigos manualmente ou gere em massa com IA',
   icon: faRobot,
   href: '/dashboard/criar',
   gradient: 'linear-gradient(135deg, #10b981, #059669)'
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
   title: 'Usuários',
   description: 'Gerencie usuários e permissões',
   icon: faUsers,
   href: '/dashboard/usuarios',
   gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
   stats: stats ? `${stats.totalUsers} usuários` : undefined
  },
  {
   title: 'Estúdio de IA',
   description: 'Gerador de imagens Zenith Gold',
   icon: faMagic,
   href: '/dashboard/studio',
   gradient: 'linear-gradient(135deg, #8b5cf6, #6366f1)'
  }
 ];

 return (
  <AdminRoute allowEditor={false}>
   <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-8">
    {/* Error State */}
    {error && (
     <div
      className="rounded-xl p-4 mb-6 border flex items-start gap-3"
      style={{
       backgroundColor: '#fef2f2',
       borderColor: '#ef4444',
      }}
     >
      <FontAwesomeIcon icon={faExclamationTriangle} className="w-5 h-5 mt-0.5" />
      <div>
       <p className="font-semibold ">Erro ao carregar estatísticas</p>
       <p className="text-sm ">{error}</p>
       <button
        onClick={fetchStats}
        className="mt-2 text-sm font-semibold hover:underline"
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
      {/* Total Articles - Azul */}
      <div className="group relative p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/5 border border-blue-500/20 backdrop-blur-md overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 cursor-default">
       {/* Glow no topo no hover */}
       <div className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-blue-500 to-indigo-500" style={{ boxShadow: '0 0 20px #3b82f640' }} />
       <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 bg-blue-500/10 rounded-xl transition-transform duration-300 group-hover:scale-110">
         <FontAwesomeIcon icon={faBook} className="w-5 h-5" />
        </div>
<h3 className="title-newtab dark:">Total de Artigos</h3>
       </div>
       <div className="flex items-end gap-2">
        <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalArticles}</p>
       </div>
       <p className="text-xs /60 dark:/60 mt-3 pt-3 border-t border-blue-500/20">
        {stats.totalNews} notícias • {stats.totalEducational} educacionais
       </p>
      </div>

      {/* Published This Week - Verde */}
      <div className="group relative p-6 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20 backdrop-blur-md overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-green-500/10 cursor-default">
       <div className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-green-500 to-emerald-500" style={{ boxShadow: '0 0 20px #10b98140' }} />
       <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 bg-green-500/10 rounded-xl transition-transform duration-300 group-hover:scale-110">
         <FontAwesomeIcon icon={faCalendarWeek} className="w-5 h-5" />
        </div>
<h3 className="title-newtab dark:">Esta Semana</h3>
       </div>
       <div className="flex items-end gap-2">
        <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.publishedThisWeek}</p>
        <p className="text-sm /60 dark:/60 mb-1">publicados</p>
       </div>
      </div>

      {/* Total Users - Roxo */}
      <div className="group relative p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/5 border border-purple-500/20 backdrop-blur-md overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10 cursor-default">
       <div className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-purple-500 to-pink-500" style={{ boxShadow: '0 0 20px #8b5cf640' }} />
       <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 bg-purple-500/10 rounded-xl text-purple-600 dark:text-purple-400 transition-transform duration-300 group-hover:scale-110">
         <FontAwesomeIcon icon={faUsers} className="w-5 h-5" />
        </div>
<h3 className="title-newtab text-purple-600 dark:text-purple-400">Usuários</h3>
       </div>
       <div className="flex items-end gap-2">
        <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalUsers}</p>
        <p className="text-sm text-purple-700/60 dark:text-purple-300/60 mb-1">cadastrados</p>
       </div>
      </div>

      {/* Educational by Level - Âmbar */}
      <div className="group relative p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20 backdrop-blur-md overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/10 cursor-default">
       <div className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-amber-500 to-orange-500" style={{ boxShadow: '0 0 20px #f59e0b40' }} />
       <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 bg-amber-500/10 rounded-xl transition-transform duration-300 group-hover:scale-110">
         <FontAwesomeIcon icon={faGraduationCap} className="w-5 h-5" />
        </div>
<h3 className="title-newtab dark:">Educacionais</h3>
       </div>
       <div className="flex items-end gap-2">
        <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalEducational}</p>
        <p className="text-sm /60 dark:/60 mb-1">artigos</p>
       </div>
       <div className="text-xs /60 dark:/60 mt-3 pt-3 border-t border-amber-500/20 space-y-1">
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
<h2 className="title-newtab text-2xl mb-6 font-inter" style={{ color: 'var(--text-primary)' }}>
      Ferramentas Administrativas
     </h2>
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
<h3 className="title-newtab text-xl mb-3 group-hover:text-brand-primary transition-colors min-h-[3rem]" style={{ color: 'var(--text-primary)' }}>
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

     {/* Logout Section */}
     <div className="mt-12 pt-8 border-t" style={{ borderColor: 'var(--border-medium)' }}>
      <div className="flex flex-col items-center gap-4">
       <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
        Precisa sair do painel administrativo?
       </p>
       <button
        onClick={() => signOut({ redirectUrl: '/' })}
        className="group flex items-center gap-3 px-6 py-3 rounded-lg border-2 transition-all duration-300 hover:scale-105 font-semibold"
        style={{
         backgroundColor: 'var(--bg-secondary)',
         borderColor: '#ef4444',
         color: '#ef4444'
        }}
       >
        <FontAwesomeIcon icon={faSignOutAlt} className="w-5 h-5" />
        <span>Sair do Sistema</span>
       </button>
      </div>
     </div>
    </div>
   </div>
   <BuildInfoBadge />
  </AdminRoute>
 );
}
