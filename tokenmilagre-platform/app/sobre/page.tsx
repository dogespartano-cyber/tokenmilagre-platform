'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Script from 'next/script';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShieldHalved,
  faBookOpen,
  faUsers,
  faCode,
  faHeart,
  faHandshake,
  faCheckCircle,
  faExclamationTriangle,
  faGlobe,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { faDiscord, faTelegram, faGithub, faTwitter } from '@fortawesome/free-brands-svg-icons';

export default function SobrePage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <>
      <Script id="about-schema" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "$MILAGRE",
          "url": "https://tokenmilagre.xyz/sobre",
          "description": "$MILAGRE: Um movimento de educação cripto e proteção contra golpes. Transparência radical e comunidade blindada.",
          "logo": "https://tokenmilagre.xyz/images/TOKEN-MILAGRE-Hero.webp",
          "sameAs": [
            "https://x.com/TokenMilagre",
            "https://t.me/+Bop_TVFc_mg3Njlh"
          ]
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
          <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-teal-500/20 rounded-full blur-[120px] animate-pulse-slow"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-[40%] left-[40%] w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '4s' }}></div>
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
              A Verdade Sobre <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500">
                O Nosso Movimento
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed font-light">
              Não somos apenas mais um token. Somos a resposta contra a opacidade do mercado.
            </p>
          </section>

          {/* Manifesto / A Verdade */}
          <section className="relative mb-32">
            <div className="glass p-8 md:p-16 rounded-[2.5rem] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-teal-500/10 to-transparent rounded-bl-full -mr-16 -mt-16 transition-transform duration-700 group-hover:scale-110"></div>

              <div className="relative z-10 space-y-8 text-center md:text-left">
                <div className="md:flex items-center gap-12">
                  <div className="flex-1 space-y-6">
                    <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)]">
                      O que NÃO somos
                    </h2>
                    <ul className="space-y-3 text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed">
                      <li className="flex items-center gap-3">
                        <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500/70" />
                        <span>Não somos uma "Gema" de 100x.</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500/70" />
                        <span>Não temos "Insiders" ou "Whales".</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500/70" />
                        <span>Não vendemos sonhos impossíveis.</span>
                      </li>
                    </ul>
                  </div>
                  <div className="w-px h-48 bg-gradient-to-b from-transparent via-[var(--border-medium)] to-transparent hidden md:block"></div>
                  <div className="flex-1 space-y-6">
                    <h2 className="text-3xl md:text-4xl font-bold text-teal-500">
                      O que SOMOS
                    </h2>
                    <p className="text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed">
                      Somos um <strong>escudo</strong>. Um projeto nascido da frustração de ver pessoas comuns perderem dinheiro.
                      Somos a <strong>educação</strong> que ninguém quer te dar de graça.
                      Somos a <strong>transparência</strong> que falta na blockchain.
                    </p>
                  </div>
                </div>

                <div className="pt-8 border-t border-[var(--border-light)] text-center">
                  <p className="text-xl md:text-2xl font-medium text-[var(--text-primary)] italic">
                    "Em um mundo de promessas vazias, a verdade é o ativo mais valioso."
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* O Que Fazemos (Grid) */}
          <section className="mb-32">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[var(--text-primary)]">
                Nossa Missão
              </h2>
              <p className="text-xl text-[var(--text-secondary)]">Três pilares inegociáveis.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: faBookOpen,
                  title: 'Educação Libertadora',
                  description: 'Conhecimento não deve ser caro. Nossos guias e tutoriais transformam iniciantes em investidores conscientes e protegidos.',
                  color: 'text-blue-500',
                  bg: 'bg-blue-500/10'
                },
                {
                  icon: faShieldHalved,
                  title: 'Segurança Ativa',
                  description: 'Monitoramos e expomos golpes. Ensinamos você a ler contratos, verificar liquidez e identificar red flags antes que seja tarde.',
                  color: 'text-green-500',
                  bg: 'bg-green-500/10'
                },
                {
                  icon: faUsers,
                  title: 'Comunidade Real',
                  description: 'Sem bots. Sem spam. Apenas pessoas reais se ajudando a navegar no ecossistema Solana com segurança e ética.',
                  color: 'text-teal-500',
                  bg: 'bg-teal-500/10'
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

          {/* Split Sections */}
          <div className="space-y-24 mb-32">
            {/* Por Que Milagre */}
            <section className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <div className="glass p-10 rounded-3xl relative overflow-hidden">
                  <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-teal-500/20 rounded-full blur-3xl"></div>
                  <h3 className="text-3xl font-bold mb-6 text-[var(--text-primary)]">Por Que "Milagre"?</h3>
                  <div className="space-y-4 text-[var(--text-secondary)] text-lg">
                    <p>Muitos esperam um milagre financeiro para mudar de vida.</p>
                    <p className="font-semibold text-teal-500">Nós acreditamos que o verdadeiro milagre é a honestidade.</p>
                    <p>Num mercado "selvagem", encontrar um porto seguro onde a intenção é genuinamente ajudar... isso sim é um milagre.</p>
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2 text-center md:text-left pl-0 md:pl-12">
                <h2 className="text-4xl md:text-6xl font-extrabold text-[var(--text-primary)] mb-6">
                  Transparência <br /> Radical
                </h2>
                <p className="text-xl text-[var(--text-secondary)]">
                  Nossa única moeda de troca é a confiança. Tudo é aberto, auditável e feito para a comunidade.
                </p>
              </div>
            </section>

            {/* O Token */}
            <section className="grid md:grid-cols-2 gap-12 items-center">
              <div className="text-center md:text-right pr-0 md:pr-12">
                <h2 className="text-4xl md:text-6xl font-extrabold text-[var(--text-primary)] mb-6">
                  O Token <br /> <span className="text-amber-500">$MILAGRE</span>
                </h2>
                <p className="text-xl text-[var(--text-secondary)]">
                  Um símbolo de pertencimento a este movimento.
                </p>
              </div>
              <div>
                <div className="glass p-10 rounded-3xl border-l-4 border-amber-500">
                  <div className="space-y-6 text-[var(--text-secondary)] text-lg">
                    <p>
                      Sim, existe um token. <strong className="text-[var(--text-primary)]">Mas ele é um meio, não o fim.</strong>
                    </p>
                    <p>
                      Ele serve para identificar quem apoia a causa da educação financeira e proteção contra golpes.
                    </p>
                    <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-xl flex gap-4 items-start">
                      <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500 text-2xl mt-1" />
                      <div>
                        <p className="font-bold text-red-500 mb-1">Aviso Importante</p>
                        <p className="text-sm">Não compre esperando enriquecimento rápido. Compre se você acredita na missão.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Sustentabilidade & Open Source */}
          <section className="mb-32">
            <div className="glass p-12 rounded-[3rem] relative overflow-hidden">

              <div className="grid md:grid-cols-2 gap-16">
                <div>
                  <h3 className="text-3xl font-bold mb-8 text-[var(--text-primary)]">Sustentabilidade do Projeto</h3>
                  <ul className="space-y-4">
                    {[
                      'Doações da comunidade',
                      'Links afiliados éticos (exchanges seguras)',
                      'Parcerias transparentes',
                      'Produtos educacionais avançados'
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-4 text-[var(--text-secondary)]">
                        <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-3xl font-bold mb-8 text-[var(--text-primary)] flex items-center gap-3">
                    <FontAwesomeIcon icon={faCode} className="text-blue-500" />
                    Open Source
                  </h3>
                  <p className="text-[var(--text-secondary)] mb-8 text-lg">
                    A confiança se conquista com código, não com palavras. Nossa plataforma é 100% código aberto.
                  </p>
                  <a
                    href="https://github.com/dogespartano-cyber/tokenmilagre-platform"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-[var(--bg-primary)] hover:bg-[var(--bg-tertiary)] text-[var(--text-primary)] font-bold transition-all border border-[var(--border-medium)] hover:border-[var(--border-focus)] shadow-sm hover:shadow-md"
                  >
                    <FontAwesomeIcon icon={faGithub} className="text-xl" />
                    <span>Ver no GitHub</span>
                    <FontAwesomeIcon icon={faArrowRight} className="text-sm opacity-50" />
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Community CTA */}
          <section className="text-center pb-12">
            <h2 className="text-4xl md:text-6xl font-bold mb-12 text-[var(--text-primary)]">
              Junte-se ao Movimento
            </h2>

            <div className="flex flex-wrap justify-center gap-6">
              <a
                href="https://discord.gg/xk4zrz8j"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative px-10 py-5 rounded-full bg-[#5865F2] text-white font-bold text-lg overflow-hidden transition-all hover:scale-105 hover:shadow-xl hover:shadow-[#5865F2]/30"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <div className="relative flex items-center gap-3">
                  <FontAwesomeIcon icon={faDiscord} className="text-2xl" />
                  <span>Discord</span>
                </div>
              </a>

              <a
                href="https://t.me/+Bop_TVFc_mg3Njlh"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative px-10 py-5 rounded-full bg-[#0088cc] text-white font-bold text-lg overflow-hidden transition-all hover:scale-105 hover:shadow-xl hover:shadow-[#0088cc]/30"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <div className="relative flex items-center gap-3">
                  <FontAwesomeIcon icon={faTelegram} className="text-2xl" />
                  <span>Telegram</span>
                </div>
              </a>
            </div>
          </section>

        </div>
      </div>
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
