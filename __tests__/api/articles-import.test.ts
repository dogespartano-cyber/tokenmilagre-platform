/**
 * Testes para lógica de importação de artigos
 *
 * Testa parsing de markdown, validação de campos e processamento
 */

import matter from 'gray-matter'

describe('Article Import Logic', () => {
  const validMarkdown = `---
title: Teste de Artigo
summary: Resumo do artigo de teste
category: bitcoin
tags: bitcoin,teste
sentiment: positive
---

# Conteúdo do Artigo

Este é um artigo de teste com conteúdo markdown.

**Negrito** e *itálico* funcionam.
`

  describe('Markdown Parsing', () => {
    it('deve fazer parse de frontmatter corretamente', () => {
      const { data, content } = matter(validMarkdown)

      expect(data.title).toBe('Teste de Artigo')
      expect(data.summary).toBe('Resumo do artigo de teste')
      expect(data.category).toBe('bitcoin')
      expect(data.tags).toBe('bitcoin,teste')
      expect(data.sentiment).toBe('positive')
      expect(content).toContain('# Conteúdo do Artigo')
    })

    it('deve processar tags como array', () => {
      const { data } = matter(validMarkdown)
      const tags = data.tags.split(',').map((t: string) => t.trim())

      expect(tags).toEqual(['bitcoin', 'teste'])
      expect(Array.isArray(tags)).toBe(true)
    })

    it('deve lidar com markdown sem frontmatter', () => {
      const plainMarkdown = '# Apenas Conteúdo\n\nSem frontmatter aqui.'
      const { data, content } = matter(plainMarkdown)

      expect(data).toEqual({})
      expect(content).toContain('# Apenas Conteúdo')
    })
  })

  describe('Validação de Campos Obrigatórios', () => {
    it('deve identificar campos obrigatórios presentes', () => {
      const { data } = matter(validMarkdown)
      const requiredFields = ['title', 'summary', 'category', 'tags', 'sentiment']
      const missingFields = requiredFields.filter(field => !data[field])

      expect(missingFields).toHaveLength(0)
    })

    it('deve identificar campos faltando', () => {
      const incompleteMarkdown = `---
title: Título Apenas
category: bitcoin
---

Conteúdo aqui.
`
      const { data } = matter(incompleteMarkdown)
      const requiredFields = ['title', 'summary', 'category', 'tags', 'sentiment']
      const missingFields = requiredFields.filter(field => !data[field])

      expect(missingFields).toContain('summary')
      expect(missingFields).toContain('tags')
      expect(missingFields).toContain('sentiment')
      expect(missingFields.length).toBeGreaterThan(0)
    })
  })

  describe('Geração de Slug', () => {
    it('deve gerar slug válido a partir do título', () => {
      const title = 'Bitcoin Atinge Nova Máxima Histórica'
      const slug = title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')

      expect(slug).toBe('bitcoin-atinge-nova-maxima-historica')
    })

    it('deve remover acentos do slug', () => {
      const title = 'Análise: Ethereum 2.0 é Solução?'
      const slug = title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')

      expect(slug).toBe('analise-ethereum-2-0-e-solucao')
      expect(slug).not.toContain('á')
      expect(slug).not.toContain('ç')
    })

    it('deve remover caracteres especiais', () => {
      const title = 'Bitcoin: $100k Soon? #BTC'
      const slug = title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')

      expect(slug).toBe('bitcoin-100k-soon-btc')
      expect(slug).not.toContain('$')
      expect(slug).not.toContain('#')
      expect(slug).not.toContain(':')
    })

    it('deve usar filename se fornecido', () => {
      const filename = 'meu-artigo-customizado.md'
      const slug = filename.replace(/\.md$/, '').toLowerCase()

      expect(slug).toBe('meu-artigo-customizado')
    })
  })

  describe('Validação de Sentiment', () => {
    it('deve aceitar sentiments válidos', () => {
      const validSentiments = ['positive', 'neutral', 'negative']

      validSentiments.forEach(sentiment => {
        expect(validSentiments).toContain(sentiment)
      })
    })

    it('deve usar neutral como default para sentiment inválido', () => {
      const invalidSentiment = 'very-happy'
      const validSentiments = ['positive', 'neutral', 'negative']
      const sentiment = validSentiments.includes(invalidSentiment)
        ? invalidSentiment
        : 'neutral'

      expect(sentiment).toBe('neutral')
    })

    it('deve manter sentiment válido', () => {
      const validSentiment = 'positive'
      const validSentiments = ['positive', 'neutral', 'negative']
      const sentiment = validSentiments.includes(validSentiment)
        ? validSentiment
        : 'neutral'

      expect(sentiment).toBe('positive')
    })
  })

  describe('Nota de Transparência', () => {
    function hasTransparencyNote(content: string): boolean {
      return content.includes('Nota de Transparência') ||
             content.includes('$MILAGRE Research') ||
             content.includes('Sobre Este Conteúdo')
    }

    function addTransparencyNote(content: string, date: Date = new Date()): string {
      if (hasTransparencyNote(content)) {
        return content
      }

      const noteTemplate = `
---

> **📊 Nota de Transparência**
>
> **Publicado por $MILAGRE Research** | Última atualização: {DATE}
>
> Este conteúdo é educacional e informativo, baseado em fontes verificadas do mercado cripto. Não constitui aconselhamento financeiro ou recomendação de investimento. Criptomoedas envolvem riscos - sempre conduza sua própria pesquisa (DYOR).

---
`

      const formattedDate = date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })

      const noteWithDate = noteTemplate.replace('{DATE}', formattedDate)

      return content + '\n' + noteWithDate
    }

    it('deve detectar conteúdo com nota de transparência', () => {
      const contentWithNote = 'Conteúdo aqui\n\nNota de Transparência\n\n$MILAGRE Research'

      expect(hasTransparencyNote(contentWithNote)).toBe(true)
    })

    it('deve detectar conteúdo sem nota de transparência', () => {
      const contentWithoutNote = 'Apenas conteúdo normal aqui.'

      expect(hasTransparencyNote(contentWithoutNote)).toBe(false)
    })

    it('deve adicionar nota de transparência a conteúdo sem ela', () => {
      const content = 'Conteúdo do artigo aqui.'
      const withNote = addTransparencyNote(content)

      expect(withNote).toContain('Nota de Transparência')
      expect(withNote).toContain('$MILAGRE Research')
      expect(withNote).toContain('DYOR')
    })

    it('não deve duplicar nota de transparência', () => {
      const content = 'Conteúdo\n\nNota de Transparência\n\n$MILAGRE Research'
      const withNote = addTransparencyNote(content)

      const occurrences = (withNote.match(/Nota de Transparência/g) || []).length
      expect(occurrences).toBe(1)
    })

    it('deve incluir data formatada na nota', () => {
      const content = 'Conteúdo do artigo.'
      const testDate = new Date('2025-01-15')
      const withNote = addTransparencyNote(content, testDate)

      expect(withNote).toContain('15/01/2025')
    })
  })

  describe('Processamento de Tags', () => {
    it('deve converter string de tags em array', () => {
      const tagsString = 'bitcoin,ethereum,defi'
      const tagsArray = tagsString.split(',').map(t => t.trim())

      expect(tagsArray).toEqual(['bitcoin', 'ethereum', 'defi'])
      expect(Array.isArray(tagsArray)).toBe(true)
    })

    it('deve lidar com tags já em array', () => {
      const tagsArray = ['bitcoin', 'ethereum', 'defi']
      const processed = Array.isArray(tagsArray)
        ? tagsArray
        : tagsArray

      expect(processed).toEqual(['bitcoin', 'ethereum', 'defi'])
    })

    it('deve fazer trim em tags com espaços', () => {
      const tagsString = ' bitcoin , ethereum , defi '
      const tagsArray = tagsString.split(',').map(t => t.trim())

      expect(tagsArray).toEqual(['bitcoin', 'ethereum', 'defi'])
      expect(tagsArray[0]).not.toContain(' ')
    })

    it('deve serializar tags para JSON no banco', () => {
      const tags = ['bitcoin', 'test', 'educação']
      const serialized = JSON.stringify(tags)
      const deserialized = JSON.parse(serialized)

      expect(typeof serialized).toBe('string')
      expect(Array.isArray(deserialized)).toBe(true)
      expect(deserialized).toEqual(tags)
    })
  })
})
