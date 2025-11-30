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
  faWallet,
  faExchangeAlt,
  faCoins,
  faCopy,
  faArrowRight,
  faHandshake,
  faLightbulb,
  faChartPie,
  faArrowUp
} from '@fortawesome/free-solid-svg-icons';
import { faDiscord, faTelegram } from '@fortawesome/free-brands-svg-icons';

export default function TokenPage() {
  const [isVisible, setIsVisible] = useState(false);
  const TOKEN_ADDRESS = '3tpz3ar7gaHmPZfhWHzRdPnBJ5MrZZVDxepDtDLYpump';

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const impactAreas = [
    {
      title: 'Educação Gratuita',
      description: 'Produção de guias anti-golpe e tutoriais de segurança.',
      percentage: '40%',
      color: '#4caf50', // Green
      icon: faChartPie
    },
    {
      title: 'Tecnologia',
      description: 'Desenvolvimento de ferramentas de análise de risco.',
      percentage: '30%',
      color: '#2196f3', // Blue
      icon: faShieldAlt
    },
    {
      title: 'Fundo de Reserva',
      description: 'Proteção contra volatilidade e emergências.',
      percentage: '20%',
      color: '#ff9800', // Orange
      icon: faCoins
    },
    {
      title: 'Infraestrutura',
      description: 'Manutenção de servidores e APIs.',
      percentage: '10%',
      color: '#0D9488', // Teal
      icon: faArrowUp
    }
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(TOKEN_ADDRESS);
    alert('Endereço copiado!');
  };

  return (
    <>
      <Script id="token-schema" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "$MILAGRE Token - Apoie a Educação Cripto",
          "description": "O token $MILAGRE não é investimento, é um símbolo de apoio à educação financeira e proteção contra golpes na Web3.",
          "url": "https://tokenmilagre.xyz/token"
        })}
      </Script>

      <div className="min-h-screen relative overflow-hidden transition-colors duration-300 font-sans">
        {/* Background Color with Mask to blend with Breadcrumbs */}
        <div
          className="absolute inset-0 bg-[var(--bg-secondary)] z-0 pointer-events-none"
          style={{
            maskImage: 'linear-gradient(to bottom, transparent, black 150px)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 150px)'
          }}
        />

        {/* Background Orbs */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-green-500/20 rounded-full blur-[120px] animate-pulse-slow"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-teal-500/20 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-[40%] left-[40%] w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className={`relative z-10 max-w-7xl mx-auto px-6 py-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

          {/* Hero Section */}
          <section className="text-center space-y-8 mb-32 pt-12">
            {/* Animated Logo with Floating Effect */}
            <div className="flex justify-center mb-8 mt-12">
              <div className="relative w-60 h-60 md:w-72 md:h-72 animate-float-vertical">
                {/* Animated rings */}
                <div className="absolute inset-0" style={{ animation: 'spin-slow 25s linear infinite' }}>
                  <div className="absolute inset-0 rounded-full border-2 border-dashed opacity-30 border-green-500"></div>
                </div>
                <div className="absolute inset-3" style={{ animation: 'spin-reverse 20s linear infinite' }}>
                  <div className="absolute inset-0 rounded-full border-2 border-dashed opacity-30 border-teal-500"></div>
                </div>

                {/* Glow effect */}
                <div className="absolute inset-0 blur-2xl animate-pulse opacity-20" style={{
                  background: 'linear-gradient(135deg, #93c5fd, #bfdbfe, #dbeafe)'
                }}></div>

                {/* Image */}
                <div className="relative z-10 flex items-center justify-center h-full transform hover:scale-105 transition-all duration-700">
                  <Image
                    src="/images/TOKEN-MILAGRE-Hero.webp"
                    alt="$MILAGRE"
                    width={288}
                    height={288}
                    className="drop-shadow-2xl"
                    priority
                  />
                </div>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight text-[var(--text-primary)] drop-shadow-sm">
              Mais que um Token <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-teal-500">
                Uma Causa
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed font-light">
              O $MILAGRE é o combustível para manter nossa educação gratuita e independente.
              <br className="hidden md:block" />
              <span className="text-sm font-bold text-amber-500 uppercase tracking-widest mt-2 block">Não é uma recomendação de investimento</span>
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
              <a
                href={`https://pump.fun/coin/${TOKEN_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-10 py-5 rounded-full font-bold text-lg text-white bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600 shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-3"
              >
                <span>Apoiar o Projeto</span>
                <FontAwesomeIcon icon={faHandshake} className="w-5 h-5" />
              </a>

              <button
                onClick={() => document.getElementById('saiba-mais')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-10 py-5 rounded-full font-bold text-lg text-[var(--text-primary)] bg-[var(--bg-elevated)] border border-[var(--border-medium)] hover:border-[var(--brand-primary)] shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                Entenda a Utilidade
              </button>
            </div>
          </section>

          {/* Por que $MILAGRE? */}
          <section id="saiba-mais" className="mb-32">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[var(--text-primary)]">
                Para que serve?
              </h2>
              <p className="text-xl text-[var(--text-secondary)]">Utilidade real, impacto real.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: faLightbulb,
                  title: 'Financiar Educação',
                  description: 'Cada token adquirido ajuda a manter nossos servidores, produzir vídeos e criar guias anti-golpe gratuitos para a comunidade.',
                  color: 'text-green-500',
                  bg: 'bg-green-500/10'
                },
                {
                  icon: faUsers,
                  title: 'Acesso à Comunidade',
                  description: 'Holders de $MILAGRE têm acesso a canais exclusivos de discussão e votação sobre os próximos passos do projeto.',
                  color: 'text-teal-500',
                  bg: 'bg-teal-500/10'
                },
                {
                  icon: faShieldAlt,
                  title: 'Independência',
                  description: 'Ao nos financiar, você garante que nunca precisaremos aceitar patrocínios de projetos duvidosos ou "shillar" shitcoins.',
                  color: 'text-blue-500',
                  bg: 'bg-blue-500/10'
                }
              ].map((item, index) => (
                <div key={index} className="glass-card p-10 rounded-3xl flex flex-col items-start group hover:border-[var(--brand-primary)] transition-colors">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 ${item.bg} ${item.color} text-3xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                    <FontAwesomeIcon icon={item.icon} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-[var(--text-primary)]">
                    {item.title}
                  </h3>
                  <p className="text-[var(--text-secondary)] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Impact Section - Moved from /doacoes */}
          <div className="mb-32">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[var(--text-primary)]">
                Impacto Real
              </h2>
              <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
                Para onde vai sua contribuição?
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {impactAreas.map((area, index) => (
                <div key={index} className="glass-card p-8 rounded-[30px] text-center hover:bg-white/5 transition-all duration-300 group">
                  <div className="w-16 h-16 rounded-2xl bg-[var(--bg-primary)] flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:scale-110 transition-transform">
                    <FontAwesomeIcon icon={area.icon} className="text-2xl" style={{ color: area.color }} />
                  </div>

                  <h3 className="text-xl font-bold mb-3 text-[var(--text-primary)]">{area.title}</h3>
                  <p className="text-sm text-[var(--text-secondary)] mb-6 min-h-[40px]">{area.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tokenomics */}
          <section className="mb-32">
            <div className="glass p-12 rounded-[3rem] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-teal-500/10 to-transparent rounded-bl-full -mr-20 -mt-20"></div>

              <div className="text-center mb-16 relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[var(--text-primary)]">
                  Transparência Total
                </h2>
                <p className="text-xl text-[var(--text-secondary)]">
                  Nada escondido. Verifique você mesmo na blockchain.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
                <div className="text-center md:text-left space-y-8">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-2">Supply Total</p>
                    <p className="text-6xl md:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
                      1 Bilhão
                    </p>
                    <p className="text-[var(--text-secondary)] mt-2">Tokens fixos. Sem minting function.</p>
                  </div>

                  <div className="glass-card p-8 rounded-2xl border-l-4 border-green-500">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xl font-bold text-[var(--text-primary)]">Distribuição Justa</span>
                      <span className="text-2xl font-bold text-green-500">100%</span>
                    </div>
                    <p className="text-[var(--text-secondary)]">Lançado via Pump.fun. Sem pré-venda, sem alocação para time, sem privilégios.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {[
                    { label: 'Blockchain', value: 'Solana', color: 'text-teal-500', icon: faGlobe },
                    { label: 'Contrato', value: 'Renunciado', color: 'text-blue-500', icon: faShieldAlt },
                    { label: 'Taxas', value: '0% Compra/Venda', color: 'text-green-500', icon: faCheckCircle }
                  ].map((stat, index) => (
                    <div key={index} className="glass-card p-6 rounded-2xl flex items-center gap-6">
                      <div className={`text-3xl ${stat.color}`}>
                        <FontAwesomeIcon icon={stat.icon} />
                      </div>
                      <div>
                        <p className="text-sm font-bold uppercase text-[var(--text-secondary)]">{stat.label}</p>
                        <p className="text-2xl font-bold text-[var(--text-primary)]">{stat.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Roadmap */}
          <section className="mb-32">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[var(--text-primary)]">
                Plano de Ação
              </h2>
              <p className="text-xl text-[var(--text-secondary)]">
                Nosso foco é construir valor real, não hype artificial.
              </p>
            </div>

            <div className="space-y-8 relative">
              {/* Connecting Line */}
              <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-teal-500 via-blue-500 to-transparent hidden md:block transform -translate-x-1/2 rounded-full opacity-30"></div>

              {[
                {
                  phase: 'Fase 1',
                  title: 'Fundação da Verdade',
                  description: 'Lançamento do portal educativo, estabelecimento dos canais oficiais e início da produção de conteúdo "Anti-Scam".',
                  icon: faSeedling,
                  status: 'current',
                  color: 'text-green-500',
                  bg: 'bg-green-500/10',
                  border: 'border-green-500'
                },
                {
                  phase: 'Fase 2',
                  title: 'Ferramentas de Proteção',
                  description: 'Desenvolvimento de bots para Telegram/Discord que ajudam a analisar contratos e identificar riscos em tempo real.',
                  icon: faShieldAlt,
                  status: 'upcoming',
                  color: 'text-amber-500',
                  bg: 'bg-amber-500/10',
                  border: 'border-amber-500'
                },
                {
                  phase: 'Fase 3',
                  title: 'Governança Comunitária',
                  description: 'Implementação de votação para que a comunidade decida quais temas educativos devem ser priorizados e como usar o fundo comunitário.',
                  icon: faUsers,
                  status: 'future',
                  color: 'text-blue-500',
                  bg: 'bg-blue-500/10',
                  border: 'border-blue-500'
                }
              ].map((phase, index) => (
                <div key={index} className={`relative flex flex-col md:flex-row gap-8 items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>

                  {/* Content */}
                  <div className="flex-1 w-full">
                    <div className={`glass-card p-8 rounded-3xl border-t-4 ${phase.border} hover:transform hover:-translate-y-2 transition-all duration-300`}>
                      <div className="flex items-center justify-between mb-4">
                        <span className={`text-sm font-bold uppercase tracking-widest ${phase.color}`}>{phase.phase}</span>
                        {phase.status === 'current' && (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-500 border border-green-500/20">
                            Em Andamento
                          </span>
                        )}
                      </div>
                      <h3 className="text-2xl font-bold mb-3 text-[var(--text-primary)]">{phase.title}</h3>
                      <p className="text-[var(--text-secondary)]">{phase.description}</p>
                    </div>
                  </div>

                  {/* Icon Marker */}
                  <div className={`relative z-10 w-16 h-16 rounded-full ${phase.bg} ${phase.color} flex items-center justify-center text-2xl shadow-lg border-4 border-[var(--bg-secondary)]`}>
                    <FontAwesomeIcon icon={phase.icon} />
                  </div>

                  {/* Spacer for layout balance */}
                  <div className="flex-1 hidden md:block"></div>
                </div>
              ))}
            </div>
          </section>

          {/* Como Comprar */}
          <section className="mb-32">
            <div className="glass p-12 rounded-[3rem]">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[var(--text-primary)]">
                  Como Apoiar
                </h2>
                <p className="text-xl text-[var(--text-secondary)]">
                  Se você quer fortalecer a educação cripto no Brasil.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    step: '01',
                    title: 'Carteira Solana',
                    desc: 'Use Phantom ou Solflare. Mantenha suas chaves privadas seguras e nunca as compartilhe.',
                    icon: faWallet,
                    color: 'text-purple-500'
                  },
                  {
                    step: '02',
                    title: 'Tenha SOL',
                    desc: 'Você precisará de Solana (SOL) para adquirir o token $MILAGRE na rede.',
                    icon: faCoins,
                    color: 'text-green-500'
                  },
                  {
                    step: '03',
                    title: 'Acesse o Pump.fun',
                    desc: 'Use o link oficial. Verifique sempre o endereço do contrato antes de confirmar.',
                    icon: faExchangeAlt,
                    color: 'text-blue-500'
                  }
                ].map((item, index) => (
                  <div key={index} className="glass-card p-8 rounded-3xl relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 text-9xl font-bold opacity-5 select-none text-[var(--text-primary)]">
                      {item.step}
                    </div>
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-[var(--bg-primary)] ${item.color} text-2xl shadow-sm`}>
                      <FontAwesomeIcon icon={item.icon} />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-[var(--text-primary)]">
                      {item.title}
                    </h3>
                    <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
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
                  className="inline-flex items-center gap-3 px-10 py-5 rounded-full font-bold text-white bg-[#0d9488] hover:bg-[#0f766e] shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
                >
                  <span>Acessar Pump.fun</span>
                  <FontAwesomeIcon icon={faRocket} className="w-5 h-5" />
                </a>
              </div>
            </div>
          </section>

          {/* Final CTA & Contract */}
          <section className="text-center pb-12">
            <h2 className="text-4xl md:text-6xl font-bold mb-8 text-[var(--text-primary)]">
              Faça Parte da Mudança
            </h2>

            <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto text-[var(--text-secondary)]">
              Ao adquirir $MILAGRE, você sinaliza que apoia um mercado cripto mais limpo, ético e educado.
            </p>

            <div className="flex flex-wrap justify-center gap-6 mb-16">
              <a
                href="https://discord.gg/jPgZr7BVXY"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative px-10 py-5 rounded-full bg-[#5865F2] text-white font-bold text-lg overflow-hidden transition-all hover:scale-105 hover:shadow-xl"
              >
                <div className="relative flex items-center gap-3">
                  <FontAwesomeIcon icon={faDiscord} className="text-2xl" />
                  <span>Discord</span>
                </div>
              </a>

              <a
                href="https://t.me/+Bop_TVFc_mg3Njlh"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative px-10 py-5 rounded-full bg-[#0088cc] text-white font-bold text-lg overflow-hidden transition-all hover:scale-105 hover:shadow-xl"
              >
                <div className="relative flex items-center gap-3">
                  <FontAwesomeIcon icon={faTelegram} className="text-2xl" />
                  <span>Telegram</span>
                </div>
              </a>
            </div>

            <div className="max-w-3xl mx-auto glass-card p-8 rounded-3xl">
              <p className="text-sm font-bold uppercase tracking-widest mb-4 text-[var(--text-secondary)]">
                Endereço do Contrato Oficial
              </p>
              <div className="flex flex-col md:flex-row items-center gap-4 justify-center">
                <code className="font-mono text-sm md:text-base px-6 py-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-medium)] text-[var(--text-primary)] break-all">
                  {TOKEN_ADDRESS}
                </code>
                <button
                  onClick={copyToClipboard}
                  className="p-4 rounded-xl bg-[var(--brand-primary)] text-white hover:bg-[var(--brand-hover)] transition-colors shadow-lg"
                  title="Copiar endereço"
                >
                  <FontAwesomeIcon icon={faCopy} />
                </button>
              </div>
            </div>

            <p className="text-sm mt-12 max-w-2xl mx-auto leading-relaxed text-[var(--text-tertiary)]">
              Isenção de Responsabilidade: $MILAGRE é um token de utilidade para a comunidade. Não possui valor intrínseco garantido e não deve ser tratado como investimento financeiro. O valor pode flutuar. Faça sua própria pesquisa (DYOR).
            </p>
          </section>

        </div >

        <style jsx>{`
          @keyframes float-vertical {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
            100% { transform: translateY(0px); }
          }
          .animate-float-vertical {
            animation: float-vertical 6s ease-in-out infinite;
          }
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes spin-reverse {
            from { transform: rotate(360deg); }
            to { transform: rotate(0deg); }
          }
        `}</style>
      </div >
    </>
  );
}
