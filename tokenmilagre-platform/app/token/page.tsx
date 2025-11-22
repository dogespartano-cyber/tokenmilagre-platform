'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Script from 'next/script';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShieldAlt,
  faUsers,
  faChartLine,
  faArrowRight,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import { faDiscord, faTelegram } from '@fortawesome/free-brands-svg-icons';

export default function TokenPage() {
  const [isVisible, setIsVisible] = useState(false);
  const TOKEN_ADDRESS = '3tpz3ar7gaHmPZfhWHzRdPnBJ5MrZZVDxepDtDLYpump';

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(TOKEN_ADDRESS);
  };

  return (
    <>
      {/* Schema.org JSON-LD */}
      <Script id="token-schema" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "$MILAGRE Token - O Futuro da Educação Financeira Descentralizada",
          "description": "Token comunitário focado em valor de longo prazo, transparência e educação financeira",
          "url": "https://tokenmilagre.xyz/token"
        })}
      </Script>

      {/* Hero Section - Sereno e Centrado */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Subtle Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-teal-900/20 to-slate-900"></div>

        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-400 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-400 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className={`relative z-10 max-w-5xl mx-auto px-6 text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

          {/* Animated Logo (from login page) */}
          <div className="flex justify-center mb-12">
            <div className="relative w-40 h-40 md:w-48 md:h-48">
              {/* Animated rings */}
              <div className="absolute inset-0 animate-spin-slow">
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-teal-400/30"></div>
              </div>
              <div className="absolute inset-2 animate-spin-reverse">
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-blue-400/30"></div>
              </div>

              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-teal-300/20 via-blue-300/20 to-indigo-300/20 blur-2xl animate-pulse"></div>

              {/* Image */}
              <div className="relative z-10 transform hover:scale-105 transition-all duration-700">
                <Image
                  src="/images/TOKEN-MILAGRE-Hero.webp"
                  alt="$MILAGRE"
                  width={192}
                  height={192}
                  className="drop-shadow-2xl rounded-full"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Hero Text */}
          <h1 className="text-5xl md:text-7xl font-light mb-6 text-white font-[family-name:var(--font-poppins)] tracking-tight">
            $MILAGRE
          </h1>

          <p className="text-xl md:text-2xl text-slate-300 font-light mb-4 max-w-2xl mx-auto leading-relaxed">
            O token da educação financeira descentralizada
          </p>

          <p className="text-sm md:text-base text-slate-400 mb-12 max-w-xl mx-auto">
            Construído com transparência, projetado para o longo prazo
          </p>

          {/* Subtle CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={`https://pump.fun/coin/${TOKEN_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group px-8 py-4 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-500 hover:to-blue-500 text-white rounded-full font-medium transition-all shadow-lg hover:shadow-teal-500/50 flex items-center gap-2"
            >
              <span>Explorar Ecossistema</span>
              <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>

            <button
              onClick={copyToClipboard}
              className="px-8 py-4 bg-white/5 hover:bg-white/10 backdrop-blur text-white border border-white/20 rounded-full font-medium transition-all"
            >
              Copiar Endereço
            </button>
          </div>
        </div>

        <style jsx>{`
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes spin-reverse {
            from { transform: rotate(360deg); }
            to { transform: rotate(0deg); }
          }
          .animate-spin-slow {
            animation: spin-slow 20s linear infinite;
          }
          .animate-spin-reverse {
            animation: spin-reverse 15s linear infinite;
          }
        `}</style>
      </section>

      {/* 3 Pilares Section */}
      <section className="py-32 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="max-w-6xl mx-auto px-6">

          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-light text-white mb-4 font-[family-name:var(--font-poppins)]">
              Por que $MILAGRE?
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Três pilares que sustentam nossa visão de longo prazo
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: faChartLine,
                title: 'Utilidade Real',
                description: 'Token com propósito: recompensas por aprendizado, acesso a conteúdo premium e governança comunitária',
                color: 'from-teal-500 to-cyan-500'
              },
              {
                icon: faUsers,
                title: 'Comunidade Forte',
                description: 'Construído por educadores e investidores que acreditam em crescimento sustentável e transparente',
                color: 'from-blue-500 to-indigo-500'
              },
              {
                icon: faShieldAlt,
                title: 'Transparência Total',
                description: 'Open source, verificável on-chain. Todas as decisões e métricas públicas e auditáveis',
                color: 'from-indigo-500 to-purple-500'
              }
            ].map((pillar, index) => (
              <div key={index} className="group">
                <div className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-10 hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-teal-500/20">

                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${pillar.color} p-4 mb-6 group-hover:scale-110 transition-transform`}>
                    <FontAwesomeIcon icon={pillar.icon} className="w-full h-full text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-semibold text-white mb-4 font-[family-name:var(--font-poppins)]">
                    {pillar.title}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-300 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tokenomics Section - Minimal */}
      <section className="py-32 bg-slate-800">
        <div className="max-w-4xl mx-auto px-6">

          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light text-white mb-4 font-[family-name:var(--font-poppins)]">
              Tokenomics Simples
            </h2>
            <p className="text-slate-400 text-lg">
              Sem complexidade. Distribuição clara e justa
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-12">

            {/* Supply */}
            <div className="text-center mb-12">
              <p className="text-slate-400 text-sm mb-2 uppercase tracking-widest">Supply Total</p>
              <p className="text-6xl font-light text-white mb-2">1B</p>
              <p className="text-slate-400">Um bilhão de tokens</p>
            </div>

            {/* Distribution */}
            <div className="space-y-6">
              {[
                { label: 'Liquidez Inicial', percentage: '100%', description: 'Disponível na bonding curve' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/10">
                  <div>
                    <p className="text-white font-medium mb-1">{item.label}</p>
                    <p className="text-slate-400 text-sm">{item.description}</p>
                  </div>
                  <p className="text-2xl font-light text-teal-400">{item.percentage}</p>
                </div>
              ))}
            </div>

            {/* Tech Stack */}
            <div className="mt-12 pt-8 border-t border-white/10">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-center">
                {[
                  { label: 'Blockchain', value: 'Solana' },
                  { label: 'Tipo', value: 'SPL Token' },
                  { label: 'Velocidade', value: '<1s' }
                ].map((stat, index) => (
                  <div key={index}>
                    <p className="text-slate-400 text-sm mb-2">{stat.label}</p>
                    <p className="text-white font-medium">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-32 bg-gradient-to-b from-slate-800 to-slate-900">
        <div className="max-w-4xl mx-auto px-6">

          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light text-white mb-4 font-[family-name:var(--font-poppins)]">
              Visão de Longo Prazo
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Estamos construindo um ecossistema, não apenas um token
            </p>
          </div>

          <div className="space-y-8">
            {[
              {
                phase: 'Fase 1',
                title: 'Fundação',
                description: 'Lançamento do token, formação da comunidade e início da plataforma educacional',
                status: 'current'
              },
              {
                phase: 'Fase 2',
                title: 'Expansão',
                description: 'Graduação na Raydium, parcerias estratégicas e programa de recompensas por aprendizado',
                status: 'upcoming'
              },
              {
                phase: 'Fase 3',
                title: 'Ecossistema',
                description: 'DAO comunitária, governança descentralizada e produtos financeiros educativos',
                status: 'future'
              }
            ].map((phase, index) => (
              <div key={index} className="relative">
                <div className="flex items-start gap-6 p-8 bg-white/5 backdrop-blur border border-white/10 rounded-2xl hover:bg-white/10 transition-all">

                  {/* Status indicator */}
                  <div className={`w-3 h-3 rounded-full mt-2 ${
                    phase.status === 'current' ? 'bg-teal-400' :
                    phase.status === 'upcoming' ? 'bg-blue-400' :
                    'bg-slate-600'
                  }`}></div>

                  <div className="flex-1">
                    <p className="text-teal-400 text-sm font-medium mb-2">{phase.phase}</p>
                    <h3 className="text-2xl font-semibold text-white mb-3 font-[family-name:var(--font-poppins)]">
                      {phase.title}
                    </h3>
                    <p className="text-slate-300 leading-relaxed">
                      {phase.description}
                    </p>
                  </div>

                  {phase.status === 'current' && (
                    <span className="px-3 py-1 bg-teal-400/20 text-teal-400 text-xs font-medium rounded-full border border-teal-400/30">
                      Em Progresso
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section - Sereno */}
      <section className="py-32 bg-slate-900">
        <div className="max-w-3xl mx-auto px-6 text-center">

          <h2 className="text-4xl md:text-5xl font-light text-white mb-6 font-[family-name:var(--font-poppins)]">
            Junte-se à Jornada
          </h2>

          <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Faça parte de uma comunidade que valoriza educação, transparência e crescimento sustentável
          </p>

          {/* Community Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
            <a
              href="https://discord.gg/xk4zrz8j"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-medium transition-all shadow-lg hover:shadow-indigo-500/50"
            >
              <FontAwesomeIcon icon={faDiscord} className="w-5 h-5" />
              <span>Discord</span>
            </a>

            <a
              href="https://t.me/+Bop_TVFc_mg3Njlh"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-medium transition-all shadow-lg hover:shadow-blue-500/50"
            >
              <FontAwesomeIcon icon={faTelegram} className="w-5 h-5" />
              <span>Telegram</span>
            </a>
          </div>

          {/* Contract Address */}
          <div className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl">
            <p className="text-slate-400 text-sm mb-3 uppercase tracking-widest">Endereço do Contrato</p>
            <code className="block text-white font-mono text-sm mb-4 break-all">{TOKEN_ADDRESS}</code>
            <button
              onClick={copyToClipboard}
              className="text-teal-400 hover:text-teal-300 text-sm font-medium transition-colors flex items-center gap-2 mx-auto"
            >
              <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4" />
              <span>Copiar endereço</span>
            </button>
          </div>

          {/* Disclaimer */}
          <p className="text-slate-500 text-sm mt-12 max-w-2xl mx-auto">
            Investir em criptomoedas envolve riscos. Faça sua própria pesquisa (DYOR) e invista apenas o que você pode perder.
            Este não é um conselho financeiro.
          </p>
        </div>
      </section>
    </>
  );
}
