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
  faArrowRight,
  faSeedling,
  faHandshake,
  faGlobe
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

        :root {
          /* Cores principais - não mudam */
          --color-petrol: #003f5c;
          --color-purple: #6a0572;
          --color-green: #4caf50;
          --color-gold: #ffb703;
          --color-orange: #fb8500;

          /* Cores adaptativas - modo claro */
          --color-bg-primary: #f9f9f9;
          --color-bg-secondary: #ffffff;
          --color-bg-elevated: #ffffff;
          --color-text-primary: #1a1a1a;
          --color-text-secondary: #4a5568;
          --color-border: #e5e7eb;
          --color-border-hover: #d1d5db;

          /* Gradientes de fundo */
          --bg-gradient-hero: linear-gradient(135deg, #f9f9f9 0%, #ffffff 100%);
          --bg-gradient-cta: linear-gradient(135deg, #003f5c 0%, #6a0572 100%);

          /* Sombras */
          --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
          --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }

        /* Modo escuro */
        @media (prefers-color-scheme: dark) {
          :root {
            --color-bg-primary: #121212;
            --color-bg-secondary: #1a1a1a;
            --color-bg-elevated: #242424;
            --color-text-primary: #f5f5f5;
            --color-text-secondary: #b0b0b0;
            --color-border: #333333;
            --color-border-hover: #444444;

            /* Gradientes ajustados para dark */
            --bg-gradient-hero: linear-gradient(135deg, #121212 0%, #1a1a1a 100%);
            --bg-gradient-cta: linear-gradient(135deg, #004d73 0%, #7d0a86 100%);

            /* Sombras mais sutis no dark */
            --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
            --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4);
            --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
            --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.6);
          }
        }

        .font-montserrat {
          font-family: 'Montserrat', sans-serif;
        }

        .font-inter {
          font-family: 'Inter', sans-serif;
        }

        .btn-hover-effect {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .btn-hover-effect:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
        }

        .card-hover {
          transition: all 0.4s ease;
        }

        .card-hover:hover {
          transform: translateY(-8px);
          box-shadow: var(--shadow-xl);
        }

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
      `}</style>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ backgroundColor: 'var(--color-bg-primary)' }}>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden opacity-10 dark:opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl" style={{ backgroundColor: 'var(--color-purple)' }}></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: 'var(--color-petrol)' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-3xl" style={{ backgroundColor: 'var(--color-green)' }}></div>
        </div>

        <div className={`relative z-10 max-w-6xl mx-auto px-6 py-20 text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

          {/* Animated Logo */}
          <div className="flex justify-center mb-12">
            <div className="relative w-40 h-40 md:w-48 md:h-48">
              {/* Animated rings */}
              <div className="absolute inset-0 animate-spin-slow">
                <div className="absolute inset-0 rounded-full border-2 border-dashed opacity-30 dark:opacity-40" style={{ borderColor: 'var(--color-gold)' }}></div>
              </div>
              <div className="absolute inset-3 animate-spin-reverse">
                <div className="absolute inset-0 rounded-full border-2 border-dashed opacity-30 dark:opacity-40" style={{ borderColor: 'var(--color-purple)' }}></div>
              </div>

              {/* Glow effect */}
              <div className="absolute inset-0 blur-2xl animate-pulse opacity-40 dark:opacity-30" style={{ background: `linear-gradient(135deg, var(--color-gold), var(--color-purple))` }}></div>

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
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-montserrat font-bold mb-6" style={{ color: 'var(--color-text-primary)' }}>
            Construa seu futuro financeiro com{' '}
            <span style={{
              background: `linear-gradient(135deg, var(--color-petrol), var(--color-purple))`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              $MILAGRE
            </span>
          </h1>

          <p className="text-lg md:text-xl font-inter mb-12 max-w-3xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
            Token de educação financeira descentralizada. Transparente, sustentável e projetado para crescimento de longo prazo.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Primary CTA */}
            <a
              href={`https://pump.fun/coin/${TOKEN_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-hover-effect px-10 py-5 rounded-full font-inter font-semibold text-lg text-white shadow-lg flex items-center gap-3"
              style={{ background: `linear-gradient(135deg, var(--color-orange), var(--color-gold))` }}
            >
              <span>Comprar agora</span>
              <FontAwesomeIcon icon={faRocket} className="w-5 h-5" />
            </a>

            {/* Secondary CTA */}
            <button
              onClick={() => document.getElementById('saiba-mais')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-hover-effect px-10 py-5 rounded-full font-inter font-semibold text-lg shadow-lg border-2"
              style={{
                borderColor: 'var(--color-petrol)',
                color: 'var(--color-petrol)',
                backgroundColor: 'transparent'
              }}
            >
              Saiba mais
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 flex flex-wrap justify-center gap-8 text-sm font-inter" style={{ color: 'var(--color-text-secondary)' }}>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faCheckCircle} className="w-5 h-5" style={{ color: 'var(--color-green)' }} />
              <span>100% Transparente</span>
            </div>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faCheckCircle} className="w-5 h-5" style={{ color: 'var(--color-green)' }} />
              <span>Código Aberto</span>
            </div>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faCheckCircle} className="w-5 h-5" style={{ color: 'var(--color-green)' }} />
              <span>Comunidade Ativa</span>
            </div>
          </div>
        </div>
      </section>

      {/* Por que $MILAGRE? Section */}
      <section id="saiba-mais" className="py-24" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-montserrat font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
              Por que $MILAGRE?
            </h2>
            <p className="text-lg md:text-xl font-inter max-w-3xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
              Três pilares que sustentam nossa filosofia de crescimento sustentável
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: faLeaf,
                title: 'Crescimento Orgânico',
                description: 'Sem hype artificial. Construímos valor real através de educação, utilidade e engajamento genuíno da comunidade.',
                color: 'var(--color-green)',
                bgGradient: 'linear-gradient(135deg, #4caf50, #45a049)'
              },
              {
                icon: faUsers,
                title: 'Comunidade Alinhada',
                description: 'Holders que acreditam na visão de longo prazo. Uma comunidade de aprendizes e investidores conscientes.',
                color: 'var(--color-purple)',
                bgGradient: 'linear-gradient(135deg, #6a0572, #8b1a9e)'
              },
              {
                icon: faShieldAlt,
                title: 'Transparência Radical',
                description: 'Código aberto, decisões públicas, métricas verificáveis. Confiança construída através da clareza total.',
                color: 'var(--color-petrol)',
                bgGradient: 'linear-gradient(135deg, #003f5c, #005a82)'
              }
            ].map((pillar, index) => (
              <div key={index} className="card-hover rounded-3xl p-8 border" style={{
                backgroundColor: 'var(--color-bg-elevated)',
                borderColor: 'var(--color-border)',
                boxShadow: 'var(--shadow-lg)'
              }}>

                {/* Icon */}
                <div
                  className="inline-flex w-16 h-16 rounded-2xl items-center justify-center mb-6 shadow-md"
                  style={{ background: pillar.bgGradient }}
                >
                  <FontAwesomeIcon icon={pillar.icon} className="w-8 h-8 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-montserrat font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
                  {pillar.title}
                </h3>

                {/* Description */}
                <p className="font-inter leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tokenomics Section */}
      <section className="py-24" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
        <div className="max-w-5xl mx-auto px-6">

          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-montserrat font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
              Tokenomics Simples
            </h2>
            <p className="text-lg md:text-xl font-inter" style={{ color: 'var(--color-text-secondary)' }}>
              Sem complicações. Distribuição justa e transparente.
            </p>
          </div>

          <div className="rounded-3xl p-12 md:p-16 border" style={{
            backgroundColor: 'var(--color-bg-elevated)',
            borderColor: 'var(--color-border)',
            boxShadow: 'var(--shadow-xl)'
          }}>

            {/* Supply */}
            <div className="text-center mb-16">
              <p className="text-sm font-inter font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                Supply Total
              </p>
              <p className="text-7xl md:text-8xl font-montserrat font-bold mb-4" style={{
                background: `linear-gradient(135deg, var(--color-purple), var(--color-petrol))`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                1B
              </p>
              <p className="text-lg font-inter" style={{ color: 'var(--color-text-secondary)' }}>
                Um bilhão de tokens. Imutável.
              </p>
            </div>

            {/* Distribution */}
            <div className="mb-16">
              <div className="flex flex-col md:flex-row items-center justify-between p-8 rounded-2xl shadow-md" style={{
                background: `linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(106, 5, 114, 0.1))`
              }}>
                <div>
                  <p className="text-xl font-montserrat font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                    Liquidez Inicial
                  </p>
                  <p className="font-inter" style={{ color: 'var(--color-text-secondary)' }}>
                    100% disponível na bonding curve
                  </p>
                </div>
                <p className="text-5xl font-montserrat font-bold mt-4 md:mt-0" style={{ color: 'var(--color-green)' }}>
                  100%
                </p>
              </div>
            </div>

            {/* Tech Info */}
            <div className="pt-12 border-t" style={{ borderColor: 'var(--color-border)' }}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                {[
                  { label: 'Blockchain', value: 'Solana', color: 'var(--color-purple)' },
                  { label: 'Padrão', value: 'SPL Token', color: 'var(--color-petrol)' },
                  { label: 'Velocidade', value: '< 1 segundo', color: 'var(--color-green)' }
                ].map((stat, index) => (
                  <div key={index}>
                    <p className="text-sm font-inter font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--color-text-secondary)' }}>
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
        </div>
      </section>

      {/* A Jornada à Frente - Roadmap */}
      <section className="py-24" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
        <div className="max-w-6xl mx-auto px-6">

          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-montserrat font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
              A Jornada à Frente
            </h2>
            <p className="text-lg md:text-xl font-inter max-w-3xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
              Não estamos construindo um token. Estamos construindo um movimento de educação financeira.
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 transform md:-translate-x-1/2" style={{
              background: `linear-gradient(180deg, var(--color-green), var(--color-purple), var(--color-petrol))`
            }}></div>

            <div className="space-y-16">
              {[
                {
                  phase: 'Fase 1',
                  title: 'Fundação',
                  description: 'Lançamento do token, formação da comunidade inicial e desenvolvimento da plataforma educacional.',
                  icon: faSeedling,
                  status: 'current',
                  color: 'var(--color-green)',
                  bgGradient: 'linear-gradient(135deg, #4caf50, #45a049)'
                },
                {
                  phase: 'Fase 2',
                  title: 'Expansão Sustentável',
                  description: 'Graduação na Raydium, parcerias com educadores, lançamento do programa Learn-to-Earn.',
                  icon: faChartLine,
                  status: 'upcoming',
                  color: 'var(--color-purple)',
                  bgGradient: 'linear-gradient(135deg, #6a0572, #8b1a9e)'
                },
                {
                  phase: 'Fase 3',
                  title: 'Ecossistema Global',
                  description: 'Governança descentralizada, produtos DeFi educativos e expansão global da comunidade.',
                  icon: faGlobe,
                  status: 'future',
                  color: 'var(--color-petrol)',
                  bgGradient: 'linear-gradient(135deg, #003f5c, #005a82)'
                }
              ].map((phase, index) => (
                <div key={index} className="relative pl-24 md:pl-0">

                  {/* Icon */}
                  <div
                    className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl z-10"
                    style={{ background: phase.bgGradient }}
                  >
                    <FontAwesomeIcon icon={phase.icon} className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:ml-auto md:pl-12' : 'md:pr-12'}`}>
                    <div className="rounded-2xl p-8 border card-hover" style={{
                      backgroundColor: 'var(--color-bg-elevated)',
                      borderColor: 'var(--color-border)',
                      boxShadow: 'var(--shadow-lg)'
                    }}>
                      <div className="flex items-start justify-between mb-4">
                        <p className="text-sm font-inter font-semibold uppercase tracking-wide" style={{ color: phase.color }}>
                          {phase.phase}
                        </p>
                        {phase.status === 'current' && (
                          <span className="px-3 py-1 rounded-full text-xs font-inter font-semibold" style={{
                            backgroundColor: 'rgba(76, 175, 80, 0.15)',
                            color: 'var(--color-green)',
                            border: '1px solid var(--color-green)'
                          }}>
                            Em Andamento
                          </span>
                        )}
                      </div>
                      <h3 className="text-2xl font-montserrat font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>
                        {phase.title}
                      </h3>
                      <p className="font-inter leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                        {phase.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Faça Parte da Jornada - Final CTA */}
      <section className="py-32 relative overflow-hidden" style={{
        background: 'var(--bg-gradient-cta)'
      }}>

        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 rounded-full blur-3xl" style={{ backgroundColor: 'var(--color-gold)' }}></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 rounded-full blur-3xl" style={{ backgroundColor: 'var(--color-orange)' }}></div>
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
              className="btn-hover-effect flex items-center gap-3 px-10 py-5 bg-white rounded-full font-inter font-semibold text-lg shadow-xl"
              style={{ color: 'var(--color-purple)' }}
            >
              <FontAwesomeIcon icon={faDiscord} className="w-6 h-6" />
              <span>Entrar no Discord</span>
            </a>

            <a
              href="https://t.me/+Bop_TVFc_mg3Njlh"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-hover-effect flex items-center gap-3 px-10 py-5 rounded-full font-inter font-semibold text-lg shadow-xl text-white border-2 border-white"
              style={{ backgroundColor: 'transparent' }}
            >
              <FontAwesomeIcon icon={faTelegram} className="w-6 h-6" />
              <span>Entrar no Telegram</span>
            </a>
          </div>

          {/* Contract Address Card */}
          <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-10 shadow-2xl">
            <p className="text-white/70 text-sm font-inter font-semibold uppercase tracking-widest mb-4">
              Endereço do Contrato
            </p>
            <code className="block text-white font-mono text-sm md:text-base mb-6 break-all px-6 py-4 bg-black/20 rounded-xl">
              {TOKEN_ADDRESS}
            </code>
            <button
              onClick={copyToClipboard}
              className="btn-hover-effect inline-flex items-center gap-2 px-8 py-3 rounded-full font-inter font-semibold shadow-lg"
              style={{ background: `linear-gradient(135deg, var(--color-gold), var(--color-orange))`, color: 'white' }}
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
