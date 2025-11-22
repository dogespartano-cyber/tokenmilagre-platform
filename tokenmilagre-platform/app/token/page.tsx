'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Script from 'next/script';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLeaf,
  faLock,
  faUsers,
  faChartLine,
  faCheckCircle,
  faShieldAlt,
  faInfinity
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
          "description": "Um token construído para o longo prazo. Transparência, comunidade e valor sustentável.",
          "url": "https://tokenmilagre.xyz/token"
        })}
      </Script>

      {/* Hero Section - Ultra Sereno */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-teal-50/30 to-blue-50/20 relative overflow-hidden">

        {/* Subtle animated background orbs */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-teal-200 to-transparent rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-blue-200 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className={`relative z-10 max-w-4xl mx-auto px-6 text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

          {/* Animated Logo (from login page) */}
          <div className="flex justify-center mb-16">
            <div className="relative w-48 h-48 md:w-56 md:h-56">
              {/* Animated rings */}
              <div className="absolute inset-0 animate-spin-slow">
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-teal-400/40"></div>
              </div>
              <div className="absolute inset-3 animate-spin-reverse">
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-blue-400/30"></div>
              </div>

              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-teal-300/30 via-blue-300/30 to-amber-300/20 blur-3xl animate-pulse"></div>

              {/* Image */}
              <div className="relative z-10 transform hover:scale-105 transition-all duration-700">
                <Image
                  src="/images/TOKEN-MILAGRE-Hero.webp"
                  alt="$MILAGRE Token"
                  width={224}
                  height={224}
                  className="drop-shadow-2xl rounded-full"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Hero Text */}
          <h1 className="text-6xl md:text-7xl font-light mb-8 text-slate-900 font-[family-name:var(--font-poppins)] tracking-tight">
            $MILAGRE
          </h1>

          <p className="text-2xl md:text-3xl text-slate-700 font-light mb-6 max-w-3xl mx-auto leading-relaxed">
            Construído para quem pensa no amanhã
          </p>

          <p className="text-base md:text-lg text-slate-500 mb-16 max-w-2xl mx-auto leading-relaxed">
            Um token de educação financeira descentralizada. Transparente, sustentável e projetado para crescimento duradouro.
          </p>

          {/* Subtle CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={`https://pump.fun/coin/${TOKEN_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group px-10 py-4 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-500 hover:to-blue-500 text-white rounded-full font-normal text-lg transition-all shadow-lg hover:shadow-xl flex items-center gap-3"
            >
              <span>Explorar Token</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </a>
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
            animation: spin-slow 25s linear infinite;
          }
          .animate-spin-reverse {
            animation: spin-reverse 20s linear infinite;
          }
        `}</style>
      </section>

      {/* 3 Pilares - Proposta de Valor */}
      <section className="py-32 bg-white">
        <div className="max-w-6xl mx-auto px-6">

          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-light text-slate-900 mb-6 font-[family-name:var(--font-poppins)]">
              Por que $MILAGRE?
            </h2>
            <p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Três pilares que sustentam nossa filosofia de crescimento sustentável
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: faLeaf,
                title: 'Crescimento Orgânico',
                description: 'Sem hype artificial. Construímos valor real através de educação, utilidade e engajamento genuíno da comunidade.',
                gradient: 'from-teal-500 to-emerald-500'
              },
              {
                icon: faUsers,
                title: 'Comunidade Alinhada',
                description: 'Holders que acreditam na visão de longo prazo. Uma comunidade de aprendizes e investidores conscientes.',
                gradient: 'from-blue-500 to-indigo-500'
              },
              {
                icon: faShieldAlt,
                title: 'Transparência Radical',
                description: 'Código aberto, decisões públicas, métricas verificáveis. Confiança construída através da clareza total.',
                gradient: 'from-amber-500 to-orange-500'
              }
            ].map((pillar, index) => (
              <div key={index} className="group">
                <div className="bg-slate-50 border border-slate-200 rounded-3xl p-10 hover:shadow-2xl hover:border-teal-300 transition-all duration-500">

                  {/* Icon */}
                  <div className={`inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br ${pillar.gradient} p-4 mb-8 group-hover:scale-110 transition-transform shadow-lg`}>
                    <FontAwesomeIcon icon={pillar.icon} className="w-full h-full text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-normal text-slate-900 mb-4 font-[family-name:var(--font-poppins)]">
                    {pillar.title}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-600 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Por que Segurar? - Seção Exclusiva */}
      <section className="py-32 bg-gradient-to-br from-slate-900 via-teal-900/90 to-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-6">

          <div className="text-center mb-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-teal-500/20 mb-8">
              <FontAwesomeIcon icon={faInfinity} className="w-10 h-10 text-teal-400" />
            </div>
            <h2 className="text-4xl md:text-5xl font-light mb-6 font-[family-name:var(--font-poppins)]">
              Por que segurar a longo prazo?
            </h2>
            <p className="text-slate-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              $MILAGRE não é sobre ganhos rápidos. É sobre construir algo que dure.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: faChartLine,
                title: 'Valor Acumulado',
                description: 'Quanto mais você aprende e participa, mais você ganha. Recompensas por educação financeira contínua.'
              },
              {
                icon: faLock,
                title: 'Escassez Intencional',
                description: 'Supply fixo de 1 bilhão. Sem inflação, sem diluição. Seu token mantém valor ao longo do tempo.'
              },
              {
                icon: faUsers,
                title: 'Governança Futura',
                description: 'Holders de longo prazo terão voz ativa nas decisões do ecossistema através da DAO comunitária.'
              },
              {
                icon: faCheckCircle,
                title: 'Recompensas Exclusivas',
                description: 'Acesso antecipado a novos produtos, conteúdo premium e eventos exclusivos para holders fiéis.'
              }
            ].map((benefit, index) => (
              <div key={index} className="flex gap-6 p-8 bg-white/5 backdrop-blur border border-white/10 rounded-2xl hover:bg-white/10 transition-all">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-xl bg-teal-500/20 flex items-center justify-center">
                    <FontAwesomeIcon icon={benefit.icon} className="w-7 h-7 text-teal-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-normal mb-3 font-[family-name:var(--font-poppins)]">
                    {benefit.title}
                  </h3>
                  <p className="text-slate-300 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tokenomics - Ultra Minimalista */}
      <section className="py-32 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">

          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-light text-slate-900 mb-6 font-[family-name:var(--font-poppins)]">
              Tokenomics Simples
            </h2>
            <p className="text-slate-600 text-lg md:text-xl">
              Sem complicações. Distribuição justa e transparente.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-12 md:p-16 shadow-xl">

            {/* Supply */}
            <div className="text-center mb-16">
              <p className="text-slate-500 text-sm uppercase tracking-widest mb-4">Supply Total</p>
              <p className="text-7xl md:text-8xl font-extralight text-slate-900 mb-4">1B</p>
              <p className="text-slate-600 text-lg">Um bilhão de tokens. Imutável.</p>
            </div>

            {/* Distribution */}
            <div className="mb-16">
              <div className="flex items-center justify-between p-8 bg-gradient-to-r from-teal-50 to-blue-50 rounded-2xl border border-teal-200">
                <div>
                  <p className="text-slate-900 font-medium text-xl mb-2">Liquidez Inicial</p>
                  <p className="text-slate-600">100% disponível na bonding curve</p>
                </div>
                <p className="text-5xl font-light text-teal-600">100%</p>
              </div>
            </div>

            {/* Tech Info */}
            <div className="pt-12 border-t border-slate-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                {[
                  { label: 'Blockchain', value: 'Solana', color: 'text-purple-600' },
                  { label: 'Padrão', value: 'SPL Token', color: 'text-blue-600' },
                  { label: 'Velocidade', value: '< 1 segundo', color: 'text-teal-600' }
                ].map((stat, index) => (
                  <div key={index}>
                    <p className="text-slate-500 text-sm mb-3 uppercase tracking-wide">{stat.label}</p>
                    <p className={`text-2xl font-normal ${stat.color}`}>{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap/Vision - Foco no Futuro */}
      <section className="py-32 bg-white">
        <div className="max-w-5xl mx-auto px-6">

          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-light text-slate-900 mb-6 font-[family-name:var(--font-poppins)]">
              A Jornada à Frente
            </h2>
            <p className="text-slate-600 text-lg md:text-xl max-w-3xl mx-auto">
              Não estamos construindo um token. Estamos construindo um movimento de educação financeira.
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-teal-400 via-blue-400 to-slate-300"></div>

            <div className="space-y-12">
              {[
                {
                  phase: 'Fase 1: Fundação',
                  title: 'Construção da Base',
                  description: 'Lançamento do token, formação da comunidade inicial e desenvolvimento da plataforma educacional.',
                  status: 'current',
                  color: 'teal'
                },
                {
                  phase: 'Fase 2: Crescimento',
                  title: 'Expansão Sustentável',
                  description: 'Graduação na Raydium, parcerias com educadores, lançamento do programa Learn-to-Earn.',
                  status: 'upcoming',
                  color: 'blue'
                },
                {
                  phase: 'Fase 3: Ecossistema',
                  title: 'DAO & Governança',
                  description: 'Governança descentralizada, produtos DeFi educativos e expansão global da comunidade.',
                  status: 'future',
                  color: 'indigo'
                }
              ].map((phase, index) => (
                <div key={index} className="relative pl-24">
                  {/* Dot */}
                  <div className={`absolute left-6 w-5 h-5 rounded-full ${
                    phase.status === 'current' ? 'bg-teal-500 ring-4 ring-teal-100' :
                    phase.status === 'upcoming' ? 'bg-blue-500 ring-4 ring-blue-100' :
                    'bg-slate-300 ring-4 ring-slate-100'
                  }`}></div>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 hover:shadow-xl transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <p className={`text-sm font-medium uppercase tracking-wide ${
                        phase.status === 'current' ? 'text-teal-600' :
                        phase.status === 'upcoming' ? 'text-blue-600' :
                        'text-slate-500'
                      }`}>
                        {phase.phase}
                      </p>
                      {phase.status === 'current' && (
                        <span className="px-3 py-1 bg-teal-100 text-teal-700 text-xs font-medium rounded-full border border-teal-300">
                          Em Andamento
                        </span>
                      )}
                    </div>
                    <h3 className="text-2xl font-normal text-slate-900 mb-3 font-[family-name:var(--font-poppins)]">
                      {phase.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {phase.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA - Comunidade */}
      <section className="py-32 bg-gradient-to-br from-slate-50 to-teal-50/30">
        <div className="max-w-4xl mx-auto px-6 text-center">

          <h2 className="text-4xl md:text-5xl font-light text-slate-900 mb-8 font-[family-name:var(--font-poppins)]">
            Faça Parte da Jornada
          </h2>

          <p className="text-xl md:text-2xl text-slate-700 mb-16 max-w-3xl mx-auto leading-relaxed">
            Junte-se a uma comunidade que valoriza educação, transparência e crescimento de longo prazo.
          </p>

          {/* Community Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-20">
            <a
              href="https://discord.gg/xk4zrz8j"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-10 py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-normal text-lg transition-all shadow-lg hover:shadow-xl"
            >
              <FontAwesomeIcon icon={faDiscord} className="w-6 h-6" />
              <span>Entrar no Discord</span>
            </a>

            <a
              href="https://t.me/+Bop_TVFc_mg3Njlh"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-normal text-lg transition-all shadow-lg hover:shadow-xl"
            >
              <FontAwesomeIcon icon={faTelegram} className="w-6 h-6" />
              <span>Entrar no Telegram</span>
            </a>
          </div>

          {/* Contract Address Card */}
          <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-3xl p-10 shadow-xl">
            <p className="text-slate-500 text-sm mb-4 uppercase tracking-widest">Endereço do Contrato</p>
            <code className="block text-slate-900 font-mono text-sm md:text-base mb-6 break-all px-6 py-4 bg-slate-50 rounded-xl">
              {TOKEN_ADDRESS}
            </code>
            <button
              onClick={copyToClipboard}
              className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium transition-colors"
            >
              <FontAwesomeIcon icon={faCheckCircle} className="w-5 h-5" />
              <span>Copiar Endereço</span>
            </button>
          </div>

          {/* Disclaimer */}
          <p className="text-slate-500 text-sm mt-16 max-w-2xl mx-auto leading-relaxed">
            Criptomoedas envolvem riscos. Este não é um conselho financeiro. Faça sua própria pesquisa (DYOR) e invista apenas o que você pode perder. $MILAGRE é um projeto educacional.
          </p>
        </div>
      </section>
    </>
  );
}
