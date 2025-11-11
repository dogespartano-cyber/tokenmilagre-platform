'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShieldHalved,
  faArrowUp,
  faCheckCircle,
  faExclamationTriangle,
  faBook,
  faCopy,
  faExternalLinkAlt,
  faInfoCircle,
  faChartLine,
  faLock,
  faUnlock,
  faCoins
} from '@fortawesome/free-solid-svg-icons';

export default function TokenSegurancaPage() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);

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
      <Script id="token-security-schema" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Segurança e Transparência - $MILAGRE Token",
          "description": "Informações completas sobre segurança, transparência e verificação do token $MILAGRE na blockchain Solana",
          "url": "https://tokenmilagre.xyz/token/seguranca"
        })}
      </Script>

      <div className="py-8 max-w-5xl" style={{ paddingLeft: '55px', paddingRight: '1rem' }}>
        <div className="space-y-16">
          {/* Hero */}
          <div className="space-y-6">
            <div className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold" style={{
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--brand-primary)'
            }}>
              <FontAwesomeIcon icon={faShieldHalved} className="mr-2" />
              Transparência Total
            </div>

            <h1 className="text-4xl md:text-5xl font-bold leading-tight font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
              Segurança e Transparência do{' '}
              <span className="text-brand-primary">Token $MILAGRE</span>
            </h1>

            <p className="text-xl leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Todas as informações técnicas, verificações de segurança e guias para você auditar o token por conta própria.
              Educação e transparência em primeiro lugar.
            </p>
          </div>

          {/* Divider */}
          <div className="border-t" style={{ borderColor: 'var(--border-light)' }}></div>

          {/* Contract Address Card */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
              <FontAwesomeIcon icon={faCoins} className="mr-3 text-brand-primary" />
              Endereço do Contrato
            </h2>

            <div className="backdrop-blur-xl rounded-2xl p-6 border-2 shadow-theme-lg" style={{
              backgroundColor: 'var(--bg-elevated)',
              borderColor: 'var(--border-medium)'
            }}>
              <p className="text-sm font-semibold mb-3 text-brand-primary">
                📍 TOKEN SPL (SOLANA BLOCKCHAIN)
              </p>

              <div className="rounded-xl p-4 mb-4 border" style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-medium)'
              }}>
                <code className="font-mono text-sm break-all" style={{ color: 'var(--text-primary)' }}>
                  {TOKEN_ADDRESS}
                </code>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-3 font-bold rounded-xl transition-all shadow-theme-md hover:scale-105 flex items-center justify-center gap-2"
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
                  className="px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white font-bold rounded-xl transition-all shadow-theme-md hover:scale-105 flex items-center justify-center gap-2"
                >
                  <FontAwesomeIcon icon={faExternalLinkAlt} />
                  <span>Solscan</span>
                </a>

                <a
                  href={`https://pump.fun/coin/${TOKEN_ADDRESS}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold rounded-xl transition-all shadow-theme-md hover:scale-105 flex items-center justify-center gap-2"
                >
                  <FontAwesomeIcon icon={faExternalLinkAlt} />
                  <span>Pump.fun</span>
                </a>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t" style={{ borderColor: 'var(--border-light)' }}></div>

          {/* Dados Técnicos */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
              <FontAwesomeIcon icon={faInfoCircle} className="mr-3 text-brand-primary" />
              Informações Técnicas
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                { label: 'Blockchain', value: 'Solana', icon: faCheckCircle, color: '#22c55e' },
                { label: 'Tipo de Token', value: 'SPL Token', icon: faCheckCircle, color: '#22c55e' },
                { label: 'Plataforma', value: 'Pump.fun', icon: faInfoCircle, color: '#3b82f6' },
                { label: 'Market Cap', value: '~$4,6k', icon: faChartLine, color: '#eab308' },
                { label: 'Status', value: 'Bonding Curve', icon: faExclamationTriangle, color: '#f59e0b' },
                { label: 'Meta de Graduação', value: '$69k', icon: faChartLine, color: '#8b5cf6' }
              ].map((item, index) => (
                <div key={index} className="backdrop-blur rounded-xl p-6 border hover:scale-102 transition-all" style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderColor: 'var(--border-medium)'
                }}>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{
                      backgroundColor: `${item.color}20`,
                      border: `2px solid ${item.color}40`
                    }}>
                      <FontAwesomeIcon icon={item.icon} className="text-xl" style={{ color: item.color }} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm mb-1 font-semibold" style={{ color: 'var(--text-tertiary)' }}>
                        {item.label}
                      </p>
                      <p className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
                        {item.value}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t" style={{ borderColor: 'var(--border-light)' }}></div>

          {/* O que é Pump.fun */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
              <FontAwesomeIcon icon={faBook} className="mr-3 text-brand-primary" />
              Entendendo o Pump.fun
            </h2>

            <div className="backdrop-blur-xl rounded-2xl p-8 border-2" style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--brand-primary)'
            }}>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                    🎯 O que é Pump.fun?
                  </h3>
                  <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    Pump.fun é uma plataforma que democratiza a criação de tokens na blockchain Solana.
                    Qualquer pessoa pode lançar um token em minutos, pagando apenas uma pequena taxa (~0,02 SOL).
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                    📈 Como funciona a Bonding Curve?
                  </h3>
                  <p className="leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
                    O preço do token é definido por uma <strong>curva de ligação (bonding curve)</strong> -
                    conforme mais pessoas compram, o preço sobe automaticamente seguindo uma fórmula matemática.
                  </p>
                  <div className="rounded-xl p-4 border" style={{
                    backgroundColor: 'var(--bg-elevated)',
                    borderColor: 'var(--border-medium)'
                  }}>
                    <p className="text-sm font-semibold mb-2" style={{ color: 'var(--brand-primary)' }}>
                      📊 Status Atual do $MILAGRE:
                    </p>
                    <ul className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      <li>• <strong>Market Cap Atual:</strong> ~$4,6k</li>
                      <li>• <strong>Meta para Graduação:</strong> $69k</li>
                      <li>• <strong>Progresso:</strong> ~6,7% (estágio inicial)</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                    🎓 O que significa "Graduar"?
                  </h3>
                  <p className="leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
                    Quando um token atinge <strong>$69k de market cap</strong>, o Pump.fun automaticamente:
                  </p>
                  <ul className="space-y-2" style={{ color: 'var(--text-secondary)' }}>
                    <li className="flex items-start gap-2">
                      <span className="text-brand-primary">✓</span>
                      <span>Adiciona liquidez na <strong>Raydium</strong> (principal DEX da Solana)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-brand-primary">✓</span>
                      <span>Facilita negociação em exchanges descentralizadas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-brand-primary">✓</span>
                      <span>Aumenta visibilidade e acessibilidade do token</span>
                    </li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border-2" style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderColor: '#eab308'
                }}>
                  <p className="text-sm flex items-start gap-2">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="text-yellow-500 mt-1" />
                    <span style={{ color: 'var(--text-secondary)' }}>
                      <strong style={{ color: 'var(--text-primary)' }}>Importante:</strong> Estamos em estágio inicial.
                      O market cap de $4,6k reflete o início da jornada, não um projeto abandonado.
                      Transparência é nossa prioridade.
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t" style={{ borderColor: 'var(--border-light)' }}></div>

          {/* Status de Segurança */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
              <FontAwesomeIcon icon={faShieldHalved} className="mr-3 text-brand-primary" />
              Status de Segurança
            </h2>

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
                        💡 Você pode verificar usando os links do Solscan acima
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
                        💡 Você pode verificar usando os links do Solscan acima
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl border-2" style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--brand-primary)'
            }}>
              <div className="flex items-start gap-4">
                <div className="text-3xl">🔍</div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>
                    Verificação Independente Recomendada
                  </h3>
                  <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    Não confie apenas nas informações aqui. Use os exploradores blockchain (Solscan, Solana Explorer)
                    para verificar independentemente o status das autoridades e outras informações técnicas.
                    <strong> Sempre faça sua própria pesquisa (DYOR).</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t" style={{ borderColor: 'var(--border-light)' }}></div>

          {/* Como Verificar */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
              📚 Como Verificar Você Mesmo
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="backdrop-blur rounded-xl p-6 border-2" style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderColor: 'var(--border-medium)'
                }}>
                  <div className="text-3xl mb-4">1️⃣</div>
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
              </div>

              <div className="space-y-4">
                <div className="backdrop-blur rounded-xl p-6 border-2" style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderColor: 'var(--border-medium)'
                }}>
                  <div className="text-3xl mb-4">2️⃣</div>
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
                      ✅ <strong>REVOKED/NULL</strong> = Seguro<br />
                      ⚠️ <strong>Endereço visível</strong> = Ainda ativo
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="backdrop-blur rounded-xl p-6 border-2" style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderColor: 'var(--border-medium)'
                }}>
                  <div className="text-3xl mb-4">3️⃣</div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                    Confira o Supply
                  </h3>
                  <p style={{ color: 'var(--text-secondary)' }}>
                    Verifique o fornecimento total (Total Supply) e a distribuição de holders.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="backdrop-blur rounded-xl p-6 border-2" style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderColor: 'var(--border-medium)'
                }}>
                  <div className="text-3xl mb-4">4️⃣</div>
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

          {/* Divider */}
          <div className="border-t" style={{ borderColor: 'var(--border-light)' }}></div>

          {/* CTA Final */}
          <div className="space-y-6 py-8">
            <h2 className="text-3xl font-bold font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
              Transparência é Nossa Prioridade
            </h2>
            <p className="text-xl leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Somos um projeto 100% comunitário e open source. Todas as informações são públicas e verificáveis.
              Se você encontrar alguma inconsistência ou tiver dúvidas, entre em contato com a comunidade.
            </p>
            <p className="text-2xl font-bold text-brand-primary">
              Juntos, construímos confiança. 💚
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
