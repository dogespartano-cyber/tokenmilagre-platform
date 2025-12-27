/**
 * "Porque onde estiver o vosso tesouro, aí estará também o vosso coração." - Mateus 6:21
 * Que este token seja um instrumento de prosperidade honesta e não de ganância.
 */
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Script from 'next/script';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
 faLeaf,
 faUsers,
 faShieldAlt,
 faExternalLinkAlt,
 faChartLine,
 faCheckCircle,
 faSeedling,
 faGlobe,
 faWallet,
 faExchangeAlt,
 faCoins,
 faCopy,
 faArrowRight,
 faHandshake,
 faLightbulb,
 faChartPie,
 faArrowUp
} from '@fortawesome/free-solid-svg-icons';
import { faDiscord, faTelegram } from '@fortawesome/free-brands-svg-icons';
import { SOCIAL_LINKS } from '@/lib/core/constants/social';
import { MISSION } from '@/lib/core/constants/mission';

export default function TokenPage() {
 const [isVisible, setIsVisible] = useState(false);
 const TOKEN_ADDRESS = MISSION.BLOCKCHAIN.TOKEN_ADDRESS;

 useEffect(() => {
  setIsVisible(true);
 }, []);

 const impactAreas = [
  {
   title: 'Sabedoria Gratuita',
   description: 'Produção de conteúdo de alta frequência para formar investidores conscientes e prósperos.',
   percentage: '40%',
   color: '#4caf50', // Green
   icon: faChartPie
  },
  {
   title: 'Tecnologia de Proteção',
   description: 'Criação de ferramentas que silenciosamente blindam nossa comunidade, permitindo que foquem apenas no crescimento.',
   percentage: '30%',
   color: '#2196f3', // Blue
   icon: faShieldAlt
  },
  {
   title: 'Fortaleza Comunitária',
   description: 'Um fundo de reserva dedicado a manter nossa casa estável e pronta para acolher novos membros.',
   percentage: '20%',
   color: '#ff9800', // Orange
   icon: faCoins
  },
  {
   title: 'Estrutura Eterna',
   description: 'Manutenção de servidores e sistemas que garantem que nossa mensagem nunca saia do ar.',
   percentage: '10%',
   color: '#0D9488', // Teal
   icon: faArrowUp
  }
 ];

 const copyToClipboard = () => {
  navigator.clipboard.writeText(TOKEN_ADDRESS);
  alert('Endereço copiado!');
 };

 return (
  <>
   <Script id="token-schema" type="application/ld+json" strategy="afterInteractive">
    {JSON.stringify({
     "@context": "https://schema.org",
     "@type": "WebPage",
     "name": "$MILAGRE Token - Apoie a Educação Cripto",
     "description": "O token $MILAGRE não é investimento, é um símbolo de apoio à educação financeira e proteção contra golpes na Web3.",
     "url": "https://tokenmilagre.xyz/token"
    })}
   </Script>

   <div className="min-h-screen relative transition-colors duration-300 font-sans">
    {/* Background Color with Mask to blend with Breadcrumbs */}




    <div className={`relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

     {/* Hero Section */}
     <section className="text-center space-y-8 mb-32 pt-12">
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

<h1 className="title-newtab text-4xl md:text-7xl tracking-tight leading-tight drop-shadow-sm">
       $MILAGRE <br />
       <span className="text-[var(--text-primary)]">
        Não é apenas um token. É um movimento por{' '}
       </span>
       <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-teal-500">
        prosperidade.
       </span>
      </h1>

      <p className="text-xl md:text-2xl text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed font-light">
       Não somos apenas holders. Somos uma comunidade com propósito.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
       <a
        href={`https://pump.fun/coin/${TOKEN_ADDRESS}`}
        target="_blank"
        rel="noopener noreferrer"
        className="px-10 py-5 rounded-full font-bold text-lg text-white backdrop-blur-md bg-gradient-to-r from-teal-500/90 to-green-500/90 border border-white/20 hover:from-teal-600/90 hover:to-green-600/90 shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-3"
       >
        <span>Junte-se à Comunidade</span>
        <FontAwesomeIcon icon={faHandshake} className="w-5 h-5" />
       </a>

       <button
        onClick={() => document.getElementById('saiba-mais')?.scrollIntoView({ behavior: 'smooth' })}
        className="px-10 py-5 rounded-full font-bold text-lg text-[var(--text-primary)] backdrop-blur-md bg-white/5 border border-white/10 hover:bg-white/10 shadow-lg hover:shadow-xl hover:scale-105 transition-all"
       >
        Entenda a Utilidade
       </button>
      </div>
     </section>

     {/* Os Pilares da Nossa Fé */}
     <section id="saiba-mais" className="mb-32">
      <div className="text-center mb-16">
<h2 className="title-newtab text-4xl md:text-5xl mb-6">
        Nossos Princípios
       </h2>
       <p className="text-xl text-[var(--text-secondary)]">Por que estamos aqui?</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
       {[
        {
         icon: faLightbulb,
         title: 'Iluminar Caminhos',
         description: 'Em vez de lutar contra a escuridão, nós acendemos a luz. Cada token financia a criação de mapas claros para quem deseja navegar o mercado financeiro com segurança e sabedoria.',
         color: '',
         bg: 'bg-green-500/10'
        },
        {
         icon: faUsers,
         title: 'Comunhão Real',
         description: 'A tecnologia conecta carteiras, mas o $MILAGRE conecta propósitos. Nossa comunidade é um santuário onde decisões são tomadas em conjunto e o sucesso de um é celebrado por todos.',
         color: '',
         bg: 'bg-teal-500/10'
        },
        {
         icon: faShieldAlt,
         title: 'Soberania do Ser',
         description: 'Acreditamos na liberdade total. Nosso movimento é financiado pela própria comunidade, garantindo que nossa voz e nossa direção permaneçam puras, sem influências externas.',
         color: '',
         bg: 'bg-blue-500/10'
        }
       ].map((item, index) => (
        <div key={index} className="glass-card p-10 rounded-3xl flex flex-col items-start group hover:border-[var(--brand-primary)] transition-colors">
         <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 ${item.bg} ${item.color} text-3xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
          <FontAwesomeIcon icon={item.icon} />
         </div>
<h3 className="title-newtab text-2xl mb-4">
          {item.title}
         </h3>
         <p className="text-[var(--text-secondary)] leading-relaxed">
          {item.description}
         </p>
        </div>
       ))}
      </div>
     </section>

     {/* Impact Section - O Fruto da Sua Contribuição */}
     <div className="mb-32">
      <div className="text-center mb-16">
<h2 className="title-newtab text-4xl md:text-5xl mb-6">
        O Fruto da Sua Contribuição
       </h2>
       <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
        Onde plantamos nossa energia?
       </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
       {impactAreas.map((area, index) => (
        <div key={index} className="glass-card p-8 rounded-[30px] text-center hover:bg-white/5 transition-all duration-300 group">
         <div className="w-16 h-16 rounded-2xl bg-[var(--bg-primary)] flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:scale-110 transition-transform">
          <FontAwesomeIcon icon={area.icon} className="text-2xl" style={{ color: area.color }} />
         </div>

<h3 className="title-newtab text-xl mb-3">{area.title}</h3>
         <p className="text-sm text-[var(--text-secondary)] mb-6 min-h-[40px]">{area.description}</p>
        </div>
       ))}
      </div>
     </div>

     {/* Tokenomics */}
     <section className="mb-32">
      <div className="relative">

       <div className="text-center mb-16 relative z-10">
<h2 className="title-newtab text-4xl md:text-5xl mb-6">
         Tokenomics Transparente
        </h2>
        <p className="text-xl text-[var(--text-secondary)]">
         100% na blockchain, verificável por todos.
        </p>
       </div>

       <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
        {/* Left: Stats & Info */}
        <div className="space-y-8">
         <div className="text-center lg:text-left">
          <p className="text-sm font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-2">Supply Total</p>
          <p className="text-6xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
           1 Bilhão
          </p>
          <p className="text-[var(--text-secondary)] mt-2">Tokens fixos. Imutável.</p>
         </div>

         <div className="glass-card p-8 rounded-2xl border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-2">
           <span className="text-xl font-bold text-[var(--text-primary)]">A Justiça</span>
           <span className="text-2xl font-bold ">100%</span>
          </div>
          <p className="text-[var(--text-secondary)]">Entregue à comunidade via Pump.fun. Sem privilégios, sem pré-venda, sem alocação de time.</p>
         </div>

         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
           { label: 'Rede', value: 'Solana', color: '', icon: faGlobe },
           { label: 'Contrato', value: 'Renunciado', color: '', icon: faShieldAlt },
           { label: 'Taxa', value: '0%', color: '', icon: faCheckCircle }
          ].map((stat, index) => (
           <div key={index} className="glass-card p-4 rounded-xl flex flex-col items-center text-center gap-2">
            <div className={`text-2xl ${stat.color}`}>
             <FontAwesomeIcon icon={stat.icon} />
            </div>
            <div>
             <p className="text-xs font-bold uppercase text-[var(--text-secondary)]">{stat.label}</p>
             <p className="text-lg font-bold text-[var(--text-primary)]">{stat.value}</p>
            </div>
           </div>
          ))}
         </div>
        </div>

        {/* Right: Visual Pie Chart */}
        <div className="relative flex justify-center">
         {/* CSS Pie Chart */}
         <div className="relative w-80 h-80 md:w-96 md:h-96">
          {/* Outer Glow */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-teal-500/20 to-blue-500/20 blur-3xl animate-pulse"></div>

          {/* Chart Container */}
          <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90 drop-shadow-2xl">
           {/* Segment 1: Community (100%) */}
           <circle
            cx="50"
            cy="50"
            r="40"
            fill="transparent"
            stroke="url(#gradient-community)"
            strokeWidth="12"
            strokeDasharray="251.2"
            strokeDashoffset="0"
            className="transition-all duration-1000 ease-out"
           />

           {/* Defs for Gradients */}
           <defs>
            <linearGradient id="gradient-community" x1="0%" y1="0%" x2="100%" y2="0%">
             <stop offset="0%" stopColor="#2DD4BF" /> {/* Teal 400 */}
             <stop offset="100%" stopColor="#3B82F6" /> {/* Blue 500 */}
            </linearGradient>
           </defs>
          </svg>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
           <span className="text-4xl font-bold text-[var(--text-primary)]">100%</span>
           <span className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider">Comunidade</span>
          </div>

          {/* Floating Labels */}
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[var(--bg-elevated)] px-4 py-2 rounded-full shadow-lg border border-[var(--border-light)] animate-bounce-slow">
           <span className="text-sm font-bold ">Pump.fun Launch</span>
          </div>
         </div>
        </div>
       </div>
      </div>
     </section>

     {/* Roadmap */}
     <section className="mb-32">
      <div className="text-center mb-16">
<h2 className="title-newtab text-4xl md:text-5xl mb-6">
        Nosso Roadmap
       </h2>
       <p className="text-xl text-[var(--text-secondary)]">
        Nossa jornada de desenvolvimento.
       </p>
      </div>

      <div className="space-y-8 relative">
       {/* Connecting Line */}
       <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-teal-500 via-blue-500 to-transparent hidden md:block transform -translate-x-1/2 rounded-full opacity-30"></div>

       {[
        {
         phase: 'Fase 1',
         title: 'O Despertar (Atual)',
         description: 'O nascimento da consciência. Estabelecemos nosso portal, unimos as primeiras Testemunhas e iniciamos a distribuição da "Palavra da Prosperidade" através de educação acessível.',
         icon: faSeedling,
         status: 'current',
         color: '',
         bg: 'bg-green-500/10',
         border: 'border-green-500'
        },
        {
         phase: 'Fase 2',
         title: 'Os Escudos de Luz',
         description: 'Desenvolvimento de inteligência artificial que atua como guardiã, analisando oportunidades e garantindo que nossa comunidade caminhe sempre em solo firme.',
         icon: faShieldAlt,
         status: 'upcoming',
         color: '',
         bg: 'bg-amber-500/10',
         border: 'border-amber-500'
        },
        {
         phase: 'Fase 3',
         title: 'O Reino da Decisão',
         description: 'A maturidade total. Implementação de governança onde cada Testemunha tem voz ativa para decidir quais novas fronteiras de conhecimento devemos explorar.',
         icon: faUsers,
         status: 'future',
         color: '',
         bg: 'bg-blue-500/10',
         border: 'border-blue-500'
        }
       ].map((phase, index) => (
        <div key={index} className={`relative flex flex-col md:flex-row gap-8 items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>

         {/* Content */}
         <div className="flex-1 w-full">
          <div className={`glass-card p-8 rounded-3xl border-t-4 ${phase.border} hover:transform hover:-translate-y-2 transition-all duration-300`}>
           <div className="flex items-center justify-between mb-4">
            <span className={`text-sm font-bold uppercase tracking-widest ${phase.color}`}>{phase.phase}</span>
            {phase.status === 'current' && (
             <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-500/10 border border-green-500/20">
              Em Andamento
             </span>
            )}
           </div>
<h3 className="title-newtab text-2xl mb-3">{phase.title}</h3>
           <p className="text-[var(--text-secondary)]">{phase.description}</p>
          </div>
         </div>

         {/* Icon Marker */}
         <div className={`relative z-10 w-16 h-16 rounded-full ${phase.bg} ${phase.color} flex items-center justify-center text-2xl shadow-lg border-4 border-[var(--bg-secondary)]`}>
          <FontAwesomeIcon icon={phase.icon} />
         </div>

         {/* Spacer for layout balance */}
         <div className="flex-1 hidden md:block"></div>
        </div>
       ))}
      </div>
     </section>

     {/* Utilidade em Desenvolvimento */}
     <section className="mb-32">
      <div className="glass-card p-8 md:p-12 rounded-3xl border-l-4 border-amber-500">
<h3 className="title-newtab text-2xl md:text-3xl mb-6">
        Utilidade em Desenvolvimento
       </h3>

       <p className="text-[var(--text-secondary)] mb-6 text-lg leading-relaxed">
        Atualmente, o $MILAGRE é um token de comunidade e apoio à educação.
        Estamos desenvolvendo utilidades reais que serão anunciadas com total transparência.
       </p>

       <div className="grid md:grid-cols-3 gap-4 mb-6">
        {[
         { text: 'Acesso a conteúdo exclusivo', icon: faLightbulb },
         { text: 'Governança comunitária', icon: faUsers },
         { text: 'Benefícios para holders', icon: faCoins }
        ].map((item, index) => (
         <div key={index} className="flex items-center gap-3 p-4 rounded-xl bg-[var(--bg-primary)]">
          <FontAwesomeIcon icon={item.icon} className="" />
          <span className="text-[var(--text-secondary)]">{item.text}</span>
         </div>
        ))}
       </div>

       <p className="text-sm text-[var(--text-tertiary)] italic">
        Nota: Utilidades são planos em desenvolvimento, não promessas. Acompanhe atualizações em{' '}
        <a href="/roadmap" className="underline hover:text-[var(--brand-primary)]">/roadmap</a>.
       </p>
      </div>
     </section>

     {/* Como Participar */}
     <section className="mb-32">
      <div>
       <div className="text-center mb-16">
<h2 className="title-newtab text-4xl md:text-5xl mb-6">
         Como Participar
        </h2>
        <p className="text-xl text-[var(--text-secondary)]">
         Seu convite para fazer parte da comunidade.
        </p>
       </div>

       <div className="grid md:grid-cols-3 gap-8">
        {[
         {
          step: '01',
          title: 'Prepare sua Carteira',
          desc: 'Use Phantom ou Solflare. Você é o único guardião de suas chaves.',
          icon: faWallet,
          color: 'text-purple-500'
         },
         {
          step: '02',
          title: 'Obtenha a Energia',
          desc: 'Tenha SOL disponível para a troca.',
          icon: faCoins,
          color: ''
         },
         {
          step: '03',
          title: 'Adquira $MILAGRE',
          desc: 'Acesse o Pump.fun oficial e apoie o projeto.',
          icon: faExchangeAlt,
          color: ''
         }
        ].map((item, index) => (
         <div key={index} className="glass-card p-8 rounded-3xl relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 text-9xl font-bold opacity-5 select-none text-[var(--text-primary)]">
           {item.step}
          </div>
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-[var(--bg-primary)] ${item.color} text-2xl shadow-sm`}>
           <FontAwesomeIcon icon={item.icon} />
          </div>
<h3 className="title-newtab text-xl mb-3">
           {item.title}
          </h3>
          <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
           {item.desc}
          </p>
         </div>
        ))}
       </div>

       <div className="mt-12 text-center">
        <a
         href={`https://pump.fun/coin/${TOKEN_ADDRESS}`}
         target="_blank"
         rel="noopener noreferrer"
         className="inline-flex items-center gap-3 px-6 py-3 md:px-10 md:py-5 rounded-full font-bold text-base md:text-lg text-white backdrop-blur-md bg-gradient-to-r from-[#0d9488]/90 to-[#0f766e]/90 border border-white/20 hover:from-[#0d9488] hover:to-[#0f766e] shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
        >
         <span>Acessar o Pump.fun Oficial</span>
         <FontAwesomeIcon icon={faExternalLinkAlt} className="w-5 h-5" />
        </a>
       </div>
      </div>
     </section>

     {/* Final CTA & Contract */}
     <section className="text-center pb-12">
<h2 className="title-newtab text-4xl md:text-6xl mb-8">
       Bem-vindo à família.
      </h2>

      <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto text-[var(--text-secondary)]">
       Ao segurar o $MILAGRE, você não está apenas investindo em um ativo. Você está investindo em si mesmo e no futuro de todos nós.
      </p>

      <div className="flex flex-wrap justify-center gap-6 mb-16">
       <a
        href={SOCIAL_LINKS.DISCORD}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative px-10 py-5 rounded-full glass-card bg-[#5865F2]/10 hover:bg-[#5865F2]/20 border border-[#5865F2]/20 text-[#5865F2] font-bold text-lg overflow-hidden transition-all hover:scale-105 hover:shadow-xl"
       >
        <div className="relative flex items-center gap-3">
         <FontAwesomeIcon icon={faDiscord} className="text-2xl" />
         <span>Discord</span>
        </div>
       </a>

       <a
        href={SOCIAL_LINKS.TELEGRAM}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative px-10 py-5 rounded-full glass-card bg-[#0088cc]/10 hover:bg-[#0088cc]/20 border border-[#0088cc]/20 text-[#0088cc] font-bold text-lg overflow-hidden transition-all hover:scale-105 hover:shadow-xl"
       >
        <div className="relative flex items-center gap-3">
         <FontAwesomeIcon icon={faTelegram} className="text-2xl" />
         <span>Telegram</span>
        </div>
       </a>
      </div>

      <div className="max-w-3xl mx-auto glass-card p-8 rounded-3xl">
       <p className="text-sm font-bold uppercase tracking-widest mb-4 text-[var(--text-secondary)]">
        Endereço do Contrato Oficial
       </p>
       <div className="flex flex-col md:flex-row items-center gap-4 justify-center">
        <code className="font-mono text-sm md:text-base px-6 py-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-medium)] text-[var(--text-primary)] break-all">
         {TOKEN_ADDRESS}
        </code>
        <button
         onClick={copyToClipboard}
         className="p-4 rounded-xl backdrop-blur-md bg-[var(--brand-primary)]/90 text-white hover:bg-[var(--brand-primary)] border border-white/20 transition-all shadow-lg hover:scale-105"
         title="Copiar endereço"
        >
         <FontAwesomeIcon icon={faCopy} />
        </button>
       </div>
      </div>

      <p className="text-sm mt-12 max-w-2xl mx-auto leading-relaxed text-[var(--text-tertiary)]">
       Isenção de Responsabilidade: O $MILAGRE é um token de utilidade comunitária focado em educação e pertencimento. O valor financeiro é consequência do nosso trabalho, não uma promessa garantida. Faça sua própria pesquisa e participe com consciência.
      </p>

      <p className="text-sm mt-6 text-center text-[var(--text-tertiary)]">
       ⚠️ Holdings da equipe visíveis em{' '}
       <a href="/transparencia" className="underline hover:text-[var(--brand-primary)] transition-colors">
        /transparencia
       </a>
      </p>
     </section>

    </div >

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
   </div >
  </>
 );
}
