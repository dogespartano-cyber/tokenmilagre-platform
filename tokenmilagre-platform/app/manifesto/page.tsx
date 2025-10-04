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

              {/* Valores Fundamentais */}
              <section id="valores" className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border-2 border-white/30 shadow-xl scroll-mt-24">
                <h2 className="text-3xl font-bold text-white mb-6 font-[family-name:var(--font-poppins)]">
                  Nossos Valores Fundamentais
                </h2>
                <div className="space-y-6">
                  {/* Valor 1 */}
                  <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                    <h3 className="text-xl font-bold text-yellow-200 mb-3">1. Transparência Radical</h3>
                    <p className="text-white/95 mb-4">Toda decisão, transação e processo é visível publicamente na blockchain e em nossas plataformas abertas.</p>
                    <div className="bg-white/5 rounded-lg p-4">
                      <p className="text-white/80 text-sm mb-2 font-semibold">Na prática:</p>
                      <ul className="space-y-1 text-sm text-white/80 ml-4">
                        <li>• Votações de governança públicas e auditáveis on-chain</li>
                        <li>• Treasury comunitária com multisig transparente</li>
                        <li>• Relatórios mensais publicados abertamente</li>
                        <li>• Código-fonte disponível no GitHub</li>
                        <li>• Falhas compartilhadas como oportunidades educacionais</li>
                      </ul>
                    </div>
                  </div>

                  {/* Valor 2 */}
                  <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                    <h3 className="text-xl font-bold text-yellow-200 mb-3">2. Colaboração Aberta</h3>
                    <p className="text-white/95 mb-4">Seguindo o modelo open source, qualquer holder pode contribuir com código, ideias, conteúdo educacional ou suporte à comunidade.</p>
                    <div className="bg-white/5 rounded-lg p-4">
                      <p className="text-white/80 text-sm mb-2 font-semibold">Na prática:</p>
                      <ul className="space-y-1 text-sm text-white/80 ml-4">
                        <li>• Repositórios GitHub públicos com processos claros</li>
                        <li>• Sistema de proposals aberto a todos</li>
                        <li>• Wiki colaborativa construída coletivamente</li>
                        <li>• Grupos de trabalho auto-organizados</li>
                        <li>• Reconhecimento através de badges NFT on-chain</li>
                      </ul>
                    </div>
                  </div>

                  {/* Valor 3 */}
                  <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                    <h3 className="text-xl font-bold text-yellow-200 mb-3">3. Inclusão e Acessibilidade</h3>
                    <p className="text-white/95 mb-4">O $MILAGRE é para todos, independente de experiência técnica, quantidade de tokens ou background.</p>
                    <div className="bg-white/5 rounded-lg p-4">
                      <p className="text-white/80 text-sm mb-2 font-semibold">Na prática:</p>
                      <ul className="space-y-1 text-sm text-white/80 ml-4">
                        <li>• Tutoriais em múltiplos formatos (texto, vídeo, workshops)</li>
                        <li>• Suporte em português e outros idiomas</li>
                        <li>• Onboarding estruturado para novos membros</li>
                        <li>• Governança acessível (votação off-chain para reduzir custos)</li>
                        <li>• Mentorias gratuitas disponíveis a todos</li>
                      </ul>
                    </div>
                  </div>

                  {/* Valor 4 */}
                  <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                    <h3 className="text-xl font-bold text-yellow-200 mb-3">4. Meritocracia da Contribuição</h3>
                    <p className="text-white/95 mb-4">Poder e reconhecimento na comunidade vêm de ajudar ativamente, não apenas de quantidade de tokens mantidos.</p>
                    <div className="bg-white/5 rounded-lg p-4">
                      <p className="text-white/80 text-sm mb-2 font-semibold">Na prática:</p>
                      <ul className="space-y-1 text-sm text-white/80 ml-4">
                        <li>• Sistema de reputação on-chain baseado em contribuições</li>
                        <li>• Badges NFT que demonstram expertise e apoio</li>
                        <li>• Delegação de votos para contribuidores ativos</li>
                        <li>• Spotlights mensais celebrando membros</li>
                        <li>• Grants priorizando contribuidores estabelecidos</li>
                      </ul>
                    </div>
                  </div>

                  {/* Valor 5 */}
                  <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                    <h3 className="text-xl font-bold text-yellow-200 mb-3">5. Apoio Mútuo Genuíno</h3>
                    <p className="text-white/95 mb-4">Esta não é uma comunidade transacional - é um ecossistema onde membros genuinamente se preocupam uns com os outros.</p>
                    <div className="bg-white/5 rounded-lg p-4">
                      <p className="text-white/80 text-sm mb-2 font-semibold">Na prática:</p>
                      <ul className="space-y-1 text-sm text-white/80 ml-4">
                        <li>• Sistema de mentoria peer-to-peer estruturado</li>
                        <li>• Canais de suporte emocional moderados com empatia</li>
                        <li>• Fundo de emergência comunitário</li>
                        <li>• Celebração coletiva de vitórias individuais</li>
                        <li>• Cultura &quot;perguntar não tem custo&quot;</li>
                      </ul>
                    </div>
                  </div>

                  {/* Valor 6 */}
                  <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                    <h3 className="text-xl font-bold text-yellow-200 mb-3">6. Inovação Responsável</h3>
                    <p className="text-white/95 mb-4">Abraçamos experimentação e crescimento, mas sempre com responsabilidade para com a comunidade.</p>
                    <div className="bg-white/5 rounded-lg p-4">
                      <p className="text-white/80 text-sm mb-2 font-semibold">Na prática:</p>
                      <ul className="space-y-1 text-sm text-white/80 ml-4">
                        <li>• Auditorias regulares de smart contracts</li>
                        <li>• Testes extensivos antes de deployments</li>
                        <li>• Avaliação de impacto comunitário</li>
                        <li>• Iteração baseada em feedback real</li>
                        <li>• Roadmap flexível que se adapta</li>
                      </ul>
                    </div>
                  </div>

                  {/* Valor 7 */}
                  <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                    <h3 className="text-xl font-bold text-yellow-200 mb-3">7. Sustentabilidade de Longo Prazo</h3>
                    <p className="text-white/95 mb-4">Construímos para gerações, não para pump-and-dumps.</p>
                    <div className="bg-white/5 rounded-lg p-4">
                      <p className="text-white/80 text-sm mb-2 font-semibold">Na prática:</p>
                      <ul className="space-y-1 text-sm text-white/80 ml-4">
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
              <section id="compromissos" className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border-2 border-white/30 shadow-xl scroll-mt-24">
                <h2 className="text-3xl font-bold text-white mb-6 font-[family-name:var(--font-poppins)]">
                  Nossos Compromissos
                </h2>
                <div className="space-y-6">
                  {/* Com Nossa Comunidade */}
                  <div className="bg-gradient-to-br from-yellow-400/20 to-amber-400/20 rounded-xl p-6 border border-yellow-300/30">
                    <h3 className="text-xl font-bold text-white mb-4">Com Nossa Comunidade</h3>
                    <div className="space-y-3 text-white/95">
                      <p>✦ <strong>Escutar Ativamente</strong> - Toda voz importa; implementaremos canais estruturados de feedback</p>
                      <p>✦ <strong>Governança Verdadeiramente Descentralizada</strong> - Decisões significativas sempre passarão por votação</p>
                      <p>✦ <strong>Educação Contínua</strong> - Investiremos constantemente em recursos educacionais gratuitos</p>
                      <p>✦ <strong>Suporte Incondicional</strong> - Nunca abandonaremos um membro em dificuldade</p>
                      <p>✦ <strong>Evolução Colaborativa</strong> - O roadmap será construído coletivamente</p>
                    </div>
                  </div>

                  {/* Com o Ecossistema Open Source */}
                  <div className="bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-xl p-6 border border-purple-300/30">
                    <h3 className="text-xl font-bold text-white mb-4">Com o Ecossistema Open Source</h3>
                    <div className="space-y-3 text-white/95">
                      <p>✦ <strong>Contribuir de Volta</strong> - Compartilharemos ferramentas, código e aprendizados</p>
                      <p>✦ <strong>Adotar Padrões Abertos</strong> - Maximizar interoperabilidade</p>
                      <p>✦ <strong>Fomentar Colaboração Cross-Project</strong> - Parcerias com projetos alinhados</p>
                      <p>✦ <strong>Documentar Extensivamente</strong> - Facilitar aprendizado e replicação</p>
                      <p>✦ <strong>Licenciar Adequadamente</strong> - Todo código claramente licenciado</p>
                    </div>
                  </div>

                  {/* Com a Blockchain Solana */}
                  <div className="bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-xl p-6 border border-blue-300/30">
                    <h3 className="text-xl font-bold text-white mb-4">Com a Blockchain Solana</h3>
                    <div className="space-y-3 text-white/95">
                      <p>✦ <strong>Maximizar Potencial da Rede</strong> - Velocidade e eficiência</p>
                      <p>✦ <strong>Contribuir para o Ecossistema</strong> - Ferramentas e conhecimento</p>
                      <p>✦ <strong>Promover Adoção Responsável</strong> - Educar sobre segurança</p>
                      <p>✦ <strong>Desenvolver Sustentavelmente</strong> - Eficiência energética</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Governança */}
              <section id="governanca" className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border-2 border-white/30 shadow-xl scroll-mt-24">
                <h2 className="text-3xl font-bold text-white mb-4 font-[family-name:var(--font-poppins)]">
                  Princípios de Governança
                </h2>
                <h3 className="text-xl text-yellow-200 mb-6">Como Tomamos Decisões Coletivamente</h3>
                <div className="space-y-6">
                  <div className="bg-white/10 rounded-xl p-6">
                    <h4 className="text-lg font-bold text-white mb-3">1. Do-ocracia (Quem Faz, Decide)</h4>
                    <p className="text-white/95">
                      Membros que contribuem ativamente para áreas específicas ganham maior influência nessas áreas.
                      Um holder que cria conteúdo educacional terá voz significativa em decisões sobre a biblioteca de conhecimento.
                    </p>
                  </div>

                  <div className="bg-white/10 rounded-xl p-6">
                    <h4 className="text-lg font-bold text-white mb-3">2. Votação Híbrida</h4>
                    <div className="text-white/95 space-y-2">
                      <p><strong>• Votação Quadrática</strong> - Para decisões que afetam toda comunidade</p>
                      <p><strong>• Votação por Delegação</strong> - Delegar poder a representantes confiáveis</p>
                      <p><strong>• Votação Ponderada por Reputação</strong> - Contribuições passadas pesam nas decisões</p>
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-xl p-6">
                    <h4 className="text-lg font-bold text-white mb-3">3. Transparência Processual</h4>
                    <div className="text-white/95 space-y-2">
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
              <section id="guardioes" className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border-2 border-white/30 shadow-xl scroll-mt-24">
                <h2 className="text-3xl font-bold text-white mb-6 font-[family-name:var(--font-poppins)]">
                  Nossos Três Guardiões
                </h2>
                <p className="text-white/95 mb-6">
                  Representam não apenas símbolos, mas áreas funcionais da comunidade
                </p>
                <div className="space-y-6">
                  {/* Guardiã da Prosperidade */}
                  <div className="bg-gradient-to-br from-yellow-400/20 to-amber-400/20 rounded-xl p-6 border border-yellow-300/30">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-5xl">👼</span>
                      <div>
                        <h3 className="text-xl font-bold text-yellow-200">Guardiã da Prosperidade</h3>
                        <p className="text-white/80 text-sm">Empoderar holders com educação financeira</p>
                      </div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <p className="text-white/80 text-sm mb-2 font-semibold">Responsabilidades:</p>
                      <ul className="space-y-1 text-sm text-white/80 ml-4">
                        <li>• Curadoria de conteúdo sobre DeFi e blockchain</li>
                        <li>• Coordenação de grupos de estudo sobre finanças</li>
                        <li>• Identificação de oportunidades no ecossistema Solana</li>
                        <li>• Mentorias sobre planejamento financeiro</li>
                      </ul>
                    </div>
                  </div>

                  {/* Guardião da Sabedoria */}
                  <div className="bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-xl p-6 border border-blue-300/30">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-5xl">🧙</span>
                      <div>
                        <h3 className="text-xl font-bold text-blue-200">Guardião da Sabedoria</h3>
                        <p className="text-white/80 text-sm">Cultivar conhecimento coletivo</p>
                      </div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <p className="text-white/80 text-sm mb-2 font-semibold">Responsabilidades:</p>
                      <ul className="space-y-1 text-sm text-white/80 ml-4">
                        <li>• Manutenção da biblioteca de conhecimento</li>
                        <li>• Organização de workshops e webinars</li>
                        <li>• Facilitação de mentorias peer-to-peer</li>
                        <li>• Documentação de casos de sucesso</li>
                      </ul>
                    </div>
                  </div>

                  {/* Anjo da Esperança */}
                  <div className="bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-xl p-6 border border-purple-300/30">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-5xl">💫</span>
                      <div>
                        <h3 className="text-xl font-bold text-purple-200">Anjo da Esperança</h3>
                        <p className="text-white/80 text-sm">Prover suporte emocional</p>
                      </div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <p className="text-white/80 text-sm mb-2 font-semibold">Responsabilidades:</p>
                      <ul className="space-y-1 text-sm text-white/80 ml-4">
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
              <section id="conduta" className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border-2 border-white/30 shadow-xl scroll-mt-24">
                <h2 className="text-3xl font-bold text-white mb-6 font-[family-name:var(--font-poppins)]">
                  Código de Conduta
                </h2>
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-xl p-6 border border-green-300/30">
                    <h3 className="text-xl font-bold text-white mb-4">Como Nos Comportamos</h3>
                    <div className="space-y-2 text-white/95">
                      <p>✓ <strong>Praticar Respeito Universal</strong> - Tratamos todos com dignidade</p>
                      <p>✓ <strong>Contribuir Construtivamente</strong> - Críticas acompanhadas de sugestões</p>
                      <p>✓ <strong>Apoiar Ativamente</strong> - Perguntas são oportunidades de ajudar</p>
                      <p>✓ <strong>Ser Transparente</strong> - Declarar conflitos de interesse</p>
                      <p>✓ <strong>Celebrar Diversidade</strong> - Valorizar diferentes perspectivas</p>
                      <p>✓ <strong>Assumir Boa Fé</strong> - Presumir intenções positivas</p>
                      <p>✓ <strong>Proteger o Commons</strong> - Pensar no bem coletivo</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-red-400/20 to-pink-400/20 rounded-xl p-6 border border-red-300/30">
                    <h3 className="text-xl font-bold text-white mb-4">Comportamentos Inaceitáveis</h3>
                    <div className="space-y-2 text-white/95">
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
              <section id="opensource" className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border-2 border-white/30 shadow-xl scroll-mt-24">
                <h2 className="text-3xl font-bold text-white mb-6 font-[family-name:var(--font-poppins)]">
                  Compromisso com Open Source
                </h2>
                <p className="text-white/95 mb-6">
                  Inspirados pelos gigantes do open source como Linux, Mozilla e Wikipedia
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white/10 rounded-xl p-4">
                    <p className="text-white/95"><strong className="text-yellow-200">Liberar Código Abertamente</strong></p>
                    <p className="text-white/80 text-sm mt-2">Todo smart contract e ferramenta será código aberto</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4">
                    <p className="text-white/95"><strong className="text-yellow-200">Documentar Extensivamente</strong></p>
                    <p className="text-white/80 text-sm mt-2">Documentação técnica completa e atualizada</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4">
                    <p className="text-white/95"><strong className="text-yellow-200">Aceitar Contribuições</strong></p>
                    <p className="text-white/80 text-sm mt-2">Qualquer pessoa pode contribuir via pull requests</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4">
                    <p className="text-white/95"><strong className="text-yellow-200">Compartilhar Aprendizados</strong></p>
                    <p className="text-white/80 text-sm mt-2">Post-mortems e lições para todo ecossistema</p>
                  </div>
                </div>
              </section>

              {/* Roadmap */}
              <section id="roadmap" className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border-2 border-white/30 shadow-xl scroll-mt-24">
                <h2 className="text-3xl font-bold text-white mb-6 font-[family-name:var(--font-poppins)]">
                  Roadmap de Longo Prazo
                </h2>
                <div className="space-y-6">
                  <div className="border-l-4 border-yellow-400 pl-6">
                    <h3 className="text-xl font-bold text-yellow-200 mb-2">2025-2026: Fundação Sólida</h3>
                    <ul className="space-y-2 text-white/95">
                      <li>• Estabelecer governança DAO completa</li>
                      <li>• Construir biblioteca educacional abrangente</li>
                      <li>• Desenvolver sistema de mentoria robusto</li>
                      <li>• Atingir 10.000 holders ativos</li>
                      <li>• Lançar programa de grants comunitários</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-blue-400 pl-6">
                    <h3 className="text-xl font-bold text-blue-200 mb-2">2027-2028: Expansão Sustentável</h3>
                    <ul className="space-y-2 text-white/95">
                      <li>• Criar subDAOs especializadas</li>
                      <li>• Desenvolver marketplace de serviços</li>
                      <li>• Implementar staking com recompensas por contribuição</li>
                      <li>• Expandir para múltiplas blockchains</li>
                      <li>• Parcerias com instituições educacionais</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-purple-400 pl-6">
                    <h3 className="text-xl font-bold text-purple-200 mb-2">2029-2030: Maturidade e Impacto Global</h3>
                    <ul className="space-y-2 text-white/95">
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
              <section id="metricas" className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border-2 border-white/30 shadow-xl scroll-mt-24">
                <h2 className="text-3xl font-bold text-white mb-6 font-[family-name:var(--font-poppins)]">
                  Métricas de Sucesso
                </h2>
                <p className="text-white/95 mb-6">
                  Diferente de projetos focados apenas em preço de token, medimos sucesso por:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-xl p-6 border border-green-300/30">
                    <h3 className="text-lg font-bold text-white mb-3">Saúde Comunitária</h3>
                    <ul className="space-y-1 text-sm text-white/90">
                      <li>• Número de mentorias completadas</li>
                      <li>• Taxa de retenção de holders (&gt;6 meses)</li>
                      <li>• Diversidade de contribuidores ativos</li>
                      <li>• Sentimento comunitário (pesquisas)</li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-xl p-6 border border-blue-300/30">
                    <h3 className="text-lg font-bold text-white mb-3">Impacto Educacional</h3>
                    <ul className="space-y-1 text-sm text-white/90">
                      <li>• Recursos criados e acessados</li>
                      <li>• Workshops realizados</li>
                      <li>• Certificações completadas</li>
                      <li>• Membros que viraram mentores</li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-xl p-6 border border-purple-300/30">
                    <h3 className="text-lg font-bold text-white mb-3">Governança Descentralizada</h3>
                    <ul className="space-y-1 text-sm text-white/90">
                      <li>• Taxa de participação em votações</li>
                      <li>• Diversidade de proponentes</li>
                      <li>• Proposals implementados com sucesso</li>
                      <li>• Índice Nakamoto de delegação</li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-br from-yellow-400/20 to-amber-400/20 rounded-xl p-6 border border-yellow-300/30">
                    <h3 className="text-lg font-bold text-white mb-3">Sustentabilidade</h3>
                    <ul className="space-y-1 text-sm text-white/90">
                      <li>• Saúde da treasury</li>
                      <li>• Autossuficiência operacional</li>
                      <li>• Longevidade de contribuidores</li>
                      <li>• Taxa de renovação de liderança</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Convite à Ação */}
              <section id="convite" className="bg-gradient-to-br from-yellow-400/20 to-amber-400/20 backdrop-blur-xl rounded-2xl p-8 md:p-12 border-2 border-yellow-300/40 shadow-2xl scroll-mt-24">
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-white mb-6 font-[family-name:var(--font-poppins)]">
                    Junte-se ao Movimento ❤️
                  </h2>
                  <p className="text-white/95 text-lg mb-8 max-w-2xl mx-auto">
                    O $MILAGRE não pertence a fundadores ou baleias - pertence a todos que contribuem para torná-lo real.
                  </p>

                  <div className="bg-white/10 rounded-xl p-6 mb-8 max-w-xl mx-auto">
                    <p className="text-white font-semibold mb-4">Se você acredita que:</p>
                    <div className="space-y-2 text-white/95 text-left">
                      <p>✓ Colaboração é mais poderosa que competição</p>
                      <p>✓ Conhecimento deve ser livre e acessível</p>
                      <p>✓ Tecnologia deve servir humanidade</p>
                      <p>✓ Ninguém deveria caminhar sozinho</p>
                      <p>✓ Comunidades genuínas podem mudar vidas</p>
                    </div>
                  </div>

                  <p className="text-2xl font-bold text-yellow-200 mb-6">
                    Então você já é parte do $MILAGRE.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                      href="https://t.me/+Bop_TVFc_mg3Njlh"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-bold text-lg rounded-full transition-all shadow-xl hover:scale-105"
                    >
                      💬 Entrar na Comunidade
                    </a>
                    <Link
                      href="/"
                      className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-gray-900 font-bold text-lg rounded-full transition-all shadow-xl hover:scale-105 inline-block"
                    >
                      🪙 Comprar $MILAGRE
                    </Link>
                  </div>
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
