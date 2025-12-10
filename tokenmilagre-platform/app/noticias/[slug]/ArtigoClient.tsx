'use client';

import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { useEffect, useState } from 'react';
import type React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowUp, faCalendar, faClock, faShareNodes, faUser } from '@fortawesome/free-solid-svg-icons';
import { faXTwitter, faTelegram, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { getCitationAwareMarkdownComponents, SourcesSection } from '@/lib/domains/articles/components/citations-processor';
import TransparencyNote from '@/components/shared/TransparencyNote';

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
  coverImage?: string;
  coverImageAlt?: string;
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

  // Rastreia seção ativa
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

  const getSentimentColorClass = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-emerald-500 text-white';
      case 'negative': return 'bg-red-500 text-white';
      default: return 'bg-amber-500 text-white';
    }
  };

  const getSentimentColorHex = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return '#10B981'; // emerald-500
      case 'negative': return '#EF4444'; // red-500
      default: return '#F59E0B'; // amber-500
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

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="glass-card p-12 max-w-2xl w-full text-center rounded-2xl">
          <div className="text-6xl mb-6">📰</div>
          <h1 className="text-3xl font-bold mb-4 text-[var(--text-article-title)]">
            Notícia não encontrada
          </h1>
          <p className="mb-8 text-[var(--text-article-muted)] text-lg">
            A notícia que você procura não existe ou foi removida.
          </p>
          <button
            onClick={() => router.push('/noticias')}
            className="px-8 py-3 rounded-xl font-bold transition-all hover:opacity-90 bg-[var(--brand-primary)] text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            ← Voltar para Notícias
          </button>
        </div>
      </div>
    );
  }

  const markdownSources = extractSourcesFromMarkdown(article.content || '');
  const contentWithoutH1 = removeH1FromContent(article.content || '');
  const cleanContent = removeSourcesSection(contentWithoutH1);
  const readingTime = calculateReadingTime(cleanContent);
  const citations = article.citations || [];
  const citationComponents = getCitationAwareMarkdownComponents(citations);

  return (
    <>
      {/* Barra de progresso de leitura */}
      <div className="relative pt-6 pb-4 md:pt-12 md:pb-8 overflow-hidden">
        {/* Background Glow Effect - Dark Mode Only */}
        <div className="absolute top-0 left-0 w-full max-w-4xl h-full opacity-30 pointer-events-none hidden dark:block"
          style={{
            background: `radial-gradient(circle at 20% 30%, ${getSentimentColorHex(article.sentiment)}40 0%, transparent 70%)`,
            WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 20%)',
            maskImage: 'linear-gradient(to bottom, transparent, black 20%)'
          }}
        />

        <div className="container mx-auto px-6 md:px-10 relative z-10">
          <div className="max-w-6xl">

            {/* Meta Badges */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="inline-flex items-center gap-2">
                <span className="text-[10px] font-bold text-zinc-700 dark:text-white/90 uppercase tracking-wider drop-shadow-md">
                  Sentimento
                </span>
                <div className="w-1 h-1 rounded-full bg-zinc-700/50 dark:bg-white/50 shadow-sm" />
                <span className="text-sm font-extrabold uppercase tracking-wide drop-shadow-md" style={{ color: getSentimentColorHex(article.sentiment) }}>
                  {getSentimentLabel(article.sentiment)}
                </span>
              </div>

            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 font-[family-name:var(--font-poppins)] text-[var(--text-article-title)]">
              {article.title}
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl leading-relaxed text-[var(--text-article-body)] opacity-90 max-w-2xl">
              {article.summary}
            </p>

            {/* Author & Date */}
            <div className="mt-8 flex items-center gap-6 text-sm text-[var(--text-article-muted)]">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faCalendar} className="w-3 h-3" />
                <span>{new Date(article.publishedAt).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faClock} className="w-3 h-3" />
                <span>{readingTime} min de leitura</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 pt-2 pb-8 lg:pt-4 lg:pb-12">

        {/* Botão Voltar Mobile - REMOVIDO CONFORME SOLICITADO */}
        {/* <div className="mb-6 lg:hidden">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[var(--text-article-muted)] hover:text-[var(--brand-primary)] transition-colors"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            <span className="font-semibold">Voltar</span>
          </button>
        </div> */}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Coluna Principal (Artigo) */}
          <div className="lg:col-span-8 space-y-8">

            {/* Card Principal do Artigo - Estilo removido conforme solicitado */}
            <div className="overflow-hidden">

              {/* Imagem de Capa */}
              {(article as any).coverImage && (
                <div className="relative h-[300px] md:h-[400px] w-full">
                  <img
                    src={(article as any).coverImage}
                    alt={(article as any).coverImageAlt || article.title}
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
              )}

              <div className="py-4 space-y-8">



                {/* Conteúdo Markdown */}
                <article className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-[family-name:var(--font-poppins)] prose-a:text-[var(--brand-primary)] prose-img:rounded-xl prose-img:shadow-lg">
                  <ReactMarkdown
                    components={{
                      ...citationComponents,
                      h1: ({ children }) => <h1 className="text-3xl font-bold mt-10 mb-6 text-[var(--text-article-title)]">{children}</h1>,
                      h2: ({ children }) => {
                        const text = String(children);
                        const id = createSlug(text);
                        return <h2 id={id} className="text-2xl font-bold mt-10 mb-5 text-[var(--text-article-title)] scroll-mt-32 border-b border-[var(--border-article)] pb-2">{children}</h2>;
                      },
                      h3: ({ children }) => {
                        const text = String(children);
                        const id = createSlug(text);
                        return <h3 id={id} className="text-xl font-bold mt-8 mb-4 text-[var(--text-article-title)] scroll-mt-32">{children}</h3>;
                      },
                      // p removido pois já vem em citationComponents
                      ul: ({ children }) => <ul className="mb-6 space-y-2 list-disc list-inside text-[var(--text-article-body)] marker:text-[var(--brand-primary)]">{children}</ul>,
                      ol: ({ children }) => <ol className="mb-6 space-y-2 list-decimal list-inside text-[var(--text-article-body)] marker:text-[var(--brand-primary)]">{children}</ol>,
                      blockquote: ({ children }) => (
                        <blockquote className="pl-6 border-l-4 border-[var(--brand-primary)] my-8 italic bg-[var(--bg-article-quote)] p-4 rounded-r-xl text-[var(--text-article-body)]">
                          {children}
                        </blockquote>
                      ),
                      code: ({ children }) => (
                        <code className="px-2 py-1 rounded text-sm font-mono bg-[var(--bg-article-tag)] text-[var(--brand-primary)]">
                          {children}
                        </code>
                      ),
                    }}
                  >
                    {cleanContent || 'Conteúdo não disponível.'}
                  </ReactMarkdown>
                </article>

                {/* Tags Footer */}
                <div className="mt-12 pt-8 border-t border-[var(--border-article)]">
                  <div className="flex flex-wrap gap-2">
                    {article.keywords.map((keyword, idx) => (
                      <button
                        key={idx}
                        onClick={() => router.push(`/noticias?search=${encodeURIComponent(keyword)}`)}
                        className="px-4 py-1.5 rounded-full text-sm font-medium transition-all bg-[var(--bg-article-tag)] text-[var(--text-article-muted)] lg:hover:bg-[var(--brand-primary)] lg:hover:text-white lg:hover:shadow-md"
                      >
                        #{keyword}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Seção de Fontes */}
                <SourcesSection citations={citations} />

                <div className="h-px bg-[var(--border-article)]" />

                {/* Nota de Transparência */}
                <TransparencyNote publishedAt={article.publishedAt} />



              </div>
            </div>

            {/* Artigos Relacionados */}
            {relatedArticles.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-[var(--text-article-title)] pl-2 border-l-4 border-[var(--brand-primary)]">
                  Notícias Relacionadas
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {relatedArticles.slice(0, 4).map((related) => (
                    <Link
                      key={related.id}
                      href={`/noticias/${related.slug || related.id}`}
                      className="glass-card group p-5 rounded-2xl border border-[var(--border-article)] lg:hover:border-[var(--brand-primary)]/50 transition-all lg:hover:-translate-y-1 lg:hover:shadow-xl block"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getSentimentColorClass(related.sentiment)}`}>
                          {getSentimentLabel(related.sentiment)}
                        </span>
                        <span className="text-xs text-[var(--text-article-muted)]">
                          {related.category[0]}
                        </span>
                      </div>
                      <h4 className="text-lg font-bold mb-2 text-[var(--text-article-title)] lg:group-hover:text-[var(--brand-primary)] transition-colors line-clamp-2">
                        {related.title}
                      </h4>
                      <p className="text-sm text-[var(--text-article-body)] line-clamp-2">
                        {related.summary}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar (Desktop) */}
          <div className="hidden lg:block lg:col-span-4 space-y-8">
            <div className="sticky top-24 space-y-6">

              {/* Botão Voltar Desktop */}
              <button
                onClick={() => router.push('/noticias')}
                className="flex items-center gap-2 text-[var(--text-article-muted)] hover:text-[var(--brand-primary)] transition-colors font-medium mb-2 group"
              >
                <div className="w-8 h-8 rounded-full bg-[var(--bg-article-tag)] flex items-center justify-center group-hover:bg-[var(--brand-primary)] group-hover:text-white transition-all">
                  <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4" />
                </div>
                Voltar para Notícias
              </button>

              {/* Índice */}
              {tableOfContents.length > 0 && (
                <div className="glass-card p-6 rounded-2xl border border-[var(--border-article)]">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-article-muted)] mb-4 flex items-center gap-2">
                    <span className="w-1 h-4 bg-[var(--brand-primary)] rounded-full"></span>
                    Neste Artigo
                  </h3>
                  <nav className="space-y-1 relative">
                    {/* Linha vertical de progresso visual */}
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[var(--bg-article-tag)] ml-0.5" />

                    {tableOfContents.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => scrollToSection(item.id)}
                        className={`relative block text-sm text-left transition-all py-2 pl-4 w-full border-l-2 -ml-[1px] ${activeSection === item.id
                          ? 'border-[var(--brand-primary)] text-[var(--brand-primary)] font-bold bg-[var(--brand-primary)]/5'
                          : 'border-transparent text-[var(--text-article-muted)] hover:text-[var(--text-article-title)] hover:border-[var(--border-article)]'
                          }`}
                      >
                        {item.text}
                      </button>
                    ))}
                  </nav>
                </div>
              )}

              {/* Compartilhar (Sidebar) */}
              <div className="space-y-4 pt-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-article-muted)] flex items-center gap-2">
                  <FontAwesomeIcon icon={faShareNodes} />
                  Compartilhe
                </h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={shareOnX}
                    className="flex-1 min-w-[100px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all bg-black/5 hover:bg-black/10 border border-black/10 text-black dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/10 dark:text-white hover:scale-105 active:scale-95 text-sm"
                  >
                    <FontAwesomeIcon icon={faXTwitter} className="w-4 h-4" />
                    X
                  </button>
                  <button
                    onClick={shareOnTelegram}
                    className="flex-1 min-w-[100px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all bg-[#0088cc]/10 hover:bg-[#0088cc]/20 border border-[#0088cc]/20 text-[#0088cc] hover:scale-105 active:scale-95 text-sm"
                  >
                    <FontAwesomeIcon icon={faTelegram} className="w-4 h-4" />
                    Telegram
                  </button>
                  <button
                    onClick={shareOnWhatsApp}
                    className="flex-1 min-w-[100px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/20 text-[#25D366] hover:scale-105 active:scale-95 text-sm"
                  >
                    <FontAwesomeIcon icon={faWhatsapp} className="w-4 h-4" />
                    WhatsApp
                  </button>
                </div>
              </div>


            </div>
          </div>
        </div>
      </div>
    </>
  );
}
