/**
 * Testes para schemas de validação com Zod
 *
 * Valida que as regras de negócio estão sendo aplicadas corretamente
 */

import {
  createArticleSchema,
  updateArticleSchema,
  createNewsSchema,
  createEducationalSchema,
  articleQuerySchema,
} from '@/lib/shared/validations/article'

describe('Article Validation Schemas', () => {
  describe('createArticleSchema', () => {
    const validArticle = {
      slug: 'bitcoin-atinge-nova-maxima',
      title: 'Bitcoin Atinge Nova Máxima Histórica',
      excerpt: 'Bitcoin ultrapassa US$ 100 mil pela primeira vez na história do mercado cripto.',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(10),
      category: 'bitcoin',
      sentiment: 'positive',
      tags: ['bitcoin', 'btc', 'preço', 'alta'],
      published: true,
      type: 'news',
    }

    it('deve validar artigo completo corretamente', () => {
      const result = createArticleSchema.safeParse(validArticle)
      expect(result.success).toBe(true)
    })

    it('deve rejeitar slug inválido (com maiúsculas)', () => {
      const invalid = { ...validArticle, slug: 'Bitcoin-Alta' }
      const result = createArticleSchema.safeParse(invalid)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('minúsculas')
      }
    })

    it('deve rejeitar slug com caracteres especiais', () => {
      const invalid = { ...validArticle, slug: 'bitcoin_alta!' }
      const result = createArticleSchema.safeParse(invalid)

      expect(result.success).toBe(false)
    })

    it('deve rejeitar título muito curto (<10 caracteres)', () => {
      const invalid = { ...validArticle, title: 'Bitcoin' }
      const result = createArticleSchema.safeParse(invalid)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('pelo menos 10')
      }
    })

    it('deve rejeitar título muito longo (>200 caracteres)', () => {
      const invalid = { ...validArticle, title: 'Bitcoin '.repeat(50) }
      const result = createArticleSchema.safeParse(invalid)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('muito longo')
      }
    })

    it('deve rejeitar excerpt muito curto (<20 caracteres)', () => {
      const invalid = { ...validArticle, excerpt: 'Bitcoin sobe' }
      const result = createArticleSchema.safeParse(invalid)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('pelo menos 20')
      }
    })

    it('deve rejeitar conteúdo muito curto (<100 caracteres)', () => {
      const invalid = { ...validArticle, content: 'Conteúdo curto demais.' }
      const result = createArticleSchema.safeParse(invalid)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('pelo menos 100')
      }
    })

    it('deve rejeitar categoria inválida', () => {
      const invalid = { ...validArticle, category: 'categoria-invalida' }
      const result = createArticleSchema.safeParse(invalid)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('inválida')
      }
    })

    it('deve aceitar todas as categorias válidas', () => {
      const validCategories = [
        'bitcoin',
        'ethereum',
        'defi',
        'politica',
        'nfts',
        'altcoins',
        'blockchain',
        'trading',
        'seguranca',
        'desenvolvimento',
      ]

      validCategories.forEach(category => {
        const article = { ...validArticle, category }
        const result = createArticleSchema.safeParse(article)
        expect(result.success).toBe(true)
      })
    })

    it('deve rejeitar sentiment inválido', () => {
      const invalid = { ...validArticle, sentiment: 'very-positive' }
      const result = createArticleSchema.safeParse(invalid)

      expect(result.success).toBe(false)
    })

    it('deve aceitar todos os sentiments válidos', () => {
      const validSentiments = ['positive', 'neutral', 'negative']

      validSentiments.forEach(sentiment => {
        const article = { ...validArticle, sentiment }
        const result = createArticleSchema.safeParse(article)
        expect(result.success).toBe(true)
      })
    })

    it('deve rejeitar menos de 3 tags', () => {
      const invalid = { ...validArticle, tags: ['bitcoin', 'btc'] }
      const result = createArticleSchema.safeParse(invalid)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('pelo menos 3')
      }
    })

    it('deve rejeitar mais de 10 tags', () => {
      const invalid = {
        ...validArticle,
        tags: Array.from({ length: 11 }, (_, i) => `tag${i}`),
      }
      const result = createArticleSchema.safeParse(invalid)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Máximo de 10')
      }
    })

    it('deve usar published=true como default', () => {
      const article = { ...validArticle }
      delete article.published
      const result = createArticleSchema.safeParse(article)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.published).toBe(true)
      }
    })

    it('deve usar type=news como default', () => {
      const article = { ...validArticle }
      delete article.type
      const result = createArticleSchema.safeParse(article)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.type).toBe('news')
      }
    })
  })

  describe('createNewsSchema', () => {
    const validNews = {
      slug: 'bitcoin-nova-alta',
      title: 'Bitcoin Registra Nova Alta',
      excerpt: 'O preço do Bitcoin atingiu nova máxima histórica nesta quinta-feira.',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(10),
      category: 'bitcoin',
      sentiment: 'positive',
      tags: ['bitcoin', 'preço', 'alta'],
      published: true,
      type: 'news',
    }

    it('deve validar notícia corretamente', () => {
      const result = createNewsSchema.safeParse(validNews)
      expect(result.success).toBe(true)
    })

    it('deve rejeitar type diferente de news', () => {
      const invalid = { ...validNews, type: 'educational' }
      const result = createNewsSchema.safeParse(invalid)

      expect(result.success).toBe(false)
    })
  })

  describe('createEducationalSchema', () => {
    const validEducational = {
      slug: 'como-comprar-bitcoin',
      title: 'Como Comprar Bitcoin: Guia Completo para Iniciantes',
      excerpt: 'Aprenda passo a passo como comprar sua primeira fração de Bitcoin com segurança.',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(10),
      category: 'bitcoin',
      sentiment: 'neutral',
      tags: ['bitcoin', 'tutorial', 'iniciante'],
      published: true,
      type: 'educational',
      level: 'iniciante',
      contentType: 'Tutorial',
      readTime: '5 min',
    }

    it('deve validar artigo educacional corretamente', () => {
      const result = createEducationalSchema.safeParse(validEducational)
      expect(result.success).toBe(true)
    })

    it('deve rejeitar type diferente de educational', () => {
      const invalid = { ...validEducational, type: 'news' }
      const result = createEducationalSchema.safeParse(invalid)

      expect(result.success).toBe(false)
    })

    it('deve exigir campo level', () => {
      const invalid = { ...validEducational }
      delete invalid.level
      const result = createEducationalSchema.safeParse(invalid)

      expect(result.success).toBe(false)
    })

    it('deve aceitar todos os níveis válidos', () => {
      const validLevels = ['iniciante', 'intermediario', 'avancado']

      validLevels.forEach(level => {
        const article = { ...validEducational, level }
        const result = createEducationalSchema.safeParse(article)
        expect(result.success).toBe(true)
      })
    })

    it('deve exigir campo contentType', () => {
      const invalid = { ...validEducational }
      delete invalid.contentType
      const result = createEducationalSchema.safeParse(invalid)

      expect(result.success).toBe(false)
    })

    it('deve aceitar contentType Artigo ou Tutorial', () => {
      const types = ['Artigo', 'Tutorial']

      types.forEach(contentType => {
        const article = { ...validEducational, contentType }
        const result = createEducationalSchema.safeParse(article)
        expect(result.success).toBe(true)
      })
    })

    it('deve validar formato de readTime (X min)', () => {
      const valid = { ...validEducational, readTime: '10 min' }
      const result = createEducationalSchema.safeParse(valid)
      expect(result.success).toBe(true)
    })

    it('deve rejeitar readTime em formato inválido', () => {
      const invalid = { ...validEducational, readTime: '10 minutos' }
      const result = createEducationalSchema.safeParse(invalid)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('min')
      }
    })
  })

  describe('articleQuerySchema', () => {
    it('deve validar query parameters válidos', () => {
      const query = {
        type: 'news',
        category: 'bitcoin',
        page: 1,
        limit: 12,
        search: 'bitcoin',
        sentiment: 'positive',
      }
      const result = articleQuerySchema.safeParse(query)
      expect(result.success).toBe(true)
    })

    it('deve usar defaults para campos opcionais', () => {
      const query = {}
      const result = articleQuerySchema.safeParse(query)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.page).toBe(1)
        expect(result.data.limit).toBe(12)
      }
    })

    it('deve converter string para number (coerce)', () => {
      const query = { page: '2', limit: '24' }
      const result = articleQuerySchema.safeParse(query)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.page).toBe(2)
        expect(result.data.limit).toBe(24)
        expect(typeof result.data.page).toBe('number')
        expect(typeof result.data.limit).toBe('number')
      }
    })

    it('deve rejeitar page negativa ou zero', () => {
      const invalid = { page: 0 }
      const result = articleQuerySchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })

    it('deve rejeitar limit maior que 100', () => {
      const invalid = { limit: 150 }
      const result = articleQuerySchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })

    it('deve rejeitar limit menor que 1', () => {
      const invalid = { limit: 0 }
      const result = articleQuerySchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })

    it('deve aceitar type como all', () => {
      const query = { type: 'all' }
      const result = articleQuerySchema.safeParse(query)
      expect(result.success).toBe(true)
    })

    it('deve aceitar sentiment como all', () => {
      const query = { sentiment: 'all' }
      const result = articleQuerySchema.safeParse(query)
      expect(result.success).toBe(true)
    })
  })

  describe('updateArticleSchema', () => {
    it('deve validar update com apenas alguns campos', () => {
      const partial = {
        id: 'article-id-123',
        title: 'Novo Título Atualizado',
      }
      const result = updateArticleSchema.safeParse(partial)
      expect(result.success).toBe(true)
    })

    it('deve exigir campo id', () => {
      const invalid = { title: 'Apenas título' }
      const result = updateArticleSchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })

    it('deve permitir atualizar apenas tags', () => {
      const update = {
        id: 'article-id-123',
        tags: ['nova', 'tags', 'aqui'],
      }
      const result = updateArticleSchema.safeParse(update)
      expect(result.success).toBe(true)
    })

    it('deve manter validações dos campos quando fornecidos', () => {
      const invalid = {
        id: 'article-id-123',
        title: 'Curto', // Menor que 10 caracteres
      }
      const result = updateArticleSchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })
  })
})
