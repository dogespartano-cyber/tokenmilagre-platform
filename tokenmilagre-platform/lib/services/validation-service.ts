/**
 * ValidationService - Centralized Validation System
 *
 * Provides server-side validation using Zod schemas with:
 * - Type-safe validation
 * - Automatic error formatting
 * - Content sanitization (XSS prevention)
 * - Slug generation from titles
 * - Read time calculation
 * - Integration with ErrorService
 *
 * @example
 * ```typescript
 * import { ValidationService } from '@/lib/services/validation-service'
 * import { articleCreateSchema } from '@/lib/schemas/article-schemas'
 *
 * const validator = new ValidationService()
 *
 * // Validate and sanitize
 * const article = validator.validate(articleCreateSchema, data)
 *
 * // Generate slug
 * const slug = validator.generateSlug('Bitcoin Atinge US$ 100 mil!')
 * // => 'bitcoin-atinge-us-100-mil'
 *
 * // Calculate read time
 * const readTime = validator.calculateReadTime(content)
 * // => 5 (minutes)
 * ```
 */

import { z } from 'zod'
import DOMPurify from 'isomorphic-dompurify'
import { ValidationError } from './error-service'
import { logger } from './logger-service'

/**
 * Configuration options for ValidationService
 */
export interface ValidationServiceOptions {
  /** Whether to log validation errors (default: true) */
  logErrors?: boolean

  /** Whether to sanitize HTML content (default: true) */
  sanitizeHtml?: boolean
}

/**
 * Validation Service
 * Centralized validation logic with Zod integration
 */
export class ValidationService {
  private readonly options: Required<ValidationServiceOptions>

  /**
   * Creates a new ValidationService instance
   *
   * @param options - Configuration options
   */
  constructor(options: ValidationServiceOptions = {}) {
    this.options = {
      logErrors: options.logErrors ?? true,
      sanitizeHtml: options.sanitizeHtml ?? true,
    }
  }

  /**
   * Validates data against a Zod schema
   * Throws ValidationError if validation fails
   *
   * @param schema - Zod schema to validate against
   * @param data - Data to validate
   * @returns Validated and typed data
   *
   * @example
   * ```typescript
   * const article = validator.validate(articleCreateSchema, requestBody)
   * ```
   */
  validate<T extends z.ZodType>(schema: T, data: unknown): z.infer<T> {
    const result = schema.safeParse(data)

    if (!result.success) {
      const errors = result.error.flatten()

      if (this.options.logErrors) {
        logger.warn('Validation failed', {
          fieldErrors: errors.fieldErrors,
          formErrors: errors.formErrors,
        })
      }

      throw new ValidationError('Dados inválidos', {
        fieldErrors: errors.fieldErrors,
        formErrors: errors.formErrors,
      })
    }

    return result.data
  }

  /**
   * Validates data and returns result without throwing
   * Useful for conditional validation or user feedback
   *
   * @param schema - Zod schema
   * @param data - Data to validate
   * @returns Validation result with success flag
   *
   * @example
   * ```typescript
   * const result = validator.validateSafe(schema, data)
   * if (result.success) {
   *   // Use result.data
   * } else {
   *   // Show result.errors to user
   * }
   * ```
   */
  validateSafe<T extends z.ZodType>(
    schema: T,
    data: unknown
  ): { success: true; data: z.infer<T> } | { success: false; errors: z.ZodFormattedError<z.infer<T>> } {
    const result = schema.safeParse(data)

    if (result.success) {
      return { success: true, data: result.data }
    }

    return {
      success: false,
      errors: result.error.flatten() as z.ZodFormattedError<z.infer<T>>,
    }
  }

  /**
   * Sanitizes HTML content to prevent XSS attacks
   * Removes dangerous tags and attributes while preserving safe formatting
   *
   * @param html - HTML content to sanitize
   * @param options - DOMPurify configuration
   * @returns Sanitized HTML
   *
   * @example
   * ```typescript
   * const safe = validator.sanitizeHtml('<script>alert("xss")</script><p>Safe content</p>')
   * // => '<p>Safe content</p>'
   * ```
   */
  sanitizeHtml(html: string, options?: DOMPurify.Config): string {
    if (!this.options.sanitizeHtml) {
      return html
    }

    const defaultOptions: DOMPurify.Config = {
      ALLOWED_TAGS: [
        'p',
        'br',
        'strong',
        'em',
        'u',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'ul',
        'ol',
        'li',
        'a',
        'blockquote',
        'code',
        'pre',
        'img',
      ],
      ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id'],
      ALLOW_DATA_ATTR: false,
    }

    return DOMPurify.sanitize(html, { ...defaultOptions, ...options })
  }

  /**
   * Generates URL-safe slug from text
   * - Converts to lowercase
   * - Removes accents/diacritics
   * - Replaces spaces and special chars with hyphens
   * - Removes consecutive hyphens
   *
   * @param text - Text to convert to slug
   * @param maxLength - Maximum slug length (default: 100)
   * @returns URL-safe slug
   *
   * @example
   * ```typescript
   * validator.generateSlug('Bitcoin Atinge R$ 100 mil!')
   * // => 'bitcoin-atinge-r-100-mil'
   *
   * validator.generateSlug('Ação & Reação: Como Funciona?')
   * // => 'acao-reacao-como-funciona'
   * ```
   */
  generateSlug(text: string, maxLength: number = 100): string {
    return text
      .normalize('NFD') // Decompose accents
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special chars except hyphens and spaces
      .replace(/[\s_]+/g, '-') // Replace spaces and underscores with hyphens
      .replace(/-+/g, '-') // Replace consecutive hyphens with single hyphen
      .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
      .substring(0, maxLength)
  }

  /**
   * Calculates estimated reading time based on average reading speed
   * Assumes 200 words per minute (average adult reading speed)
   *
   * @param content - Article content (plain text or HTML)
   * @param wordsPerMinute - Reading speed (default: 200)
   * @returns Estimated reading time in minutes (minimum 1)
   *
   * @example
   * ```typescript
   * const content = 'Lorem ipsum...' // 500 words
   * validator.calculateReadTime(content)
   * // => 3 (minutes)
   * ```
   */
  calculateReadTime(content: string, wordsPerMinute: number = 200): number {
    // Strip HTML tags
    const plainText = content.replace(/<[^>]*>/g, '')

    // Count words (split by whitespace)
    const wordCount = plainText.trim().split(/\s+/).length

    // Calculate minutes, minimum 1
    const minutes = Math.ceil(wordCount / wordsPerMinute)

    return Math.max(1, minutes)
  }

  /**
   * Validates email format (basic check)
   *
   * @param email - Email to validate
   * @returns True if valid email format
   *
   * @example
   * ```typescript
   * validator.isValidEmail('user@example.com') // => true
   * validator.isValidEmail('invalid-email') // => false
   * ```
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  /**
   * Validates URL format
   *
   * @param url - URL to validate
   * @returns True if valid URL
   *
   * @example
   * ```typescript
   * validator.isValidUrl('https://example.com') // => true
   * validator.isValidUrl('not a url') // => false
   * ```
   */
  isValidUrl(url: string): boolean {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  /**
   * Extracts domain from URL
   *
   * @param url - URL to extract domain from
   * @returns Domain name or null if invalid
   *
   * @example
   * ```typescript
   * validator.extractDomain('https://www.example.com/path')
   * // => 'example.com'
   * ```
   */
  extractDomain(url: string): string | null {
    try {
      const urlObj = new URL(url)
      return urlObj.hostname.replace(/^www\./, '')
    } catch {
      return null
    }
  }

  /**
   * Validates and normalizes citation data
   * Automatically extracts domain from URL
   *
   * @param citation - Citation object with url
   * @returns Normalized citation with domain
   *
   * @example
   * ```typescript
   * const citation = validator.normalizeCitation({
   *   url: 'https://www.coindesk.com/article',
   *   title: 'Article Title'
   * })
   * // => { url: '...', title: '...', domain: 'coindesk.com' }
   * ```
   */
  normalizeCitation(citation: { url: string; title?: string }): {
    url: string
    title?: string
    domain: string | null
  } {
    const domain = this.extractDomain(citation.url)

    return {
      ...citation,
      domain,
    }
  }

  /**
   * Checks if slug is unique (hook for database check)
   * This is a placeholder - should be implemented with actual DB query
   *
   * @param slug - Slug to check
   * @param excludeId - Article ID to exclude from check (for updates)
   * @returns Promise resolving to true if unique
   */
  async isSlugUnique(slug: string, excludeId?: string): Promise<boolean> {
    // This should query the database
    // For now, just validate format
    logger.debug('Checking slug uniqueness', { slug, excludeId })

    // TODO: Implement actual database check
    // const existing = await prisma.article.findUnique({
    //   where: { slug },
    //   select: { id: true }
    // })
    // return !existing || existing.id === excludeId

    return true
  }

  /**
   * Validates file upload (size, type)
   *
   * @param file - File object
   * @param options - Validation options
   * @returns True if valid
   *
   * @example
   * ```typescript
   * validator.validateFile(file, {
   *   maxSize: 5 * 1024 * 1024, // 5MB
   *   allowedTypes: ['image/jpeg', 'image/png']
   * })
   * ```
   */
  validateFile(
    file: { size: number; type: string },
    options: {
      maxSize?: number
      allowedTypes?: string[]
    } = {}
  ): boolean {
    const { maxSize = 10 * 1024 * 1024, allowedTypes = [] } = options

    // Check size
    if (file.size > maxSize) {
      throw new ValidationError('Arquivo muito grande', {
        maxSize,
        actualSize: file.size,
      })
    }

    // Check type
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      throw new ValidationError('Tipo de arquivo não permitido', {
        allowedTypes,
        actualType: file.type,
      })
    }

    return true
  }

  /**
   * Strips HTML tags from text
   *
   * @param html - HTML content
   * @returns Plain text
   *
   * @example
   * ```typescript
   * validator.stripHtml('<p>Hello <strong>World</strong></p>')
   * // => 'Hello World'
   * ```
   */
  stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '').trim()
  }

  /**
   * Truncates text to specified length with ellipsis
   *
   * @param text - Text to truncate
   * @param maxLength - Maximum length
   * @param ellipsis - String to append (default: '...')
   * @returns Truncated text
   *
   * @example
   * ```typescript
   * validator.truncate('Long text here', 10)
   * // => 'Long te...'
   * ```
   */
  truncate(text: string, maxLength: number, ellipsis: string = '...'): string {
    if (text.length <= maxLength) {
      return text
    }

    return text.substring(0, maxLength - ellipsis.length) + ellipsis
  }
}

/**
 * Singleton instance for convenience
 */
export const validationService = new ValidationService()
