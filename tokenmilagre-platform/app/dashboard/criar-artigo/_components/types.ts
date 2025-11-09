/**
 * Tipos compartilhados para o módulo de criação de artigos
 */

export type ArticleType = 'news' | 'educational' | 'resource';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface ProcessedArticle {
  title: string;
  slug: string;
  excerpt?: string;
  description?: string; // Usado em alguns contextos (alias para excerpt)
  content?: string;
  category: string;
  tags?: string | string[];
  sentiment?: 'positive' | 'neutral' | 'negative';
  level?: string;
  readTime?: string;
  coverImage?: string;
  coverImageAlt?: string;
  type?: ArticleType;
  citations?: string[]; // Array de URLs das fontes do Perplexity
  // Resource fields
  name?: string;
  shortDescription?: string;
  officialUrl?: string;
  platforms?: string[];
}

// Tipos para componentes ReactMarkdown
export interface MarkdownComponentProps {
  children?: React.ReactNode;
}

export interface MarkdownLinkProps extends MarkdownComponentProps {
  href?: string;
}

export interface MarkdownCodeProps extends MarkdownComponentProps {
  inline?: boolean;
}

// Helper para extrair mensagem de erro de forma type-safe
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}
