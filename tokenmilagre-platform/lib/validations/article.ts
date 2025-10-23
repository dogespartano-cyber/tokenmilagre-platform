import { z } from 'zod';

/**
 * Schema de validação para criação de artigos
 */
export const createArticleSchema = z.object({
  slug: z
    .string()
    .min(1, 'Slug é obrigatório')
    .max(200, 'Slug muito longo')
    .regex(/^[a-z0-9-]+$/, 'Slug deve conter apenas letras minúsculas, números e hífens'),

  title: z
    .string()
    .min(10, 'Título deve ter pelo menos 10 caracteres')
    .max(200, 'Título muito longo (máximo 200 caracteres)'),

  excerpt: z
    .string()
    .min(20, 'Resumo deve ter pelo menos 20 caracteres')
    .max(500, 'Resumo muito longo (máximo 500 caracteres)'),

  content: z
    .string()
    .min(100, 'Conteúdo deve ter pelo menos 100 caracteres')
    .max(50000, 'Conteúdo muito longo (máximo 50.000 caracteres)'),

  category: z.enum(
    ['bitcoin', 'ethereum', 'defi', 'politica', 'nfts', 'altcoins', 'blockchain', 'trading', 'seguranca', 'desenvolvimento'],
    {
      errorMap: () => ({ message: 'Categoria inválida' }),
    }
  ),

  sentiment: z.enum(['positive', 'neutral', 'negative'], {
    errorMap: () => ({ message: 'Sentiment deve ser positive, neutral ou negative' }),
  }),

  tags: z
    .array(z.string())
    .min(3, 'Adicione pelo menos 3 tags')
    .max(10, 'Máximo de 10 tags permitidas'),

  published: z.boolean().default(true),

  type: z.enum(['news', 'educational']).default('news'),

  // Campos opcionais para artigos educacionais
  level: z.enum(['iniciante', 'intermediario', 'avancado']).optional(),
  contentType: z.enum(['Artigo', 'Tutorial']).optional(),
  readTime: z.string().optional(),
});

/**
 * Schema de validação para atualização de artigos
 */
export const updateArticleSchema = createArticleSchema.partial().extend({
  id: z.string().min(1, 'ID do artigo é obrigatório'),
});

/**
 * Schema de validação específico para notícias
 */
export const createNewsSchema = createArticleSchema.extend({
  type: z.literal('news'),
  sentiment: z.enum(['positive', 'neutral', 'negative']),
});

/**
 * Schema de validação específico para artigos educacionais
 */
export const createEducationalSchema = createArticleSchema.extend({
  type: z.literal('educational'),
  level: z.enum(['iniciante', 'intermediario', 'avancado']),
  contentType: z.enum(['Artigo', 'Tutorial']),
  readTime: z.string().regex(/^\d+\s*min$/, 'Tempo de leitura deve estar no formato "X min"'),
});

/**
 * Schema para validação de query parameters
 */
export const articleQuerySchema = z.object({
  type: z.enum(['news', 'educational', 'all']).optional(),
  category: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(12),
  search: z.string().optional(),
  sentiment: z.enum(['positive', 'neutral', 'negative', 'all']).optional(),
});

// Tipos TypeScript derivados dos schemas
export type CreateArticleInput = z.infer<typeof createArticleSchema>;
export type UpdateArticleInput = z.infer<typeof updateArticleSchema>;
export type CreateNewsInput = z.infer<typeof createNewsSchema>;
export type CreateEducationalInput = z.infer<typeof createEducationalSchema>;
export type ArticleQueryParams = z.infer<typeof articleQuerySchema>;
