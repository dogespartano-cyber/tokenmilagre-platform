'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Script from 'next/script';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowUp,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import { faDiscord, faTelegram, faGithub } from '@fortawesome/free-brands-svg-icons';

interface TableOfContentsItem {
  id: string;
  text: string;
}

export default function ManifestoPage() {
  const [showScrollTop, setShowScrollTop] = useState(false);
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
      setShowScrollTop(window.scrollY > 400);

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

        /* Glassmorphism Card */
        .glass-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.1);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .glass-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 40px 0 rgba(0, 0, 0, 0.15);
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.2);
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

        /* Gradient Text */
        .gradient-text {
          background: linear-gradient(135deg, #4caf50, #ffb703, #fb8500);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .gradient-text-purple {
          background: linear-gradient(135deg, #8b5cf6, #d946ef);
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

      <div className="min-h-screen relative overflow-hidden">
        {/* Background Elements */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className={`relative z-10 max-w-7xl mx-auto px-6 py-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

          <div className="flex flex-col xl:flex-row gap-12">
            {/* Main Content */}
            <div className="flex-1 space-y-20">

              {/* Hero Section */}
              <section className="text-center xl:text-left space-y-8">
                <div className="relative w-full h-64 md:h-96 rounded-3xl overflow-hidden mb-8 shadow-2xl">
                  <Image
                    src="/images/manifesto-hero.webp"
                    alt="Comunidade $MILAGRE Conectada"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-8">
                    <h1 className="text-4xl md:text-6xl font-montserrat font-bold leading-tight text-white drop-shadow-lg">
                      Nunca Estarás <br />
                      <span className="text-green-400">Sozinho</span>
                    </h1>
                  </div>
                </div>

                <p className="text-xl md:text-2xl font-inter leading-relaxed max-w-3xl mx-auto xl:mx-0" style={{ color: 'var(--text-secondary)' }}>
                  Um movimento de apoio mútuo genuíno construído sobre os princípios do código aberto,
                  da colaboração peer-to-peer e da crença fundamental de que{' '}
                  <span className="font-bold text-green-500">juntos somos mais fortes</span>.
                </p>

                <div className="glass-card p-8 rounded-3xl border-l-4 border-l-green-500">
                  <h3 className="font-montserrat font-bold text-xl mb-3" style={{ color: 'var(--text-primary)' }}>
                    Do Only Good Everyday
                  </h3>
                  <p className="font-inter leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    Inspirados pela filosofia das comunidades Linux e open source, onde o conhecimento é livre,
                    a colaboração é incentivada e o mérito vem da contribuição real, criamos o $MILAGRE como um
                    commons digital - um bem coletivo gerido pela comunidade, para a comunidade.
                  </p>
                </div>

                <div className="flex flex-wrap justify-center xl:justify-start gap-4 pt-4">
                  <a
                    href="https://discord.gg/xk4zrz8j"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-hover flex items-center gap-3 px-8 py-4 rounded-full font-inter font-semibold text-white shadow-lg"
                    style={{ background: '#5865F2' }}
                  >
                    <FontAwesomeIcon icon={faDiscord} className="w-6 h-6" />
                    <span>Entrar no Discord</span>
                  </a>

                  <a
                    href="https://t.me/+Bop_TVFc_mg3Njlh"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-hover flex items-center gap-3 px-8 py-4 rounded-full font-inter font-semibold text-white shadow-lg"
                    style={{ background: '#0088cc' }}
                  >
                    <FontAwesomeIcon icon={faTelegram} className="w-6 h-6" />
                    <span>Entrar no Telegram</span>
                  </a>
                </div>
              </section>

              {/* Nossa Visão */}
              <section id="nossa-visao" className="scroll-mt-32 space-y-8">
                <h2 className="text-3xl md:text-4xl font-montserrat font-bold" style={{ color: 'var(--text-primary)' }}>
                  Nossa Visão
                </h2>

                <div className="glass-card p-8 rounded-3xl">
                  <p className="text-lg font-inter leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>
                    Visionamos um ecossistema descentralizado onde tecnologia blockchain serve como infraestrutura
                    para conexão humana genuína, onde holders não são apenas investidores, mas membros ativos de
                    uma comunidade que se apoia mutuamente.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    {[
                      { title: 'Colaboração > Competição', desc: 'O valor real emerge quando pessoas compartilham conhecimento, recursos e experiências livremente', color: '#4caf50' },
                      { title: 'Transparência Total', desc: 'Abertura total sobre decisões, finanças e processos fortalece vínculos comunitários', color: '#2196f3' },
                      { title: 'Conhecimento Livre', desc: 'Educação e recursos devem estar acessíveis a todos, sem barreiras de entrada', color: '#ffc107' },
                      { title: 'Meritocracia', desc: 'Influência e reconhecimento vêm de ajudar ativamente, não apenas de acumular tokens', color: '#9c27b0' }
                    ].map((item, index) => (
                      <div key={index} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-2 h-8 rounded-full" style={{ backgroundColor: item.color }}></div>
                          <h3 className="font-montserrat font-bold" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
                        </div>
                        <p className="text-sm font-inter" style={{ color: 'var(--text-secondary)' }}>{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Nossa Missão */}
              <section id="nossa-missao" className="scroll-mt-32 space-y-8">
                <h2 className="text-3xl md:text-4xl font-montserrat font-bold" style={{ color: 'var(--text-primary)' }}>
                  Nossa Missão
                </h2>

                <div className="glass-card p-0 rounded-3xl overflow-hidden flex flex-col md:flex-row">
                  <div className="relative md:w-1/3 h-64 md:h-auto">
                    <Image
                      src="/images/Token-MILAGRE-1.webp"
                      alt="Missão $MILAGRE"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent"></div>
                  </div>

                  <div className="p-10 md:w-2/3">
                    <h3 className="text-2xl md:text-3xl font-montserrat font-bold mb-6 gradient-text">
                      Construir o Maior Ecossistema de Apoio Mútuo Descentralizado do Mundo
                    </h3>

                    <p className="text-lg font-inter mb-8" style={{ color: 'var(--text-secondary)' }}>
                      Nossa missão é criar e sustentar uma comunidade global na blockchain Solana onde cada membro tem acesso a:
                    </p>

                    <div className="space-y-4">
                      {[
                        { title: 'Prosperidade Compartilhada', desc: 'Orientação financeira e oportunidades de crescimento' },
                        { title: 'Sabedoria Coletiva', desc: 'Mentorias peer-to-peer e workshops educacionais' },
                        { title: 'Esperança Constante', desc: 'Suporte emocional e comunidade de apoio 24/7' }
                      ].map((item, index) => (
                        <div key={index} className="flex items-start gap-4">
                          <div className="mt-1 w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></div>
                          <div>
                            <h4 className="font-montserrat font-bold text-base" style={{ color: 'var(--text-primary)' }}>{item.title}</h4>
                            <p className="text-sm font-inter" style={{ color: 'var(--text-secondary)' }}>{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Valores Fundamentais */}
              <section id="valores-fundamentais" className="scroll-mt-32 space-y-8">
                <h2 className="text-3xl md:text-4xl font-montserrat font-bold" style={{ color: 'var(--text-primary)' }}>
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
                    <div key={index} className="glass-card p-8 rounded-3xl group hover:border-opacity-50 transition-all">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg" style={{ background: valor.gradient }}>
                          <span className="text-xl font-bold text-white">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-montserrat font-bold mb-3" style={{ color: 'var(--text-primary)' }}>{valor.title}</h3>
                          <p className="text-lg font-inter mb-6" style={{ color: 'var(--text-secondary)' }}>{valor.desc}</p>
                          <div className="grid sm:grid-cols-2 gap-3">
                            {valor.items.map((item, i) => (
                              <div key={i} className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                <span className="text-sm font-inter" style={{ color: 'var(--text-secondary)' }}>{item}</span>
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
                <h2 className="text-3xl md:text-4xl font-montserrat font-bold" style={{ color: 'var(--text-primary)' }}>
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
                    <div key={index} className="glass-card p-0 rounded-3xl flex flex-col h-full overflow-hidden border-t-4" style={{ borderTopColor: guardian.color }}>
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
                        <p className="text-sm text-center mb-6 font-inter opacity-80" style={{ color: 'var(--text-secondary)' }}>{guardian.subtitle}</p>

                        <div className="space-y-3 mt-auto">
                          {guardian.items.map((item, i) => (
                            <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-white/5">
                              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: guardian.color }}></div>
                              <span className="text-sm font-inter" style={{ color: 'var(--text-secondary)' }}>{item}</span>
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
                <h2 className="text-3xl md:text-4xl font-montserrat font-bold" style={{ color: 'var(--text-primary)' }}>
                  Princípios de Governança
                </h2>

                <div className="glass-card p-0 rounded-3xl overflow-hidden">
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
                    <div className="text-center p-4 rounded-2xl hover:bg-white/5 transition-colors">
                      <h3 className="font-montserrat font-bold mb-2 text-xl" style={{ color: 'var(--text-primary)' }}>Do-ocracia</h3>
                      <p className="text-sm font-inter" style={{ color: 'var(--text-secondary)' }}>Quem faz, decide. Influência baseada em contribuição ativa.</p>
                    </div>
                    <div className="text-center p-4 rounded-2xl hover:bg-white/5 transition-colors">
                      <h3 className="font-montserrat font-bold mb-2 text-xl" style={{ color: 'var(--text-primary)' }}>Votação Híbrida</h3>
                      <p className="text-sm font-inter" style={{ color: 'var(--text-secondary)' }}>Quadrática para decisões gerais, ponderada por reputação para técnicas.</p>
                    </div>
                    <div className="text-center p-4 rounded-2xl hover:bg-white/5 transition-colors">
                      <h3 className="font-montserrat font-bold mb-2 text-xl" style={{ color: 'var(--text-primary)' }}>Transparência</h3>
                      <p className="text-sm font-inter" style={{ color: 'var(--text-secondary)' }}>Discussão aberta, refinamento colaborativo e execução pública.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Roadmap */}
              <section id="roadmap" className="scroll-mt-32 space-y-8">
                <h2 className="text-3xl md:text-4xl font-montserrat font-bold" style={{ color: 'var(--text-primary)' }}>
                  Roadmap de Longo Prazo
                </h2>

                <div className="space-y-6">
                  {[
                    { year: '2025-2026', title: 'Fundação Sólida', items: ['Governança DAO completa', 'Biblioteca educacional', '10k holders ativos'], color: '#4caf50' },
                    { year: '2027-2028', title: 'Expansão Sustentável', items: ['SubDAOs especializadas', 'Marketplace de serviços', 'Staking com recompensas'], color: '#ffb703' },
                    { year: '2029-2030', title: 'Impacto Global', items: ['Referência Web3', 'Fundo de impacto social', 'Sustentabilidade total'], color: '#fb8500' }
                  ].map((phase, index) => (
                    <div key={index} className="glass-card p-8 rounded-3xl relative overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-2" style={{ backgroundColor: phase.color }}></div>
                      <div className="flex flex-col md:flex-row gap-6 items-start">
                        <div className="md:w-48 flex-shrink-0">
                          <span className="inline-block px-4 py-1 rounded-full text-sm font-bold mb-2" style={{ backgroundColor: `${phase.color}20`, color: phase.color }}>
                            {phase.year}
                          </span>
                          <h3 className="text-xl font-montserrat font-bold" style={{ color: 'var(--text-primary)' }}>{phase.title}</h3>
                        </div>
                        <div className="flex-1 grid sm:grid-cols-2 gap-3">
                          {phase.items.map((item, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: phase.color }}></div>
                              <span className="text-sm font-inter" style={{ color: 'var(--text-secondary)' }}>{item}</span>
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
                <h2 className="text-3xl md:text-4xl font-montserrat font-bold" style={{ color: 'var(--text-primary)' }}>
                  Compromisso Open Source
                </h2>

                <div className="glass-card p-8 rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="text-8xl text-white opacity-20">
                      <FontAwesomeIcon icon={faGithub} />
                    </div>
                    <div className="flex-1">
                      <p className="text-lg font-inter leading-relaxed mb-6 text-gray-300">
                        Inspirados pelos gigantes do open source como Linux, Mozilla e Wikipedia.
                        Todo smart contract, ferramenta e conteúdo educacional é livre.
                      </p>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 text-gray-300">
                          <div className="w-2 h-2 rounded-full bg-green-400"></div>
                          <span>Código 100% Auditável</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-300">
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
                <h2 className="text-4xl md:text-5xl font-montserrat font-bold mb-8" style={{ color: 'var(--text-primary)' }}>
                  Junte-se ao Movimento
                </h2>

                <p className="text-xl font-inter mb-12 max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                  O $MILAGRE não pertence a fundadores ou baleias - pertence a todos que contribuem para torná-lo real.
                </p>

                <div className="glass-card p-8 rounded-3xl max-w-3xl mx-auto mb-12 text-left">
                  <p className="font-montserrat font-bold text-lg mb-6 text-center" style={{ color: 'var(--text-primary)' }}>Se você acredita que:</p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {['Colaboração > Competição', 'Conhecimento deve ser livre', 'Tecnologia deve servir à humanidade', 'Ninguém deve caminhar sozinho'].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                        <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
                        <span className="font-inter" style={{ color: 'var(--text-secondary)' }}>{item}</span>
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
                    className="btn-hover flex items-center gap-3 px-10 py-5 rounded-full font-inter font-bold text-white shadow-xl text-lg"
                    style={{ background: '#5865F2' }}
                  >
                    <FontAwesomeIcon icon={faDiscord} className="w-6 h-6" />
                    <span>Entrar no Discord</span>
                  </a>

                  <a
                    href="https://t.me/+Bop_TVFc_mg3Njlh"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-hover flex items-center gap-3 px-10 py-5 rounded-full font-inter font-bold text-white shadow-xl text-lg"
                    style={{ background: '#0088cc' }}
                  >
                    <FontAwesomeIcon icon={faTelegram} className="w-6 h-6" />
                    <span>Entrar no Telegram</span>
                  </a>
                </div>
              </section>

            </div>

            {/* Sidebar Navigation (Desktop) */}
            <aside className="hidden xl:block w-72 flex-shrink-0">
              <div className="sticky top-32">
                <div className="glass-card rounded-2xl p-6">
                  <h3 className="text-xs font-bold uppercase tracking-widest mb-6" style={{ color: 'var(--text-tertiary)' }}>
                    Neste Manifesto
                  </h3>
                  <nav className="space-y-1 max-h-[calc(100vh-200px)] overflow-y-auto toc-scrollbar pr-2">
                    {tableOfContents.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className={`block w-full text-left text-sm py-3 px-4 rounded-xl transition-all duration-300 ${activeSection === item.id
                            ? 'font-semibold shadow-md transform translate-x-1'
                            : 'hover:bg-white/5 hover:translate-x-1'
                          }`}
                        style={{
                          backgroundColor: activeSection === item.id ? 'rgba(76, 175, 80, 0.15)' : 'transparent',
                          color: activeSection === item.id ? '#4caf50' : 'var(--text-secondary)',
                          borderLeft: activeSection === item.id ? '3px solid #4caf50' : '3px solid transparent'
                        }}
                      >
                        {item.text}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* Scroll to top button */}
        <button
          onClick={scrollToTop}
          className={`fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-500 ${showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
            }`}
          style={{
            background: 'linear-gradient(135deg, #4caf50, #2e7d32)',
            color: 'white'
          }}
          aria-label="Voltar ao topo"
        >
          <FontAwesomeIcon icon={faArrowUp} className="w-6 h-6" />
        </button>
      </div>
    </>
  );
}
