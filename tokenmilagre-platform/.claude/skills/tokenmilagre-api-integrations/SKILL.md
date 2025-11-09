---
name: tokenmilagre-api-integrations
description: This skill guides integration with external APIs including Perplexity AI (sonar models), Gemini (text + image generation), Binance, and CoinGecko. Use when implementing API connections, handling rate limits, error recovery, and data transformation patterns.
license: MIT
---

# Token Milagre - API Integrations Guide

Complete reference for integrating and managing external APIs used in the Token Milagre Platform.

## Purpose

Provide standardized patterns for API integration, error handling, rate limiting, and data transformation across all external services.

## When to Use This Skill

Use this skill when:
- Integrating a new API service
- Debugging API connection issues
- Implementing rate limiting or retry logic
- Transforming API responses to match internal data models
- Handling API authentication and key management
- Troubleshooting timeout or quota errors

## Supported APIs

### 1. Perplexity AI (Content Generation + Citations)

**Models:**
- `sonar` - Fast, cost-effective, real-time web search (primary)
- `sonar-pro` - Higher quality, more comprehensive citations (premium)

**Use Cases:**
- Generating crypto news articles with citations
- Creating educational content with source verification
- Real-time market analysis with factual references

**Configuration:**

```typescript
// lib/services/perplexity.ts
const PERPLEXITY_CONFIG = {
  apiKey: process.env.PERPLEXITY_API_KEY!,
  baseUrl: 'https://api.perplexity.ai',
  models: {
    sonar: 'sonar',
    sonarPro: 'sonar-pro'
  },
  defaults: {
    temperature: 0.2,
    max_tokens: 4000,
    return_citations: true,
    return_images: false
  }
};
```

**Request Pattern:**

```typescript
import { PerplexityClient } from '@/lib/services/perplexity';

async function generateArticle(topic: string, model: 'sonar' | 'sonar-pro' = 'sonar') {
  const client = new PerplexityClient();

  try {
    const response = await client.chat({
      model: PERPLEXITY_CONFIG.models[model],
      messages: [
        {
          role: 'system',
          content: 'Você é um jornalista especializado em criptomoedas...'
        },
        {
          role: 'user',
          content: `Escreva um artigo sobre: ${topic}`
        }
      ],
      temperature: 0.2,
      max_tokens: 4000,
      return_citations: true
    });

    return {
      content: response.choices[0].message.content,
      citations: response.citations || []
    };

  } catch (error) {
    if (isRateLimitError(error)) {
      // Implement exponential backoff
      await sleep(5000);
      return generateArticle(topic, model); // Retry
    }
    throw error;
  }
}
```

**Citation Extraction:**

```typescript
function extractCitations(response: PerplexityResponse): Citation[] {
  const citations: Citation[] = [];

  // Pattern: [1], [2], etc.
  const citationPattern = /\[(\d+)\]/g;
  const matches = response.content.matchAll(citationPattern);

  for (const match of matches) {
    const index = parseInt(match[1]) - 1;
    const url = response.citations?.[index];

    if (url && isValidUrl(url)) {
      citations.push({
        index: parseInt(match[1]),
        url,
        title: extractTitleFromUrl(url),
        domain: new URL(url).hostname
      });
    }
  }

  return deduplicateCitations(citations);
}
```

**Rate Limits:**
- Free tier: 50 requests/day
- Pro tier: 5000 requests/day
- Implement exponential backoff on 429 errors

---

### 2. Gemini AI (Refinement + Image Generation)

**Models:**
- `gemini-2.0-flash-exp` - Fast, multimodal (text + images)
- `gemini-pro` - Text-only, high quality

**Use Cases:**
- Refining Perplexity-generated articles
- Generating cover images for articles
- SEO optimization (meta descriptions, keywords)
- Content translation

**Configuration:**

```typescript
// lib/services/gemini.ts
const GEMINI_CONFIG = {
  apiKey: process.env.GEMINI_API_KEY!,
  baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
  models: {
    flashExp: 'gemini-2.0-flash-exp',
    pro: 'gemini-pro'
  },
  defaults: {
    temperature: 0.7,
    maxOutputTokens: 8192,
    topP: 0.95,
    topK: 40
  }
};
```

**Text Refinement Pattern:**

```typescript
async function refineArticle(rawContent: string, instructions: string) {
  const genAI = new GoogleGenerativeAI(GEMINI_CONFIG.apiKey);
  const model = genAI.getGenerativeModel({
    model: GEMINI_CONFIG.models.flashExp
  });

  const prompt = `
Artigo Original:
${rawContent}

Instruções de Refinamento:
${instructions}

Refine o artigo mantendo TODAS as citações [1], [2], etc. no formato original.
`;

  try {
    const result = await model.generateContent(prompt);
    const refined = result.response.text();

    // Verify citations preserved
    const originalCitations = extractCitationNumbers(rawContent);
    const refinedCitations = extractCitationNumbers(refined);

    if (!citationsMatch(originalCitations, refinedCitations)) {
      console.warn('⚠️ Citations modified during refinement');
    }

    return refined;

  } catch (error) {
    if (error.status === 429) {
      // Rate limit - wait and retry
      await sleep(60000); // 1 minute
      return refineArticle(rawContent, instructions);
    }
    throw error;
  }
}
```

**Image Generation Pattern:**

```typescript
async function generateCoverImage(articleTitle: string, category: string) {
  const prompt = `
Create a professional cover image for a cryptocurrency article:
Title: "${articleTitle}"
Category: ${category}
Style: Modern, clean, tech-focused, vibrant colors
`;

  const model = genAI.getGenerativeModel({
    model: GEMINI_CONFIG.models.flashExp
  });

  const result = await model.generateContent([
    prompt,
    { inlineData: { mimeType: 'image/jpeg' } }
  ]);

  const imageData = result.response.candidates[0].content.parts[0].inlineData;

  // Upload to storage
  const imageUrl = await uploadToStorage(imageData.data, {
    filename: `cover-${Date.now()}.jpg`,
    folder: 'article-covers'
  });

  return imageUrl;
}
```

**Rate Limits:**
- Free tier: 60 requests/minute
- Implement request queuing for high-volume operations

---

### 3. Binance API (Market Data)

**Endpoints:**
- `/api/v3/ticker/price` - Current prices
- `/api/v3/ticker/24hr` - 24h statistics
- `/api/v3/klines` - Historical candlestick data

**Use Cases:**
- Real-time price display
- Market sentiment analysis
- Historical price charts
- Portfolio tracking

**Configuration:**

```typescript
// lib/services/binance.ts
const BINANCE_CONFIG = {
  baseUrl: 'https://api.binance.com',
  endpoints: {
    price: '/api/v3/ticker/price',
    ticker24h: '/api/v3/ticker/24hr',
    klines: '/api/v3/klines'
  },
  limits: {
    weight: 1200, // requests per minute
    orders: 10    // orders per second
  }
};
```

**Price Fetching Pattern:**

```typescript
async function getCurrentPrice(symbol: string): Promise<number> {
  const url = `${BINANCE_CONFIG.baseUrl}${BINANCE_CONFIG.endpoints.price}`;

  try {
    const response = await fetch(`${url}?symbol=${symbol.toUpperCase()}USDT`);

    if (!response.ok) {
      throw new Error(`Binance API error: ${response.status}`);
    }

    const data = await response.json();
    return parseFloat(data.price);

  } catch (error) {
    console.error(`Failed to fetch price for ${symbol}:`, error);
    return 0;
  }
}

// Batch fetching
async function getBatchPrices(symbols: string[]): Promise<Record<string, number>> {
  const url = `${BINANCE_CONFIG.baseUrl}${BINANCE_CONFIG.endpoints.price}`;

  const response = await fetch(url);
  const allPrices = await response.json();

  const prices: Record<string, number> = {};

  for (const symbol of symbols) {
    const ticker = `${symbol.toUpperCase()}USDT`;
    const priceData = allPrices.find((p: any) => p.symbol === ticker);
    prices[symbol] = priceData ? parseFloat(priceData.price) : 0;
  }

  return prices;
}
```

**24h Statistics Pattern:**

```typescript
interface Ticker24h {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  lastPrice: string;
  volume: string;
  highPrice: string;
  lowPrice: string;
}

async function get24hStats(symbol: string): Promise<Ticker24h> {
  const url = `${BINANCE_CONFIG.baseUrl}${BINANCE_CONFIG.endpoints.ticker24h}`;

  const response = await fetch(`${url}?symbol=${symbol.toUpperCase()}USDT`);
  return response.json();
}
```

**Rate Limits:**
- 1200 requests/minute (weight-based)
- Use batch endpoints when possible
- Implement request caching (1-minute TTL for prices)

---

### 4. CoinGecko API (Comprehensive Crypto Data)

**Endpoints:**
- `/coins/markets` - Market data for multiple coins
- `/coins/{id}` - Detailed coin information
- `/coins/{id}/market_chart` - Historical market data
- `/global` - Global crypto market stats

**Use Cases:**
- Comprehensive coin information
- Market cap rankings
- Historical price charts
- Global market statistics

**Configuration:**

```typescript
// lib/services/coingecko.ts
const COINGECKO_CONFIG = {
  baseUrl: 'https://api.coingecko.com/api/v3',
  endpoints: {
    markets: '/coins/markets',
    coin: '/coins',
    marketChart: '/coins/{id}/market_chart',
    global: '/global'
  },
  limits: {
    free: 10, // calls per minute
    pro: 500  // calls per minute
  }
};
```

**Market Data Pattern:**

```typescript
interface CoinMarketData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  total_volume: number;
}

async function getTopCoins(limit: number = 50): Promise<CoinMarketData[]> {
  const url = `${COINGECKO_CONFIG.baseUrl}${COINGECKO_CONFIG.endpoints.markets}`;

  const params = new URLSearchParams({
    vs_currency: 'usd',
    order: 'market_cap_desc',
    per_page: limit.toString(),
    page: '1',
    sparkline: 'false'
  });

  try {
    const response = await fetch(`${url}?${params}`);

    if (response.status === 429) {
      // Rate limited - use cached data
      return getCachedTopCoins();
    }

    return response.json();

  } catch (error) {
    console.error('CoinGecko API error:', error);
    return getCachedTopCoins();
  }
}
```

**Detailed Coin Info Pattern:**

```typescript
async function getCoinDetails(coinId: string) {
  const url = `${COINGECKO_CONFIG.baseUrl}${COINGECKO_CONFIG.endpoints.coin}/${coinId}`;

  const params = new URLSearchParams({
    localization: 'false',
    tickers: 'false',
    market_data: 'true',
    community_data: 'true',
    developer_data: 'true'
  });

  const response = await fetch(`${url}?${params}`);
  return response.json();
}
```

**Rate Limits:**
- Free tier: 10-50 calls/minute
- Pro tier: 500 calls/minute
- **Critical:** Implement aggressive caching (5-15 minute TTL)

---

## Common Patterns

### Pattern 1: Exponential Backoff

```typescript
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // Don't retry on client errors (4xx except 429)
      if (error.status >= 400 && error.status < 500 && error.status !== 429) {
        throw error;
      }

      const delay = baseDelay * Math.pow(2, i);
      console.log(`Retry ${i + 1}/${maxRetries} after ${delay}ms`);
      await sleep(delay);
    }
  }

  throw lastError!;
}
```

### Pattern 2: Request Caching

```typescript
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class APICache<T> {
  private cache = new Map<string, CacheEntry<T>>();

  constructor(private ttl: number) {}

  get(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) return null;

    const age = Date.now() - entry.timestamp;
    if (age > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  set(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }
}

// Usage
const priceCache = new APICache<number>(60000); // 1 minute TTL

async function getCachedPrice(symbol: string): Promise<number> {
  const cached = priceCache.get(symbol);
  if (cached !== null) return cached;

  const price = await getCurrentPrice(symbol);
  priceCache.set(symbol, price);
  return price;
}
```

### Pattern 3: Rate Limiter

```typescript
class RateLimiter {
  private queue: Array<() => Promise<any>> = [];
  private running = 0;

  constructor(
    private maxConcurrent: number,
    private minDelay: number
  ) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    while (this.running >= this.maxConcurrent) {
      await sleep(this.minDelay);
    }

    this.running++;

    try {
      const result = await fn();
      await sleep(this.minDelay);
      return result;
    } finally {
      this.running--;
    }
  }
}

// Usage
const binanceLimiter = new RateLimiter(10, 100); // 10 concurrent, 100ms delay

async function safeFetchPrice(symbol: string) {
  return binanceLimiter.execute(() => getCurrentPrice(symbol));
}
```

### Pattern 4: Error Classification

```typescript
enum APIErrorType {
  RateLimit = 'RATE_LIMIT',
  Authentication = 'AUTHENTICATION',
  NotFound = 'NOT_FOUND',
  ServerError = 'SERVER_ERROR',
  Network = 'NETWORK',
  Unknown = 'UNKNOWN'
}

function classifyAPIError(error: any): APIErrorType {
  if (error.status === 429) return APIErrorType.RateLimit;
  if (error.status === 401 || error.status === 403) return APIErrorType.Authentication;
  if (error.status === 404) return APIErrorType.NotFound;
  if (error.status >= 500) return APIErrorType.ServerError;
  if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') return APIErrorType.Network;
  return APIErrorType.Unknown;
}

async function handleAPICall<T>(fn: () => Promise<T>): Promise<T | null> {
  try {
    return await fn();
  } catch (error) {
    const errorType = classifyAPIError(error);

    switch (errorType) {
      case APIErrorType.RateLimit:
        console.warn('⚠️ Rate limited - returning cached data');
        return null;

      case APIErrorType.Authentication:
        console.error('🔒 Authentication failed - check API keys');
        throw error;

      case APIErrorType.NotFound:
        console.log('ℹ️ Resource not found');
        return null;

      case APIErrorType.ServerError:
        console.error('💥 Server error - will retry');
        return retryWithBackoff(fn);

      default:
        console.error('❌ Unknown error:', error);
        return null;
    }
  }
}
```

## Environment Variables

Required in `.env.local`:

```bash
# Perplexity AI
PERPLEXITY_API_KEY=pplx-xxxxx

# Gemini AI
GEMINI_API_KEY=AIzaSyxxxxxx

# Binance (optional for authenticated endpoints)
BINANCE_API_KEY=xxxxx
BINANCE_SECRET_KEY=xxxxx

# CoinGecko (optional - pro tier)
COINGECKO_API_KEY=xxxxx
```

## Testing APIs

```typescript
// Test script: scripts/test-apis.ts
async function testAllAPIs() {
  console.log('🧪 Testing API integrations...\n');

  // Test Perplexity
  try {
    const result = await generateArticle('Bitcoin', 'sonar');
    console.log('✅ Perplexity: OK');
  } catch (error) {
    console.error('❌ Perplexity: FAILED', error);
  }

  // Test Gemini
  try {
    const refined = await refineArticle('Test content', 'Make it better');
    console.log('✅ Gemini: OK');
  } catch (error) {
    console.error('❌ Gemini: FAILED', error);
  }

  // Test Binance
  try {
    const price = await getCurrentPrice('BTC');
    console.log(`✅ Binance: OK (BTC = $${price})`);
  } catch (error) {
    console.error('❌ Binance: FAILED', error);
  }

  // Test CoinGecko
  try {
    const coins = await getTopCoins(5);
    console.log(`✅ CoinGecko: OK (${coins.length} coins)`);
  } catch (error) {
    console.error('❌ CoinGecko: FAILED', error);
  }
}
```

## Troubleshooting

### Issue: Rate Limit Exceeded

**Symptoms:** 429 status code, "Too Many Requests"

**Solutions:**
1. Implement exponential backoff
2. Add request caching with appropriate TTL
3. Use batch endpoints when available
4. Upgrade to paid tier if consistently hitting limits

### Issue: Authentication Failed

**Symptoms:** 401/403 status codes

**Solutions:**
1. Verify API keys in `.env.local`
2. Check key permissions/scopes
3. Regenerate keys if expired

### Issue: Timeout Errors

**Symptoms:** ETIMEDOUT, connection refused

**Solutions:**
1. Increase timeout values
2. Implement retry logic
3. Check firewall/network settings
4. Use fallback data sources

## Best Practices

1. **Always cache expensive API calls** - Use appropriate TTL based on data freshness needs
2. **Implement rate limiting client-side** - Don't wait for API to reject requests
3. **Use exponential backoff** - Give APIs time to recover
4. **Log API usage** - Track quota consumption
5. **Have fallback data** - Cached data better than no data
6. **Classify errors properly** - Different errors need different handling
7. **Monitor API health** - Track success/failure rates

## Related Skills

- `tokenmilagre-article-workflow` - Uses Perplexity + Gemini
- `tokenmilagre-citations` - Processes Perplexity citations
- `tokenmilagre-crypto-data` - Market data integration patterns

---

**Last Updated:** 2025-01-09
**Version:** 1.0.0
