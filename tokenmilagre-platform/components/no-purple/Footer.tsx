/**
 * Footer Component - Sem Roxo
 *
 * Rodapé com links úteis, redes sociais e informações legais
 *
 * Acessibilidade:
 * - Marcação semântica com <footer> e <nav>
 * - Links com focus visível
 * - Contraste adequado
 */

'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    produto: [
      { label: 'Início', href: '/' },
      { label: 'Sobre', href: '/sobre' },
      { label: 'Token', href: '/token' },
      { label: 'Recursos', href: '/recursos' },
    ],
    comunidade: [
      { label: 'Discord', href: 'https://discord.gg/xk4zrz8j', external: true },
      { label: 'Telegram', href: 'https://t.me/+Bop_TVFc_mg3Njlh', external: true },
      { label: 'Twitter', href: '#', external: true },
      { label: 'GitHub', href: '#', external: true },
    ],
    legal: [
      { label: 'Manifesto', href: '/manifesto' },
      { label: 'Segurança', href: '/seguranca/verificador-url' },
      { label: 'Doações', href: '/doacoes' },
    ],
  };

  return (
    <>
      <style jsx>{`
        .footer {
          background-color: var(--bg-elevated);
          border-top: 1px solid var(--border-light);
          margin-top: 4rem;
        }

        .footer-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 3rem 1.5rem 1.5rem;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          margin-bottom: 3rem;
        }

        @media (min-width: 640px) {
          .footer-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .footer-grid {
            grid-template-columns: 2fr 1fr 1fr 1fr;
          }
        }

        .footer-brand {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .footer-logo-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
          text-decoration: none;
          width: fit-content;
        }

        .footer-logo-link:hover {
          opacity: 0.8;
        }

        .footer-logo-link:focus-visible {
          outline: 2px solid var(--border-focus);
          outline-offset: 4px;
          border-radius: 4px;
        }

        .footer-description {
          font-size: 0.875rem;
          color: var(--text-secondary);
          line-height: var(--line-height-relaxed);
          max-width: 320px;
        }

        .footer-social {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }

        .social-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: var(--bg-page);
          color: var(--text-secondary);
          transition: all var(--transition-fast);
          text-decoration: none;
        }

        .social-link:hover {
          background-color: var(--color-accent);
          color: white;
          transform: translateY(-2px);
        }

        .social-link:focus-visible {
          outline: 2px solid var(--border-focus);
          outline-offset: 2px;
        }

        .social-icon {
          width: 20px;
          height: 20px;
        }

        .footer-column {
          display: flex;
          flex-direction: column;
        }

        .footer-column-title {
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--text-primary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 1rem;
        }

        .footer-links {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .footer-link {
          font-size: 0.875rem;
          color: var(--text-secondary);
          text-decoration: none;
          transition: color var(--transition-fast);
          width: fit-content;
        }

        .footer-link:hover {
          color: var(--color-accent);
        }

        .footer-link:focus-visible {
          outline: 2px solid var(--border-focus);
          outline-offset: 2px;
          border-radius: 2px;
        }

        .footer-bottom {
          padding-top: 2rem;
          border-top: 1px solid var(--border-light);
          display: flex;
          flex-direction: column;
          gap: 1rem;
          align-items: center;
          justify-content: space-between;
          text-align: center;
        }

        @media (min-width: 768px) {
          .footer-bottom {
            flex-direction: row;
            text-align: left;
          }
        }

        .footer-copyright {
          font-size: 0.875rem;
          color: var(--text-tertiary);
        }

        .footer-disclaimer {
          font-size: 0.75rem;
          color: var(--text-tertiary);
          max-width: 600px;
        }

        .footer-disclaimer-link {
          color: var(--color-accent);
          text-decoration: none;
        }

        .footer-disclaimer-link:hover {
          text-decoration: underline;
        }
      `}</style>

      <footer className="footer">
        <div className="footer-container">
          {/* Footer Grid */}
          <div className="footer-grid">
            {/* Brand Column */}
            <div className="footer-brand">
              <Link href="/" className="footer-logo-link">
                <Image
                  src="/images/TOKEN-MILAGRE-Hero.webp"
                  alt="$MILAGRE"
                  width={40}
                  height={40}
                />
                <span>$MILAGRE</span>
              </Link>

              <p className="footer-description">
                Token de educação financeira descentralizada. Transparente, sustentável e projetado para crescimento de longo prazo.
              </p>

              {/* Social Links */}
              <div className="footer-social">
                <a
                  href="https://discord.gg/xk4zrz8j"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                  aria-label="Discord"
                >
                  <svg className="social-icon" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                </a>

                <a
                  href="https://t.me/+Bop_TVFc_mg3Njlh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                  aria-label="Telegram"
                >
                  <svg className="social-icon" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12a12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472c-.18 1.898-.962 6.502-1.36 8.627c-.168.9-.499 1.201-.82 1.23c-.696.065-1.225-.46-1.9-.902c-1.056-.693-1.653-1.124-2.678-1.8c-1.185-.78-.417-1.21.258-1.91c.177-.184 3.247-2.977 3.307-3.23c.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345c-.48.33-.913.49-1.302.48c-.428-.008-1.252-.241-1.865-.44c-.752-.245-1.349-.374-1.297-.789c.027-.216.325-.437.893-.663c3.498-1.524 5.83-2.529 6.998-3.014c3.332-1.386 4.025-1.627 4.476-1.635z" />
                  </svg>
                </a>

                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                  aria-label="Twitter"
                >
                  <svg className="social-icon" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>

                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                  aria-label="GitHub"
                >
                  <svg className="social-icon" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Product Column */}
            <div className="footer-column">
              <h3 className="footer-column-title">Produto</h3>
              <nav className="footer-links" aria-label="Links do produto">
                {footerLinks.produto.map((link) => (
                  <Link key={link.href} href={link.href} className="footer-link">
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Community Column */}
            <div className="footer-column">
              <h3 className="footer-column-title">Comunidade</h3>
              <nav className="footer-links" aria-label="Links da comunidade">
                {footerLinks.comunidade.map((link) => (
                  link.external ? (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="footer-link"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link key={link.href} href={link.href} className="footer-link">
                      {link.label}
                    </Link>
                  )
                ))}
              </nav>
            </div>

            {/* Legal Column */}
            <div className="footer-column">
              <h3 className="footer-column-title">Legal</h3>
              <nav className="footer-links" aria-label="Links legais">
                {footerLinks.legal.map((link) => (
                  <Link key={link.href} href={link.href} className="footer-link">
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="footer-bottom">
            <p className="footer-copyright">
              © {currentYear} $MILAGRE. Todos os direitos reservados.
            </p>

            <p className="footer-disclaimer">
              Criptomoedas envolvem riscos. Este não é um conselho financeiro.{' '}
              <a href="/manifesto" className="footer-disclaimer-link">
                Leia nosso manifesto
              </a>
              .
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
