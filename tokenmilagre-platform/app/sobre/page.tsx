'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faHandshake, faBook, faLockOpen, faGlobe, faBullseye, faRocket, faUserShield, faBookOpen, faStar, faLaptopCode, faCheckToSlot } from '@fortawesome/free-solid-svg-icons';
import { faDiscord, faTelegram } from '@fortawesome/free-brands-svg-icons';

export default function SobrePage() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  const coreValues = [
    {
      icon: faHandshake,
      title: 'Apoio Mútuo',
      description: 'Ninguém caminha sozinho em nossa comunidade',
      color: '#22c55e'
    },
    {
      icon: faBook,
      title: 'Educação Livre',
      description: 'Conhecimento acessível para todos',
      color: '#3b82f6'
    },
    {
      icon: faLockOpen,
      title: 'Transparência',
      description: 'Decisões abertas e processos claros',
      color: '#eab308'
    },
    {
      icon: faGlobe,
      title: 'Impacto Real',
      description: 'Fazemos a diferença na vida das pessoas',
      color: '#8b5cf6'
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
            "https://discord.gg/xk4zrz8j"
          ]
        })}
      </Script>

      <div className="py-8 max-w-4xl" style={{ paddingLeft: '55px', paddingRight: '1rem' }}>
        <div className="space-y-16">
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
                href="https://discord.gg/xk4zrz8j"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all hover:opacity-90"
                style={{
                  backgroundColor: '#5865F2',
                  color: 'white'
                }}
              >
                <FontAwesomeIcon icon={faDiscord} className="w-5 h-5" />
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
                <FontAwesomeIcon icon={faTelegram} className="w-5 h-5" />
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
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{
                    backgroundColor: `${value.color}15`,
                    border: `2px solid ${value.color}30`
                  }}>
                    <FontAwesomeIcon icon={value.icon} className="text-3xl" style={{ color: value.color }} />
                  </div>
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
                <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center" style={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: '2px solid var(--brand-primary)'
                }}>
                  <FontAwesomeIcon icon={faBullseye} className="text-lg" style={{ color: 'var(--brand-primary)' }} />
                </div>
                <div className="space-y-1 flex-1">
                  <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>Fundação da Comunidade</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>Início do movimento $MILAGRE com os primeiros holders</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center" style={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: '2px solid var(--brand-primary)'
                }}>
                  <FontAwesomeIcon icon={faRocket} className="text-lg" style={{ color: 'var(--brand-primary)' }} />
                </div>
                <div className="space-y-1 flex-1">
                  <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>Lançamento do Token</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>Token SPL na blockchain Solana via Pump.fun</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center" style={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: '2px solid var(--brand-primary)'
                }}>
                  <FontAwesomeIcon icon={faUserShield} className="text-lg" style={{ color: 'var(--brand-primary)' }} />
                </div>
                <div className="space-y-1 flex-1">
                  <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>Primeiros Guardiões</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>Estabelecimento dos três pilares da comunidade</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center" style={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: '2px solid var(--brand-primary)'
                }}>
                  <FontAwesomeIcon icon={faBookOpen} className="text-lg" style={{ color: 'var(--brand-primary)' }} />
                </div>
                <div className="space-y-1 flex-1">
                  <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>Plataforma Educacional</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>Lançamento do hub de notícias e recursos educacionais</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center" style={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: '2px solid var(--brand-primary)'
                }}>
                  <FontAwesomeIcon icon={faStar} className="text-lg" style={{ color: 'var(--brand-primary)' }} />
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
                <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{
                  backgroundColor: '#3b82f615',
                  border: '2px solid #3b82f630'
                }}>
                  <FontAwesomeIcon icon={faBook} className="text-2xl" style={{ color: '#3b82f6' }} />
                </div>
                <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Educar</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Crie tutoriais, faça mentorias e compartilhe conhecimento
                </p>
              </div>

              <div className="space-y-3">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{
                  backgroundColor: '#8b5cf615',
                  border: '2px solid #8b5cf630'
                }}>
                  <FontAwesomeIcon icon={faLaptopCode} className="text-2xl" style={{ color: '#8b5cf6' }} />
                </div>
                <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Desenvolver</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Contribua com código open source e melhorias
                </p>
              </div>

              <div className="space-y-3">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{
                  backgroundColor: '#eab30815',
                  border: '2px solid #eab30830'
                }}>
                  <FontAwesomeIcon icon={faCheckToSlot} className="text-2xl" style={{ color: '#eab308' }} />
                </div>
                <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Governar</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Participe das decisões da comunidade
                </p>
              </div>

              <div className="space-y-3">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{
                  backgroundColor: '#22c55e15',
                  border: '2px solid #22c55e30'
                }}>
                  <FontAwesomeIcon icon={faHandshake} className="text-2xl" style={{ color: '#22c55e' }} />
                </div>
                <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Apoiar</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Dê suporte e fortaleça a comunidade
                </p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t" style={{ borderColor: 'var(--border-light)' }}></div>

          {/* Link para Equipe */}
          <div className="space-y-6">
            <div className="backdrop-blur-xl rounded-2xl p-8 border-2 hover:scale-102 transition-all" style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--brand-primary)'
            }}>
              <div className="flex items-center justify-between gap-6">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                    Conheça Nossa Comunidade
                  </h3>
                  <p className="text-lg mb-4" style={{ color: 'var(--text-secondary)' }}>
                    Descubra como nos organizamos, por que somos descentralizados e como você pode se tornar um contribuidor ativo.
                  </p>
                  <a
                    href="/sobre/equipe"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all hover:scale-105"
                    style={{
                      backgroundColor: 'var(--brand-primary)',
                      color: 'var(--text-inverse)'
                    }}
                  >
                    Ver Equipe e Estrutura →
                  </a>
                </div>
                <div className="hidden lg:block text-6xl">
                  👥
                </div>
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
              <FontAwesomeIcon icon={faArrowUp} className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </>
  );
}
