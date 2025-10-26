'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faArrowLeft, faArrowRight, faExternalLinkAlt, faCheckCircle, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { Resource } from '@/lib/resources';
import Link from 'next/link';

interface ResourceDetailClientProps {
  resource: Resource;
  relatedResources: Resource[];
}

export default function ResourceDetailClient({ resource, relatedResources }: ResourceDetailClientProps) {
  const router = useRouter();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Função para retornar gradiente baseado na categoria
  const getCategoryGradient = (category: string) => {
    const gradients: Record<string, string> = {
      'wallets': 'linear-gradient(135deg, #F6851B 0%, #E2761B 100%)', // Laranja (MetaMask)
      'exchanges': 'linear-gradient(135deg, #F3BA2F 0%, #EAA42D 100%)', // Dourado (Binance)
      'defi': 'linear-gradient(135deg, #FF007A 0%, #E6006E 100%)', // Rosa (Uniswap)
      'explorers': 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)', // Azul
      'tools': 'linear-gradient(135deg, #10B981 0%, #059669 100%)', // Verde
      'browsers': 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)', // Roxo-azul
    };
    return gradients[category] || 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)'; // Roxo padrão
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      'wallets': 'Wallet',
      'exchanges': 'Exchange',
      'defi': 'DeFi',
      'explorers': 'Explorador',
      'tools': 'Ferramenta',
      'browsers': 'Navegador',
    };
    return labels[category] || category;
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
      <div className="py-8">
        <div className="flex gap-8" style={{ paddingLeft: '55px', paddingRight: '1rem' }}>
          <div className="flex-1 max-w-4xl space-y-8">
            {/* Botão Voltar */}
            <button
              onClick={() => router.push('/recursos')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90 hover:scale-105"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-primary)'
              }}
            >
              <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4" />
              Voltar para Recursos
            </button>

            {/* Header */}
            <div className="space-y-6">
              {/* Meta badges */}
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className="px-3 py-1 rounded-lg text-sm font-semibold"
                  style={{
                    backgroundColor: 'var(--brand-primary)',
                    color: 'var(--text-inverse)'
                  }}
                >
                  ✓ Verificado
                </span>
                <span
                  className="px-3 py-1 rounded-lg text-sm font-semibold"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-primary)'
                  }}
                >
                  {getCategoryLabel(resource.category)}
                </span>
              </div>

              {/* Título */}
              <h1 className="text-4xl md:text-5xl font-bold leading-tight font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
                {resource.name}
              </h1>

              {/* Descrição */}
              <p className="text-xl leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {resource.hero.description}
              </p>

              {/* Botão Acessar Site */}
              <div className="flex flex-wrap gap-3 pt-4">
                <a
                  href={resource.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white transition-all hover:scale-105 hover:shadow-xl"
                  style={{ background: getCategoryGradient(resource.category) }}
                >
                  Acessar site oficial
                  <FontAwesomeIcon icon={faExternalLinkAlt} className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t" style={{ borderColor: 'var(--border-light)' }}></div>

            {/* Por que é bom */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
                {resource.whyGood.title}
              </h2>
              {resource.whyGood.content.map((paragraph, index) => (
                <p
                  key={index}
                  className="leading-relaxed"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {paragraph}
                </p>
              ))}
            </section>

            {/* Divider */}
            <div className="border-t" style={{ borderColor: 'var(--border-light)' }}></div>

            {/* Recursos Principais */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
                Recursos Principais
              </h2>
              <div className="space-y-4">
                {resource.features.map((feature, index) => (
                  <div
                    key={index}
                    className="p-5 rounded-xl border transition-all hover:shadow-md"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      borderColor: 'var(--border-light)'
                    }}
                  >
                    <h3 className="text-lg font-bold mb-2 font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
                      {feature.title}
                    </h3>
                    <p style={{ color: 'var(--text-secondary)' }}>
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Wallets Compatíveis - Condicional (apenas navegadores) */}
            {resource.showCompatibleWallets && (
              <>
                {/* Divider */}
                <div className="border-t" style={{ borderColor: 'var(--border-light)' }}></div>

                <section className="space-y-6">
                  <h2 className="text-2xl font-bold font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
                    Wallets Compatíveis
                  </h2>
                  <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    Você pode usar essas wallets populares como extensões no {resource.name}:
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Link
                      href="/recursos/metamask"
                      className="p-4 rounded-xl border transition-all hover:shadow-md hover:scale-105 text-center"
                      style={{
                        backgroundColor: 'var(--bg-secondary)',
                        borderColor: 'var(--border-light)'
                      }}
                    >
                      <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>
                        MetaMask
                      </h3>
                    </Link>
                    <Link
                      href="/recursos/phantom"
                      className="p-4 rounded-xl border transition-all hover:shadow-md hover:scale-105 text-center"
                      style={{
                        backgroundColor: 'var(--bg-secondary)',
                        borderColor: 'var(--border-light)'
                      }}
                    >
                      <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>
                        Phantom
                      </h3>
                    </Link>
                    <Link
                      href="/recursos/ledger"
                      className="p-4 rounded-xl border transition-all hover:shadow-md hover:scale-105 text-center"
                      style={{
                        backgroundColor: 'var(--bg-secondary)',
                        borderColor: 'var(--border-light)'
                      }}
                    >
                      <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>
                        Ledger
                      </h3>
                    </Link>
                    <Link
                      href="/recursos/trust-wallet"
                      className="p-4 rounded-xl border transition-all hover:shadow-md hover:scale-105 text-center"
                      style={{
                        backgroundColor: 'var(--bg-secondary)',
                        borderColor: 'var(--border-light)'
                      }}
                    >
                      <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>
                        Trust Wallet
                      </h3>
                    </Link>
                  </div>
                </section>
              </>
            )}

            {/* Divider */}
            <div className="border-t" style={{ borderColor: 'var(--border-light)' }}></div>

            {/* Como Começar */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
                {resource.howToStart.title}
              </h2>
              <div className="space-y-4">
                {resource.howToStart.steps.map((step) => (
                  <div
                    key={step.number}
                    className="flex gap-4 p-5 rounded-xl"
                    style={{ backgroundColor: 'var(--bg-secondary)' }}
                  >
                    <div
                      className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold"
                      style={{
                        backgroundColor: 'var(--brand-primary)',
                        color: 'var(--text-inverse)'
                      }}
                    >
                      {step.number}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-1 font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
                        {step.title}
                      </h3>
                      <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Divider */}
            <div className="border-t" style={{ borderColor: 'var(--border-light)' }}></div>

            {/* Prós e Contras */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
                Análise Honesta: Prós e Contras
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Prós */}
                <div
                  className="p-6 rounded-xl border-2"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: '#10B981'
                  }}
                >
                  <h3 className="text-xl font-bold mb-4 font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
                    Vantagens
                  </h3>
                  <ul className="space-y-2">
                    {resource.prosAndCons.pros.map((pro, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        <span style={{ color: 'var(--text-secondary)' }}>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Contras */}
                <div
                  className="p-6 rounded-xl border-2"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: '#F59E0B'
                  }}
                >
                  <h3 className="text-xl font-bold mb-4 font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
                    Limitações
                  </h3>
                  <ul className="space-y-2">
                    {resource.prosAndCons.cons.map((con, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-amber-500 mt-1">•</span>
                        <span style={{ color: 'var(--text-secondary)' }}>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Divider */}
            <div className="border-t" style={{ borderColor: 'var(--border-light)' }}></div>

            {/* FAQ */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
                Perguntas Frequentes
              </h2>
              <div className="space-y-3">
                {resource.faq.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-xl border overflow-hidden"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      borderColor: 'var(--border-light)'
                    }}
                  >
                    <button
                      onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                      className="w-full p-5 flex items-center justify-between text-left transition-colors hover:opacity-80"
                    >
                      <h3 className="text-lg font-bold pr-4 font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
                        {item.question}
                      </h3>
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform ${openFaqIndex === index ? 'rotate-180' : ''}`}
                        style={{
                          backgroundColor: 'var(--brand-primary)',
                          color: 'var(--text-inverse)'
                        }}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>
                    {openFaqIndex === index && (
                      <div className="px-5 pb-5">
                        <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                          {item.answer}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Divider */}
            <div className="border-t" style={{ borderColor: 'var(--border-light)' }}></div>

            {/* Dicas de Segurança */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
                Dicas de Segurança
              </h2>
              <div className="space-y-3">
                {resource.securityTips.map((tip, index) => (
                  <div
                    key={index}
                    className="p-5 rounded-xl"
                    style={{ backgroundColor: 'var(--bg-secondary)' }}
                  >
                    <h3 className="font-bold mb-1 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                          backgroundColor: 'var(--brand-primary)',
                          color: 'var(--text-inverse)'
                        }}
                      >
                        <FontAwesomeIcon icon={faChevronRight} className="w-2.5 h-2.5" />
                      </div>
                      {tip.title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      {tip.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Recursos Relacionados */}
            {relatedResources && relatedResources.length > 0 && (
              <>
                {/* Divider */}
                <div className="border-t" style={{ borderColor: 'var(--border-light)' }}></div>

                <section className="space-y-6">
                  <h2 className="text-2xl font-bold font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
                    Você Também Pode Gostar
                  </h2>
                  <div className="grid md:grid-cols-3 gap-4">
                    {relatedResources.map((relatedResource) => (
                      <Link
                        key={relatedResource.slug}
                        href={`/recursos/${relatedResource.slug}`}
                        className="group p-5 rounded-xl border transition-all hover:shadow-lg hover:-translate-y-1"
                        style={{
                          backgroundColor: 'var(--bg-secondary)',
                          borderColor: 'var(--border-light)'
                        }}
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span
                              className="px-2 py-1 rounded text-xs font-bold"
                              style={{
                                backgroundColor: 'var(--bg-elevated)',
                                color: 'var(--text-tertiary)'
                              }}
                            >
                              {relatedResource.category === 'browsers' ? 'Navegador' : relatedResource.category}
                            </span>
                            <div
                              className="w-6 h-6 rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform"
                              style={{ background: getCategoryGradient(relatedResource.category) }}
                            >
                              <svg
                                className="w-3.5 h-3.5 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                              </svg>
                            </div>
                          </div>
                          <h3 className="text-lg font-bold font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
                            {relatedResource.name}
                          </h3>
                          <p className="text-sm line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                            {relatedResource.shortDescription}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110"
          style={{
            backgroundColor: 'var(--brand-primary)',
            color: 'var(--text-inverse)'
          }}
          aria-label="Voltar ao topo"
        >
          <FontAwesomeIcon icon={faArrowUp} className="w-5 h-5" />
        </button>
      )}
    </>
  );
}
