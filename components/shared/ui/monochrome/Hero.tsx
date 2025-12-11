/**
 * Hero Component - Sem Roxo
 *
 * Hero section com título curto, subtítulo e 2 CTAs
 * - CTA Primário: verde (#1E8F6E) - Entrar no Discord
 * - CTA Secundário: azul-escuro (#0B4A6F) - Conhecer o Token
 *
 * Acessibilidade:
 * - Marcação semântica com <section> e <h1>
 * - Focus visível em botões
 * - Contraste WCAG AA garantido
 * - Navegação por teclado
 */

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { SOCIAL_LINKS } from '@/lib/core/constants/social';

interface HeroProps {
  title?: string;
  subtitle?: string;
  primaryCta?: {
    label: string;
    href: string;
    external?: boolean;
  };
  secondaryCta?: {
    label: string;
    href: string;
    external?: boolean;
  };
  showLogo?: boolean;
}

export default function Hero({
  title = 'Construa seu futuro financeiro com $MILAGRE',
  subtitle = 'Educação financeira descentralizada. Transparente, sustentável e projetado para crescimento de longo prazo.',
  primaryCta = {
    label: 'Entrar no Discord',
    href: SOCIAL_LINKS.DISCORD,
    external: true
  },
  secondaryCta = {
    label: 'Conhecer o Token',
    href: '/token',
    external: false
  },
  showLogo = true
}: HeroProps) {
  return (
    <>
      <style jsx>{`
        .hero {
          min-height: 80vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--bg-page);
          position: relative;
          overflow: hidden;
        }

        .hero-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 4rem 1.5rem;
          text-align: center;
          position: relative;
          z-index: 10;
        }

        .hero-logo {
          margin: 0 auto 3rem;
          width: 120px;
          height: 120px;
          position: relative;
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .hero-logo img {
          border-radius: 50%;
          box-shadow: var(--shadow-xl);
        }

        .hero-title {
          font-family: var(--font-display);
          font-size: 2.5rem;
          font-weight: 800;
          color: var(--text-primary);
          line-height: var(--line-height-tight);
          margin-bottom: 1.5rem;
          max-width: 900px;
          margin-left: auto;
          margin-right: auto;
        }

        @media (min-width: 768px) {
          .hero-title {
            font-size: 3.5rem;
          }
        }

        @media (min-width: 1024px) {
          .hero-title {
            font-size: 4rem;
          }
        }

        .hero-title-accent {
          background: linear-gradient(135deg, var(--color-accent), var(--color-teal));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-subtitle {
          font-family: var(--font-sans);
          font-size: 1.125rem;
          font-weight: 400;
          color: var(--text-secondary);
          line-height: var(--line-height-relaxed);
          margin-bottom: 3rem;
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
        }

        @media (min-width: 768px) {
          .hero-subtitle {
            font-size: 1.25rem;
          }
        }

        .hero-ctas {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          align-items: center;
          justify-content: center;
        }

        @media (min-width: 640px) {
          .hero-ctas {
            flex-direction: row;
            gap: 1.5rem;
          }
        }

        .cta-primary {
          padding: 1rem 2rem;
          background-color: var(--color-accent);
          color: white;
          font-family: var(--font-sans);
          font-size: 1.125rem;
          font-weight: 600;
          border: none;
          border-radius: var(--radius-md);
          text-decoration: none;
          cursor: pointer;
          transition: all var(--transition-fast);
          box-shadow: var(--shadow-md);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          min-width: 200px;
        }

        .cta-primary:hover {
          background-color: var(--color-accent-hover);
          box-shadow: var(--shadow-lg);
          transform: translateY(-2px);
        }

        .cta-primary:focus-visible {
          outline: 3px solid var(--color-accent);
          outline-offset: 3px;
        }

        .cta-primary:active {
          transform: translateY(0);
        }

        .cta-secondary {
          padding: 1rem 2rem;
          background-color: transparent;
          color: var(--color-primary);
          font-family: var(--font-sans);
          font-size: 1.125rem;
          font-weight: 600;
          border: 2px solid var(--color-primary);
          border-radius: var(--radius-md);
          text-decoration: none;
          cursor: pointer;
          transition: all var(--transition-fast);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          min-width: 200px;
        }

        .cta-secondary:hover {
          background-color: var(--color-primary);
          color: white;
          box-shadow: var(--shadow-md);
          transform: translateY(-2px);
        }

        .cta-secondary:focus-visible {
          outline: 3px solid var(--color-primary);
          outline-offset: 3px;
        }

        .cta-secondary:active {
          transform: translateY(0);
        }

        /* Background decorative circles - Sem roxo */
        .hero-background {
          position: absolute;
          inset: 0;
          overflow: hidden;
          opacity: 0.08;
          z-index: 0;
        }

        .hero-circle {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          animation: pulse 4s ease-in-out infinite;
        }

        .hero-circle-1 {
          top: 10%;
          left: 10%;
          width: 300px;
          height: 300px;
          background-color: var(--color-accent);
          animation-delay: 0s;
        }

        .hero-circle-2 {
          bottom: 10%;
          right: 10%;
          width: 400px;
          height: 400px;
          background-color: var(--color-blue);
          animation-delay: 1s;
        }

        .hero-circle-3 {
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 250px;
          height: 250px;
          background-color: var(--color-teal);
          animation-delay: 2s;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
        }

        /* Trust indicators */
        .trust-indicators {
          margin-top: 3rem;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 2rem;
          font-size: 0.875rem;
          color: var(--text-tertiary);
        }

        .trust-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .trust-icon {
          width: 20px;
          height: 20px;
          color: var(--color-accent);
        }
      `}</style>

      <section className="hero">
        {/* Background decorative circles */}
        <div className="hero-background" aria-hidden="true">
          <div className="hero-circle hero-circle-1"></div>
          <div className="hero-circle hero-circle-2"></div>
          <div className="hero-circle hero-circle-3"></div>
        </div>

        <div className="hero-container">
          {/* Logo */}
          {showLogo && (
            <div className="hero-logo">
              <Image
                src="/images/TOKEN-MILAGRE-Hero.webp"
                alt="$MILAGRE Token"
                width={120}
                height={120}
                priority
              />
            </div>
          )}

          {/* Title */}
          <h1 className="hero-title">
            {title.split('$MILAGRE')[0]}
            <span className="hero-title-accent">$MILAGRE</span>
          </h1>

          {/* Subtitle */}
          <p className="hero-subtitle">
            {subtitle}
          </p>

          {/* CTAs */}
          <div className="hero-ctas">
            {primaryCta && (
              primaryCta.external ? (
                <a
                  href={primaryCta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cta-primary"
                >
                  {primaryCta.label}
                  <svg className="trust-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
              ) : (
                <Link href={primaryCta.href} className="cta-primary">
                  {primaryCta.label}
                  <svg className="trust-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              )
            )}

            {secondaryCta && (
              secondaryCta.external ? (
                <a
                  href={secondaryCta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cta-secondary"
                >
                  {secondaryCta.label}
                </a>
              ) : (
                <Link href={secondaryCta.href} className="cta-secondary">
                  {secondaryCta.label}
                </Link>
              )
            )}
          </div>

          {/* Trust Indicators */}
          <div className="trust-indicators">
            <div className="trust-item">
              <svg className="trust-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>100% Transparente</span>
            </div>
            <div className="trust-item">
              <svg className="trust-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Código Aberto</span>
            </div>
            <div className="trust-item">
              <svg className="trust-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Comunidade Ativa</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
