'use client';

import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { useEffect, useState } from 'react';
import type React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowUp, faCalendar, faGraduationCap, faClock } from '@fortawesome/free-solid-svg-icons';
import { faXTwitter, faTelegram, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { getCitationAwareMarkdownComponents, SourcesSection } from '@/lib/citations-processor';

interface EducationalContent {
  id: string;
  slug?: string;
  title: string;
  summary: string;
  content?: string;
  url: string;
  category: string[];
  keywords: string[];
  level: 'iniciante' | 'intermediario' | 'avancado';
  contentType: string;
  readTime: string;
  publishedAt: string;
  lastVerified?: string;
  citations?: string[];
  coverImage?: string;
  coverImageAlt?: string;
}

interface EducacaoClientProps {
  article: EducationalContent | null;
  relatedArticles?: EducationalContent[];
}

interface TableOfContentsItem {
  id: string;
  text: string;
}

export default function EducacaoClient({ article, relatedArticles = [] }: EducacaoClientProps) {
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

  const removeH1FromContent = (content: string): string => {
    const h1Regex = /^#\s+.+?\n+/;
    return content.replace(h1Regex, '').trim();
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

  // Calcula progresso de leitura
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

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'iniciante': return '#22c55e';
      case 'intermediario': return '#eab308';
      case 'avancado': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'iniciante': return 'Iniciante';
      case 'intermediario': return 'Intermediário';
      case 'avancado': return 'Avançado';
      default: return 'Nível não definido';
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
      <div className="py-8 max-w-4xl" style={{ paddingLeft: '55px', paddingRight: '1rem' }}>
        <div className="space-y-8">
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

  const cleanContent = removeH1FromContent(article.content || '');
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
              onClick={() => router.push('/educacao')}
              className="inline-flex items-center gap-2 text-sm font-semibold transition-colors hover:opacity-80"
              style={{ color: 'var(--brand-primary)' }}
            >
              <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4" />
              Voltar para Educação
            </button>

            {/* Imagem de Capa */}
            {article.coverImage && (
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <img
                  src={article.coverImage}
                  alt={article.coverImageAlt || article.title}
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
                    backgroundColor: getLevelColor(article.level),
                    color: 'white'
                  }}
                >
                  <FontAwesomeIcon icon={faGraduationCap} className="w-4 h-4 mr-1" />
                  {getLevelLabel(article.level)}
                </span>
                <span
                  className="px-3 py-1 rounded-lg text-sm font-semibold"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-primary)'
                  }}
                >
                  {article.contentType}
                </span>
                <span className="text-sm flex items-center gap-1" style={{ color: 'var(--text-tertiary)' }}>
                  <FontAwesomeIcon icon={faClock} className="w-4 h-4" />
                  {article.readTime} de leitura
                </span>
              </div>

              {/* Título */}
              <h1 className="text-4xl md:text-5xl font-bold leading-tight font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
                {article.title}
              </h1>

              {/* Resumo */}
              <p className="text-xl leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {article.summary}
              </p>

              {/* Keywords/Tags */}
              <div className="flex flex-wrap gap-2">
                {article.keywords.map((keyword, idx) => (
                  <button
                    key={idx}
                    onClick={() => router.push(`/educacao?search=${encodeURIComponent(keyword)}`)}
                    className="px-3 py-1 rounded-lg text-sm transition-all hover:opacity-80 cursor-pointer"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      color: 'var(--text-tertiary)'
                    }}
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
              style={{ color: 'var(--text-primary)' }}
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

            {/* Compartilhar */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
                Compartilhe este artigo
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
                    Artigos Relacionados
                  </h3>
                  <div className="grid gap-4">
                    {relatedArticles.slice(0, 3).map((related) => (
                      <Link
                        key={related.id}
                        href={`/educacao/${related.slug || related.id}`}
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
                              backgroundColor: getLevelColor(related.level),
                              color: 'white'
                            }}
                          >
                            {getLevelLabel(related.level)}
                          </span>
                          <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                            {related.readTime}
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
                          wordBreak: 'break-word'
                        }}
                      >
                        {item.text}
                      </button>
                    ))}
                  </nav>
                </div>
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
        >
          <FontAwesomeIcon icon={faArrowUp} className="w-5 h-5" />
        </button>
      )}
    </>
  );
}
