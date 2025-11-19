/**
 * Common Zod Validation Schemas
 *
 * Reusable schemas for common validation patterns across the application
 *
 * @example
 * ```typescript
 * import { paginationSchema, idSchema } from '@/lib/schemas/common-schemas'
 *
 * const pagination = paginationSchema.parse(searchParams)
 * ```
 */

import { z } from 'zod'
import { PAGINATION } from '@/lib/constants/pagination'

/**
 * Pagination query parameters schema
 */
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(PAGINATION.DEFAULT_PAGE),
  limit: z.coerce
    .number()
    .int()
    .min(PAGINATION.MIN_LIMIT)
    .max(PAGINATION.MAX_LIMIT)
    .default(PAGINATION.DEFAULT_LIMIT),
})

/**
 * Sort parameters schema
 */
export const sortSchema = z.object({
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

/**
 * Search query schema
 */
export const searchSchema = z.object({
  search: z.string().min(1).max(200).optional(),
  query: z.string().min(1).max(200).optional(),
})

/**
 * Combined query schema (pagination + sort + search)
 */
export const querySchema = paginationSchema.merge(sortSchema).merge(searchSchema)

/**
 * ID parameter schema (CUID)
 */
export const idSchema = z.string().cuid('Invalid ID format')

/**
 * Slug parameter schema
 */
export const slugSchema = z
  .string()
  .min(3, 'Slug must be at least 3 characters')
  .max(100, 'Slug must be at most 100 characters')
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must contain only lowercase letters, numbers, and hyphens')

/**
 * URL schema
 */
export const urlSchema = z.string().url('Invalid URL format').max(2048, 'URL too long')

/**
 * Email schema
 */
export const emailSchema = z
  .string()
  .email('Invalid email format')
  .max(255, 'Email must be at most 255 characters')

/**
 * Date range schema
 */
export const dateRangeSchema = z.object({
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
})

/**
 * Boolean query parameter schema
 * Handles string "true"/"false" from query params
 */
export const booleanQuerySchema = z
  .union([z.boolean(), z.string()])
  .transform((val) => {
    if (typeof val === 'boolean') return val
    return val.toLowerCase() === 'true'
  })

/**
 * Array query parameter schema
 * Handles comma-separated strings from query params
 */
export const arrayQuerySchema = z
  .union([z.array(z.string()), z.string()])
  .transform((val) => {
    if (Array.isArray(val)) return val
    return val.split(',').map((v) => v.trim()).filter(Boolean)
  })

/**
 * Numeric range schema
 */
export const numericRangeSchema = z.object({
  min: z.coerce.number().optional(),
  max: z.coerce.number().optional(),
})

/**
 * Published filter schema
 */
export const publishedFilterSchema = z.object({
  published: booleanQuerySchema.optional(),
})

/**
 * Verified filter schema
 */
export const verifiedFilterSchema = z.object({
  verified: booleanQuerySchema.optional(),
})

/**
 * Category filter schema
 */
export const categoryFilterSchema = z.object({
  category: z.string().optional(),
})

/**
 * Type filter schema
 */
export const typeFilterSchema = z.object({
  type: z.string().optional(),
})

/**
 * Full article query schema
 */
export const articleQuerySchema = querySchema
  .merge(publishedFilterSchema)
  .merge(categoryFilterSchema)
  .merge(typeFilterSchema)
  .merge(z.object({
    authorId: z.string().cuid().optional(),
    sentiment: z.enum(['positive', 'neutral', 'negative']).optional(),
    level: z.string().optional(),
    projectHighlight: booleanQuerySchema.optional(),
  }))

/**
 * Full resource query schema
 */
export const resourceQuerySchema = querySchema
  .merge(verifiedFilterSchema)
  .merge(categoryFilterSchema)
  .merge(z.object({
    interactiveType: z.string().optional(),
  }))

/**
 * Response metadata schema
 */
export const responseMetadataSchema = z.object({
  timestamp: z.string().datetime(),
  requestId: z.string().optional(),
  version: z.string().optional(),
})

/**
 * Success response schema
 */
export const successResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    success: z.literal(true),
    data: dataSchema,
    metadata: responseMetadataSchema.optional(),
  })

/**
 * Error response schema
 */
export const errorResponseSchema = z.object({
  success: z.literal(false),
  error: z.string(),
  details: z.record(z.string(), z.any()).optional(),
  metadata: responseMetadataSchema.optional(),
})

/**
 * Paginated response schema
 */
export const paginatedResponseSchema = <T extends z.ZodType>(itemSchema: T) =>
  z.object({
    success: z.literal(true),
    data: z.array(itemSchema),
    pagination: z.object({
      page: z.number().int().min(1),
      limit: z.number().int().min(1),
      total: z.number().int().min(0),
      totalPages: z.number().int().min(0),
      hasMore: z.boolean(),
    }),
    metadata: responseMetadataSchema.optional(),
  })

/**
 * Type exports for TypeScript
 */
export type Pagination = z.infer<typeof paginationSchema>
export type Sort = z.infer<typeof sortSchema>
export type Search = z.infer<typeof searchSchema>
export type Query = z.infer<typeof querySchema>
export type DateRange = z.infer<typeof dateRangeSchema>
export type NumericRange = z.infer<typeof numericRangeSchema>
export type ArticleQuery = z.infer<typeof articleQuerySchema>
export type ResourceQuery = z.infer<typeof resourceQuerySchema>
export type ResponseMetadata = z.infer<typeof responseMetadataSchema>
