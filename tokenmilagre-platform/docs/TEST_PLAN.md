# 🧪 PLANO COMPLETO DE TESTES

**Versão**: 2.0.0
**Data**: 2025-11-18
**Objetivo de Cobertura**: Mínimo 80%

---

## 🎯 OBJETIVOS

1. **Garantir qualidade** do código antes de produção
2. **Prevenir regressões** em releases futuras
3. **Documentar comportamento esperado** via testes
4. **Acelerar desenvolvimento** com feedback rápido
5. **Atingir cobertura mínima** de 80% (unit + integration)

---

## 🏗️ PIRÂMIDE DE TESTES

```
         ┌─────────────┐
         │   E2E (10%) │  Playwright - User flows completos
         │   ~20 tests │
         └─────────────┘
              ▲
         ┌─────────────────┐
         │ Integration (30%)│  Jest + Supertest - API routes
         │    ~80 tests     │
         └─────────────────┘
              ▲
         ┌───────────────────────┐
         │    Unit Tests (60%)    │  Jest - Services, utils, hooks
         │      ~200 tests        │
         └───────────────────────┘
```

---

## 📦 STACK DE TESTES

| Tipo | Ferramenta | Propósito |
|------|------------|-----------|
| **Unit** | Jest | Services, utils, hooks |
| **Integration** | Jest + Supertest | API routes |
| **E2E** | Playwright | User flows |
| **Load** | k6 | Performance & stress |
| **Security** | OWASP ZAP | Vulnerabilities |
| **Coverage** | Istanbul (built-in Jest) | Code coverage reports |

---

## 🔬 TESTES UNITÁRIOS (60% dos testes)

### Escopo

- Services (`lib/services/*`)
- Utils (`lib/utils/*`)
- Hooks (`hooks/*`)
- Components isolados

### Configuração Jest

```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/lib', '<rootDir>/hooks'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  collectCoverageFrom: [
    'lib/**/*.ts',
    'hooks/**/*.ts',
    '!**/*.d.ts',
    '!**/*.config.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts']
}
```

### Exemplos

#### 1. ArticleService

```typescript
// lib/services/__tests__/article-service.test.ts

import { ArticleService } from '../article-service'
import { prismaMock } from '@/lib/prisma-mock'
import { LoggerService } from '../logger-service'
import { ValidationService } from '../validation-service'

describe('ArticleService', () => {
  let service: ArticleService
  let logger: LoggerService
  let validator: ValidationService

  beforeEach(() => {
    logger = new LoggerService()
    validator = new ValidationService()
    service = new ArticleService(prismaMock, logger, validator)
  })

  describe('findBySlug', () => {
    it('should return article when exists', async () => {
      const mockArticle = {
        id: 'art_1',
        slug: 'bitcoin-100k',
        title: 'Bitcoin Atinge 100k',
        type: 'news',
        status: 'published'
      }

      prismaMock.article.findUnique.mockResolvedValue(mockArticle)

      const result = await service.findBySlug('bitcoin-100k')

      expect(result).toEqual(mockArticle)
      expect(prismaMock.article.findUnique).toHaveBeenCalledWith({
        where: { slug: 'bitcoin-100k' },
        include: expect.any(Object)
      })
    })

    it('should return null when article not found', async () => {
      prismaMock.article.findUnique.mockResolvedValue(null)

      const result = await service.findBySlug('non-existent')

      expect(result).toBeNull()
    })

    it('should throw error on database failure', async () => {
      prismaMock.article.findUnique.mockRejectedValue(
        new Error('Database connection failed')
      )

      await expect(
        service.findBySlug('bitcoin-100k')
      ).rejects.toThrow('Database connection failed')
    })
  })

  describe('create', () => {
    it('should create article with valid data', async () => {
      const input = {
        title: 'Bitcoin Atinge 100k',
        excerpt: 'Criptomoeda alcança marco histórico',
        content: '## Fato Central\n\nBitcoin...',
        type: 'news' as const,
        categoryId: 'cat_1',
        tagIds: ['tag_1', 'tag_2'],
        sentiment: 'positive' as const,
        authorId: 'user_1'
      }

      const mockCreated = {
        id: 'art_1',
        slug: 'bitcoin-atinge-100k',
        ...input,
        status: 'draft',
        createdAt: new Date(),
        updatedAt: new Date()
      }

      prismaMock.article.create.mockResolvedValue(mockCreated)

      const result = await service.create(input)

      expect(result).toEqual(mockCreated)
      expect(result.slug).toBe('bitcoin-atinge-100k')
    })

    it('should throw ValidationError when data is invalid', async () => {
      const input = {
        title: '', // invalid
        excerpt: 'Too short', // invalid
        content: 'Too short', // invalid
        type: 'news' as const,
        categoryId: 'cat_1',
        tagIds: [],
        sentiment: 'positive' as const,
        authorId: 'user_1'
      }

      await expect(service.create(input)).rejects.toThrow('Validation failed')
    })

    it('should throw ConflictError when slug already exists', async () => {
      const input = {
        title: 'Bitcoin Atinge 100k',
        slug: 'bitcoin-100k', // existing slug
        excerpt: 'Criptomoeda alcança marco histórico',
        content: '## Fato Central\n\nBitcoin...',
        type: 'news' as const,
        categoryId: 'cat_1',
        tagIds: ['tag_1'],
        sentiment: 'positive' as const,
        authorId: 'user_1'
      }

      prismaMock.article.findUnique.mockResolvedValue({ id: 'existing' } as any)

      await expect(service.create(input)).rejects.toThrow('Slug already exists')
    })
  })

  describe('generateSlug', () => {
    it('should generate slug from title', async () => {
      prismaMock.article.findUnique.mockResolvedValue(null)

      const slug = await service.generateSlug('Bitcoin Atinge US$ 100 mil', 'news')

      expect(slug).toMatch(/^bitcoin-atinge-us-100-mil-\d{8}$/)
    })

    it('should increment slug on conflict', async () => {
      // First call returns existing, second returns null
      prismaMock.article.findUnique
        .mockResolvedValueOnce({ id: 'existing' } as any)
        .mockResolvedValueOnce(null)

      const slug = await service.generateSlug('Bitcoin 100k', 'news')

      expect(slug).toMatch(/^bitcoin-100k-\d{8}-2$/)
    })
  })

  describe('calculateReadTime', () => {
    it('should calculate read time correctly', () => {
      const content = 'word '.repeat(250) // 250 words
      const readTime = service.calculateReadTime(content)
      expect(readTime).toBe('1 min')
    })

    it('should round up fractional minutes', () => {
      const content = 'word '.repeat(300) // 300 words
      const readTime = service.calculateReadTime(content)
      expect(readTime).toBe('2 min')
    })
  })
})
```

#### 2. ValidationService

```typescript
// lib/services/__tests__/validation-service.test.ts

import { ValidationService } from '../validation-service'

describe('ValidationService', () => {
  let service: ValidationService

  beforeEach(() => {
    service = new ValidationService()
  })

  describe('validateArticle', () => {
    it('should pass validation for valid news article', () => {
      const article = {
        title: 'Bitcoin Atinge US$ 100 mil',
        slug: 'bitcoin-100k',
        excerpt: 'Criptomoeda alcança marco histórico com alta de 150% no ano',
        content: 'word '.repeat(500), // 500 words
        type: 'news',
        categoryId: 'cat_1',
        tagIds: ['tag_1', 'tag_2', 'tag_3'],
        sentiment: 'positive',
        authorId: 'user_1'
      }

      const result = service.validateArticle(article, 'news')

      expect(result.valid).toBe(true)
      expect(result.errors).toEqual([])
    })

    it('should fail validation for missing title', () => {
      const article = {
        slug: 'bitcoin-100k',
        excerpt: 'Resumo...',
        content: 'word '.repeat(500),
        type: 'news',
        categoryId: 'cat_1',
        tagIds: ['tag_1', 'tag_2', 'tag_3'],
        sentiment: 'positive',
        authorId: 'user_1'
      }

      const result = service.validateArticle(article, 'news')

      expect(result.valid).toBe(false)
      expect(result.errors).toContain('title: Título é obrigatório')
    })

    it('should fail validation for short content', () => {
      const article = {
        title: 'Bitcoin 100k',
        slug: 'bitcoin-100k',
        excerpt: 'Resumo...',
        content: 'Too short', // < 500 chars
        type: 'news',
        categoryId: 'cat_1',
        tagIds: ['tag_1', 'tag_2', 'tag_3'],
        sentiment: 'positive',
        authorId: 'user_1'
      }

      const result = service.validateArticle(article, 'news')

      expect(result.valid).toBe(false)
      expect(result.errors[0]).toMatch(/Conteúdo deve ter pelo menos/)
    })
  })

  describe('sanitizeMarkdown', () => {
    it('should remove script tags', () => {
      const input = '# Title\n<script>alert("xss")</script>\nContent'
      const output = service.sanitizeMarkdown(input)

      expect(output).not.toContain('<script>')
      expect(output).toContain('# Title')
      expect(output).toContain('Content')
    })

    it('should preserve safe HTML tags', () => {
      const input = '# Title\n<strong>Bold</strong>\n<em>Italic</em>'
      const output = service.sanitizeMarkdown(input)

      expect(output).toContain('<strong>Bold</strong>')
      expect(output).toContain('<em>Italic</em>')
    })
  })
})
```

---

## 🔗 TESTES DE INTEGRAÇÃO (30%)

### Escopo

- API routes (`app/api/v2/**`)
- Database operations (Prisma)
- External API integrations

### Setup

```typescript
// __tests__/integration/setup.ts

import { PrismaClient } from '@/lib/generated/prisma'

export const prisma = new PrismaClient()

beforeAll(async () => {
  // Run migrations
  await prisma.$executeRawUnsafe('DROP SCHEMA public CASCADE; CREATE SCHEMA public;')
  // Apply migrations
  // Seed test data
})

afterAll(async () => {
  await prisma.$disconnect()
})

afterEach(async () => {
  // Clean up data between tests
  await prisma.article.deleteMany()
  await prisma.tag.deleteMany()
  await prisma.category.deleteMany()
})
```

### Exemplos

#### 1. POST /api/v2/articles

```typescript
// __tests__/integration/api/articles.test.ts

import request from 'supertest'
import { createServer } from '@/lib/test-server'
import { prisma } from '../setup'

describe('POST /api/v2/articles', () => {
  let server: any
  let authToken: string

  beforeAll(async () => {
    server = createServer()

    // Create test user and get auth token
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        password: 'hashed',
        role: 'ADMIN'
      }
    })

    authToken = generateToken(user.id)
  })

  it('should create article with valid data', async () => {
    const category = await prisma.category.create({
      data: { slug: 'bitcoin', name: 'Bitcoin', type: 'news' }
    })

    const response = await request(server)
      .post('/api/v2/articles')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Bitcoin Atinge 100k',
        excerpt: 'Criptomoeda alcança marco histórico',
        content: '## Fato Central\n\n' + 'word '.repeat(500),
        type: 'news',
        categoryId: category.id,
        tagIds: [],
        sentiment: 'positive'
      })
      .expect(201)

    expect(response.body.success).toBe(true)
    expect(response.body.data.id).toBeDefined()
    expect(response.body.data.slug).toMatch(/^bitcoin-atinge-100k/)

    // Verify in database
    const article = await prisma.article.findUnique({
      where: { id: response.body.data.id }
    })

    expect(article).toBeDefined()
    expect(article!.title).toBe('Bitcoin Atinge 100k')
  })

  it('should return 401 when not authenticated', async () => {
    await request(server)
      .post('/api/v2/articles')
      .send({ title: 'Test' })
      .expect(401)
  })

  it('should return 403 when user is not admin/editor', async () => {
    const viewer = await prisma.user.create({
      data: {
        email: 'viewer@example.com',
        password: 'hashed',
        role: 'VIEWER'
      }
    })

    const viewerToken = generateToken(viewer.id)

    await request(server)
      .post('/api/v2/articles')
      .set('Authorization', `Bearer ${viewerToken}`)
      .send({ title: 'Test' })
      .expect(403)
  })

  it('should return 400 for invalid data', async () => {
    const response = await request(server)
      .post('/api/v2/articles')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: '', // invalid
        excerpt: 'Too short' // invalid
      })
      .expect(400)

    expect(response.body.success).toBe(false)
    expect(response.body.error.code).toBe('VALIDATION_ERROR')
    expect(response.body.error.details.length).toBeGreaterThan(0)
  })

  it('should return 409 for duplicate slug', async () => {
    const category = await prisma.category.create({
      data: { slug: 'bitcoin', name: 'Bitcoin', type: 'news' }
    })

    // Create first article
    await prisma.article.create({
      data: {
        slug: 'bitcoin-100k',
        title: 'Bitcoin 100k',
        excerpt: 'Test',
        content: 'Test',
        type: 'news',
        categoryId: category.id,
        authorId: (await prisma.user.findFirst())!.id
      }
    })

    // Try to create with same slug
    const response = await request(server)
      .post('/api/v2/articles')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Bitcoin 100k',
        slug: 'bitcoin-100k', // duplicate
        excerpt: 'Test',
        content: 'word '.repeat(500),
        type: 'news',
        categoryId: category.id,
        tagIds: [],
        sentiment: 'positive'
      })
      .expect(409)

    expect(response.body.error.code).toBe('CONFLICT')
  })
})
```

---

## 🎭 TESTES E2E (10%)

### Escopo

- User flows completos
- Interações entre páginas
- Validação de UI

### Configuração Playwright

```typescript
// playwright.config.ts

import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './__tests__/e2e',
  timeout: 30000,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    { name: 'firefox', use: { browserName: 'firefox' } },
    { name: 'webkit', use: { browserName: 'webkit' } },
  ],
})
```

### Exemplos

#### 1. Fluxo de Criação de Artigo

```typescript
// __tests__/e2e/create-article.spec.ts

import { test, expect } from '@playwright/test'

test.describe('Create Article Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/login')
    await page.fill('[name="email"]', 'admin@example.com')
    await page.fill('[name="password"]', 'password')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL('/dashboard')
  })

  test('should create news article successfully', async ({ page }) => {
    // Navigate to create article page
    await page.click('text=Criar Artigo')
    await expect(page).toHaveURL('/dashboard/criar-artigo')

    // Select type
    await page.click('[data-testid="type-news"]')

    // Type prompt
    await page.fill('[data-testid="chat-input"]', 'Bitcoin atinge US$ 100 mil')
    await page.click('[data-testid="send-button"]')

    // Wait for article generation
    await expect(page.locator('[data-testid="article-preview"]')).toBeVisible({ timeout: 30000 })

    // Verify article content
    const title = await page.locator('[data-testid="article-title"]').textContent()
    expect(title).toContain('Bitcoin')

    // Publish
    await page.click('[data-testid="publish-button"]')

    // Wait for success message
    await expect(page.locator('text=Artigo publicado com sucesso')).toBeVisible()

    // Verify redirect to articles list
    await expect(page).toHaveURL('/dashboard/artigos')

    // Verify article appears in list
    await expect(page.locator(`text=${title}`)).toBeVisible()
  })

  test('should handle validation errors gracefully', async ({ page }) => {
    await page.goto('/dashboard/criar-artigo')

    // Try to publish without generating
    await page.click('[data-testid="publish-button"]')

    // Expect error message
    await expect(page.locator('text=Nenhum artigo gerado')).toBeVisible()
  })
})
```

---

## 🔥 TESTES DE CARGA (Performance)

### k6 Configuration

```javascript
// __tests__/load/articles-api.js

import http from 'k6/http'
import { check, sleep } from 'k6'

export const options = {
  stages: [
    { duration: '2m', target: 100 }, // Ramp up to 100 users
    { duration: '5m', target: 100 }, // Stay at 100 users
    { duration: '2m', target: 200 }, // Ramp to 200 users
    { duration: '5m', target: 200 }, // Stay at 200
    { duration: '2m', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% of requests < 2s
    http_req_failed: ['rate<0.01'],    // Error rate < 1%
  },
}

export default function () {
  // GET list
  let res = http.get('http://localhost:3000/api/v2/articles?page=1&limit=20')
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 2s': (r) => r.timings.duration < 2000,
  })

  sleep(1)

  // GET single
  res = http.get('http://localhost:3000/api/v2/articles/bitcoin-100k')
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 1s': (r) => r.timings.duration < 1000,
  })

  sleep(1)
}
```

---

## 🛡️ TESTES DE SEGURANÇA

### OWASP ZAP

```bash
# Run ZAP scan
docker run -v $(pwd):/zap/wrk/:rw \
  -t owasp/zap2docker-stable \
  zap-baseline.py \
  -t http://localhost:3000 \
  -g gen.conf \
  -r security-report.html
```

### Security Test Cases

- [ ] SQL Injection attempts
- [ ] XSS payloads
- [ ] CSRF token validation
- [ ] Rate limiting bypass
- [ ] Authentication bypass
- [ ] Authorization escalation
- [ ] Sensitive data exposure

---

## 📊 COBERTURA DE TESTES

### Meta de Cobertura

| Tipo | Cobertura Mínima |
|------|------------------|
| **Statements** | 80% |
| **Branches** | 80% |
| **Functions** | 80% |
| **Lines** | 80% |

### Geração de Relatório

```bash
# Unit + Integration
npm run test:coverage

# E2E
npm run test:e2e

# Load
k6 run __tests__/load/articles-api.js

# Security
npm run test:security
```

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

- [ ] Configurar Jest
- [ ] Escrever testes para ArticleService
- [ ] Escrever testes para ValidationService
- [ ] Escrever testes para BulkGenerationService
- [ ] Escrever testes de integração para APIs
- [ ] Configurar Playwright
- [ ] Escrever testes E2E para fluxos críticos
- [ ] Configurar k6 para load tests
- [ ] Executar OWASP ZAP scan
- [ ] Atingir 80% de cobertura
- [ ] CI/CD: rodar testes em cada PR

---

**Status**: 📝 AGUARDANDO APROVAÇÃO

**Última Atualização**: 2025-11-18 12:30 BRT
