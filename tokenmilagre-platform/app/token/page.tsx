'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Script from 'next/script';
import { HolderCounter } from '@/components/HolderCounter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowUp,
  faShieldHalved,
  faHandHoldingHeart,
  faCopy,
  faMagnifyingGlass,
  faCoins,
  faCheckCircle,
  faInfoCircle,
  faChartLine,
  faLock,
  faUnlock,
  faExclamationTriangle,
  faExternalLinkAlt,
  faBook
} from '@fortawesome/free-solid-svg-icons';
import { faDiscord, faTelegram } from '@fortawesome/free-brands-svg-icons';

export default function TokenPage() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [activeSection, setActiveSection] = useState<'info' | 'security' | 'buy'>('info');

  const TOKEN_ADDRESS = '3tpz3ar7gaHmPZfhWHzRdPnBJ5MrZZVDxepDtDLYpump';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(TOKEN_ADDRESS);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
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
      <Script id="token-schema" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "$MILAGRE Token - Informações e Segurança",
          "description": "Informações completas sobre o token $MILAGRE: dados técnicos, segurança, transparência e como comprar",
          "url": "https://tokenmilagre.xyz/token"
        })}
      </Script>

      <div className="py-8 max-w-6xl" style={{ paddingLeft: '55px', paddingRight: '1rem' }}>
        <div className="space-y-16">
          {/* Hero */}
          <div className="space-y-6">


            <h1 className="text-4xl md:text-5xl font-bold leading-tight font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
              Token Comunitário{' '}
              <span className="text-brand-primary">$MILAGRE</span>
            </h1>

            <p className="text-xl leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Token SPL na blockchain Solana. Transparência total, comunidade forte, tecnologia de ponta.
            </p>

            {/* Holder Counter */}
            <div className="flex">
              <HolderCounter />
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 border-b" style={{ borderColor: 'var(--border-light)' }}>
            <button
              onClick={() => setActiveSection('info')}
              className={`px-6 py-3 font-semibold transition-all ${activeSection === 'info' ? 'border-b-2' : ''
                }`}
              style={{
                borderColor: activeSection === 'info' ? 'var(--brand-primary)' : 'transparent',
                color: activeSection === 'info' ? 'var(--brand-primary)' : 'var(--text-secondary)'
              }}
            >
              Informações
            </button>
            <button
              onClick={() => setActiveSection('security')}
              className={`px-6 py-3 font-semibold transition-all ${activeSection === 'security' ? 'border-b-2' : ''
                }`}
              style={{
                borderColor: activeSection === 'security' ? 'var(--brand-primary)' : 'transparent',
                color: activeSection === 'security' ? 'var(--brand-primary)' : 'var(--text-secondary)'
              }}
            >
              Segurança
            </button>
            <button
              onClick={() => setActiveSection('buy')}
              className={`px-6 py-3 font-semibold transition-all ${activeSection === 'buy' ? 'border-b-2' : ''
                }`}
              style={{
                borderColor: activeSection === 'buy' ? 'var(--brand-primary)' : 'transparent',
                color: activeSection === 'buy' ? 'var(--brand-primary)' : 'var(--text-secondary)'
              }}
            >
              Como Comprar
            </button>
          </div>

          {/* Informações Section */}
          {activeSection === 'info' && (
            <div className="space-y-12">
              {/* Main Token Card */}
              <div className="backdrop-blur-xl rounded-3xl p-8 md:p-12 border-2 shadow-theme-xl" style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border-medium)'
              }}>
                {/* Header */}
                <div className="flex items-center gap-6 mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden border-2" style={{ borderColor: 'var(--brand-primary)' }}>
                      <Image
                        src="/images/TOKEN-MILAGRE-.webp"
                        alt="$MILAGRE Logo"
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-4xl font-bold font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>$MILAGRE</h3>
                      <p className="text-brand-primary font-semibold">SPL Token • Solana Blockchain</p>
                    </div>
                  </div>
                </div>

                {/* Contract Address */}
                <div className="mb-8">
                  <p className="text-sm font-semibold mb-3" style={{ color: 'var(--brand-primary)' }}>
                    <FontAwesomeIcon icon={faCoins} className="mr-2" />
                    ENDEREÇO DO CONTRATO
                  </p>
                  <div className="rounded-2xl p-4 mb-4 border" style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-medium)'
                  }}>
                    <code className="font-mono text-sm md:text-base break-all" style={{ color: 'var(--text-primary)' }}>
                      {TOKEN_ADDRESS}
                    </code>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      onClick={copyToClipboard}
                      className="px-6 py-3 font-bold rounded-xl transition-all shadow-theme-md hover:scale-105 flex items-center justify-center gap-2"
                      style={{
                        background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-hover))',
                        color: 'var(--text-inverse)'
                      }}
                    >
                      <FontAwesomeIcon icon={faCopy} />
                      <span>{copiedAddress ? 'Copiado!' : 'Copiar'}</span>
                    </button>

                    <a
                      href={`https://solscan.io/token/${TOKEN_ADDRESS}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-gradient-to-r from-purple-400 to-purple-500 hover:from-purple-300 hover:to-purple-400 text-white font-bold rounded-xl transition-all shadow-theme-md hover:scale-105 flex items-center justify-center gap-2"
                    >
                      <FontAwesomeIcon icon={faMagnifyingGlass} />
                      <span>Solscan</span>
                    </a>

                    <a
                      href={`https://pump.fun/coin/${TOKEN_ADDRESS}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-300 hover:to-emerald-400 text-white font-bold rounded-xl transition-all shadow-theme-md hover:scale-105 flex items-center justify-center gap-2"
                    >
                      <FontAwesomeIcon icon={faCoins} />
                      <span>Comprar</span>
                    </a>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Blockchain', value: 'Solana', icon: faCheckCircle, color: '#22c55e' },
                    { label: 'Tipo', value: 'SPL Token', icon: faCheckCircle, color: '#22c55e' },
                    { label: 'Plataforma', value: 'Pump.fun', icon: faInfoCircle, color: '#3b82f6' },
                    { label: 'Velocidade', value: '<1s', icon: faChartLine, color: '#eab308' }
                  ].map((stat, index) => (
                    <div key={index} className="backdrop-blur rounded-xl p-4 border text-center hover:scale-105 transition-all" style={{
                      backgroundColor: 'var(--bg-secondary)',
                      borderColor: 'var(--border-medium)'
                    }}>
                      <FontAwesomeIcon icon={stat.icon} className="mb-2" style={{ color: stat.color }} />
                      <p className="text-xs mb-1 font-semibold" style={{ color: 'var(--text-tertiary)' }}>{stat.label}</p>
                      <p className="font-bold" style={{ color: 'var(--text-primary)' }}>{stat.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pump.fun Info */}
              <div className="backdrop-blur-xl rounded-2xl p-8 border-2" style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--brand-primary)'
              }}>
                <h2 className="text-2xl font-bold mb-6 font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
                  <FontAwesomeIcon icon={faBook} className="mr-3 text-brand-primary" />
                  Sobre o Pump.fun
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                      O que é Pump.fun?
                    </h3>
                    <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      Plataforma que democratiza a criação de tokens na blockchain Solana.
                      Qualquer pessoa pode lançar um token em minutos.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                      Como funciona a Bonding Curve?
                    </h3>
                    <p className="leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
                      O preço do token é definido por uma curva de ligação matemática.
                      Conforme mais pessoas compram, o preço sobe automaticamente.
                    </p>
                    <div className="rounded-xl p-4 border" style={{
                      backgroundColor: 'var(--bg-elevated)',
                      borderColor: 'var(--border-medium)'
                    }}>
                      <p className="text-sm font-semibold mb-2" style={{ color: 'var(--brand-primary)' }}>
                        Status Atual do $MILAGRE:
                      </p>
                      <ul className="space-y-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                        <li>Market Cap Atual: ~$4,6k</li>
                        <li>Meta para Graduação: $69k</li>
                        <li>Progresso: ~6,7% (estágio inicial)</li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                      O que significa "Graduar"?
                    </h3>
                    <p className="leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
                      Quando um token atinge $69k de market cap, o Pump.fun automaticamente:
                    </p>
                    <ul className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      <li className="flex items-start gap-2">
                        <FontAwesomeIcon icon={faCheckCircle} className="text-brand-primary mt-1" />
                        <span>Adiciona liquidez na Raydium (principal DEX da Solana)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <FontAwesomeIcon icon={faCheckCircle} className="text-brand-primary mt-1" />
                        <span>Facilita negociação em exchanges descentralizadas</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <FontAwesomeIcon icon={faCheckCircle} className="text-brand-primary mt-1" />
                        <span>Aumenta visibilidade e acessibilidade do token</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Segurança Section */}
          {activeSection === 'security' && (
            <div className="space-y-12">
              <div>
                <h2 className="text-3xl font-bold mb-4 font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
                  <FontAwesomeIcon icon={faShieldHalved} className="mr-3 text-brand-primary" />
                  Segurança e Transparência
                </h2>
                <p className="text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Todas as informações técnicas e verificações de segurança do token $MILAGRE.
                  Educação e transparência em primeiro lugar.
                </p>
              </div>

              {/* Status de Segurança */}
              <div className="space-y-4">
                {/* Mint Authority */}
                <div className="backdrop-blur rounded-xl p-6 border-2 hover:scale-102 transition-all" style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderColor: 'var(--border-medium)'
                }}>
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{
                      backgroundColor: '#eab30820',
                      border: '2px solid #eab30840'
                    }}>
                      <FontAwesomeIcon icon={faLock} className="text-2xl" style={{ color: '#eab308' }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                        Mint Authority
                      </h3>
                      <p className="mb-3" style={{ color: 'var(--text-secondary)' }}>
                        Controla se novos tokens podem ser criados (cunhagem).
                      </p>
                      <div className="p-3 rounded-lg border" style={{
                        backgroundColor: 'var(--bg-secondary)',
                        borderColor: 'var(--border-medium)'
                      }}>
                        <p className="text-sm">
                          <strong style={{ color: 'var(--brand-primary)' }}>Status:</strong>
                          <span style={{ color: 'var(--text-secondary)' }}> Verificação em andamento</span>
                        </p>
                        <p className="text-xs mt-2" style={{ color: 'var(--text-tertiary)' }}>
                          Você pode verificar usando o Solscan
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Freeze Authority */}
                <div className="backdrop-blur rounded-xl p-6 border-2 hover:scale-102 transition-all" style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderColor: 'var(--border-medium)'
                }}>
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{
                      backgroundColor: '#3b82f620',
                      border: '2px solid #3b82f640'
                    }}>
                      <FontAwesomeIcon icon={faUnlock} className="text-2xl" style={{ color: '#3b82f6' }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                        Freeze Authority
                      </h3>
                      <p className="mb-3" style={{ color: 'var(--text-secondary)' }}>
                        Controla se tokens de usuários podem ser congelados.
                      </p>
                      <div className="p-3 rounded-lg border" style={{
                        backgroundColor: 'var(--bg-secondary)',
                        borderColor: 'var(--border-medium)'
                      }}>
                        <p className="text-sm">
                          <strong style={{ color: 'var(--brand-primary)' }}>Status:</strong>
                          <span style={{ color: 'var(--text-secondary)' }}> Verificação em andamento</span>
                        </p>
                        <p className="text-xs mt-2" style={{ color: 'var(--text-tertiary)' }}>
                          Você pode verificar usando o Solscan
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Verificação Independente */}
              <div className="p-6 rounded-xl border-2" style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--brand-primary)'
              }}>
                <div className="flex items-start gap-4">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="text-3xl text-yellow-500" />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>
                      Verificação Independente Recomendada
                    </h3>
                    <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      Não confie apenas nas informações aqui. Use os exploradores blockchain (Solscan, Solana Explorer)
                      para verificar independentemente o status das autoridades e outras informações técnicas.
                      Sempre faça sua própria pesquisa (DYOR).
                    </p>
                  </div>
                </div>
              </div>

              {/* Como Verificar */}
              <div>
                <h2 className="text-2xl font-bold mb-6 font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
                  Como Verificar Você Mesmo
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="backdrop-blur rounded-xl p-6 border-2" style={{
                    backgroundColor: 'var(--bg-elevated)',
                    borderColor: 'var(--border-medium)'
                  }}>
                    <div className="text-3xl mb-4">1</div>
                    <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                      Acesse o Solscan
                    </h3>
                    <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
                      Visite solscan.io e cole o endereço do contrato na busca.
                    </p>
                    <a
                      href={`https://solscan.io/token/${TOKEN_ADDRESS}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all hover:opacity-90"
                      style={{
                        backgroundColor: 'var(--brand-primary)',
                        color: 'var(--text-inverse)'
                      }}
                    >
                      Abrir Solscan
                      <FontAwesomeIcon icon={faExternalLinkAlt} />
                    </a>
                  </div>

                  <div className="backdrop-blur rounded-xl p-6 border-2" style={{
                    backgroundColor: 'var(--bg-elevated)',
                    borderColor: 'var(--border-medium)'
                  }}>
                    <div className="text-3xl mb-4">2</div>
                    <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                      Verifique as Autoridades
                    </h3>
                    <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
                      Procure pela seção "Authorities" e verifique o status de Mint e Freeze Authority.
                    </p>
                    <div className="p-3 rounded-lg" style={{
                      backgroundColor: 'var(--bg-secondary)'
                    }}>
                      <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                        <strong>REVOKED/NULL</strong> = Seguro<br />
                        <strong>Endereço visível</strong> = Ainda ativo
                      </p>
                    </div>
                  </div>

                  <div className="backdrop-blur rounded-xl p-6 border-2" style={{
                    backgroundColor: 'var(--bg-elevated)',
                    borderColor: 'var(--border-medium)'
                  }}>
                    <div className="text-3xl mb-4">3</div>
                    <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                      Confira o Supply
                    </h3>
                    <p style={{ color: 'var(--text-secondary)' }}>
                      Verifique o fornecimento total (Total Supply) e a distribuição de holders.
                    </p>
                  </div>

                  <div className="backdrop-blur rounded-xl p-6 border-2" style={{
                    backgroundColor: 'var(--bg-elevated)',
                    borderColor: 'var(--border-medium)'
                  }}>
                    <div className="text-3xl mb-4">4</div>
                    <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                      Analise Transações
                    </h3>
                    <p style={{ color: 'var(--text-secondary)' }}>
                      Navegue pelo histórico de transações para entender a atividade do token.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Como Comprar Section */}
          {activeSection === 'buy' && (
            <div className="space-y-12">
              <div>
                <h2 className="text-3xl font-bold mb-4 font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
                  <FontAwesomeIcon icon={faHandHoldingHeart} className="mr-3 text-brand-primary" />
                  Como Comprar $MILAGRE
                </h2>
                <p className="text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Siga este guia passo a passo para adquirir seus tokens e se juntar à nossa comunidade.
                </p>
              </div>

              {/* Steps Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    step: '1',
                    title: 'Instale a Phantom',
                    description: 'Baixe a carteira Phantom (extensão do navegador ou app mobile).'
                  },
                  {
                    step: '2',
                    title: 'Compre Solana (SOL)',
                    description: 'Adquira SOL em exchanges como Binance, Coinbase ou diretamente na Phantom com cartão.'
                  },
                  {
                    step: '3',
                    title: 'Acesse Pump.fun',
                    description: 'Visite pump.fun e conecte sua Phantom Wallet.'
                  },
                  {
                    step: '4',
                    title: 'Troque por $MILAGRE',
                    description: 'Insira a quantidade de SOL, confirme a transação e receba seus $MILAGRE!'
                  }
                ].map((step, index) => (
                  <div
                    key={index}
                    className="relative backdrop-blur-xl rounded-2xl p-6 border-2 hover:scale-105 transition-all duration-300 shadow-theme-lg"
                    style={{
                      backgroundColor: 'var(--bg-elevated)',
                      borderColor: 'var(--border-medium)'
                    }}
                  >
                    {/* Step Badge */}
                    <div className="absolute -top-4 left-6 w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg"
                      style={{
                        background: 'linear-gradient(135deg, #FFA500 0%, #FF8C00 100%)'
                      }}
                    >
                      {step.step}
                    </div>

                    {/* Content */}
                    <div className="mt-8">
                      <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                        {step.title}
                      </h3>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <div className="text-center">
                <a
                  href={`https://pump.fun/coin/${TOKEN_ADDRESS}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 font-bold text-white rounded-xl transition-all shadow-2xl hover:scale-105 text-lg"
                  style={{
                    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                  }}
                >
                  <FontAwesomeIcon icon={faHandHoldingHeart} />
                  <span>Comprar Agora no Pump.fun</span>
                </a>
              </div>
            </div>
          )}

          {/* CTA Final */}
          <div className="space-y-6 py-8 border-t" style={{ borderColor: 'var(--border-light)' }}>
            <h2 className="text-2xl font-bold font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
              Transparência é Nossa Prioridade
            </h2>
            <p className="text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Somos um projeto 100% comunitário e open source. Todas as informações são públicas e verificáveis.
              Se você encontrar alguma inconsistência ou tiver dúvidas, entre em contato com a comunidade.
            </p>

            <div className="flex flex-wrap gap-3">
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
                <FontAwesomeIcon icon={faDiscord} />
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
                <FontAwesomeIcon icon={faTelegram} />
                Telegram
              </a>

              <a
                href="https://github.com/dogespartano-cyber/tokenmilagre-platform"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all hover:opacity-90"
                style={{
                  backgroundColor: '#333',
                  color: 'white'
                }}
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 border-2"
          style={{
            background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-hover))',
            borderColor: 'var(--brand-primary)',
            color: 'var(--text-inverse)'
          }}
          aria-label="Voltar ao topo"
        >
          <FontAwesomeIcon icon={faArrowUp} className="w-6 h-6" />
        </button>
      )}
    </>
  );
}
