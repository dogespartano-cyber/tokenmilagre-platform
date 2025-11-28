'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Script from 'next/script';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShieldHalved,
  faBookOpen,
  faUsers,
  faRocket,
  faCode,
  faHeart,
  faHandshake,
  faCheckCircle,
  faExclamationTriangle,
  faLightbulb,
  faGlobe
} from '@fortawesome/free-solid-svg-icons';
import { faDiscord, faTelegram, faGithub, faTwitter } from '@fortawesome/free-brands-svg-icons';

export default function SobrePage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <>
      {/* Schema.org JSON-LD */}
      <Script id="about-schema" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Token Milagre",
          "url": "https://tokenmilagre.xyz/sobre",
          "description": "Educação cripto - Proteção contra golpes - Comunidade de apoio mútuo",
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

        /* Gradient Text */
        .gradient-text {
          background: linear-gradient(135deg, #0d9488, #14b8a6, #5eead4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      <div className="min-h-screen relative overflow-hidden bg-[var(--bg-secondary)] transition-colors duration-300">
        {/* Background Orbs */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-green-400/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-400/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-[40%] left-[40%] w-[400px] h-[400px] bg-teal-400/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className={`relative z-10 max-w-7xl mx-auto px-6 py-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

          {/* Hero Section */}
          <section className="text-center space-y-8 mb-24">
            {/* Animated Logo */}
            <div className="flex justify-center mb-8 mt-12">
              <div className="relative w-60 h-60 md:w-72 md:h-72 animate-float">
                <div className="absolute inset-0 blur-2xl animate-pulse opacity-20" style={{
                  background: 'linear-gradient(135deg, #93c5fd, #bfdbfe, #dbeafe)'
                }}></div>
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
              A Verdade Sobre{' '}
              <span className="gradient-text">
                Este Projeto
              </span>
            </h1>
          </section>

          {/* A Verdade */}
          <section className="relative py-12 mb-16">
            <div className="glass-panel p-8 md:p-12 rounded-3xl">
              <div className="space-y-6 text-lg font-inter leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                <p className="text-xl md:text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                  O Token Milagre não é uma startup com equipe de 50 pessoas. Não temos investidores de venture capital.
                  Não prometemos retornos de 1000x.
                </p>

                <p className="text-xl md:text-2xl font-bold text-green-500">
                  Somos um projeto de uma pessoa — um desenvolvedor que já viu gente demais
                  perder dinheiro em golpes cripto e decidiu fazer algo a respeito.
                </p>

                <p>
                  Este projeto existe porque acredito que educação financeira descentralizada não deveria custar nada,
                  e que <strong style={{ color: 'var(--text-primary)' }}>honestidade é mais valiosa que hype</strong>.
                </p>
              </div>
            </div>
          </section>

          {/* O Que Fazemos */}
          <section className="relative py-12 mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-montserrat font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                O Que Fazemos (De Verdade)
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: faBookOpen,
                  title: 'Educação Cripto',
                  description: 'Recursos definitivos em português sobre blockchain e criptomoedas. Tutoriais sobre wallets, tokens, DeFi, análise de projetos — tudo verificado, tudo gratuito.',
                  gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)'
                },
                {
                  icon: faShieldHalved,
                  title: 'Proteção Contra Golpes',
                  description: 'Identificamos padrões suspeitos, alertamos sobre projetos de risco e ensinamos como reconhecer red flags antes de investir. Nosso objetivo é que você nunca mais caia em rug pull.',
                  gradient: 'linear-gradient(135deg, #22c55e, #16a34a)'
                },
                {
                  icon: faUsers,
                  title: 'Comunidade de Apoio Mútuo',
                  description: 'Um espaço no Discord e Telegram onde iniciantes podem fazer perguntas sem julgamento, e onde membros mais experientes ajudam voluntariamente. Sem elitismo, sem "DYOR" jogado na cara.',
                  gradient: 'linear-gradient(135deg, #0d9488, #0f766e)'
                }
              ].map((item, index) => (
                <div key={index} className="neumorphic-card p-8 hover:scale-105 transition-transform duration-300">
                  <div
                    className="inline-flex w-16 h-16 rounded-2xl items-center justify-center mb-6 shadow-md neumorphic-button"
                    style={{ background: item.gradient }}
                  >
                    <FontAwesomeIcon icon={item.icon} className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-montserrat font-bold mb-4 text-gray-900 dark:text-[var(--text-primary)]">
                    {item.title}
                  </h3>
                  <p className="font-inter leading-relaxed text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Por Que Milagre */}
          <section className="relative py-12 mb-16">
            <div className="glass-panel p-8 md:p-12 rounded-3xl border-l-4 border-teal-500">
              <h2 className="text-3xl md:text-4xl font-montserrat font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                Por Que "Milagre"?
              </h2>
              <div className="space-y-4 text-lg font-inter leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                <p>
                  Não porque prometemos milagres financeiros. O oposto.
                </p>
                <p className="text-xl font-semibold text-green-500">
                  O milagre é oferecer valor real sem agendas ocultas — apenas transparência e justiça.
                </p>
                <p>
                  Que te avisa quando um projeto é golpe em vez de te empurrar para comprar.
                  Que celebra quando você evita perder dinheiro, não só quando você lucra.
                </p>
                <p className="font-bold" style={{ color: 'var(--text-primary)' }}>
                  Num mercado cheio de influenciadores pagos e projetos anônimos, honestidade é o milagre.
                </p>
              </div>
            </div>
          </section>

          {/* O Token */}
          <section className="relative py-12 mb-16">
            <div className="glass-panel p-8 md:p-12 rounded-3xl border-l-4 border-amber-500">
              <h2 className="text-3xl md:text-4xl font-montserrat font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                O Token $MILAGRE
              </h2>
              <div className="space-y-4 text-lg font-inter leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                <p>
                  Sim, existe um token SPL na Solana. <strong style={{ color: 'var(--text-primary)' }}>Não, ele não vai te fazer rico.</strong>
                </p>
                <p>
                  O $MILAGRE no momento não tem utilidade real, mas futuramente terá funcionalidades dentro da plataforma.
                  Por enquanto, serve apenas como forma de identificar membros da comunidade.
                </p>

                <div className="neumorphic-card p-6 border-2 border-red-500 mt-6">
                  <div className="flex items-start gap-4">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="text-3xl text-red-500 mt-1" />
                    <div>
                      <p className="font-bold text-red-500 mb-2">
                        Não é investimento. Não prometemos valorização.
                      </p>
                      <p className="text-base">
                        Se você comprar esperando moon, vai se frustrar. Esse não é o propósito do token.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Transparência Real */}
          <section className="relative py-12 mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-montserrat font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                🎯 Como Pretendemos Nos Sustentar
              </h2>
            </div>

            <div className="neumorphic-card p-8 md:p-12">
              <div className="grid md:grid-cols-1 gap-8">
                <div>
                  <ul className="space-y-3">
                    {[
                      'Links afiliados para exchanges confiáveis (sempre com aviso claro)',
                      'Newsletter com sponsors éticos',
                      'Funcionalidades do token $MILAGRE que ajudarão na receita do projeto',
                      'Futuramente, cursos avançados pagos'
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mt-1" />
                        <span style={{ color: 'var(--text-secondary)' }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 font-semibold text-green-500">
                    O conteúdo educacional básico será sempre gratuito.
                  </p>
                </div>

                <div className="md:col-span-2">
                  <h3 className="text-2xl font-montserrat font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                    <FontAwesomeIcon icon={faCode} className="mr-2 text-blue-500" />
                    Código
                  </h3>
                  <p style={{ color: 'var(--text-secondary)' }}>
                    Backend open-source no GitHub para auditoria. Qualquer pessoa pode verificar que não fazemos nada obscuro.
                  </p>
                  <a
                    href="https://github.com/dogespartano-cyber/tokenmilagre-platform"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-4 px-6 py-3 rounded-lg font-semibold transition-all hover:opacity-90 neumorphic-button"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    <FontAwesomeIcon icon={faGithub} />
                    Ver no GitHub
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Quem Está Por Trás */}
          <section className="relative py-12 mb-16">
            <div className="glass-panel p-8 md:p-12 rounded-3xl">
              <h2 className="text-3xl md:text-4xl font-montserrat font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                Quem Está Por Trás
              </h2>
              <div className="space-y-4 text-lg font-inter leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                <p>
                  Um desenvolvedor que dedica seu tempo livre a este projeto porque acredita
                  que educação cripto honesta pode fazer diferença na vida das pessoas.
                </p>
                <p>
                  Trabalho nisso nas horas vagas, sem investidores ou equipe. Não uso pseudônimo
                  para parecer misterioso. É um projeto pessoal que pode crescer com o tempo.
                </p>
              </div>
            </div>
          </section>

          {/* O Que Pedimos */}
          <section className="relative py-12 mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-montserrat font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                O Que Pedimos
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="neumorphic-card p-8">
                <h3 className="text-2xl font-montserrat font-bold mb-4 flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
                  <FontAwesomeIcon icon={faHeart} className="text-red-500" />
                  Se o projeto te ajudou
                </h3>
                <ul className="space-y-3">
                  {[
                    'Compartilhe com alguém que precisa de educação cripto honesta',
                    'Participe da comunidade no Discord',
                    'Se usar nossos links de afiliados, saiba que isso ajuda a manter as luzes acesas'
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-green-500 mt-1">•</span>
                      <span style={{ color: 'var(--text-secondary)' }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="neumorphic-card p-8">
                <h3 className="text-2xl font-montserrat font-bold mb-4 flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
                  <FontAwesomeIcon icon={faHandshake} className="text-blue-500" />
                  Se você quer contribuir
                </h3>
                <ul className="space-y-3">
                  {[
                    'Escreva um artigo educacional',
                    'Ajude a responder dúvidas de iniciantes na comunidade',
                    'Reporte golpes que encontrar para alertarmos outros'
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-green-500 mt-1">•</span>
                      <span style={{ color: 'var(--text-secondary)' }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Onde Nos Encontrar */}
          <section className="relative py-12 mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-montserrat font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                <FontAwesomeIcon icon={faGlobe} className="mr-3 text-teal-500" />
                Onde Nos Encontrar
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
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
                  name: 'GitHub',
                  icon: faGithub,
                  url: 'https://github.com/dogespartano-cyber/tokenmilagre-platform',
                  description: 'Código open source - 100% auditável',
                  color: '#333'
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
          </section>

          {/* CTA Final */}
          <section className="relative py-24 mt-12">
            <div className="glass-panel p-12 md:p-16 rounded-3xl text-center">
              <h2 className="text-4xl md:text-6xl font-montserrat font-bold mb-8" style={{ color: 'var(--text-primary)' }}>
                Junte-se à Comunidade
              </h2>

              <p className="text-lg md:text-xl mb-12 max-w-4xl mx-auto font-inter leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Uma comunidade onde você pode fazer perguntas, aprender sobre cripto, e se proteger de golpes.
                Sem julgamentos, sem promessas vazias.
              </p>

              <div className="flex flex-wrap justify-center gap-6 mt-12">
                <a
                  href="https://discord.gg/xk4zrz8j"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-10 py-5 rounded-full font-inter font-bold text-white bg-[#5865F2] hover:bg-[#4752C4] shadow-xl text-lg transition-all"
                >
                  <FontAwesomeIcon icon={faDiscord} className="w-6 h-6" />
                  <span>Entrar no Discord</span>
                </a>

                <a
                  href="https://t.me/+Bop_TVFc_mg3Njlh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-10 py-5 rounded-full font-inter font-bold text-white bg-[#0088cc] hover:bg-[#006699] shadow-xl text-lg transition-all"
                >
                  <FontAwesomeIcon icon={faTelegram} className="w-6 h-6" />
                  <span>Entrar no Telegram</span>
                </a>
              </div>
            </div>
          </section>

        </div>
      </div>
    </>
  );
}
