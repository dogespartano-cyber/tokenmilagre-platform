/**
 * Zod Validation Schemas for Users
 *
 * Server-side validation schemas for user CRUD operations
 *
 * @example
 * ```typescript
 * import { userCreateSchema } from '@/lib/schemas/user-schemas'
 *
 * const validated = userCreateSchema.parse(data)
 * ```
 */

import { z } from 'zod'
import { EMAIL_CONSTRAINTS, PASSWORD_CONSTRAINTS } from '@/lib/constants/validation'

/**
 * Role enum matching Prisma schema
 */
export const roleEnum = z.enum(['ADMIN', 'EDITOR', 'VIEWER'])

/**
 * Email validation schema
 */
export const emailSchema = z
  .string()
  .email('Invalid email format')
  .max(EMAIL_CONSTRAINTS.MAX_LENGTH, `Email must be at most ${EMAIL_CONSTRAINTS.MAX_LENGTH} characters`)
  .regex(EMAIL_CONSTRAINTS.PATTERN, 'Invalid email format')

/**
 * Password validation schema
 */
export const passwordSchema = z
  .string()
  .min(
    PASSWORD_CONSTRAINTS.MIN_LENGTH,
    `Password must be at least ${PASSWORD_CONSTRAINTS.MIN_LENGTH} characters`
  )
  .max(
    PASSWORD_CONSTRAINTS.MAX_LENGTH,
    `Password must be at most ${PASSWORD_CONSTRAINTS.MAX_LENGTH} characters`
  )

/**
 * Name validation schema
 */
export const nameSchema = z.string().min(1).max(200).optional()

/**
 * User creation schema
 */
export const userCreateSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: nameSchema,
  role: roleEnum.default('VIEWER'),
  image: z.string().url().optional(),
})

/**
 * User update schema (all fields optional)
 */
export const userUpdateSchema = z.object({
  email: emailSchema.optional(),
  password: passwordSchema.optional(),
  name: nameSchema,
  role: roleEnum.optional(),
  image: z.string().url().optional(),
  points: z.number().int().min(0).optional(),
  badges: z.string().optional(), // JSON string
})

/**
 * User query schema
 */
export const userQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(12),
  role: roleEnum.optional(),
  search: z.string().optional(),
  createdAfter: z.coerce.date().optional(),
  createdBefore: z.coerce.date().optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'email', 'name', 'role', 'points']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

/**
 * Login schema
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
})

/**
 * Award points schema
 */
export const awardPointsSchema = z.object({
  userId: z.string().cuid(),
  points: z.number().int().min(1).max(10000),
  reason: z.string().min(1).max(500).optional(),
})

/**
 * Add badge schema
 */
export const addBadgeSchema = z.object({
  userId: z.string().cuid(),
  badge: z.string().min(1).max(100),
})

/**
 * Type exports for TypeScript
 */
export type UserCreate = z.infer<typeof userCreateSchema>
export type UserUpdate = z.infer<typeof userUpdateSchema>
export type UserQuery = z.infer<typeof userQuerySchema>
export type Login = z.infer<typeof loginSchema>
export type AwardPoints = z.infer<typeof awardPointsSchema>
export type AddBadge = z.infer<typeof addBadgeSchema>
export type Role = z.infer<typeof roleEnum>
