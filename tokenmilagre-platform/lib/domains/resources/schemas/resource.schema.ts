/**
 * Zod Validation Schemas for Resources
 *
 * Server-side validation schemas for resource CRUD operations
 *
 * @example
 * ```typescript
 * import { resourceCreateSchema } from '@/lib/schemas/resource-schemas'
 *
 * const validated = resourceCreateSchema.parse(data)
 * ```
 */

import { z } from 'zod'

/**
 * Resource category enum
 */
export const resourceCategoryEnum = z.enum([
  'wallets',
  'exchanges',
  'browsers',
  'defi',
  'explorers',
  'tools',
])

/**
 * Interactive type enum
 */
export const interactiveTypeEnum = z.enum(['calculator', 'simulator', 'map']).nullable()

/**
 * Slug validation (reusable)
 */
export const slugSchema = z
  .string()
  .min(3, 'Slug must be at least 3 characters')
  .max(100, 'Slug must be at most 100 characters')
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must contain only lowercase letters, numbers, and hyphens')

/**
 * Feature schema
 */
export const featureSchema = z.object({
  icon: z.string(),
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
})

/**
 * How-to-start step schema
 */
export const howToStartStepSchema = z.object({
  number: z.number().int().min(1),
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
})

/**
 * FAQ item schema
 */
export const faqItemSchema = z.object({
  question: z.string().min(1).max(200),
  answer: z.string().min(1).max(1000),
})

/**
 * Security tip schema
 */
export const securityTipSchema = z.object({
  icon: z.string(),
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
})

/**
 * Resource creation schema
 */
export const resourceCreateSchema = z.object({
  slug: slugSchema,
  name: z.string().min(1).max(200),
  category: resourceCategoryEnum,
  verified: z.boolean().default(true),
  shortDescription: z.string().min(10).max(500),
  officialUrl: z.string().url(),
  platforms: z.array(z.string()).min(1),
  tags: z.array(z.string()),
  heroTitle: z.string().min(1).max(200),
  heroDescription: z.string().min(1).max(500),
  heroGradient: z.string(),
  whyGoodTitle: z.string().min(1).max(200),
  whyGoodContent: z.array(z.string()),
  features: z.array(featureSchema).min(1),
  howToStartTitle: z.string().min(1).max(200),
  howToStartSteps: z.array(howToStartStepSchema).min(1),
  pros: z.array(z.string()).min(1),
  cons: z.array(z.string()).min(1),
  faq: z.array(faqItemSchema).min(1),
  securityTips: z.array(securityTipSchema),
  securityAudit: z.string().url().optional(),
  securityAuditDate: z.coerce.date().optional(),
  auditedByCommunity: z.boolean().default(false),
  toolConfig: z.any().optional(),
  interactiveType: interactiveTypeEnum.optional(),
  showCompatibleWallets: z.boolean().default(false),
  relatedResources: z.array(z.string()).optional(),
})

/**
 * Resource update schema (all fields optional)
 */
export const resourceUpdateSchema = resourceCreateSchema.partial()

/**
 * Resource query schema
 */
export const resourceQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(12),
  category: resourceCategoryEnum.optional(),
  verified: z.coerce.boolean().optional(),
  search: z.string().optional(),
  interactiveType: z.string().optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'views', 'name']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

/**
 * Type exports for TypeScript
 */
export type ResourceCreate = z.infer<typeof resourceCreateSchema>
export type ResourceUpdate = z.infer<typeof resourceUpdateSchema>
export type ResourceQuery = z.infer<typeof resourceQuerySchema>
export type Feature = z.infer<typeof featureSchema>
export type HowToStartStep = z.infer<typeof howToStartStepSchema>
export type FAQItem = z.infer<typeof faqItemSchema>
export type SecurityTip = z.infer<typeof securityTipSchema>
