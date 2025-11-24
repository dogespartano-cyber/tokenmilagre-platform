'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Script from 'next/script';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHandshake,
  faBook,
  faLockOpen,
  faGlobe,
  faCode,
  faUsers,
  faStar,
  faBookOpen,
  faRocket,
  faShieldHalved,
  faLightbulb,
  faCheckCircle,
  faHeart,
  faBullseye,
  faUserShield,
  faLaptopCode,
  faCheckToSlot
} from '@fortawesome/free-solid-svg-icons';
import { faDiscord, faTelegram, faGithub, faTwitter } from '@fortawesome/free-brands-svg-icons';

export default function SobrePage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const coreValues = [
    {
      icon: faHandshake,
      title: 'Apoio Mútuo',
      description: 'Ninguém caminha sozinho em nossa comunidade. Cada membro é valorizado e apoiado em sua jornada.',
      bgGradient: 'linear-gradient(135deg, #22c55e, #16a34a)'
    },
    {
      icon: faBook,
      title: 'Educação Livre',
      description: 'Conhecimento acessível para todos. Sem barreiras, sem custos, apenas aprendizado colaborativo.',
      bgGradient: 'linear-gradient(135deg, #3b82f6, #2563eb)'
    },
    {
      icon: faLockOpen,
      title: 'Transparência',
      description: 'Decisões abertas e processos claros. Código open source, finanças públicas, governança comunitária.',
      bgGradient: 'linear-gradient(135deg, #eab308, #ca8a04)'
    },
    {
      icon: faGlobe,
      title: 'Impacto Real',
      description: 'Fazemos a diferença na vida das pessoas. Cada ação é pensada para gerar valor sustentável.',
      bgGradient: 'linear-gradient(135deg, #0d9488, #0f766e)'
    }
  ];

  const roles = [
    {
      title: 'Desenvolvimento',
      icon: faCode,
      description: 'Responsáveis pela plataforma, features e infraestrutura técnica.',
      activities: [
        'Desenvolvimento da plataforma Next.js',
        'Integração com blockchain Solana',
        'Sistema de artigos e educação',
        'Manutenção e deploy (Vercel)'
      ],
      bgGradient: 'linear-gradient(135deg, #3b82f6, #2563eb)'
    },
    {
      title: 'Conteúdo & Educação',
      icon: faBookOpen,
      description: 'Criadores de conteúdo educacional e artigos sobre blockchain.',
      activities: [
        'Artigos educacionais (iniciante → avançado)',
        'Tutoriais práticos',
        'Tradução de recursos',
        'Curadoria de conteúdo'
      ],
      bgGradient: 'linear-gradient(135deg, #0d9488, #0f766e)'
    },
    {
      title: 'Comunidade',
      icon: faUsers,
      description: 'Moderação, suporte e engajamento nos canais sociais.',
      activities: [
        'Moderação Discord/Telegram',
        'Suporte a membros',
        'Organização de eventos',
        'Onboarding de novos membros'
      ],
      bgGradient: 'linear-gradient(135deg, #22c55e, #16a34a)'
    },
    {
      title: 'Design & UX',
      icon: faStar,
      description: 'Design visual, experiência do usuário e identidade da marca.',
      activities: [
        'Design da interface',
        'Assets visuais',
        'Branding e identidade',
        'Acessibilidade'
      ],
      bgGradient: 'linear-gradient(135deg, #f59e0b, #d97706)'
    }
  ];

  const principles = [
    {
      title: 'Open Source',
      icon: faCode,
      description: 'Todo o código é público e auditável no GitHub. Qualquer pessoa pode verificar, contribuir ou fazer fork.'
    },
    {
      title: 'Descentralização',
      icon: faGlobe,
      description: 'Não há hierarquia rígida. Decisões importantes são discutidas com a comunidade.'
    },
    {
      title: 'Meritocracia',
      icon: faRocket,
      description: 'Contribuições são reconhecidas independentemente de quem você é. O que importa é o valor agregado.'
    },
    {
      title: 'Transparência',
      icon: faShieldHalved,
      description: 'Processos, decisões e finanças são documentados publicamente sempre que possível.'
    }
  ];

  return (
    <>
      {/* Schema.org JSON-LD */}
      <Script id="about-schema" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "$MILAGRE Community",
          "url": "https://tokenmilagre.xyz/sobre",
          "description": "Comunidade descentralizada de apoio mútuo na blockchain Solana",
          "foundingDate": "2024-10",
          "sameAs": [
            "https://x.com/TokenMilagre",
            "https://t.me/+Bop_TVFc_mg3Njlh",
            "https://discord.gg/xk4zrz8j"
          ]
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

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-montserrat font-bold leading-tight drop-shadow-lg" style={{ color: 'var(--text-primary)' }}>
              Somos uma comunidade global unida pela crença de que{' '}
              <span className="gradient-text">
                juntos somos mais fortes
              </span>
            </h1>

            <p className="text-xl md:text-2xl font-inter leading-relaxed max-w-3xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Uma rede descentralizada de apoio mútuo, educação livre e transformação real na blockchain Solana.
            </p>

            <div className="flex flex-wrap justify-center gap-6 pt-8">
              <a
                href="https://discord.gg/xk4zrz8j"
                target="_blank"
                rel="noopener noreferrer"
                className="neumorphic-button flex items-center gap-3 px-10 py-5 rounded-full font-inter font-bold hover:text-white hover:bg-[#5865F2] shadow-xl text-lg transition-colors" style={{ color: 'var(--text-primary)' }}
              >
                <FontAwesomeIcon icon={faDiscord} className="w-6 h-6" />
                <span>Discord</span>
              </a>

              <a
                href="https://t.me/+Bop_TVFc_mg3Njlh"
                target="_blank"
                rel="noopener noreferrer"
                className="neumorphic-button flex items-center gap-3 px-10 py-5 rounded-full font-inter font-bold hover:text-white hover:bg-[#0088cc] shadow-xl text-lg transition-colors" style={{ color: 'var(--text-primary)' }}
              >
                <FontAwesomeIcon icon={faTelegram} className="w-6 h-6" />
                <span>Telegram</span>
              </a>
            </div>
          </section>

          {/* Nossa Missão */}
          <section className="relative py-12">
            <div className="glass-panel p-8 md:p-12 rounded-3xl">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-5xl font-montserrat font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                  Nossa Missão
                </h2>
                <p className="text-lg md:text-xl font-inter max-w-3xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                  Construir uma comunidade onde ninguém caminha sozinho
                </p>
              </div>

              <div className="space-y-6 text-lg font-inter leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                <p>
                  A comunidade <strong className="gradient-text">$MILAGRE</strong> nasceu de uma visão simples:{' '}
                  <strong style={{ color: 'var(--text-primary)' }}>ninguém deveria caminhar sozinho</strong> em sua jornada de crescimento.
                </p>

                <p>
                  Somos uma rede descentralizada construída na blockchain Solana, onde tecnologia encontra humanidade.
                  Acreditamos que <strong style={{ color: 'var(--text-primary)' }}>colaboração supera competição</strong> e que{' '}
                  <strong style={{ color: 'var(--text-primary)' }}>conhecimento deve ser livre</strong>.
                </p>

                <div className="pl-6 border-l-4 border-green-500 py-4 rounded-r-lg bg-green-500/5">
                  <p className="font-semibold text-xl mb-2 text-gray-900 dark:text-[var(--text-primary)]">
                    Do Only Good Everyday
                  </p>
                  <p className="text-base">
                    Nosso compromisso é fazer apenas o bem, todos os dias, para cada membro da nossa comunidade.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Nossos Valores */}
          <section className="relative py-12">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-montserrat font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                Nossos Valores
              </h2>
              <p className="text-lg md:text-xl font-inter max-w-3xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                Quatro pilares que guiam nossa comunidade
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {coreValues.map((value, index) => (
                <div key={index} className="neumorphic-card p-8 hover:scale-105 transition-transform duration-300">
                  {/* Icon */}
                  <div
                    className="inline-flex w-16 h-16 rounded-2xl items-center justify-center mb-6 shadow-md neumorphic-button"
                    style={{ background: value.bgGradient }}
                  >
                    <FontAwesomeIcon icon={value.icon} className="w-8 h-8 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-montserrat font-bold mb-4 text-gray-900 dark:text-[var(--text-primary)]">
                    {value.title}
                  </h3>

                  {/* Description */}
                  <p className="font-inter leading-relaxed text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Nossa Jornada */}
          <section className="relative py-12">
            <div className="glass-panel p-8 md:p-12 rounded-3xl">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-montserrat font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                  Nossa Jornada
                </h2>
                <p className="text-lg md:text-xl font-inter max-w-3xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                  De uma ideia simples a uma comunidade global
                </p>
              </div>

              <div className="relative">
                {/* Timeline line - NO PURPLE */}
                <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 transform md:-translate-x-1/2 bg-gradient-to-b from-green-500 via-teal-600 to-blue-600"></div>

                <div className="space-y-16">
                  {[
                    {
                      title: 'Fundação da Comunidade',
                      description: 'Início do movimento $MILAGRE com os primeiros holders',
                      icon: faBullseye,
                      bgGradient: 'linear-gradient(135deg, #22c55e, #16a34a)'
                    },
                    {
                      title: 'Lançamento do Token',
                      description: 'Token SPL na blockchain Solana via Pump.fun',
                      icon: faRocket,
                      bgGradient: 'linear-gradient(135deg, #0d9488, #0f766e)'
                    },
                    {
                      title: 'Primeiros Guardiões',
                      description: 'Estabelecimento dos três pilares da comunidade',
                      icon: faUserShield,
                      bgGradient: 'linear-gradient(135deg, #3b82f6, #2563eb)'
                    },
                    {
                      title: 'Plataforma Educacional',
                      description: 'Lançamento do hub de notícias e recursos educacionais',
                      icon: faBookOpen,
                      bgGradient: 'linear-gradient(135deg, #eab308, #ca8a04)'
                    },
                    {
                      title: 'Crescimento Contínuo',
                      description: 'Desenvolvimento da comunidade e seus projetos',
                      icon: faStar,
                      bgGradient: 'linear-gradient(135deg, #f59e0b, #d97706)'
                    }
                  ].map((phase, index) => (
                    <div key={index} className="relative pl-24 md:pl-0">
                      {/* Icon */}
                      <div
                        className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl z-10 neumorphic-button"
                        style={{ background: phase.bgGradient }}
                      >
                        <FontAwesomeIcon icon={phase.icon} className="w-8 h-8 text-white" />
                      </div>

                      {/* Content */}
                      <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:ml-auto md:pl-12' : 'md:pr-12'}`}>
                        <div className="neumorphic-card p-8">
                          <h3 className="text-xl font-montserrat font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                            {phase.title}
                          </h3>
                          <p className="font-inter leading-relaxed text-sm" style={{ color: 'var(--text-secondary)' }}>
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

          {/* Como a Comunidade se Organiza */}
          <section className="relative py-12">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-montserrat font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                Como a Comunidade se Organiza
              </h2>
              <p className="text-lg md:text-xl font-inter max-w-3xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                Uma estrutura descentralizada e aberta
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {roles.map((role, index) => (
                <div key={index} className="neumorphic-card p-8">
                  {/* Icon */}
                  <div
                    className="inline-flex w-16 h-16 rounded-2xl items-center justify-center mb-6 shadow-md neumorphic-button"
                    style={{ background: role.bgGradient }}
                  >
                    <FontAwesomeIcon icon={role.icon} className="w-8 h-8 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-montserrat font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                    {role.title}
                  </h3>

                  {/* Description */}
                  <p className="font-inter mb-6" style={{ color: 'var(--text-secondary)' }}>
                    {role.description}
                  </p>

                  {/* Activities */}
                  <div className="space-y-2">
                    {role.activities.map((activity, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        <span className="text-sm font-inter" style={{ color: 'var(--text-secondary)' }}>
                          {activity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Callout */}
            <div className="glass-panel p-8 md:p-12 border-l-4 border-green-500">
              <div className="flex items-start gap-6">
                <div className="text-5xl">🤝</div>
                <div className="flex-1">
                  <h3 className="text-2xl font-montserrat font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                    Todos Podem Contribuir
                  </h3>
                  <p className="text-lg font-inter leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    Não há "processo de contratação". Se você tem uma habilidade útil e quer contribuir,
                    simplesmente comece. Abra um PR no GitHub, escreva um artigo, ajude no Discord.
                    <strong className="text-green-500"> A comunidade reconhece quem agrega valor.</strong>
                  </p>
                </div>
              </div>
            </div>
          </section>



          {/* Nossos Princípios */}
          <section className="relative py-12">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-montserrat font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                <FontAwesomeIcon icon={faLightbulb} className="mr-3 text-amber-400" />
                Nossos Princípios de Governança
              </h2>
              <p className="text-lg md:text-xl font-inter max-w-3xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                Como tomamos decisões e conduzimos o projeto
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {principles.map((principle, index) => (
                <div key={index} className="neumorphic-card p-8">
                  <div className="flex items-start gap-6">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg neumorphic-button" style={{ background: 'linear-gradient(135deg, #0d9488, #2563eb)' }}>
                      <FontAwesomeIcon icon={principle.icon} className="text-2xl text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-montserrat font-bold mb-3 text-gray-900 dark:text-[var(--text-primary)]">
                        {principle.title}
                      </h3>
                      <p className="font-inter leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        {principle.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Onde Nos Encontrar */}
          <section className="relative py-12">
            <div className="glass-panel p-8 md:p-12 rounded-3xl">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-montserrat font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                  Onde Nos Encontrar
                </h2>
                <p className="text-lg md:text-xl font-inter max-w-3xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                  Junte-se à nossa comunidade global
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    name: 'GitHub',
                    icon: faGithub,
                    url: 'https://github.com/dogespartano-cyber/tokenmilagre-platform',
                    description: 'Código open source - 100% auditável',
                    color: '#333'
                  },
                  {
                    name: 'Discord',
                    icon: faDiscord,
                    url: 'https://discord.gg/xk4zrz8j',
                    description: 'Servidor da comunidade',
                    color: '#5865F2'
                  },
                  {
                    name: 'Telegram',
                    icon: faTelegram,
                    url: 'https://t.me/+Bop_TVFc_mg3Njlh',
                    description: 'Canal oficial da comunidade',
                    color: '#0088cc'
                  },
                  {
                    name: 'Twitter/X',
                    icon: faTwitter,
                    url: 'https://x.com/TokenMilagre',
                    description: 'Updates e anúncios',
                    color: '#1DA1F2'
                  }
                ].map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group neumorphic-card p-8 flex items-center gap-6 hover:scale-105 transition-transform duration-300"
                  >
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center neumorphic-button" style={{
                      backgroundColor: link.color,
                      color: 'white'
                    }}>
                      <FontAwesomeIcon icon={link.icon} className="text-3xl" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-montserrat font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                        {link.name}
                        <span className="text-sm opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                      </h3>
                      <p className="font-inter" style={{ color: 'var(--text-secondary)' }}>
                        {link.description}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Final - NO BACKGROUND */}
          <section className="relative py-24 mt-12">
            <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
              <h2 className="text-4xl md:text-6xl font-montserrat font-bold mb-8" style={{ color: 'var(--text-primary)' }}>
                Faça Parte da Família $MILAGRE
              </h2>

              <p className="text-xl md:text-2xl mb-16 max-w-3xl mx-auto font-inter" style={{ color: 'var(--text-secondary)' }}>
                Junte-se a uma comunidade global de pessoas que acreditam que juntos podemos criar milagres.
              </p>

              <p className="text-3xl md:text-4xl font-montserrat font-bold mb-12">
                <span className="gradient-text">
                  Nunca estarás sozinho. ❤️
                </span>
              </p>
            </div>
          </section>

        </div>
      </div>
    </>
  );
}
