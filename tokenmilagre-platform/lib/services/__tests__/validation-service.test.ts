/**
 * Tests for ValidationService
 * Coverage target: >80% (aiming for 95%+)
 */

// Mock Next.js server modules BEFORE imports
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((body, init) => ({
      body,
      status: init?.status || 200,
    })),
  },
}))

// Mock logger
jest.mock('../logger-service', () => ({
  logger: {
    warn: jest.fn(),
    debug: jest.fn(),
  },
}))

import { z } from 'zod'
import { ValidationService } from '../validation-service'
import { ValidationError } from '../error-service'
import { logger } from '../logger-service'
import {
  articleCreateSchema,
  articleUpdateSchema,
  slugSchema,
  titleSchema,
  contentSchema,
} from '@/lib/schemas/article-schemas'

describe('ValidationService', () => {
  let validator: ValidationService

  beforeEach(() => {
    validator = new ValidationService()
    jest.clearAllMocks()
  })

  describe('constructor', () => {
    it('should create instance with default options', () => {
      const service = new ValidationService()
      expect(service).toBeInstanceOf(ValidationService)
    })

    it('should create instance with custom options', () => {
      const service = new ValidationService({
        logErrors: false,
        sanitizeHtml: false,
      })
      expect(service).toBeInstanceOf(ValidationService)
    })
  })

  describe('validate', () => {
    it('should validate valid data successfully', () => {
      const schema = z.object({
        name: z.string().min(3),
        age: z.number().int().min(18),
      })

      const data = { name: 'John', age: 25 }
      const result = validator.validate(schema, data)

      expect(result).toEqual(data)
      expect(logger.warn).not.toHaveBeenCalled()
    })

    it('should throw ValidationError for invalid data', () => {
      const schema = z.object({
        email: z.string().email(),
        age: z.number().int().min(18),
      })

      const data = { email: 'invalid-email', age: 15 }

      expect(() => {
        validator.validate(schema, data)
      }).toThrow(ValidationError)

      expect(logger.warn).toHaveBeenCalledWith(
        'Validation failed',
        expect.objectContaining({
          fieldErrors: expect.any(Object),
        })
      )
    })

    it('should include field errors in thrown ValidationError', () => {
      const schema = z.object({
        title: z.string().min(10),
        content: z.string().min(100),
      })

      const data = { title: 'Short', content: 'Too short' }

      try {
        validator.validate(schema, data)
        fail('Should have thrown ValidationError')
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError)
        expect((error as ValidationError).context).toHaveProperty('fieldErrors')
      }
    })

    it('should not log when logErrors is false', () => {
      const service = new ValidationService({ logErrors: false })
      const schema = z.string().email()

      try {
        service.validate(schema, 'invalid')
      } catch {
        // Expected to throw
      }

      expect(logger.warn).not.toHaveBeenCalled()
    })
  })

  describe('validateSafe', () => {
    it('should return success for valid data', () => {
      const schema = z.object({ name: z.string() })
      const data = { name: 'John' }

      const result = validator.validateSafe(schema, data)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(data)
      }
    })

    it('should return errors for invalid data', () => {
      const schema = z.object({
        email: z.string().email(),
        age: z.number(),
      })
      const data = { email: 'invalid', age: 'not a number' }

      const result = validator.validateSafe(schema, data)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.errors).toHaveProperty('fieldErrors')
      }
    })
  })

  describe('sanitizeHtml', () => {
    it('should remove script tags', () => {
      const html = '<p>Safe content</p><script>alert("xss")</script>'
      const sanitized = validator.sanitizeHtml(html)

      expect(sanitized).toContain('Safe content')
      expect(sanitized).not.toContain('<script>')
      expect(sanitized).not.toContain('alert')
    })

    it('should remove dangerous attributes', () => {
      const html = '<a href="javascript:alert(\'xss\')">Click</a>'
      const sanitized = validator.sanitizeHtml(html)

      expect(sanitized).not.toContain('javascript:')
    })

    it('should preserve safe HTML tags', () => {
      const html = '<p>Paragraph</p><strong>Bold</strong><em>Italic</em>'
      const sanitized = validator.sanitizeHtml(html)

      expect(sanitized).toContain('<p>')
      expect(sanitized).toContain('<strong>')
      expect(sanitized).toContain('<em>')
    })

    it('should preserve safe attributes', () => {
      const html = '<a href="https://example.com" title="Example">Link</a>'
      const sanitized = validator.sanitizeHtml(html)

      expect(sanitized).toContain('href="https://example.com"')
      expect(sanitized).toContain('title="Example"')
    })

    it('should skip sanitization when option is false', () => {
      const service = new ValidationService({ sanitizeHtml: false })
      const html = '<script>alert("test")</script>'
      const result = service.sanitizeHtml(html)

      expect(result).toBe(html)
    })

    it('should accept custom DOMPurify options', () => {
      const html = '<p>Text</p><img src="test.jpg">'
      const sanitized = validator.sanitizeHtml(html, {
        ALLOWED_TAGS: ['p'], // Only allow p tags
      })

      expect(sanitized).toContain('<p>')
      expect(sanitized).not.toContain('<img>')
    })
  })

  describe('generateSlug', () => {
    it('should convert text to lowercase slug', () => {
      const slug = validator.generateSlug('Hello World')
      expect(slug).toBe('hello-world')
    })

    it('should remove accents and diacritics', () => {
      const slug = validator.generateSlug('Ação & Reação: Análise')
      expect(slug).toBe('acao-reacao-analise')
    })

    it('should replace spaces with hyphens', () => {
      const slug = validator.generateSlug('Bitcoin Price Analysis')
      expect(slug).toBe('bitcoin-price-analysis')
    })

    it('should remove special characters', () => {
      const slug = validator.generateSlug('Bitcoin @ $100k! (New High)')
      expect(slug).toBe('bitcoin-100k-new-high')
    })

    it('should handle consecutive spaces', () => {
      const slug = validator.generateSlug('Multiple    Spaces')
      expect(slug).toBe('multiple-spaces')
    })

    it('should remove leading and trailing hyphens', () => {
      const slug = validator.generateSlug('  -  Test  -  ')
      expect(slug).toBe('test')
    })

    it('should respect maxLength parameter', () => {
      const longText = 'This is a very long title that should be truncated to fit the maximum length'
      const slug = validator.generateSlug(longText, 30)

      expect(slug.length).toBeLessThanOrEqual(30)
    })

    it('should handle Portuguese characters', () => {
      const slug = validator.generateSlug('Açúcar, Café e Pão')
      expect(slug).toBe('acucar-cafe-e-pao')
    })

    it('should handle numbers correctly', () => {
      const slug = validator.generateSlug('Bitcoin 100k 2024')
      expect(slug).toBe('bitcoin-100k-2024')
    })

    it('should handle empty string', () => {
      const slug = validator.generateSlug('')
      expect(slug).toBe('')
    })
  })

  describe('calculateReadTime', () => {
    it('should calculate read time for short content', () => {
      const content = 'word '.repeat(100) // 100 words
      const readTime = validator.calculateReadTime(content)

      expect(readTime).toBe(1) // Minimum 1 minute
    })

    it('should calculate read time for medium content', () => {
      const content = 'word '.repeat(400) // 400 words
      const readTime = validator.calculateReadTime(content)

      expect(readTime).toBe(2) // 400 / 200 = 2 minutes
    })

    it('should calculate read time for long content', () => {
      const content = 'word '.repeat(1000) // 1000 words
      const readTime = validator.calculateReadTime(content)

      expect(readTime).toBe(5) // 1000 / 200 = 5 minutes
    })

    it('should strip HTML tags before counting', () => {
      const content = '<p>' + 'word '.repeat(200) + '</p><strong>More words</strong>'
      const readTime = validator.calculateReadTime(content)

      expect(readTime).toBeGreaterThanOrEqual(1)
    })

    it('should use custom words per minute', () => {
      const content = 'word '.repeat(600) // 600 words
      const readTime = validator.calculateReadTime(content, 300) // Fast reader

      expect(readTime).toBe(2) // 600 / 300 = 2 minutes
    })

    it('should return minimum 1 minute for very short content', () => {
      const content = 'Just a few words'
      const readTime = validator.calculateReadTime(content)

      expect(readTime).toBe(1)
    })
  })

  describe('isValidEmail', () => {
    it('should validate correct email', () => {
      expect(validator.isValidEmail('user@example.com')).toBe(true)
      expect(validator.isValidEmail('test.user@domain.co.uk')).toBe(true)
      expect(validator.isValidEmail('user+tag@example.com')).toBe(true)
    })

    it('should reject invalid email', () => {
      expect(validator.isValidEmail('invalid')).toBe(false)
      expect(validator.isValidEmail('@example.com')).toBe(false)
      expect(validator.isValidEmail('user@')).toBe(false)
      expect(validator.isValidEmail('user @example.com')).toBe(false)
    })
  })

  describe('isValidUrl', () => {
    it('should validate correct URLs', () => {
      expect(validator.isValidUrl('https://example.com')).toBe(true)
      expect(validator.isValidUrl('http://example.com/path')).toBe(true)
      expect(validator.isValidUrl('https://sub.example.com:8080/path?query=1')).toBe(true)
    })

    it('should reject invalid URLs', () => {
      expect(validator.isValidUrl('not a url')).toBe(false)
      expect(validator.isValidUrl('example.com')).toBe(false) // Missing protocol
      expect(validator.isValidUrl('http://')).toBe(false)
    })
  })

  describe('extractDomain', () => {
    it('should extract domain from URL', () => {
      expect(validator.extractDomain('https://www.example.com/path')).toBe('example.com')
      expect(validator.extractDomain('https://example.com')).toBe('example.com')
      expect(validator.extractDomain('http://subdomain.example.com/page')).toBe('subdomain.example.com')
    })

    it('should remove www prefix', () => {
      expect(validator.extractDomain('https://www.coindesk.com/article')).toBe('coindesk.com')
    })

    it('should return null for invalid URL', () => {
      expect(validator.extractDomain('not a url')).toBeNull()
      expect(validator.extractDomain('')).toBeNull()
    })
  })

  describe('normalizeCitation', () => {
    it('should normalize citation with domain', () => {
      const citation = {
        url: 'https://www.example.com/article',
        title: 'Article Title',
      }

      const normalized = validator.normalizeCitation(citation)

      expect(normalized).toEqual({
        url: 'https://www.example.com/article',
        title: 'Article Title',
        domain: 'example.com',
      })
    })

    it('should handle citation without title', () => {
      const citation = {
        url: 'https://example.com',
      }

      const normalized = validator.normalizeCitation(citation)

      expect(normalized.domain).toBe('example.com')
      expect(normalized.title).toBeUndefined()
    })

    it('should set domain to null for invalid URL', () => {
      const citation = {
        url: 'invalid-url',
        title: 'Title',
      }

      const normalized = validator.normalizeCitation(citation)

      expect(normalized.domain).toBeNull()
    })
  })

  describe('validateFile', () => {
    it('should validate file within size limit', () => {
      const file = { size: 1024 * 1024, type: 'image/jpeg' } // 1MB

      expect(() => {
        validator.validateFile(file, {
          maxSize: 5 * 1024 * 1024, // 5MB
          allowedTypes: ['image/jpeg', 'image/png'],
        })
      }).not.toThrow()
    })

    it('should throw for file exceeding size limit', () => {
      const file = { size: 20 * 1024 * 1024, type: 'image/jpeg' } // 20MB

      expect(() => {
        validator.validateFile(file, { maxSize: 10 * 1024 * 1024 })
      }).toThrow(ValidationError)
    })

    it('should validate allowed file types', () => {
      const file = { size: 1024, type: 'image/png' }

      expect(() => {
        validator.validateFile(file, {
          allowedTypes: ['image/jpeg', 'image/png'],
        })
      }).not.toThrow()
    })

    it('should throw for disallowed file type', () => {
      const file = { size: 1024, type: 'application/pdf' }

      expect(() => {
        validator.validateFile(file, {
          allowedTypes: ['image/jpeg', 'image/png'],
        })
      }).toThrow(ValidationError)
    })

    it('should use default max size of 10MB', () => {
      const file = { size: 11 * 1024 * 1024, type: 'image/jpeg' } // 11MB

      expect(() => {
        validator.validateFile(file)
      }).toThrow(ValidationError)
    })

    it('should allow any type when allowedTypes is empty', () => {
      const file = { size: 1024, type: 'application/pdf' }

      expect(() => {
        validator.validateFile(file, { allowedTypes: [] })
      }).not.toThrow()
    })
  })

  describe('stripHtml', () => {
    it('should remove all HTML tags', () => {
      const html = '<p>Hello <strong>World</strong></p>'
      const stripped = validator.stripHtml(html)

      expect(stripped).toBe('Hello World')
      expect(stripped).not.toContain('<')
      expect(stripped).not.toContain('>')
    })

    it('should handle nested tags', () => {
      const html = '<div><p><span>Text</span></p></div>'
      const stripped = validator.stripHtml(html)

      expect(stripped).toBe('Text')
    })

    it('should trim whitespace', () => {
      const html = '  <p>  Text  </p>  '
      const stripped = validator.stripHtml(html)

      expect(stripped).toBe('Text')
    })

    it('should handle empty HTML', () => {
      const stripped = validator.stripHtml('<div></div>')
      expect(stripped).toBe('')
    })
  })

  describe('truncate', () => {
    it('should not truncate text shorter than maxLength', () => {
      const text = 'Short text'
      const truncated = validator.truncate(text, 20)

      expect(truncated).toBe('Short text')
    })

    it('should truncate long text with default ellipsis', () => {
      const text = 'This is a very long text that should be truncated'
      const truncated = validator.truncate(text, 20)

      expect(truncated).toBe('This is a very lo...')
      expect(truncated.length).toBe(20)
    })

    it('should use custom ellipsis', () => {
      const text = 'Long text here'
      const truncated = validator.truncate(text, 10, ' [...]')

      expect(truncated).toBe('Long [...]')
      expect(truncated.length).toBe(10)
    })

    it('should handle exact length match', () => {
      const text = '12345'
      const truncated = validator.truncate(text, 5)

      expect(truncated).toBe('12345')
    })
  })

  describe('isSlugUnique', () => {
    it('should return true (placeholder implementation)', async () => {
      const isUnique = await validator.isSlugUnique('test-slug')

      expect(isUnique).toBe(true)
      expect(logger.debug).toHaveBeenCalledWith(
        'Checking slug uniqueness',
        expect.objectContaining({ slug: 'test-slug' })
      )
    })

    it('should handle excludeId parameter', async () => {
      const isUnique = await validator.isSlugUnique('test-slug', 'article-id-123')

      expect(isUnique).toBe(true)
      expect(logger.debug).toHaveBeenCalledWith(
        'Checking slug uniqueness',
        expect.objectContaining({ slug: 'test-slug', excludeId: 'article-id-123' })
      )
    })
  })

  describe('integration with Zod schemas', () => {
    it('should validate article create data', () => {
      const validData = {
        title: 'Bitcoin Atinge US$ 100 mil em Marco Histórico',
        slug: 'bitcoin-atinge-us-100-mil',
        content: 'Lorem ipsum '.repeat(50), // 100+ chars
        type: 'NEWS',
        categoryId: 'cm4x9y2z30000abc123def456',
        authorId: 'cm4x9y2z30001abc123def456',
        tagIds: ['cm4x9y2z30002abc123def456'],
        status: 'DRAFT',
      }

      const result = validator.validate(articleCreateSchema, validData)

      expect(result).toMatchObject(validData)
    })

    it('should reject article with invalid slug format', () => {
      const invalidData = {
        title: 'Valid Title Here',
        slug: 'Invalid Slug!', // Uppercase and special chars
        content: 'Lorem ipsum '.repeat(50),
        type: 'NEWS',
        categoryId: 'cm4x9y2z30000abc123def456',
        authorId: 'cm4x9y2z30001abc123def456',
        tagIds: ['cm4x9y2z30002abc123def456'],
      }

      expect(() => {
        validator.validate(articleCreateSchema, invalidData)
      }).toThrow(ValidationError)
    })

    it('should validate slug format using slugSchema', () => {
      expect(() => validator.validate(slugSchema, 'valid-slug-123')).not.toThrow()
      expect(() => validator.validate(slugSchema, 'Invalid Slug')).toThrow()
      expect(() => validator.validate(slugSchema, 'ab')).toThrow() // Too short
    })

    it('should validate title using titleSchema', () => {
      expect(() => validator.validate(titleSchema, 'Valid Title Here')).not.toThrow()
      expect(() => validator.validate(titleSchema, 'Short')).toThrow() // Too short
    })

    it('should validate content using contentSchema', () => {
      const validContent = 'Lorem ipsum '.repeat(50) // 600 chars
      expect(() => validator.validate(contentSchema, validContent)).not.toThrow()

      const shortContent = 'Too short'
      expect(() => validator.validate(contentSchema, shortContent)).toThrow()
    })
  })
})
