'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';
import Breadcrumbs from '@/components/Breadcrumbs';

interface TableOfContentsItem {
  id: string;
  text: string;
}

export default function ManifestoPage() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');

  const tableOfContents: TableOfContentsItem[] = [
    { id: 'nossa-visao', text: 'Nossa Visão' },
    { id: 'nossa-missao', text: 'Nossa Missão' },
    { id: 'valores-fundamentais', text: 'Valores Fundamentais' },
    { id: 'tres-guardioes', text: 'Nossos Três Guardiões' },
    { id: 'governanca', text: 'Princípios de Governança' },
    { id: 'roadmap', text: 'Roadmap de Longo Prazo' },
    { id: 'open-source', text: 'Compromisso com Open Source' },
    { id: 'junte-se', text: 'Junte-se ao Movimento' },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);

      // Encontra a seção ativa
      const headingElements = tableOfContents.map(item => ({
        id: item.id,
        element: document.getElementById(item.id)
      })).filter(item => item.element);

      for (let i = headingElements.length - 1; i >= 0; i--) {
        const element = headingElements[i].element;
        if (element && element.getBoundingClientRect().top <= 150) {
          setActiveSection(headingElements[i].id);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Call once to set initial state
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Schema.org JSON-LD */}
      <Script id="manifesto-schema" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          "name": "Manifesto Open Source $MILAGRE",
          "description": "Um movimento de apoio mútuo genuíno construído sobre os princípios do código aberto",
          "url": "https://tokenmilagre.xyz/manifesto",
          "license": "https://creativecommons.org/licenses/by-sa/4.0/"
        })}
      </Script>

      <div className="py-8" style={{ paddingLeft: '55px', paddingRight: '1rem' }}>
        <div className="flex gap-8">
          <div className="flex-1 max-w-4xl space-y-16">
            {/* Breadcrumbs */}
            <Breadcrumbs />

          {/* Hero */}
          <div className="space-y-6">
            <div className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold" style={{
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--brand-primary)'
            }}>
              Manifesto Open Source • Versão 1.0
            </div>

            <h1 className="text-4xl md:text-5xl font-bold leading-tight font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
              Nunca Estarás Sozinho ❤️
            </h1>

            <p className="text-xl leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Um movimento de apoio mútuo genuíno construído sobre os princípios do código aberto,
              da colaboração peer-to-peer e da crença fundamental de que{' '}
              <span className="font-bold" style={{ color: 'var(--brand-primary)' }}>juntos somos mais fortes</span>.
            </p>

            <div className="p-6 rounded-2xl border-2" style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--brand-primary)'
            }}>
              <div className="flex items-start gap-4">
                <div className="text-3xl">💡</div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>
                    Do Only Good Everyday
                  </h3>
                  <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    Inspirados pela filosofia das comunidades Linux e open source, onde o conhecimento é livre,
                    a colaboração é incentivada e o mérito vem da contribuição real, criamos o $MILAGRE como um
                    commons digital - um bem coletivo gerido pela comunidade, para a comunidade.
                  </p>
                </div>
              </div>
            </div>

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
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
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
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12s12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21l-1.446 1.394c-.14.18-.357.295-.6.295c-.002 0-.003 0-.005 0l.213-3.054l5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326l-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
                </svg>
                Telegram
              </a>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t" style={{ borderColor: 'var(--border-light)' }}></div>

          {/* Nossa Visão */}
          <div className="space-y-8">
            <h2 id="nossa-visao" className="text-3xl font-bold font-[family-name:var(--font-poppins)] scroll-mt-24" style={{ color: 'var(--text-primary)' }}>
              Nossa Visão
            </h2>

            <p className="text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Visionamos um ecossistema descentralizado onde tecnologia blockchain serve como infraestrutura
              para conexão humana genuína, onde holders não são apenas investidores, mas membros ativos de
              uma comunidade que se apoia mutuamente.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { title: 'Colaboração Supera Competição', desc: 'O valor real emerge quando pessoas compartilham conhecimento, recursos e experiências livremente' },
                { title: 'Transparência Constrói Confiança', desc: 'Abertura total sobre decisões, finanças e processos fortalece vínculos comunitários' },
                { title: 'Conhecimento Deve Ser Livre', desc: 'Educação e recursos devem estar acessíveis a todos, sem barreiras de entrada' },
                { title: 'Meritocracia por Contribuição', desc: 'Influência e reconhecimento vêm de ajudar ativamente, não apenas de acumular tokens' }
              ].map((item, index) => (
                <div key={index} className="p-6 rounded-xl border" style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderColor: 'var(--border-light)'
                }}>
                  <h3 className="font-bold mb-2" style={{ color: 'var(--brand-primary)' }}>{item.title}</h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t" style={{ borderColor: 'var(--border-light)' }}></div>

          {/* Nossa Missão */}
          <div className="space-y-8">
            <h2 id="nossa-missao" className="text-3xl font-bold font-[family-name:var(--font-poppins)] scroll-mt-24" style={{ color: 'var(--text-primary)' }}>
              Nossa Missão
            </h2>

            <p className="text-xl font-semibold" style={{ color: 'var(--brand-primary)' }}>
              Construir o Maior Ecossistema de Apoio Mútuo Descentralizado do Mundo
            </p>

            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
              Nossa missão é criar e sustentar uma comunidade global na blockchain Solana onde cada membro tem acesso a:
            </p>

            <div className="grid sm:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl border text-center" style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border-light)'
              }}>
                <div className="text-4xl mb-3">👼</div>
                <h3 className="font-bold mb-2" style={{ color: 'var(--brand-primary)' }}>Prosperidade Compartilhada</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Orientação financeira, educação sobre blockchain/DeFi e oportunidades de crescimento econômico
                </p>
              </div>

              <div className="p-6 rounded-xl border text-center" style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border-light)'
              }}>
                <div className="text-4xl mb-3">🧙</div>
                <h3 className="font-bold mb-2" style={{ color: 'var(--brand-primary)' }}>Sabedoria Coletiva</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Mentorias peer-to-peer, workshops educacionais, biblioteca de conhecimento aberta
                </p>
              </div>

              <div className="p-6 rounded-xl border text-center" style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border-light)'
              }}>
                <div className="text-4xl mb-3">💫</div>
                <h3 className="font-bold mb-2" style={{ color: 'var(--brand-primary)' }}>Esperança Constante</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Suporte emocional, comunidade de apoio 24/7 e certeza de que sempre haverá alguém para ajudar
                </p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t" style={{ borderColor: 'var(--border-light)' }}></div>

          {/* Valores Fundamentais */}
          <div className="space-y-8">
            <h2 id="valores-fundamentais" className="text-3xl font-bold font-[family-name:var(--font-poppins)] scroll-mt-24" style={{ color: 'var(--text-primary)' }}>
              Nossos Valores Fundamentais
            </h2>

            <div className="space-y-6">
              {[
                {
                  title: '1. Transparência Radical',
                  desc: 'Toda decisão, transação e processo é visível publicamente na blockchain e em nossas plataformas abertas.',
                  items: ['Votações de governança públicas e auditáveis', 'Treasury comunitária com multisig transparente', 'Relatórios mensais publicados abertamente', 'Código-fonte disponível no GitHub']
                },
                {
                  title: '2. Colaboração Aberta',
                  desc: 'Seguindo o modelo open source, qualquer holder pode contribuir com código, ideias, conteúdo educacional ou suporte.',
                  items: ['Repositórios GitHub públicos', 'Sistema de proposals aberto a todos', 'Wiki colaborativa construída coletivamente', 'Reconhecimento através de badges NFT']
                },
                {
                  title: '3. Inclusão e Acessibilidade',
                  desc: 'O $MILAGRE é para todos, independente de experiência técnica, quantidade de tokens ou background.',
                  items: ['Tutoriais em múltiplos formatos', 'Suporte em português e outros idiomas', 'Onboarding estruturado para novos membros', 'Mentorias gratuitas disponíveis a todos']
                },
                {
                  title: '4. Apoio Mútuo Genuíno',
                  desc: 'Esta não é uma comunidade transacional - é um ecossistema onde membros genuinamente se preocupam uns com os outros.',
                  items: ['Sistema de mentoria peer-to-peer', 'Canais de suporte emocional moderados', 'Fundo de emergência comunitário', 'Cultura "perguntar não tem custo"']
                }
              ].map((valor, index) => (
                <div key={index} className="p-6 rounded-xl border" style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderColor: 'var(--border-light)'
                }}>
                  <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--brand-primary)' }}>{valor.title}</h3>
                  <p className="mb-4 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{valor.desc}</p>
                  <div className="space-y-2">
                    {valor.items.map((item, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span style={{ color: 'var(--brand-primary)' }}>✓</span>
                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t" style={{ borderColor: 'var(--border-light)' }}></div>

          {/* Nossos Três Guardiões */}
          <div className="space-y-8">
            <h2 id="tres-guardioes" className="text-3xl font-bold font-[family-name:var(--font-poppins)] scroll-mt-24" style={{ color: 'var(--text-primary)' }}>
              Nossos Três Guardiões
            </h2>

            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
              Representam não apenas símbolos, mas áreas funcionais da comunidade:
            </p>

            <div className="space-y-6">
              <div className="p-6 rounded-xl border" style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border-light)'
              }}>
                <div className="flex items-center gap-4 mb-3">
                  <div className="text-4xl">👼</div>
                  <div>
                    <h3 className="text-xl font-bold" style={{ color: 'var(--brand-primary)' }}>Guardiã da Prosperidade</h3>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Empoderar holders com educação financeira</p>
                  </div>
                </div>
                <div className="ml-14 space-y-2">
                  {['Curadoria de conteúdo sobre DeFi e blockchain', 'Coordenação de grupos de estudo', 'Identificação de oportunidades no ecossistema Solana', 'Mentorias sobre planejamento financeiro'].map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>•</span>
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-xl border" style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border-light)'
              }}>
                <div className="flex items-center gap-4 mb-3">
                  <div className="text-4xl">🧙</div>
                  <div>
                    <h3 className="text-xl font-bold" style={{ color: 'var(--brand-primary)' }}>Guardião da Sabedoria</h3>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Cultivar conhecimento coletivo</p>
                  </div>
                </div>
                <div className="ml-14 space-y-2">
                  {['Manutenção da biblioteca de conhecimento', 'Organização de workshops e webinars', 'Facilitação de mentorias peer-to-peer', 'Documentação de casos de sucesso'].map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>•</span>
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-xl border" style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border-light)'
              }}>
                <div className="flex items-center gap-4 mb-3">
                  <div className="text-4xl">💫</div>
                  <div>
                    <h3 className="text-xl font-bold" style={{ color: 'var(--brand-primary)' }}>Anjo da Esperança</h3>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Prover suporte emocional</p>
                  </div>
                </div>
                <div className="ml-14 space-y-2">
                  {['Moderação empática de canais de suporte', 'Coordenação de grupos de apoio', 'Gestão do fundo de emergência', 'Celebração de vitórias e marcos'].map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>•</span>
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t" style={{ borderColor: 'var(--border-light)' }}></div>

          {/* Princípios de Governança */}
          <div className="space-y-8">
            <h2 id="governanca" className="text-3xl font-bold font-[family-name:var(--font-poppins)] scroll-mt-24" style={{ color: 'var(--text-primary)' }}>
              Princípios de Governança
            </h2>

            <p className="text-lg" style={{ color: 'var(--brand-primary)' }}>
              Como Tomamos Decisões Coletivamente
            </p>

            <div className="space-y-4">
              <div className="p-6 rounded-xl" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <h3 className="font-bold mb-2" style={{ color: 'var(--text-primary)' }}>1. Do-ocracia (Quem Faz, Decide)</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Membros que contribuem ativamente para áreas específicas ganham maior influência nessas áreas.
                </p>
              </div>

              <div className="p-6 rounded-xl" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <h3 className="font-bold mb-2" style={{ color: 'var(--text-primary)' }}>2. Votação Híbrida</h3>
                <div className="space-y-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <p>• Votação Quadrática para decisões que afetam toda comunidade</p>
                  <p>• Votação por Delegação para representantes confiáveis</p>
                  <p>• Votação Ponderada por Reputação baseada em contribuições passadas</p>
                </div>
              </div>

              <div className="p-6 rounded-xl" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <h3 className="font-bold mb-2" style={{ color: 'var(--text-primary)' }}>3. Transparência Processual</h3>
                <div className="space-y-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <p>1. Discussão Aberta (7 dias mínimo)</p>
                  <p>2. Refinamento Colaborativo</p>
                  <p>3. Votação Formal (quorum mínimo)</p>
                  <p>4. Implementação Transparente</p>
                  <p>5. Avaliação de Impacto</p>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t" style={{ borderColor: 'var(--border-light)' }}></div>

          {/* Roadmap */}
          <div className="space-y-8">
            <h2 id="roadmap" className="text-3xl font-bold font-[family-name:var(--font-poppins)] scroll-mt-24" style={{ color: 'var(--text-primary)' }}>
              Roadmap de Longo Prazo
            </h2>

            <div className="space-y-6">
              <div className="border-l-4 pl-6" style={{ borderLeftColor: 'var(--brand-primary)' }}>
                <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--brand-primary)' }}>2025-2026: Fundação Sólida</h3>
                <div className="space-y-2" style={{ color: 'var(--text-secondary)' }}>
                  <p>• Estabelecer governança DAO completa</p>
                  <p>• Construir biblioteca educacional abrangente</p>
                  <p>• Desenvolver sistema de mentoria robusto</p>
                  <p>• Atingir 10.000 holders ativos</p>
                  <p>• Lançar programa de grants comunitários</p>
                </div>
              </div>

              <div className="border-l-4 pl-6" style={{ borderLeftColor: 'var(--brand-primary)' }}>
                <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--brand-primary)' }}>2027-2028: Expansão Sustentável</h3>
                <div className="space-y-2" style={{ color: 'var(--text-secondary)' }}>
                  <p>• Criar subDAOs especializadas</p>
                  <p>• Desenvolver marketplace de serviços</p>
                  <p>• Implementar staking com recompensas por contribuição</p>
                  <p>• Expandir para múltiplas blockchains</p>
                  <p>• Parcerias com instituições educacionais</p>
                </div>
              </div>

              <div className="border-l-4 pl-6" style={{ borderLeftColor: 'var(--brand-primary)' }}>
                <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--brand-primary)' }}>2029-2030: Maturidade e Impacto Global</h3>
                <div className="space-y-2" style={{ color: 'var(--text-secondary)' }}>
                  <p>• Referência em comunidades Web3 orientadas a valores</p>
                  <p>• Influenciar padrões de governança descentralizada</p>
                  <p>• Fundo de impacto social gerido pela comunidade</p>
                  <p>• Sustentabilidade financeira completa</p>
                  <p>• Modelo documentado para replicação global</p>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t" style={{ borderColor: 'var(--border-light)' }}></div>

          {/* Compromisso Open Source */}
          <div className="space-y-8">
            <h2 id="open-source" className="text-3xl font-bold font-[family-name:var(--font-poppins)] scroll-mt-24" style={{ color: 'var(--text-primary)' }}>
              Compromisso com Open Source
            </h2>

            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
              Inspirados pelos gigantes do open source como Linux, Mozilla e Wikipedia:
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { title: 'Liberar Código Abertamente', desc: 'Todo smart contract e ferramenta será código aberto' },
                { title: 'Documentar Extensivamente', desc: 'Documentação técnica completa e atualizada' },
                { title: 'Aceitar Contribuições', desc: 'Qualquer pessoa pode contribuir via pull requests' },
                { title: 'Compartilhar Aprendizados', desc: 'Post-mortems e lições para todo ecossistema' }
              ].map((item, index) => (
                <div key={index} className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <h3 className="font-bold mb-2" style={{ color: 'var(--brand-primary)' }}>{item.title}</h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t" style={{ borderColor: 'var(--border-light)' }}></div>

          {/* CTA Final */}
          <div className="space-y-6 py-8">
            <h2 id="junte-se" className="text-3xl font-bold font-[family-name:var(--font-poppins)] scroll-mt-24" style={{ color: 'var(--text-primary)' }}>
              Junte-se ao Movimento
            </h2>

            <p className="text-xl" style={{ color: 'var(--text-secondary)' }}>
              O $MILAGRE não pertence a fundadores ou baleias - pertence a todos que contribuem para torná-lo real.
            </p>

            <div className="p-6 rounded-xl" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <p className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Se você acredita que:</p>
              <div className="space-y-2" style={{ color: 'var(--text-secondary)' }}>
                <p>✓ Colaboração é mais poderosa que competição</p>
                <p>✓ Conhecimento deve ser livre e acessível</p>
                <p>✓ Tecnologia deve servir humanidade</p>
                <p>✓ Ninguém deveria caminhar sozinho</p>
                <p>✓ Comunidades genuínas podem mudar vidas</p>
              </div>
            </div>

            <p className="text-2xl font-bold text-brand-primary">
              Então você já é parte do $MILAGRE ❤️
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
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
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
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12s12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21l-1.446 1.394c-.14.18-.357.295-.6.295c-.002 0-.003 0-.005 0l.213-3.054l5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326l-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
                </svg>
                Telegram
              </a>
            </div>
          </div>
          </div>

          {/* Índice Lateral (Table of Contents) */}
          <aside className="hidden xl:block w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wide" style={{ color: 'var(--text-tertiary)' }}>
                Neste Manifesto
              </h3>
              <nav className="space-y-1">
                {tableOfContents.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`block w-full text-left text-sm py-2 px-3 rounded transition-all ${
                      activeSection === item.id
                        ? 'font-semibold'
                        : 'hover:opacity-80'
                    }`}
                    style={{
                      backgroundColor: activeSection === item.id ? 'var(--bg-secondary)' : 'transparent',
                      color: activeSection === item.id ? 'var(--brand-primary)' : 'var(--text-secondary)',
                      borderLeft: activeSection === item.id ? '3px solid var(--brand-primary)' : '3px solid transparent'
                    }}
                  >
                    {item.text}
                  </button>
                ))}
              </nav>
            </div>
          </aside>
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
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
          )}
      </div>
    </>
  );
}
