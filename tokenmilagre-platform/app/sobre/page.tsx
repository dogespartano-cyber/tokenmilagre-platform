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
      bgGradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
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
      bgGradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
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

        .card-hover {
          transition: all 0.4s ease;
        }

        .card-hover:hover {
          transform: translateY(-8px);
          box-shadow: var(--shadow-xl);
        }

        .btn-hover-effect {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .btn-hover-effect:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
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
      <section className="relative min-h-screen flex items-center justify-center" style={{ backgroundColor: 'transparent' }}>
        <div className={`max-w-6xl mx-auto px-6 py-20 text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

          {/* Animated Logo */}
          <div className="flex justify-center mb-12">
            <div className="relative w-40 h-40 md:w-48 md:h-48">
              {/* Animated rings */}
              <div className="absolute inset-0 animate-spin-slow">
                <div className="absolute inset-0 rounded-full border-2 border-dashed opacity-30 border-green-500"></div>
              </div>
              <div className="absolute inset-3 animate-spin-reverse">
                <div className="absolute inset-0 rounded-full border-2 border-dashed opacity-30 border-purple-500"></div>
              </div>

              {/* Glow effect */}
              <div className="absolute inset-0 blur-2xl animate-pulse opacity-40 bg-gradient-to-r from-green-500 to-purple-600"></div>

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

          {/* Hero Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-montserrat font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
            Somos uma comunidade global unida pela crença de que{' '}
            <span className="bg-gradient-to-r from-green-500 to-purple-600 bg-clip-text text-transparent">
              juntos somos mais fortes
            </span>
          </h1>

          <p className="text-lg md:text-xl font-inter mb-12 max-w-3xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Uma rede descentralizada de apoio mútuo, educação livre e transformação real na blockchain Solana.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://discord.gg/xk4zrz8j"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-hover-effect px-10 py-5 rounded-full font-inter font-semibold text-lg text-white shadow-lg flex items-center gap-3"
              style={{ backgroundColor: '#5865F2' }}
            >
              <FontAwesomeIcon icon={faDiscord} className="w-5 h-5" />
              <span>Discord</span>
            </a>

            <a
              href="https://t.me/+Bop_TVFc_mg3Njlh"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-hover-effect px-10 py-5 rounded-full font-inter font-semibold text-lg shadow-lg border-2 border-teal-600 text-teal-600 bg-transparent"
            >
              <FontAwesomeIcon icon={faTelegram} className="w-5 h-5 mr-2" />
              Telegram
            </a>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 flex flex-wrap justify-center gap-8 text-sm font-inter" style={{ color: 'var(--text-secondary)' }}>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faCheckCircle} className="w-5 h-5 text-green-500" />
              <span>Open Source</span>
            </div>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faCheckCircle} className="w-5 h-5 text-green-500" />
              <span>Descentralizado</span>
            </div>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faCheckCircle} className="w-5 h-5 text-green-500" />
              <span>100% Transparente</span>
            </div>
          </div>
        </div>
      </section>

      {/* Nossa Missão */}
      <section className="relative py-24" style={{ backgroundColor: 'transparent' }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-montserrat font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              Nossa Missão
            </h2>
            <p className="text-lg md:text-xl font-inter max-w-3xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Construir uma comunidade onde ninguém caminha sozinho
            </p>
          </div>

          <div className="rounded-3xl p-8 md:p-12 border" style={{
            backgroundColor: 'var(--bg-elevated)',
            borderColor: 'var(--border-light)',
            boxShadow: 'var(--shadow-xl)'
          }}>
            <div className="space-y-6 text-lg font-inter leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              <p>
                A comunidade <strong className="bg-gradient-to-r from-teal-600 to-purple-600 bg-clip-text text-transparent">$MILAGRE</strong> nasceu de uma visão simples:{' '}
                <strong style={{ color: 'var(--text-primary)' }}>ninguém deveria caminhar sozinho</strong> em sua jornada de crescimento.
              </p>

              <p>
                Somos uma rede descentralizada construída na blockchain Solana, onde tecnologia encontra humanidade.
                Acreditamos que <strong style={{ color: 'var(--text-primary)' }}>colaboração supera competição</strong> e que{' '}
                <strong style={{ color: 'var(--text-primary)' }}>conhecimento deve ser livre</strong>.
              </p>

              <div className="pl-6 border-l-4 py-4 rounded-r-lg" style={{
                borderColor: 'var(--brand-primary)',
                backgroundColor: 'var(--bg-secondary)'
              }}>
                <p className="font-semibold text-xl mb-2" style={{ color: 'var(--text-primary)' }}>
                  Do Only Good Everyday
                </p>
                <p className="text-base">
                  Nosso compromisso é fazer apenas o bem, todos os dias, para cada membro da nossa comunidade.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nossos Valores */}
      <section className="relative py-24" style={{ backgroundColor: 'transparent' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-montserrat font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              Nossos Valores
            </h2>
            <p className="text-lg md:text-xl font-inter max-w-3xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Quatro pilares que guiam nossa comunidade
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreValues.map((value, index) => (
              <div key={index} className="card-hover rounded-3xl p-8 border" style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border-light)',
                boxShadow: 'var(--shadow-lg)'
              }}>
                {/* Icon */}
                <div
                  className="inline-flex w-16 h-16 rounded-2xl items-center justify-center mb-6 shadow-md"
                  style={{ background: value.bgGradient }}
                >
                  <FontAwesomeIcon icon={value.icon} className="w-8 h-8 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-montserrat font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                  {value.title}
                </h3>

                {/* Description */}
                <p className="font-inter leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nossa Jornada */}
      <section className="relative py-24" style={{ backgroundColor: 'transparent' }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-montserrat font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              Nossa Jornada
            </h2>
            <p className="text-lg md:text-xl font-inter max-w-3xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              De uma ideia simples a uma comunidade global
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 transform md:-translate-x-1/2 bg-gradient-to-b from-green-500 via-purple-600 to-teal-600"></div>

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
                  bgGradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
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
                    className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl z-10"
                    style={{ background: phase.bgGradient }}
                  >
                    <FontAwesomeIcon icon={phase.icon} className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:ml-auto md:pl-12' : 'md:pr-12'}`}>
                    <div className="rounded-2xl p-8 border card-hover" style={{
                      backgroundColor: 'var(--bg-elevated)',
                      borderColor: 'var(--border-light)',
                      boxShadow: 'var(--shadow-lg)'
                    }}>
                      <h3 className="text-2xl font-montserrat font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                        {phase.title}
                      </h3>
                      <p className="font-inter leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
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
      <section className="relative py-24" style={{ backgroundColor: 'transparent' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-montserrat font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              Como a Comunidade se Organiza
            </h2>
            <p className="text-lg md:text-xl font-inter max-w-3xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Uma estrutura descentralizada e aberta
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {roles.map((role, index) => (
              <div key={index} className="card-hover rounded-3xl p-8 border" style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border-light)',
                boxShadow: 'var(--shadow-lg)'
              }}>
                {/* Icon */}
                <div
                  className="inline-flex w-16 h-16 rounded-2xl items-center justify-center mb-6 shadow-md"
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
          <div className="rounded-3xl p-8 md:p-12 border-2 border-green-500" style={{
            backgroundColor: 'var(--bg-elevated)',
            boxShadow: 'var(--shadow-xl)'
          }}>
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
        </div>
      </section>

      {/* Por Que Somos Anônimos */}
      <section className="relative py-24" style={{ backgroundColor: 'transparent' }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-montserrat font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              <FontAwesomeIcon icon={faShieldHalved} className="mr-3 text-purple-600" />
              Por Que Muitos Membros São Anônimos?
            </h2>
          </div>

          <div className="rounded-3xl p-8 md:p-12 border-2 border-purple-600" style={{
            backgroundColor: 'var(--bg-elevated)',
            boxShadow: 'var(--shadow-xl)'
          }}>
            <p className="text-lg md:text-xl font-inter leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>
              No espaço cripto, <strong style={{ color: 'var(--text-primary)' }}>anonimato é comum e legítimo</strong>.
              Muitos dos maiores projetos foram criados por desenvolvedores anônimos (Bitcoin, por exemplo).
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Segurança Pessoal',
                  description: 'Evita exposição desnecessária a riscos de segurança (doxxing, ataques direcionados).',
                  icon: faShieldHalved
                },
                {
                  title: 'Foco no Projeto',
                  description: 'O que importa é a qualidade do código e das contribuições, não quem você é.',
                  icon: faCode
                },
                {
                  title: 'Descentralização Real',
                  description: 'Sem "CEO" ou "fundador famoso", o projeto pertence verdadeiramente à comunidade.',
                  icon: faGlobe
                }
              ].map((item, index) => (
                <div key={index} className="p-6 rounded-2xl border" style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderColor: 'var(--border-light)'
                }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-r from-purple-600 to-teal-600">
                    <FontAwesomeIcon icon={item.icon} className="text-white" />
                  </div>
                  <h3 className="font-montserrat font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                    {item.title}
                  </h3>
                  <p className="text-sm font-inter" style={{ color: 'var(--text-secondary)' }}>
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-purple-600/10 to-teal-600/10 border border-purple-600/30">
              <p className="font-inter">
                <strong className="text-purple-600">💡 Mas você pode verificar tudo:</strong>{' '}
                <span style={{ color: 'var(--text-secondary)' }}>
                  Todo o código está no GitHub. Todas as contribuições são públicas. Você não precisa confiar
                  em ninguém - apenas audite o código.
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Nossos Princípios */}
      <section className="relative py-24" style={{ backgroundColor: 'transparent' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-montserrat font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              <FontAwesomeIcon icon={faLightbulb} className="mr-3 text-amber-400" />
              Nossos Princípios de Governança
            </h2>
            <p className="text-lg md:text-xl font-inter max-w-3xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Como tomamos decisões e conduzimos o projeto
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {principles.map((principle, index) => (
              <div key={index} className="card-hover rounded-3xl p-8 border" style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border-light)',
                boxShadow: 'var(--shadow-lg)'
              }}>
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-teal-600 to-purple-600">
                    <FontAwesomeIcon icon={principle.icon} className="text-2xl text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-montserrat font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
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
        </div>
      </section>

      {/* Como Contribuir */}
      <section className="relative py-24" style={{ backgroundColor: 'transparent' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-montserrat font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              Como Contribuir
            </h2>
            <p className="text-lg md:text-xl font-inter max-w-3xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              O $MILAGRE é construído pela comunidade, para a comunidade
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: faBook,
                title: 'Educar',
                description: 'Crie tutoriais, faça mentorias e compartilhe conhecimento',
                color: '#3b82f6'
              },
              {
                icon: faLaptopCode,
                title: 'Desenvolver',
                description: 'Contribua com código open source e melhorias',
                color: '#8b5cf6'
              },
              {
                icon: faCheckToSlot,
                title: 'Governar',
                description: 'Participe das decisões da comunidade',
                color: '#eab308'
              },
              {
                icon: faHandshake,
                title: 'Apoiar',
                description: 'Dê suporte e fortaleça a comunidade',
                color: '#22c55e'
              }
            ].map((item, index) => (
              <div key={index} className="card-hover rounded-2xl p-6 border" style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border-light)'
              }}>
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4" style={{
                  backgroundColor: `${item.color}15`,
                  border: `2px solid ${item.color}30`
                }}>
                  <FontAwesomeIcon icon={item.icon} className="text-2xl" style={{ color: item.color }} />
                </div>
                <h3 className="text-lg font-montserrat font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                  {item.title}
                </h3>
                <p className="text-sm font-inter" style={{ color: 'var(--text-secondary)' }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Onde Nos Encontrar */}
      <section className="relative py-24" style={{ backgroundColor: 'transparent' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-montserrat font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
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
                className="group card-hover rounded-2xl p-8 border-2"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderColor: 'var(--border-light)'
                }}
              >
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{
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
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="relative py-32 overflow-hidden bg-gradient-to-br from-green-900 via-purple-900 to-teal-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-montserrat font-bold text-white mb-8">
            Faça Parte da Família $MILAGRE
          </h2>

          <p className="text-xl md:text-2xl text-white/90 mb-16 max-w-3xl mx-auto font-inter">
            Junte-se a uma comunidade global de pessoas que acreditam que juntos podemos criar milagres.
          </p>

          <p className="text-3xl md:text-4xl font-montserrat font-bold mb-12">
            <span className="bg-gradient-to-r from-green-400 to-purple-400 bg-clip-text text-transparent">
              Nunca estarás sozinho. ❤️
            </span>
          </p>

          {/* Social Links */}
          <div className="flex flex-wrap items-center justify-center gap-6">
            <a
              href="https://discord.gg/xk4zrz8j"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-hover-effect flex items-center gap-3 px-10 py-5 bg-white rounded-full font-inter font-semibold text-lg shadow-xl text-purple-700"
            >
              <FontAwesomeIcon icon={faDiscord} className="w-6 h-6" />
              <span>Entrar no Discord</span>
            </a>

            <a
              href="https://t.me/+Bop_TVFc_mg3Njlh"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-hover-effect flex items-center gap-3 px-10 py-5 rounded-full font-inter font-semibold text-lg shadow-xl text-white border-2 border-white bg-transparent"
            >
              <FontAwesomeIcon icon={faTelegram} className="w-6 h-6" />
              <span>Entrar no Telegram</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
