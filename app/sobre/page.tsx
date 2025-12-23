'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Script from 'next/script';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRight,
  faCheckCircle,
  faExternalLinkAlt,
  faCode,
  faGlobe,
  faHeart,
  faHandHoldingHeart,
  faBullseye,
  faShieldAlt,
  faTerminal
} from '@fortawesome/free-solid-svg-icons';
import { faDiscord, faTelegram, faGithub, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { SOCIAL_LINKS } from '@/lib/core/constants/social';
import TransparencyStats from '@/components/shared/TransparencyStats';
import ZenithCard from '@/components/ui/ZenithCard';

import { useSidebar } from '@/contexts/SidebarContext'; // Re-imported

export default function SobrePage() {
  const [activeSection, setActiveSection] = useState('hero');
  const { setSidebarMode, setDynamicTitle, setShortTitle } = useSidebar();

  // Set Sidebar Mode
  useEffect(() => {
    // @ts-ignore - 'sobre' might not be in the strict type yet, but works in runtime
    setSidebarMode('sobre');
    setDynamicTitle('Sobre o $MILAGRE');
    setShortTitle('Sobre');
    return () => setSidebarMode('default');
  }, [setSidebarMode, setDynamicTitle, setShortTitle]);

  // Scroll spy para atualizar nav ativa
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['conexoes', 'manifesto', 'valores', 'transparencia', 'criador'];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element && element.offsetTop <= scrollPosition && (element.offsetTop + element.offsetHeight) > scrollPosition) {
          setActiveSection(section);
          return;
        }
      }
      if (window.scrollY < 300) setActiveSection('hero');
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <Script id="about-schema" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ContactPage",
          "name": "Sobre - $MILAGRE",
          "url": "https://tokenmilagre.xyz/sobre",
          "description": "Fé, Código e Transparência. Conheça a missão e a comunidade do $MILAGRE."
        })}
      </Script>

      <div className="min-h-screen font-sans bg-transparent text-[var(--text-primary)] relative overflow-x-hidden selection:bg-teal-500/30">



        {/* 1. Hero Imersivo */}
        <section className="relative min-h-[70vh] md:min-h-[90vh] flex flex-col items-center justify-center text-center px-4 md:px-6 scroll-mt-32" id="hero">
          {/* Background Glow */}
          {/* Background Glow - REMOVED */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
          </div>

          <div className="relative z-10 space-y-6 md:space-y-8 max-w-4xl mx-auto px-2">
            <div className="w-24 h-24 md:w-32 md:h-32 mx-auto relative mb-4 md:mb-6 animate-float-vertical">
              <Image
                src="/images/TOKEN-MILAGRE-Hero.webp"
                alt="$MILAGRE Logo"
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-8xl font-black tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-b from-[var(--text-primary)] to-[var(--text-secondary)]">
              FÉ. CÓDIGO.<br />TRANSPARÊNCIA.
            </h1>

            <p className="text-base md:text-xl lg:text-2xl text-[var(--text-secondary)] font-light max-w-2xl mx-auto leading-relaxed px-2">
              Construindo um refúgio de <span className="text-teal-500 font-medium">educação</span> e <span className="text-teal-500 font-medium">prosperidade</span> em um mercado caótico.
            </p>

            <div className="pt-6 md:pt-8 flex flex-col sm:flex-row flex-wrap justify-center gap-3 md:gap-4">
              <button onClick={() => scrollTo('conexoes')} className="group flex items-center justify-center gap-3 px-6 md:px-8 py-3 md:py-4 rounded-full bg-[#fcd535] text-black font-bold text-base md:text-lg hover:scale-105 transition-transform">
                Junte-se a nós
                <FontAwesomeIcon icon={faArrowRight} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <Link href="/manifesto" className="px-6 md:px-8 py-3 md:py-4 rounded-full border border-[var(--border-light)] font-bold text-base md:text-lg hover:bg-[var(--bg-elevated)] transition-colors text-center">
                Ler Manifesto
              </Link>
            </div>
          </div>
        </section>

        {/* 2. Conexões (Social) - Full Width Grid */}
        <section id="conexoes" className="py-12 md:py-20 scroll-mt-32">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {[
                { name: 'Discord', icon: faDiscord, count: 'Comunidade', link: SOCIAL_LINKS.DISCORD, color: 'hover:text-[#5865F2]' },
                { name: 'Telegram', icon: faTelegram, count: 'Alertas', link: SOCIAL_LINKS.TELEGRAM, color: 'hover:text-[#0088cc]' },
                { name: 'Twitter', icon: faTwitter, count: 'News', link: SOCIAL_LINKS.TWITTER, color: 'hover:text-[var(--text-primary)]' },
                { name: 'Github', icon: faGithub, count: 'Código', link: SOCIAL_LINKS.GITHUB, color: 'hover:text-[var(--text-primary)]' },
              ].map((social, i) => (
                <a key={i} href={social.link} target="_blank" className="block h-full">
                  <ZenithCard variant="glass" className={`h-full flex flex-col items-center justify-center text-center p-4 md:p-8 transition-all hover:-translate-y-2 hover:shadow-xl group ${social.color} border border-[var(--border-medium)] hover:border-[var(--brand-primary)]/50 gap-1`}>
                    <FontAwesomeIcon icon={social.icon} className="text-2xl md:text-4xl mb-2 md:mb-3 text-[var(--text-tertiary)] group-hover:scale-110 transition-transform mx-auto" />
                    <span className="font-bold text-base md:text-xl block w-full">{social.name}</span>
                    <span className="text-sm text-[var(--text-tertiary)] uppercase tracking-widest block w-full">{social.count}</span>
                  </ZenithCard>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Manifesto Editorial */}
        <section id="manifesto" className="py-16 md:py-32 px-4 md:px-6 scroll-mt-32">
          <div className="max-w-3xl mx-auto space-y-8 md:space-y-12">
            <span className="text-teal-500 font-mono text-sm tracking-widest uppercase mb-4 block">01 — Nossa Missão</span>

            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold leading-tight">
              Não somos apenas um token.<br />
              Somos um <span className="italic font-serif text-teal-600 dark:text-teal-400">movimento educacional</span>.
            </h2>

            <div className="prose prose-lg dark:prose-invert prose-p:leading-loose prose-p:text-[var(--text-secondary)]">
              <p>
                Este projeto nasceu da determinação de um único desenvolvedor e da potência da IA, mas seu destino é se tornar uma comunidade global. Estamos construindo tudo do zero, não apenas para criar tecnologia, mas para proteger pessoas de golpes e perdas.
              </p>

              <blockquote className="border-l-4 border-teal-500 pl-4 md:pl-6 my-8 md:my-12 text-lg md:text-2xl font-serif italic text-[var(--text-primary)]">
                "Ensinar a construir patrimônio, não a jogar na loteria."
              </blockquote>

              <p>
                Acreditamos que a verdadeira prosperidade vem do conhecimento, não da sorte. Em um mercado cheio de especulação vazia, escolhemos ser o porto seguro da fundamentação, da verdade técnica e da fé no longo prazo.
              </p>
            </div>
          </div>
        </section>

        {/* 4. Bento Grid de Valores */}
        <section id="valores" className="py-16 md:py-32 px-4 md:px-6 scroll-mt-32">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 h-auto md:h-[600px]">

              {/* Title Box */}
              <div className="md:col-span-1 md:row-span-1">
                <ZenithCard variant="slate" className="h-full p-10 flex flex-col justify-center transition-all hover:-translate-y-2 hover:shadow-xl">
                  <span className="text-teal-500 font-mono text-sm tracking-widest uppercase mb-2">02 — Valores</span>
                  <h3 className="text-4xl font-bold">DNA Inegociável.</h3>
                  <p className="mt-4 text-[var(--text-secondary)]">Os 5 pilares que sustentam cada linha de código e cada decisão.</p>
                </ZenithCard>
              </div>

              {/* Transparência (Large) */}
              <div className="md:col-span-2 md:row-span-1">
                <ZenithCard variant="teal" className="h-full p-10 flex flex-col justify-between group overflow-hidden relative transition-all hover:-translate-y-2 hover:shadow-xl">
                  <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
                    <FontAwesomeIcon icon={faCode} className="text-9xl text-teal-500" />
                  </div>
                  <FontAwesomeIcon icon={faGlobe} className="text-3xl text-teal-600 mb-4 w-8" />
                  <div>
                    <h4 className="text-2xl font-bold mb-2">Transparência</h4>
                    <p className="text-[var(--text-secondary)] max-w-md">Código aberto, métricas públicas, carteiras visíveis. Nada a esconder, tudo a auditar.</p>
                  </div>
                </ZenithCard>
              </div>

              {/* Verdade */}
              <div>
                <ZenithCard variant="success" className="h-full p-8 transition-all hover:-translate-y-2 hover:shadow-xl">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-2xl text-emerald-500 mb-4" />
                  <h4 className="font-bold text-xl mb-2">Verdade</h4>
                  <p className="text-sm text-[var(--text-secondary)]">Fact-checking obrigatório. Sem hype falso.</p>
                </ZenithCard>
              </div>

              {/* Fé & Amor */}
              <div className="md:col-span-1">
                <ZenithCard variant="violet" className="h-full p-8 transition-all hover:-translate-y-2 hover:shadow-xl">
                  <div className="flex gap-4 mb-4">
                    <FontAwesomeIcon icon={faHeart} className="text-2xl text-pink-500" />
                    <FontAwesomeIcon icon={faHandHoldingHeart} className="text-2xl text-purple-500" />
                  </div>
                  <h4 className="font-bold text-xl mb-2">Fé & Amor</h4>
                  <p className="text-sm text-[var(--text-secondary)]">Deus como bússola, comunidade como família.</p>
                </ZenithCard>
              </div>

              {/* Propósito */}
              <div>
                <ZenithCard variant="warning" className="h-full p-8 transition-all hover:-translate-y-2 hover:shadow-xl">
                  <FontAwesomeIcon icon={faBullseye} className="text-2xl text-yellow-500 mb-4" />
                  <h4 className="font-bold text-xl mb-2">Propósito</h4>
                  <p className="text-sm text-[var(--text-secondary)]">Patrimônio real vs. Loteria. Foco no longo prazo.</p>
                </ZenithCard>
              </div>

            </div>
          </div>
        </section>

        {/* 5. Transparência Dashboard */}
        <section id="transparencia" className="py-16 md:py-32 px-4 md:px-6 scroll-mt-32">
          <div className="max-w-5xl mx-auto space-y-8 md:space-y-12">
            <div className="text-center max-w-2xl mx-auto mb-8 md:mb-16">
              <span className="text-teal-500 font-mono text-sm tracking-widest uppercase mb-4 block">03 — Dashboard</span>
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 md:mb-6">Confiança se prova.</h2>
              <p className="text-base md:text-xl text-[var(--text-secondary)]">Métricas em tempo real. Sem segredos, sem caixa preta.</p>
            </div>

            {/* Stats Component - EXPLICITLY KEPT AS IS */}
            <TransparencyStats />

            {/* Terminal & Github Row */}
            <div className="grid md:grid-cols-2 gap-4 md:gap-8 mt-8 md:mt-12">

              {/* Fake Terminal */}
              <div className="rounded-2xl overflow-hidden bg-[#1e1e1e] border border-[#333] shadow-2xl font-mono text-xs md:text-sm">
                <div className="flex items-center gap-1.5 px-4 py-3 bg-[#252526] border-b border-[#333]">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                  <div className="ml-2 text-gray-500 text-xs">zenfoco@milagre-dev: ~/project</div>
                </div>
                <div className="p-6 space-y-4 text-gray-300">
                  <div>
                    <span className="text-emerald-400">➜</span> <span className="text-blue-400">~</span> <span className="text-yellow-300">git status</span>
                  </div>
                  <div className="text-gray-400">On branch main<br />Your branch is up to date with 'origin/main'.</div>

                  <div>
                    <span className="text-emerald-400">➜</span> <span className="text-blue-400">~</span> <span className="text-yellow-300">cat SECURITY.md</span>
                  </div>
                  <div className="pl-4 border-l-2 border-emerald-500/30">
                    <ul className="space-y-1 text-emerald-300">
                      <li>[x] Contract Renounced</li>
                      <li>[x] Liquidity Locked</li>
                      <li>[ ] Audit (Pending)</li>
                    </ul>
                  </div>

                  <div className="animate-pulse">
                    <span className="text-emerald-400">➜</span> <span className="text-blue-400">~</span> <span className="inline-block w-2 H-4 bg-gray-500 ml-1 align-middle"></span>
                  </div>
                </div>
              </div>

              {/* Open Source CTA */}
              <ZenithCard variant="glass" className="flex flex-col justify-center p-10 rounded-3xl transition-all hover:-translate-y-2 hover:shadow-xl border border-[var(--border-medium)] hover:border-transparent">
                <FontAwesomeIcon icon={faGithub} className="text-5xl text-[var(--text-primary)] mb-6" />
                <h3 className="text-2xl font-bold mb-4">100% Auditável.</h3>
                <p className="text-[var(--text-secondary)] mb-8">
                  Nosso código é público. Qualquer pessoa pode verificar, auditar e contribuir. A segurança vem da transparência.
                </p>
                <Link
                  href="https://github.com/dogespartano-cyber/tokenmilagre-platform"
                  target="_blank"
                  className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-bold transition-transform hover:-translate-y-1"
                >
                  <FontAwesomeIcon icon={faCode} />
                  Examinar Código
                  <FontAwesomeIcon icon={faExternalLinkAlt} className="text-xs ml-1" />
                </Link>
              </ZenithCard>
            </div>
          </div>
        </section>

        {/* 6. Criador Profile Horizontal */}
        <section id="criador" className="py-16 md:py-32 px-4 md:px-6 scroll-mt-32">
          <div className="max-w-4xl mx-auto">
            <ZenithCard variant="glass" className="p-6 md:p-16 relative overflow-hidden rounded-2xl md:rounded-[3rem] transition-all hover:-translate-y-2 hover:shadow-2xl border border-[var(--border-medium)] hover:border-transparent">

              {/* Decorative BG */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10 relative z-10">

                {/* Avatar Area */}
                <div className="shrink-0 text-center md:text-left">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 p-1 mb-6 mx-auto md:mx-0 shadow-lg">
                    <div className="w-full h-full rounded-full bg-[var(--bg-primary)] flex items-center justify-center overflow-hidden relative">
                      <FontAwesomeIcon icon={faCode} className="text-5xl text-cyan-500" />
                    </div>
                  </div>
                  <div className="flex justify-center md:justify-start gap-4 text-xl text-[var(--text-secondary)]">
                    <a href={SOCIAL_LINKS.TWITTER} target="_blank" className="hover:text-cyan-500 transition-colors"><FontAwesomeIcon icon={faTwitter} /></a>
                    <a href={SOCIAL_LINKS.GITHUB} target="_blank" className="hover:text-[var(--text-primary)] transition-colors"><FontAwesomeIcon icon={faGithub} /></a>
                    <a href="mailto:dogespartano@proton.me" className="hover:text-emerald-500 transition-colors"><FontAwesomeIcon icon={faGlobe} /></a>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 text-center md:text-left space-y-6">
                  <div>
                    <span className="text-cyan-500 font-bold uppercase tracking-wider text-xs">Sobre o Criador</span>
                    <h3 className="text-3xl md:text-4xl font-bold mt-2">dogespartano</h3>
                    <p className="text-[var(--text-secondary)] text-sm font-mono mt-1">Anon Developer & Founder</p>
                  </div>

                  <div className="prose dark:prose-invert">
                    <p>
                      "Olá. Sou um desenvolvedor anônimo movido por duas forças: <strong className="text-cyan-600 dark:text-cyan-400">Fé</strong> e <strong className="text-cyan-600 dark:text-cyan-400">Indignação</strong>."
                    </p>
                    <p>
                      Indignação com golpes que destroem famílias. Fé de que a tecnologia pode ser usada para educar e libertar, não apenas para especular.
                    </p>
                    <p>
                      Escolhi o anonimato porque este projeto não é sobre mim. É sobre o código, a missão e a comunidade. <span className="italic">Trust the code, not the persona.</span>
                    </p>
                  </div>

                  <div className="pt-6 border-t border-[var(--border-light)] mt-6">
                    <div className="grid grid-cols-2 gap-4 text-sm font-medium">
                      <div className="flex items-center gap-2 text-emerald-500 justify-center md:justify-start">
                        <FontAwesomeIcon icon={faShieldAlt} /> Auditoria Aberta
                      </div>
                      <div className="flex items-center gap-2 text-[var(--text-secondary)] justify-center md:justify-start">
                        <FontAwesomeIcon icon={faTerminal} /> MIT License
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </ZenithCard>
          </div>
        </section>

        {/* Disclaimer Footer */}
        <div className="py-12 text-center px-6">
          <p className="text-xs text-[var(--text-tertiary)] max-w-2xl mx-auto leading-relaxed">
            <strong>Isenção de Responsabilidade:</strong> O conteúdo deste site é estritamente educacional. $MILAGRE é um projeto experimental. Criptomoedas envolvem alto risco. Nunca invista dinheiro que você não pode perder. Faça sua própria pesquisa (DYOR).
          </p>
        </div>

      </div>

      <style jsx>{`
        .animate-pulse-slow {
          animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translate(-50%, -20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        .animate-fade-in-down {
          animation: fadeInDown 0.5s ease-out forwards;
        }
         @keyframes float-vertical {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
        .animate-float-vertical {
          animation: float-vertical 6s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
