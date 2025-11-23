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
  faShieldAlt
} from '@fortawesome/free-solid-svg-icons';
import { faDiscord, faTelegram } from '@fortawesome/free-brands-svg-icons';

export default function DoacoesPage() {
  const [copiedAddress, setCopiedAddress] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  const donationMethods = [
    {
      image: '/images/method-milagre.webp',
      title: '$MILAGRE Token',
      description: 'Apoie com nosso token nativo',
      address: '3tpz3ar7gaHmPZfhWHzRdPnBJ5MrZZVDxepDtDLYpump',
      network: 'Solana SPL',
      color: '#4caf50', // Green
      gradient: 'linear-gradient(135deg, #4caf50, #81c784)'
    },
    {
      image: '/images/method-solana.webp',
      title: 'Solana (SOL)',
      description: 'Rápido, seguro e com taxas baixíssimas',
      address: 'Em breve',
      network: 'Solana Mainnet',
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
      image: '/images/impact-education.webp',
      icon: faChartPie
    },
    {
      title: 'Desenvolvimento',
      description: 'Melhorias de segurança, novas features e infraestrutura.',
      percentage: '30%',
      color: '#2196f3', // Blue
      image: '/images/impact-dev.webp',
      icon: faShieldAlt
    },
    {
      title: 'Apoio Comunitário',
      description: 'Eventos, suporte a membros e iniciativas de ajuda mútua.',
      percentage: '20%',
      color: '#ff9800', // Orange
      image: '/images/impact-community.webp',
      icon: faHeart
    },
    {
      title: 'Crescimento',
      description: 'Marketing ético e expansão para alcançar mais pessoas.',
      percentage: '10%',
      color: '#0D9488', // Teal
      image: '/images/impact-growth.webp',
      icon: faArrowUp
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

        /* Glassmorphism Base */
        .glass-panel {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.5);
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.1);
        }

        [data-theme="dark"] .glass-panel {
          background: rgba(20, 20, 20, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
        }

        /* Neumorphism Elements */
        .neumorphic-card {
          background: #f0f2f5;
          box-shadow: 9px 9px 18px #d1d3d6, -9px -9px 18px #ffffff;
          border-radius: 24px;
          border: 1px solid rgba(255,255,255,0.4);
        }

        [data-theme="dark"] .neumorphic-card {
          background: #1a1b1e;
          box-shadow: 8px 8px 16px #0d0e0f, -8px -8px 16px #27282d;
          border: 1px solid rgba(255,255,255,0.05);
        }

        .neumorphic-button {
          background: #f0f2f5;
          box-shadow: 5px 5px 10px #d1d3d6, -5px -5px 10px #ffffff;
          transition: all 0.3s ease;
        }

        .neumorphic-button:active {
          box-shadow: inset 5px 5px 10px #d1d3d6, inset -5px -5px 10px #ffffff;
        }

        [data-theme="dark"] .neumorphic-button {
          background: #1a1b1e;
          box-shadow: 5px 5px 10px #0d0e0f, -5px -5px 10px #27282d;
        }

        [data-theme="dark"] .neumorphic-button:active {
          box-shadow: inset 5px 5px 10px #0d0e0f, inset -5px -5px 10px #27282d;
        }

        /* Floating Animation */
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        /* Gradient Text */
        .gradient-text {
          background: linear-gradient(135deg, #4caf50, #2196f3);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Spinning Animations */
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
      `}</style>

      <div className="min-h-screen relative overflow-hidden bg-[var(--bg-secondary)] transition-colors duration-300">
        {/* Background Orbs */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-green-400/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-400/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-[40%] left-[40%] w-[400px] h-[400px] bg-purple-400/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className={`relative z-10 max-w-7xl mx-auto px-6 py-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

          {/* Header Section */}
          <div className="text-center mb-20 pt-10">
            {/* Animated Logo with Floating Effect */}
            <div className="flex justify-center mb-8 mt-12">
              <div className="relative w-60 h-60 md:w-72 md:h-72 animate-float">
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

            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full glass-panel mb-6">
              <FontAwesomeIcon icon={faHeart} className="text-red-500 animate-pulse" />
              <span className="text-sm font-bold text-[var(--text-secondary)] tracking-wide uppercase">Faça a Diferença</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-montserrat font-bold leading-tight mb-6 text-[var(--text-primary)] tracking-tight">
              Apoie o <span className="gradient-text">$MILAGRE</span>
            </h1>

            <p className="text-xl md:text-2xl text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed font-inter">
              Sua contribuição impulsiona nossa missão de levar educação financeira e liberdade para todos.
            </p>
          </div>

          {/* Main Donation Cards - Neumorphic & Glassmorphic Mix */}
          <div className="grid lg:grid-cols-2 gap-12 mb-32">
            {donationMethods.map((method, index) => (
              <div key={index} className="neumorphic-card p-8 md:p-12 relative overflow-hidden group transition-all duration-500 hover:-translate-y-2">
                {/* Decorative Background */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-white/10 to-transparent rounded-bl-full opacity-50 pointer-events-none"></div>

                <div className="flex flex-col items-center text-center relative z-10">
                  {/* Circular Image with Neumorphic Border */}
                  <div className="relative w-48 h-48 mb-8 rounded-full p-2 neumorphic-button animate-float" style={{ animationDelay: `${index * 0.5}s` }}>
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

                  <h2 className="text-3xl font-montserrat font-bold mb-2 text-[var(--text-primary)]">{method.title}</h2>
                  <p className="text-[var(--text-secondary)] mb-8 font-medium">{method.description}</p>

                  {/* Address Container */}
                  <div className="w-full glass-panel rounded-2xl p-6 mb-8 relative group-hover:bg-white/5 transition-colors">
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
                        : 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg hover:shadow-green-500/30 hover:scale-105 active:scale-95'
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

          {/* Impact Section - Circular Cards */}
          <div className="mb-32">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-montserrat font-bold mb-6 text-[var(--text-primary)]">
                Seu Impacto Visualizado
              </h2>
              <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
                Para onde vai cada recurso investido na comunidade.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {impactAreas.map((area, index) => (
                <div key={index} className="glass-panel rounded-[30px] text-center hover:bg-white/10 transition-all duration-300 group overflow-hidden">
                  {/* Card Cover Image */}
                  <div className="relative w-full h-48 mb-0 overflow-hidden group-hover:opacity-90 transition-opacity">
                    <Image
                      src={area.image}
                      alt={area.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                    {/* Icon Overlay */}
                    <div className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                      <FontAwesomeIcon icon={area.icon} className="text-white w-5 h-5" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 pt-6">
                    <h3 className="text-xl font-bold mb-3 text-[var(--text-primary)]">{area.title}</h3>
                    <p className="text-sm text-[var(--text-secondary)] mb-4 min-h-[60px]">{area.description}</p>

                    <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000"
                        style={{ width: isVisible ? area.percentage : '0%', backgroundColor: area.color }}
                      ></div>
                    </div>
                    <div className="text-right mt-2 text-xs font-bold" style={{ color: area.color }}>{area.percentage}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trust Section - Glassmorphic Strip */}
          <div className="glass-panel rounded-[40px] p-12 md:p-16 relative overflow-hidden mb-20">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600"></div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
              {whyDonate.map((reason, index) => (
                <div key={index} className="relative pl-6 border-l-2 border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-bold mb-2 text-[var(--text-primary)]">{reason.title}</h3>
                  <p className="text-sm text-[var(--text-secondary)]">{reason.description}</p>
                </div>
              ))}
            </div>
          </div>

        </div>


      </div>
    </>
  );
}
