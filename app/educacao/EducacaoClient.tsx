'use client';

import {
  BookOpen, Shield, FileQuestion, Search, Wallet, Coins, AlertTriangle,
  TrendingUp, GraduationCap, Code, ChevronDown, ArrowRight
} from 'lucide-react';
import { useState, useEffect } from 'react';
import Script from 'next/script';
import Link from 'next/link';
import { usePaginationData } from '@/lib/shared/hooks/usePaginationData';
import Pagination from '@/components/shared/Pagination';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faArrowRight, faSearch, faTimes, faArrowUp, faFilter } from '@fortawesome/free-solid-svg-icons';
import { getLevelGradient, getLevelColor, getLevelIcon } from '@/lib/shared/utils/level-helpers';
import { getCategoryIcon } from '@/lib/shared/utils/category-helpers';
import DashboardHeader from '@/components/shared/DashboardHeader';
import TruthDetector from '@/components/education/TruthDetector';
import SocialLinks from '@/components/shared/SocialLinks';

interface Resource {
  id: string;
  slug: string;
  title: string;
  category: string;
  level: string | null;
  type: string;
  description: string;
  readTime: string | null;
  tags: string[];
}

interface EducacaoClientProps {
  resources: Resource[];
  stats: {
    totalArticles: number;
    totalCategories: number;
  };
}

// Tipo para dados brutos da API (antes da transformação)
interface RawArticleData {
  id: string;
  slug: string;
  title: string;
  category: string;
  level?: string;
  contentType?: string;
  summary?: string;
  readTime?: string;
  keywords?: string[];
}

export default function EducacaoClient({ resources, stats }: EducacaoClientProps) {

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 500);
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    { id: 'all', label: 'Todos' },
    { id: 'blockchain', label: 'Blockchain' },
    { id: 'trading', label: 'Trading' },
    { id: 'defi', label: 'DeFi' },
    { id: 'nfts', label: 'NFTs' },
    { id: 'seguranca', label: 'Segurança' },
    { id: 'desenvolvimento', label: 'Dev Web3' },
  ];

  const levels = [
    { id: 'all', label: 'Todos os Níveis' },
    { id: 'iniciante', label: 'Iniciante' },
    { id: 'intermediario', label: 'Intermediário' },
    { id: 'avancado', label: 'Avançado' },
  ];

  // Hook de paginação com data fetching
  const {
    data: filteredResources,
    loading: isLoading,
    totalPages,
    currentPage,
    goToPage
  } = usePaginationData<Resource>({
    endpoint: '/api/articles',
    filters: {
      type: 'educational',
      category: selectedCategory,
      level: selectedLevel,
      search: debouncedSearchTerm
    },
    initialData: resources,
    pageSize: 12,
    transform: (rawData: unknown) => {
      const article = rawData as RawArticleData;
      return {
        id: article.id,
        slug: article.slug,
        title: article.title,
        category: article.category,
        level: article.level || 'iniciante',
        type: article.contentType || 'Artigo',
        description: article.summary || '',
        readTime: article.readTime || '5 min',
        tags: article.keywords || []
      };
    }
  });



  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedLevel('all');
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchTerm) count++;
    if (selectedCategory !== 'all') count++;
    if (selectedLevel !== 'all') count++;
    return count;
  };



  return (
    <>
      {/* Schema.org JSON-LD */}
      <Script id="educacao-schema" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "EducationalOrganization",
          "name": "$MILAGRE Education",
          "url": "https://tokenmilagre.xyz/educacao",
          "description": "Artigos e tutoriais educacionais gratuitos sobre blockchain, cripto e Web3 criados pela comunidade"
        })}
      </Script>

      <div className="container mx-auto px-4 py-8 relative">
        <div className="space-y-8">
          {/* Header with Discord/Telegram Buttons */}
          {/* Header with Discord/Telegram Buttons - REMOVIDO (Agora gerenciado pelo layout-root) */}

          {/* Banner de Aviso de Risco */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300">
            <p className="text-sm">
              <strong>⚠️ Aviso:</strong> Este conteúdo é educacional e <strong>não é aconselhamento financeiro</strong>.
              Criptomoedas envolvem riscos e volatilidade. Faça sua própria pesquisa.
            </p>
          </div>

          {/* Cards Introdutórios - 8 Temas (Estáticos) */}
          <section className="space-y-6">
            <div className="text-left">
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                Comece por aqui
              </h2>
              <p className="text-[var(--text-secondary)] mt-1">
                Você não precisa "correr atrás do próximo pump". Precisa de base, método e prudência.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: BookOpen, title: 'Comece pelo Básico', desc: 'Entenda o que é cripto e onde as pessoas mais erram', slug: null },
                { icon: Shield, title: 'Segurança Primeiro', desc: 'Seed phrase, golpes e hábitos que protegem você', slug: 'seguranca-primeiro' },
                { icon: FileQuestion, title: 'Glossário Essencial', desc: 'Termos explicados com exemplos e armadilhas comuns', slug: null },
                { icon: Search, title: 'Como Pesquisar um Projeto', desc: 'Checklist de transparência: time, tokenomics, auditoria', slug: null },
                { icon: Wallet, title: 'Carteiras e Custódia', desc: 'Hot vs cold wallet, autocustódia e boas práticas', slug: null },
                { icon: Coins, title: 'Taxas e Redes', desc: 'O que são taxas (gas), confirmações e congestionamento', slug: null },
                { icon: AlertTriangle, title: 'Golpes Comuns', desc: 'Phishing, airdrop falso, links maliciosos e aprovações', slug: null },
                { icon: TrendingUp, title: 'Trilhas por Nível', desc: 'Iniciante, intermediário ou avançado — escolha seu caminho', slug: null },
              ].map((card, index) => {
                const Icon = card.icon;
                const cardContent = (
                  <div className="relative z-10">
                    {/* Icon Container */}
                    <div className="w-12 h-12 rounded-full flex items-center justify-center mb-5 bg-[var(--bg-page)] text-[var(--text-secondary)] group-hover:text-[var(--brand-primary)] group-hover:scale-110 transition-all duration-300">
                      <Icon className="w-5 h-5" />
                    </div>

                    <h3 className="font-bold text-lg text-[var(--text-primary)] mb-2 group-hover:text-[var(--brand-primary)] transition-colors">
                      {card.title}
                    </h3>

                    <p className="text-sm text-[var(--text-secondary)] mb-4 leading-relaxed line-clamp-2">
                      {card.desc}
                    </p>

                    {card.slug ? (
                      <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] transition-colors">
                        Ler artigo <ArrowRight className="w-3 h-3 ml-1" />
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-[var(--bg-page)] text-[var(--text-tertiary)] group-hover:bg-[var(--brand-primary)]/10 group-hover:text-[var(--brand-primary)] transition-colors">
                        Em breve
                      </span>
                    )}
                  </div>
                );

                const cardClassName = `
                  group p-6 rounded-2xl border text-left relative overflow-hidden transition-all duration-300
                  bg-transparent backdrop-blur-2xl border-[var(--border-light)]
                  hover:border-[var(--brand-primary)]/30 hover:shadow-lg hover:-translate-y-1
                  ${card.slug ? 'cursor-pointer' : ''}
                `;

                return card.slug ? (
                  <Link key={index} href={`/educacao/${card.slug}`} className={cardClassName}>
                    {cardContent}
                  </Link>
                ) : (
                  <div key={index} className={cardClassName}>
                    {cardContent}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Divider */}
          <div className="border-t border-[var(--border-light)]"></div>

          {/* Filtros e Artigos - Título adicionado */}
          <section className="space-y-6">
            <div className="text-left">
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                Todos os Artigos
              </h2>
              <p className="text-[var(--text-secondary)] mt-1">
                Explore todos os conteúdos educacionais ou filtre por categoria e nível.
              </p>
            </div>

            <div className="space-y-6">
              {getActiveFiltersCount() > 0 && (
                <div className="flex items-center justify-end mb-4">
                  <button
                    onClick={clearAllFilters}
                    className="text-sm font-bold text-red-500 hover:text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                    Limpar Filtros
                  </button>
                </div>
              )}

              <div className="grid lg:grid-cols-12 gap-6">
                {/* Busca */}
                <div className="lg:col-span-12">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Buscar por título, descrição ou tag..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-[var(--bg-page)] border border-[var(--border-article)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] transition-all placeholder-[var(--text-secondary)]"
                    />
                    <FontAwesomeIcon
                      icon={faSearch}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Categorias */}
                <div className="lg:col-span-7 space-y-3">
                  <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Categorias</label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all border hover:scale-105 active:scale-95 ${selectedCategory === cat.id
                          ? 'bg-[var(--brand-primary)]/20 text-[var(--brand-primary)] border-[var(--brand-primary)]/30 shadow-sm hover:bg-[var(--brand-primary)]/30'
                          : 'bg-[var(--bg-page)] hover:bg-[var(--bg-hover)] border-[var(--border-article)] text-[var(--text-secondary)] hover:border-[var(--brand-primary)]/50 hover:text-[var(--text-primary)]'
                          }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Níveis */}
                <div className="lg:col-span-5 space-y-3">
                  <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Nível</label>
                  <div className="flex flex-wrap gap-2">
                    {levels.map((level) => (
                      <button
                        key={level.id}
                        onClick={() => setSelectedLevel(level.id)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all border hover:scale-105 active:scale-95 ${selectedLevel === level.id
                          ? 'bg-[var(--brand-primary)]/20 text-[var(--brand-primary)] border-[var(--brand-primary)]/30 shadow-sm hover:bg-[var(--brand-primary)]/30'
                          : 'bg-[var(--bg-page)] hover:bg-[var(--bg-hover)] border-[var(--border-article)] text-[var(--text-secondary)] hover:border-[var(--brand-primary)]/50 hover:text-[var(--text-primary)]'
                          }`}
                      >
                        {level.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>


            {/* Lista de Recursos - NOVO DESIGN COM GLASSMORPHISM */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredResources.map((resource) => (
                <Link
                  key={resource.id}
                  href={`/educacao/${resource.slug}`}
                  className="glass-card group relative flex flex-col p-6 rounded-2xl border border-[var(--border-light)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl overflow-hidden"
                >
                  {/* Hover Glow Effect */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: getLevelColor(resource.level)
                    }}
                  />

                  <div className="relative z-10 flex flex-col h-full">
                    {/* Header: Level & Read Time */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1.5">
                        <FontAwesomeIcon
                          icon={getLevelIcon(resource.level)}
                          className="w-2.5 h-2.5"
                          style={{ color: getLevelColor(resource.level) }}
                        />
                        <span className="text-[10px] font-bold tracking-wide" style={{
                          color: getLevelColor(resource.level)
                        }}>
                          {resource.level === 'iniciante' ? 'Iniciante' : resource.level === 'intermediario' ? 'Intermediário' : resource.level === 'avancado' ? 'Avançado' : 'Geral'}
                        </span>
                      </div>

                      <span className="text-xs font-medium flex items-center gap-1.5 text-[var(--text-tertiary)]">
                        <FontAwesomeIcon icon={faClock} className="w-3 h-3" />
                        {resource.readTime || '5 min'}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-xl mb-3 line-clamp-2 group-hover:text-[var(--brand-primary)] transition-colors text-[var(--text-primary)]">
                      {resource.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm mb-4 line-clamp-3 leading-relaxed text-[var(--text-secondary)]">
                      {resource.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {resource.tags.slice(0, 2).map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs font-medium text-[var(--text-tertiary)]"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}

              {/* Loader minimalista (centralizado) */}
              {isLoading && filteredResources.length === 0 && (
                <div className="col-span-full flex justify-center py-12">
                  <div className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin border-[var(--border-article)] border-t-[var(--brand-primary)]" />
                </div>
              )}

              {/* Mensagem de vazio */}
              {!isLoading && filteredResources.length === 0 && (
                <div className="col-span-full text-center py-12 text-[var(--text-secondary)]">
                  Nenhum artigo encontrado com esses filtros.
                </div>
              )}
            </div>

            {/* Paginação */}
            {!isLoading && filteredResources.length > 0 && (
              <div className="mt-8 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={goToPage}
                />
              </div>
            )}
          </section>

          {/* Divider */}
          <div className="border-t border-[var(--border-article)]"></div>

          {/* Trilhas de Aprendizado */}
          <section id="trilhas" className="space-y-8 scroll-mt-24">
            <div className="text-left">
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                Trilhas de Aprendizado
              </h2>
              <p className="text-[var(--text-secondary)] mt-1">
                Escolha uma trilha. Você ganha clareza, não "emoção".
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Iniciante */}
              <button
                onClick={() => { setSelectedLevel('iniciante'); setSelectedCategory('all'); }}
                className="group p-6 rounded-2xl border-2 transition-all duration-300 text-left
                    bg-[var(--bg-secondary)] hover:bg-emerald-500/5
                    border-emerald-500/30 hover:border-emerald-500/60
                    hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 bg-emerald-500/10 text-emerald-500">
                  <GraduationCap className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">Iniciante</h3>
                <p className="text-sm text-[var(--text-secondary)] mb-4">
                  Para quem quer entender o básico com segurança e evitar armadilhas.
                </p>
                <ul className="text-xs text-[var(--text-tertiary)] space-y-1 mb-4">
                  <li>• Fundamentos do Bitcoin</li>
                  <li>• Segurança e autocustódia</li>
                  <li>• Redes e taxas</li>
                  <li>• DYOR e transparência</li>
                </ul>
                <span className="text-sm font-bold text-emerald-500 flex items-center gap-1">
                  Ver artigos iniciantes
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>

              {/* Intermediário */}
              <button
                onClick={() => { setSelectedLevel('intermediario'); setSelectedCategory('all'); }}
                className="group p-6 rounded-2xl border-2 transition-all duration-300 text-left
                    bg-[var(--bg-secondary)] hover:bg-amber-500/5
                    border-amber-500/30 hover:border-amber-500/60
                    hover:shadow-xl hover:shadow-amber-500/10 hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 bg-amber-500/10 text-amber-500">
                  <TrendingUp className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-amber-600 dark:text-amber-400 mb-2">Intermediário</h3>
                <p className="text-sm text-[var(--text-secondary)] mb-4">
                  Para quem já entende o básico e quer operar com mais consciência.
                </p>
                <ul className="text-xs text-[var(--text-tertiary)] space-y-1 mb-4">
                  <li>• Stablecoins e riscos reais</li>
                  <li>• DeFi com prudência</li>
                  <li>• Leitura de notícias</li>
                  <li>• Gestão de risco</li>
                </ul>
                <span className="text-sm font-bold text-amber-500 flex items-center gap-1">
                  Ver artigos intermediários
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>

              {/* Avançado */}
              <button
                onClick={() => { setSelectedLevel('avancado'); setSelectedCategory('all'); }}
                className="group p-6 rounded-2xl border-2 transition-all duration-300 text-left
                    bg-[var(--bg-secondary)] hover:bg-red-500/5
                    border-red-500/30 hover:border-red-500/60
                    hover:shadow-xl hover:shadow-red-500/10 hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 bg-red-500/10 text-red-500">
                  <Code className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">Avançado</h3>
                <p className="text-sm text-[var(--text-secondary)] mb-4">
                  Para quem quer profundidade técnica e pensamento crítico.
                </p>
                <ul className="text-xs text-[var(--text-tertiary)] space-y-1 mb-4">
                  <li>• Análise on-chain</li>
                  <li>• Tokenomics e incentivos</li>
                  <li>• Segurança avançada</li>
                  <li>• Leitura de contratos</li>
                </ul>
                <span className="text-sm font-bold text-red-500 flex items-center gap-1">
                  Ver artigos avançados
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </div>
          </section>

          {/* Divider */}
          <div className="border-t border-[var(--border-article)]"></div>

          {/* O Método de Ensino */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">
              O Método de Ensino do $MILAGRE
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-light)]">
                <h3 className="font-bold text-[var(--text-primary)] mb-3">Como as aulas são construídas</h3>
                <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                  <li>✓ <strong>80/20 primeiro:</strong> você entende o essencial rápido</li>
                  <li>✓ <strong>Quizzes curtos:</strong> para fixar (não para "pegar" você)</li>
                  <li>✓ <strong>Exemplos práticos:</strong> para reduzir erro e ansiedade</li>
                  <li>✓ <strong>Fontes visíveis:</strong> você vê de onde saiu cada informação</li>
                </ul>
              </div>
              <div className="p-6 rounded-xl bg-red-500/5 border border-red-500/20">
                <h3 className="font-bold text-red-600 dark:text-red-400 mb-3">Pilares de Segurança</h3>
                <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                  <li>🔒 Nunca compartilhe sua <strong>seed phrase</strong> com ninguém</li>
                  <li>⚠️ Desconfie de urgência, promessas e "suporte" no privado</li>
                  <li>🔍 Antes de assinar, entenda <strong>o que está sendo autorizado</strong></li>
                </ul>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">
              Perguntas Frequentes
            </h2>
            <div className="space-y-4">
              {[
                { q: 'Isso aqui vai me dizer o que comprar?', a: 'Não. O $MILAGRE educa para você entender riscos, evitar golpes e tomar decisões conscientes. Não é aconselhamento financeiro.' },
                { q: 'Eu sou totalmente iniciante. Por onde começo?', a: 'Clique em "Comece pelo Básico" e depois faça "Segurança Primeiro" antes de qualquer ação prática.' },
                { q: 'Como vocês evitam virar "conteúdo de hype"?', a: 'Com regras: sem promessa de lucro, sem FOMO, com fontes e separação clara entre fato e opinião.' },
                { q: 'As informações têm fontes verificáveis?', a: 'Sim. Cada artigo pode ter uma seção "Claims e Fontes". O que for opinião fica rotulado como tal.' },
              ].map((faq, i) => (
                <details key={i} className="group p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-light)]">
                  <summary className="font-bold text-[var(--text-primary)] cursor-pointer list-none flex items-center justify-between">
                    {faq.q}
                    <ChevronDown className="w-5 h-5 text-[var(--text-tertiary)] group-open:rotate-180 transition-transform" />
                  </summary>
                  <p className="mt-3 text-sm text-[var(--text-secondary)]">{faq.a}</p>
                </details>
              ))}
            </div>
          </section>

          {/* Divider */}
          <div className="border-t border-[var(--border-article)]"></div>

          {/* Detector de Mentiras (Operação Êxodo) */}
          {/* Detector de Mentiras (TruthDetector) */}
          <TruthDetector />

          {/* CTA */}
          <div className="space-y-6 py-8">
            <h2 className="text-3xl font-bold font-[family-name:var(--font-poppins)] text-[var(--text-article-title)]">
              Contribua com a Comunidade
            </h2>
            <p className="text-lg text-[var(--text-article-body)]">
              Tem conhecimento para compartilhar? Ajude a comunidade escrevendo artigos e tutoriais educacionais.
            </p>
            <div className="flex flex-wrap gap-4">
              <SocialLinks variant="buttons" platforms={['discord', 'telegram']} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
