'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Script from 'next/script';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEnvelope,
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
      url: 'https://discord.gg/xk4zrz8j',
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
      name: 'GitHub',
      url: 'https://github.com/dogespartano-cyber/tokenmilagre-platform',
      icon: faGithub,
      color: 'bg-[#333]',
      hover: 'hover:bg-[#24292e]',
      description: 'Analise nosso código. Transparência total é nossa prioridade.'
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

        <div className={`relative z-10 max-w-5xl mx-auto px-6 py-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

          {/* Hero Section */}
          <section className="text-center space-y-8 mb-20 pt-12">
            <div className="flex justify-center mb-8">
              <div className="relative w-40 h-40 animate-float-vertical">
                <Image
                  src="/images/TOKEN-MILAGRE-Hero.webp"
                  alt="$MILAGRE"
                  width={160}
                  height={160}
                  className="drop-shadow-2xl rounded-full"
                  priority
                />
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

          {/* Contact Cards Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-20">
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card p-8 rounded-3xl group hover:border-[var(--brand-primary)] transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start gap-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg transition-colors ${link.color} ${link.hover}`}>
                    <FontAwesomeIcon icon={link.icon} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2 group-hover:text-[var(--brand-primary)] transition-colors">
                      {link.name}
                    </h3>
                    <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                      {link.description}
                    </p>
                  </div>
                  <div className="ml-auto self-center opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0">
                    <FontAwesomeIcon icon={faArrowRight} className="text-[var(--brand-primary)]" />
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Direct Contact / Email */}
          <section className="glass p-10 rounded-[2.5rem] text-center mb-20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--brand-primary)] to-transparent opacity-50"></div>

            <div className="relative z-10">
              <div className="w-16 h-16 bg-[var(--bg-primary)] rounded-full flex items-center justify-center mx-auto mb-6 text-2xl text-[var(--brand-primary)] shadow-sm">
                <FontAwesomeIcon icon={faEnvelope} />
              </div>

              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
                Precisa falar diretamente?
              </h2>
              <p className="text-[var(--text-secondary)] mb-8">
                Para parcerias, imprensa ou assuntos específicos que não podem ser tratados na comunidade.
              </p>

              <a
                href="mailto:contato@tokenmilagre.xyz"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-[var(--brand-primary)] text-white font-bold hover:bg-[var(--brand-hover)] transition-all shadow-lg hover:shadow-[var(--brand-primary)]/30"
              >
                <span>contato@tokenmilagre.xyz</span>
              </a>
            </div>
          </section>

          {/* Open Source Badge */}
          <div className="text-center">
            <a
              href="https://github.com/dogespartano-cyber/tokenmilagre-platform"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-light)] text-sm text-[var(--text-secondary)] hover:border-[var(--brand-primary)] transition-colors"
            >
              <FontAwesomeIcon icon={faCode} className="text-[var(--brand-primary)]" />
              <span>Projeto 100% Open Source</span>
            </a>
          </div>

        </div>
      </div>

      <style jsx>{`
        @keyframes float-vertical {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .animate-float-vertical {
          animation: float-vertical 4s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
