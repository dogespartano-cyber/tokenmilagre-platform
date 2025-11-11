'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowUp,
  faUsers,
  faHeart,
  faCode,
  faBookOpen,
  faShieldHalved,
  faHandshake,
  faGlobe,
  faRocket,
  faStar,
  faLightbulb,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import { faGithub, faTwitter, faTelegram, faDiscord } from '@fortawesome/free-brands-svg-icons';

export default function EquipePage() {
  const [showScrollTop, setShowScrollTop] = useState(false);

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

  const roles = [
    {
      title: 'Desenvolvimento',
      icon: faCode,
      color: '#3b82f6',
      description: 'Responsáveis pela plataforma, features e infraestrutura técnica.',
      activities: [
        'Desenvolvimento da plataforma Next.js',
        'Integração com blockchain Solana',
        'Sistema de artigos e educação',
        'Manutenção e deploy (Vercel)'
      ]
    },
    {
      title: 'Conteúdo & Educação',
      icon: faBookOpen,
      color: '#8b5cf6',
      description: 'Criadores de conteúdo educacional e artigos sobre blockchain.',
      activities: [
        'Artigos educacionais (iniciante → avançado)',
        'Tutoriais práticos',
        'Tradução de recursos',
        'Curadoria de conteúdo'
      ]
    },
    {
      title: 'Comunidade',
      icon: faUsers,
      color: '#22c55e',
      description: 'Moderação, suporte e engajamento nos canais sociais.',
      activities: [
        'Moderação Discord/Telegram',
        'Suporte a membros',
        'Organização de eventos',
        'Onboarding de novos membros'
      ]
    },
    {
      title: 'Design & UX',
      icon: faStar,
      color: '#f59e0b',
      description: 'Design visual, experiência do usuário e identidade da marca.',
      activities: [
        'Design da interface',
        'Assets visuais',
        'Branding e identidade',
        'Acessibilidade'
      ]
    }
  ];

  const verifiableLinks = [
    {
      name: 'GitHub',
      icon: faGithub,
      url: 'https://github.com/dogespartano-cyber/tokenmilagre-platform',
      description: 'Código open source - 100% auditável',
      color: '#333'
    },
    {
      name: 'Telegram',
      icon: faTelegram,
      url: 'https://t.me/+Bop_TVFc_mg3Njlh',
      description: 'Canal oficial da comunidade',
      color: '#0088cc'
    },
    {
      name: 'Discord',
      icon: faDiscord,
      url: 'https://discord.gg/xk4zrz8j',
      description: 'Servidor da comunidade',
      color: '#5865F2'
    },
    {
      name: 'Twitter/X',
      icon: faTwitter,
      url: 'https://x.com/TokenMilagre',
      description: 'Updates e anúncios',
      color: '#1DA1F2'
    }
  ];

  const principles = [
    {
      title: 'Open Source',
      icon: faCode,
      description: 'Todo o código é público e auditável no GitHub. Qualquer pessoa pode verificar, contribuir ou fazer fork.'
    },
    {
      title: 'Descentralização',
      icon: faGlobe,
      description: 'Não há hierarquia rígida. Decisões importantes são discutidas com a comunidade.'
    },
    {
      title: 'Meritocracia',
      icon: faRocket,
      description: 'Contribuições são reconhecidas independentemente de quem você é. O que importa é o valor agregado.'
    },
    {
      title: 'Transparência',
      icon: faShieldHalved,
      description: 'Processos, decisões e finanças são documentados publicamente sempre que possível.'
    }
  ];

  return (
    <>
      {/* Schema.org JSON-LD */}
      <Script id="team-schema" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Equipe e Comunidade - $MILAGRE",
          "description": "Conheça a estrutura comunitária, papéis e como contribuir com o projeto $MILAGRE",
          "url": "https://tokenmilagre.xyz/sobre/equipe"
        })}
      </Script>

      <div className="py-8 max-w-5xl" style={{ paddingLeft: '55px', paddingRight: '1rem' }}>
        <div className="space-y-16">
          {/* Hero */}
          <div className="space-y-6">
            <div className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold" style={{
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--brand-primary)'
            }}>
              <FontAwesomeIcon icon={faUsers} className="mr-2" />
              Nossa Comunidade
            </div>

            <h1 className="text-4xl md:text-5xl font-bold leading-tight font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
              Uma Comunidade{' '}
              <span className="text-brand-primary">Descentralizada e Open Source</span>
            </h1>

            <p className="text-xl leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              O $MILAGRE não tem "dono" ou empresa por trás. Somos uma rede de pessoas que acreditam
              em educação livre, transparência e apoio mútuo.
            </p>
          </div>

          {/* Divider */}
          <div className="border-t" style={{ borderColor: 'var(--border-light)' }}></div>

          {/* Por que Somos Anônimos */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
              <FontAwesomeIcon icon={faShieldHalved} className="mr-3 text-brand-primary" />
              Por Que Muitos Membros São Anônimos?
            </h2>

            <div className="backdrop-blur-xl rounded-2xl p-8 border-2" style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--brand-primary)'
            }}>
              <div className="space-y-6">
                <p className="text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  No espaço cripto, <strong style={{ color: 'var(--text-primary)' }}>anonimato é comum e legítimo</strong>.
                  Muitos dos maiores projetos foram criados por desenvolvedores anônimos (Bitcoin, por exemplo).
                </p>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{
                      backgroundColor: 'var(--brand-primary)',
                      color: 'white'
                    }}>
                      <FontAwesomeIcon icon={faCheckCircle} />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                        Segurança Pessoal
                      </h3>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        Evita exposição desnecessária a riscos de segurança (doxxing, ataques direcionados).
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{
                      backgroundColor: 'var(--brand-primary)',
                      color: 'white'
                    }}>
                      <FontAwesomeIcon icon={faCheckCircle} />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                        Foco no Projeto
                      </h3>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        O que importa é a qualidade do código e das contribuições, não quem você é.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{
                      backgroundColor: 'var(--brand-primary)',
                      color: 'white'
                    }}>
                      <FontAwesomeIcon icon={faCheckCircle} />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                        Descentralização Real
                      </h3>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        Sem "CEO" ou "fundador famoso", o projeto pertence verdadeiramente à comunidade.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl border" style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderColor: 'var(--border-medium)'
                }}>
                  <p className="text-sm">
                    <strong style={{ color: 'var(--brand-primary)' }}>💡 Mas você pode verificar tudo:</strong>{' '}
                    <span style={{ color: 'var(--text-secondary)' }}>
                      Todo o código está no GitHub. Todas as contribuições são públicas. Você não precisa confiar
                      em ninguém - apenas audite o código.
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t" style={{ borderColor: 'var(--border-light)' }}></div>

          {/* Estrutura da Comunidade */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
              <FontAwesomeIcon icon={faUsers} className="mr-3 text-brand-primary" />
              Como a Comunidade se Organiza
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {roles.map((role, index) => (
                <div
                  key={index}
                  className="backdrop-blur-xl rounded-2xl p-6 border-2 hover:scale-102 transition-all"
                  style={{
                    backgroundColor: 'var(--bg-elevated)',
                    borderColor: 'var(--border-medium)'
                  }}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{
                      backgroundColor: `${role.color}20`,
                      border: `2px solid ${role.color}40`
                    }}>
                      <FontAwesomeIcon icon={role.icon} className="text-2xl" style={{ color: role.color }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                        {role.title}
                      </h3>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {role.description}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {role.activities.map((activity, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-brand-primary mt-0.5">•</span>
                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                          {activity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 rounded-xl border-2" style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--brand-primary)'
            }}>
              <div className="flex items-start gap-4">
                <div className="text-3xl">🤝</div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>
                    Todos Podem Contribuir
                  </h3>
                  <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    Não há "processo de contratação". Se você tem uma habilidade útil e quer contribuir,
                    simplesmente comece. Abra um PR no GitHub, escreva um artigo, ajude no Discord.
                    <strong> A comunidade reconhece quem agrega valor.</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t" style={{ borderColor: 'var(--border-light)' }}></div>

          {/* Princípios */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
              <FontAwesomeIcon icon={faLightbulb} className="mr-3 text-brand-primary" />
              Nossos Princípios de Governança
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {principles.map((principle, index) => (
                <div
                  key={index}
                  className="backdrop-blur rounded-xl p-6 border hover:scale-102 transition-all"
                  style={{
                    backgroundColor: 'var(--bg-elevated)',
                    borderColor: 'var(--border-medium)'
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{
                      backgroundColor: 'var(--brand-primary)',
                      color: 'white'
                    }}>
                      <FontAwesomeIcon icon={principle.icon} className="text-xl" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                        {principle.title}
                      </h3>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        {principle.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t" style={{ borderColor: 'var(--border-light)' }}></div>

          {/* Links Verificáveis */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
              <FontAwesomeIcon icon={faGlobe} className="mr-3 text-brand-primary" />
              Onde Nos Encontrar
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {verifiableLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group backdrop-blur-xl rounded-2xl p-6 border-2 hover:scale-105 transition-all"
                  style={{
                    backgroundColor: 'var(--bg-elevated)',
                    borderColor: 'var(--border-medium)'
                  }}
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{
                      backgroundColor: link.color,
                      color: 'white'
                    }}>
                      <FontAwesomeIcon icon={link.icon} className="text-2xl" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                        {link.name}
                        <span className="text-sm opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                      </h3>
                    </div>
                  </div>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {link.description}
                  </p>
                </a>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t" style={{ borderColor: 'var(--border-light)' }}></div>

          {/* Como Contribuir */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
              <FontAwesomeIcon icon={faHandshake} className="mr-3 text-brand-primary" />
              Como Se Tornar um Contribuidor
            </h2>

            <div className="space-y-6">
              <div className="backdrop-blur-xl rounded-2xl p-8 border-2" style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border-medium)'
              }}>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                      1. Entre na Comunidade
                    </h3>
                    <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
                      Junte-se ao Discord ou Telegram. Apresente-se, conheça os membros, entenda o que estamos construindo.
                    </p>
                    <div className="flex gap-3">
                      <a
                        href="https://discord.gg/xk4zrz8j"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-lg font-semibold text-sm transition-all hover:opacity-90"
                        style={{
                          backgroundColor: '#5865F2',
                          color: 'white'
                        }}
                      >
                        Discord
                      </a>
                      <a
                        href="https://t.me/+Bop_TVFc_mg3Njlh"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-lg font-semibold text-sm transition-all hover:opacity-90"
                        style={{
                          backgroundColor: '#0088cc',
                          color: 'white'
                        }}
                      >
                        Telegram
                      </a>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                      2. Identifique Onde Pode Ajudar
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                        <p className="font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                          💻 Sabe programar?
                        </p>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                          Confira as issues no GitHub ou proponha melhorias.
                        </p>
                      </div>
                      <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                        <p className="font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                          ✍️ Escreve bem?
                        </p>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                          Crie tutoriais, traduza conteúdo ou escreva artigos.
                        </p>
                      </div>
                      <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                        <p className="font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                          🎨 Design é sua praia?
                        </p>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                          Ajude com UI/UX, assets visuais ou branding.
                        </p>
                      </div>
                      <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                        <p className="font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                          🤝 Gosta de ajudar pessoas?
                        </p>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                          Modere canais, responda dúvidas, dê boas-vindas.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                      3. Comece a Contribuir
                    </h3>
                    <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
                      Não espere permissão. Abra um Pull Request, escreva um artigo, ajude no suporte.
                      A comunidade vai notar e reconhecer suas contribuições.
                    </p>
                    <a
                      href="https://github.com/dogespartano-cyber/tokenmilagre-platform"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all hover:opacity-90"
                      style={{
                        backgroundColor: '#333',
                        color: 'white'
                      }}
                    >
                      <FontAwesomeIcon icon={faGithub} />
                      Ver Repositório
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t" style={{ borderColor: 'var(--border-light)' }}></div>

          {/* CTA Final */}
          <div className="space-y-6 py-8">
            <h2 className="text-3xl font-bold font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
              Você Faz Parte Desta História
            </h2>
            <p className="text-xl leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              O $MILAGRE não é "deles" ou "nosso" - é <strong>seu</strong>. Cada contribuição importa.
              Cada membro fortalece a comunidade. Juntos, criamos milagres.
            </p>
            <p className="text-2xl font-bold text-brand-primary">
              Bem-vindo à família. ❤️
            </p>
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
              <FontAwesomeIcon icon={faArrowUp} className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </>
  );
}
