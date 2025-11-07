/**
 * Tipos centralizados para Article
 */

import { Sentiment, WarningLevel } from '@prisma/client';

/**
 * Interface base de artigo (compartilhado entre news e educational)
 */
export interface Article {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt?: string | null;
  type: 'news' | 'educational';
  published: boolean;
  category: string;
  tags: string; // JSON array
  coverImage?: string | null;
  coverImageAlt?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  authorId: string;
  author?: {
    name: string | null;
    email: string;
  };
}

/**
 * Artigo de notícia
 */
export interface NewsArticle extends Article {
  type: 'news';
  sentiment: Sentiment;
  factCheckScore?: number | null;
  factCheckSources?: string | null; // JSON array
  factCheckDate?: Date | string | null;
  factCheckStatus?: 'verified' | 'failed' | 'skipped' | null;
}

/**
 * Artigo educacional
 */
export interface EducationalArticle extends Article {
  type: 'educational';
  level?: 'iniciante' | 'intermediario' | 'avancado' | null;
  contentType?: 'Artigo' | 'Tutorial' | 'Curso' | null;
  readTime?: string | null;
  warningLevel?: WarningLevel | null;
  securityTips?: string | null; // JSON array
  courseSequence?: number | null;
  relatedArticles?: string | null; // JSON array
  projectHighlight?: boolean;
  quizData?: string | null; // JSON
}

/**
 * Formato da API pública (sem dados internos)
 */
export interface ArticlePublicResponse {
  id: string;
  slug: string;
  title: string;
  summary: string; // Mapeado de excerpt
  content: string;
  publishedAt: string; // Mapeado de createdAt
  lastVerified: string; // Mapeado de updatedAt
  category: string[];
  keywords: string[]; // Mapeado de tags
  type: 'news' | 'educational';

  // News específico
  sentiment?: 'positive' | 'neutral' | 'negative';
  factCheckScore?: number;

  // Educational específico
  level?: 'iniciante' | 'intermediario' | 'avancado';
  contentType?: 'Artigo' | 'Tutorial' | 'Curso';
  readTime?: string;
}

/**
 * Item de notícia para homepage/listagens
 */
export interface NewsItem {
  id: string;
  slug?: string;
  title: string;
  summary: string;
  publishedAt: string;
  category: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
}

/**
 * Item educacional para homepage/listagens
 */
export interface EducationItem {
  id: string;
  slug: string;
  title: string;
  summary: string;
  level: string;
  readTime: string;
  category?: string;
}

/**
 * Parâmetros de criação de artigo
 */
export interface CreateArticleParams {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  type: 'news' | 'educational';
  category: string;
  tags?: string[];
  published?: boolean;
  authorId: string;

  // News específico
  sentiment?: Sentiment;

  // Educational específico
  level?: 'iniciante' | 'intermediario' | 'avancado';
  contentType?: 'Artigo' | 'Tutorial' | 'Curso';
  readTime?: string;
}

/**
 * Parâmetros de atualização de artigo
 */
export interface UpdateArticleParams extends Partial<CreateArticleParams> {
  id: string;
}
