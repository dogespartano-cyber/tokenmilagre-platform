'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function SobrePage() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  const coreValues = [
    {
      icon: '🤝',
      title: 'Apoio Mútuo',
      description: 'Ninguém caminha sozinho em nossa comunidade'
    },
    {
      icon: '📚',
      title: 'Educação Livre',
      description: 'Conhecimento acessível para todos'
    },
    {
      icon: '🔓',
      title: 'Transparência',
      description: 'Decisões abertas e processos claros'
    },
    {
      icon: '🌍',
      title: 'Impacto Real',
      description: 'Fazemos a diferença na vida das pessoas'
    }
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
            "https://discord.gg/skaX8bFY"
          ]
        })}
      </Script>

      <div className="py-8 max-w-4xl" style={{ paddingLeft: '55px', paddingRight: '1rem' }}>
        <div className="space-y-16">
          {/* Breadcrumbs */}
          <Breadcrumbs />

          {/* Hero */}
          <div className="space-y-6">
            <div className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold" style={{
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--brand-primary)'
            }}>
              Sobre nós
            </div>

            <h1 className="text-4xl md:text-5xl font-bold leading-tight font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
              Somos uma comunidade global unida pela crença de que{' '}
              <span className="text-brand-primary">juntos somos mais fortes</span>
            </h1>

            <p className="text-xl leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Uma rede descentralizada de apoio mútuo, educação livre e transformação real.
            </p>

            <div className="flex flex-wrap gap-3 pt-4">
              <a
                href="https://discord.gg/skaX8bFY"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all hover:opacity-90"
                style={{
                  backgroundColor: '#5865F2',
                  color: 'white'
                }}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
                Discord
              </a>

              <a
                href="https://t.me/+Bop_TVFc_mg3Njlh"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all hover:opacity-90"
                style={{
                  backgroundColor: '#0088cc',
                  color: 'white'
                }}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12s12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21l-1.446 1.394c-.14.18-.357.295-.6.295c-.002 0-.003 0-.005 0l.213-3.054l5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326l-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
                </svg>
                Telegram
              </a>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t" style={{ borderColor: 'var(--border-light)' }}></div>

          {/* Nossa Missão */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
              Nossa Missão
            </h2>

            <div className="space-y-4 text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              <p>
                A comunidade <strong className="text-brand-primary">$MILAGRE</strong> nasceu de uma visão simples:{' '}
                <strong style={{ color: 'var(--text-primary)' }}>ninguém deveria caminhar sozinho</strong> em sua jornada de crescimento.
              </p>

              <p>
                Somos uma rede descentralizada construída na blockchain Solana, onde tecnologia encontra humanidade.
                Acreditamos que <strong style={{ color: 'var(--text-primary)' }}>colaboração supera competição</strong> e que{' '}
                <strong style={{ color: 'var(--text-primary)' }}>conhecimento deve ser livre</strong>.
              </p>

              <div className="pl-4 border-l-4 py-2" style={{ borderColor: 'var(--brand-primary)' }}>
                <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Do Only Good Everyday
                </p>
                <p className="text-base mt-1">
                  Nosso compromisso é fazer apenas o bem, todos os dias, para cada membro da nossa comunidade.
                </p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t" style={{ borderColor: 'var(--border-light)' }}></div>

          {/* Valores */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
              Nossos Valores
            </h2>

            <div className="grid sm:grid-cols-2 gap-8">
              {coreValues.map((value, index) => (
                <div key={index} className="space-y-3">
                  <div className="text-4xl">{value.icon}</div>
                  <h3 className="text-xl font-bold font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
                    {value.title}
                  </h3>
                  <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t" style={{ borderColor: 'var(--border-light)' }}></div>

          {/* Nossa Jornada */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
              Nossa Jornada
            </h2>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-2xl" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  🎯
                </div>
                <div className="space-y-1 flex-1">
                  <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>Fundação da Comunidade</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>Início do movimento $MILAGRE com os primeiros holders</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-2xl" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  🚀
                </div>
                <div className="space-y-1 flex-1">
                  <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>Lançamento do Token</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>Token SPL na blockchain Solana via Pump.fun</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-2xl" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  👼
                </div>
                <div className="space-y-1 flex-1">
                  <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>Primeiros Guardiões</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>Estabelecimento dos três pilares da comunidade</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-2xl" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  📖
                </div>
                <div className="space-y-1 flex-1">
                  <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>Plataforma Educacional</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>Lançamento do hub de notícias e recursos educacionais</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-2xl" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  🌟
                </div>
                <div className="space-y-1 flex-1">
                  <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>Crescimento Contínuo</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>Desenvolvimento da comunidade e seus projetos</p>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t" style={{ borderColor: 'var(--border-light)' }}></div>

          {/* Como Contribuir */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-2 font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
                Como Contribuir
              </h2>
              <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                O $MILAGRE é construído pela comunidade, para a comunidade.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="text-3xl">📚</div>
                <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Educar</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Crie tutoriais, faça mentorias e compartilhe conhecimento
                </p>
              </div>

              <div className="space-y-3">
                <div className="text-3xl">💻</div>
                <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Desenvolver</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Contribua com código open source e melhorias
                </p>
              </div>

              <div className="space-y-3">
                <div className="text-3xl">🗳️</div>
                <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Governar</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Participe das decisões da comunidade
                </p>
              </div>

              <div className="space-y-3">
                <div className="text-3xl">🤝</div>
                <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Apoiar</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Dê suporte e fortaleça a comunidade
                </p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t" style={{ borderColor: 'var(--border-light)' }}></div>

          {/* CTA Final */}
          <div className="space-y-6 py-8">
            <h2 className="text-3xl font-bold font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
              Faça Parte da Família $MILAGRE
            </h2>
            <p className="text-xl" style={{ color: 'var(--text-secondary)' }}>
              Junte-se a uma comunidade global de pessoas que acreditam que juntos podemos criar milagres.
            </p>
            <p className="text-2xl font-bold text-brand-primary">
              Nunca estarás sozinho.
            </p>
          </div>

          {/* Scroll to top button */}
          {showScrollTop && (
            <button
              onClick={scrollToTop}
              className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
              style={{
                backgroundColor: 'var(--brand-primary)',
                color: 'var(--text-inverse)'
              }}
              aria-label="Voltar ao topo"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </>
  );
}
