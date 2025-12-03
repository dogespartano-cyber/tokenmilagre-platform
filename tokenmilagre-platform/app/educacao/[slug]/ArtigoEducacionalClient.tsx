'use client';

import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowUp, faClock, faCalendarAlt, faUser } from '@fortawesome/free-solid-svg-icons';
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

  // Custom color scheme for article detail page
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

  // Define URL atual
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }
  }, []);

  // Calcula progresso de leitura
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
      setReadingProgress(Math.min(scrollPercent, 100));

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

  // Artigo não encontrado
  if (!article) {
    return (
      <div className="py-20 container mx-auto px-4 text-center">
        <div className="glass-card max-w-2xl mx-auto p-12 rounded-3xl border border-[var(--border-article)]">
          <div className="text-6xl mb-6">📚</div>
          <h1 className="text-3xl font-bold mb-4 text-[var(--text-article-title)]">
            Artigo não encontrado
          </h1>
          <p className="mb-8 text-[var(--text-article-body)] text-lg">
            O conteúdo que você procura não está disponível no momento.
          </p>
          <button
            onClick={() => router.push('/educacao')}
            className="px-8 py-3 rounded-xl font-bold transition-all hover:scale-105 bg-[var(--brand-primary)] text-white shadow-lg shadow-[var(--brand-primary)]/20"
          >
            Voltar para Educação
          </button>
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
          backgroundColor: 'var(--brand-primary)',
          boxShadow: '0 0 10px var(--brand-primary)'
        }}
      />

      <div className="pb-20">
        {/* Hero Section - Left Aligned & Editorial Style */}
        <div className="relative pt-12 pb-16 overflow-hidden">


          <div className="container mx-auto px-6 md:px-10 relative z-10">
            <div className="max-w-6xl">


              {/* Meta Badges */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span
                  className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-sm"
                  style={{ backgroundColor: getLevelColor(article.level) }}
                >
                  {getLevelLabel(article.level)}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[var(--bg-article-tag)] text-[var(--text-article-muted)] border border-[var(--border-article)]">
                  {article.category}
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-[var(--text-article-muted)]">
                  <FontAwesomeIcon icon={faClock} className="w-3 h-3" />
                  {article.readTime}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 font-[family-name:var(--font-poppins)] text-[var(--text-article-title)]">
                {article.title}
              </h1>

              {/* Description */}
              <p className="text-xl md:text-2xl leading-relaxed text-[var(--text-article-body)] opacity-90 max-w-2xl">
                {article.description}
              </p>

              {/* Author & Date */}
              <div className="mt-8 flex items-center gap-6 text-sm text-[var(--text-article-muted)]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[var(--bg-article-tag)] flex items-center justify-center">
                    <FontAwesomeIcon icon={faUser} className="w-3 h-3" />
                  </div>
                  <span className="font-medium">Equipe $MILAGRE</span>
                </div>
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faCalendarAlt} className="w-3 h-3" />
                  <span>{new Date(article.publishedAt).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12 max-w-6xl">

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <div className="glass-card rounded-3xl p-8 md:p-12 border border-[var(--border-article)] shadow-xl backdrop-blur-xl">
                <article className="prose prose-lg max-w-none 
                  prose-headings:font-[family-name:var(--font-poppins)] prose-headings:text-[var(--text-article-title)] 
                  prose-p:text-[var(--text-article-body)] prose-p:leading-8
                  prose-strong:text-[var(--text-article-title)] 
                  prose-ul:text-[var(--text-article-body)] prose-ol:text-[var(--text-article-body)] 
                  prose-li:text-[var(--text-article-body)]
                  prose-a:text-[var(--brand-primary)] prose-a:no-underline hover:prose-a:underline
                  prose-blockquote:border-l-4 prose-blockquote:border-[var(--brand-primary)] prose-blockquote:bg-[var(--bg-article-tag)] prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-blockquote:text-[var(--text-article-body)]
                  prose-code:text-[var(--brand-primary)] prose-code:bg-[var(--bg-article-tag)] prose-code:px-2 prose-code:py-1 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none"
                >
                  <ReactMarkdown
                    components={{
                      h2: ({ children }) => {
                        const text = String(children);
                        const id = slugify(text);
                        return (
                          <h2 id={id} className="scroll-mt-32 text-3xl font-bold mt-12 mb-6 pb-4 border-b border-[var(--border-article)]">
                            {children}
                          </h2>
                        );
                      },
                      h3: ({ children }) => {
                        const text = String(children);
                        const id = slugify(text);
                        return (
                          <h3 id={id} className="scroll-mt-32 text-2xl font-bold mt-8 mb-4">
                            {children}
                          </h3>
                        );
                      },
                      img: ({ src, alt }) => (
                        <div className="my-8 rounded-2xl overflow-hidden border border-[var(--border-article)] shadow-lg">
                          <img src={src} alt={alt} className="w-full h-auto object-cover" />
                          {alt && <p className="text-center text-sm text-[var(--text-article-muted)] mt-2 italic">{alt}</p>}
                        </div>
                      )
                    }}
                  >
                    {article.content}
                  </ReactMarkdown>
                </article>

                {/* Tags Footer */}
                <div className="mt-12 pt-8 border-t border-[var(--border-article)]">
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-4 py-1.5 rounded-full text-sm font-medium bg-[var(--bg-article-tag)] text-[var(--text-article-muted)] hover:text-[var(--brand-primary)] transition-colors cursor-default"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Share Section */}
              <div className="mt-8 glass-card rounded-2xl p-8 border border-[var(--border-article)] text-center">
                <h3 className="text-xl font-bold mb-6 text-[var(--text-article-title)]">
                  Gostou deste artigo? Compartilhe!
                </h3>
                <div className="flex justify-center gap-4">
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(currentUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg bg-black text-white"
                    aria-label="Compartilhar no Twitter"
                  >
                    <FontAwesomeIcon icon={faXTwitter} className="w-5 h-5" />
                  </a>
                  <a
                    href={`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(article.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg bg-[#0088cc] text-white"
                    aria-label="Compartilhar no Telegram"
                  >
                    <FontAwesomeIcon icon={faTelegram} className="w-5 h-5" />
                  </a>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(article.title + ' ' + currentUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg bg-[#25D366] text-white"
                    aria-label="Compartilhar no WhatsApp"
                  >
                    <FontAwesomeIcon icon={faWhatsapp} className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Sidebar (Table of Contents & Related) */}
            <div className="lg:w-80 flex-shrink-0 space-y-8">
              {/* Voltar para Educação (Moved from Hero) */}
              <div>
                <Link
                  href="/educacao"
                  className="inline-flex items-center gap-2 text-sm font-medium transition-colors text-[var(--text-article-muted)] hover:text-[var(--brand-primary)]"
                >
                  <FontAwesomeIcon icon={faArrowLeft} className="w-3 h-3" />
                  Voltar para Educação
                </Link>
              </div>

              {/* Table of Contents */}
              {tableOfContents.length > 0 && (
                <div className="sticky top-24">
                  <div className="glass-card rounded-2xl p-6 border border-[var(--border-article)] shadow-lg">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-article-muted)] mb-4 pb-2 border-b border-[var(--border-article)]">
                      Índice
                    </h3>
                    <nav className="space-y-1 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                      {tableOfContents.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => scrollToSection(item.id)}
                          className={`block w-full text-left text-sm py-2 px-3 rounded-lg transition-all duration-300 ${activeSection === item.id
                            ? 'font-semibold bg-[var(--bg-article-tag)] text-[var(--brand-primary)] translate-x-1'
                            : 'hover:bg-[var(--bg-article-tag)]/50 text-[var(--text-article-body)] hover:text-[var(--text-article-title)]'
                            }`}
                        >
                          {item.text}
                        </button>
                      ))}
                    </nav>
                  </div>
                </div>
              )}

              {/* Related Articles */}
              {relatedArticles.length > 0 && (
                <div className="glass-card rounded-2xl p-6 border border-[var(--border-article)]">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-article-muted)] mb-4">
                    Relacionados
                  </h3>
                  <div className="space-y-4">
                    {relatedArticles.map((related) => (
                      <Link
                        key={related.id}
                        href={`/educacao/${related.slug}`}
                        className="block group"
                      >
                        <div className="p-3 rounded-xl transition-all hover:bg-[var(--bg-article-tag)]">
                          <h4 className="font-bold text-sm mb-1 text-[var(--text-article-title)] group-hover:text-[var(--brand-primary)] transition-colors line-clamp-2">
                            {related.title}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-[var(--text-article-muted)]">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: getLevelColor(related.level) }}></span>
                            <span>{related.readTime}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
