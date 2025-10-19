'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function ManifestoPage() {
  const [activeSection, setActiveSection] = useState('preambulo');
  const [showScrollTop, setShowScrollTop] = useState(false);

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

  // Scroll spy - detecta seção ativa automaticamente
  useEffect(() => {
    const handleScrollSpy = () => {
      // Offset para compensar o header fixo
      const scrollOffset = 150;
      const scrollPosition = window.scrollY + scrollOffset;

      // Encontrar qual seção está visível
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i].id);
        if (section) {
          const sectionTop = section.offsetTop;
          const sectionHeight = section.offsetHeight;

          // Verifica se o scroll está dentro desta seção
          if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            setActiveSection(sections[i].id);
            break;
          }
        }
      }
    };

    // Executar imediatamente e no scroll
    handleScrollSpy();
    window.addEventListener('scroll', handleScrollSpy);

    return () => window.removeEventListener('scroll', handleScrollSpy);
  }, [sections]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="mb-8">
          <Breadcrumbs />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation - Desktop */}
          <aside className="hidden lg:block lg:w-64 flex-shrink-0">
            <div className="sticky top-24 backdrop-blur-lg rounded-2xl p-6 border-2 shadow-theme-xl" style={{
              backgroundColor: 'var(--bg-elevated)',
              borderColor: 'var(--border-medium)'
            }}>
              <h3 className="font-bold text-lg mb-4 font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
                Navegação
              </h3>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                      activeSection === section.id
                        ? 'font-semibold border-l-4'
                        : 'hover:opacity-80'
                    }`}
                    style={{
                      backgroundColor: activeSection === section.id ? 'var(--brand-primary-alpha)' : 'transparent',
                      color: activeSection === section.id ? 'var(--brand-primary)' : 'var(--text-secondary)',
                      borderLeftColor: activeSection === section.id ? 'var(--brand-primary)' : 'transparent'
                    }}
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
            <div className="backdrop-blur-xl rounded-3xl p-8 md:p-12 border-2 shadow-2xl mb-8" style={{
              backgroundColor: 'var(--bg-elevated)',
              borderColor: 'var(--border-medium)'
            }}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
                Manifesto Open Source
              </h1>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 flex items-center gap-3" style={{ color: 'var(--brand-primary)' }}>
                <span>Nunca Estarás Sozinho</span>
                <span className="text-4xl animate-pulse">❤️</span>
              </h2>
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="px-4 py-2 backdrop-blur-sm rounded-full text-sm font-semibold" style={{
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-primary)'
                }}>
                  Versão 1.0
                </span>
                <span className="px-4 py-2 backdrop-blur-sm rounded-full text-sm font-semibold" style={{
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-primary)'
                }}>
                  Outubro 2025
                </span>
                <span className="px-4 py-2 backdrop-blur-sm rounded-full text-sm font-semibold" style={{
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-primary)'
                }}>
                  Licença CC BY-SA 4.0
                </span>
              </div>
              <p className="text-lg leading-relaxed mb-6" style={{ color: 'var(--text-primary)' }}>
                Um movimento de apoio mútuo genuíno construído sobre os princípios do código aberto,
                da colaboração peer-to-peer e da crença fundamental de que <strong style={{ color: 'var(--brand-primary)' }}>juntos somos mais fortes</strong>.
              </p>

              {/* Community Buttons */}
              <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                <a
                  href="https://discord.gg/skaX8bFY"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg hover:shadow-xl hover:scale-105 whitespace-nowrap"
                  style={{
                    background: 'linear-gradient(135deg, #5865F2, #4752C4)',
                    color: 'white'
                  }}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                  <span>Discord</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </a>

                <a
                  href="https://t.me/+Bop_TVFc_mg3Njlh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg hover:shadow-xl hover:scale-105 whitespace-nowrap"
                  style={{
                    background: 'linear-gradient(135deg, #0088cc, #006699)',
                    color: 'white'
                  }}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12s12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21l-1.446 1.394c-.14.18-.357.295-.6.295c-.002 0-.003 0-.005 0l.213-3.054l5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326l-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
                  </svg>
                  <span>Telegram</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </a>
              </div>
            </div>

            {/* Content Sections */}
            <div className="space-y-8">
              {/* Preâmbulo */}
              <section id="preambulo" className="backdrop-blur-lg rounded-2xl p-8 border-2 shadow-theme-xl scroll-mt-24" style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border-medium)'
              }}>
                <h2 className="text-3xl font-bold mb-4 font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
                  Preâmbulo
                </h2>
                <div className="space-y-4 leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                  <p>
                    Em um mundo onde a tecnologia blockchain frequentemente se concentra apenas em ganhos financeiros,
                    o $MILAGRE surge como uma resposta diferente: um movimento de apoio mútuo genuíno construído sobre
                    os princípios do código aberto, da colaboração peer-to-peer e da crença fundamental de que{' '}
                    <strong style={{ color: 'var(--brand-primary)' }}>juntos somos mais fortes</strong>.
                  </p>
                  <p>
                    Inspirados pela filosofia das comunidades Linux e open source, onde o conhecimento é livre,
                    a colaboração é incentivada e o mérito vem da contribuição real, criamos o $MILAGRE como um{' '}
                    <strong style={{ color: 'var(--brand-primary)' }}>commons digital</strong> - um bem coletivo gerido pela comunidade,
                    para a comunidade.
                  </p>
                  <p>
                    Este manifesto declara nossos princípios, compromissos e visão para construir não apenas um token,
                    mas um ecossistema descentralizado de prosperidade, sabedoria e esperança compartilhadas.
                  </p>
                </div>
              </section>

              {/* Nossa Visão */}
              <section id="visao" className="backdrop-blur-lg rounded-2xl p-8 border-2 shadow-theme-xl scroll-mt-24" style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border-medium)'
              }}>
                <h2 className="text-3xl font-bold mb-4 font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
                  Nossa Visão
                </h2>
                <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--brand-primary)' }}>
                  Um Mundo Onde Ninguém Caminha Sozinho
                </h3>
                <div className="space-y-4 leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                  <p>
                    Visionamos um ecossistema descentralizado onde tecnologia blockchain serve como infraestrutura
                    para conexão humana genuína, onde holders não são apenas investidores, mas membros ativos de
                    uma comunidade que se apoia mutuamente em momentos de dúvida, celebração e crescimento.
                  </p>
                  <div className="rounded-xl p-6 space-y-3" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                    <p className="font-semibold" style={{ color: 'var(--brand-primary)' }}>Acreditamos que:</p>
                    <ul className="space-y-2 ml-4">
                      <li className="flex items-start gap-2">
                        <span className="mt-1" style={{ color: 'var(--brand-primary)' }}>✦</span>
                        <span><strong>A colaboração supera a competição</strong> - O valor real emerge quando pessoas compartilham conhecimento, recursos e experiências livremente</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1" style={{ color: 'var(--brand-primary)' }}>✦</span>
                        <span><strong>Transparência constrói confiança</strong> - Abertura total sobre decisões, finanças e processos fortalece vínculos comunitários</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1" style={{ color: 'var(--brand-primary)' }}>✦</span>
                        <span><strong>Conhecimento deve ser livre</strong> - Educação e recursos devem estar acessíveis a todos, sem barreiras de entrada</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1" style={{ color: 'var(--brand-primary)' }}>✦</span>
                        <span><strong>Meritocracia através da contribuição</strong> - Influência e reconhecimento vêm de ajudar ativamente, não apenas de acumular tokens</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1" style={{ color: 'var(--brand-primary)' }}>✦</span>
                        <span><strong>Tecnologia serve humanidade</strong> - Blockchain é ferramenta para empoderar pessoas, não apenas para especulação financeira</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Nossa Missão */}
              <section id="missao" className="backdrop-blur-lg rounded-2xl p-8 border-2 shadow-theme-xl scroll-mt-24" style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border-medium)'
              }}>
                <h2 className="text-3xl font-bold mb-4 font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
                  Nossa Missão
                </h2>
                <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--brand-primary)' }}>
                  Construir o Maior Ecossistema de Apoio Mútuo Descentralizado do Mundo
                </h3>
                <div className="space-y-4 leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                  <p>
                    Nossa missão é criar e sustentar uma comunidade global na blockchain Solana onde cada membro tem acesso a:
                  </p>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="rounded-xl p-6 border" style={{
                      backgroundColor: 'var(--bg-secondary)',
                      borderColor: 'var(--border-light)'
                    }}>
                      <div className="text-4xl mb-3">👼</div>
                      <h4 className="font-bold mb-2" style={{ color: 'var(--brand-primary)' }}>Prosperidade Compartilhada</h4>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Orientação financeira, educação sobre blockchain/DeFi e oportunidades de crescimento econômico através de colaboração</p>
                    </div>
                    <div className="rounded-xl p-6 border" style={{
                      backgroundColor: 'var(--bg-secondary)',
                      borderColor: 'var(--border-light)'
                    }}>
                      <div className="text-4xl mb-3">🧙</div>
                      <h4 className="font-bold mb-2" style={{ color: 'var(--brand-primary)' }}>Sabedoria Coletiva</h4>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Mentorias peer-to-peer, workshops educacionais, biblioteca de conhecimento aberta e networking profissional genuíno</p>
                    </div>
                    <div className="rounded-xl p-6 border" style={{
                      backgroundColor: 'var(--bg-secondary)',
                      borderColor: 'var(--border-light)'
                    }}>
                      <div className="text-4xl mb-3">💫</div>
                      <h4 className="font-bold mb-2" style={{ color: 'var(--brand-primary)' }}>Esperança Constante</h4>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Suporte emocional, comunidade de apoio 24/7, histórias de superação e certeza de que sempre haverá alguém para ajudar</p>
                    </div>
                  </div>
                  <div className="rounded-xl p-6 border text-center" style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-light)'
                  }}>
                    <p className="font-semibold text-xl">
                      💡 <strong style={{ color: 'var(--brand-primary)' }}>Do Only Good Everyday</strong> - Fazemos apenas o bem, todos os dias, sem exceção.
                    </p>
                  </div>
                </div>
              </section>

              {/* Valores Fundamentais */}
              <section id="valores" className="backdrop-blur-lg rounded-2xl p-8 border-2 shadow-theme-xl scroll-mt-24" style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border-medium)'
              }}>
                <h2 className="text-3xl font-bold mb-6 font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
                  Nossos Valores Fundamentais
                </h2>
                <div className="space-y-6">
                  {/* Valor 1 */}
                  <div className="rounded-xl p-6 border" style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-light)'
                  }}>
                    <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--brand-primary)' }}>1. Transparência Radical</h3>
                    <p className="mb-4" style={{ color: 'var(--text-primary)' }}>Toda decisão, transação e processo é visível publicamente na blockchain e em nossas plataformas abertas.</p>
                    <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                      <p className="text-sm mb-2 font-semibold" style={{ color: 'var(--text-secondary)' }}>Na prática:</p>
                      <ul className="space-y-1 text-sm ml-4" style={{ color: 'var(--text-secondary)' }}>
                        <li>• Votações de governança públicas e auditáveis on-chain</li>
                        <li>• Treasury comunitária com multisig transparente</li>
                        <li>• Relatórios mensais publicados abertamente</li>
                        <li>• Código-fonte disponível no GitHub</li>
                        <li>• Falhas compartilhadas como oportunidades educacionais</li>
                      </ul>
                    </div>
                  </div>

                  {/* Valor 2 */}
                  <div className="rounded-xl p-6 border" style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-light)'
                  }}>
                    <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--brand-primary)' }}>2. Colaboração Aberta</h3>
                    <p className="mb-4" style={{ color: 'var(--text-primary)' }}>Seguindo o modelo open source, qualquer holder pode contribuir com código, ideias, conteúdo educacional ou suporte à comunidade.</p>
                    <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                      <p className="text-sm mb-2 font-semibold" style={{ color: 'var(--text-secondary)' }}>Na prática:</p>
                      <ul className="space-y-1 text-sm ml-4" style={{ color: 'var(--text-secondary)' }}>
                        <li>• Repositórios GitHub públicos com processos claros</li>
                        <li>• Sistema de proposals aberto a todos</li>
                        <li>• Wiki colaborativa construída coletivamente</li>
                        <li>• Grupos de trabalho auto-organizados</li>
                        <li>• Reconhecimento através de badges NFT on-chain</li>
                      </ul>
                    </div>
                  </div>

                  {/* Valor 3 */}
                  <div className="rounded-xl p-6 border" style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-light)'
                  }}>
                    <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--brand-primary)' }}>3. Inclusão e Acessibilidade</h3>
                    <p className="mb-4" style={{ color: 'var(--text-primary)' }}>O $MILAGRE é para todos, independente de experiência técnica, quantidade de tokens ou background.</p>
                    <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                      <p className="text-sm mb-2 font-semibold" style={{ color: 'var(--text-secondary)' }}>Na prática:</p>
                      <ul className="space-y-1 text-sm ml-4" style={{ color: 'var(--text-secondary)' }}>
                        <li>• Tutoriais em múltiplos formatos (texto, vídeo, workshops)</li>
                        <li>• Suporte em português e outros idiomas</li>
                        <li>• Onboarding estruturado para novos membros</li>
                        <li>• Governança acessível (votação off-chain para reduzir custos)</li>
                        <li>• Mentorias gratuitas disponíveis a todos</li>
                      </ul>
                    </div>
                  </div>

                  {/* Valor 4 */}
                  <div className="rounded-xl p-6 border" style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-light)'
                  }}>
                    <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--brand-primary)' }}>4. Meritocracia da Contribuição</h3>
                    <p className="mb-4" style={{ color: 'var(--text-primary)' }}>Poder e reconhecimento na comunidade vêm de ajudar ativamente, não apenas de quantidade de tokens mantidos.</p>
                    <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                      <p className="text-sm mb-2 font-semibold" style={{ color: 'var(--text-secondary)' }}>Na prática:</p>
                      <ul className="space-y-1 text-sm ml-4" style={{ color: 'var(--text-secondary)' }}>
                        <li>• Sistema de reputação on-chain baseado em contribuições</li>
                        <li>• Badges NFT que demonstram expertise e apoio</li>
                        <li>• Delegação de votos para contribuidores ativos</li>
                        <li>• Spotlights mensais celebrando membros</li>
                        <li>• Grants priorizando contribuidores estabelecidos</li>
                      </ul>
                    </div>
                  </div>

                  {/* Valor 5 */}
                  <div className="rounded-xl p-6 border" style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-light)'
                  }}>
                    <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--brand-primary)' }}>5. Apoio Mútuo Genuíno</h3>
                    <p className="mb-4" style={{ color: 'var(--text-primary)' }}>Esta não é uma comunidade transacional - é um ecossistema onde membros genuinamente se preocupam uns com os outros.</p>
                    <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                      <p className="text-sm mb-2 font-semibold" style={{ color: 'var(--text-secondary)' }}>Na prática:</p>
                      <ul className="space-y-1 text-sm ml-4" style={{ color: 'var(--text-secondary)' }}>
                        <li>• Sistema de mentoria peer-to-peer estruturado</li>
                        <li>• Canais de suporte emocional moderados com empatia</li>
                        <li>• Fundo de emergência comunitário</li>
                        <li>• Celebração coletiva de vitórias individuais</li>
                        <li>• Cultura &quot;perguntar não tem custo&quot;</li>
                      </ul>
                    </div>
                  </div>

                  {/* Valor 6 */}
                  <div className="rounded-xl p-6 border" style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-light)'
                  }}>
                    <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--brand-primary)' }}>6. Inovação Responsável</h3>
                    <p className="mb-4" style={{ color: 'var(--text-primary)' }}>Abraçamos experimentação e crescimento, mas sempre com responsabilidade para com a comunidade.</p>
                    <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                      <p className="text-sm mb-2 font-semibold" style={{ color: 'var(--text-secondary)' }}>Na prática:</p>
                      <ul className="space-y-1 text-sm ml-4" style={{ color: 'var(--text-secondary)' }}>
                        <li>• Auditorias regulares de smart contracts</li>
                        <li>• Testes extensivos antes de deployments</li>
                        <li>• Avaliação de impacto comunitário</li>
                        <li>• Iteração baseada em feedback real</li>
                        <li>• Roadmap flexível que se adapta</li>
                      </ul>
                    </div>
                  </div>

                  {/* Valor 7 */}
                  <div className="rounded-xl p-6 border" style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-light)'
                  }}>
                    <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--brand-primary)' }}>7. Sustentabilidade de Longo Prazo</h3>
                    <p className="mb-4" style={{ color: 'var(--text-primary)' }}>Construímos para gerações, não para pump-and-dumps.</p>
                    <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                      <p className="text-sm mb-2 font-semibold" style={{ color: 'var(--text-secondary)' }}>Na prática:</p>
                      <ul className="space-y-1 text-sm ml-4" style={{ color: 'var(--text-secondary)' }}>
                        <li>• Treasury gerida conservadoramente</li>
                        <li>• Investimento contínuo em educação</li>
                        <li>• Parcerias estratégicas alinhadas</li>
                        <li>• Cultura anti-especulação (contribuição &gt; holding)</li>
                        <li>• Planejamento de sucessão e rotação de liderança</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* Compromissos */}
              <section id="compromissos" className="backdrop-blur-lg rounded-2xl p-8 border-2 shadow-theme-xl scroll-mt-24" style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border-medium)'
              }}>
                <h2 className="text-3xl font-bold mb-6 font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
                  Nossos Compromissos
                </h2>
                <div className="space-y-6">
                  {/* Com Nossa Comunidade */}
                  <div className="rounded-xl p-6 border" style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-light)'
                  }}>
                    <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Com Nossa Comunidade</h3>
                    <div className="space-y-3" style={{ color: 'var(--text-primary)' }}>
                      <p>✦ <strong>Escutar Ativamente</strong> - Toda voz importa; implementaremos canais estruturados de feedback</p>
                      <p>✦ <strong>Governança Verdadeiramente Descentralizada</strong> - Decisões significativas sempre passarão por votação</p>
                      <p>✦ <strong>Educação Contínua</strong> - Investiremos constantemente em recursos educacionais gratuitos</p>
                      <p>✦ <strong>Suporte Incondicional</strong> - Nunca abandonaremos um membro em dificuldade</p>
                      <p>✦ <strong>Evolução Colaborativa</strong> - O roadmap será construído coletivamente</p>
                    </div>
                  </div>

                  {/* Com o Ecossistema Open Source */}
                  <div className="rounded-xl p-6 border" style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-light)'
                  }}>
                    <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Com o Ecossistema Open Source</h3>
                    <div className="space-y-3" style={{ color: 'var(--text-primary)' }}>
                      <p>✦ <strong>Contribuir de Volta</strong> - Compartilharemos ferramentas, código e aprendizados</p>
                      <p>✦ <strong>Adotar Padrões Abertos</strong> - Maximizar interoperabilidade</p>
                      <p>✦ <strong>Fomentar Colaboração Cross-Project</strong> - Parcerias com projetos alinhados</p>
                      <p>✦ <strong>Documentar Extensivamente</strong> - Facilitar aprendizado e replicação</p>
                      <p>✦ <strong>Licenciar Adequadamente</strong> - Todo código claramente licenciado</p>
                    </div>
                  </div>

                  {/* Com a Blockchain Solana */}
                  <div className="rounded-xl p-6 border" style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-light)'
                  }}>
                    <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Com a Blockchain Solana</h3>
                    <div className="space-y-3" style={{ color: 'var(--text-primary)' }}>
                      <p>✦ <strong>Maximizar Potencial da Rede</strong> - Velocidade e eficiência</p>
                      <p>✦ <strong>Contribuir para o Ecossistema</strong> - Ferramentas e conhecimento</p>
                      <p>✦ <strong>Promover Adoção Responsável</strong> - Educar sobre segurança</p>
                      <p>✦ <strong>Desenvolver Sustentavelmente</strong> - Eficiência energética</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Governança */}
              <section id="governanca" className="backdrop-blur-lg rounded-2xl p-8 border-2 shadow-theme-xl scroll-mt-24" style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border-medium)'
              }}>
                <h2 className="text-3xl font-bold mb-4 font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
                  Princípios de Governança
                </h2>
                <h3 className="text-xl mb-6" style={{ color: 'var(--brand-primary)' }}>Como Tomamos Decisões Coletivamente</h3>
                <div className="space-y-6">
                  <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                    <h4 className="text-lg font-bold mb-3" style={{ color: 'var(--text-primary)' }}>1. Do-ocracia (Quem Faz, Decide)</h4>
                    <p style={{ color: 'var(--text-primary)' }}>
                      Membros que contribuem ativamente para áreas específicas ganham maior influência nessas áreas.
                      Um holder que cria conteúdo educacional terá voz significativa em decisões sobre a biblioteca de conhecimento.
                    </p>
                  </div>

                  <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                    <h4 className="text-lg font-bold mb-3" style={{ color: 'var(--text-primary)' }}>2. Votação Híbrida</h4>
                    <div className="space-y-2" style={{ color: 'var(--text-primary)' }}>
                      <p><strong>• Votação Quadrática</strong> - Para decisões que afetam toda comunidade</p>
                      <p><strong>• Votação por Delegação</strong> - Delegar poder a representantes confiáveis</p>
                      <p><strong>• Votação Ponderada por Reputação</strong> - Contribuições passadas pesam nas decisões</p>
                    </div>
                  </div>

                  <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                    <h4 className="text-lg font-bold mb-3" style={{ color: 'var(--text-primary)' }}>3. Transparência Processual</h4>
                    <div className="space-y-2" style={{ color: 'var(--text-primary)' }}>
                      <p><strong>1.</strong> Discussão Aberta (7 dias mínimo)</p>
                      <p><strong>2.</strong> Refinamento Colaborativo</p>
                      <p><strong>3.</strong> Votação Formal (quorum mínimo)</p>
                      <p><strong>4.</strong> Implementação Transparente</p>
                      <p><strong>5.</strong> Avaliação de Impacto</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Guardiões Detalhados */}
              <section id="guardioes" className="backdrop-blur-lg rounded-2xl p-8 border-2 shadow-theme-xl scroll-mt-24" style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border-medium)'
              }}>
                <h2 className="text-3xl font-bold mb-6 font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
                  Nossos Três Guardiões
                </h2>
                <p className="mb-6" style={{ color: 'var(--text-primary)' }}>
                  Representam não apenas símbolos, mas áreas funcionais da comunidade
                </p>
                <div className="space-y-6">
                  {/* Guardiã da Prosperidade */}
                  <div className="rounded-xl p-6 border" style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-light)'
                  }}>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-5xl">👼</span>
                      <div>
                        <h3 className="text-xl font-bold" style={{ color: 'var(--brand-primary)' }}>Guardiã da Prosperidade</h3>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Empoderar holders com educação financeira</p>
                      </div>
                    </div>
                    <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                      <p className="text-sm mb-2 font-semibold" style={{ color: 'var(--text-secondary)' }}>Responsabilidades:</p>
                      <ul className="space-y-1 text-sm ml-4" style={{ color: 'var(--text-secondary)' }}>
                        <li>• Curadoria de conteúdo sobre DeFi e blockchain</li>
                        <li>• Coordenação de grupos de estudo sobre finanças</li>
                        <li>• Identificação de oportunidades no ecossistema Solana</li>
                        <li>• Mentorias sobre planejamento financeiro</li>
                      </ul>
                    </div>
                  </div>

                  {/* Guardião da Sabedoria */}
                  <div className="rounded-xl p-6 border" style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-light)'
                  }}>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-5xl">🧙</span>
                      <div>
                        <h3 className="text-xl font-bold" style={{ color: 'var(--brand-primary)' }}>Guardião da Sabedoria</h3>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Cultivar conhecimento coletivo</p>
                      </div>
                    </div>
                    <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                      <p className="text-sm mb-2 font-semibold" style={{ color: 'var(--text-secondary)' }}>Responsabilidades:</p>
                      <ul className="space-y-1 text-sm ml-4" style={{ color: 'var(--text-secondary)' }}>
                        <li>• Manutenção da biblioteca de conhecimento</li>
                        <li>• Organização de workshops e webinars</li>
                        <li>• Facilitação de mentorias peer-to-peer</li>
                        <li>• Documentação de casos de sucesso</li>
                      </ul>
                    </div>
                  </div>

                  {/* Anjo da Esperança */}
                  <div className="rounded-xl p-6 border" style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-light)'
                  }}>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-5xl">💫</span>
                      <div>
                        <h3 className="text-xl font-bold" style={{ color: 'var(--brand-primary)' }}>Anjo da Esperança</h3>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Prover suporte emocional</p>
                      </div>
                    </div>
                    <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                      <p className="text-sm mb-2 font-semibold" style={{ color: 'var(--text-secondary)' }}>Responsabilidades:</p>
                      <ul className="space-y-1 text-sm ml-4" style={{ color: 'var(--text-secondary)' }}>
                        <li>• Moderação empática de canais de suporte</li>
                        <li>• Coordenação de grupos de apoio</li>
                        <li>• Gestão do fundo de emergência</li>
                        <li>• Celebração de vitórias e marcos</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* Código de Conduta */}
              <section id="conduta" className="backdrop-blur-lg rounded-2xl p-8 border-2 shadow-theme-xl scroll-mt-24" style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border-medium)'
              }}>
                <h2 className="text-3xl font-bold mb-6 font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
                  Código de Conduta
                </h2>
                <div className="space-y-6">
                  <div className="rounded-xl p-6 border" style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-light)'
                  }}>
                    <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Como Nos Comportamos</h3>
                    <div className="space-y-2" style={{ color: 'var(--text-primary)' }}>
                      <p>✓ <strong>Praticar Respeito Universal</strong> - Tratamos todos com dignidade</p>
                      <p>✓ <strong>Contribuir Construtivamente</strong> - Críticas acompanhadas de sugestões</p>
                      <p>✓ <strong>Apoiar Ativamente</strong> - Perguntas são oportunidades de ajudar</p>
                      <p>✓ <strong>Ser Transparente</strong> - Declarar conflitos de interesse</p>
                      <p>✓ <strong>Celebrar Diversidade</strong> - Valorizar diferentes perspectivas</p>
                      <p>✓ <strong>Assumir Boa Fé</strong> - Presumir intenções positivas</p>
                      <p>✓ <strong>Proteger o Commons</strong> - Pensar no bem coletivo</p>
                    </div>
                  </div>

                  <div className="rounded-xl p-6 border" style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-light)'
                  }}>
                    <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Comportamentos Inaceitáveis</h3>
                    <div className="space-y-2" style={{ color: 'var(--text-primary)' }}>
                      <p>✗ Assédio, discriminação ou linguagem tóxica</p>
                      <p>✗ Spam, shilling ou promoção não autorizada</p>
                      <p>✗ Manipulação de preços ou esquemas fraudulentos</p>
                      <p>✗ Compartilhamento de informações privadas</p>
                      <p>✗ Gatekeeping (impedir acesso ao conhecimento)</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Open Source */}
              <section id="opensource" className="backdrop-blur-lg rounded-2xl p-8 border-2 shadow-theme-xl scroll-mt-24" style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border-medium)'
              }}>
                <h2 className="text-3xl font-bold mb-6 font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
                  Compromisso com Open Source
                </h2>
                <p className="mb-6" style={{ color: 'var(--text-primary)' }}>
                  Inspirados pelos gigantes do open source como Linux, Mozilla e Wikipedia
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                    <p style={{ color: 'var(--text-primary)' }}><strong style={{ color: 'var(--brand-primary)' }}>Liberar Código Abertamente</strong></p>
                    <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>Todo smart contract e ferramenta será código aberto</p>
                  </div>
                  <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                    <p style={{ color: 'var(--text-primary)' }}><strong style={{ color: 'var(--brand-primary)' }}>Documentar Extensivamente</strong></p>
                    <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>Documentação técnica completa e atualizada</p>
                  </div>
                  <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                    <p style={{ color: 'var(--text-primary)' }}><strong style={{ color: 'var(--brand-primary)' }}>Aceitar Contribuições</strong></p>
                    <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>Qualquer pessoa pode contribuir via pull requests</p>
                  </div>
                  <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                    <p style={{ color: 'var(--text-primary)' }}><strong style={{ color: 'var(--brand-primary)' }}>Compartilhar Aprendizados</strong></p>
                    <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>Post-mortems e lições para todo ecossistema</p>
                  </div>
                </div>
              </section>

              {/* Roadmap */}
              <section id="roadmap" className="backdrop-blur-lg rounded-2xl p-8 border-2 shadow-theme-xl scroll-mt-24" style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border-medium)'
              }}>
                <h2 className="text-3xl font-bold mb-6 font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
                  Roadmap de Longo Prazo
                </h2>
                <div className="space-y-6">
                  <div className="border-l-4 pl-6" style={{ borderLeftColor: 'var(--brand-primary)' }}>
                    <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--brand-primary)' }}>2025-2026: Fundação Sólida</h3>
                    <ul className="space-y-2" style={{ color: 'var(--text-primary)' }}>
                      <li>• Estabelecer governança DAO completa</li>
                      <li>• Construir biblioteca educacional abrangente</li>
                      <li>• Desenvolver sistema de mentoria robusto</li>
                      <li>• Atingir 10.000 holders ativos</li>
                      <li>• Lançar programa de grants comunitários</li>
                    </ul>
                  </div>

                  <div className="border-l-4 pl-6" style={{ borderLeftColor: 'var(--brand-primary)' }}>
                    <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--brand-primary)' }}>2027-2028: Expansão Sustentável</h3>
                    <ul className="space-y-2" style={{ color: 'var(--text-primary)' }}>
                      <li>• Criar subDAOs especializadas</li>
                      <li>• Desenvolver marketplace de serviços</li>
                      <li>• Implementar staking com recompensas por contribuição</li>
                      <li>• Expandir para múltiplas blockchains</li>
                      <li>• Parcerias com instituições educacionais</li>
                    </ul>
                  </div>

                  <div className="border-l-4 pl-6" style={{ borderLeftColor: 'var(--brand-primary)' }}>
                    <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--brand-primary)' }}>2029-2030: Maturidade e Impacto Global</h3>
                    <ul className="space-y-2" style={{ color: 'var(--text-primary)' }}>
                      <li>• Referência em comunidades Web3 orientadas a valores</li>
                      <li>• Influenciar padrões de governança descentralizada</li>
                      <li>• Fundo de impacto social gerido pela comunidade</li>
                      <li>• Sustentabilidade financeira completa</li>
                      <li>• Modelo documentado para replicação global</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Métricas de Sucesso */}
              <section id="metricas" className="backdrop-blur-lg rounded-2xl p-8 border-2 shadow-theme-xl scroll-mt-24" style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border-medium)'
              }}>
                <h2 className="text-3xl font-bold mb-6 font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
                  Métricas de Sucesso
                </h2>
                <p className="mb-6" style={{ color: 'var(--text-primary)' }}>
                  Diferente de projetos focados apenas em preço de token, medimos sucesso por:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="rounded-xl p-6 border" style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-light)'
                  }}>
                    <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Saúde Comunitária</h3>
                    <ul className="space-y-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      <li>• Número de mentorias completadas</li>
                      <li>• Taxa de retenção de holders (&gt;6 meses)</li>
                      <li>• Diversidade de contribuidores ativos</li>
                      <li>• Sentimento comunitário (pesquisas)</li>
                    </ul>
                  </div>

                  <div className="rounded-xl p-6 border" style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-light)'
                  }}>
                    <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Impacto Educacional</h3>
                    <ul className="space-y-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      <li>• Recursos criados e acessados</li>
                      <li>• Workshops realizados</li>
                      <li>• Certificações completadas</li>
                      <li>• Membros que viraram mentores</li>
                    </ul>
                  </div>

                  <div className="rounded-xl p-6 border" style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-light)'
                  }}>
                    <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Governança Descentralizada</h3>
                    <ul className="space-y-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      <li>• Taxa de participação em votações</li>
                      <li>• Diversidade de proponentes</li>
                      <li>• Proposals implementados com sucesso</li>
                      <li>• Índice Nakamoto de delegação</li>
                    </ul>
                  </div>

                  <div className="rounded-xl p-6 border" style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-light)'
                  }}>
                    <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Sustentabilidade</h3>
                    <ul className="space-y-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      <li>• Saúde da treasury</li>
                      <li>• Autossuficiência operacional</li>
                      <li>• Longevidade de contribuidores</li>
                      <li>• Taxa de renovação de liderança</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Convite à Ação */}
              <section id="convite" className="backdrop-blur-xl rounded-2xl p-8 md:p-12 border-2 shadow-2xl scroll-mt-24" style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border-medium)'
              }}>
                <div className="text-center">
                  <h2 className="text-3xl font-bold mb-6 font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
                    Junte-se ao Movimento ❤️
                  </h2>
                  <p className="text-lg mb-8 max-w-2xl mx-auto" style={{ color: 'var(--text-primary)' }}>
                    O $MILAGRE não pertence a fundadores ou baleias - pertence a todos que contribuem para torná-lo real.
                  </p>

                  <div className="rounded-xl p-6 mb-8 max-w-xl mx-auto" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                    <p className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Se você acredita que:</p>
                    <div className="space-y-2 text-left" style={{ color: 'var(--text-primary)' }}>
                      <p>✓ Colaboração é mais poderosa que competição</p>
                      <p>✓ Conhecimento deve ser livre e acessível</p>
                      <p>✓ Tecnologia deve servir humanidade</p>
                      <p>✓ Ninguém deveria caminhar sozinho</p>
                      <p>✓ Comunidades genuínas podem mudar vidas</p>
                    </div>
                  </div>

                  <p className="text-2xl font-bold mb-6" style={{ color: 'var(--brand-primary)' }}>
                    Então você já é parte do $MILAGRE.
                  </p>

                  <div className="flex flex-wrap gap-4 justify-center">
                    <a
                      href="https://discord.gg/skaX8bFY"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-theme-xl hover:shadow-2xl hover:scale-105"
                      style={{
                        background: 'linear-gradient(135deg, #5865F2, #4752C4)',
                        color: 'white'
                      }}
                    >
                      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                      </svg>
                      <span>Discord</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </a>

                    <a
                      href="https://t.me/+Bop_TVFc_mg3Njlh"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-theme-xl hover:shadow-2xl hover:scale-105"
                      style={{
                        background: 'linear-gradient(135deg, #0088cc, #006699)',
                        color: 'white'
                      }}
                    >
                      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12s12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21l-1.446 1.394c-.14.18-.357.295-.6.295c-.002 0-.003 0-.005 0l.213-3.054l5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326l-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
                      </svg>
                      <span>Telegram</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </a>
                  </div>
                </div>
              </section>
            </div>
          </main>
        </div>

        {/* Scroll to top button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 border-2"
            style={{
              background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-hover))',
              borderColor: 'var(--brand-primary)',
              color: 'var(--text-inverse)'
            }}
            aria-label="Voltar ao topo"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
