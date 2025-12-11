/**
 * Header Component - Sem Roxo
 *
 * Navegação simplificada com 4 itens: Início, Sobre, Recursos, Entrar
 * CTA primário usa Accent (#1E8F6E)
 *
 * Acessibilidade:
 * - Navegação por teclado suportada
 * - Focus visível em todos os links
 * - Marcação semântica com <header> e <nav>
 * - ARIA labels para mobile menu
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Início', href: '/' },
    { label: 'Sobre', href: '/sobre' },
    { label: 'Recursos', href: '/recursos' },
  ];

  return (
    <>
      <style jsx>{`
        .header {
          position: sticky;
          top: 0;
          z-index: 50;
          background-color: var(--bg-card);
          border-bottom: 1px solid var(--border-light);
          backdrop-filter: blur(8px);
          background-color: rgba(255, 255, 255, 0.9);
        }

        [data-theme="dark"] .header {
          background-color: rgba(26, 32, 39, 0.9);
        }

        .header-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 1rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
        }

        .logo-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
          text-decoration: none;
          transition: opacity var(--transition-fast);
        }

        .logo-link:hover {
          opacity: 0.8;
        }

        .logo-link:focus-visible {
          outline: 2px solid var(--border-focus);
          outline-offset: 4px;
          border-radius: 4px;
        }

        .nav-desktop {
          display: none;
          align-items: center;
          gap: 2rem;
        }

        @media (min-width: 768px) {
          .nav-desktop {
            display: flex;
          }
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .nav-link {
          font-size: 1rem;
          font-weight: 500;
          color: var(--text-secondary);
          text-decoration: none;
          transition: color var(--transition-fast);
          position: relative;
          padding: 0.5rem 0;
        }

        .nav-link:hover {
          color: var(--color-primary);
        }

        .nav-link:focus-visible {
          outline: 2px solid var(--border-focus);
          outline-offset: 4px;
          border-radius: 4px;
          color: var(--color-primary);
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background-color: var(--color-accent);
          transition: width var(--transition-fast);
        }

        .nav-link:hover::after {
          width: 100%;
        }

        .cta-button {
          padding: 0.75rem 1.5rem;
          background-color: var(--color-accent);
          color: white;
          font-size: 1rem;
          font-weight: 600;
          border: none;
          border-radius: var(--radius-md);
          text-decoration: none;
          cursor: pointer;
          transition: all var(--transition-fast);
          box-shadow: var(--shadow-sm);
          display: inline-block;
        }

        .cta-button:hover {
          background-color: var(--color-accent-hover);
          box-shadow: var(--shadow-md);
          transform: translateY(-1px);
        }

        .cta-button:focus-visible {
          outline: 3px solid var(--border-focus);
          outline-offset: 2px;
        }

        .cta-button:active {
          transform: translateY(0);
        }

        /* Mobile Menu Button */
        .mobile-menu-button {
          display: flex;
          padding: 0.5rem;
          background: transparent;
          border: none;
          cursor: pointer;
          color: var(--text-primary);
          transition: color var(--transition-fast);
        }

        @media (min-width: 768px) {
          .mobile-menu-button {
            display: none;
          }
        }

        .mobile-menu-button:hover {
          color: var(--color-accent);
        }

        .mobile-menu-button:focus-visible {
          outline: 2px solid var(--border-focus);
          outline-offset: 2px;
          border-radius: 4px;
        }

        .mobile-menu-icon {
          width: 24px;
          height: 24px;
        }

        /* Mobile Menu */
        .mobile-menu {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: var(--bg-overlay);
          z-index: 100;
          display: flex;
          flex-direction: column;
          padding: 2rem;
          transform: translateX(-100%);
          transition: transform var(--transition-base);
        }

        .mobile-menu.open {
          transform: translateX(0);
        }

        .mobile-menu-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .mobile-nav-links {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .mobile-nav-link {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-inverse);
          text-decoration: none;
          padding: 0.75rem 0;
          transition: color var(--transition-fast);
        }

        .mobile-nav-link:hover {
          color: var(--color-accent);
        }

        .mobile-nav-link:focus-visible {
          outline: 2px solid var(--border-focus);
          outline-offset: 4px;
          border-radius: 4px;
        }

        .mobile-cta {
          margin-top: 2rem;
        }

        .close-button {
          background: transparent;
          border: none;
          color: var(--text-inverse);
          cursor: pointer;
          padding: 0.5rem;
          transition: color var(--transition-fast);
        }

        .close-button:hover {
          color: var(--color-accent);
        }

        .close-button:focus-visible {
          outline: 2px solid var(--border-focus);
          outline-offset: 2px;
          border-radius: 4px;
        }
      `}</style>

      <header className="header">
        <div className="header-container">
          {/* Logo */}
          <Link href="/" className="logo-link">
            <Image
              src="/images/TOKEN-MILAGRE-Hero.webp"
              alt="$MILAGRE"
              width={40}
              height={40}
              priority
            />
            <span>$MILAGRE</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="nav-desktop" aria-label="Navegação principal">
            <div className="nav-links">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="nav-link"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <Link href="/login" className="cta-button">
              Entrar
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Abrir menu de navegação"
            aria-expanded={mobileMenuOpen}
          >
            <svg className="mobile-menu-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}
          role="dialog"
          aria-modal="true"
          aria-label="Menu de navegação mobile"
        >
          <div className="mobile-menu-header">
            <Link href="/" className="logo-link" onClick={() => setMobileMenuOpen(false)}>
              <Image
                src="/images/TOKEN-MILAGRE-Hero.webp"
                alt="$MILAGRE"
                width={40}
                height={40}
              />
              <span style={{ color: 'var(--text-inverse)' }}>$MILAGRE</span>
            </Link>

            <button
              className="close-button"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Fechar menu"
            >
              <svg className="mobile-menu-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="mobile-nav-links" aria-label="Navegação mobile">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="mobile-nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            <div className="mobile-cta">
              <Link href="/login" className="cta-button" onClick={() => setMobileMenuOpen(false)}>
                Entrar
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
