/**
 * Validation Schemas with Zod
 * Valida dados de artigos antes de publicar
 */

import { z } from 'zod';
import {
  type ArticleType,
  type Sentiment,
  type Level,
  NEWS_CATEGORIES,
  EDUCATIONAL_CATEGORIES,
  RESOURCE_CATEGORIES,
  SENTIMENTS,
  LEVELS,
  VALIDATION_RULES
} from './constants';

// ============================================================================
// Base Schemas
// ============================================================================

const slugSchema = z.string()
  .min(1, 'Slug é obrigatório')
  .regex(VALIDATION_RULES.slug.pattern, 'Slug deve conter apenas letras minúsculas, números e hífens');

const tagsSchema = z.array(z.string())
  .transform(tags => tags.slice(0, VALIDATION_RULES.tags.max)) // 🔧 Truncar para máximo automaticamente
  .refine(tags => tags.length >= VALIDATION_RULES.tags.min, {
    message: `Mínimo de ${VALIDATION_RULES.tags.min} tags`
  });

// Citations são sempre strings (URLs) vindas do Perplexity
const citationsSchema = z.array(z.string().url('URL de citação inválida'));

// ============================================================================
// News Article Schema
// ============================================================================

export const newsArticleSchema = z.object({
  title: z.string()
    .min(VALIDATION_RULES.title.minLength, `Título deve ter pelo menos ${VALIDATION_RULES.title.minLength} caracteres`)
    .max(VALIDATION_RULES.title.maxLength, `Título deve ter no máximo ${VALIDATION_RULES.title.maxLength} caracteres`),

  slug: slugSchema,

  excerpt: z.string()
    .min(VALIDATION_RULES.excerpt.minLength, `Resumo deve ter pelo menos ${VALIDATION_RULES.excerpt.minLength} caracteres`)
    .max(VALIDATION_RULES.excerpt.maxLength, `Resumo deve ter no máximo ${VALIDATION_RULES.excerpt.maxLength} caracteres`),

  content: z.string()
    .min(VALIDATION_RULES.content.minLength, `Conteúdo deve ter pelo menos ${VALIDATION_RULES.content.minLength} caracteres`),

  category: z.enum(NEWS_CATEGORIES as unknown as [string, ...string[]], {
    message: 'Categoria inválida para notícia'
  }),

  sentiment: z.enum(SENTIMENTS as unknown as [Sentiment, ...Sentiment[]], {
    message: 'Sentimento deve ser positive, neutral ou negative'
  }).optional(),

  tags: tagsSchema,

  citations: citationsSchema.optional(),

  coverImage: z.string().optional(),

  coverImageAlt: z.string().optional(),

  readTime: z.string().optional()
});

// ============================================================================
// Educational Article Schema
// ============================================================================

export const educationalArticleSchema = z.object({
  title: z.string()
    .min(VALIDATION_RULES.title.minLength, `Título deve ter pelo menos ${VALIDATION_RULES.title.minLength} caracteres`)
    .max(VALIDATION_RULES.title.maxLength, `Título deve ter no máximo ${VALIDATION_RULES.title.maxLength} caracteres`),

  slug: slugSchema,

  excerpt: z.string()
    .min(VALIDATION_RULES.excerpt.minLength, `Resumo deve ter pelo menos ${VALIDATION_RULES.excerpt.minLength} caracteres`)
    .max(VALIDATION_RULES.excerpt.maxLength, `Resumo deve ter no máximo ${VALIDATION_RULES.excerpt.maxLength} caracteres`),

  content: z.string()
    .min(VALIDATION_RULES.content.minLength, `Conteúdo deve ter pelo menos ${VALIDATION_RULES.content.minLength} caracteres`),

  category: z.enum(EDUCATIONAL_CATEGORIES as unknown as [string, ...string[]], {
    message: 'Categoria inválida para artigo educacional'
  }),

  level: z.enum(LEVELS as unknown as [Level, ...Level[]], {
    message: 'Nível deve ser iniciante, intermediario ou avancado'
  }),

  tags: tagsSchema,

  citations: citationsSchema.optional(),

  coverImage: z.string().optional(),

  coverImageAlt: z.string().optional(),

  readTime: z.string().optional()
});

// ============================================================================
// Resource Schema
// ============================================================================

export const resourceSchema = z.object({
  // Resources têm regras mais flexíveis que artigos
  name: z.string()
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),

  slug: slugSchema,

  shortDescription: z.string()
    .min(20, 'Descrição curta deve ter pelo menos 20 caracteres')
    .max(200, 'Descrição curta deve ter no máximo 200 caracteres'),

  description: z.string()
    .min(50, 'Descrição deve ter pelo menos 50 caracteres')
    .optional(), // description pode ser opcional para resources

  category: z.enum(RESOURCE_CATEGORIES as unknown as [string, ...string[]], {
    message: 'Categoria inválida para recurso'
  }),

  website: z.string().url('URL do website inválida').optional(),

  platforms: z.array(z.string()).optional(),

  // Features pode ser array de strings OU objetos (aceitar ambos)
  features: z.union([
    z.array(z.string()),
    z.array(z.any())
  ]).optional().transform((val) => {
    if (!val) return undefined;
    // Se for array de objetos, converter para strings
    return val.map((item: any) =>
      typeof item === 'string' ? item : JSON.stringify(item)
    );
  }),

  pros: z.array(z.string()).optional(),

  cons: z.array(z.string()).optional(),

  pricing: z.string().optional(),

  verified: z.boolean().optional(),

  featured: z.boolean().optional()
});

// ============================================================================
// Validation Functions
// ============================================================================

export interface ValidationResult {
  success: boolean;
  errors: string[];
}

/**
 * Valida um artigo baseado no tipo
 */
export function validateArticle(
  article: unknown,
  type: ArticleType
): ValidationResult {
  let schema: z.ZodSchema;

  switch (type) {
    case 'news':
      schema = newsArticleSchema;
      break;
    case 'educational':
      schema = educationalArticleSchema;
      break;
    case 'resource':
      schema = resourceSchema;
      break;
    default:
      return {
        success: false,
        errors: ['Tipo de artigo inválido']
      };
  }

  const result = schema.safeParse(article);

  if (result.success) {
    return {
      success: true,
      errors: []
    };
  }

  // Extrair mensagens de erro
  const errors = result.error.issues.map((err) => {
    const field = err.path.join('.');
    return `${field}: ${err.message}`;
  });

  return {
    success: false,
    errors
  };
}

/**
 * Valida e retorna os dados parseados (com type safety)
 */
export function validateAndParse<T>(
  article: unknown,
  type: ArticleType
): { success: true; data: T } | { success: false; errors: string[] } {
  let schema: z.ZodSchema;

  switch (type) {
    case 'news':
      schema = newsArticleSchema;
      break;
    case 'educational':
      schema = educationalArticleSchema;
      break;
    case 'resource':
      schema = resourceSchema;
      break;
    default:
      return {
        success: false,
        errors: ['Tipo de artigo inválido']
      };
  }

  const result = schema.safeParse(article);

  if (result.success) {
    return {
      success: true,
      data: result.data as T
    };
  }

  const errors = result.error.issues.map((err) => {
    const field = err.path.join('.');
    return `${field}: ${err.message}`;
  });

  return {
    success: false,
    errors
  };
}

/**
 * Valida apenas os campos obrigatórios (validação rápida)
 */
export function validateRequiredFields(
  article: unknown,
  type: ArticleType
): ValidationResult {
  if (!article || typeof article !== 'object') {
    return {
      success: false,
      errors: ['Artigo inválido']
    };
  }

  const art = article as Record<string, unknown>;
  const errors: string[] = [];

  // Validações comuns
  if (!art.slug || typeof art.slug !== 'string') {
    errors.push('Slug é obrigatório');
  }

  if (!art.tags || !Array.isArray(art.tags) || art.tags.length < VALIDATION_RULES.tags.min) {
    errors.push(`Mínimo de ${VALIDATION_RULES.tags.min} tags`);
  }

  // Validações específicas por tipo
  if (type === 'resource') {
    if (!art.name || typeof art.name !== 'string') {
      errors.push('Nome é obrigatório');
    }
    if (!art.shortDescription || typeof art.shortDescription !== 'string') {
      errors.push('Descrição curta é obrigatória');
    }
    if (!art.description || typeof art.description !== 'string') {
      errors.push('Descrição é obrigatória');
    }
  } else {
    if (!art.title || typeof art.title !== 'string') {
      errors.push('Título é obrigatório');
    }
    if (!art.excerpt || typeof art.excerpt !== 'string') {
      errors.push('Resumo é obrigatório');
    }
    if (!art.content || typeof art.content !== 'string') {
      errors.push('Conteúdo é obrigatório');
    }
  }

  if (!art.category || typeof art.category !== 'string') {
    errors.push('Categoria é obrigatória');
  }

  return {
    success: errors.length === 0,
    errors
  };
}
