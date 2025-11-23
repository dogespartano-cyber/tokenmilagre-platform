'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Script from 'next/script';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLeaf,
  faUsers,
  faShieldAlt,
  faRocket,
  faChartLine,
  faCheckCircle,
  faSeedling,
  faGlobe,
  faTrophy,
  faWallet,
  faExchangeAlt,
  faCoins
} from '@fortawesome/free-solid-svg-icons';
import { faDiscord, faTelegram } from '@fortawesome/free-brands-svg-icons';

export default function TokenPage() {
  const [isVisible, setIsVisible] = useState(false);
  const TOKEN_ADDRESS = '3tpz3ar7gaHmPZfhWHzRdPnBJ5MrZZVDxepDtDLYpump';

  useEffect(() => {
    setIsVisible(true);
    // Ocultar breadcrumb nesta página
    const breadcrumbContainer = document.querySelector('main > div.container');
    if (breadcrumbContainer) {
      (breadcrumbContainer as HTMLElement).style.display = 'none';
    }
    return () => {
      const breadcrumbContainer = document.querySelector('main > div.container');
      if (breadcrumbContainer) {
        (breadcrumbContainer as HTMLElement).style.display = '';
      }
    };
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(TOKEN_ADDRESS);
    alert('Endereço copiado!');
  };

  return (
    <>
      {/* Schema.org JSON-LD */}
      <Script id="token-schema" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "$MILAGRE - Token de Educação Financeira Descentralizada",
          "description": "Construa seu futuro financeiro com transparência, comunidade e crescimento sustentável.",
          "url": "https://tokenmilagre.xyz/token"
        })}
      </Script>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800&family=Inter:wght@400;500;600&display=swap');

        .font-montserrat {
          font-family: 'Montserrat', sans-serif;
        }

        .font-inter {
          font-family: 'Inter', sans-serif;
        }

        /* Glassmorphism Base */
        .glass-panel {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.5);
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.1);
        }

        [data-theme="dark"] .glass-panel {
          background: rgba(20, 20, 20, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
        }

        /* Neumorphism Elements */
        .neumorphic-card {
          background: #f0f2f5;
          box-shadow: 9px 9px 18px #d1d3d6, -9px -9px 18px #ffffff;
          border-radius: 24px;
          border: 1px solid rgba(255,255,255,0.4);
        }

        [data-theme="dark"] .neumorphic-card {
          background: #1a1b1e;
          box-shadow: 8px 8px 16px #0d0e0f, -8px -8px 16px #27282d;
          border: 1px solid rgba(255,255,255,0.05);
        }

        .neumorphic-button {
          background: #f0f2f5;
          box-shadow: 5px 5px 10px #d1d3d6, -5px -5px 10px #ffffff;
          transition: all 0.3s ease;
        }

        .neumorphic-button:active {
          box-shadow: inset 5px 5px 10px #d1d3d6, inset -5px -5px 10px #ffffff;
        }

        [data-theme="dark"] .neumorphic-button {
          background: #1a1b1e;
          box-shadow: 5px 5px 10px #0d0e0f, -5px -5px 10px #27282d;
        }

        [data-theme="dark"] .neumorphic-button:active {
          box-shadow: inset 5px 5px 10px #0d0e0f, inset -5px -5px 10px #27282d;
        }

        /* Floating Animation */
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        /* Animated Logo */
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }

        .animate-spin-slow {
          animation: spin-slow 25s linear infinite;
        }

        .animate-spin-reverse {
          animation: spin-reverse 20s linear infinite;
        }

        /* Gradient Text */
        .gradient-text {
          background: linear-gradient(135deg, #0d9488, #14b8a6, #5eead4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Timeline for Roadmap */
        .timeline-item {
          position: relative;
        }

        .timeline-item::before {
          content: '';
          position: absolute;
          left: 32px;
          top: 64px;
          bottom: -32px;
          width: 2px;
          background: linear-gradient(180deg, #0d9488, #0f766e, #3b82f6);
        }

        .timeline-item:last-child::before {
          display: none;
        }
      `}</style>

      <div className="min-h-screen relative overflow-hidden bg-[var(--bg-secondary)] transition-colors duration-300">
        {/* Background Orbs - NO PURPLE */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-green-400/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-400/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-[40%] left-[40%] w-[400px] h-[400px] bg-teal-400/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className={`relative z-10 max-w-7xl mx-auto px-6 py-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

          {/* Hero Section */}
          <section className="text-center space-y-8 mb-24">
            {/* Animated Logo with Floating Effect */}
            <div className="flex justify-center mb-8 mt-12">
              <div className="relative w-60 h-60 md:w-72 md:h-72 animate-float">
                {/* Animated rings */}
                <div className="absolute inset-0 animate-spin-slow">
                  <div className="absolute inset-0 rounded-full border-2 border-dashed opacity-30 border-green-500"></div>
                </div>
                <div className="absolute inset-3 animate-spin-reverse">
                  <div className="absolute inset-0 rounded-full border-2 border-dashed opacity-30 border-teal-500"></div>
                </div>

                {/* Glow effect - NO PURPLE */}
                <div className="absolute inset-0 blur-2xl animate-pulse opacity-30" style={{
                  background: 'linear-gradient(135deg, #0d9488, #22c55e, #3b82f6)'
                }}></div>

                {/* Image */}
                <div className="relative z-10 flex items-center justify-center h-full transform hover:scale-105 transition-all duration-700">
                  <Image
                    src="/images/TOKEN-MILAGRE-Hero.webp"
                    alt="$MILAGRE Token"
                    width={288}
                    height={288}
                    className="drop-shadow-2xl rounded-full"
                    priority
                  />
                </div>
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-montserrat font-bold leading-tight text-gray-900 dark:text-[var(--text-primary)] drop-shadow-lg">
              Construa seu futuro financeiro com{' '}
              <span className="gradient-text">
                $MILAGRE
              </span>
            </h1>

            <p className="text-xl md:text-2xl font-inter leading-relaxed max-w-3xl mx-auto text-gray-700 dark:text-[var(--text-secondary)]">
              Token de educação financeira descentralizada. Transparente, sustentável e projetado para crescimento de longo prazo.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              {/* Primary CTA */}
              <a
                href={`https://pump.fun/coin/${TOKEN_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                className="neumorphic-button px-10 py-5 rounded-full font-inter font-semibold text-lg text-gray-900 dark:text-[var(--text-primary)] hover:text-white hover:bg-[#0d9488] shadow-xl flex items-center gap-3 transition-colors"
              >
                <span>Comprar agora</span>
                <FontAwesomeIcon icon={faRocket} className="w-5 h-5" />
              </a>

              {/* Secondary CTA */}
              <button
                onClick={() => document.getElementById('saiba-mais')?.scrollIntoView({ behavior: 'smooth' })}
                className="neumorphic-button px-10 py-5 rounded-full font-inter font-semibold text-lg shadow-xl text-gray-900 dark:text-[var(--text-primary)] hover:text-white hover:bg-[#3b82f6] transition-colors"
              >
                Saiba mais
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-16 flex flex-wrap justify-center gap-8 text-sm font-inter text-gray-700 dark:text-[var(--text-secondary)]">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-5 h-5 text-green-500" />
                <span>100% Transparente</span>
              </div>
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-5 h-5 text-green-500" />
                <span>Código Aberto</span>
              </div>
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faCheckCircle} className="w-5 h-5 text-green-500" />
                <span>Comunidade Ativa</span>
              </div>
            </div>
          </section>

          {/* Por que $MILAGRE? Section */}
          <section id="saiba-mais" className="relative py-12">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-montserrat font-bold mb-4 text-gray-900 dark:text-[var(--text-primary)]">
                Por que $MILAGRE?
              </h2>
              <p className="text-lg md:text-xl font-inter max-w-3xl mx-auto text-gray-700 dark:text-[var(--text-secondary)]">
                Três pilares que sustentam nossa filosofia de crescimento sustentável
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: faLeaf,
                  title: 'Crescimento Orgânico',
                  description: 'Sem hype artificial. Construímos valor real através de educação, utilidade e engajamento genuíno da comunidade.',
                  color: '#4caf50'
                },
                {
                  icon: faUsers,
                  title: 'Comunidade Alinhada',
                  description: 'Holders que acreditam na visão de longo prazo. Uma comunidade de aprendizes e investidores conscientes.',
                  color: '#0d9488'
                },
                {
                  icon: faShieldAlt,
                  title: 'Transparência Radical',
                  description: 'Código aberto, decisões públicas, métricas verificáveis. Confiança construída através da clareza total.',
                  color: '#3b82f6'
                }
              ].map((pillar, index) => (
                <div key={index} className="neumorphic-card p-8 hover:scale-105 transition-transform duration-300">
                  {/* Icon */}
                  <div
                    className="inline-flex w-16 h-16 rounded-2xl items-center justify-center mb-6 shadow-md neumorphic-button"
                    style={{ backgroundColor: pillar.color }}
                  >
                    <FontAwesomeIcon icon={pillar.icon} className="w-8 h-8 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-montserrat font-bold mb-4 text-gray-900 dark:text-[var(--text-primary)]">
                    {pillar.title}
                  </h3>

                  {/* Description */}
                  <p className="font-inter leading-relaxed text-gray-700 dark:text-[var(--text-secondary)]">
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Tokenomics Section */}
          <section className="relative py-12">
            <div className="glass-panel p-8 md:p-12 rounded-3xl">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-montserrat font-bold mb-4 text-gray-900 dark:text-[var(--text-primary)]">
                  Tokenomics Simples
                </h2>
                <p className="text-lg md:text-xl font-inter text-gray-700 dark:text-[var(--text-secondary)]">
                  Sem complicações. Distribuição justa e transparente.
                </p>
              </div>

              <div className="text-center mb-16">
                <p className="text-sm font-inter font-semibold uppercase tracking-widest mb-4 text-gray-700 dark:text-[var(--text-secondary)]">
                  Supply Total
                </p>
                <p className="text-7xl md:text-8xl font-montserrat font-bold mb-4 gradient-text">
                  1B
                </p>
                <p className="text-lg font-inter text-gray-700 dark:text-[var(--text-secondary)]">
                  Um bilhão de tokens. Imutável.
                </p>
              </div>

              <div className="mb-16">
                <div className="neumorphic-card p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex-1">
                    <p className="text-xl font-montserrat font-bold mb-2 text-gray-900 dark:text-[var(--text-primary)]">
                      Liquidez Inicial
                    </p>
                    <p className="font-inter text-gray-700 dark:text-[var(--text-secondary)]">
                      100% disponível na bonding curve
                    </p>
                  </div>
                  <p className="text-5xl font-montserrat font-bold text-green-500">
                    100%
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                {[
                  { label: 'Blockchain', value: 'Solana', color: '#0d9488' },
                  { label: 'Padrão', value: 'SPL Token', color: '#3b82f6' },
                  { label: 'Velocidade', value: '< 1 segundo', color: '#4caf50' }
                ].map((stat, index) => (
                  <div key={index}>
                    <p className="text-sm font-inter font-semibold uppercase tracking-wide mb-3 text-gray-700 dark:text-[var(--text-secondary)]">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-montserrat font-bold" style={{ color: stat.color }}>
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* A Jornada à Frente - Roadmap */}
          <section className="relative py-12">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-montserrat font-bold mb-4 text-gray-900 dark:text-[var(--text-primary)]">
                A Jornada à Frente
              </h2>
              <p className="text-lg md:text-xl font-inter max-w-3xl mx-auto text-gray-700 dark:text-[var(--text-secondary)]">
                Não estamos construindo um token. Estamos construindo um movimento de educação financeira.
              </p>
            </div>

            <div className="space-y-8">
              {[
                {
                  phase: 'Fase 1',
                  title: 'Fundação',
                  description: 'Lançamento do token, formação da comunidade inicial e desenvolvimento da plataforma educacional.',
                  icon: faSeedling,
                  status: 'current',
                  color: '#4caf50'
                },
                {
                  phase: 'Fase 2',
                  title: 'Expansão Sustentável',
                  description: 'Graduação na Raydium, parcerias com educadores, lançamento do programa Learn-to-Earn.',
                  icon: faChartLine,
                  status: 'upcoming',
                  color: '#ffb703'
                },
                {
                  phase: 'Fase 3',
                  title: 'Ecossistema Global',
                  description: 'Governança descentralizada, produtos DeFi educativos e expansão global da comunidade.',
                  icon: faGlobe,
                  status: 'future',
                  color: '#3b82f6'
                }
              ].map((phase, index) => (
                <div key={index} className="timeline-item flex gap-6">
                  {/* Icon */}
                  <div
                    className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg z-10 neumorphic-button"
                    style={{ backgroundColor: phase.color }}
                  >
                    <FontAwesomeIcon icon={phase.icon} className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 neumorphic-card p-8">
                    <div className="flex items-start justify-between mb-4">
                      <p className="text-sm font-inter font-semibold uppercase tracking-wide" style={{ color: phase.color }}>
                        {phase.phase}
                      </p>
                      {phase.status === 'current' && (
                        <span className="px-3 py-1 rounded-full text-xs font-inter font-semibold border" style={{
                          backgroundColor: 'rgba(76, 175, 80, 0.15)',
                          color: '#4caf50',
                          borderColor: '#4caf50'
                        }}>
                          Em Andamento
                        </span>
                      )}
                    </div>
                    <h3 className="text-2xl font-montserrat font-bold mb-3 text-gray-900 dark:text-[var(--text-primary)]">
                      {phase.title}
                    </h3>
                    <p className="font-inter leading-relaxed text-gray-700 dark:text-[var(--text-secondary)]">
                      {phase.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Como Comprar Milagre - NEW SECTION */}
          <section className="relative py-12">
            <div className="glass-panel p-8 md:p-12 rounded-3xl">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-montserrat font-bold mb-4 text-gray-900 dark:text-[var(--text-primary)]">
                  Como Comprar Milagre
                </h2>
                <p className="text-lg md:text-xl font-inter max-w-3xl mx-auto text-gray-700 dark:text-[var(--text-secondary)]">
                  Guia passo a passo para adquirir seus tokens
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    step: '01',
                    title: 'Crie sua Carteira',
                    desc: 'Baixe e instale a Phantom Wallet ou Solflare no seu navegador ou celular.',
                    icon: faWallet,
                    color: '#ab9ff2' // Phantom color-ish but not purple
                  },
                  {
                    step: '02',
                    title: 'Adquira Solana (SOL)',
                    desc: 'Compre SOL em uma exchange (Binance, Coinbase) e envie para sua carteira.',
                    icon: faCoins,
                    color: '#00FFA3' // Solana Green
                  },
                  {
                    step: '03',
                    title: 'Troque por $MILAGRE',
                    desc: 'Acesse o Pump.fun ou Raydium, cole o contrato e troque seus SOL por $MILAGRE.',
                    icon: faExchangeAlt,
                    color: '#3b82f6'
                  }
                ].map((item, index) => (
                  <div key={index} className="neumorphic-card p-8 relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 text-9xl font-bold opacity-5 select-none font-montserrat">
                      {item.step}
                    </div>
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 neumorphic-button text-2xl" style={{ color: item.color }}>
                      <FontAwesomeIcon icon={item.icon} />
                    </div>
                    <h3 className="text-xl font-montserrat font-bold mb-3 text-gray-900 dark:text-[var(--text-primary)]">
                      {item.title}
                    </h3>
                    <p className="font-inter text-sm text-gray-700 dark:text-[var(--text-secondary)]">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-12 text-center">
                <a
                  href={`https://pump.fun/coin/${TOKEN_ADDRESS}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="neumorphic-button inline-flex items-center gap-3 px-10 py-5 rounded-full font-inter font-bold text-gray-900 dark:text-[var(--text-primary)] hover:text-white hover:bg-[#0d9488] shadow-xl text-lg transition-colors"
                >
                  <span>Comprar no Pump.fun</span>
                  <FontAwesomeIcon icon={faRocket} className="w-5 h-5" />
                </a>
              </div>
            </div>
          </section>

          {/* Faça Parte da Jornada - Final CTA - NO BACKGROUND */}
          <section className="relative py-24 mt-12">
            <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">

              <h2 className="text-4xl md:text-6xl font-montserrat font-bold mb-8 text-gray-900 dark:text-[var(--text-primary)]">
                Faça Parte da Jornada
              </h2>

              <p className="text-xl md:text-2xl mb-16 max-w-3xl mx-auto font-inter text-gray-700 dark:text-[var(--text-secondary)]">
                Junte-se a uma comunidade que valoriza educação, transparência e crescimento de longo prazo.
              </p>

              {/* Community Links */}
              <div className="flex flex-wrap items-center justify-center gap-6 mb-20">
                <a
                  href="https://discord.gg/xk4zrz8j"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="neumorphic-button flex items-center gap-3 px-10 py-5 rounded-full font-inter font-semibold text-lg shadow-xl text-gray-900 dark:text-[var(--text-primary)] hover:text-white hover:bg-[#5865F2] transition-colors"
                >
                  <FontAwesomeIcon icon={faDiscord} className="w-6 h-6" />
                  <span>Entrar no Discord</span>
                </a>

                <a
                  href="https://t.me/+Bop_TVFc_mg3Njlh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="neumorphic-button flex items-center gap-3 px-10 py-5 rounded-full font-inter font-semibold text-lg shadow-xl text-gray-900 dark:text-[var(--text-primary)] hover:text-white hover:bg-[#0088cc] transition-colors"
                >
                  <FontAwesomeIcon icon={faTelegram} className="w-6 h-6" />
                  <span>Entrar no Telegram</span>
                </a>
              </div>

              {/* Contract Address Card */}
              <div className="max-w-2xl mx-auto neumorphic-card p-10">
                <p className="text-sm font-inter font-semibold uppercase tracking-widest mb-4 text-gray-700 dark:text-[var(--text-secondary)]">
                  Endereço do Contrato
                </p>
                <code className="block font-mono text-sm md:text-base mb-6 break-all px-6 py-4 rounded-xl bg-gray-100 dark:bg-black/30 text-gray-900 dark:text-[var(--text-primary)] border border-gray-200 dark:border-white/20">
                  {TOKEN_ADDRESS}
                </code>
                <button
                  onClick={copyToClipboard}
                  className="neumorphic-button inline-flex items-center gap-2 px-8 py-3 rounded-full font-inter font-semibold shadow-lg text-gray-900 dark:text-[var(--text-primary)] hover:text-white hover:bg-[#ffb703] transition-colors"
                >
                  <FontAwesomeIcon icon={faCheckCircle} className="w-5 h-5" />
                  <span>Copiar Endereço</span>
                </button>
              </div>

              {/* Disclaimer */}
              <p className="text-sm mt-16 max-w-2xl mx-auto leading-relaxed font-inter text-gray-500 dark:text-[var(--text-tertiary)]">
                Criptomoedas envolvem riscos. Este não é um conselho financeiro. Faça sua própria pesquisa (DYOR) e invista apenas o que você pode perder. $MILAGRE é um projeto educacional.
              </p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
