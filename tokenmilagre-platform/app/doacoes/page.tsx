'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Script from 'next/script';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowUp,
  faCopy,
  faCheckCircle,
  faHeart,
  faWallet,
  faChartPie,
  faShieldAlt,
  faGlobe,
  faRocket,
  faHandshake
} from '@fortawesome/free-solid-svg-icons';
import { faDiscord, faTelegram } from '@fortawesome/free-brands-svg-icons';

export default function DoacoesPage() {
  const [copiedAddress, setCopiedAddress] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  const donationMethods = [
    {
      image: '/images/method-milagre.webp',
      title: '$MILAGRE Token',
      description: 'Apoie comprando e segurando o token da comunidade.',
      address: '3tpz3ar7gaHmPZfhWHzRdPnBJ5MrZZVDxepDtDLYpump',
      network: 'Solana SPL',
      color: 'text-green-500',
      bg: 'bg-green-500/10'
    },
    {
      image: '/images/method-solana.webp',
      title: 'Solana (SOL)',
      description: 'Contribuição direta para custos de servidor e desenvolvimento.',
      address: 'Em breve',
      network: 'Solana Mainnet',
      color: 'text-blue-500',
      bg: 'bg-blue-500/10'
    }
  ];

  const impactAreas = [
    {
      title: 'Educação Gratuita',
      description: 'Produção de guias anti-golpe e tutoriais de segurança.',
      percentage: '40%',
      color: '#4caf50', // Green
      icon: faChartPie
    },
    {
      title: 'Tecnologia',
      description: 'Desenvolvimento de ferramentas de análise de risco.',
      percentage: '30%',
      color: '#2196f3', // Blue
      icon: faShieldAlt
    },
    {
      title: 'Fundo de Reserva',
      description: 'Proteção contra volatilidade e emergências.',
      percentage: '20%',
      color: '#ff9800', // Orange
      icon: faHeart
    },
    {
      title: 'Infraestrutura',
      description: 'Manutenção de servidores e APIs.',
      percentage: '10%',
      color: '#0D9488', // Teal
      icon: faArrowUp
    }
  ];

  const whyDonate = [
    {
      title: 'Independência Total',
      description: 'Sua doação garante que não precisamos vender nossa opinião para patrocinadores.',
      color: 'text-green-500',
      icon: faGlobe
    },
    {
      title: 'Combate a Golpes',
      description: 'Financiamos investigações e alertas que salvam o dinheiro da comunidade.',
      color: 'text-amber-500',
      icon: faShieldAlt
    },
    {
      title: 'Acesso Universal',
      description: 'Mantemos o conteúdo gratuito para que a educação chegue a quem mais precisa.',
      color: 'text-blue-500',
      icon: faRocket
    },
    {
      title: 'Transparência',
      description: 'Prestamos contas de cada centavo recebido e investido no projeto.',
      color: 'text-purple-500',
      icon: faHandshake
    }
  ];

  const copyToClipboard = (text: string, label: string) => {
    if (text === 'Em breve') return;
    navigator.clipboard.writeText(text);
    setCopiedAddress(label);
    setTimeout(() => setCopiedAddress(''), 2000);
  };

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <>
      {/* Schema.org JSON-LD */}
      <Script id="donation-schema" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Contribua com o Token Milagre",
          "description": "Ajude a manter a educação cripto gratuita e independente. Sua contribuição fortalece nossa luta contra golpes.",
          "url": "https://tokenmilagre.xyz/doacoes"
        })}
      </Script>

      <div className="min-h-screen relative overflow-hidden transition-colors duration-300 font-sans">
        {/* Background Color with Mask to blend with Breadcrumbs */}
        <div
          className="absolute inset-0 bg-[var(--bg-secondary)] z-0 pointer-events-none"
          style={{
            maskImage: 'linear-gradient(to bottom, transparent, black 150px)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 150px)'
          }}
        />

        {/* Background Orbs */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-green-500/20 rounded-full blur-[120px] animate-pulse-slow"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-[40%] left-[40%] w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className={`relative z-10 max-w-7xl mx-auto px-6 py-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

          {/* Header Section */}
          <div className="text-center mb-20 pt-10">
            {/* Animated Logo with Floating Effect */}
            <div className="flex justify-center mb-8 mt-12">
              <div className="relative w-60 h-60 md:w-72 md:h-72 animate-float-vertical">
                {/* Animated rings */}
                <div className="absolute inset-0" style={{ animation: 'spin-slow 25s linear infinite' }}>
                  <div className="absolute inset-0 rounded-full border-2 border-dashed opacity-30 border-green-500"></div>
                </div>
                <div className="absolute inset-3" style={{ animation: 'spin-reverse 20s linear infinite' }}>
                  <div className="absolute inset-0 rounded-full border-2 border-dashed opacity-30 border-teal-500"></div>
                </div>

                {/* Glow effect */}
                <div className="absolute inset-0 blur-2xl animate-pulse opacity-20" style={{
                  background: 'linear-gradient(135deg, #93c5fd, #bfdbfe, #dbeafe)'
                }}></div>

                {/* Image */}
                <div className="relative z-10 flex items-center justify-center h-full transform hover:scale-105 transition-all duration-700">
                  <Image
                    src="/images/TOKEN-MILAGRE-Hero.webp"
                    alt="$MILAGRE"
                    width={288}
                    height={288}
                    className="drop-shadow-2xl"
                    priority
                  />
                </div>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 mb-6">
              <FontAwesomeIcon icon={faHandshake} className="text-teal-500 animate-pulse" />
              <span className="text-sm font-bold text-teal-500 tracking-wide uppercase">Sustentabilidade & Independência</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 text-[var(--text-primary)] tracking-tight">
              Sustente a <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">Educação Cripto</span>
            </h1>

            <p className="text-xl md:text-2xl text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed font-light">
              Para sermos imparciais, precisamos ser independentes. <br />
              Sua contribuição garante que a verdade continue sendo dita.
            </p>
          </div>

          {/* Main Donation Cards */}
          <div className="grid lg:grid-cols-2 gap-12 mb-32">
            {donationMethods.map((method, index) => (
              <div key={index} className="glass-card p-8 md:p-12 relative overflow-hidden group transition-all duration-500 hover:-translate-y-2">
                {/* Decorative Background */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-white/5 to-transparent rounded-bl-full opacity-50 pointer-events-none"></div>

                <div className="flex flex-col items-center text-center relative z-10">
                  {/* Circular Image */}
                  <div className="relative w-40 h-40 mb-8 rounded-full p-2 bg-[var(--bg-primary)] shadow-xl animate-float-vertical" style={{ animationDelay: `${index * 0.5}s` }}>
                    <div className="w-full h-full rounded-full overflow-hidden relative">
                      <Image
                        src={method.image}
                        alt={method.title}
                        fill
                        className="object-cover"
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
                  </div>

                  <h2 className="text-3xl font-bold mb-2 text-[var(--text-primary)]">{method.title}</h2>
                  <p className="text-[var(--text-secondary)] mb-8 font-medium">{method.description}</p>

                  {/* Address Container */}
                  <div className="w-full bg-[var(--bg-primary)] rounded-2xl p-6 mb-8 relative border border-[var(--border-medium)]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-wider">{method.network}</span>
                      <FontAwesomeIcon icon={faWallet} className="text-[var(--text-tertiary)] opacity-50" />
                    </div>
                    <code className="block text-sm md:text-base font-mono break-all text-[var(--text-primary)] font-bold">
                      {method.address}
                    </code>
                  </div>

                  <button
                    onClick={() => copyToClipboard(method.address, method.title)}
                    disabled={method.address === 'Em breve'}
                    className={`
                      px-8 py-4 rounded-full font-bold text-lg transition-all w-full md:w-auto min-w-[200px]
                      ${method.address === 'Em breve'
                        ? 'opacity-50 cursor-not-allowed bg-gray-200 text-gray-500'
                        : 'bg-gradient-to-r from-green-500 to-teal-600 text-white shadow-lg hover:shadow-green-500/30 hover:scale-105 active:scale-95'
                      }
                    `}
                  >
                    {copiedAddress === method.title ? (
                      <span className="flex items-center justify-center gap-2">
                        <FontAwesomeIcon icon={faCheckCircle} /> Copiado!
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <FontAwesomeIcon icon={faCopy} /> {method.address === 'Em breve' ? 'Em Breve' : 'Copiar Endereço'}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Impact Section */}
          <div className="mb-32">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[var(--text-primary)]">
                Impacto Real
              </h2>
              <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
                Para onde vai sua contribuição?
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {impactAreas.map((area, index) => (
                <div key={index} className="glass-card p-8 rounded-[30px] text-center hover:bg-white/5 transition-all duration-300 group">
                  <div className="w-16 h-16 rounded-2xl bg-[var(--bg-primary)] flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:scale-110 transition-transform">
                    <FontAwesomeIcon icon={area.icon} className="text-2xl" style={{ color: area.color }} />
                  </div>

                  <h3 className="text-xl font-bold mb-3 text-[var(--text-primary)]">{area.title}</h3>
                  <p className="text-sm text-[var(--text-secondary)] mb-6 min-h-[40px]">{area.description}</p>

                  <div className="relative h-2 bg-[var(--bg-primary)] rounded-full overflow-hidden mb-2">
                    <div
                      className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000"
                      style={{ width: isVisible ? area.percentage : '0%', backgroundColor: area.color }}
                    ></div>
                  </div>
                  <div className="text-right text-lg font-bold" style={{ color: area.color }}>{area.percentage}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Trust Section (Why Donate) */}
          <div className="glass p-12 md:p-16 rounded-[3rem] relative overflow-hidden mb-20">
            {/* Removed the colored top border as requested */}

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
              {whyDonate.map((reason, index) => (
                <div key={index} className="relative pl-6 border-l-2 border-[var(--border-medium)]">
                  <div className={`text-2xl mb-4 ${reason.color}`}>
                    <FontAwesomeIcon icon={reason.icon} />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-[var(--text-primary)]">{reason.title}</h3>
                  <p className="text-sm text-[var(--text-secondary)]">{reason.description}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        <style jsx>{`
          @keyframes float-vertical {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
            100% { transform: translateY(0px); }
          }
          .animate-float-vertical {
            animation: float-vertical 6s ease-in-out infinite;
          }
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes spin-reverse {
            from { transform: rotate(360deg); }
            to { transform: rotate(0deg); }
          }
        `}</style>
      </div>
    </>
  );
}
