'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Script from 'next/script';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCode,
  faArrowRight,
  faGlobe,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import { faDiscord, faTelegram, faGithub, faTwitter } from '@fortawesome/free-brands-svg-icons';

export default function SobrePage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const socialLinks = [
    {
      name: 'Discord',
      url: 'https://discord.gg/jPgZr7BVXY',
      icon: faDiscord,
      color: 'bg-[#5865F2]',
      hover: 'hover:bg-[#4752C4]',
      description: 'Participe da nossa comunidade ativa, tire dúvidas e colabore.'
    },
    {
      name: 'Telegram',
      url: 'https://t.me/+Bop_TVFc_mg3Njlh',
      icon: faTelegram,
      color: 'bg-[#0088cc]',
      hover: 'hover:bg-[#0077b5]',
      description: 'Receba atualizações em tempo real e alertas de segurança.'
    },
    {
      name: 'Twitter / X',
      url: 'https://x.com/TokenMilagre',
      icon: faTwitter,
      color: 'bg-black',
      hover: 'hover:bg-gray-800',
      description: 'Siga-nos para notícias rápidas e interações com o ecossistema.'
    },
    {
      name: 'Github - Open Source',
      url: 'https://github.com/dogespartano-cyber/tokenmilagre-platform',
      icon: faGithub,
      color: 'bg-[#333]',
      hover: 'hover:bg-[#24292e]',
      description: 'A confiança se conquista com código, não com palavras. Nossa plataforma é 100% código aberto.'
    }
  ];

  return (
    <>
      <Script id="about-schema" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ContactPage",
          "name": "Contato - $MILAGRE",
          "url": "https://tokenmilagre.xyz/sobre",
          "description": "Entre em contato com a equipe do $MILAGRE. Redes sociais oficiais e canais de suporte.",
          "mainEntity": {
            "@type": "Organization",
            "name": "$MILAGRE",
            "sameAs": [
              "https://x.com/TokenMilagre",
              "https://t.me/+Bop_TVFc_mg3Njlh",
              "https://github.com/dogespartano-cyber/tokenmilagre-platform"
            ]
          }
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
        </div>

        <div className={`relative z-10 max-w-3xl mx-auto px-6 py-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

          {/* Hero Section */}
          <section className="text-center space-y-8 mb-20 pt-12">
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

            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-[var(--text-primary)]">
              Conecte-se Conosco
            </h1>

            <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
              Estamos construindo uma comunidade forte e transparente. <br />
              Escolha seu canal preferido e faça parte do movimento.
            </p>
          </section>

          {/* Contact Cards Grid - Single Column */}
          <div className="grid grid-cols-1 gap-6 mb-20">
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card p-8 rounded-3xl group hover:border-[var(--brand-primary)] transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center gap-6">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg transition-colors ${link.color} ${link.hover} shrink-0`}>
                    <FontAwesomeIcon icon={link.icon} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-2 group-hover:text-[var(--brand-primary)] transition-colors">
                      {link.name}
                    </h3>
                    <p className="text-[var(--text-secondary)] text-base leading-relaxed">
                      {link.description}
                    </p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity -translate-x-4 group-hover:translate-x-0">
                    <FontAwesomeIcon icon={faArrowRight} className="text-[var(--brand-primary)] text-xl" />
                  </div>
                </div>
              </a>
            ))}

            {/* Sustentabilidade Card - Styled to match */}
            <div className="glass-card p-8 rounded-3xl border border-[var(--border-light)] bg-[var(--bg-elevated)]">
              <div className="flex items-center gap-6 mb-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg bg-green-600 shrink-0">
                  <FontAwesomeIcon icon={faCheckCircle} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[var(--text-primary)]">
                    Sustentabilidade do Projeto
                  </h3>
                </div>
              </div>

              <ul className="space-y-4 mt-6 pl-2">
                {[
                  'Doações da comunidade',
                  'Links afiliados éticos (exchanges seguras)',
                  'Parcerias transparentes',
                  'Produtos educacionais avançados'
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3 text-[var(--text-secondary)]">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 text-lg" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

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
      `}</style>
    </>
  );
}
