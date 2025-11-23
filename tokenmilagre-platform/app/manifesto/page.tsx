'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Script from 'next/script';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowUp,
  faCheckCircle,
  faHeart,
  faLightbulb,
  faUsers,
  faHandHoldingHeart,
  faBalanceScale,
  faGlobe,
  faCode
} from '@fortawesome/free-solid-svg-icons';
import { faDiscord, faTelegram, faGithub } from '@fortawesome/free-brands-svg-icons';

interface TableOfContentsItem {
  id: string;
  text: string;
}

export default function ManifestoPage() {
  const [activeSection, setActiveSection] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);

  const tableOfContents: TableOfContentsItem[] = [
    { id: 'nossa-visao', text: 'Nossa Visão' },
    { id: 'nossa-missao', text: 'Nossa Missão' },
    { id: 'valores-fundamentais', text: 'Valores Fundamentais' },
    { id: 'tres-guardioes', text: 'Nossos Três Guardiões' },
    { id: 'governanca', text: 'Governança' },
    { id: 'roadmap', text: 'Roadmap' },
    { id: 'open-source', text: 'Open Source' },
    { id: 'junte-se', text: 'Junte-se' },
  ];



  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    setIsVisible(true);
    const handleScroll = () => {
      // Encontra a seção ativa
      const headingElements = tableOfContents.map(item => ({
        id: item.id,
        element: document.getElementById(item.id)
      })).filter(item => item.element);

      for (let i = headingElements.length - 1; i >= 0; i--) {
        const element = headingElements[i].element;
        if (element && element.getBoundingClientRect().top <= 150) {
          setActiveSection(headingElements[i].id);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Call once to set initial state
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Schema.org JSON-LD */}
      <Script id="manifesto-schema" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          "name": "Manifesto Open Source $MILAGRE",
          "description": "Um movimento de apoio mútuo genuíno construído sobre os princípios do código aberto",
          "url": "https://tokenmilagre.xyz/manifesto",
          "license": "https://creativecommons.org/licenses/by-sa/4.0/"
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

        /* Spinning Animations */
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }

        /* Gradient Text */
        .gradient-text {
          background: linear-gradient(135deg, #0d9488, #14b8a6, #5eead4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Scrollbar for TOC */
        .toc-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .toc-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .toc-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        .toc-scrollbar:hover::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>

      <div className="min-h-screen relative overflow-hidden bg-[var(--bg-secondary)] transition-colors duration-300">
        {/* Background Orbs */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-green-400/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-400/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-[40%] left-[40%] w-[400px] h-[400px] bg-purple-400/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className={`relative z-10 max-w-7xl mx-auto px-6 py-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="w-full space-y-20">
            {/* Hero Section */}
            <section className="text-center space-y-8">
              {/* Animated Logo with Floating Effect */}
              <div className="flex justify-center mb-8 mt-12">
                <div className="relative w-60 h-60 md:w-72 md:h-72 animate-float">
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

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-montserrat font-bold leading-tight text-gray-900 dark:text-[var(--text-primary)] drop-shadow-lg">
                Nunca Estarás <br />
                <span className="gradient-text">Sozinho</span>
              </h1>

              <p className="text-xl md:text-2xl font-inter leading-relaxed max-w-3xl mx-auto text-gray-700 dark:text-[var(--text-secondary)]">
                Um movimento de apoio mútuo genuíno construído sobre os princípios do código aberto,
                da colaboração peer-to-peer e da crença fundamental de que{' '}
                <span className="font-bold text-green-500">juntos somos mais fortes</span>.
              </p>

              <div className="glass-panel p-8 rounded-3xl border-l-4 border-l-green-500">
                <h3 className="font-montserrat font-bold text-xl mb-3 text-gray-900 dark:text-[var(--text-primary)]">
                  Do Only Good Everyday
                </h3>
                <p className="font-inter leading-relaxed text-gray-700 dark:text-[var(--text-secondary)]">
                  Inspirados pela filosofia das comunidades Linux e open source, onde o conhecimento é livre,
                  a colaboração é incentivada e o mérito vem da contribuição real, criamos o $MILAGRE como um
                  commons digital - um bem coletivo gerido pela comunidade, para a comunidade.
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <a
                  href="https://discord.gg/xk4zrz8j"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="neumorphic-button flex items-center gap-3 px-8 py-4 rounded-full font-inter font-semibold text-gray-900 dark:text-[var(--text-primary)] hover:text-white hover:bg-[#5865F2] transition-colors"
                >
                  <FontAwesomeIcon icon={faDiscord} className="w-6 h-6" />
                  <span>Entrar no Discord</span>
                </a>

                <a
                  href="https://t.me/+Bop_TVFc_mg3Njlh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="neumorphic-button flex items-center gap-3 px-8 py-4 rounded-full font-inter font-semibold text-gray-900 dark:text-[var(--text-primary)] hover:text-white hover:bg-[#0088cc] transition-colors"
                >
                  <FontAwesomeIcon icon={faTelegram} className="w-6 h-6" />
                  <span>Entrar no Telegram</span>
                </a>
              </div>
            </section>

            {/* Nossa Visão */}
            <section id="nossa-visao" className="scroll-mt-32 space-y-8">
              <h2 className="text-3xl md:text-4xl font-montserrat font-bold text-gray-900 dark:text-[var(--text-primary)]">
                Nossa Visão
              </h2>

              <div className="glass-panel p-8 rounded-3xl">
                <p className="text-lg font-inter leading-relaxed mb-8 text-gray-700 dark:text-[var(--text-secondary)]">
                  Visionamos um ecossistema descentralizado onde tecnologia blockchain serve como infraestrutura
                  para conexão humana genuína, onde holders não são apenas investidores, mas membros ativos de
                  uma comunidade que se apoia mutuamente.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    { title: 'Colaboração > Competição', desc: 'O valor real emerge quando pessoas compartilham conhecimento, recursos e experiências livremente', color: '#4caf50', icon: faUsers },
                    { title: 'Transparência Total', desc: 'Abertura total sobre decisões, finanças e processos fortalece vínculos comunitários', color: '#2196f3', icon: faLightbulb },
                    { title: 'Conhecimento Livre', desc: 'Educação e recursos devem estar acessíveis a todos, sem barreiras de entrada', color: '#ffc107', icon: faGlobe },
                    { title: 'Meritocracia', desc: 'Influência e reconhecimento vêm de ajudar ativamente, não apenas de acumular tokens', color: '#9c27b0', icon: faHandHoldingHeart }
                  ].map((item, index) => (
                    <div key={index} className="neumorphic-card p-6 hover:scale-105 transition-transform duration-300">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md" style={{ backgroundColor: item.color }}>
                          <FontAwesomeIcon icon={item.icon} className="w-5 h-5" />
                        </div>
                        <h3 className="font-montserrat font-bold text-gray-900 dark:text-[var(--text-primary)]">{item.title}</h3>
                      </div>
                      <p className="text-sm font-inter text-gray-700 dark:text-[var(--text-secondary)]">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Nossa Missão */}
            <section id="nossa-missao" className="scroll-mt-32 space-y-8">
              <h2 className="text-3xl md:text-4xl font-montserrat font-bold text-gray-900 dark:text-[var(--text-primary)]">
                Nossa Missão
              </h2>

              <div className="relative rounded-[40px] overflow-hidden min-h-[600px] flex items-end group">
                {/* Background Image */}
                <div className="absolute inset-0 w-full h-full">
                  <Image
                    src="/images/manifesto-hero.webp"
                    alt="Missão $MILAGRE"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                </div>

                {/* Content Overlay */}
                <div className="relative z-10 p-8 md:p-12 w-full">
                  <div className="glass-panel p-8 rounded-3xl backdrop-blur-md bg-[var(--bg-elevated)]/90 dark:bg-[var(--bg-elevated)]/30 border-gray-200 dark:border-white/10">
                    <h3 className="text-2xl md:text-4xl font-montserrat font-bold mb-6 text-[var(--text-primary)] leading-tight">
                      Construir o Maior Ecossistema de Apoio Mútuo Descentralizado do Mundo
                    </h3>

                    <p className="text-lg font-inter mb-8 text-[var(--text-secondary)]">
                      Nossa missão é criar e sustentar uma comunidade global na blockchain Solana onde cada membro tem acesso a:
                    </p>

                    <div className="grid md:grid-cols-3 gap-6">
                      {[
                        { title: 'Prosperidade Compartilhada', desc: 'Orientação financeira e oportunidades de crescimento' },
                        { title: 'Sabedoria Coletiva', desc: 'Mentorias peer-to-peer e workshops educacionais' },
                        { title: 'Esperança Constante', desc: 'Suporte emocional e comunidade de apoio 24/7' }
                      ].map((item, index) => (
                        <div key={index} className="flex flex-col gap-2 p-4 rounded-xl bg-[var(--bg-tertiary)]/50 hover:bg-[var(--bg-tertiary)]/80 transition-colors">
                          <div className="w-2 h-2 rounded-full bg-green-400 mb-2"></div>
                          <h4 className="font-montserrat font-bold text-base text-[var(--text-primary)]">{item.title}</h4>
                          <p className="text-sm font-inter text-[var(--text-secondary)]">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Valores Fundamentais */}
            <section id="valores-fundamentais" className="scroll-mt-32 space-y-8">
              <h2 className="text-3xl md:text-4xl font-montserrat font-bold text-gray-900 dark:text-[var(--text-primary)]">
                Valores Fundamentais
              </h2>

              <div className="grid gap-6">
                {[
                  {
                    title: 'Transparência Radical',
                    desc: 'Toda decisão, transação e processo é visível publicamente na blockchain e em nossas plataformas abertas.',
                    items: ['Votações de governança públicas', 'Treasury com multisig transparente', 'Relatórios mensais', 'Código open source'],
                    gradient: 'linear-gradient(135deg, #4caf50, #81c784)'
                  },
                  {
                    title: 'Colaboração Aberta',
                    desc: 'Seguindo o modelo open source, qualquer holder pode contribuir com código, ideias, conteúdo educacional ou suporte.',
                    items: ['Repositórios GitHub públicos', 'Sistema de proposals aberto', 'Wiki colaborativa', 'Badges NFT por contribuição'],
                    gradient: 'linear-gradient(135deg, #2196f3, #64b5f6)'
                  },
                  {
                    title: 'Inclusão e Acessibilidade',
                    desc: 'O $MILAGRE é para todos, independente de experiência técnica, quantidade de tokens ou background.',
                    items: ['Tutoriais diversos', 'Suporte multilíngue', 'Onboarding estruturado', 'Mentorias gratuitas'],
                    gradient: 'linear-gradient(135deg, #ff9800, #ffb74d)'
                  },
                  {
                    title: 'Apoio Mútuo Genuíno',
                    desc: 'Esta não é uma comunidade transacional - é um ecossistema onde membros genuinamente se preocupam uns com os outros.',
                    items: ['Mentoria peer-to-peer', 'Suporte emocional', 'Fundo de emergência', 'Cultura de ajuda'],
                    gradient: 'linear-gradient(135deg, #9c27b0, #ba68c8)'
                  }
                ].map((valor, index) => (
                  <div key={index} className="neumorphic-card p-8 group hover:border-green-500/30 transition-all">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg neumorphic-button" style={{ background: valor.gradient }}>
                        <span className="text-2xl font-bold text-white">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-montserrat font-bold mb-3 text-gray-900 dark:text-[var(--text-primary)]">{valor.title}</h3>
                        <p className="text-lg font-inter mb-6 text-gray-700 dark:text-[var(--text-secondary)]">{valor.desc}</p>
                        <div className="grid sm:grid-cols-2 gap-3">
                          {valor.items.map((item, i) => (
                            <div key={i} className="flex items-center gap-3">
                              <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                              <span className="text-sm font-inter text-gray-700 dark:text-[var(--text-secondary)]">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Nossos Três Guardiões */}
            <section id="tres-guardioes" className="scroll-mt-32 space-y-8">
              <h2 className="text-3xl md:text-4xl font-montserrat font-bold text-gray-900 dark:text-[var(--text-primary)]">
                Nossos Três Guardiões
              </h2>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    title: 'Guardiã da Prosperidade',
                    subtitle: 'Empoderar com educação',
                    items: ['Curadoria DeFi', 'Grupos de estudo', 'Oportunidades', 'Planejamento'],
                    color: '#4caf50',
                    image: '/images/guardian-prosperity.webp'
                  },
                  {
                    title: 'Guardião da Sabedoria',
                    subtitle: 'Cultivar conhecimento',
                    items: ['Biblioteca', 'Workshops', 'Mentorias', 'Cases de sucesso'],
                    color: '#2196f3',
                    image: '/images/guardian-wisdom.webp'
                  },
                  {
                    title: 'Anjo da Esperança',
                    subtitle: 'Prover suporte emocional',
                    items: ['Moderação empática', 'Grupos de apoio', 'Fundo emergência', 'Celebrações'],
                    color: '#9c27b0',
                    image: '/images/guardian-hope.webp'
                  }
                ].map((guardian, index) => (
                  <div key={index} className="glass-panel p-0 rounded-[30px] flex flex-col h-full overflow-hidden border-t-4 hover:-translate-y-2 transition-transform duration-300" style={{ borderTopColor: guardian.color }}>
                    <div className="relative w-full h-48">
                      <Image
                        src={guardian.image}
                        alt={guardian.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                      <div className="absolute bottom-4 left-0 w-full text-center">
                        <h3 className="text-xl font-montserrat font-bold text-white drop-shadow-md">{guardian.title}</h3>
                      </div>
                    </div>

                    <div className="p-6 flex flex-col flex-1">
                      <p className="text-sm text-center mb-6 font-inter opacity-80 text-gray-700 dark:text-[var(--text-secondary)]">{guardian.subtitle}</p>

                      <div className="space-y-3 mt-auto">
                        {guardian.items.map((item, i) => (
                          <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-white/5">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: guardian.color }}></div>
                            <span className="text-sm font-inter text-gray-700 dark:text-[var(--text-secondary)]">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Governança */}
            <section id="governanca" className="scroll-mt-32 space-y-8">
              <h2 className="text-3xl md:text-4xl font-montserrat font-bold text-gray-900 dark:text-[var(--text-primary)]">
                Princípios de Governança
              </h2>

              <div className="glass-panel p-0 rounded-[30px] overflow-hidden">
                <div className="relative w-full h-64">
                  <Image
                    src="/images/governance-transparency.webp"
                    alt="Governança Transparente"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-end p-8">
                    <h3 className="text-2xl md:text-3xl font-montserrat font-bold text-white">
                      Decisões Coletivas e Transparentes
                    </h3>
                  </div>
                </div>

                <div className="p-8 grid md:grid-cols-3 gap-8">
                  <div className="neumorphic-card p-6 text-center">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600 dark:text-green-400">
                      <FontAwesomeIcon icon={faUsers} className="w-6 h-6" />
                    </div>
                    <h3 className="font-montserrat font-bold mb-2 text-xl text-gray-900 dark:text-[var(--text-primary)]">Do-ocracia</h3>
                    <p className="text-sm font-inter text-gray-700 dark:text-[var(--text-secondary)]">Quem faz, decide. Influência baseada em contribuição ativa.</p>
                  </div>
                  <div className="neumorphic-card p-6 text-center">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400">
                      <FontAwesomeIcon icon={faBalanceScale} className="w-6 h-6" />
                    </div>
                    <h3 className="font-montserrat font-bold mb-2 text-xl text-gray-900 dark:text-[var(--text-primary)]">Votação Híbrida</h3>
                    <p className="text-sm font-inter text-gray-700 dark:text-[var(--text-secondary)]">Quadrática para decisões gerais, ponderada por reputação para técnicas.</p>
                  </div>
                  <div className="neumorphic-card p-6 text-center">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-400">
                      <FontAwesomeIcon icon={faLightbulb} className="w-6 h-6" />
                    </div>
                    <h3 className="font-montserrat font-bold mb-2 text-xl text-gray-900 dark:text-[var(--text-primary)]">Transparência</h3>
                    <p className="text-sm font-inter text-gray-700 dark:text-[var(--text-secondary)]">Discussão aberta, refinamento colaborativo e execução pública.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Roadmap */}
            <section id="roadmap" className="scroll-mt-32 space-y-8">
              <h2 className="text-3xl md:text-4xl font-montserrat font-bold text-gray-900 dark:text-[var(--text-primary)]">
                Roadmap de Longo Prazo
              </h2>

              <div className="space-y-6">
                {[
                  { year: '2025-2026', title: 'Fundação Sólida', items: ['Governança DAO completa', 'Biblioteca educacional', '10k holders ativos'], color: '#4caf50' },
                  { year: '2027-2028', title: 'Expansão Sustentável', items: ['SubDAOs especializadas', 'Marketplace de serviços', 'Staking com recompensas'], color: '#ffb703' },
                  { year: '2029-2030', title: 'Impacto Global', items: ['Referência Web3', 'Fundo de impacto social', 'Sustentabilidade total'], color: '#fb8500' }
                ].map((phase, index) => (
                  <div key={index} className="glass-panel p-8 rounded-3xl relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-2" style={{ backgroundColor: phase.color }}></div>
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                      <div className="md:w-48 flex-shrink-0">
                        <span className="inline-block px-4 py-1 rounded-full text-sm font-bold mb-2" style={{ backgroundColor: `${phase.color}20`, color: phase.color }}>
                          {phase.year}
                        </span>
                        <h3 className="text-xl font-montserrat font-bold text-gray-900 dark:text-[var(--text-primary)]">{phase.title}</h3>
                      </div>
                      <div className="flex-1 grid sm:grid-cols-2 gap-3">
                        {phase.items.map((item, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: phase.color }}></div>
                            <span className="text-sm font-inter text-gray-700 dark:text-[var(--text-secondary)]">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Open Source */}
            <section id="open-source" className="scroll-mt-32 space-y-8">
              <h2 className="text-3xl md:text-4xl font-montserrat font-bold text-gray-900 dark:text-[var(--text-primary)]">
                Compromisso Open Source
              </h2>

              <div className="glass-panel p-8 rounded-3xl dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 dark:border-gray-700">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="text-8xl text-[var(--text-primary)]">
                    <FontAwesomeIcon icon={faGithub} />
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-inter leading-relaxed mb-6 text-gray-700 dark:text-[var(--text-secondary)]">
                      Inspirados pelos gigantes do open source como Linux, Mozilla e Wikipedia.
                      Todo smart contract, ferramenta e conteúdo educacional é livre.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 text-gray-700 dark:text-[var(--text-secondary)]">
                        <div className="w-2 h-2 rounded-full bg-green-400"></div>
                        <span>Código 100% Auditável</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-700 dark:text-[var(--text-secondary)]">
                        <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                        <span>Contribuição Livre</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Junte-se */}
            <section id="junte-se" className="scroll-mt-32 py-12 text-center">
              <h2 className="text-4xl md:text-5xl font-montserrat font-bold mb-8 text-gray-900 dark:text-[var(--text-primary)]">
                Junte-se ao Movimento
              </h2>

              <p className="text-xl font-inter mb-12 max-w-2xl mx-auto text-gray-700 dark:text-[var(--text-secondary)]">
                O $MILAGRE não pertence a fundadores ou baleias - pertence a todos que contribuem para torná-lo real.
              </p>

              <div className="glass-panel p-8 rounded-3xl max-w-3xl mx-auto mb-12 text-left">
                <p className="font-montserrat font-bold text-lg mb-6 text-center text-gray-900 dark:text-[var(--text-primary)]">Se você acredita que:</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {['Colaboração > Competição', 'Conhecimento deve ser livre', 'Tecnologia deve servir à humanidade', 'Ninguém deve caminhar sozinho'].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                      <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
                      <span className="font-inter text-gray-700 dark:text-[var(--text-secondary)]">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-2xl md:text-3xl font-montserrat font-bold gradient-text mb-12">
                Então você já é parte do $MILAGRE ❤️
              </p>

              <div className="flex flex-wrap justify-center gap-6">
                <a
                  href="https://discord.gg/xk4zrz8j"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="neumorphic-button flex items-center gap-3 px-10 py-5 rounded-full font-inter font-bold text-gray-900 dark:text-[var(--text-primary)] hover:text-white hover:bg-[#5865F2] shadow-xl text-lg transition-colors"
                >
                  <FontAwesomeIcon icon={faDiscord} className="w-6 h-6" />
                  <span>Entrar no Discord</span>
                </a>

                <a
                  href="https://t.me/+Bop_TVFc_mg3Njlh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="neumorphic-button flex items-center gap-3 px-10 py-5 rounded-full font-inter font-bold text-gray-900 dark:text-[var(--text-primary)] hover:text-white hover:bg-[#0088cc] shadow-xl text-lg transition-colors"
                >
                  <FontAwesomeIcon icon={faTelegram} className="w-6 h-6" />
                  <span>Entrar no Telegram</span>
                </a>
              </div>
            </section>
          </div>
        </div>

      </div>
    </>
  );
}
