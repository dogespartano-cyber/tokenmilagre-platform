'use client';

import ReactMarkdown from 'react-markdown';
import { getCitationAwareMarkdownComponents, SourcesSection } from '@/lib/domains/articles/components/citations-processor';

interface ArticlePreviewProps {
  article: {
    title: string;
    excerpt?: string;
    description?: string;
    content: string;
    category: string;
    sentiment?: 'positive' | 'neutral' | 'negative';
    level?: string;
    readTime?: string;
    coverImage?: string;
    coverImageAlt?: string;
    tags?: string | string[];
    citations?: string[]; // Array de URLs das fontes
  };
  articleType: 'news' | 'educational' | 'resource';
}

export default function ArticlePreview({ article, articleType }: ArticlePreviewProps) {
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

  const getSentimentLabel = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'Positivo';
      case 'negative': return 'Negativo';
      default: return 'Neutro';
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return '#22c55e';
      case 'negative': return '#ef4444';
      default: return '#eab308';
    }
  };

  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'iniciante': return '🌱 Iniciante';
      case 'intermediario': return '📚 Intermediário';
      case 'avancado': return '🚀 Avançado';
      default: return level;
    }
  };

  // Remove H1 do início do conteúdo
  const removeH1FromContent = (content: string): string => {
    const h1Regex = /^#\s+.+?\n+/;
    return content.replace(h1Regex, '').trim();
  };

  // Parsear tags para array
  const parseTags = (): string[] => {
    if (!article.tags) return [];
    if (typeof article.tags === 'string') {
      try {
        return JSON.parse(article.tags);
      } catch {
        return [];
      }
    }
    return article.tags;
  };

  const keywords = parseTags();
  const cleanContent = removeH1FromContent(article.content || '');
  const currentDate = new Date();
  const citations = article.citations || [];

  // Mescla componentes de citação com componentes padrão de markdown
  const citationComponents = getCitationAwareMarkdownComponents(citations);

  // DEBUG: Ver o conteúdo recebido
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.log('📄 [ArticlePreview] Content original:', article.content?.substring(0, 500));
    console.log('📄 [ArticlePreview] Clean content:', cleanContent?.substring(0, 500));
    console.log('📄 [ArticlePreview] Citations:', citations);
  }

  return (
    <div className="space-y-6">
      {/* Imagem de Capa */}
      {article.coverImage && (
        <div className="rounded-2xl overflow-hidden shadow-xl border" style={{ borderColor: 'var(--border-light)' }}>
          <img
            src={article.coverImage}
            alt={article.coverImageAlt || article.title}
            className="w-full h-[400px] object-cover"
          />
        </div>
      )}

      {/* Header do Artigo */}
      <div className="space-y-4">
        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-3">
          {article.sentiment && (
            <span
              className="px-3 py-1 rounded-lg text-sm font-semibold"
              style={{
                backgroundColor: getSentimentColor(article.sentiment),
                color: 'white'
              }}
            >
              {getSentimentLabel(article.sentiment)}
            </span>
          )}
          <span
            className="px-3 py-1 rounded-lg text-sm font-semibold"
            style={{
              backgroundColor: 'var(--brand-primary)',
              color: 'white'
            }}
          >
            {article.category}
          </span>
          {article.level && (
            <span
              className="px-3 py-1 rounded-lg text-sm font-semibold"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-medium)'
              }}
            >
              {getLevelLabel(article.level)}
            </span>
          )}
          {article.readTime && (
            <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
              📖 {article.readTime} de leitura
            </span>
          )}
        </div>

        {/* Título */}
        <h1 className="text-4xl md:text-5xl font-bold leading-tight font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
          {article.title}
        </h1>

        {/* Data de Publicação (Preview) */}
        {articleType === 'news' && (
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-tertiary)' }}>
            <span>📅</span>
            <span>
              Preview - Será publicado em: {currentDate.toLocaleDateString('pt-BR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'America/Sao_Paulo'
              })} BRT
            </span>
          </div>
        )}

        {/* Resumo */}
        {(article.excerpt || article.description) && (
          <p className="text-xl leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {article.excerpt || article.description}
          </p>
        )}

        {/* Keywords/Tags */}
        {keywords.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {keywords.map((keyword, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-lg text-sm"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-tertiary)'
                }}
              >
                #{keyword}
              </span>
            ))}
          </div>
        )}
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
            // Componentes de citação (p, li, strong) processam [1][2]
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
            em: ({ children }) => (
              <em className="italic" style={{ color: 'var(--text-secondary)' }}>
                {children}
              </em>
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

      {/* Nota de Transparência */}
      <div className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-light)' }}>
        <div className="flex items-start gap-3">
          <div className="text-2xl">📊</div>
          <div className="flex-1 space-y-2">
            <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>
              Nota de Transparência
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Publicado por $MILAGRE Research | {articleType === 'news' ? 'Preview de notícia' : 'Preview de artigo'} gerado por IA | Data de atualização: {currentDate.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              })}
            </p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Este conteúdo é educacional e informativo, baseado em fontes verificadas do mercado cripto. Não constitui aconselhamento financeiro ou recomendação de investimento. Criptomoedas envolvem riscos - sempre conduza sua própria pesquisa (DYOR).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
