/**
 * Zod Validation Schemas for Chat/AI Interactions
 *
 * Server-side validation schemas for admin chat and AI interactions
 *
 * @example
 * ```typescript
 * import { chatMessageSchema } from '@/lib/schemas/chat-schemas'
 *
 * const result = chatMessageSchema.safeParse(data)
 * if (!result.success) {
 *   throw new ValidationError('Invalid chat message', { errors: result.error.flatten() })
 * }
 * ```
 */

import { z } from 'zod'

/**
 * Message role enum (OpenAI/Perplexity compatible)
 */
export const messageRoleEnum = z.enum(['system', 'user', 'assistant'])

/**
 * Perplexity model enum
 */
export const perplexityModelEnum = z.enum(['sonar', 'sonar-pro'])

/**
 * Search recency filter enum
 */
export const searchRecencyEnum = z.enum(['day', 'week', 'month', 'year'])

/**
 * Single chat message schema
 */
export const chatMessageItemSchema = z.object({
  role: messageRoleEnum,
  content: z.string().min(1).max(10000),
})

/**
 * Chat request body schema
 */
export const chatRequestSchema = z.object({
  messages: z.array(chatMessageItemSchema).min(1).max(50),
  pathname: z.string().optional(),
  pageData: z.record(z.string(), z.any()).optional(),
  model: perplexityModelEnum.optional().default('sonar'),
})

/**
 * Chat message validation (single message)
 */
export const chatMessageSchema = z.object({
  message: z.string().min(1, 'Mensagem obrigatória').max(4000, 'Mensagem muito longa (máximo 4000 caracteres)'),
  context: z.string().optional(),
  conversationId: z.string().optional(),
  model: perplexityModelEnum.optional(),
  temperature: z.number().min(0).max(1).optional(),
  maxTokens: z.number().min(100).max(4000).optional(),
})

/**
 * Type exports for TypeScript
 */
export type MessageRole = z.infer<typeof messageRoleEnum>
export type PerplexityModel = z.infer<typeof perplexityModelEnum>
export type SearchRecency = z.infer<typeof searchRecencyEnum>
export type ChatMessageItem = z.infer<typeof chatMessageItemSchema>
export type ChatRequest = z.infer<typeof chatRequestSchema>
export type ChatMessage = z.infer<typeof chatMessageSchema>
