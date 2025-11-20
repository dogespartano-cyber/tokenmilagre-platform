/**
 * Zod Validation Schemas for Articles
 *
 * Server-side validation schemas following schema-v2.prisma structure
 * All validation happens server-side for security
 *
 * @example
 * ```typescript
 * import { articleCreateSchema, articleUpdateSchema } from '@/lib/schemas/article-schemas'
 *
 * const result = articleCreateSchema.safeParse(data)
 * if (!result.success) {
 *   throw new ValidationError('Invalid article data', { errors: result.error.flatten() })
 * }
 * ```
 */

import { z } from 'zod'

/**
 * Article type enum matching Prisma schema
 */
export const articleTypeEnum = z.enum(['NEWS', 'EDUCATIONAL', 'RESOURCE'])

/**
 * Article status enum matching Prisma schema
 */
export const articleStatusEnum = z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED', 'DELETED'])

/**
 * Article SEO metadata schema
 */
export const articleSEOSchema = z.object({
  metaTitle: z.string().min(10).max(60).optional(),
  metaDescription: z.string().min(50).max(160).optional(),
  keywords: z.array(z.string()).max(10).optional(),
  ogImage: z.string().url().optional(),
  canonicalUrl: z.string().url().optional(),
})

/**
 * Citation schema for fact-checking sources
 */
export const citationSchema = z.object({
  url: z.string().url('URL inválida'),
  title: z.string().max(200).optional(),
  domain: z.string().max(100).optional(),
  order: z.number().int().min(0).default(0),
  verified: z.boolean().default(false),
})

/**
 * Citation create schema (without ID)
 */
export const citationCreateSchema = citationSchema

/**
 * Slug validation
 * - Lowercase letters, numbers, and hyphens only
 * - Must start and end with alphanumeric
 * - 3-100 characters
 */
export const slugSchema = z
  .string()
  .min(3, 'Slug deve ter no mínimo 3 caracteres')
  .max(100, 'Slug deve ter no máximo 100 caracteres')
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    'Slug deve conter apenas letras minúsculas, números e hífens'
  )

/**
 * Content validation
 * - Minimum 100 characters for quality
 * - Maximum 50000 characters (reasonable article length)
 */
export const contentSchema = z
  .string()
  .min(100, 'Conteúdo deve ter no mínimo 100 caracteres')
  .max(50000, 'Conteúdo deve ter no máximo 50000 caracteres')

/**
 * Title validation
 * - Minimum 10 characters for SEO
 * - Maximum 200 characters for readability
 */
export const titleSchema = z
  .string()
  .min(10, 'Título deve ter no mínimo 10 caracteres')
  .max(200, 'Título deve ter no máximo 200 caracteres')

/**
 * Excerpt validation
 */
export const excerptSchema = z
  .string()
  .min(50, 'Resumo deve ter no mínimo 50 caracteres')
  .max(500, 'Resumo deve ter no máximo 500 caracteres')
  .optional()

/**
 * Cover image validation
 */
export const coverImageSchema = z.object({
  url: z.string().url('URL da imagem inválida'),
  alt: z.string().min(10).max(200),
  width: z.number().int().min(400).max(4000).optional(),
  height: z.number().int().min(300).max(4000).optional(),
})

/**
 * Tag IDs array validation
 * - Minimum 1 tag required for categorization
 * - Maximum 10 tags to avoid over-tagging
 */
export const tagIdsSchema = z
  .array(z.string().cuid('ID de tag inválido'))
  .min(1, 'Artigo deve ter pelo menos 1 tag')
  .max(10, 'Artigo pode ter no máximo 10 tags')

/**
 * Related article IDs validation
 * - Maximum 5 related articles
 */
export const relatedArticleIdsSchema = z
  .array(z.string().cuid('ID de artigo inválido'))
  .max(5, 'Máximo de 5 artigos relacionados')
  .optional()

/**
 * Article create schema (server-side only)
 * Used when creating new articles via API
 */
export const articleCreateSchema = z
  .object({
    // Required fields
    title: titleSchema,
    slug: slugSchema,
    content: contentSchema,
    type: articleTypeEnum,
    categoryId: z.string().cuid('ID de categoria inválido'),
    authorId: z.string().cuid('ID de autor inválido'),

    // Optional fields
    excerpt: excerptSchema,
    coverImage: z.string().url().optional(), // Simple URL string matching Prisma schema
    coverImageAlt: z.string().min(10).max(200).optional(),
    status: articleStatusEnum.default('DRAFT'),

    // Relationships (by IDs)
    tagIds: tagIdsSchema,
    relatedArticleIds: relatedArticleIdsSchema,
    citations: z.array(citationCreateSchema).max(20).optional(),

    // Metadata
    readTime: z.string().regex(/^\d+\s*min$/).optional(), // Format: "5 min", "10 min" - Will be auto-calculated if not provided
    seo: articleSEOSchema.optional(),

    // Publishing
    publishedAt: z.date().optional(),
    featuredUntil: z.date().optional(),
  })
  .refine(
    (data) => {
      // If status is PUBLISHED, publishedAt must be set
      if (data.status === 'PUBLISHED' && !data.publishedAt) {
        return false
      }
      return true
    },
    {
      message: 'Artigos publicados devem ter data de publicação',
      path: ['publishedAt'],
    }
  )
  .refine(
    (data) => {
      // If featuredUntil is set, it must be in the future
      if (data.featuredUntil && data.featuredUntil < new Date()) {
        return false
      }
      return true
    },
    {
      message: 'Data de destaque deve ser no futuro',
      path: ['featuredUntil'],
    }
  )

/**
 * Article update schema (partial)
 * All fields optional except where business logic requires them
 */
export const articleUpdateSchema = z
  .object({
    title: titleSchema.optional(),
    slug: slugSchema.optional(),
    content: contentSchema.optional(),
    excerpt: excerptSchema,
    coverImage: z.string().url().optional().nullable(), // Simple URL string matching Prisma schema
    coverImageAlt: z.string().min(10).max(200).optional().nullable(),
    type: articleTypeEnum.optional(),
    status: articleStatusEnum.optional(),
    categoryId: z.string().cuid().optional(),

    // Relationships
    tagIds: tagIdsSchema.optional(),
    relatedArticleIds: relatedArticleIdsSchema,
    citations: z.array(citationCreateSchema).max(20).optional(),

    // Metadata
    readTime: z.string().regex(/^\d+\s*min$/).optional().nullable(), // Format: "5 min", "10 min"
    seo: articleSEOSchema.optional(),

    // Publishing
    publishedAt: z.date().optional().nullable(),
    featuredUntil: z.date().optional().nullable(),
  })
  .refine(
    (data) => {
      // If status is being set to PUBLISHED, must have publishedAt
      if (data.status === 'PUBLISHED' && data.publishedAt === null) {
        return false
      }
      return true
    },
    {
      message: 'Artigos publicados devem ter data de publicação',
      path: ['publishedAt'],
    }
  )

/**
 * Article query/filter schema
 * Used for list/search endpoints
 */
export const articleQuerySchema = z.object({
  // Pagination
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),

  // Filters
  type: articleTypeEnum.optional(),
  status: articleStatusEnum.optional(),
  categoryId: z.string().cuid().optional(),
  authorId: z.string().cuid().optional(),
  tagId: z.string().cuid().optional(),

  // Search
  search: z.string().max(200).optional(),

  // Sorting
  sortBy: z.enum(['createdAt', 'publishedAt', 'updatedAt', 'title', 'readTime']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),

  // Flags
  featured: z.coerce.boolean().optional(),
  includeDeleted: z.coerce.boolean().default(false),
})

/**
 * Bulk article operation schema
 * Used for batch operations (publish, archive, delete)
 */
export const bulkArticleOperationSchema = z.object({
  articleIds: z.array(z.string().cuid()).min(1).max(50),
  operation: z.enum(['publish', 'archive', 'delete', 'restore']),
})

/**
 * Type exports for TypeScript
 */
export type ArticleCreateInput = z.infer<typeof articleCreateSchema>
export type ArticleUpdateInput = z.infer<typeof articleUpdateSchema>
export type ArticleQuery = z.infer<typeof articleQuerySchema>
export type BulkArticleOperation = z.infer<typeof bulkArticleOperationSchema>
export type Citation = z.infer<typeof citationSchema>
export type ArticleSEO = z.infer<typeof articleSEOSchema>
export type ArticleType = z.infer<typeof articleTypeEnum>
export type ArticleStatus = z.infer<typeof articleStatusEnum>

/**
 * ================================================================================
 * CURRENT PRISMA SCHEMA COMPATIBLE TYPES
 * ================================================================================
 * The schemas below are compatible with the current Prisma schema (not schema-v2)
 * Use these for ArticleService operations
 */

/**
 * Current Article Create Input (compatible with current Prisma schema)
 */
export const articleCreateInputCurrent = z.object({
  title: titleSchema,
  slug: slugSchema,
  content: contentSchema,
  type: z.enum(['news', 'educational']).default('news'), // Lowercase to match current Prisma
  excerpt: z.string().min(10).max(500).optional(),
  published: z.boolean().default(false),
  category: z.string().min(1).max(100).optional(), // String field, not ID (made optional to support categoryId)
  categoryId: z.string().cuid().optional(), // ID for relationship verification
  tags: z.array(z.string()).optional(), // Array of strings
  tagIds: z.array(z.string().cuid()).optional(), // IDs for relationship verification
  citations: z.array(z.object({
    url: z.string().url(),
    title: z.string(),
    order: z.number().optional(),
    verified: z.boolean().optional(),
  })).optional(),
  relatedArticleIds: z.array(z.string().cuid()).optional(), // IDs for relationship verification
  sentiment: z.enum(['positive', 'neutral', 'negative']).default('neutral'),
  level: z.enum(['iniciante', 'intermediario', 'avancado']).optional(),
  contentType: z.string().max(50).optional(),
  readTime: z.union([z.string().regex(/^\d+\s*min$/), z.number()]).optional(), // Support both string and number
  warningLevel: z.enum(['info', 'warning', 'critical']).optional(),
  securityTips: z.array(z.string()).optional(),
  coverImage: z.string().url().optional(),
  coverImageAlt: z.string().min(10).max(200).optional(),
  relatedArticles: z.array(z.string()).optional(), // Array of slugs
  projectHighlight: z.boolean().default(false),
  factCheckScore: z.number().min(0).max(100).optional(),
  factCheckSources: z.array(z.string().url()).optional(),
  factCheckDate: z.date().optional(),
  factCheckStatus: z.string().max(50).optional(),
  authorId: z.string().optional(), // Optional - allows overriding author for AI-generated content
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(), // Add status support
})

/**
 * Current Article Update Input (compatible with current Prisma schema)
 */
export const articleUpdateInputCurrent = articleCreateInputCurrent.partial().extend({
  categoryId: z.string().cuid().optional(),
  tagIds: z.array(z.string().cuid()).optional(),
  citations: z.array(z.object({
    url: z.string().url(),
    title: z.string(),
    order: z.number().optional(),
    verified: z.boolean().optional(),
  })).optional(),
  relatedArticleIds: z.array(z.string().cuid()).optional(),
})

/**
 * Current Article Query Input (compatible with current Prisma schema)  
 */
export const articleQueryInputCurrent = z.object({
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).max(100).optional(),
  published: z.boolean().optional(),
  type: z.string().optional(),
  category: z.string().optional(),
  authorId: z.string().optional(),
  search: z.string().optional(),
  sentiment: z.enum(['positive', 'neutral', 'negative']).optional(),
  level: z.string().optional(),
  projectHighlight: z.boolean().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
})

/**
 * Bulk operation for current schema
 */
export const bulkArticleOperationCurrent = z.object({
  articleIds: z.array(z.string()).min(1),
  action: z.enum(['publish', 'unpublish', 'delete', 'updateCategory']),
  data: z.object({
    category: z.string().optional(),
  }).optional(),
})

/**
 * Export current schema types
 */
export type ArticleCreateInputCurrent = z.infer<typeof articleCreateInputCurrent>
export type ArticleUpdateInputCurrent = z.infer<typeof articleUpdateInputCurrent>
export type ArticleQueryCurrent = z.infer<typeof articleQueryInputCurrent>
export type BulkArticleOperationCurrent = z.infer<typeof bulkArticleOperationCurrent>
