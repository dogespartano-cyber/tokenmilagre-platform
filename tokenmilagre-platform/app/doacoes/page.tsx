'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Script from 'next/script';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowUp,
  faCopy,
  faCheckCircle,
  faHeart
} from '@fortawesome/free-solid-svg-icons';
import { faDiscord, faTelegram } from '@fortawesome/free-brands-svg-icons';

export default function DoacoesPage() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  const donationMethods = [
    {
      image: '/images/method-milagre.webp',
      title: '$MILAGRE Token',
      description: 'Apoie com nosso token nativo',
      address: '3tpz3ar7gaHmPZfhWHzRdPnBJ5MrZZVDxepDtDLYpump',
      network: 'Solana SPL',
      imageSize: 220,
      color: '#4caf50', // Green
      gradient: 'linear-gradient(135deg, #4caf50, #81c784)'
    },
    {
      image: '/images/method-solana.webp',
      title: 'Solana (SOL)',
      description: 'Rápido, seguro e com taxas baixíssimas',
      address: 'Em breve',
      network: 'Solana Mainnet',
      imageSize: 220,
      color: '#2196f3', // Blue
      gradient: 'linear-gradient(135deg, #2196f3, #64b5f6)'
    }
  ];

  const impactAreas = [
    {
      title: 'Educação Gratuita',
      description: 'Manutenção da plataforma, criação de novos conteúdos e tutoriais.',
      percentage: '40%',
      color: '#4caf50', // Green
      image: '/images/impact-education.webp'
    },
    {
      title: 'Desenvolvimento',
      description: 'Melhorias de segurança, novas features e infraestrutura.',
      percentage: '30%',
      color: '#2196f3', // Blue
      image: '/images/impact-dev.webp'
    },
    {
      title: 'Apoio Comunitário',
      description: 'Eventos, suporte a membros e iniciativas de ajuda mútua.',
      percentage: '20%',
      color: '#ff9800', // Orange
      image: '/images/impact-community.webp'
    },
    {
      title: 'Crescimento',
      description: 'Marketing ético e expansão para alcançar mais pessoas.',
      percentage: '10%',
      color: '#0D9488', // Teal
      image: '/images/impact-growth.webp'
    }
  ];

  const whyDonate = [
    {
      title: '100% Transparente',
      description: 'Todas as doações e gastos são registrados publicamente na blockchain.',
      color: '#4caf50'
    },
    {
      title: 'Sem Intermediários',
      description: 'Sua doação vai diretamente para a comunidade. Sem bancos ou taxas abusivas.',
      color: '#ffc107'
    },
    {
      title: 'Impacto Real',
      description: 'Cada centavo é investido em recursos que beneficiam milhares de pessoas.',
      color: '#f44336'
    },
    {
      title: 'Comunidade Ativa',
      description: 'Somos pessoas reais, trabalhando todos os dias para fazer a diferença.',
      color: '#2196f3'
    }
  ];

  const copyToClipboard = (text: string, label: string) => {
    if (text === 'Em breve') return;
    navigator.clipboard.writeText(text);
    setCopiedAddress(label);
    setTimeout(() => setCopiedAddress(''), 2000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    setIsVisible(true);
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

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800&family=Inter:wght@400;500;600&display=swap');

        .font-montserrat {
          font-family: 'Montserrat', sans-serif;
        }

        .font-inter {
          font-family: 'Inter', sans-serif;
        }

        /* Glassmorphism Card - Theme Aware */
        .glass-card {
          background: rgba(255, 255, 255, 0.8); /* Light mode default */
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(0, 0, 0, 0.05);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.05);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .glass-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 50px 0 rgba(0, 0, 0, 0.1);
          background: rgba(255, 255, 255, 0.95);
          border-color: rgba(0, 0, 0, 0.1);
        }

        /* Dark Mode Overrides */
        [data-theme="dark"] .glass-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2);
        }

        [data-theme="dark"] .glass-card:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.15);
          box-shadow: 0 20px 50px 0 rgba(0, 0, 0, 0.3);
        }

        /* Floating Animation */
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        /* Gradient Text */
        .gradient-text {
          background: linear-gradient(135deg, #4caf50, #ffb703, #fb8500);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      <div className="min-h-screen relative overflow-hidden bg-[var(--bg-primary)] transition-colors duration-300">
        {/* Background Elements - Theme Aware */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-green-500/5 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className={`relative z-10 max-w-7xl mx-auto px-6 py-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

          {/* Hero Section - Split Layout */}
          <section className="flex flex-col-reverse lg:flex-row items-center gap-12 mb-32 min-h-[80vh]">
            {/* Left: Content */}
            <div className="flex-1 text-center lg:text-left space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border-light)] backdrop-blur-sm">
                <FontAwesomeIcon icon={faHeart} className="text-red-500 animate-pulse" />
                <span className="text-sm font-inter text-[var(--text-secondary)]">Apoie nossa causa</span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-montserrat font-bold leading-tight text-[var(--text-primary)]">
                Construindo <br />
                <span className="gradient-text">Esperança</span> <br />
                Juntos
              </h1>

              <p className="text-xl font-inter leading-relaxed text-[var(--text-secondary)] max-w-xl mx-auto lg:mx-0">
                Sua doação é o combustível que mantém nossa plataforma educacional gratuita e acessível para todos.
                <span className="font-semibold text-[var(--text-primary)]"> Ninguém caminha sozinho.</span>
              </p>

              <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
                <button
                  onClick={() => document.getElementById('donation-methods')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-4 rounded-full bg-green-600 hover:bg-green-500 text-white font-bold font-montserrat transition-all shadow-lg hover:shadow-green-500/20"
                >
                  Fazer uma Doação
                </button>
                <a
                  href="https://discord.gg/xk4zrz8j"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 rounded-full bg-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)] border border-[var(--border-light)] text-[var(--text-primary)] font-bold font-montserrat transition-all backdrop-blur-sm"
                >
                  Juntar-se à Comunidade
                </a>
              </div>
            </div>

            {/* Right: Hero Image (Floating) */}
            <div className="flex-1 relative w-full h-[500px] lg:h-[700px]">
              <div className="absolute inset-0 animate-float rounded-[21px] overflow-hidden">
                <Image
                  src="/images/donations-hero-v2.webp"
                  alt="Doações Hero"
                  fill
                  className="object-contain drop-shadow-2xl rounded-[21px]"
                  priority
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/images/Token-MILAGRE-2.webp";
                  }}
                />
              </div>
              {/* Decorative glow behind image */}
              <div className="absolute inset-0 bg-gradient-to-tr from-green-500/20 to-blue-500/20 blur-[100px] -z-10 rounded-full"></div>
            </div>
          </section>

          {/* Donation Methods - Large Showcase Cards */}
          <section id="donation-methods" className="mb-32 scroll-mt-20">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-montserrat font-bold mb-6 text-[var(--text-primary)]">
                Escolha Como Apoiar
              </h2>
              <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
                Aceitamos contribuições diretas via Blockchain para garantir transparência total.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {donationMethods.map((method, index) => (
                <div key={index} className="glass-card p-10 rounded-[21px] relative overflow-hidden group text-center">
                  {/* Background Glow */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-[80px] opacity-20 group-hover:opacity-30 transition-opacity" style={{ backgroundColor: method.color }}></div>

                  {/* Large Token Image */}
                  <div className="relative h-64 w-full mb-8 animate-float rounded-[21px] overflow-hidden" style={{ animationDelay: `${index * 0.5}s` }}>
                    <Image
                      src={method.image}
                      alt={method.title}
                      fill
                      className="object-contain drop-shadow-2xl rounded-[21px]"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (method.image.includes('method-milagre')) {
                          target.src = "/images/TOKEN-MILAGRE-Hero.webp";
                        } else if (method.image.includes('method-solana')) {
                          target.src = "/images/Solana_logo1.webp";
                        }
                      }}
                    />
                  </div>

                  <h3 className="text-3xl font-montserrat font-bold mb-3 text-[var(--text-primary)]">
                    {method.title}
                  </h3>
                  <p className="text-lg text-[var(--text-secondary)] mb-8">
                    {method.description}
                  </p>

                  {/* Address Box */}
                  <div className="bg-[var(--bg-tertiary)] rounded-[21px] p-6 backdrop-blur-md border border-[var(--border-light)] group-hover:border-[var(--border-medium)] transition-colors">
                    <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-widest mb-2">Endereço da Carteira ({method.network})</p>
                    <code className="block text-sm md:text-base font-mono break-all mb-4 text-green-600 dark:text-green-400">
                      {method.address}
                    </code>
                    <button
                      onClick={() => copyToClipboard(method.address, method.title)}
                      disabled={method.address === 'Em breve'}
                      className={`w-full py-4 rounded-[16px] font-bold text-sm transition-all flex items-center justify-center gap-3 ${method.address === 'Em breve' ? 'opacity-50 cursor-not-allowed bg-gray-200 dark:bg-gray-800 text-[var(--text-muted)]' : 'bg-[var(--bg-primary)] text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] shadow-sm'
                        }`}
                    >
                      {copiedAddress === method.title ? (
                        <>
                          <FontAwesomeIcon icon={faCheckCircle} className="text-green-600" />
                          Endereço Copiado!
                        </>
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faCopy} />
                          {method.address === 'Em breve' ? 'Em Breve' : 'Copiar Endereço'}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Impact Areas - Visual Grid */}
          <section className="mb-32">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-montserrat font-bold mb-6 text-[var(--text-primary)]">
                Seu Impacto Visualizado
              </h2>
              <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
                Para onde vai cada recurso investido na comunidade.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {impactAreas.map((area, index) => (
                <div key={index} className="glass-card p-6 rounded-[21px] group hover:border-opacity-50 transition-all">
                  {/* Top Half: Image - Now fully rounded with padding */}
                  <div className="relative h-64 w-full mb-6 rounded-[21px] overflow-hidden shadow-lg">
                    <Image
                      src={area.image}
                      alt={area.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700 rounded-[21px]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)]/80 to-transparent"></div>

                    {/* Percentage Badge */}
                    <div className="absolute top-4 right-4 px-4 py-2 rounded-full backdrop-blur-md border border-[var(--border-light)] shadow-lg bg-[var(--bg-elevated)]/90">
                      <span className="font-bold font-montserrat text-[var(--text-primary)]">{area.percentage}</span>
                    </div>
                  </div>

                  {/* Bottom Half: Content */}
                  <div className="px-2">
                    <h3 className="text-2xl font-montserrat font-bold mb-3 text-[var(--text-primary)]">
                      {area.title}
                    </h3>
                    <p className="text-[var(--text-secondary)] leading-relaxed mb-6">
                      {area.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000 ease-out"
                        style={{
                          width: isVisible ? area.percentage : '0%',
                          backgroundColor: area.color,
                          boxShadow: `0 0 10px ${area.color}`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Trust Indicators */}
          <section className="mb-32">
            <div className="glass-card p-12 rounded-[21px] text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-blue-500/10"></div>

              <h2 className="text-3xl md:text-4xl font-montserrat font-bold mb-12 relative z-10 text-[var(--text-primary)]">
                Por Que Confiar?
              </h2>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                {whyDonate.map((reason, index) => (
                  <div key={index} className="text-center group">
                    <div className="w-4 h-4 mx-auto rounded-full mb-6 transition-all duration-300 group-hover:scale-150" style={{ backgroundColor: reason.color, boxShadow: `0 0 20px ${reason.color}` }}></div>
                    <h3 className="text-lg font-montserrat font-bold mb-3 text-[var(--text-primary)]">
                      {reason.title}
                    </h3>
                    <p className="text-sm font-inter text-[var(--text-secondary)] leading-relaxed">
                      {reason.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

        </div>

        {/* Scroll to top button */}
        <button
          onClick={scrollToTop}
          className={`fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-500 hover:scale-110 ${showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
            }`}
          style={{
            background: 'linear-gradient(135deg, #4caf50, #2e7d32)',
            color: 'white'
          }}
          aria-label="Voltar ao topo"
        >
          <FontAwesomeIcon icon={faArrowUp} className="w-6 h-6" />
        </button>
      </div>
    </>
  );
}
