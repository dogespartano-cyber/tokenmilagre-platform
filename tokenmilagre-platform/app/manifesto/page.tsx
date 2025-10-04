'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SignManifesto } from '@/components/SignManifesto';

export default function ManifestoPage() {
  const [activeSection, setActiveSection] = useState('preambulo');

  const sections = [
    { id: 'preambulo', title: 'Preâmbulo' },
    { id: 'visao', title: 'Nossa Visão' },
    { id: 'missao', title: 'Nossa Missão' },
    { id: 'valores', title: 'Valores Fundamentais' },
    { id: 'compromissos', title: 'Nossos Compromissos' },
    { id: 'governanca', title: 'Princípios de Governança' },
    { id: 'guardioes', title: 'Nossos Três Guardiões' },
    { id: 'conduta', title: 'Código de Conduta' },
    { id: 'opensource', title: 'Compromisso Open Source' },
    { id: 'roadmap', title: 'Roadmap de Longo Prazo' },
    { id: 'metricas', title: 'Métricas de Sucesso' },
    { id: 'convite', title: 'Convite à Ação' },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#5DD4D4] via-[#4DB8D8] to-[#E8F4F4]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-[#4DB8D8]/95 to-[#5DD4D4]/95 backdrop-blur-lg border-b-2 border-white/20 shadow-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition group">
              <div className="text-xl sm:text-2xl font-bold text-white drop-shadow-lg font-[family-name:var(--font-poppins)]">
                $MILAGRE
              </div>
            </Link>
            <Link
              href="/"
              className="text-white hover:text-yellow-300 transition font-semibold"
            >
              ← Voltar
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation - Desktop */}
          <aside className="hidden lg:block lg:w-64 flex-shrink-0">
            <div className="sticky top-24 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border-2 border-white/30 shadow-xl">
              <h3 className="text-white font-bold text-lg mb-4 font-[family-name:var(--font-poppins)]">
                Navegação
              </h3>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                      activeSection === section.id
                        ? 'bg-yellow-400/30 text-white font-semibold border-l-4 border-yellow-400'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 max-w-4xl">
            {/* Hero */}
            <div className="bg-gradient-to-br from-yellow-400/20 to-amber-400/20 backdrop-blur-xl rounded-3xl p-8 md:p-12 border-2 border-yellow-300/40 shadow-2xl mb-8">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-4 drop-shadow-lg font-[family-name:var(--font-poppins)]">
                Manifesto Open Source
              </h1>
              <h2 className="text-3xl sm:text-4xl font-bold text-yellow-200 mb-6 flex items-center gap-3">
                <span>Nunca Estarás Sozinho</span>
                <span className="text-4xl animate-pulse">❤️</span>
              </h2>
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-semibold">
                  Versão 1.0
                </span>
                <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-semibold">
                  Outubro 2025
                </span>
                <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-semibold">
                  Licença CC BY-SA 4.0
                </span>
              </div>
              <p className="text-white/95 text-lg leading-relaxed">
                Um movimento de apoio mútuo genuíno construído sobre os princípios do código aberto,
                da colaboração peer-to-peer e da crença fundamental de que <strong className="text-yellow-200">juntos somos mais fortes</strong>.
              </p>
            </div>

            {/* Sign Manifesto CTA */}
            <SignManifesto />

            {/* Content Sections */}
            <div className="space-y-8">
              {/* Preâmbulo */}
              <section id="preambulo" className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border-2 border-white/30 shadow-xl scroll-mt-24">
                <h2 className="text-3xl font-bold text-white mb-4 font-[family-name:var(--font-poppins)]">
                  Preâmbulo
                </h2>
                <div className="text-white/95 space-y-4 leading-relaxed">
                  <p>
                    Em um mundo onde a tecnologia blockchain frequentemente se concentra apenas em ganhos financeiros,
                    o $MILAGRE surge como uma resposta diferente: um movimento de apoio mútuo genuíno construído sobre
                    os princípios do código aberto, da colaboração peer-to-peer e da crença fundamental de que{' '}
                    <strong className="text-yellow-200">juntos somos mais fortes</strong>.
                  </p>
                  <p>
                    Inspirados pela filosofia das comunidades Linux e open source, onde o conhecimento é livre,
                    a colaboração é incentivada e o mérito vem da contribuição real, criamos o $MILAGRE como um{' '}
                    <strong className="text-yellow-200">commons digital</strong> - um bem coletivo gerido pela comunidade,
                    para a comunidade.
                  </p>
                  <p>
                    Este manifesto declara nossos princípios, compromissos e visão para construir não apenas um token,
                    mas um ecossistema descentralizado de prosperidade, sabedoria e esperança compartilhadas.
                  </p>
                </div>
              </section>

              {/* Nossa Visão */}
              <section id="visao" className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border-2 border-white/30 shadow-xl scroll-mt-24">
                <h2 className="text-3xl font-bold text-white mb-4 font-[family-name:var(--font-poppins)]">
                  Nossa Visão
                </h2>
                <h3 className="text-2xl font-bold text-yellow-200 mb-4">
                  Um Mundo Onde Ninguém Caminha Sozinho
                </h3>
                <div className="text-white/95 space-y-4 leading-relaxed">
                  <p>
                    Visionamos um ecossistema descentralizado onde tecnologia blockchain serve como infraestrutura
                    para conexão humana genuína, onde holders não são apenas investidores, mas membros ativos de
                    uma comunidade que se apoia mutuamente em momentos de dúvida, celebração e crescimento.
                  </p>
                  <div className="bg-white/10 rounded-xl p-6 space-y-3">
                    <p className="font-semibold text-yellow-200">Acreditamos que:</p>
                    <ul className="space-y-2 ml-4">
                      <li className="flex items-start gap-2">
                        <span className="text-yellow-300 mt-1">✦</span>
                        <span><strong>A colaboração supera a competição</strong> - O valor real emerge quando pessoas compartilham conhecimento, recursos e experiências livremente</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-yellow-300 mt-1">✦</span>
                        <span><strong>Transparência constrói confiança</strong> - Abertura total sobre decisões, finanças e processos fortalece vínculos comunitários</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-yellow-300 mt-1">✦</span>
                        <span><strong>Conhecimento deve ser livre</strong> - Educação e recursos devem estar acessíveis a todos, sem barreiras de entrada</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-yellow-300 mt-1">✦</span>
                        <span><strong>Meritocracia através da contribuição</strong> - Influência e reconhecimento vêm de ajudar ativamente, não apenas de acumular tokens</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-yellow-300 mt-1">✦</span>
                        <span><strong>Tecnologia serve humanidade</strong> - Blockchain é ferramenta para empoderar pessoas, não apenas para especulação financeira</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Nossa Missão */}
              <section id="missao" className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border-2 border-white/30 shadow-xl scroll-mt-24">
                <h2 className="text-3xl font-bold text-white mb-4 font-[family-name:var(--font-poppins)]">
                  Nossa Missão
                </h2>
                <h3 className="text-2xl font-bold text-yellow-200 mb-4">
                  Construir o Maior Ecossistema de Apoio Mútuo Descentralizado do Mundo
                </h3>
                <div className="text-white/95 space-y-4 leading-relaxed">
                  <p>
                    Nossa missão é criar e sustentar uma comunidade global na blockchain Solana onde cada membro tem acesso a:
                  </p>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-yellow-400/20 to-amber-400/20 rounded-xl p-6 border border-yellow-300/30">
                      <div className="text-4xl mb-3">👼</div>
                      <h4 className="font-bold text-yellow-200 mb-2">Prosperidade Compartilhada</h4>
                      <p className="text-sm">Orientação financeira, educação sobre blockchain/DeFi e oportunidades de crescimento econômico através de colaboração</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-xl p-6 border border-blue-300/30">
                      <div className="text-4xl mb-3">🧙</div>
                      <h4 className="font-bold text-blue-200 mb-2">Sabedoria Coletiva</h4>
                      <p className="text-sm">Mentorias peer-to-peer, workshops educacionais, biblioteca de conhecimento aberta e networking profissional genuíno</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-xl p-6 border border-purple-300/30">
                      <div className="text-4xl mb-3">💫</div>
                      <h4 className="font-bold text-purple-200 mb-2">Esperança Constante</h4>
                      <p className="text-sm">Suporte emocional, comunidade de apoio 24/7, histórias de superação e certeza de que sempre haverá alguém para ajudar</p>
                    </div>
                  </div>
                  <div className="bg-yellow-400/20 rounded-xl p-6 border border-yellow-300/30 text-center">
                    <p className="font-semibold text-xl">
                      💡 <strong className="text-yellow-300">Do Only Good Everyday</strong> - Fazemos apenas o bem, todos os dias, sem exceção.
                    </p>
                  </div>
                </div>
              </section>

              {/* Call to Action - Leia Mais */}
              <div className="bg-gradient-to-br from-yellow-400/20 to-amber-400/20 backdrop-blur-xl rounded-2xl p-8 border-2 border-yellow-300/40 text-center">
                <h3 className="text-2xl font-bold text-white mb-4">
                  📖 Manifesto Completo
                </h3>
                <p className="text-white/95 mb-6">
                  Este é apenas o início. O manifesto completo contém nossos 7 valores fundamentais,
                  compromissos com a comunidade, princípios de governança e muito mais.
                </p>
                <a
                  href="/MANIFESTO.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-8 py-4 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-gray-900 font-bold text-lg rounded-full transition-all shadow-xl hover:scale-105"
                >
                  Ler Manifesto Completo (PDF)
                </a>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
