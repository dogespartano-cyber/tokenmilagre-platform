'use client';

import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { useEffect, useState } from 'react';
import type React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowUp, faCalendar } from '@fortawesome/free-solid-svg-icons';
import { faXTwitter, faTelegram, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { getCitationAwareMarkdownComponents, SourcesSection } from '@/lib/citations-processor';

interface NewsItem {
  id: string;
  slug?: string;
  title: string;
  summary: string;
  content?: string;
  url: string;
  source: string;
  sources?: string[];
  publishedAt: string;
  category: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  keywords: string[];
  factChecked?: boolean;
  factCheckIssues?: string[];
  lastVerified?: string;
  citations?: string[]; // Array de URLs das fontes
}

interface ArtigoClientProps {
  article: NewsItem | null;
  relatedArticles?: NewsItem[];
  previousArticle?: NewsItem | null;
  nextArticle?: NewsItem | null;
}

interface TableOfContentsItem {
  id: string;
  text: string;
}

export default function ArtigoClient({ article, relatedArticles = [], previousArticle = null, nextArticle = null }: ArtigoClientProps) {
  const router = useRouter();
  const [readingProgress, setReadingProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [tableOfContents, setTableOfContents] = useState<TableOfContentsItem[]>([]);
  const [activeSection, setActiveSection] = useState<string>('');

  const createSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

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

  // Extrair fontes do markdown
  const extractSourcesFromMarkdown = (content: string): { name: string; url: string }[] => {
    const sources: { name: string; url: string }[] = [];
    const markdownRegex = /^-\s+\[(.+?)\]\((https?:\/\/[^\)]+)\)/gm;
    let match;

    while ((match = markdownRegex.exec(content)) !== null) {
      sources.push({
        name: match[1].trim(),
        url: match[2].trim()
      });
    }

    const oldFormatRegex = /^-\s+([^\[\(]+?)\s+\((https?:\/\/[^\)]+)\)/gm;
    while ((match = oldFormatRegex.exec(content)) !== null) {
      sources.push({
        name: match[1].trim(),
        url: match[2].trim()
      });
    }

    return sources;
  };

  // Remover H1 do início do conteúdo (título já aparece no header)
  const removeH1FromContent = (content: string): string => {
    // Remove H1 do início (# Título)
    const h1Regex = /^#\s+.+?\n+/;
    return content.replace(h1Regex, '').trim();
  };

  // Remover seção de fontes do conteúdo
  const removeSourcesSection = (content: string): string => {
    const sourcesIndex = content.search(/\*\*Fontes:\*\*|---\s*\n\s*\*\*Fontes:\*\*/);
    if (sourcesIndex !== -1) {
      return content.substring(0, sourcesIndex).trim();
    }
    return content;
  };

  // Calcular tempo de leitura (250 palavras por minuto)
  const calculateReadingTime = (content: string) => {
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / 250);
    return minutes;
  };

  // Extrai headings do conteúdo para criar índice (apenas H2)
  useEffect(() => {
    if (!article || !article.content) return;

    // Remove H1 antes de extrair headings
    const contentWithoutH1 = removeH1FromContent(article.content);
    const headings: TableOfContentsItem[] = [];
    const lines = contentWithoutH1.split('\n');

    lines.forEach((line) => {
      const h2Match = line.match(/^## (.+)$/);
      if (h2Match) {
        const text = h2Match[1].trim();
        headings.push({
          id: createSlug(text),
          text
        });
      }
    });

    setTableOfContents(headings);
  }, [article]);

  // Calcula progresso de leitura e rastreia seção ativa
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
      setReadingProgress(Math.min(scrollPercent, 100));
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
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [tableOfContents]);

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const published = new Date(date);
    const diffMs = now.getTime() - published.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 1) return 'Agora mesmo';
    if (diffHours < 24) return `Há ${diffHours}h`;
    const diffDays = Math.floor(diffHours / 24);
    return `Há ${diffDays}d`;
  };

  const getSentimentLabel = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'Positivo';
      case 'negative': return 'Negativo';
      default: return 'Neutro';
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return '#22c55e';
      case 'negative': return '#ef4444';
      default: return '#eab308';
    }
  };

  const shareOnX = () => {
    const url = window.location.href;
    const text = `${article?.title} via @TokenMilagre`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
  };

  const shareOnWhatsApp = () => {
    const url = window.location.href;
    const text = `${article?.title} - ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareOnTelegram = () => {
    const url = window.location.href;
    const text = article?.title || '';
    window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
  };

  // Artigo não encontrado
  if (!article) {
    return (
      <div className="py-8 max-w-4xl" style={{ paddingLeft: '55px', paddingRight: '1rem' }}>
        <div className="space-y-8">
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📰</div>
            <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              Notícia não encontrada
            </h1>
            <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>
              A notícia que você procura não existe ou foi removida.
            </p>
            <button
              onClick={() => router.push('/dashboard/noticias')}
              className="px-6 py-3 rounded-lg font-semibold transition-all hover:opacity-90"
              style={{
                backgroundColor: 'var(--brand-primary)',
                color: 'var(--text-inverse)'
              }}
            >
              ← Voltar para Notícias
            </button>
          </div>
        </div>
      </div>
    );
  }

  const markdownSources = extractSourcesFromMarkdown(article.content || '');
  // Remove H1 primeiro, depois remove seção de fontes
  const contentWithoutH1 = removeH1FromContent(article.content || '');
  const cleanContent = removeSourcesSection(contentWithoutH1);
  const readingTime = calculateReadingTime(cleanContent);

  // Citations do Perplexity
  const citations = article.citations || [];
  const citationComponents = getCitationAwareMarkdownComponents(citations);

  return (
    <>
      {/* Barra de progresso de leitura */}
      <div
        className="fixed top-0 left-0 h-1 z-50 transition-all"
        style={{
          width: `${readingProgress}%`,
          backgroundColor: 'var(--brand-primary)'
        }}
      />

      <div className="py-8">
        <div className="flex gap-8" style={{ paddingLeft: '55px', paddingRight: '1rem' }}>
          <div className="flex-1 max-w-4xl space-y-8">
            {/* Voltar */}
            <button
              onClick={() => router.push('/dashboard/noticias')}
              className="inline-flex items-center gap-2 text-sm font-semibold transition-colors hover:opacity-80"
              style={{ color: 'var(--brand-primary)' }}
            >
              <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4" />
              Voltar para Notícias
            </button>

            {/* Imagem de Capa (se existir) */}
            {(article as any).coverImage && (
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <img
                  src={(article as any).coverImage}
                  alt={(article as any).coverImageAlt || article.title}
                  className="w-full h-[400px] object-cover"
                  loading="eager"
                />
              </div>
            )}

            {/* Header do Artigo */}
            <div className="space-y-6">
              {/* Meta info */}
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className="px-3 py-1 rounded-lg text-sm font-semibold"
                  style={{
                    backgroundColor: getSentimentColor(article.sentiment),
                    color: 'white'
                  }}
                >
                  {getSentimentLabel(article.sentiment)}
                </span>
                <span
                  className="px-3 py-1 rounded-lg text-sm font-semibold"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-primary)'
                  }}
                >
                  {article.source}
                </span>
                <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                  📖 {readingTime} min de leitura
                </span>
                <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                  {getTimeAgo(article.publishedAt)}
                </span>
              </div>

              {/* Título */}
              <h1 className="text-4xl md:text-5xl font-bold leading-tight font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
                {article.title}
              </h1>

              {/* Data de Publicação */}
              <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-tertiary)' }}>
                <FontAwesomeIcon icon={faCalendar} className="w-4 h-4" />
                <span>
                  Publicado em: {new Date(article.publishedAt).toLocaleDateString('pt-BR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZone: 'America/Sao_Paulo'
                  })} BRT
                </span>
              </div>

              {/* Resumo */}
              <p className="text-xl leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {article.summary}
              </p>

              {/* Keywords/Tags */}
              <div className="flex flex-wrap gap-2">
                {article.keywords.map((keyword, idx) => (
                  <button
                    key={idx}
                    onClick={() => router.push(`/dashboard/noticias?search=${encodeURIComponent(keyword)}`)}
                    className="px-3 py-1 rounded-lg text-sm transition-all hover:opacity-80 cursor-pointer"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      color: 'var(--text-tertiary)'
                    }}
                    title={`Buscar artigos sobre: ${keyword}`}
                  >
                    #{keyword}
                  </button>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t" style={{ borderColor: 'var(--border-light)' }}></div>

            {/* Conteúdo do Artigo */}
            <article
              className="prose prose-lg max-w-none"
              style={{
                color: 'var(--text-primary)',
              }}
            >
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-3xl font-bold mt-8 mb-4 font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => {
                    const text = String(children);
                    const id = createSlug(text);
                    return (
                      <h2 id={id} className="text-2xl font-bold mt-8 mb-4 font-[family-name:var(--font-poppins)] scroll-mt-24" style={{ color: 'var(--text-primary)' }}>
                        {children}
                      </h2>
                    );
                  },
                  h3: ({ children }) => {
                    const text = String(children);
                    const id = createSlug(text);
                    return (
                      <h3 id={id} className="text-xl font-bold mt-6 mb-3 font-[family-name:var(--font-poppins)] scroll-mt-24" style={{ color: 'var(--text-primary)' }}>
                        {children}
                      </h3>
                    );
                  },
                  // Componentes de citação (p, li, strong) processam [1][2]
                  ...citationComponents,
                  ul: ({ children }) => (
                    <ul className="mb-4 space-y-2 list-disc list-inside" style={{ color: 'var(--text-primary)' }}>
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="mb-4 space-y-2 list-decimal list-inside" style={{ color: 'var(--text-primary)' }}>
                      {children}
                    </ol>
                  ),
                  em: ({ children }) => (
                    <em className="italic" style={{ color: 'var(--text-secondary)' }}>
                      {children}
                    </em>
                  ),
                  code: ({ children }) => (
                    <code
                      className="px-2 py-1 rounded text-sm font-mono"
                      style={{
                        backgroundColor: 'var(--bg-secondary)',
                        color: 'var(--brand-primary)'
                      }}
                    >
                      {children}
                    </code>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote
                      className="pl-4 border-l-4 italic my-4"
                      style={{
                        borderColor: 'var(--brand-primary)',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      {children}
                    </blockquote>
                  ),
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors hover:opacity-80"
                      style={{ color: 'var(--brand-primary)' }}
                    >
                      {children}
                    </a>
                  ),
                }}
              >
                {cleanContent || 'Conteúdo não disponível.'}
              </ReactMarkdown>
            </article>

            {/* Seção de Fontes */}
            <SourcesSection citations={citations} />

            {/* Divider */}
            <div className="border-t" style={{ borderColor: 'var(--border-light)' }}></div>

            {/* Nota de Transparência */}
            <div className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-light)' }}>
              <div className="flex items-start gap-3">
                <div className="text-2xl">📊</div>
                <div className="flex-1 space-y-2">
                  <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>
                    Nota de Transparência
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    Publicado por $MILAGRE Research | Última atualização: {new Date(article.publishedAt).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    Este conteúdo é educacional e informativo, baseado em fontes verificadas do mercado cripto. Não constitui aconselhamento financeiro ou recomendação de investimento. Criptomoedas envolvem riscos - sempre conduza sua própria pesquisa (DYOR).
                  </p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t" style={{ borderColor: 'var(--border-light)' }}></div>

            {/* Compartilhar */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
                Compartilhe esta notícia
              </h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={shareOnX}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all hover:opacity-80"
                  style={{ backgroundColor: '#000000', color: 'white' }}
                >
                  <FontAwesomeIcon icon={faXTwitter} className="w-5 h-5" />
                  X (Twitter)
                </button>
                <button
                  onClick={shareOnTelegram}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all hover:opacity-80"
                  style={{ backgroundColor: '#0088cc', color: 'white' }}
                >
                  <FontAwesomeIcon icon={faTelegram} className="w-5 h-5" />
                  Telegram
                </button>
                <button
                  onClick={shareOnWhatsApp}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all hover:opacity-80"
                  style={{ backgroundColor: '#25D366', color: 'white' }}
                >
                  <FontAwesomeIcon icon={faWhatsapp} className="w-5 h-5" />
                  WhatsApp
                </button>
              </div>
            </div>

            {/* Artigos Relacionados */}
            {relatedArticles.length > 0 && (
              <>
                <div className="border-t" style={{ borderColor: 'var(--border-light)' }}></div>
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
                    Notícias Relacionadas
                  </h3>
                  <div className="grid gap-4">
                    {relatedArticles.slice(0, 3).map((related) => (
                      <Link
                        key={related.id}
                        href={`/dashboard/noticias/${related.slug || related.id}`}
                        className="block p-6 rounded-xl border transition-all hover:shadow-lg"
                        style={{
                          backgroundColor: 'var(--bg-secondary)',
                          borderColor: 'var(--border-light)'
                        }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className="px-2 py-1 rounded text-xs font-semibold"
                            style={{
                              backgroundColor: getSentimentColor(related.sentiment),
                              color: 'white'
                            }}
                          >
                            {getSentimentLabel(related.sentiment)}
                          </span>
                          <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                            {related.category[0]}
                          </span>
                        </div>
                        <h4 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                          {related.title}
                        </h4>
                        <p className="text-sm line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                          {related.summary}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Sidebar - Índice (Desktop) */}
          <div className="hidden xl:block w-64 shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Índice */}
              {tableOfContents.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                    Neste Artigo
                  </h3>
                  <nav className="space-y-2">
                    {tableOfContents.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => scrollToSection(item.id)}
                        className={`block text-sm text-left transition-all hover:pl-2 py-1 w-full ${
                          activeSection === item.id ? 'pl-2 font-semibold' : ''
                        }`}
                        style={{
                          color: activeSection === item.id ? 'var(--brand-primary)' : 'var(--text-secondary)',
                          wordBreak: 'break-word',
                          overflowWrap: 'break-word',
                          hyphens: 'auto'
                        }}
                      >
                        {item.text}
                      </button>
                    ))}
                  </nav>
                </div>
              )}

              {/* Navegação Anterior/Próximo */}
              {(previousArticle || nextArticle) && (
                <>
                  <div className="border-t" style={{ borderColor: 'var(--border-light)' }}></div>
                  <div>
                    <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                      Navegação
                    </h3>
                    <div className="space-y-3">
                      {previousArticle && (
                        <Link
                          href={`/dashboard/noticias/${previousArticle.slug || previousArticle.id}`}
                          className="block p-3 rounded-lg border transition-all hover:shadow-md"
                          style={{
                            backgroundColor: 'var(--bg-secondary)',
                            borderColor: 'var(--border-light)'
                          }}
                        >
                          <div className="text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>
                            ← Anterior
                          </div>
                          <div className="text-sm font-semibold line-clamp-2" style={{ color: 'var(--text-primary)' }}>
                            {previousArticle.title}
                          </div>
                        </Link>
                      )}
                      {nextArticle && (
                        <Link
                          href={`/dashboard/noticias/${nextArticle.slug || nextArticle.id}`}
                          className="block p-3 rounded-lg border transition-all hover:shadow-md"
                          style={{
                            backgroundColor: 'var(--bg-secondary)',
                            borderColor: 'var(--border-light)'
                          }}
                        >
                          <div className="text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>
                            Próxima →
                          </div>
                          <div className="text-sm font-semibold line-clamp-2" style={{ color: 'var(--text-primary)' }}>
                            {nextArticle.title}
                          </div>
                        </Link>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
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
    </>
  );
}
