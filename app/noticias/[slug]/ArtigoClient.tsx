'use client';

import ReactMarkdown from 'react-markdown';
import { useEffect, useState } from 'react';
import { getCitationAwareMarkdownComponents, SourcesSection } from '@/lib/domains/articles/components/citations-processor';
import TransparencyNote from '@/components/shared/TransparencyNote';
import CommentsSection from '@/components/engagement/CommentsSection';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ZenithArticleLayout, { TableOfContentsItem } from '@/components/zenith/ZenithArticleLayout';

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

export default function ArtigoClient({ article, relatedArticles = [] }: ArtigoClientProps) {
  const router = useRouter();
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
          text,
          level: 2
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

  if (!article) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">📰</div>
          <h1 className="title-newtab text-2xl md:text-3xl mb-4">
            Notícia não encontrada
          </h1>
          <p className="mb-8 text-[var(--text-article-muted)] text-base md:text-lg">
            A notícia que você procura não existe ou foi removida.
          </p>
          <button
            onClick={() => router.push('/noticias')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all bg-[var(--brand-primary)] text-white hover:opacity-90"
          >
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
    <ZenithArticleLayout
      variant="editorial"
      header={{
        title: article.title,
        category: article.category[0],
        summary: article.summary,
        publishedAt: article.publishedAt,
        readTime: `${readingTime} min de leitura`,
        sentiment: article.sentiment
      }}
      coverImage={article.coverImage ? {
        src: article.coverImage,
        alt: article.coverImageAlt || article.title,
        caption: article.coverImageAlt
      } : undefined}
      toc={tableOfContents}
      social={{
        shareText: article.title
      }}
      interaction={{
        id: article.id,
        type: "article",
        onCommentClick: () => setShowComments(!showComments)
      }}
      backLink={{
        href: "/noticias",
        label: "Notícias"
      }}
      activeSection={activeSection}
      onSectionClick={(id) => {
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
      }}
    >
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
              <h1 className="title-newtab text-xl md:text-2xl mt-10 md:mt-12 mb-5">
                {children}
              </h1>
            ),
            h2: ({ children }) => {
              const text = String(children);
              const id = createSlug(text);
              return (
                <h2
                  id={id}
                  className="font-space text-2xl md:text-3xl font-bold text-[var(--text-article-title)] mt-12 md:mt-14 mb-6 pt-6 scroll-mt-28 border-t border-[var(--border-article)]"
                  style={{ letterSpacing: '-0.02em' }}
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
                  className="font-space text-lg md:text-xl font-semibold text-[var(--text-article-title)] mt-8 mb-4 scroll-mt-28"
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

      {/* ===== TRANSPARENCY NOTE ===== */}
      <div className="mt-8">
        <TransparencyNote publishedAt={article.publishedAt} />
      </div>

      {/* ===== TAGS ===== */}
      <div className="mt-8 md:mt-12">
        <h3 className="title-newtab text-[10px] uppercase tracking-[0.2em] text-[var(--text-article-muted)] mb-4">
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

      {/* ===== CONSOLIDATED SOURCES REMOVED (Deprecated) ===== */}

      {/* ===== SOURCES ===== */}
      <div className="mt-12">
        <SourcesSection citations={citations} />
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
          <h3 className="title-newtab text-xl md:text-2xl mb-8">
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
    </ZenithArticleLayout>
  );
}
