'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faSpinner, faHourglassHalf, faRocket, faShieldAlt, faUsers, faLightbulb, faGlobe } from '@fortawesome/free-solid-svg-icons';
import PageWrapper from '@/components/layout/PageWrapper';

const pageHeader = {
  title: 'Roadmap Estratégico',
  description: 'Nossa jornada é clara. Cada passo é planejado para construir um legado duradouro de prosperidade e educação.',
  shortTitle: 'Roadmap'
};

export default function RoadmapPage() {
  const [activePhase, setActivePhase] = useState(1);

  const phases = [
    {
      id: 1,
      title: 'Fase 1: O Despertar',
      status: 'completed',
      date: 'Q4 2024',
      icon: faLightbulb,
      color: '',
      borderColor: 'border-green-500',
      bg: 'bg-green-500/10',
      items: [
        { text: 'Lançamento do Token $MILAGRE no Pump.fun', done: true },
        { text: 'Criação da Comunidade (Discord & Telegram)', done: true },
        { text: 'Desenvolvimento da Plataforma Educacional v1', done: true },
        { text: 'Publicação dos Primeiros Artigos e Tutoriais', done: true },
        { text: 'Integração de Dados de Mercado em Tempo Real', done: true }
      ]
    },
    {
      id: 2,
      title: 'Fase 2: A Expansão',
      status: 'active',
      date: 'Q1 2025',
      icon: faRocket,
      color: '',
      borderColor: 'border-teal-500',
      bg: 'bg-teal-500/10',
      items: [
        { text: 'Profissionalização Legal (Termos e Privacidade)', done: true },
        { text: 'Otimização de Performance (Core Web Vitals)', done: false },
        { text: 'Lançamento da Área de Membros', done: false },
        { text: 'Parcerias com Influenciadores de Educação', done: false },
        { text: 'Listagem em Agregadores (CoinGecko/CMC)', done: false }
      ]
    },
    {
      id: 3,
      title: 'Fase 3: A Consolidação',
      status: 'upcoming',
      date: 'Q2 2025',
      icon: faShieldAlt,
      color: '',
      borderColor: 'border-blue-500',
      bg: 'bg-blue-500/10',
      items: [
        { text: 'Auditoria de Contratos Inteligentes', done: false },
        { text: 'Ferramentas de Análise On-Chain Exclusivas', done: false },
        { text: 'Expansão para Outros Idiomas (EN/ES)', done: false },
        { text: 'Aplicativo Móvel (iOS/Android)', done: false }
      ]
    },
    {
      id: 4,
      title: 'Fase 4: O Legado',
      status: 'upcoming',
      date: 'Q3 2025+',
      icon: faGlobe,
      color: 'text-purple-500',
      borderColor: 'border-purple-500',
      bg: 'bg-purple-500/10',
      items: [
        { text: 'Governança DAO Completa', done: false },
        { text: 'Fundo de Investimento Comunitário', done: false },
        { text: 'Eventos Presenciais e Workshops', done: false },
        { text: 'Ecossistema de Produtos $MILAGRE', done: false }
      ]
    }
  ];

  return (
    <PageWrapper header={pageHeader}>
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">

          <div className="relative pl-0 md:pl-8">
            {/* Vertical Line (Desktop/Mobile) - Aligned Left */}
            <div className="absolute left-8 md:left-16 top-0 bottom-0 w-1 bg-gradient-to-b from-[var(--brand-primary)] via-[var(--brand-secondary)] to-transparent opacity-20 block rounded-full transform -translate-x-1/2"></div>

            <div className="space-y-12">
              {phases.map((phase, index) => {
                const isActive = activePhase === phase.id;

                return (
                  <div
                    key={phase.id}
                    className="flex flex-col md:flex-row items-start md:items-center gap-6 group relative"
                    onMouseEnter={() => setActivePhase(phase.id)}
                  >

                    {/* Left Marker */}
                    <div className="relative z-10 flex-shrink-0 pl-4 md:pl-12">
                      <div className={`w-8 h-8 md:w-16 md:h-16 rounded-full ${phase.bg} ${phase.color} flex items-center justify-center text-sm md:text-2xl shadow-[0_0_20px_rgba(0,0,0,0.2)] border-2 md:border-4 border-[var(--bg-secondary)] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12`}>
                        <span className="font-bold">{phase.id}</span>
                      </div>
                    </div>

                    {/* Content Card */}
                    <div className="flex-1 w-full">
                      <div className={`glass-card p-6 md:p-8 rounded-3xl border-l-4 ${phase.borderColor} transition-all duration-500 hover:shadow-2xl hover:translate-x-2 relative overflow-hidden`}>
                        {/* Background Glow */}
                        <div className={`absolute top-0 right-0 w-64 h-64 ${phase.bg} rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-50 transition-opacity duration-500 pointer-events-none`}></div>

                        <div className="flex flex-wrap items-center justify-between mb-4 gap-3 relative z-10">
                          <span className={`text-xs md:text-sm font-bold uppercase tracking-widest ${phase.color} bg-[var(--bg-primary)] px-3 py-1 rounded-full border border-[var(--border-light)]`}>
                            {phase.date}
                          </span>
                          <div className="flex items-center gap-2">
                            {phase.status === 'completed' && <span className=" text-xs md:text-sm font-bold flex items-center gap-1">Concluído</span>}
                            {phase.status === 'active' && <span className=" text-xs md:text-sm font-bold flex items-center gap-1 animate-pulse">Em Andamento</span>}
                            {phase.status === 'upcoming' && <span className="text-[var(--text-tertiary)] text-xs md:text-sm font-bold flex items-center gap-1">Futuro</span>}
                          </div>
                        </div>

                        <h3 className="title-newtab text-xl md:text-2xl mb-4 relative z-10">{phase.title}</h3>

                        <ul className="space-y-3 relative z-10">
                          {phase.items.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-[var(--text-secondary)] text-sm md:text-base">
                              <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${item.done ? 'bg-green-500' : 'bg-[var(--text-tertiary)]'}`}></div>
                              <span className={item.done ? 'line-through opacity-70' : ''}>{item.text}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
