---
name: tokenmilagre-testing
description: This skill provides testing strategies and patterns for the Token Milagre platform including unit tests, integration tests, E2E tests, and API testing. Use when setting up tests, writing test cases, or debugging test failures.
license: MIT
---

# Token Milagre - Testing Guide

Complete guide for implementing comprehensive testing strategies in the Token Milagre Platform.

## Purpose

Establish testing patterns and practices to ensure code quality, prevent regressions, and maintain platform reliability.

## When to Use This Skill

Use this skill when:
- Setting up testing infrastructure
- Writing unit tests for utilities/hooks
- Creating integration tests for API routes
- Implementing E2E tests for user flows
- Testing Copilot AI tools
- Debugging failing tests
- Improving test coverage

## Testing Stack

**Current (Recommended):**
- **Framework:** Jest (Next.js default)
- **React Testing:** React Testing Library
- **E2E:** Playwright (recommended) or Cypress
- **API Testing:** Supertest
- **Mocking:** Jest mocks + MSW (Mock Service Worker)

**Configuration:**
- Test files: `*.test.ts`, `*.test.tsx`, `*.spec.ts`
- Location: `__tests__/` directories or colocated

## Test Types

### 1. Unit Tests (Utilities, Helpers, Hooks)
### 2. Integration Tests (API Routes, Database)
### 3. Component Tests (React Components)
### 4. E2E Tests (User Flows)
### 5. Tool Tests (Copilot AI Tools)

## Setup

### Jest Configuration

```javascript
// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    'hooks/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};

module.exports = createJestConfig(customJestConfig);
```

```javascript
// jest.setup.js
import '@testing-library/jest-dom';

// Mock environment variables
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
process.env.PERPLEXITY_API_KEY = 'test-key';
process.env.GEMINI_API_KEY = 'test-key';
```

### Package.json Scripts

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test",
    "test:debug": "node --inspect-brk node_modules/.bin/jest --runInBand"
  }
}
```

## Unit Test Patterns

### Pattern 1: Testing Utility Functions

```typescript
// __tests__/lib/utils/slugify.test.ts
import { generateSlug } from '@/lib/utils/helpers';

describe('generateSlug', () => {
  it('converts title to lowercase slug', () => {
    expect(generateSlug('Bitcoin Price Analysis')).toBe('bitcoin-price-analysis');
  });

  it('removes accents', () => {
    expect(generateSlug('Análise de Cripto')).toBe('analise-de-cripto');
  });

  it('removes special characters', () => {
    expect(generateSlug('Bitcoin & Ethereum: 2024')).toBe('bitcoin-ethereum-2024');
  });

  it('replaces spaces with hyphens', () => {
    expect(generateSlug('Multiple   Spaces')).toBe('multiple-spaces');
  });

  it('removes leading/trailing hyphens', () => {
    expect(generateSlug('-Leading and Trailing-')).toBe('leading-and-trailing');
  });

  it('handles empty string', () => {
    expect(generateSlug('')).toBe('');
  });
});
```

### Pattern 2: Testing Custom Hooks

```typescript
// __tests__/hooks/useInfiniteScrollData.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { useInfiniteScrollData } from '@/hooks/useInfiniteScrollData';

// Mock fetch
global.fetch = jest.fn();

describe('useInfiniteScrollData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches initial data on mount', async () => {
    const mockData = [{ id: '1', title: 'Test' }];
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const { result } = renderHook(() =>
      useInfiniteScrollData({
        endpoint: '/api/articles',
        pageSize: 10,
      })
    );

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
  });

  it('handles fetch errors', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error('Network error')
    );

    const { result } = renderHook(() =>
      useInfiniteScrollData({ endpoint: '/api/articles' })
    );

    await waitFor(() => {
      expect(result.current.error).toBe('Network error');
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toEqual([]);
  });

  it('loads more data when loadMore is called', async () => {
    const page1 = [{ id: '1', title: 'Article 1' }];
    const page2 = [{ id: '2', title: 'Article 2' }];

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => page1 })
      .mockResolvedValueOnce({ ok: true, json: async () => page2 });

    const { result } = renderHook(() =>
      useInfiniteScrollData({ endpoint: '/api/articles', pageSize: 1 })
    );

    await waitFor(() => expect(result.current.data).toHaveLength(1));

    result.current.loadMore();

    await waitFor(() => expect(result.current.data).toHaveLength(2));

    expect(result.current.data).toEqual([...page1, ...page2]);
  });
});
```

### Pattern 3: Testing Helper Libraries

```typescript
// __tests__/lib/utils/date-helpers.test.ts
import { formatDateRelative, formatDateLong } from '@/lib/utils/date-helpers';

describe('date-helpers', () => {
  describe('formatDateRelative', () => {
    it('returns "hoje" for today', () => {
      const today = new Date();
      expect(formatDateRelative(today)).toBe('hoje');
    });

    it('returns "ontem" for yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(formatDateRelative(yesterday)).toBe('ontem');
    });

    it('returns "há X dias" for recent dates', () => {
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      expect(formatDateRelative(threeDaysAgo)).toBe('há 3 dias');
    });

    it('returns formatted date for older dates', () => {
      const oldDate = new Date('2024-01-01');
      expect(formatDateRelative(oldDate)).toMatch(/\d{1,2} de \w+ de \d{4}/);
    });
  });

  describe('formatDateLong', () => {
    it('formats date in Portuguese long format', () => {
      const date = new Date('2024-03-15T10:30:00');
      expect(formatDateLong(date)).toBe('15 de março de 2024');
    });
  });
});
```

## Integration Test Patterns

### Pattern 1: Testing API Routes

```typescript
// __tests__/app/api/articles/route.test.ts
import { GET, POST } from '@/app/api/articles/route';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    article: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  },
}));

describe('/api/articles', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('returns articles', async () => {
      const mockArticles = [
        { id: '1', title: 'Test Article', published: true },
      ];

      (prisma.article.findMany as jest.Mock).mockResolvedValue(mockArticles);

      const request = new NextRequest('http://localhost:3000/api/articles');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockArticles);
    });

    it('filters by category', async () => {
      const request = new NextRequest(
        'http://localhost:3000/api/articles?category=bitcoin'
      );

      await GET(request);

      expect(prisma.article.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ category: 'bitcoin' }),
        })
      );
    });

    it('handles errors', async () => {
      (prisma.article.findMany as jest.Mock).mockRejectedValue(
        new Error('Database error')
      );

      const request = new NextRequest('http://localhost:3000/api/articles');
      const response = await GET(request);

      expect(response.status).toBe(500);
    });
  });

  describe('POST', () => {
    it('creates new article', async () => {
      const newArticle = {
        title: 'New Article',
        content: 'Content',
        category: 'bitcoin',
      };

      (prisma.article.create as jest.Mock).mockResolvedValue({
        id: '1',
        ...newArticle,
      });

      const request = new NextRequest('http://localhost:3000/api/articles', {
        method: 'POST',
        body: JSON.stringify(newArticle),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.title).toBe('New Article');
    });

    it('validates required fields', async () => {
      const request = new NextRequest('http://localhost:3000/api/articles', {
        method: 'POST',
        body: JSON.stringify({ title: 'Missing content' }),
      });

      const response = await POST(request);

      expect(response.status).toBe(400);
    });
  });
});
```

### Pattern 2: Testing Database Operations

```typescript
// __tests__/lib/database/articles.test.ts
import { prisma } from '@/lib/prisma';
import { createArticle, getArticleBySlug } from '@/lib/database/articles';

describe('Article Database Operations', () => {
  beforeAll(async () => {
    // Setup test database
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // Clear test data
    await prisma.article.deleteMany();
  });

  it('creates article with all fields', async () => {
    const articleData = {
      title: 'Test Article',
      slug: 'test-article',
      content: 'Content',
      category: 'bitcoin',
      authorId: 'user-1',
    };

    const article = await createArticle(articleData);

    expect(article.id).toBeDefined();
    expect(article.title).toBe('Test Article');
    expect(article.slug).toBe('test-article');
  });

  it('throws error on duplicate slug', async () => {
    const articleData = {
      title: 'Article 1',
      slug: 'same-slug',
      content: 'Content',
      category: 'bitcoin',
      authorId: 'user-1',
    };

    await createArticle(articleData);

    await expect(
      createArticle({ ...articleData, title: 'Article 2' })
    ).rejects.toThrow('Unique constraint failed');
  });

  it('retrieves article by slug', async () => {
    await prisma.article.create({
      data: {
        slug: 'find-me',
        title: 'Find Me',
        content: 'Content',
        category: 'bitcoin',
        author: {
          connect: { id: 'user-1' },
        },
      },
    });

    const article = await getArticleBySlug('find-me');

    expect(article).toBeDefined();
    expect(article?.title).toBe('Find Me');
  });
});
```

## Component Test Patterns

### Pattern 1: Testing React Components

```typescript
// __tests__/components/ArticleCard.test.tsx
import { render, screen } from '@testing-library/react';
import ArticleCard from '@/components/ArticleCard';

describe('ArticleCard', () => {
  const mockArticle = {
    id: '1',
    slug: 'test-article',
    title: 'Test Article',
    excerpt: 'This is a test excerpt',
    category: 'bitcoin',
    createdAt: new Date('2024-01-01'),
  };

  it('renders article information', () => {
    render(<ArticleCard article={mockArticle} />);

    expect(screen.getByText('Test Article')).toBeInTheDocument();
    expect(screen.getByText('This is a test excerpt')).toBeInTheDocument();
  });

  it('renders category badge', () => {
    render(<ArticleCard article={mockArticle} />);

    expect(screen.getByText('bitcoin')).toBeInTheDocument();
  });

  it('links to article page', () => {
    render(<ArticleCard article={mockArticle} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/bitcoin/test-article');
  });

  it('formats date correctly', () => {
    render(<ArticleCard article={mockArticle} />);

    expect(screen.getByText(/1 de janeiro de 2024/i)).toBeInTheDocument();
  });
});
```

### Pattern 2: Testing User Interactions

```typescript
// __tests__/components/SearchBar.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SearchBar from '@/components/SearchBar';

describe('SearchBar', () => {
  it('calls onSearch when form is submitted', async () => {
    const mockOnSearch = jest.fn();
    render(<SearchBar onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText('Buscar artigos...');
    const button = screen.getByRole('button', { name: /buscar/i });

    fireEvent.change(input, { target: { value: 'Bitcoin' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith('Bitcoin');
    });
  });

  it('debounces search input', async () => {
    jest.useFakeTimers();
    const mockOnSearch = jest.fn();

    render(<SearchBar onSearch={mockOnSearch} debounce={500} />);

    const input = screen.getByPlaceholderText('Buscar artigos...');

    fireEvent.change(input, { target: { value: 'B' } });
    fireEvent.change(input, { target: { value: 'Bi' } });
    fireEvent.change(input, { target: { value: 'Bit' } });

    expect(mockOnSearch).not.toHaveBeenCalled();

    jest.advanceTimersByTime(500);

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledTimes(1);
      expect(mockOnSearch).toHaveBeenCalledWith('Bit');
    });

    jest.useRealTimers();
  });
});
```

## Copilot Tool Testing

### Pattern: Testing AI Tools

```typescript
// __tests__/lib/copilot/tools.test.ts
import { searchArticlesTool } from '@/lib/copilot/tools';
import { prisma } from '@/lib/prisma';

jest.mock('@/lib/prisma');

describe('searchArticlesTool', () => {
  const mockContext = {
    userId: 'user-1',
    userName: 'Test User',
    userRole: 'ADMIN',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('searches articles by query', async () => {
    const mockArticles = [
      { id: '1', title: 'Bitcoin Article', content: 'BTC content' },
    ];

    (prisma.article.findMany as jest.Mock).mockResolvedValue(mockArticles);

    const result = await searchArticlesTool.execute(
      { query: 'Bitcoin', limit: 10 },
      mockContext
    );

    expect(result.success).toBe(true);
    expect(result.data).toEqual(mockArticles);
    expect(prisma.article.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          OR: expect.any(Array),
        }),
      })
    );
  });

  it('filters by category', async () => {
    await searchArticlesTool.execute(
      { category: 'ethereum' },
      mockContext
    );

    expect(prisma.article.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ category: 'ethereum' }),
      })
    );
  });

  it('respects limit parameter', async () => {
    await searchArticlesTool.execute(
      { limit: 5 },
      mockContext
    );

    expect(prisma.article.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 5 })
    );
  });

  it('handles errors gracefully', async () => {
    (prisma.article.findMany as jest.Mock).mockRejectedValue(
      new Error('Database error')
    );

    const result = await searchArticlesTool.execute({}, mockContext);

    expect(result.success).toBe(false);
    expect(result.error).toBe('Database error');
  });
});
```

## E2E Test Patterns (Playwright)

### Setup

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### Pattern: Testing User Flows

```typescript
// e2e/article-workflow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Article Workflow', () => {
  test('user can browse and read article', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');

    // Wait for articles to load
    await expect(page.locator('[data-testid="article-card"]').first()).toBeVisible();

    // Click on first article
    await page.locator('[data-testid="article-card"]').first().click();

    // Verify article page loaded
    await expect(page).toHaveURL(/\/[a-z]+\/[a-z0-9-]+/);
    await expect(page.locator('h1')).toBeVisible();

    // Check article content
    await expect(page.locator('article')).toBeVisible();
  });

  test('user can search for articles', async ({ page }) => {
    await page.goto('/');

    // Enter search query
    await page.fill('[data-testid="search-input"]', 'Bitcoin');
    await page.click('[data-testid="search-button"]');

    // Wait for results
    await expect(page).toHaveURL(/\?.*query=Bitcoin/);

    // Verify results
    const articles = page.locator('[data-testid="article-card"]');
    await expect(articles.first()).toBeVisible();
  });

  test('admin can create article', async ({ page }) => {
    // Login as admin (implement login flow)
    await page.goto('/dashboard/criar-artigo');

    // Fill article form
    await page.fill('[data-testid="title-input"]', 'Test Article');
    await page.fill('[data-testid="content-input"]', 'Test content');

    // Submit
    await page.click('[data-testid="publish-button"]');

    // Verify success
    await expect(page.locator('text=Artigo publicado')).toBeVisible();
  });
});
```

## Test Coverage

### Running Coverage

```bash
npm run test:coverage
```

### Coverage Report

```
----------------------|---------|----------|---------|---------|
File                  | % Stmts | % Branch | % Funcs | % Lines |
----------------------|---------|----------|---------|---------|
All files             |   72.45 |    68.12 |   71.83 |   72.45 |
 lib/utils            |   95.12 |    90.23 |   94.44 |   95.12 |
  date-helpers.ts     |   100   |    100   |   100   |   100   |
  slugify.ts          |   92.5  |    85.71 |   90    |   92.5  |
 hooks                |   85.33 |    78.45 |   88.23 |   85.33 |
  useInfiniteScroll   |   87.5  |    80    |   90    |   87.5  |
----------------------|---------|----------|---------|---------|
```

## Best Practices

1. **Write tests first** - TDD approach when possible
2. **Test behavior, not implementation** - Focus on what, not how
3. **Use descriptive test names** - Clear what is being tested
4. **Arrange-Act-Assert** - Organize test structure
5. **Mock external dependencies** - Isolate units
6. **Test edge cases** - Empty strings, null, undefined
7. **Keep tests fast** - Quick feedback loop
8. **Don't test library code** - Focus on your code
9. **Use test data factories** - Consistent test data
10. **Run tests in CI** - Automate on every commit

## Related Skills

- `tokenmilagre-copilot-tools` - Tool testing examples
- `project-context` - Platform architecture
- `tokenmilagre-database` - Database testing

---

**Last Updated:** 2025-01-09
**Version:** 1.0.0
