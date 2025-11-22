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
  faTrophy
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

        /* Glassmorphism Card */
        .glass-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.1);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .glass-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 12px 40px 0 rgba(0, 0, 0, 0.15);
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.3);
        }

        [data-theme="dark"] .glass-card {
          background: rgba(18, 18, 18, 0.4);
          border-color: rgba(255, 255, 255, 0.1);
        }

        [data-theme="dark"] .glass-card:hover {
          background: rgba(18, 18, 18, 0.6);
          border-color: rgba(255, 255, 255, 0.2);
        }

        /* Button Hover Effect */
        .btn-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .btn-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
          filter: brightness(1.1);
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
          background: linear-gradient(135deg, #4caf50, #ffb703, #fb8500);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Roadmap Timeline */
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
          background: linear-gradient(180deg, #4caf50, #ffb703, #fb8500);
        }

        .timeline-item:last-child::before {
          display: none;
        }
      `}</style>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center" style={{ backgroundColor: 'transparent' }}>
        <div className={`max-w-6xl mx-auto px-6 py-20 text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

          {/* Animated Logo */}
          <div className="flex justify-center mb-12">
            <div className="relative w-40 h-40 md:w-48 md:h-48">
              {/* Animated rings */}
              <div className="absolute inset-0 animate-spin-slow">
                <div className="absolute inset-0 rounded-full border-2 border-dashed opacity-40" style={{ borderColor: '#ffb703' }}></div>
              </div>
              <div className="absolute inset-3 animate-spin-reverse">
                <div className="absolute inset-0 rounded-full border-2 border-dashed opacity-40" style={{ borderColor: '#6a0572' }}></div>
              </div>

              {/* Glow effect */}
              <div className="absolute inset-0 blur-2xl animate-pulse opacity-30" style={{
                background: 'linear-gradient(135deg, #4caf50, #ffb703, #fb8500)'
              }}></div>

              {/* Image */}
              <div className="relative z-10 transform hover:scale-105 transition-all duration-700">
                <Image
                  src="/images/TOKEN-MILAGRE-Hero.webp"
                  alt="$MILAGRE Token"
                  width={192}
                  height={192}
                  className="drop-shadow-2xl rounded-full"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Hero Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-montserrat font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
            Construa seu futuro financeiro com{' '}
            <span className="gradient-text">
              $MILAGRE
            </span>
          </h1>

          <p className="text-lg md:text-xl font-inter mb-12 max-w-3xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Token de educação financeira descentralizada. Transparente, sustentável e projetado para crescimento de longo prazo.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Primary CTA */}
            <a
              href={`https://pump.fun/coin/${TOKEN_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-hover px-10 py-5 rounded-full font-inter font-semibold text-lg text-white shadow-lg flex items-center gap-3"
              style={{
                background: 'linear-gradient(135deg, #fb8500, #ffb703)'
              }}
            >
              <span>Comprar agora</span>
              <FontAwesomeIcon icon={faRocket} className="w-5 h-5" />
            </a>

            {/* Secondary CTA */}
            <button
              onClick={() => document.getElementById('saiba-mais')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-hover px-10 py-5 rounded-full font-inter font-semibold text-lg shadow-lg border-2"
              style={{
                borderColor: '#4caf50',
                color: '#4caf50',
                backgroundColor: 'transparent'
              }}
            >
              Saiba mais
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 flex flex-wrap justify-center gap-8 text-sm font-inter" style={{ color: 'var(--text-secondary)' }}>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faCheckCircle} className="w-5 h-5" style={{ color: '#4caf50' }} />
              <span>100% Transparente</span>
            </div>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faCheckCircle} className="w-5 h-5" style={{ color: '#4caf50' }} />
              <span>Código Aberto</span>
            </div>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faCheckCircle} className="w-5 h-5" style={{ color: '#4caf50' }} />
              <span>Comunidade Ativa</span>
            </div>
          </div>
        </div>
      </section>

      {/* Por que $MILAGRE? Section */}
      <section id="saiba-mais" className="relative py-24" style={{ backgroundColor: 'transparent' }}>
        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-montserrat font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              Por que $MILAGRE?
            </h2>
            <p className="text-lg md:text-xl font-inter max-w-3xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
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
                color: '#6a0572'
              },
              {
                icon: faShieldAlt,
                title: 'Transparência Radical',
                description: 'Código aberto, decisões públicas, métricas verificáveis. Confiança construída através da clareza total.',
                color: '#003f5c'
              }
            ].map((pillar, index) => (
              <div key={index} className="glass-card rounded-3xl p-8">

                {/* Icon */}
                <div
                  className="inline-flex w-16 h-16 rounded-2xl items-center justify-center mb-6 shadow-md"
                  style={{ backgroundColor: pillar.color }}
                >
                  <FontAwesomeIcon icon={pillar.icon} className="w-8 h-8 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-montserrat font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                  {pillar.title}
                </h3>

                {/* Description */}
                <p className="font-inter leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tokenomics Section */}
      <section className="relative py-24" style={{ backgroundColor: 'transparent' }}>
        <div className="max-w-5xl mx-auto px-6">

          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-montserrat font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              Tokenomics Simples
            </h2>
            <p className="text-lg md:text-xl font-inter" style={{ color: 'var(--text-secondary)' }}>
              Sem complicações. Distribuição justa e transparente.
            </p>
          </div>

          <div className="glass-card rounded-3xl p-12 md:p-16">

            {/* Supply */}
            <div className="text-center mb-16">
              <p className="text-sm font-inter font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--text-secondary)' }}>
                Supply Total
              </p>
              <p className="text-7xl md:text-8xl font-montserrat font-bold mb-4 gradient-text">
                1B
              </p>
              <p className="text-lg font-inter" style={{ color: 'var(--text-secondary)' }}>
                Um bilhão de tokens. Imutável.
              </p>
            </div>

            {/* Distribution */}
            <div className="mb-16">
              <div className="glass-card rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1">
                  <p className="text-xl font-montserrat font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                    Liquidez Inicial
                  </p>
                  <p className="font-inter" style={{ color: 'var(--text-secondary)' }}>
                    100% disponível na bonding curve
                  </p>
                </div>
                <p className="text-5xl font-montserrat font-bold" style={{ color: '#4caf50' }}>
                  100%
                </p>
              </div>
            </div>

            {/* Tech Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              {[
                { label: 'Blockchain', value: 'Solana', color: '#6a0572' },
                { label: 'Padrão', value: 'SPL Token', color: '#003f5c' },
                { label: 'Velocidade', value: '< 1 segundo', color: '#4caf50' }
              ].map((stat, index) => (
                <div key={index}>
                  <p className="text-sm font-inter font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--text-secondary)' }}>
                    {stat.label}
                  </p>
                  <p className="text-2xl font-montserrat font-bold" style={{ color: stat.color }}>
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* A Jornada à Frente - Roadmap */}
      <section className="relative py-24" style={{ backgroundColor: 'transparent' }}>
        <div className="max-w-6xl mx-auto px-6">

          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-montserrat font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              A Jornada à Frente
            </h2>
            <p className="text-lg md:text-xl font-inter max-w-3xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
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
                color: '#6a0572'
              }
            ].map((phase, index) => (
              <div key={index} className="timeline-item flex gap-6">
                {/* Icon */}
                <div
                  className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg z-10"
                  style={{ backgroundColor: phase.color }}
                >
                  <FontAwesomeIcon icon={phase.icon} className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <div className="flex-1 glass-card rounded-2xl p-8">
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
                  <h3 className="text-2xl font-montserrat font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                    {phase.title}
                  </h3>
                  <p className="font-inter leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {phase.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Faça Parte da Jornada - Final CTA */}
      <section className="relative py-32 overflow-hidden" style={{
        background: 'linear-gradient(135deg, #003f5c, #6a0572, #fb8500)'
      }}>

        {/* Decorative Glow */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 right-10 w-80 h-80 rounded-full blur-3xl animate-pulse" style={{ backgroundColor: '#ffb703' }}></div>
          <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full blur-3xl animate-pulse" style={{
            backgroundColor: '#4caf50',
            animationDelay: '1s'
          }}></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">

          <h2 className="text-4xl md:text-6xl font-montserrat font-bold text-white mb-8">
            Faça Parte da Jornada
          </h2>

          <p className="text-xl md:text-2xl text-white/90 mb-16 max-w-3xl mx-auto font-inter">
            Junte-se a uma comunidade que valoriza educação, transparência e crescimento de longo prazo.
          </p>

          {/* Community Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-20">
            <a
              href="https://discord.gg/xk4zrz8j"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-hover flex items-center gap-3 px-10 py-5 bg-white rounded-full font-inter font-semibold text-lg shadow-xl"
              style={{ color: '#6a0572' }}
            >
              <FontAwesomeIcon icon={faDiscord} className="w-6 h-6" />
              <span>Entrar no Discord</span>
            </a>

            <a
              href="https://t.me/+Bop_TVFc_mg3Njlh"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-hover flex items-center gap-3 px-10 py-5 rounded-full font-inter font-semibold text-lg shadow-xl text-white border-2 border-white bg-transparent"
            >
              <FontAwesomeIcon icon={faTelegram} className="w-6 h-6" />
              <span>Entrar no Telegram</span>
            </a>
          </div>

          {/* Contract Address Card */}
          <div className="max-w-2xl mx-auto glass-card rounded-3xl p-10">
            <p className="text-white/70 text-sm font-inter font-semibold uppercase tracking-widest mb-4">
              Endereço do Contrato
            </p>
            <code className="block text-white font-mono text-sm md:text-base mb-6 break-all px-6 py-4 rounded-xl" style={{
              backgroundColor: 'rgba(0, 0, 0, 0.3)'
            }}>
              {TOKEN_ADDRESS}
            </code>
            <button
              onClick={copyToClipboard}
              className="btn-hover inline-flex items-center gap-2 px-8 py-3 rounded-full font-inter font-semibold shadow-lg text-white"
              style={{
                background: 'linear-gradient(135deg, #ffb703, #fb8500)'
              }}
            >
              <FontAwesomeIcon icon={faCheckCircle} className="w-5 h-5" />
              <span>Copiar Endereço</span>
            </button>
          </div>

          {/* Disclaimer */}
          <p className="text-white/60 text-sm mt-16 max-w-2xl mx-auto leading-relaxed font-inter">
            Criptomoedas envolvem riscos. Este não é um conselho financeiro. Faça sua própria pesquisa (DYOR) e invista apenas o que você pode perder. $MILAGRE é um projeto educacional.
          </p>
        </div>
      </section>
    </>
  );
}
