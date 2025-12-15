'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Script from 'next/script';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCode,
  faArrowRight,
  faGlobe,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import { faDiscord, faTelegram, faGithub, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { SOCIAL_LINKS } from '@/lib/core/constants/social';

export default function SobrePage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const socialLinks = [
    {
      name: 'Discord',
      url: SOCIAL_LINKS.DISCORD,
      icon: faDiscord,
      color: 'bg-[#5865F2]/10 border border-[#5865F2]/20 text-gray-900 dark:text-[#5865F2]',
      hover: 'hover:bg-[#5865F2]/20',
      description: 'Participe da nossa comunidade ativa, tire dúvidas e colabore.'
    },
    {
      name: 'Telegram',
      url: SOCIAL_LINKS.TELEGRAM,
      icon: faTelegram,
      color: 'bg-[#0088cc]/10 border border-[#0088cc]/20 text-gray-900 dark:text-[#0088cc]',
      hover: 'hover:bg-[#0088cc]/20',
      description: 'Receba atualizações em tempo real e alertas de segurança.'
    },
    {
      name: 'Twitter / X',
      url: SOCIAL_LINKS.TWITTER,
      icon: faTwitter,
      color: 'bg-black/5 border border-black/10 text-gray-900 dark:text-white dark:bg-white/5 dark:border-white/10',
      hover: 'hover:bg-black/10 dark:hover:bg-white/10',
      description: 'Siga-nos para notícias rápidas e interações com o ecossistema.'
    },
    {
      name: 'Github - Open Source',
      url: SOCIAL_LINKS.GITHUB,
      icon: faGithub,
      color: 'bg-black/5 border border-black/10 text-gray-900 dark:text-white dark:bg-white/5 dark:border-white/10',
      hover: 'hover:bg-black/10 dark:hover:bg-white/10',
      description: 'A confiança se conquista com código, não com palavras. Nossa plataforma é 100% código aberto.'
    }
  ];

  return (
    <>
      <Script id="about-schema" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ContactPage",
          "name": "Contato - $MILAGRE",
          "url": "https://tokenmilagre.xyz/sobre",
          "description": "Entre em contato com a equipe do $MILAGRE. Redes sociais oficiais e canais de suporte.",
          "mainEntity": {
            "@type": "Organization",
            "name": "$MILAGRE",
            "sameAs": [
              "https://x.com/TokenMilagre",
              "https://t.me/+Bop_TVFc_mg3Njlh",
              "https://github.com/dogespartano-cyber/tokenmilagre-platform"
            ]
          }
        })}
      </Script>

      <div className="min-h-screen relative transition-colors duration-300 font-sans">
        {/* Background Color with Mask to blend with Breadcrumbs */}




        <div className={`relative z-10 max-w-3xl mx-auto px-6 md:px-10 py-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

          {/* Hero Section */}
          <section className="text-center space-y-8 mb-20 pt-12">
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

            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-[var(--text-primary)]">
              Conecte-se Conosco
            </h1>

            <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
              Estamos construindo uma comunidade forte e transparente. <br />
              Escolha seu canal preferido e faça parte do movimento.
            </p>
          </section>

          {/* Manifesto Section */}
          <section className="mb-20">
            <div className="glass-card p-8 md:p-12 rounded-3xl relative overflow-hidden">


              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-[var(--text-primary)] relative z-10 text-left md:text-center">
                Comunidade $MILAGRE
              </h2>

              <div className="space-y-6 text-lg text-[var(--text-secondary)] leading-relaxed text-left">
                <p>
                  Este projeto nasceu da determinação de um único desenvolvedor e da potência da IA, mas seu destino é se tornar uma comunidade global. Estamos construindo tudo do zero, não apenas para criar tecnologia, mas para proteger pessoas de golpes e perdas, guiando-as com conhecimento e transparência. Nossa missão é reunir centenas de colaboradores, de todos os níveis e idiomas, em uma comunidade que compartilha os mesmos valores.
                </p>

                <p>
                  Mais do que holders, somos uma comunidade com valores inegociáveis: honestidade, prosperidade, sabedoria e esperança. Acreditamos em educação como caminho para independência financeira. Temos orgulho de dedicar nossa energia para ensinar o caminho seguro rumo à construção de patrimônio sustentável.
                </p>

                <p className="font-medium text-[var(--text-primary)]">
                  Compartilhamos conhecimento com alegria — seja em artigos, ferramentas ou mentorias. O que começou como uma iniciativa solo agora se espalha como um movimento educacional. Nós somos a Comunidade $MILAGRE.
                </p>
              </div>
            </div>
          </section>

          {/* Contact Cards Grid - Single Column */}
          <div className="grid grid-cols-1 gap-6 mb-20">
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card p-8 rounded-3xl group hover:border-[var(--brand-primary)] transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center gap-6">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg transition-colors ${link.color} ${link.hover} shrink-0`}>
                    <FontAwesomeIcon icon={link.icon} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-2 group-hover:text-[var(--brand-primary)] transition-colors">
                      {link.name}
                    </h3>
                    <p className="text-[var(--text-secondary)] text-base leading-relaxed">
                      {link.description}
                    </p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity -translate-x-4 group-hover:translate-x-0">
                    <FontAwesomeIcon icon={faArrowRight} className="text-[var(--brand-primary)] text-xl" />
                  </div>
                </div>
              </a>
            ))}

            {/* Sustentabilidade Card - Styled to match */}
            <div className="glass-card p-8 rounded-3xl border border-[var(--border-light)] bg-[var(--bg-elevated)]">
              <div className="mb-4">
                <h3 className="text-2xl font-bold text-[var(--text-primary)]">
                  Sustentabilidade do Projeto
                </h3>
              </div>

              <ul className="space-y-4 mt-6 pl-2">
                {[
                  'Doações da comunidade',
                  'Links afiliados éticos (exchanges seguras)',
                  'Parcerias transparentes',
                  'Produtos educacionais avançados',
                  'Futuras usabilidades com o token $Milagre'
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3 text-[var(--text-secondary)]">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 text-lg" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <p className="text-sm text-[var(--text-tertiary)] mt-6">
                ⚠️ Holdings da equipe visíveis em{' '}
                <a href="/transparencia" className="underline hover:text-[var(--brand-primary)]">
                  /transparencia
                </a>
              </p>
            </div>

            {/* Sobre o Criador - Novo Card */}
            <div className="group relative p-8 rounded-3xl bg-gradient-to-br from-cyan-500/10 to-blue-500/5 border border-cyan-500/20 backdrop-blur-md overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/10">
              {/* Glow no topo no hover */}
              <div className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-cyan-500 to-blue-500" style={{ boxShadow: '0 0 20px #06b6d440' }} />

              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-cyan-500/10 rounded-xl text-cyan-600 dark:text-cyan-400 transition-transform duration-300 group-hover:scale-110">
                  <FontAwesomeIcon icon={faCode} className="w-5 h-5" />
                </div>
                <h3 className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                  Sobre o Criador
                </h3>
              </div>

              <div className="space-y-4 text-[var(--text-secondary)]">
                <p className="leading-relaxed">
                  $MILAGRE foi criado por <span className="font-semibold text-[var(--text-primary)]">dogespartano</span>,
                  um desenvolvedor que acredita que através da <strong className="text-cyan-600 dark:text-cyan-400">fé</strong> e
                  {' '}<strong className="text-cyan-600 dark:text-cyan-400">educação</strong>, podemos transformar o mercado cripto em um lugar mais seguro e acessível.
                </p>

                <p className="leading-relaxed">
                  A escolha pela privacidade é intencional — o projeto deve ser julgado pelo <strong className="text-[var(--text-primary)]">código</strong>, não pela pessoa.
                </p>

                <p className="leading-relaxed">
                  <strong className="text-[var(--text-primary)]">Contato:</strong>{' '}
                  <a href="mailto:dogespartano@proton.me" className="text-cyan-600 dark:text-cyan-400 hover:underline">
                    dogespartano@proton.me
                  </a>
                </p>

                <div className="mt-6 p-4 rounded-xl bg-[var(--bg-tertiary)]/50 border border-cyan-500/10">
                  <ul className="space-y-2 text-sm pl-4 list-disc text-[var(--text-secondary)]">
                    <li>
                      <span>Contrato <strong>renunciado</strong> — ninguém pode alterá-lo</span>
                    </li>
                    <li>
                      <span>Código <strong>100% open source</strong> (MIT License)</span>
                    </li>
                    <li>
                      <span>637+ testes automatizados</span>
                    </li>
                    <li>
                      <span>Todas as ações são públicas na blockchain</span>
                    </li>
                  </ul>
                </div>

                <p className="text-sm text-[var(--text-tertiary)] italic mt-4">
                  "A confiança se conquista com código, não com palavras."
                </p>
              </div>
            </div>
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
    </>
  );
}
