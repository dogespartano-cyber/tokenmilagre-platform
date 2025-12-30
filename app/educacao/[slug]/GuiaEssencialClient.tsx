'use client';

import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useMemo, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, CheckCircle2, Shield, BookOpen } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp, faTelegram, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import { slugify } from '@/lib/shared/utils/content-helpers';
import { GUIA_ESSENCIAL_TRILHA } from '@/lib/education/guia-essencial';
import { useSidebar } from '@/contexts/SidebarContext';
import LikeDislikeButton from '@/components/shared/LikeDislikeButton';
import CommentCountButton from '@/components/engagement/CommentCountButton';
import CommentsSection from '@/components/engagement/CommentsSection';

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

interface GuiaEssencialClientProps {
  article: EducationalArticle;
}

interface TableOfContentsItem {
  id: string;
  text: string;
  level: number;
}

export default function GuiaEssencialClient({ article }: GuiaEssencialClientProps) {
  const [readingProgress, setReadingProgress] = useState(0);
  const [tableOfContents, setTableOfContents] = useState<TableOfContentsItem[]>([]);
  const [activeSection, setActiveSection] = useState<string>('');
  const [showComments, setShowComments] = useState(false);

  const { setSidebarMode, resetSidebar, setDynamicTitle, setShortTitle } = useSidebar();

  // Encontrar posição atual na trilha
  const currentIndex = GUIA_ESSENCIAL_TRILHA.findIndex(t => t.slug === article.slug);
  const prevArticle = currentIndex > 0 ? GUIA_ESSENCIAL_TRILHA[currentIndex - 1] : null;
  const nextArticle = currentIndex < GUIA_ESSENCIAL_TRILHA.length - 1 ? GUIA_ESSENCIAL_TRILHA[currentIndex + 1] : null;

  // Extrai headings do conteúdo para criar índice (ToC)
  useEffect(() => {
    if (!article) return;

    const headings: TableOfContentsItem[] = [];
    const lines = article.content.split('\n');

    const usedIds = new Set<string>();

    lines.forEach((line) => {
      // Regex mais robusto permitindo espaços antes e depois dos #
      const h2Match = line.match(/^\s*##\s+(.+)$/);
      const h3Match = line.match(/^\s*###\s+(.+)$/);

      if (h2Match || h3Match) {
        // Remove formatação Markdown básica (*, _, `) e Links para gerar o slug limpo igual ao Render
        const rawText = (h2Match ? h2Match[1] : h3Match![1]).trim();

        // 1. Remove imagens ![alt](url) -> alt
        // 2. Remove links [text](url) -> text
        // 3. Remove caracteres de formatação (*, _, `)
        const cleanText = rawText
          .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
          .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
          .replace(/[*_`]/g, '')
          .trim();

        const text = cleanText;
        const level = h2Match ? 2 : 3;
        let id = slugify(text);

        // Ensure uniqueness
        if (usedIds.has(id)) {
          let counter = 1;
          while (usedIds.has(`${id}-${counter}`)) {
            counter++;
          }
          id = `${id}-${counter}`;
        }

        usedIds.add(id);
        // Usamos cleanText também no display ou rawText? 
        // Melhor usar cleanText para o display ficar limpo no menu também
        headings.push({ id, text: cleanText, level });
      }
    });

    setTableOfContents(headings);
  }, [article]);

  useEffect(() => {
    // Find current step index and calculate course progress
    const currentIndex = GUIA_ESSENCIAL_TRILHA.findIndex(step => step.slug === article.slug);
    const courseProgress = Math.round(((currentIndex + 1) / GUIA_ESSENCIAL_TRILHA.length) * 100);

    setSidebarMode('trilha', {
      title: 'Trilha de Aprendizado',
      subtitle: 'Comece por Aqui',
      steps: GUIA_ESSENCIAL_TRILHA,
      currentSlug: article.slug,
      progress: courseProgress
    });

    setDynamicTitle(article.title);
    setShortTitle('Educação');

    return () => {
      resetSidebar();
    };
  }, [article.slug, article.title, setSidebarMode, resetSidebar, setDynamicTitle, setShortTitle]);

  // Calcula progresso de leitura e seção ativa
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
      setReadingProgress(Math.min(scrollPercent, 100));

      // Detectar seção ativa
      const headingElements = tableOfContents.map(item => ({
        id: item.id,
        element: document.getElementById(item.id)
      })).filter(item => item.element);

      for (let i = headingElements.length - 1; i >= 0; i--) {
        const element = headingElements[i].element;
        if (element && element.getBoundingClientRect().top <= 120) {
          setActiveSection(headingElements[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [tableOfContents]);

  const handleShare = (platform: 'whatsapp' | 'telegram' | 'twitter') => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Confira este artigo: ${article.title}`);

    let shareUrl = '';
    if (platform === 'whatsapp') {
      shareUrl = `https://wa.me/?text=${text}%20${url}`;
    } else if (platform === 'telegram') {
      shareUrl = `https://t.me/share/url?url=${url}&text=${text}`;
    } else if (platform === 'twitter') {
      shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
    }

    window.open(shareUrl, '_blank');
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  // Pre-compute heading IDs for consistent hydration
  const headingIdMap = useMemo(() => {
    if (!article) return new Map<string, string>();

    const idMap = new Map<string, string>();
    const usedIds = new Set<string>();
    const lines = article.content.split('\n');

    lines.forEach((line) => {
      const h2Match = line.match(/^\s*##\s+(.+)$/);
      const h3Match = line.match(/^\s*###\s+(.+)$/);

      if (h2Match || h3Match) {
        const rawText = (h2Match ? h2Match[1] : h3Match![1]).trim();
        const cleanText = rawText
          .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
          .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
          .replace(/[*_`]/g, '')
          .trim();

        let id = slugify(cleanText);

        if (usedIds.has(id)) {
          let counter = 1;
          while (usedIds.has(`${id}-${counter}`)) {
            counter++;
          }
          id = `${id}-${counter}`;
        }

        usedIds.add(id);
        idMap.set(cleanText, id);
      }
    });

    return idMap;
  }, [article?.content]);

  // Get ID for heading text using pre-computed map
  const getHeadingId = (text: string): string => {
    return headingIdMap.get(text) || slugify(text);
  };

  // Helper para extrair texto limpo de children complexos (ex: com itálico/negrito aninhado)
  const extractTextFromNode = (node: any): string => {
    if (typeof node === 'string') return node;
    if (typeof node === 'number') return String(node);
    if (Array.isArray(node)) return node.map(extractTextFromNode).join('');
    if (node && typeof node === 'object' && 'props' in node) return extractTextFromNode(node.props.children);
    return '';
  };

  return (
    <>
      {/* Barra de Progresso Fixa */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-[var(--bg-tertiary)]">
        <div
          className="h-full bg-[var(--brand-primary)] transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* NYT-Style Layout */}
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">

          {/* Grid: Sidebar Left + Content Center + Space Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-8">

            {/* ========== SIDEBAR (Desktop Only) ========== */}
            <aside className="hidden lg:block lg:col-span-2 xl:col-span-2">
              <div className="sticky top-24 pt-8 space-y-6">

                {/* Voltar */}
                <Link
                  href="/educacao"
                  className="flex items-center gap-2 text-sm text-[var(--text-article-muted)] hover:text-[var(--text-article-title)] transition-colors group"
                >
                  <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" />
                  <span>Educação</span>
                </Link>

                {/* Divisor */}
                <div className="h-px bg-[var(--border-article)]" />

                {/* Badge da Trilha */}
                <div className="pb-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-article-muted)] mb-1">
                    Trilha
                  </p>
                  <p className="text-base font-bold text-[var(--brand-primary)]">
                    {currentIndex + 1} de {GUIA_ESSENCIAL_TRILHA.length}
                  </p>
                </div>

                {/* Divisor */}
                <div className="h-px bg-[var(--border-article)]" />

                {/* Índice do Artigo */}
                {tableOfContents.length > 0 && (
                  <nav className="space-y-1">
                    <h3 className="title-newtab text-[10px] uppercase tracking-[0.2em] text-[var(--text-article-muted)] mb-3">
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
                  <h3 className="title-newtab text-[10px] uppercase tracking-[0.2em] text-[var(--text-article-muted)]">
                    Compartilhar
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleShare('twitter')}
                      className="w-9 h-9 flex items-center justify-center rounded-full border border-[var(--border-article)] text-[var(--text-article-muted)] hover:border-[var(--text-article-title)] hover:text-[var(--text-article-title)] transition-colors"
                      aria-label="Compartilhar no X"
                    >
                      <FontAwesomeIcon icon={faXTwitter} className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleShare('telegram')}
                      className="w-9 h-9 flex items-center justify-center rounded-full border border-[var(--border-article)] text-[var(--text-article-muted)] hover:border-[#0088cc] hover:text-[#0088cc] transition-colors"
                      aria-label="Compartilhar no Telegram"
                    >
                      <FontAwesomeIcon icon={faTelegram} className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleShare('whatsapp')}
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

              {/* Mobile: Voltar + Badge */}
              <div className="lg:hidden flex items-center justify-between mb-6">
                <Link
                  href="/educacao"
                  className="inline-flex items-center gap-2 text-sm text-[var(--text-article-muted)]"
                >
                  <ArrowLeft className="w-3 h-3" />
                  Educação
                </Link>
                <span className="text-xs font-bold text-[var(--brand-primary)]">
                  {currentIndex + 1}/{GUIA_ESSENCIAL_TRILHA.length}
                </span>
              </div>

              {/* ===== ARTICLE HEADER (NYT Style) ===== */}
              <header className="mb-10 md:mb-14">

                {/* Category */}
                <div className="flex items-center gap-2 mb-4 md:mb-6">
                  <Shield className="w-4 h-4 text-[var(--brand-primary)]" />
                  <span className="text-xs md:text-sm font-bold uppercase tracking-[0.1em] text-[var(--brand-primary)]">
                    {article.category}
                  </span>
                </div>

                {/* Title - Editorial Typography */}
                <h1
                  className="title-newtab text-[1.75rem] md:text-[2.5rem] lg:text-[2.75rem] mb-6 md:mb-8"
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

                {/* Meta Line: Reading Time + Level + LikeDislike */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[var(--text-article-muted)] pb-6 md:pb-8 border-b border-[var(--border-article)]">
                  <span>{article.readTime}</span>
                  <span>•</span>
                  <span className="capitalize">Nível: {article.level}</span>
                  <span className="hidden md:inline">•</span>
                  <LikeDislikeButton id={article.id} type="article" />
                  <CommentCountButton id={article.id} type="article" onClick={() => setShowComments(!showComments)} />
                </div>

                {/* Mobile: Share Buttons */}
                <div className="lg:hidden mt-4 pt-4 flex items-center gap-4">
                  <span className="text-xs text-[var(--text-article-muted)] uppercase tracking-wider">Compartilhar</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleShare('twitter')}
                      className="w-9 h-9 flex items-center justify-center rounded-full border border-[var(--border-article)] text-[var(--text-article-muted)]"
                      aria-label="X"
                    >
                      <FontAwesomeIcon icon={faXTwitter} className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleShare('telegram')}
                      className="w-9 h-9 flex items-center justify-center rounded-full border border-[var(--border-article)] text-[#0088cc]"
                      aria-label="Telegram"
                    >
                      <FontAwesomeIcon icon={faTelegram} className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleShare('whatsapp')}
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
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ children }) => <h1 className="sr-only">{children}</h1>,
                    h2: ({ children }) => {
                      const text = extractTextFromNode(children);
                      const id = getHeadingId(text);
                      return (
                        <h2
                          id={id}
                          className="title-newtab text-xl md:text-2xl mt-14 md:mt-16 mb-5 pt-8 scroll-mt-28 border-t border-[var(--border-article)]"
                          style={{ letterSpacing: '-0.01em' }}
                        >
                          {children}
                        </h2>
                      );
                    },
                    h3: ({ children }) => {
                      const text = extractTextFromNode(children);
                      const id = getHeadingId(text);
                      return (
                        <h3
                          id={id}
                          className="title-newtab text-lg md:text-xl mt-10 mb-4 scroll-mt-28"
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
                    // Table components for GFM tables
                    table: ({ children }) => (
                      <div className="my-8 overflow-x-auto rounded-lg border border-[var(--border-article)]">
                        <table className="w-full text-sm">
                          {children}
                        </table>
                      </div>
                    ),
                    thead: ({ children }) => (
                      <thead className="bg-[var(--bg-article-tag)] border-b border-[var(--border-article)]">
                        {children}
                      </thead>
                    ),
                    tbody: ({ children }) => (
                      <tbody className="divide-y divide-[var(--border-article)]">
                        {children}
                      </tbody>
                    ),
                    tr: ({ children }) => (
                      <tr className="hover:bg-[var(--bg-article-tag)]/50 transition-colors">
                        {children}
                      </tr>
                    ),
                    th: ({ children }) => (
                      <th className="px-4 py-3 text-left font-semibold text-[var(--text-article-title)]">
                        {children}
                      </th>
                    ),
                    td: ({ children }) => (
                      <td className="px-4 py-3 text-[var(--text-article-body)]">
                        {children}
                      </td>
                    ),
                  }}
                >
                  {article.content}
                </ReactMarkdown>
              </article>

              {/* ===== NAVEGAÇÃO ANTERIOR/PRÓXIMO ===== */}
              <nav className="mt-16 md:mt-20 pt-10 border-t border-[var(--border-article)]">
                <div className="flex flex-col sm:flex-row gap-4">
                  {prevArticle ? (
                    <Link
                      href={`/educacao/${prevArticle.slug}`}
                      className="flex-1 group p-5 rounded-xl border border-[var(--border-article)] hover:border-[var(--brand-primary)]/30 transition-all"
                    >
                      <div className="flex items-center gap-2 text-xs text-[var(--text-article-muted)] mb-2">
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Anterior
                      </div>
                      <div className="font-semibold text-[var(--text-article-title)] group-hover:text-[var(--brand-primary)] transition-colors">
                        {prevArticle.title}
                      </div>
                    </Link>
                  ) : (
                    <div className="flex-1" />
                  )}

                  {nextArticle ? (
                    <Link
                      href={`/educacao/${nextArticle.slug}`}
                      className="flex-1 group p-5 rounded-xl border-2 border-[var(--brand-primary)]/20 bg-[var(--brand-primary)]/5 hover:border-[var(--brand-primary)]/50 transition-all text-right"
                    >
                      <div className="flex items-center justify-end gap-2 text-xs text-[var(--brand-primary)] mb-2">
                        Próximo
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                      <div className="font-bold text-[var(--brand-primary)]">
                        {nextArticle.title}
                      </div>
                    </Link>
                  ) : (
                    <Link
                      href="/educacao"
                      className="flex-1 group p-5 rounded-xl border-2 border-green-500/20 bg-green-500/5 hover:border-green-500/50 transition-all text-right"
                    >
                      <div className="flex items-center justify-end gap-2 text-xs mb-2">
                        Concluído!
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <div className="font-bold ">
                        Voltar para Educação
                      </div>
                    </Link>
                  )}
                </div>
              </nav>

              {/* ===== COMMENTS SECTION ===== */}
              <CommentsSection
                id={article.id}
                type="article"
                isOpen={showComments}
              />

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
