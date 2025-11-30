'use client';

import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { faXTwitter, faTelegram, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { getLevelLabel } from '@/lib/utils/level-helpers';
import { slugify } from '@/lib/utils/content-helpers';

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
  factCheckSources?: string; // JSON array de URLs
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
  const [readingProgress, setReadingProgress] = useState(0);

  const [tableOfContents, setTableOfContents] = useState<TableOfContentsItem[]>([]);
  const [activeSection, setActiveSection] = useState<string>('');
  const [currentUrl, setCurrentUrl] = useState<string>('');

  // Custom color scheme for article detail page (different from education listing)
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

  // Extrai headings do conteúdo para criar índice (apenas H2 para manter compacto)
  useEffect(() => {
    if (!article) return;

    const headings: TableOfContentsItem[] = [];
    const lines = article.content.split('\n');

    lines.forEach((line) => {
      const h2Match = line.match(/^## (.+)$/);

      if (h2Match) {
        const text = h2Match[1].trim();
        headings.push({
          id: slugify(text),
          text,
          level: 2
        });
      }
    });

    setTableOfContents(headings);
  }, [article]);

  // Define URL atual (apenas no cliente)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }
  }, []);

  // Calcula progresso de leitura e rastreia seção ativa
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
      setReadingProgress(Math.min(scrollPercent, 100));


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
  }, [tableOfContents]);

  // Artigo não encontrado
  if (!article) {
    return (
      <div className="py-8 max-w-4xl mx-auto px-4">
        <div className="space-y-8">
          <div className="text-center py-20 glass-card rounded-2xl p-8 border border-[var(--border-article)]">
            <div className="text-6xl mb-4">📚</div>
            <h1 className="text-3xl font-bold mb-4 text-[var(--text-article-title)]">
              Artigo não encontrado
            </h1>
            <p className="mb-8 text-[var(--text-article-body)]">
              O artigo que você procura não existe ou foi removido.
            </p>
            <button
              onClick={() => router.push('/educacao')}
              className="px-6 py-3 rounded-lg font-semibold transition-all hover:opacity-90 bg-[var(--brand-primary)] text-white"
            >
              ← Voltar para Educação
            </button>
          </div>
        </div>
      </div>
    );
  }

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

      <div className="py-8 container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 max-w-4xl space-y-8">
            {/* Voltar */}


            {/* Header do Artigo */}
            <div className="glass-card rounded-2xl p-8 border border-[var(--border-article)] space-y-6">
              {/* Meta info */}
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className="px-3 py-1 rounded-lg text-sm font-semibold text-white"
                  style={{
                    backgroundColor: getLevelColor(article.level),
                  }}
                >
                  {getLevelLabel(article.level)}
                </span>
                <span
                  className="px-3 py-1 rounded-lg text-sm font-semibold bg-[var(--bg-article-tag)] text-[var(--text-article-muted)]"
                >
                  {article.type}
                </span>
                <span className="text-sm text-[var(--text-article-muted)]">
                  📖 {article.readTime} de leitura
                </span>
              </div>

              {/* Título */}
              <h1 className="text-4xl md:text-5xl font-bold leading-tight font-[family-name:var(--font-poppins)] text-[var(--text-article-title)]">
                {article.title}
              </h1>

              {/* Descrição */}
              <p className="text-xl leading-relaxed text-[var(--text-article-body)]">
                {article.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-lg text-sm bg-[var(--bg-article-tag)] text-[var(--text-article-muted)]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Conteúdo do Artigo */}
            <div className="glass-card rounded-2xl p-8 border border-[var(--border-article)]">
              <article
                className="prose prose-lg max-w-none prose-headings:text-[var(--text-article-title)] prose-p:text-[var(--text-article-body)] prose-strong:text-[var(--text-article-title)] prose-ul:text-[var(--text-article-body)] prose-ol:text-[var(--text-article-body)] prose-li:text-[var(--text-article-body)]"
              >
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-3xl font-bold mt-8 mb-4 font-[family-name:var(--font-poppins)] text-[var(--text-article-title)]">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => {
                      const text = String(children);
                      const id = slugify(text);
                      return (
                        <h2 id={id} className="text-2xl font-bold mt-8 mb-4 font-[family-name:var(--font-poppins)] scroll-mt-24 text-[var(--text-article-title)]">
                          {children}
                        </h2>
                      );
                    },
                    h3: ({ children }) => {
                      const text = String(children);
                      const id = slugify(text);
                      return (
                        <h3 id={id} className="text-xl font-bold mt-6 mb-3 font-[family-name:var(--font-poppins)] scroll-mt-24 text-[var(--text-article-title)]">
                          {children}
                        </h3>
                      );
                    },
                    p: ({ children }) => (
                      <p className="mb-4 leading-relaxed text-[var(--text-article-body)]">
                        {children}
                      </p>
                    ),
                    ul: ({ children }) => (
                      <ul className="mb-4 space-y-2 list-disc list-inside text-[var(--text-article-body)]">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="mb-4 space-y-2 list-decimal list-inside text-[var(--text-article-body)]">
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => (
                      <li className="ml-4 text-[var(--text-article-body)]">
                        {children}
                      </li>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-bold text-[var(--text-article-title)]">
                        {children}
                      </strong>
                    ),
                    code: ({ children }) => (
                      <code
                        className="px-2 py-1 rounded text-sm font-mono bg-[var(--bg-article-tag)] text-[var(--brand-primary)]"
                      >
                        {children}
                      </code>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote
                        className="pl-4 border-l-4 italic my-4 border-[var(--brand-primary)] text-[var(--text-article-muted)]"
                      >
                        {children}
                      </blockquote>
                    ),
                  }}
                >
                  {article.content}
                </ReactMarkdown>
              </article>

              {/* Fontes e Referências */}
              {article.factCheckSources && (() => {
                try {
                  const sources: string[] = JSON.parse(article.factCheckSources);
                  if (sources.length > 0) {
                    return (
                      <>
                        <div className="border-t border-[var(--border-article)] my-8"></div>
                        <div className="space-y-4">
                          <h3 className="text-xl font-bold font-[family-name:var(--font-poppins)] text-[var(--text-article-title)]">
                            📚 Fontes e Referências
                          </h3>
                          <ol className="space-y-2">
                            {sources.map((url, index) => {
                              try {
                                const domain = new URL(url).hostname.replace(/^www\./, '');
                                return (
                                  <li key={index} className="text-sm flex gap-2">
                                    <span className="font-semibold text-[var(--brand-primary)]">
                                      [{index + 1}]
                                    </span>
                                    <a
                                      href={url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="hover:underline text-[var(--text-article-muted)]"
                                    >
                                      {domain}
                                    </a>
                                  </li>
                                );
                              } catch {
                                return (
                                  <li key={index} className="text-sm flex gap-2">
                                    <span className="font-semibold text-[var(--brand-primary)]">
                                      [{index + 1}]
                                    </span>
                                    <a
                                      href={url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="hover:underline text-[var(--text-article-muted)]"
                                    >
                                      {url}
                                    </a>
                                  </li>
                                );
                              }
                            })}
                          </ol>
                        </div>
                      </>
                    );
                  }
                } catch (err) {
                  console.error('Error parsing factCheckSources:', err);
                }
                return null;
              })()}

              {/* Divider */}
              <div className="border-t border-[var(--border-article)] my-8"></div>

              {/* Compartilhar */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold font-[family-name:var(--font-poppins)] text-[var(--text-article-title)]">
                  Compartilhe este artigo
                </h3>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(currentUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all hover:opacity-80 bg-[#1DA1F2] text-white"
                  >
                    <FontAwesomeIcon icon={faXTwitter} className="w-5 h-5" />
                    Twitter
                  </a>
                  <a
                    href={`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(article.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all hover:opacity-80 bg-[#0088cc] text-white"
                  >
                    <FontAwesomeIcon icon={faTelegram} className="w-5 h-5" />
                    Telegram
                  </a>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(article.title + ' ' + currentUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all hover:opacity-80 bg-[#25D366] text-white"
                  >
                    <FontAwesomeIcon icon={faWhatsapp} className="w-5 h-5" />
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>

            {/* Artigos Relacionados */}
            {relatedArticles.length > 0 && (
              <>
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold font-[family-name:var(--font-poppins)] text-[var(--text-article-title)]">
                    Artigos Relacionados
                  </h3>
                  <div className="grid gap-4">
                    {relatedArticles.map((related) => (
                      <Link
                        key={related.id}
                        href={`/educacao/${related.slug}`}
                        className="glass-card p-4 rounded-xl border border-[var(--border-article)] transition-all hover:shadow-lg hover:border-[var(--brand-primary)]/50"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span
                                className="px-2 py-0.5 rounded text-xs font-semibold text-white"
                                style={{
                                  backgroundColor: getLevelColor(related.level),
                                }}
                              >
                                {getLevelLabel(related.level)}
                              </span>
                              <span className="text-xs text-[var(--text-article-muted)]">
                                📖 {related.readTime}
                              </span>
                            </div>
                            <h4 className="font-bold mb-1 text-[var(--text-article-title)]">
                              {related.title}
                            </h4>
                            <p className="text-sm text-[var(--text-article-body)]">
                              {related.description}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Índice Lateral (Table of Contents) */}
          {tableOfContents.length > 0 && (
            <aside className="hidden xl:block w-64 flex-shrink-0">
              <div className="sticky top-24 space-y-4 glass-card p-6 rounded-2xl border border-[var(--border-article)]">
                <h3 className="text-sm font-bold uppercase tracking-wide text-[var(--text-article-muted)]">
                  Neste Artigo
                </h3>
                <nav className="space-y-1">
                  {tableOfContents.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`block w-full text-left text-sm py-2 px-3 rounded transition-all ${activeSection === item.id
                        ? 'font-semibold bg-[var(--bg-article-tag)] text-[var(--brand-primary)] border-l-4 border-[var(--brand-primary)]'
                        : 'hover:opacity-80 text-[var(--text-article-body)] border-l-4 border-transparent'
                        }`}
                    >
                      {item.text}
                    </button>
                  ))}
                </nav>
              </div>
            </aside>
          )}
        </div>
      </div>
    </>
  );
}
