'use client';

import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { useEffect, useState } from 'react';
import Breadcrumbs from '@/components/Breadcrumbs';
import Link from 'next/link';

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
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [tableOfContents, setTableOfContents] = useState<TableOfContentsItem[]>([]);
  const [activeSection, setActiveSection] = useState<string>('');
  const [currentUrl, setCurrentUrl] = useState<string>('');

  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'iniciante': return 'Iniciante';
      case 'intermediario': return 'Intermediário';
      case 'avancado': return 'Avançado';
      default: return level;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'iniciante': return '#22c55e';
      case 'intermediario': return '#3b82f6';
      case 'avancado': return '#a855f7';
      default: return 'var(--brand-primary)';
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
          id: createSlug(text),
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
    handleScroll(); // Call once to set initial state
    return () => window.removeEventListener('scroll', handleScroll);
  }, [tableOfContents]);

  // Artigo não encontrado
  if (!article) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <Breadcrumbs />
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📚</div>
            <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              Artigo não encontrado
            </h1>
            <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>
              O artigo que você procura não existe ou foi removido.
            </p>
            <button
              onClick={() => router.push('/educacao')}
              className="px-6 py-3 rounded-lg font-semibold transition-all hover:opacity-90"
              style={{
                backgroundColor: 'var(--brand-primary)',
                color: 'var(--text-inverse)'
              }}
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

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          <div className="flex-1 space-y-8">
            {/* Breadcrumbs */}
            <Breadcrumbs />

          {/* Voltar */}
          <button
            onClick={() => router.push('/educacao')}
            className="inline-flex items-center gap-2 text-sm font-semibold transition-colors hover:opacity-80"
            style={{ color: 'var(--brand-primary)' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar para Educação
          </button>

          {/* Header do Artigo */}
          <div className="space-y-6">
            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-3">
              <span
                className="px-3 py-1 rounded-lg text-sm font-semibold"
                style={{
                  backgroundColor: getLevelColor(article.level),
                  color: 'white'
                }}
              >
                {getLevelLabel(article.level)}
              </span>
              <span
                className="px-3 py-1 rounded-lg text-sm font-semibold"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-primary)'
                }}
              >
                {article.type}
              </span>
              <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                📖 {article.readTime} de leitura
              </span>
            </div>

            {/* Título */}
            <h1 className="text-4xl md:text-5xl font-bold leading-tight font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
              {article.title}
            </h1>

            {/* Descrição */}
            <p className="text-xl leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {article.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-lg text-sm"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-tertiary)'
                  }}
                >
                  #{tag}
                </span>
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
                p: ({ children }) => (
                  <p className="mb-4 leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                    {children}
                  </p>
                ),
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
                li: ({ children }) => (
                  <li className="ml-4" style={{ color: 'var(--text-primary)' }}>
                    {children}
                  </li>
                ),
                strong: ({ children }) => (
                  <strong className="font-bold" style={{ color: 'var(--text-primary)' }}>
                    {children}
                  </strong>
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
              }}
            >
              {article.content}
            </ReactMarkdown>
          </article>

          {/* Divider */}
          <div className="border-t" style={{ borderColor: 'var(--border-light)' }}></div>

          {/* Compartilhar */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
              Compartilhe este artigo
            </h3>
            <div className="flex flex-wrap gap-3">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(currentUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all hover:opacity-80"
                style={{ backgroundColor: '#1DA1F2', color: 'white' }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                Twitter
              </a>
              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(article.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all hover:opacity-80"
                style={{ backgroundColor: '#0088cc', color: 'white' }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12s12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21l-1.446 1.394c-.14.18-.357.295-.6.295c-.002 0-.003 0-.005 0l.213-3.054l5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326l-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
                </svg>
                Telegram
              </a>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(article.title + ' ' + currentUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all hover:opacity-80"
                style={{ backgroundColor: '#25D366', color: 'white' }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </a>
            </div>
          </div>

          {/* Artigos Relacionados */}
          {relatedArticles.length > 0 && (
            <>
              <div className="border-t" style={{ borderColor: 'var(--border-light)' }}></div>
              <div className="space-y-6">
                <h3 className="text-2xl font-bold font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
                  Artigos Relacionados
                </h3>
                <div className="grid gap-4">
                  {relatedArticles.map((related) => (
                    <Link
                      key={related.id}
                      href={`/educacao/${related.slug}`}
                      className="p-4 rounded-xl border transition-all hover:shadow-lg"
                      style={{
                        backgroundColor: 'var(--bg-secondary)',
                        borderColor: 'var(--border-light)'
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span
                              className="px-2 py-0.5 rounded text-xs font-semibold"
                              style={{
                                backgroundColor: getLevelColor(related.level),
                                color: 'white'
                              }}
                            >
                              {getLevelLabel(related.level)}
                            </span>
                            <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                              📖 {related.readTime}
                            </span>
                          </div>
                          <h4 className="font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                            {related.title}
                          </h4>
                          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
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
              <div className="sticky top-24 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wide" style={{ color: 'var(--text-tertiary)' }}>
                  Neste Artigo
                </h3>
                <nav className="space-y-1">
                  {tableOfContents.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`block w-full text-left text-sm py-2 px-3 rounded transition-all ${
                        activeSection === item.id
                          ? 'font-semibold'
                          : 'hover:opacity-80'
                      }`}
                      style={{
                        backgroundColor: activeSection === item.id ? 'var(--bg-secondary)' : 'transparent',
                        color: activeSection === item.id ? 'var(--brand-primary)' : 'var(--text-secondary)',
                        borderLeft: activeSection === item.id ? '3px solid var(--brand-primary)' : '3px solid transparent'
                      }}
                    >
                      {item.text}
                    </button>
                  ))}
                </nav>
              </div>
            </aside>
          )}
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
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        )}
      </div>
    </>
  );
}
