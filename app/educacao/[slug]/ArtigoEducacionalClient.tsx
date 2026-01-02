'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import ModularArticleRenderer from '@/lib/domains/articles/editor/components/ModularArticleRenderer';
import { markdownToHtml } from '@/lib/domains/articles/editor/converters/markdown-to-html';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { slugify } from '@/lib/shared/utils/content-helpers';
import QuizComponent from '@/components/education/QuizComponent';
import TransparencyNote from '@/components/shared/TransparencyNote';
import CommentsSection from '@/components/engagement/CommentsSection';
import ZenithArticleLayout, { TableOfContentsItem } from '@/components/zenith/ZenithArticleLayout';

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
  quizData?: string | null;
}

interface ArtigoEducacionalClientProps {
  article: EducationalArticle | null;
  relatedArticles?: EducationalArticle[];
}

export default function ArtigoEducacionalClient({ article, relatedArticles = [] }: ArtigoEducacionalClientProps) {
  const router = useRouter();
  const [tableOfContents, setTableOfContents] = useState<TableOfContentsItem[]>([]);
  const [activeSection, setActiveSection] = useState<string>('');
  const [showComments, setShowComments] = useState(false);
  const [htmlContent, setHtmlContent] = useState<string>('');

  // Convert Markdown to HTML for the Modular Renderer
  useEffect(() => {
    if (article?.content) {
      const converted = markdownToHtml(article.content);
      setHtmlContent(converted);
    }
  }, [article?.content]);

  // Pre-compute heading IDs for consistent hydration
  const headingIdMap = useMemo(() => {
    if (!article) return new Map<string, string>();

    const idMap = new Map<string, string>();
    const usedIds = new Set<string>();
    const lines = article.content.split('\n');

    lines.forEach((line) => {
      const h2Match = line.match(/^## (.+)$/);
      const h3Match = line.match(/^### (.+)$/);

      if (h2Match || h3Match) {
        const text = (h2Match ? h2Match[1] : h3Match![1]).trim();
        let id = slugify(text);

        // Create unique ID if duplicate
        if (usedIds.has(id)) {
          let counter = 1;
          while (usedIds.has(`${id}-${counter}`)) {
            counter++;
          }
          id = `${id}-${counter}`;
        }

        usedIds.add(id);
        idMap.set(text, id);
      }
    });

    return idMap;
  }, [article?.content]);

  // Build table of contents from pre-computed heading IDs
  useEffect(() => {
    if (!article) return;

    const headings: TableOfContentsItem[] = [];
    const lines = article.content.split('\n');

    lines.forEach((line) => {
      const h2Match = line.match(/^## (.+)$/);
      const h3Match = line.match(/^### (.+)$/);

      if (h2Match || h3Match) {
        const text = (h2Match ? h2Match[1] : h3Match![1]).trim();
        const level = h2Match ? 2 : 3;
        const id = headingIdMap.get(text) || slugify(text);
        headings.push({ id, text, level });
      }
    });

    setTableOfContents(headings);
  }, [article, headingIdMap]);

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

  // Custom color for related articles level badge
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'iniciante': return '#22c55e';
      case 'intermediario': return '#3b82f6';
      case 'avancado': return '#a855f7';
      default: return 'var(--brand-primary)';
    }
  };

  // Artigo não encontrado
  if (!article) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">📚</div>
          <h1 className="title-newtab text-2xl md:text-3xl mb-4">
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
    <ZenithArticleLayout
      variant="editorial"
      header={{
        title: article.title,
        category: article.category,
        summary: article.description,
        publishedAt: article.publishedAt,
        readTime: article.readTime,
        level: article.level
      }}
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
        href: "/educacao",
        label: "Educação"
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
      <article className="prose prose-lg max-w-none">
        {/* MODULAR RENDERER REPLACES REACT MARKDOWN */}
        {htmlContent ? (
          <ModularArticleRenderer content={htmlContent} />
        ) : (
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-white/5 rounded w-3/4"></div>
            <div className="h-4 bg-white/5 rounded w-full"></div>
            <div className="h-4 bg-white/5 rounded w-5/6"></div>
          </div>
        )}
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
        <h3 className="title-newtab text-[10px] uppercase tracking-[0.2em] text-[var(--text-article-muted)] mb-4">
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
    </ZenithArticleLayout>
  );
}
