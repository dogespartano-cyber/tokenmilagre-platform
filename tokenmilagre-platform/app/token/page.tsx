'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Script from 'next/script';
import { HolderCounter } from '@/components/HolderCounter';

export default function SobrePage() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeGuardian, setActiveGuardian] = useState(0);

  const TOKEN_ADDRESS = '3tpz3ar7gaHmPZfhWHzRdPnBJ5MrZZVDxepDtDLYpump';

  const guardians = [
    {
      name: 'Prosperidade',
      icon: '💰',
      color: 'from-yellow-400 to-amber-500',
      description: 'Crescimento financeiro e oportunidades de investimento',
      benefits: ['Análises de mercado', 'Estratégias de trading', 'Comunidade de investidores']
    },
    {
      name: 'Sabedoria',
      icon: '🧠',
      color: 'from-cyan-400 to-blue-500',
      description: 'Educação contínua e desenvolvimento pessoal',
      benefits: ['Mentorias exclusivas', 'Cursos e workshops', 'Networking profissional']
    },
    {
      name: 'Esperança',
      icon: '❤️',
      color: 'from-pink-400 to-purple-500',
      description: 'Apoio emocional e suporte da comunidade',
      benefits: ['Grupo de apoio', 'Eventos comunitários', 'Conexões verdadeiras']
    }
  ];

  const tiers = [
    {
      name: 'Apoiador',
      amount: '1.000+',
      icon: '🌟',
      color: 'from-blue-400 to-cyan-500',
      benefits: ['Acesso ao grupo exclusivo', 'Newsletter semanal', 'Badge de apoiador']
    },
    {
      name: 'Guardião',
      amount: '10.000+',
      icon: '🛡️',
      color: 'from-purple-400 to-pink-500',
      benefits: ['Todos os benefícios anteriores', 'Acesso a mentorias', 'Eventos VIP', 'Voto em decisões']
    },
    {
      name: 'Anjo Guardião',
      amount: '50.000+',
      icon: '👼',
      color: 'from-amber-400 to-orange-500',
      benefits: ['Todos os benefícios anteriores', 'Mentoria 1-on-1', 'Acesso antecipado', 'Reconhecimento especial']
    }
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(TOKEN_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-rotate guardians
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveGuardian((prev) => (prev + 1) % guardians.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Schema.org JSON-LD */}
      <Script id="organization-schema" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "$MILAGRE Token",
          "url": "https://tokenmilagre.xyz",
          "logo": "https://tokenmilagre.xyz/images/TOKEN-MILAGRE-Hero.webp",
          "description": "Token SPL comunitário de apoio mútuo na blockchain Solana",
          "sameAs": [
            "https://x.com/TokenMilagre",
            "https://t.me/+Bop_TVFc_mg3Njlh"
          ]
        })}
      </Script>

      <div className="min-h-screen">
        {/* Hero Section - Fullscreen */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
          {/* Background gradients */}
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-transparent to-purple-500/10"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(168,85,247,0.1),transparent_50%)]"></div>

          <div className="container mx-auto px-4 py-20 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left - Content */}
              <div className="text-center lg:text-left space-y-8">
                <div className="inline-block px-6 py-2 rounded-full border-2 border-brand-primary/50 backdrop-blur-sm mb-4" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <span className="text-brand-primary font-bold">✨ Token Comunitário SPL</span>
                </div>

                <h1 className="text-6xl lg:text-8xl font-extrabold font-[family-name:var(--font-poppins)] leading-tight" style={{ color: 'var(--text-primary)' }}>
                  Nunca Estarás
                  <span className="block bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                    Sozinho
                  </span>
                </h1>

                <p className="text-xl lg:text-2xl leading-relaxed max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
                  Uma comunidade onde <span className="font-bold text-brand-primary">tecnologia encontra humanidade</span>.
                  Apoio mútuo, crescimento real, conexões verdadeiras.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <a
                    href={`https://pump.fun/coin/${TOKEN_ADDRESS}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group px-10 py-5 rounded-2xl font-bold text-xl transition-all shadow-theme-xl hover:shadow-2xl hover:scale-105 flex items-center justify-center gap-3"
                    style={{
                      background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-hover))',
                      color: 'var(--text-inverse)'
                    }}
                  >
                    <span className="text-2xl">🪙</span>
                    <span>Adquirir $MILAGRE</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </a>

                  <button
                    onClick={() => document.getElementById('guardioes')?.scrollIntoView({ behavior: 'smooth' })}
                    className="px-10 py-5 rounded-2xl font-bold text-xl transition-all border-2 hover:scale-105 backdrop-blur-sm"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      borderColor: 'var(--brand-primary)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    Conhecer Guardiões
                  </button>
                </div>

                {/* Holder Counter */}
                <div className="flex justify-center lg:justify-start">
                  <HolderCounter />
                </div>
              </div>

              {/* Right - Hero Image */}
              <div className="flex justify-center lg:justify-end">
                <div className="relative w-full max-w-lg">
                  {/* Animated rings */}
                  <div className="absolute inset-0 animate-spin-slow">
                    <div className="absolute inset-0 rounded-full border-2 border-dashed border-yellow-400/30"></div>
                  </div>
                  <div className="absolute inset-4 animate-spin-reverse">
                    <div className="absolute inset-0 rounded-full border-2 border-dashed border-purple-400/30"></div>
                  </div>

                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-300/30 via-pink-300/30 to-purple-300/30 blur-3xl animate-pulse"></div>

                  {/* Image */}
                  <div className="relative z-10 transform hover:scale-105 transition-all duration-700">
                    <Image
                      src="/images/TOKEN-MILAGRE-Hero.webp"
                      alt="Anjo Guardião $MILAGRE"
                      width={600}
                      height={600}
                      className="drop-shadow-2xl rounded-3xl"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-8 h-12 rounded-full border-2 border-brand-primary/50 flex items-start justify-center p-2">
              <div className="w-2 h-3 bg-brand-primary rounded-full animate-pulse"></div>
            </div>
          </div>
        </section>

        {/* Os Três Guardiões */}
        <section id="guardioes" className="py-24 relative overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-5xl lg:text-6xl font-bold mb-6 font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
                Os Três Guardiões ✨
              </h2>
              <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                Nossa comunidade é guiada por três pilares fundamentais que representam o equilíbrio entre crescimento material, intelectual e emocional.
              </p>
            </div>

            {/* Guardian Cards */}
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
              {guardians.map((guardian, index) => (
                <div
                  key={index}
                  onClick={() => setActiveGuardian(index)}
                  className={`group relative backdrop-blur-xl rounded-3xl p-8 border-2 cursor-pointer transition-all duration-500 ${
                    activeGuardian === index ? 'scale-105 shadow-2xl' : 'hover:scale-102 shadow-theme-lg'
                  }`}
                  style={{
                    backgroundColor: 'var(--bg-elevated)',
                    borderColor: activeGuardian === index ? 'var(--brand-primary)' : 'var(--border-medium)'
                  }}
                >
                  {/* Active indicator */}
                  {activeGuardian === index && (
                    <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 rounded-3xl opacity-20 blur-xl"></div>
                  )}

                  <div className="relative z-10">
                    {/* Icon */}
                    <div className={`w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${guardian.color} flex items-center justify-center text-5xl shadow-theme-lg transform group-hover:rotate-6 transition-transform`}>
                      {guardian.icon}
                    </div>

                    {/* Name */}
                    <h3 className="text-3xl font-bold text-center mb-4 font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
                      {guardian.name}
                    </h3>

                    {/* Description */}
                    <p className="text-center mb-6" style={{ color: 'var(--text-secondary)' }}>
                      {guardian.description}
                    </p>

                    {/* Benefits */}
                    <div className="space-y-2">
                      {guardian.benefits.map((benefit, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <span className="text-brand-primary">✓</span>
                          <span style={{ color: 'var(--text-secondary)' }}>{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Progress dots */}
            <div className="flex justify-center gap-2 mb-12">
              {guardians.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveGuardian(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    activeGuardian === index ? 'w-8 bg-brand-primary' : 'bg-gray-400'
                  }`}
                />
              ))}
            </div>

            {/* Community Section */}
            <div className="text-center mb-8 max-w-2xl mx-auto">
              <div className="text-6xl mb-4">❤️</div>
              <h3 className="text-3xl md:text-4xl font-bold mb-4 font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
                Faça Parte da Família $MILAGRE
              </h3>
              <p className="text-lg mb-2" style={{ color: 'var(--text-secondary)' }}>
                Juntos somos mais fortes. Juntos criamos milagres.
              </p>
              <p className="text-lg font-bold text-brand-primary">
                Nunca estarás sozinho.
              </p>
            </div>

            {/* Community Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
              <a
                href="https://discord.gg/skaX8bFY"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-theme-xl hover:shadow-2xl hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #5865F2, #4752C4)',
                  color: 'white'
                }}
              >
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
                <span>Discord</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </a>

              <a
                href="https://t.me/+Bop_TVFc_mg3Njlh"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-theme-xl hover:shadow-2xl hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #0088cc, #006699)',
                  color: 'white'
                }}
              >
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12s12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21l-1.446 1.394c-.14.18-.357.295-.6.295c-.002 0-.003 0-.005 0l.213-3.054l5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326l-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
                </svg>
                <span>Telegram</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </a>
            </div>
          </div>
        </section>

        {/* Níveis de Participação - TEMPORARIAMENTE OCULTO */}
        {/* <section className="py-24 relative">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-5xl lg:text-6xl font-bold mb-6 font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
                Níveis de Participação 🎯
              </h2>
              <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                Quanto mais você acredita e apoia, mais benefícios desbloqueia na comunidade.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {tiers.map((tier, index) => (
                <div
                  key={index}
                  className="group relative backdrop-blur-xl rounded-3xl p-8 border-2 hover:shadow-2xl hover:scale-105 transition-all duration-500"
                  style={{
                    backgroundColor: 'var(--bg-elevated)',
                    borderColor: 'var(--border-medium)'
                  }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${tier.color} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity`}></div>

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${tier.color} flex items-center justify-center text-3xl shadow-theme-md`}>
                        {tier.icon}
                      </div>
                      <div className="px-4 py-2 rounded-full text-sm font-bold" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
                        {tier.amount} $MILAGRE
                      </div>
                    </div>

                    <h3 className="text-3xl font-bold mb-6 font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
                      {tier.name}
                    </h3>

                    <div className="space-y-3">
                      {tier.benefits.map((benefit, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <span className="text-brand-primary mt-1">✓</span>
                          <span style={{ color: 'var(--text-secondary)' }}>{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <p className="text-lg mb-6" style={{ color: 'var(--text-secondary)' }}>
                Pronto para fazer parte da comunidade?
              </p>
              <a
                href={`https://pump.fun/coin/${TOKEN_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl font-bold text-xl transition-all shadow-theme-xl hover:shadow-2xl hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-hover))',
                  color: 'var(--text-inverse)'
                }}
              >
                <span>🚀</span>
                <span>Começar Agora</span>
              </a>
            </div>
          </div>
        </section> */}

        {/* Informações do Token */}
        <section className="py-24 relative overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-5xl lg:text-6xl font-bold mb-6 font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
                Informações do Token 🔐
              </h2>
              <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                Transparência total. Tecnologia de ponta. Segurança garantida pela blockchain Solana.
              </p>
            </div>

            {/* Main Token Card */}
            <div className="max-w-4xl mx-auto mb-16">
              <div className="backdrop-blur-xl rounded-3xl p-8 md:p-12 border-2 shadow-theme-xl" style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border-medium)'
              }}>
                {/* Header */}
                <div className="flex items-center justify-center md:justify-start gap-6 mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden border-2" style={{ borderColor: 'var(--brand-primary)' }}>
                      <Image
                        src="/images/TOKEN-MILAGRE-.webp"
                        alt="$MILAGRE Logo"
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-4xl font-bold font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>$MILAGRE</h3>
                      <p className="text-brand-primary font-semibold">SPL Token • Solana Blockchain</p>
                    </div>
                  </div>
                </div>

                {/* Contract Address */}
                <div className="mb-8">
                  <p className="text-sm font-semibold mb-3 text-brand-primary">📍 ENDEREÇO DO CONTRATO</p>
                  <div className="rounded-2xl p-4 mb-4 border" style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-medium)'
                  }}>
                    <code className="font-mono text-sm md:text-base break-all" style={{ color: 'var(--text-primary)' }}>
                      {TOKEN_ADDRESS}
                    </code>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      onClick={copyToClipboard}
                      className="px-6 py-3 font-bold rounded-xl transition-all shadow-theme-md hover:scale-105 flex items-center justify-center gap-2"
                      style={{
                        background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-hover))',
                        color: 'var(--text-inverse)'
                      }}
                    >
                      <span>{copied ? '✓' : '📋'}</span>
                      <span>{copied ? 'Copiado!' : 'Copiar'}</span>
                    </button>

                    <a
                      href={`https://solscan.io/token/${TOKEN_ADDRESS}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-gradient-to-r from-purple-400 to-purple-500 hover:from-purple-300 hover:to-purple-400 text-white font-bold rounded-xl transition-all shadow-theme-md hover:scale-105 flex items-center justify-center gap-2"
                    >
                      <span>🔍</span>
                      <span>Solscan</span>
                    </a>

                    <a
                      href={`https://pump.fun/coin/${TOKEN_ADDRESS}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-300 hover:to-emerald-400 text-white font-bold rounded-xl transition-all shadow-theme-md hover:scale-105 flex items-center justify-center gap-2"
                    >
                      <span>🪙</span>
                      <span>Comprar</span>
                    </a>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Blockchain', value: 'Solana', icon: '⚡' },
                    { label: 'Tipo', value: 'SPL Token', icon: '🎯' },
                    { label: 'Plataforma', value: 'Pump.fun', icon: '🚀' },
                    { label: 'Velocidade', value: '<1s', icon: '⏱️' }
                  ].map((stat, index) => (
                    <div key={index} className="backdrop-blur rounded-xl p-4 border text-center hover:scale-105 transition-all" style={{
                      backgroundColor: 'var(--bg-secondary)',
                      borderColor: 'var(--border-medium)'
                    }}>
                      <p className="text-2xl mb-1">{stat.icon}</p>
                      <p className="text-xs mb-1 font-semibold text-brand-primary">{stat.label}</p>
                      <p className="font-bold" style={{ color: 'var(--text-primary)' }}>{stat.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Como Comprar $MILAGRE */}
        <section className="mb-20 py-24" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          <div className="container mx-auto px-4">
            {/* Header */}
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
                Como Comprar $MILAGRE 🚀
              </h2>
              <p className="text-lg md:text-xl max-w-3xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                Siga este guia passo a passo para adquirir seus tokens e se juntar à nossa comunidade.
              </p>
            </div>

            {/* Steps Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 max-w-7xl mx-auto">
              {[
                {
                  step: '1',
                  title: 'Instale a Phantom',
                  description: 'Baixe a carteira Phantom (extensão do navegador ou app mobile).'
                },
                {
                  step: '2',
                  title: 'Compre Solana (SOL)',
                  description: 'Adquira SOL em exchanges como Binance, Coinbase ou diretamente na Phantom com cartão.'
                },
                {
                  step: '3',
                  title: 'Acesse Pump.fun',
                  description: 'Visite pump.fun e conecte sua Phantom Wallet.'
                },
                {
                  step: '4',
                  title: 'Troque por $MILAGRE',
                  description: 'Insira a quantidade de SOL, confirme a transação e receba seus $MILAGRE!'
                }
              ].map((step, index) => (
                <div
                  key={index}
                  className="relative backdrop-blur-xl rounded-2xl p-6 border-2 hover:scale-105 transition-all duration-300 shadow-theme-lg"
                  style={{
                    backgroundColor: 'var(--bg-elevated)',
                    borderColor: 'var(--border-medium)'
                  }}
                >
                  {/* Step Badge */}
                  <div className="absolute -top-4 left-6 w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg"
                    style={{
                      background: 'linear-gradient(135deg, #FFA500 0%, #FF8C00 100%)'
                    }}
                  >
                    {step.step}
                  </div>

                  {/* Content */}
                  <div className="mt-8">
                    <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                      {step.title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="text-center">
              <a
                href={`https://pump.fun/coin/${TOKEN_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 font-bold text-white rounded-full transition-all shadow-2xl hover:scale-105 hover:shadow-3xl text-lg"
                style={{
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                }}
              >
                <span className="text-xl">🚀</span>
                <span>Comprar Agora no Pump.fun</span>
              </a>
            </div>
          </div>
        </section>

        {/* Scroll to top button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 border-2"
            style={{
              background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-hover))',
              borderColor: 'var(--brand-primary)',
              color: 'var(--text-inverse)'
            }}
            aria-label="Voltar ao topo"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        )}
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
    </>
  );
}
