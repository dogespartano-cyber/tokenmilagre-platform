'use client';

import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faXTwitter, faTelegram, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { getLevelLabel } from '@/lib/shared/utils/level-helpers';
import { slugify } from '@/lib/shared/utils/content-helpers';
import QuizComponent from '@/components/education/QuizComponent';
import TransparencyNote from '@/components/shared/TransparencyNote';

// Custom unique ID generation for Markdown headers
const slugRegistry = new Map<string, number>();
const getUniqueId = (text: string) => {
  const id = slugify(text);
  if (slugRegistry.has(id)) {
    const count = slugRegistry.get(id)!;
    slugRegistry.set(id, count + 1);
    return `${id}-${count}`;
  }
  slugRegistry.set(id, 1);
  return id;
};

interface EducationalArticle {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  category: string;
  level: 'iniciante' | 'intermediario' | 'avancado';
  type: 'Artigo' | 'Tutorial';
  readTime: string;
  tags: string[];
  author?: string;
  publishedAt: string;
  factCheckSources?: string;
  quizData?: string | null;
}

interface ArtigoEducacionalClientProps {
  article: EducationalArticle | null;
  relatedArticles?: EducationalArticle[];
}

interface TableOfContentsItem {
  id: string;
  text: string;
  level: number;
}

export default function ArtigoEducacionalClient({ article, relatedArticles = [] }: ArtigoEducacionalClientProps) {
  const router = useRouter();
  const [tableOfContents, setTableOfContents] = useState<TableOfContentsItem[]>([]);
  const [activeSection, setActiveSection] = useState<string>('');

  // Custom color scheme for level
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'iniciante': return '#22c55e';
      case 'intermediario': return '#3b82f6';
      case 'avancado': return '#a855f7';
      default: return 'var(--brand-primary)';
    }
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

  // Extrai headings do conteúdo para criar índice
  useEffect(() => {
    if (!article) return;

    const headings: TableOfContentsItem[] = [];
    const lines = article.content.split('\n');
    const usedIds = new Set<string>();

    lines.forEach((line) => {
      const h2Match = line.match(/^## (.+)$/);
      const h3Match = line.match(/^### (.+)$/);

      if (h2Match || h3Match) {
        const text = (h2Match ? h2Match[1] : h3Match![1]).trim();
        const level = h2Match ? 2 : 3;
        let id = slugify(text);

        if (usedIds.has(id)) {
          let counter = 1;
          while (usedIds.has(`${id}-${counter}`)) {
            counter++;
          }
          id = `${id}-${counter}`;
        }

        usedIds.add(id);
        headings.push({ id, text, level });
      }
    });

    setTableOfContents(headings);
  }, [article]);

  // Rastrear seção ativa
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

  // Funções de compartilhamento
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

  // Formatar data no estilo editorial
  const formatEditorialDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Artigo não encontrado
  if (!article) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">📚</div>
          <h1 className="text-2xl md:text-3xl font-bold mb-4 text-[var(--text-article-title)]">
            Artigo não encontrado
          </h1>
          <p className="mb-8 text-[var(--text-article-muted)] text-base md:text-lg">
            O conteúdo que você procura não está disponível no momento.
          </p>
          <button
            onClick={() => router.push('/educacao')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all bg-[var(--brand-primary)] text-white hover:opacity-90"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4" />
            Voltar para Educação
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ============================================
          NYT-STYLE EDITORIAL LAYOUT
          ============================================ */}
      <div className="min-h-screen">

        {/* Main Container */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">

          {/* Grid: Sidebar Left + Content Center + Space Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-8">

            {/* ========== SIDEBAR (Desktop Only) ========== */}
            <aside className="hidden lg:block lg:col-span-2 xl:col-span-2">
              <div className="sticky top-24 pt-8 space-y-8">

                {/* Voltar */}
                <button
                  onClick={() => router.push('/educacao')}
                  className="flex items-center gap-2 text-sm text-[var(--text-article-muted)] hover:text-[var(--text-article-title)] transition-colors group"
                >
                  <FontAwesomeIcon icon={faArrowLeft} className="w-3 h-3 transition-transform group-hover:-translate-x-1" />
                  <span>Educação</span>
                </button>

                {/* Divisor */}
                <div className="h-px bg-[var(--border-article)]" />

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
                        className={`block text-left text-sm py-1.5 w-full transition-all leading-snug ${item.level === 3 ? 'pl-3' : ''
                          } ${activeSection === item.id
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

              {/* Mobile: Voltar */}
              <div className="lg:hidden mb-6">
                <button
                  onClick={() => router.push('/educacao')}
                  className="inline-flex items-center gap-2 text-sm text-[var(--text-article-muted)]"
                >
                  <FontAwesomeIcon icon={faArrowLeft} className="w-3 h-3" />
                  Educação
                </button>
              </div>

              {/* ===== ARTICLE HEADER (NYT Style) ===== */}
              <header className="mb-10 md:mb-14">

                {/* Level Badge + Category */}
                <div className="flex flex-wrap items-center gap-3 mb-4 md:mb-6">
                  <span
                    className="text-xs md:text-sm font-bold uppercase tracking-[0.1em]"
                    style={{ color: getLevelColor(article.level) }}
                  >
                    {getLevelLabel(article.level)}
                  </span>
                  <span className="text-[var(--border-article)]">•</span>
                  <span className="text-[var(--text-article-muted)] text-xs md:text-sm uppercase tracking-wider">
                    {article.category}
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

                {/* Description - Elegant Italic */}
                <p
                  className="text-lg md:text-xl lg:text-[1.375rem] text-[var(--text-article-body)] font-light italic mb-6 md:mb-8"
                  style={{ lineHeight: '1.6' }}
                >
                  {article.description}
                </p>

                {/* Meta Line: Date + Reading Time */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[var(--text-article-muted)] pb-6 md:pb-8 border-b border-[var(--border-article)]">
                  <time dateTime={article.publishedAt} className="capitalize">
                    {formatEditorialDate(article.publishedAt)}
                  </time>
                  <span className="hidden md:inline">•</span>
                  <span>{article.readTime}</span>
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

              {/* ===== ARTICLE BODY ===== */}
              <article className="prose prose-lg max-w-none">
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-2xl md:text-3xl font-bold mt-12 md:mt-16 mb-6 text-[var(--text-article-title)]">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => {
                      const text = String(children);
                      const id = getUniqueId(text);
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
                      const id = getUniqueId(text);
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
                      <code className="px-1.5 py-0.5 rounded text-sm font-mono bg-[var(--bg-article-tag)] text-[var(--brand-primary)]">
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
                    img: ({ src, alt }) => (
                      <figure className="my-10 md:my-12 -mx-4 md:mx-0">
                        <img
                          src={src}
                          alt={alt}
                          className="w-full h-auto md:rounded-lg"
                        />
                        {alt && (
                          <figcaption className="mt-3 px-4 md:px-0 text-sm text-[var(--text-article-muted)] italic text-center">
                            {alt}
                          </figcaption>
                        )}
                      </figure>
                    ),
                  }}
                >
                  {article.content}
                </ReactMarkdown>
              </article>

              {/* ===== QUIZ SECTION ===== */}
              {article.quizData && (
                <div className="mt-12 md:mt-16">
                  <QuizComponent
                    title="Teste seu conhecimento"
                    questions={typeof article.quizData === 'string' ? JSON.parse(article.quizData) : article.quizData}
                  />
                </div>
              )}

              {/* ===== TAGS ===== */}
              <div className="mt-12 md:mt-16 pt-8 border-t border-[var(--border-article)]">
                <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-article-muted)] mb-4">
                  Tópicos relacionados
                </h3>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-full text-sm bg-[var(--bg-article-tag)] text-[var(--text-article-muted)]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* ===== TRANSPARENCY NOTE ===== */}
              <div className="mt-12 pt-8 border-t border-[var(--border-article)]">
                <TransparencyNote publishedAt={article.publishedAt} />
              </div>

              {/* ===== RELATED ARTICLES ===== */}
              {relatedArticles.length > 0 && (
                <div className="mt-16 md:mt-20 pt-10 border-t border-[var(--border-article)]">
                  <h3 className="text-xl md:text-2xl font-bold text-[var(--text-article-title)] mb-8">
                    Continue aprendendo
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {relatedArticles.slice(0, 4).map((related) => (
                      <Link
                        key={related.id}
                        href={`/educacao/${related.slug}`}
                        className="group block p-5 rounded-xl border border-[var(--border-article)] hover:border-[var(--brand-primary)]/50 transition-all hover:shadow-lg"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: getLevelColor(related.level) }}
                          />
                          <span className="text-xs text-[var(--text-article-muted)]">
                            {related.category}
                          </span>
                        </div>
                        <h4 className="text-base md:text-lg font-semibold mb-2 text-[var(--text-article-title)] group-hover:text-[var(--brand-primary)] transition-colors line-clamp-2">
                          {related.title}
                        </h4>
                        <p className="text-sm text-[var(--text-article-muted)] line-clamp-2">
                          {related.description}
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
    </>
  );
}
