'use client';

import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowUp, faClock, faCalendar, faUser, faShareNodes } from '@fortawesome/free-solid-svg-icons';
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
  factCheckSources?: string; // JSON array de URLs
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
    const usedIds = new Set<string>();

    lines.forEach((line) => {
      const h2Match = line.match(/^## (.+)$/);
      const h3Match = line.match(/^### (.+)$/);

      if (h2Match || h3Match) {
        const text = (h2Match ? h2Match[1] : h3Match![1]).trim();
        const level = h2Match ? 2 : 3;
        let id = slugify(text);

        // Ensure uniqueness matching renderer logic
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
      <div className="relative pt-6 pb-4 md:pt-12 md:pb-8 overflow-hidden">
        {/* Background Glow Effect - Dark Mode Only */}
        <div className="absolute top-0 left-0 w-full max-w-4xl h-full opacity-30 pointer-events-none hidden dark:block"
          style={{
            background: `radial-gradient(circle at 20% 30%, ${getLevelColor(article.level)}40 0%, transparent 70%)`,
            WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 20%)',
            maskImage: 'linear-gradient(to bottom, transparent, black 20%)'
          }}
        />

        <div className="container mx-auto px-6 md:px-10 relative z-10">
          <div className="max-w-6xl">

            {/* Meta Badges + Share Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center gap-2">
                  <span className="text-[10px] font-bold text-zinc-700 dark:text-white/90 uppercase tracking-wider drop-shadow-md">
                    Nível
                  </span>
                  <div className="w-1 h-1 rounded-full bg-zinc-700/50 dark:bg-white/50 shadow-sm" />
                  <span className="text-sm font-extrabold uppercase tracking-wide drop-shadow-md" style={{ color: getLevelColor(article.level) }}>
                    {getLevelLabel(article.level)}
                  </span>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[var(--bg-article-tag)] text-[var(--text-article-muted)] border border-[var(--border-article)]">
                  {article.category}
                </span>
              </div>

              {/* Share Buttons (Header) */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(article.title + ' ' + currentUrl)}`, '_blank')}
                  className="text-[var(--text-article-muted)] hover:text-[#25D366] transition-all hover:scale-110"
                  title="Compartilhar no WhatsApp"
                >
                  <FontAwesomeIcon icon={faWhatsapp} className="w-6 h-6" />
                </button>
                <button
                  onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(article.title)}`, '_blank')}
                  className="text-[var(--text-article-muted)] hover:text-[#0088cc] transition-all hover:scale-110"
                  title="Compartilhar no Telegram"
                >
                  <FontAwesomeIcon icon={faTelegram} className="w-6 h-6" />
                </button>
                <button
                  onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(currentUrl)}`, '_blank')}
                  className="text-[var(--text-article-muted)] hover:text-black dark:hover:text-white transition-all hover:scale-110"
                  title="Compartilhar no X (Twitter)"
                >
                  <FontAwesomeIcon icon={faXTwitter} className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 font-[family-name:var(--font-poppins)] text-[var(--text-article-title)]">
              {article.title}
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl leading-relaxed text-[var(--text-article-body)] opacity-90 max-w-2xl">
              {article.description}
            </p>

            {/* Author & Date */}
            <div className="mt-8 flex items-center gap-6 text-sm text-[var(--text-article-muted)]">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faCalendar} className="w-3 h-3" />
                <span>{new Date(article.publishedAt).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faClock} className="w-3 h-3" />
                <span>{article.readTime}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 pt-2 pb-8 lg:pt-4 lg:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Coluna Principal (Artigo) */}
          <div className="lg:col-span-8 space-y-8">

            {/* Card Principal do Artigo - Novo Template Glassmorphism */}
            <div className="overflow-hidden bg-transparent backdrop-blur-2xl lg:rounded-2xl lg:border border-[var(--border-light)]/50 p-4 lg:p-10">

              <div className="py-4 space-y-8">

                {/* Conteúdo Markdown */}
                <article className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-[family-name:var(--font-poppins)] prose-a:text-[var(--brand-primary)] prose-img:rounded-xl prose-img:shadow-lg">
                  <ReactMarkdown
                    components={{
                      h1: ({ children }) => <h1 className="text-3xl font-bold mt-10 mb-6 text-[var(--text-article-title)]">{children}</h1>,
                      h2: ({ children }) => {
                        const text = String(children);
                        const id = getUniqueId(text);
                        return <h2 id={id} className="text-2xl font-bold mt-10 mb-5 text-[var(--text-article-title)] scroll-mt-32 border-b border-[var(--border-article)] pb-2">{children}</h2>;
                      },
                      h3: ({ children }) => {
                        const text = String(children);
                        const id = getUniqueId(text);
                        return <h3 id={id} className="text-xl font-bold mt-8 mb-4 text-[var(--text-article-title)] scroll-mt-32">{children}</h3>;
                      },
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

                {/* Quiz Section */}
                {article.quizData && (
                  <div className="mt-8 mb-8">
                    <QuizComponent
                      title="Quiz"
                      questions={typeof article.quizData === 'string' ? JSON.parse(article.quizData) : article.quizData}
                    />
                  </div>
                )}

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

                <div className="h-px bg-[var(--border-article)] mt-8" />

                {/* Nota de Transparência */}
                <TransparencyNote publishedAt={article.publishedAt} />



              </div>
            </div>



            {/* Artigos Relacionados */}
            {relatedArticles.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-[var(--text-article-title)] pl-2 border-l-4 border-[var(--brand-primary)]">
                  Artigos Relacionados
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {relatedArticles.slice(0, 4).map((related) => (
                    <Link
                      key={related.id}
                      href={`/educacao/${related.slug}`}
                      className="glass-card group p-5 rounded-2xl border border-[var(--border-article)] lg:hover:border-[var(--brand-primary)]/50 transition-all lg:hover:-translate-y-1 lg:hover:shadow-xl block"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: getLevelColor(related.level) }}></span>
                        <span className="text-xs text-[var(--text-article-muted)]">
                          {related.category}
                        </span>
                      </div>
                      <h4 className="text-lg font-bold mb-2 text-[var(--text-article-title)] lg:group-hover:text-[var(--brand-primary)] transition-colors line-clamp-2">
                        {related.title}
                      </h4>
                      <p className="text-sm text-[var(--text-article-body)] line-clamp-2">
                        {related.description}
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
                onClick={() => router.push('/educacao')}
                className="flex items-center gap-2 text-[var(--text-article-muted)] hover:text-[var(--brand-primary)] transition-colors font-medium mb-2 group"
              >
                <div className="w-8 h-8 rounded-full bg-[var(--bg-article-tag)] flex items-center justify-center group-hover:bg-[var(--brand-primary)] group-hover:text-white transition-all">
                  <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4" />
                </div>
                Voltar para Educação
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
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(currentUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-w-[100px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all bg-black/5 hover:bg-black/10 border border-black/10 text-black dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/10 dark:text-white hover:scale-105 active:scale-95 text-sm"
                  >
                    <FontAwesomeIcon icon={faXTwitter} className="w-4 h-4" />
                    X
                  </a>
                  <a
                    href={`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(article.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-w-[100px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all bg-[#0088cc]/10 hover:bg-[#0088cc]/20 border border-[#0088cc]/20 text-[#0088cc] hover:scale-105 active:scale-95 text-sm"
                  >
                    <FontAwesomeIcon icon={faTelegram} className="w-4 h-4" />
                    Telegram
                  </a>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(article.title + ' ' + currentUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-w-[100px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/20 text-[#25D366] hover:scale-105 active:scale-95 text-sm"
                  >
                    <FontAwesomeIcon icon={faWhatsapp} className="w-4 h-4" />
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
