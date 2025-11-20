# 🧪 Test & Mock Guide

**Guia completo para testes e mocks no Token Milagre Platform**

Este guia documenta a arquitetura de testes, mocks de APIs externas e boas práticas para desenvolvedores.

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Configuração de Testes](#configuração-de-testes)
3. [Mocks de APIs Externas](#mocks-de-apis-externas)
4. [Escrevendo Testes](#escrevendo-testes)
5. [Exemplos Práticos](#exemplos-práticos)
6. [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

### Stack de Testes

- **Unit & Integration Tests**: Jest 30.2.0 + Supertest 7.1.4
- **E2E Tests**: Playwright 1.56.1
- **Mocking**: MSW (Mock Service Worker) 2.x + jest-mock-extended
- **React Testing**: @testing-library/react 16.3.0

### Estrutura de Diretórios

```
tokenmilagre-platform/
├── __tests__/
│   ├── mocks/
│   │   ├── handlers/          # MSW handlers para APIs externas
│   │   │   ├── binance.ts
│   │   │   ├── solana.ts
│   │   │   ├── perplexity.ts
│   │   │   └── gemini.ts
│   │   ├── server.ts          # MSW server setup
│   │   └── index.ts           # Exports centralizados
│   ├── api/                   # Testes de API routes
│   └── helpers/               # Test utilities
├── lib/
│   ├── adapters/__tests__/    # Testes de adapters
│   ├── services/__tests__/    # Testes de services
│   ├── hooks/__tests__/       # Testes de hooks
│   └── utils/__tests__/       # Testes de utilities
└── e2e/                       # Testes E2E do Playwright
    └── tests/
```

### Coverage Targets

```javascript
// jest.config.js
coverageThreshold: {
  global: {
    branches: 80,
    functions: 80,
    lines: 80,
    statements: 80,
  },
}
```

---

## ⚙️ Configuração de Testes

### 1. Jest Setup Global

Os mocks são configurados automaticamente em `jest.setup.js`:

```javascript
// jest.setup.js
import { setupMockServer } from './__tests__/mocks/server'
setupMockServer()  // ✅ MSW configurado globalmente
```

### 2. Prisma Mock

Mock do Prisma Client disponível globalmente:

```javascript
import { prismaMock } from '@/lib/__mocks__/prisma'

// Usar em testes
prismaMock.article.findMany.mockResolvedValue([...])
```

### 3. Variáveis de Ambiente

Configuradas automaticamente para testes:

```javascript
process.env.NEXTAUTH_URL = 'http://localhost:3000'
process.env.NEXTAUTH_SECRET = 'test-secret'
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test'
```

---

## 🌐 Mocks de APIs Externas

### Binance API

Mock completo da API da Binance usando MSW.

#### Endpoints Mockados

- `GET /api/v3/klines` - Dados de candlestick
- `GET /api/v3/ticker/24hr` - Estatísticas 24h
- `GET /api/v3/ticker/price` - Preço atual

#### Exemplo de Uso

```typescript
import { BinanceAdapter } from '@/lib/adapters/binance-adapter'

describe('My Test', () => {
  it('should fetch Bitcoin price', async () => {
    const adapter = new BinanceAdapter()
    const price = await adapter.getCurrentPrice('BTCUSDT')

    expect(price).toBe(44000) // Mock retorna $44k
  })
})
```

#### Dados Personalizados

```typescript
import { server, binanceMockData } from '@/__tests__/mocks'
import { http, HttpResponse } from 'msw'

it('should handle custom price', async () => {
  // Override mock para teste específico
  server.use(
    http.get('https://api.binance.com/api/v3/ticker/price', () => {
      return HttpResponse.json({ symbol: 'BTCUSDT', price: '50000.00' })
    })
  )

  const adapter = new BinanceAdapter()
  const price = await adapter.getCurrentPrice('BTCUSDT')
  expect(price).toBe(50000)
})
```

#### Geradores de Mock Data

```typescript
import { binanceMockData } from '@/__tests__/mocks'

// Gerar candlesticks personalizados
const candles = binanceMockData.generateKlines(100, 45000)

// Gerar ticker personalizado
const ticker = binanceMockData.generateTicker('ETHUSDT', 2500)
```

---

### Solana Web3.js

Mock da biblioteca `@solana/web3.js` usando Jest mocks.

#### Métodos Mockados

- `Connection.getBalance()`
- `Connection.getParsedTokenAccountsByOwner()`
- `Connection.getTokenSupply()`
- `Connection.getSignaturesForAddress()`
- `Connection.getSlot()`
- `PublicKey` constructor

#### Exemplo de Uso

```typescript
import { SolanaAdapter } from '@/lib/adapters/solana-adapter'

describe('Solana Tests', () => {
  it('should fetch SOL balance', async () => {
    const adapter = new SolanaAdapter()
    const balance = await adapter.getBalance('TokenMilagrePlatform111111111111111111111')

    expect(balance).toBe(10) // Mock wallet tem 10 SOL
  })
})
```

#### Dados Personalizados

```typescript
import { solanaMockUtils } from '@/__tests__/mocks'

beforeEach(() => {
  // Configurar balance customizado
  solanaMockUtils.setBalance('MyWallet111111111111111111111111111111111', 25.5 * 1000000000)

  // Configurar token account
  solanaMockUtils.setTokenAccount(
    'MyWallet111111111111111111111111111111111',
    'TokenMint1111111111111111111111111111111',
    5000000000, // 5000 tokens
    6 // decimals
  )

  // Adicionar transação
  solanaMockUtils.addTransaction(
    'MyWallet111111111111111111111111111111111',
    'TestSignature123',
    999999999,
    'Test memo'
  )
})

afterEach(() => {
  solanaMockUtils.reset() // Limpar mocks
})
```

---

### Perplexity AI

Mock da API da Perplexity usando MSW, incluindo streaming.

#### Endpoints Mockados

- `POST /chat/completions` - Chat regular e streaming

#### Exemplo de Uso - Chat Regular

```typescript
import { PerplexityAdapter } from '@/lib/adapters/perplexity-adapter'

it('should generate AI response', async () => {
  const adapter = new PerplexityAdapter({ apiKey: 'test_key' })

  const response = await adapter.chat([
    { role: 'user', content: 'What is Bitcoin?' }
  ])

  expect(response.choices[0].message.content).toContain('Bitcoin')
  expect(response.citations).toBeDefined()
  expect(response.usage.total_tokens).toBeGreaterThan(0)
})
```

#### Exemplo de Uso - Streaming

```typescript
it('should stream AI response', async () => {
  const adapter = new PerplexityAdapter({ apiKey: 'test_key' })
  const chunks: string[] = []

  const usage = await adapter.chatStream(
    [{ role: 'user', content: 'Explain DeFi' }],
    (chunk) => {
      if (chunk.choices[0]?.delta?.content) {
        chunks.push(chunk.choices[0].delta.content)
      }
    }
  )

  expect(chunks.length).toBeGreaterThan(0)
  expect(usage.cost).toBeGreaterThan(0)
})
```

#### Respostas Personalizadas

```typescript
import { server } from '@/__tests__/mocks'
import { http, HttpResponse } from 'msw'

it('should handle custom response', async () => {
  server.use(
    http.post('https://api.perplexity.ai/chat/completions', async () => {
      return HttpResponse.json({
        id: 'custom_id',
        model: 'llama-3.1-sonar-large-128k-online',
        choices: [{
          index: 0,
          message: {
            role: 'assistant',
            content: 'Custom response content'
          },
          finish_reason: 'stop'
        }],
        usage: { prompt_tokens: 10, completion_tokens: 20, total_tokens: 30 },
        citations: ['https://custom-source.com']
      })
    })
  )

  // Seu teste aqui...
})
```

---

### Google Gemini

Mock da API do Gemini para geração de imagens.

#### Endpoints Mockados

- `POST /v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent`

#### Exemplo de Uso

```typescript
import { generateCoverImage } from '@/lib/gemini-image'

it('should generate cover image', async () => {
  const result = await generateCoverImage(
    {
      title: 'Bitcoin reaches new ATH',
      category: 'bitcoin',
      sentiment: 'positive',
      articleType: 'news'
    },
    'test_api_key'
  )

  expect(result.success).toBe(true)
  expect(result.imageBase64).toBeDefined()
  expect(result.mimeType).toBe('image/png')
})
```

#### Dados Personalizados

```typescript
import { geminiMockData } from '@/__tests__/mocks'

// Imagem customizada
const customImage = geminiMockData.createLargeMockImage(500) // 500KB

// Resposta de erro
const errorResponse = geminiMockData.generateErrorResponse(
  401,
  'Invalid API key',
  'UNAUTHENTICATED'
)

// Resposta bloqueada por segurança
const blockedResponse = geminiMockData.generateSafetyBlockedResponse(
  'HARM_CATEGORY_DANGEROUS_CONTENT'
)
```

---

## ✍️ Escrevendo Testes

### Template Básico

```typescript
/**
 * Unit Tests for MyComponent/Service
 */

import { myFunction } from '../my-module'
import { setupAllMocks } from '@/__tests__/mocks'

// Setup mocks (se necessário)
setupAllMocks()

describe('MyModule', () => {
  describe('myFunction', () => {
    it('should do something', () => {
      const result = myFunction('input')
      expect(result).toBe('expected')
    })

    it('should handle edge case', () => {
      expect(() => myFunction(null)).toThrow('Error message')
    })
  })
})
```

### Testes de API Routes

```typescript
import { createMocks } from 'node-mocks-http'
import handler from '@/app/api/my-route/route'

describe('API /api/my-route', () => {
  it('should return success', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: { id: '123' }
    })

    await handler(req, res)

    expect(res._getStatusCode()).toBe(200)
    const data = JSON.parse(res._getData())
    expect(data).toHaveProperty('success', true)
  })
})
```

### Testes de React Hooks

```typescript
import { renderHook, waitFor } from '@testing-library/react'
import { useMyHook } from '@/lib/hooks/useMyHook'

describe('useMyHook', () => {
  it('should fetch data', async () => {
    const { result } = renderHook(() => useMyHook())

    await waitFor(() => {
      expect(result.current.data).toBeDefined()
    })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })
})
```

---

## 📚 Exemplos Práticos

### Exemplo 1: Teste de Adapter com Mock

```typescript
import { BinanceAdapter } from '@/lib/adapters/binance-adapter'
import { server } from '@/__tests__/mocks'
import { http, HttpResponse } from 'msw'

describe('BinanceAdapter - Real World Example', () => {
  it('should handle rate limit error gracefully', async () => {
    // Simular rate limit (429)
    server.use(
      http.get('https://api.binance.com/api/v3/ticker/price', () => {
        return new HttpResponse('Too Many Requests', { status: 429 })
      })
    )

    const adapter = new BinanceAdapter()

    await expect(adapter.getCurrentPrice('BTCUSDT')).rejects.toThrow(
      'Binance API error'
    )
  })

  it('should fetch prices for multiple symbols', async () => {
    const adapter = new BinanceAdapter()
    const symbols = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT']

    const prices = await Promise.all(
      symbols.map(symbol => adapter.getCurrentPrice(symbol))
    )

    expect(prices).toHaveLength(3)
    prices.forEach(price => {
      expect(typeof price).toBe('number')
      expect(price).toBeGreaterThan(0)
    })
  })
})
```

### Exemplo 2: Teste de Integração API + Service

```typescript
import { createMocks } from 'node-mocks-http'
import handler from '@/app/api/crypto/price/route'
import { BinanceAdapter } from '@/lib/adapters/binance-adapter'

describe('GET /api/crypto/price - Integration', () => {
  it('should return crypto price from Binance', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: { symbol: 'BTCUSDT' }
    })

    await handler(req, res)

    expect(res._getStatusCode()).toBe(200)
    const data = JSON.parse(res._getData())

    expect(data).toMatchObject({
      symbol: 'BTCUSDT',
      price: expect.any(Number),
      timestamp: expect.any(String)
    })

    expect(data.price).toBeGreaterThan(0)
  })
})
```

### Exemplo 3: Teste E2E com Playwright

```typescript
// e2e/tests/crypto-prices.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Crypto Prices Page', () => {
  test('should display Bitcoin price', async ({ page }) => {
    await page.goto('/crypto/prices')

    // Aguardar carregamento
    await page.waitForSelector('[data-testid="btc-price"]')

    // Verificar preço exibido
    const btcPrice = await page.textContent('[data-testid="btc-price"]')
    expect(btcPrice).toMatch(/\$[\d,]+/)

    // Verificar variação 24h
    const change24h = await page.textContent('[data-testid="btc-change-24h"]')
    expect(change24h).toMatch(/[+-][\d.]+%/)
  })
})
```

---

## 🔧 Troubleshooting

### Problema: MSW não intercepta requisições

**Solução**: Verificar se `setupMockServer()` está sendo chamado no `jest.setup.js`:

```javascript
// jest.setup.js
import { setupMockServer } from './__tests__/mocks/server'
setupMockServer()  // ✅ Deve estar presente
```

### Problema: Testes falhando com "fetch is not defined"

**Solução**: Jest não tem `fetch` global. Verificar se `jest.config.js` usa `testEnvironment: 'jsdom'`.

### Problema: Solana tests falhando com "Invalid public key"

**Solução**: Usar endereços mock válidos com pelo menos 32 caracteres:

```typescript
// ✅ Correto
const address = 'TokenMilagrePlatform111111111111111111111'

// ❌ Incorreto
const address = 'invalid'
```

### Problema: Coverage baixo em adapters

**Solução**: Verificar se os mocks estão ativos:

```typescript
import { server } from '@/__tests__/mocks'

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

### Problema: Testes lentos

**Solução**: Usar `jest.setTimeout()` para testes com APIs ou aumentar timeout global:

```typescript
// Em um teste específico
jest.setTimeout(10000) // 10 segundos

// Ou no jest.config.js
testTimeout: 10000
```

---

## 📊 Rodando Testes

### Todos os Testes

```bash
npm test
```

### Testes com Coverage

```bash
npm run test:coverage
```

### Testes Específicos

```bash
# Por arquivo
npm test -- binance-adapter.test.ts

# Por padrão
npm test -- --testPathPattern=adapters

# Watch mode
npm test -- --watch
```

### E2E Tests

```bash
# Rodar E2E
npm run test:e2e

# Modo debug
npm run test:e2e:debug

# Específico
npx playwright test e2e/tests/article-crud.spec.ts
```

---

## 🎓 Boas Práticas

### 1. **Sempre limpar mocks entre testes**

```typescript
afterEach(() => {
  server.resetHandlers()
  solanaMockUtils.reset()
})
```

### 2. **Testar edge cases e erros**

```typescript
it('should handle network error', async () => {
  server.use(
    http.get('https://api.binance.com/*', () => HttpResponse.error())
  )

  await expect(adapter.getPrice('BTC')).rejects.toThrow()
})
```

### 3. **Usar data-testid em componentes**

```tsx
<div data-testid="crypto-price">{price}</div>
```

### 4. **Documentar testes complexos**

```typescript
it('should handle concurrent requests without race conditions', async () => {
  // Este teste garante que múltiplas requisições simultâneas
  // não causam inconsistência no estado do adapter
  const promises = Array(10).fill(0).map(() => adapter.getPrice('BTC'))
  const results = await Promise.all(promises)

  expect(new Set(results).size).toBe(1) // Todos devem retornar mesmo valor
})
```

### 5. **Manter testes independentes**

```typescript
// ❌ Ruim - testes dependentes
let sharedData: any

it('test 1', () => { sharedData = {...} })
it('test 2', () => { expect(sharedData).toBe(...) })

// ✅ Bom - testes independentes
it('test 1', () => {
  const data = {...}
  expect(data).toBe(...)
})

it('test 2', () => {
  const data = {...}
  expect(data).toBe(...)
})
```

---

## 📖 Recursos Adicionais

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [MSW Documentation](https://mswjs.io/docs/)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

---

**Última atualização**: 2025-11-19
**Versão**: 1.0.0
**Mantido por**: Token Milagre Platform Team
