'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Script from 'next/script';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { faDiscord, faTelegram } from '@fortawesome/free-brands-svg-icons';

export default function DoacoesPage() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState('');

  const donationMethods = [
    {
      image: '/images/TOKEN-MILAGRE-Hero.webp',
      title: '$MILAGRE Token',
      description: 'Apoie com nosso token nativo',
      address: '3tpz3ar7gaHmPZfhWHzRdPnBJ5MrZZVDxepDtDLYpump',
      network: 'Solana SPL',
      imageSize: 80
    },
    {
      image: '/images/Solana_logo1.webp',
      title: 'Solana (SOL)',
      description: 'Rápido, seguro e com taxas baixíssimas',
      address: 'Em breve',
      network: 'Solana Mainnet',
      imageSize: 80
    }
  ];

  const impactAreas = [
    {
      icon: '🎓',
      title: 'Educação Gratuita',
      description: 'Manutenção da plataforma educacional, criação de novos conteúdos, tutoriais e materiais didáticos para toda a comunidade.',
      percentage: '40%'
    },
    {
      icon: '💻',
      title: 'Desenvolvimento',
      description: 'Melhorias na plataforma, novas funcionalidades, segurança e infraestrutura para manter tudo funcionando perfeitamente.',
      percentage: '30%'
    },
    {
      icon: '🤝',
      title: 'Apoio Comunitário',
      description: 'Programas de suporte a membros, eventos, meetups e iniciativas que fortalecem nossa rede de apoio mútuo.',
      percentage: '20%'
    },
    {
      icon: '🌱',
      title: 'Crescimento',
      description: 'Marketing ético, parcerias estratégicas e expansão da comunidade para alcançar mais pessoas que precisam de apoio.',
      percentage: '10%'
    }
  ];

  const whyDonate = [
    {
      title: '100% Transparente',
      description: 'Todas as doações e gastos são registrados publicamente na blockchain. Você pode verificar cada transação.'
    },
    {
      title: 'Sem Intermediários',
      description: 'Sua doação vai diretamente para a comunidade. Sem bancos, sem taxas abusivas, sem burocracia.'
    },
    {
      title: 'Impacto Real',
      description: 'Cada centavo é investido em recursos que beneficiam milhares de pessoas. Você vê o resultado do seu apoio.'
    },
    {
      title: 'Comunidade Ativa',
      description: 'Não somos uma organização anônima. Somos pessoas reais, trabalhando todos os dias para fazer a diferença.'
    }
  ];

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(label);
    setTimeout(() => setCopiedAddress(''), 2000);
  };

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
      <Script id="donation-schema" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Doações - $MILAGRE Community",
          "description": "Apoie o desenvolvimento da plataforma educacional e comunitária $MILAGRE",
          "url": "https://tokenmilagre.xyz/doacoes"
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
              Apoie a Comunidade
            </div>

            <h1 className="text-4xl md:text-5xl font-bold leading-tight font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
              Juntos, construímos um futuro onde{' '}
              <span className="text-brand-primary">ninguém caminha sozinho</span>
            </h1>

            <p className="text-xl leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Sua doação mantém nossa plataforma educacional gratuita, apoia o desenvolvimento comunitário
              e ajuda milhares de pessoas a aprenderem sobre blockchain e criptomoedas.
            </p>

            <div className="p-6 rounded-2xl border-2" style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--brand-primary)'
            }}>
              <div className="flex items-start gap-4">
                <div className="text-3xl">💝</div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>
                    Por que sua doação é importante?
                  </h3>
                  <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    O $MILAGRE é um projeto 100% comunitário e sem fins lucrativos. Não temos investidores,
                    não cobramos mensalidades e não vendemos seus dados. Dependemos exclusivamente do apoio
                    de pessoas que acreditam em nossa missão de democratizar o acesso à educação em blockchain.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t" style={{ borderColor: 'var(--border-light)' }}></div>

          {/* Como sua doação ajuda */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
              Como Sua Doação é Utilizada
            </h2>

            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
              Somos completamente transparentes sobre como cada centavo é investido na comunidade:
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              {impactAreas.map((area, index) => (
                <div key={index} className="p-6 rounded-xl border" style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderColor: 'var(--border-light)'
                }}>
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">{area.icon}</div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                          {area.title}
                        </h3>
                        <span className="text-sm font-bold px-2 py-1 rounded" style={{
                          backgroundColor: 'var(--bg-secondary)',
                          color: 'var(--brand-primary)'
                        }}>
                          {area.percentage}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        {area.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-lg border" style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-light)'
            }}>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                <strong style={{ color: 'var(--text-primary)' }}>Transparência Total:</strong> Todos os gastos
                são documentados e discutidos com a comunidade. Você pode acompanhar o uso dos recursos
                em nosso Discord e através das transações públicas na blockchain.
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t" style={{ borderColor: 'var(--border-light)' }}></div>

          {/* Por que confiar em nós */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
              Por Que Confiar em Nós?
            </h2>

            <div className="grid sm:grid-cols-2 gap-6">
              {whyDonate.map((reason, index) => (
                <div key={index} className="space-y-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl" style={{
                    backgroundColor: 'var(--bg-secondary)'
                  }}>
                    {index === 0 ? '🔍' : index === 1 ? '⚡' : index === 2 ? '🎯' : '👥'}
                  </div>
                  <h3 className="text-xl font-bold font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
                    {reason.title}
                  </h3>
                  <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {reason.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t" style={{ borderColor: 'var(--border-light)' }}></div>

          {/* Métodos de Doação */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-2 font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
                Métodos de Doação
              </h2>
              <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                Escolha a forma que preferir para apoiar nossa comunidade:
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {donationMethods.map((method, index) => (
                <div key={index} className="p-6 rounded-xl border" style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderColor: 'var(--border-light)'
                }}>
                  <div className="flex flex-col items-center text-center">
                    <div className="flex items-center justify-center mb-2" style={{
                      width: `${method.imageSize}px`,
                      height: `${method.imageSize}px`
                    }}>
                      <Image
                        src={method.image}
                        alt={method.title}
                        width={method.imageSize}
                        height={method.imageSize}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="mb-4">
                      <h3 className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                        {method.title}
                      </h3>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {method.description}
                      </p>
                    </div>

                    {method.address !== 'Em breve' ? (
                      <div className="w-full">
                        <div className="flex flex-col gap-2">
                          <code className="px-3 py-2 rounded text-xs font-mono break-all" style={{
                            backgroundColor: 'var(--bg-secondary)',
                            color: 'var(--text-primary)'
                          }}>
                            {method.address}
                          </code>
                          <button
                            onClick={() => copyToClipboard(method.address, method.title)}
                            className="w-full px-4 py-2 rounded font-semibold text-sm transition-all hover:opacity-80"
                            style={{
                              backgroundColor: 'var(--brand-primary)',
                              color: 'var(--text-inverse)'
                            }}
                          >
                            {copiedAddress === method.title ? '✓ Copiado!' : 'Copiar Endereço'}
                          </button>
                        </div>
                        <p className="text-xs mt-2" style={{ color: 'var(--text-tertiary)' }}>
                          Rede: {method.network}
                        </p>
                      </div>
                    ) : (
                      <div className="w-full px-3 py-2 rounded text-sm" style={{
                        backgroundColor: 'var(--bg-secondary)',
                        color: 'var(--text-tertiary)'
                      }}>
                        Endereço em breve
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 rounded-xl border-2" style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--brand-primary)'
            }}>
              <div className="flex items-start gap-4">
                <div className="text-3xl">⚠️</div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>
                    Importante: Segurança em Primeiro Lugar
                  </h3>
                  <ul className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <li>• Verifique sempre o endereço antes de enviar (use nosso site oficial)</li>
                    <li>• Confira a rede correta (Solana Mainnet para SOL e tokens SPL)</li>
                    <li>• Nunca compartilhe suas chaves privadas ou seeds com ninguém</li>
                    <li>• Em caso de dúvidas, consulte nossa comunidade no Discord ou Telegram</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t" style={{ borderColor: 'var(--border-light)' }}></div>

          {/* Outras formas de ajudar */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
              Outras Formas de Ajudar
            </h2>

            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
              Não pode doar agora? Existem outras formas valiosas de apoiar nossa comunidade:
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="text-3xl">📣</div>
                <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Divulgue</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Compartilhe nosso conteúdo educacional e ajude mais pessoas a aprenderem sobre blockchain
                </p>
              </div>

              <div className="space-y-3">
                <div className="text-3xl">✍️</div>
                <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Contribua</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Escreva artigos, crie tutoriais ou traduza conteúdo para outros idiomas
                </p>
              </div>

              <div className="space-y-3">
                <div className="text-3xl">💬</div>
                <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Participe</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Seja ativo na comunidade, tire dúvidas e ajude outros membros
                </p>
              </div>

              <div className="space-y-3">
                <div className="text-3xl">🐛</div>
                <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Reporte Bugs</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Encontrou algum problema? Nos ajude a melhorar reportando bugs e sugerindo melhorias
                </p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t" style={{ borderColor: 'var(--border-light)' }}></div>

          {/* CTA Final */}
          <div className="space-y-6 py-8">
            <h2 className="text-3xl font-bold font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
              Cada Doação Faz a Diferença
            </h2>
            <p className="text-xl leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Não importa o valor - cada contribuição nos ajuda a continuar oferecendo educação
              gratuita e de qualidade para milhares de pessoas ao redor do mundo.
            </p>
            <p className="text-2xl font-bold text-brand-primary">
              Obrigado por fazer parte desta família! 💚
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
