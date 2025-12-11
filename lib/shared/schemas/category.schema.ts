/**
 * Zod Validation Schemas for Categories and Tags
 *
 * Server-side validation for taxonomy management
 *
 * @example
 * ```typescript
 * import { categoryCreateSchema, tagCreateSchema } from '@/lib/schemas/category-schemas'
 *
 * const category = categoryCreateSchema.parse(data)
 * const tag = tagCreateSchema.parse(tagData)
 * ```
 */

import { z } from 'zod'

/**
 * Category type enum
 */
export const categoryTypeEnum = z.enum(['news', 'educational', 'resource'])

/**
 * Category slug validation
 * - Must be URL-safe
 * - Lowercase only
 */
export const categorySlugSchema = z
  .string()
  .min(2, 'Slug deve ter no mínimo 2 caracteres')
  .max(50, 'Slug deve ter no máximo 50 caracteres')
  .regex(/^[a-z0-9-]+$/, 'Slug deve conter apenas letras minúsculas, números e hífens')

/**
 * Category create schema
 */
export const categoryCreateSchema = z.object({
  slug: categorySlugSchema,
  name: z.string().min(2).max(50),
  description: z.string().max(500).optional(),
  type: categoryTypeEnum,
  parentId: z.string().cuid('ID de categoria pai inválido').optional(),
  icon: z.string().max(50).optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor inválida (use formato HEX)').optional(),
})

/**
 * Category update schema
 */
export const categoryUpdateSchema = categoryCreateSchema.partial()

/**
 * Tag slug validation
 */
export const tagSlugSchema = z
  .string()
  .min(2, 'Slug deve ter no mínimo 2 caracteres')
  .max(30, 'Slug deve ter no máximo 30 caracteres')
  .regex(/^[a-z0-9-]+$/, 'Slug deve conter apenas letras minúsculas, números e hífens')

/**
 * Tag create schema
 */
export const tagCreateSchema = z.object({
  slug: tagSlugSchema,
  name: z.string().min(2).max(30),
})

/**
 * Tag update schema
 */
export const tagUpdateSchema = tagCreateSchema.partial()

/**
 * Type exports
 */
export type CategoryCreateInput = z.infer<typeof categoryCreateSchema>
export type CategoryUpdateInput = z.infer<typeof categoryUpdateSchema>
export type TagCreateInput = z.infer<typeof tagCreateSchema>
export type TagUpdateInput = z.infer<typeof tagUpdateSchema>
export type CategoryType = z.infer<typeof categoryTypeEnum>
