'use client';

import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { useEffect, useState } from 'react';
import type React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faXTwitter, faTelegram, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { getCitationAwareMarkdownComponents, SourcesSection } from '@/lib/domains/articles/components/citations-processor';
import TransparencyNote from '@/components/shared/TransparencyNote';
import PageWrapper from '@/components/layout/PageWrapper';
import { useSidebar } from '@/contexts/SidebarContext';
import VerifyButton from '@/components/shared/VerifyButton';
import EngagementBar from '@/components/engagement/EngagementBar';
import CommentsSection from '@/components/engagement/CommentsSection';
import CommentCountButton from '@/components/engagement/CommentCountButton';

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
  citations?: string[];
  coverImage?: string;
  coverImageAlt?: string;
}

interface ArtigoClientProps {
  article: NewsItem | null;
  relatedArticles?: NewsItem[];
}

interface TableOfContentsItem {
  id: string;
  text: string;
}

export default function ArtigoClient({ article, relatedArticles = [] }: ArtigoClientProps) {
  const router = useRouter();
  const { setDynamicTitle, setShortTitle } = useSidebar();

  useEffect(() => {
    if (article) {
      setDynamicTitle(article.title);
      setShortTitle('Notícias');
    }
  }, [article, setDynamicTitle, setShortTitle]);

  const [tableOfContents, setTableOfContents] = useState<TableOfContentsItem[]>([]);
  const [activeSection, setActiveSection] = useState<string>('');
  const [showComments, setShowComments] = useState(false);


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


  // Remover H1 do início do conteúdo
  const removeH1FromContent = (content: string): string => {
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

  // Calcular tempo de leitura
  const calculateReadingTime = (content: string) => {
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / 250);
    return minutes;
  };

  // Extrair headings para índice
  useEffect(() => {
    if (!article || !article.content) return;

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

  // Rastrear seção ativa e scroll
  useEffect(() => {
    const handleScroll = () => {

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

  const getSentimentLabel = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'Positivo';
      case 'negative': return 'Negativo';
      default: return 'Neutro';
    }
  };

  const getSentimentColorClass = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-emerald-500 text-white';
      case 'negative': return 'bg-red-500 text-white';
      default: return 'bg-amber-500 text-white';
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

  // Formatar data no estilo editorial - usando UTC para consistência SSR
  const formatEditorialDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC' // Força UTC para consistência entre servidor e cliente
    });
  };

  if (!article) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">📰</div>
          <h1 className="text-2xl md:text-3xl font-bold mb-4 text-[var(--text-article-title)]">
            Notícia não encontrada
          </h1>
          <p className="mb-8 text-[var(--text-article-muted)] text-base md:text-lg">
            A notícia que você procura não existe ou foi removida.
          </p>
          <button
            onClick={() => router.push('/noticias')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all bg-[var(--brand-primary)] text-white hover:opacity-90"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4" />
            Voltar para Notícias
          </button>
        </div>
      </div>
    );
  }

  const contentWithoutH1 = removeH1FromContent(article.content || '');
  const cleanContent = removeSourcesSection(contentWithoutH1);
  const readingTime = calculateReadingTime(cleanContent);
  const citations = article.citations || [];
  const citationComponents = getCitationAwareMarkdownComponents(citations);

  return (
    <PageWrapper
      header={{
        title: "Notícias",
        description: "Análises e atualizações do mercado cripto"
      }}
    >

      {/* ============================================
          NYT-STYLE EDITORIAL LAYOUT
          ============================================ */}
      <div className="min-h-screen">

        {/* Main Container */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">

          {/* Grid: Sidebar Left + Content Center + Space Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-8">

            <aside className="hidden lg:block lg:col-span-2 xl:col-span-2">
              <div className="sticky top-24 pt-8 space-y-8">

                {/* Índice */}
                {tableOfContents.length > 0 && (
                  <nav className="space-y-1">
                    <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-article-muted)] mb-3">
                      Neste artigo
                    </h3>
                    {tableOfContents.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => scrollToSection(item.id)}
                        className={`block text-left text-sm py-1.5 w-full transition-all leading-snug ${activeSection === item.id
                          ? 'text-[var(--brand-primary)] font-medium'
                          : 'text-[var(--text-article-muted)] hover:text-[var(--text-article-title)]'
                          }`}
                      >
                        {item.text}
                      </button>
                    ))}
                  </nav>
                )}

                {/* Divisor */}
                <div className="h-px bg-[var(--border-article)]" />

                {/* Compartilhar */}
                <div className="space-y-3">
                  <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-article-muted)]">
                    Compartilhar
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={shareOnX}
                      className="w-9 h-9 flex items-center justify-center rounded-full border border-[var(--border-article)] text-[var(--text-article-muted)] hover:border-[var(--text-article-title)] hover:text-[var(--text-article-title)] transition-colors"
                      aria-label="Compartilhar no X"
                    >
                      <FontAwesomeIcon icon={faXTwitter} className="w-4 h-4" />
                    </button>
                    <button
                      onClick={shareOnTelegram}
                      className="w-9 h-9 flex items-center justify-center rounded-full border border-[var(--border-article)] text-[var(--text-article-muted)] hover:border-[#0088cc] hover:text-[#0088cc] transition-colors"
                      aria-label="Compartilhar no Telegram"
                    >
                      <FontAwesomeIcon icon={faTelegram} className="w-4 h-4" />
                    </button>
                    <button
                      onClick={shareOnWhatsApp}
                      className="w-9 h-9 flex items-center justify-center rounded-full border border-[var(--border-article)] text-[var(--text-article-muted)] hover:border-[#25D366] hover:text-[#25D366] transition-colors"
                      aria-label="Compartilhar no WhatsApp"
                    >
                      <FontAwesomeIcon icon={faWhatsapp} className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            </aside>

            {/* ========== MAIN CONTENT ========== */}
            <main className="lg:col-span-7 xl:col-span-7 pt-6 md:pt-12 lg:pt-8">

              {/* ===== ARTICLE HEADER (NYT Style) ===== */}
              <header className="mb-10 md:mb-14">

                {/* Category */}
                <div className="mb-4 md:mb-6">
                  <span className="text-[var(--brand-primary)] text-xs md:text-sm font-semibold uppercase tracking-[0.15em]">
                    {article.category[0]}
                  </span>
                </div>

                {/* Title - Editorial Typography */}
                <h1
                  className="text-[1.75rem] md:text-[2.5rem] lg:text-[2.75rem] font-bold text-[var(--text-article-title)] mb-6 md:mb-8"
                  style={{
                    lineHeight: '1.15',
                    letterSpacing: '-0.02em',
                    fontFamily: 'var(--font-sans)'
                  }}
                >
                  {article.title}
                </h1>

                {/* Summary - Elegant Italic */}
                <p
                  className="text-lg md:text-xl lg:text-[1.375rem] text-[var(--text-article-body)] font-light italic mb-6 md:mb-8"
                  style={{ lineHeight: '1.6' }}
                >
                  {article.summary}
                </p>

                {/* Meta Line: Date + Reading Time + FactCheck */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[var(--text-article-muted)] pb-6 md:pb-8 border-b border-[var(--border-article)]">
                  <time dateTime={article.publishedAt} className="capitalize">
                    {formatEditorialDate(article.publishedAt)}
                  </time>
                  <span className="hidden md:inline">•</span>
                  <span>{readingTime} min de leitura</span>
                  <span className="hidden md:inline">•</span>
                  <VerifyButton id={article.id} type="article" />
                  <CommentCountButton id={article.id} type="article" onClick={() => setShowComments(!showComments)} />
                </div>

                {/* Mobile: Share Buttons */}
                <div className="lg:hidden mt-4 pt-4 flex items-center gap-4">
                  <span className="text-xs text-[var(--text-article-muted)] uppercase tracking-wider">Compartilhar</span>
                  <div className="flex gap-2">
                    <button
                      onClick={shareOnX}
                      className="w-9 h-9 flex items-center justify-center rounded-full border border-[var(--border-article)] text-[var(--text-article-muted)]"
                      aria-label="X"
                    >
                      <FontAwesomeIcon icon={faXTwitter} className="w-4 h-4" />
                    </button>
                    <button
                      onClick={shareOnTelegram}
                      className="w-9 h-9 flex items-center justify-center rounded-full border border-[var(--border-article)] text-[#0088cc]"
                      aria-label="Telegram"
                    >
                      <FontAwesomeIcon icon={faTelegram} className="w-4 h-4" />
                    </button>
                    <button
                      onClick={shareOnWhatsApp}
                      className="w-9 h-9 flex items-center justify-center rounded-full border border-[var(--border-article)] text-[#25D366]"
                      aria-label="WhatsApp"
                    >
                      <FontAwesomeIcon icon={faWhatsapp} className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </header>

              {/* ===== COVER IMAGE ===== */}
              {(article as any).coverImage && (
                <figure className="mb-10 md:mb-14 -mx-4 md:mx-0">
                  <img
                    src={(article as any).coverImage}
                    alt={(article as any).coverImageAlt || article.title}
                    className="w-full h-auto md:rounded-lg"
                    loading="eager"
                  />
                  {(article as any).coverImageAlt && (
                    <figcaption className="mt-3 px-4 md:px-0 text-sm text-[var(--text-article-muted)] italic">
                      {(article as any).coverImageAlt}
                    </figcaption>
                  )}
                </figure>
              )}

              {/* ===== ARTICLE BODY ===== */}
              <article
                className="prose prose-lg max-w-none"
                style={{
                  '--tw-prose-body': 'var(--text-article-body)',
                  '--tw-prose-headings': 'var(--text-article-title)',
                  '--tw-prose-links': 'var(--brand-primary)',
                } as React.CSSProperties}
              >
                <ReactMarkdown
                  components={{
                    ...citationComponents,
                    h1: ({ children }) => (
                      <h1 className="text-2xl md:text-3xl font-bold mt-12 md:mt-16 mb-6 text-[var(--text-article-title)]">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => {
                      const text = String(children);
                      const id = createSlug(text);
                      return (
                        <h2
                          id={id}
                          className="text-xl md:text-2xl font-bold mt-14 md:mt-16 mb-5 pt-8 text-[var(--text-article-title)] scroll-mt-28 border-t border-[var(--border-article)]"
                          style={{ letterSpacing: '-0.01em' }}
                        >
                          {children}
                        </h2>
                      );
                    },
                    h3: ({ children }) => {
                      const text = String(children);
                      const id = createSlug(text);
                      return (
                        <h3
                          id={id}
                          className="text-lg md:text-xl font-semibold mt-10 mb-4 text-[var(--text-article-title)] scroll-mt-28"
                        >
                          {children}
                        </h3>
                      );
                    },
                    p: ({ children }) => (
                      <p
                        className="text-[var(--text-article-body)] mb-7 md:mb-8"
                        style={{
                          fontSize: 'clamp(1.0625rem, 1vw + 0.9rem, 1.1875rem)',
                          lineHeight: '1.9'
                        }}
                      >
                        {children}
                      </p>
                    ),
                    ul: ({ children }) => (
                      <ul className="mb-8 space-y-3 list-disc pl-6 text-[var(--text-article-body)]" style={{ lineHeight: '1.8' }}>
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="mb-8 space-y-3 list-decimal pl-6 text-[var(--text-article-body)]" style={{ lineHeight: '1.8' }}>
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => (
                      <li className="pl-1" style={{ lineHeight: '1.8' }}>
                        {children}
                      </li>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote
                        className="pl-6 md:pl-8 border-l-[3px] border-[var(--brand-primary)] my-10 md:my-12 py-2 text-[var(--text-article-body)]"
                        style={{ fontStyle: 'normal' }}
                      >
                        <div className="text-lg md:text-xl" style={{ lineHeight: '1.7' }}>
                          {children}
                        </div>
                      </blockquote>
                    ),
                    hr: () => (
                      <hr className="my-12 md:my-16 border-0 h-px bg-[var(--border-article)]" />
                    ),
                    code: ({ children }) => (
                      <code className="px-1.5 py-0.5 rounded text-sm font-mono bg-[var(--bg-article-tag)] text-[var(--text-article-title)]">
                        {children}
                      </code>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-semibold text-[var(--text-article-title)]">
                        {children}
                      </strong>
                    ),
                    em: ({ children }) => (
                      <em className="italic">{children}</em>
                    ),
                    a: ({ href, children }) => (
                      <a
                        href={href}
                        className="text-[var(--brand-primary)] underline decoration-[var(--brand-primary)]/30 underline-offset-2 hover:decoration-[var(--brand-primary)] transition-colors"
                        target={href?.startsWith('http') ? '_blank' : undefined}
                        rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                      >
                        {children}
                      </a>
                    ),
                  }}
                >
                  {cleanContent || 'Conteúdo não disponível.'}
                </ReactMarkdown>
              </article>

              {/* ===== TAGS ===== */}
              <div className="mt-12 md:mt-16 pt-8 border-t border-[var(--border-article)]">
                <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-article-muted)] mb-4">
                  Tópicos relacionados
                </h3>
                <div className="flex flex-wrap gap-2">
                  {article.keywords.map((keyword, idx) => (
                    <button
                      key={idx}
                      onClick={() => router.push(`/noticias?search=${encodeURIComponent(keyword)}`)}
                      className="px-3 py-1.5 rounded-full text-sm transition-colors bg-[var(--bg-article-tag)] text-[var(--text-article-muted)] hover:bg-[var(--brand-primary)] hover:text-white"
                    >
                      {keyword}
                    </button>
                  ))}
                </div>
              </div>

              {/* ===== SOURCES ===== */}
              <div className="mt-12">
                <SourcesSection citations={citations} />
              </div>

              {/* ===== TRANSPARENCY NOTE ===== */}
              <div className="mt-12 pt-8 border-t border-[var(--border-article)]">
                <TransparencyNote publishedAt={article.publishedAt} />
              </div>

              {/* ===== ENGAGEMENT BAR ===== */}
              <div className="mt-8 pt-6 border-t border-[var(--border-article)]">
                <EngagementBar
                  id={article.id}
                  type="article"
                  onCommentClick={() => setShowComments(!showComments)}
                />
              </div>

              {/* ===== COMMENTS SECTION ===== */}
              <CommentsSection
                id={article.id}
                type="article"
                isOpen={showComments}
              />

              {/* ===== RELATED ARTICLES ===== */}
              {relatedArticles.length > 0 && (
                <div className="mt-16 md:mt-20 pt-10 border-t border-[var(--border-article)]">
                  <h3 className="text-xl md:text-2xl font-bold text-[var(--text-article-title)] mb-8">
                    Continue lendo
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {relatedArticles.slice(0, 4).map((related) => (
                      <Link
                        key={related.id}
                        href={`/noticias/${related.slug || related.id}`}
                        className="group block p-5 rounded-xl border border-[var(--border-article)] hover:border-[var(--brand-primary)]/50 transition-all hover:shadow-lg"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getSentimentColorClass(related.sentiment)}`}>
                            {getSentimentLabel(related.sentiment)}
                          </span>
                          <span className="text-xs text-[var(--text-article-muted)]">
                            {related.category[0]}
                          </span>
                        </div>
                        <h4 className="text-base md:text-lg font-semibold mb-2 text-[var(--text-article-title)] group-hover:text-[var(--brand-primary)] transition-colors line-clamp-2">
                          {related.title}
                        </h4>
                        <p className="text-sm text-[var(--text-article-muted)] line-clamp-2">
                          {related.summary}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom Spacing */}
              <div className="h-16 md:h-24" />

            </main>

            {/* ========== RIGHT SPACER (Desktop) ========== */}
            <div className="hidden lg:block lg:col-span-3 xl:col-span-3" />

          </div>
        </div>

      </div>
    </PageWrapper>
  );
}
