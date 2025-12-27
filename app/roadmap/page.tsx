'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faSpinner, faHourglassHalf, faRocket, faShieldAlt, faUsers, faLightbulb, faGlobe } from '@fortawesome/free-solid-svg-icons';

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
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
<h1 className="title-newtab text-4xl md:text-6xl mb-6 font-inter">
            Roadmap Estratégico
          </h1>
          <p className="text-xl text-[var(--text-secondary)] max-w-3xl mx-auto">
            Nossa jornada é clara. Cada passo é planejado para construir um legado duradouro de prosperidade e educação.
          </p>
        </div>

        <div className="relative">
          {/* Vertical Line (Desktop) */}
          <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-[var(--brand-primary)] via-[var(--brand-secondary)] to-transparent opacity-20 hidden md:block rounded-full"></div>

          <div className="space-y-12 md:space-y-24">
            {phases.map((phase, index) => {
              const isEven = index % 2 === 0;
              const isActive = activePhase === phase.id;

              return (
                <div
                  key={phase.id}
                  className={`flex flex-col md:flex-row items-center gap-8 ${isEven ? 'md:flex-row-reverse' : ''} group`}
                  onMouseEnter={() => setActivePhase(phase.id)}
                >

                  {/* Content Card */}
                  <div className="flex-1 w-full">
                    <div className={`glass-card p-8 rounded-3xl border-t-4 ${phase.borderColor} transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] relative overflow-hidden`}>
                      {/* Background Glow */}
                      <div className={`absolute top-0 right-0 w-64 h-64 ${phase.bg} rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-50 transition-opacity duration-500 pointer-events-none`}></div>

                      <div className="flex items-center justify-between mb-6 relative z-10">
                        <span className={`text-sm font-bold uppercase tracking-widest ${phase.color} bg-[var(--bg-primary)] px-3 py-1 rounded-full border border-[var(--border-light)]`}>
                          {phase.date}
                        </span>
                        <div className="flex items-center gap-2">
                          {phase.status === 'completed' && <span className=" text-sm font-bold flex items-center gap-1">Concluído</span>}
                          {phase.status === 'active' && <span className=" text-sm font-bold flex items-center gap-1 animate-pulse">Em Andamento</span>}
                          {phase.status === 'upcoming' && <span className="text-[var(--text-tertiary)] text-sm font-bold flex items-center gap-1">Futuro</span>}
                        </div>
                      </div>

<h3 className="title-newtab text-2xl mb-4 relative z-10">{phase.title}</h3>

                      <ul className="space-y-3 relative z-10">
                        {phase.items.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-[var(--text-secondary)]">
                            <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${item.done ? 'bg-green-500' : 'bg-[var(--text-tertiary)]'}`}></div>
                            <span className={item.done ? 'line-through opacity-70' : ''}>{item.text}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Center Marker */}
                  <div className="relative z-10 flex-shrink-0">
                    <div className={`w-16 h-16 rounded-full ${phase.bg} ${phase.color} flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(0,0,0,0.2)] border-4 border-[var(--bg-secondary)] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12`}>
                      <span className="font-bold text-xl">{phase.id}</span>
                    </div>
                  </div>

                  {/* Spacer */}
                  <div className="flex-1 hidden md:block"></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
