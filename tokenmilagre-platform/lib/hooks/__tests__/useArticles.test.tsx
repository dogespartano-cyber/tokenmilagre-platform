/**
 * Tests for useArticles Hook
 * Coverage target: >80%
 */

import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useArticles } from '../useArticles'
import type { ArticleListResult } from '@/lib/services/article-service'

// Mock fetch globally
global.fetch = jest.fn()

describe('useArticles', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    // Create a new QueryClient for each test
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false, // Disable retries for tests
        },
      },
    })

    // Clear all mocks
    jest.clearAllMocks()
  })

  afterEach(() => {
    queryClient.clear()
  })

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

  const mockArticlesResponse: ArticleListResult = {
    articles: [
      {
        id: 'art-1',
        title: 'Test Article 1',
        slug: 'test-article-1',
        content: '<p>Content 1</p>',
        type: 'NEWS',
        status: 'PUBLISHED',
        categoryId: 'cat-1',
        authorId: 'user-1',
        readTime: 5,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        deletedAt: null,
        publishedAt: new Date('2024-01-01'),
        featuredUntil: null,
        excerpt: null,
        coverImage: null,
        seo: null,
        author: {
          id: 'user-1',
          name: 'Test Author',
          email: 'test@example.com',
        },
        category: {
          id: 'cat-1',
          name: 'Technology',
          slug: 'technology',
        },
        tags: [],
        citations: [],
        relatedArticles: [],
        relatedByArticles: [],
      },
      {
        id: 'art-2',
        title: 'Test Article 2',
        slug: 'test-article-2',
        content: '<p>Content 2</p>',
        type: 'EDUCATIONAL',
        status: 'PUBLISHED',
        categoryId: 'cat-1',
        authorId: 'user-1',
        readTime: 3,
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02'),
        deletedAt: null,
        publishedAt: new Date('2024-01-02'),
        featuredUntil: null,
        excerpt: null,
        coverImage: null,
        seo: null,
        author: {
          id: 'user-1',
          name: 'Test Author',
          email: 'test@example.com',
        },
        category: {
          id: 'cat-1',
          name: 'Technology',
          slug: 'technology',
        },
        tags: [],
        citations: [],
        relatedArticles: [],
        relatedByArticles: [],
      },
    ],
    total: 2,
    page: 1,
    limit: 10,
    totalPages: 1,
  }

  it('should fetch articles successfully', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockArticlesResponse,
    })

    const { result } = renderHook(() => useArticles(), { wrapper })

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual(mockArticlesResponse)
    expect(result.current.data?.articles).toHaveLength(2)
  })

  it('should use default query parameters', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockArticlesResponse,
    })

    const { result } = renderHook(() => useArticles(), { wrapper })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('page=1'),
      expect.any(Object)
    )
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('limit=10'),
      expect.any(Object)
    )
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('sortBy=createdAt'),
      expect.any(Object)
    )
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('sortOrder=desc'),
      expect.any(Object)
    )
  })

  it('should apply custom query filters', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockArticlesResponse,
    })

    const { result } = renderHook(
      () =>
        useArticles({
          query: {
            page: 2,
            limit: 20,
            type: 'NEWS',
            status: 'PUBLISHED',
            search: 'bitcoin',
          },
        }),
      { wrapper }
    )

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    const fetchCall = (global.fetch as jest.Mock).mock.calls[0][0]
    expect(fetchCall).toContain('page=2')
    expect(fetchCall).toContain('limit=20')
    expect(fetchCall).toContain('type=NEWS')
    expect(fetchCall).toContain('status=PUBLISHED')
    expect(fetchCall).toContain('search=bitcoin')
  })

  it('should handle fetch errors', async () => {
    const errorMessage = 'Failed to fetch articles'
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        error: {
          message: errorMessage,
        },
      }),
    })

    const { result } = renderHook(() => useArticles(), { wrapper })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error).toBeDefined()
    expect(result.current.error?.message).toBe(errorMessage)
  })

  it('should include credentials in request', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockArticlesResponse,
    })

    const { result } = renderHook(() => useArticles(), { wrapper })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        credentials: 'include',
      })
    )
  })

  it('should cache results', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockArticlesResponse,
    })

    // First render
    const { result: result1 } = renderHook(() => useArticles(), { wrapper })

    await waitFor(() => {
      expect(result1.current.isSuccess).toBe(true)
    })

    // Second render with same query
    const { result: result2 } = renderHook(() => useArticles(), { wrapper })

    // Should use cache, not fetch again
    expect(result2.current.data).toEqual(mockArticlesResponse)
    expect(global.fetch).toHaveBeenCalledTimes(1) // Only called once
  })

  it('should handle empty results', async () => {
    const emptyResponse: ArticleListResult = {
      articles: [],
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => emptyResponse,
    })

    const { result } = renderHook(() => useArticles(), { wrapper })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data?.articles).toHaveLength(0)
    expect(result.current.data?.total).toBe(0)
  })

  it('should handle pagination', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        ...mockArticlesResponse,
        page: 3,
        totalPages: 5,
      }),
    })

    const { result } = renderHook(
      () =>
        useArticles({
          query: { page: 3, limit: 10 },
        }),
      { wrapper }
    )

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data?.page).toBe(3)
    expect(result.current.data?.totalPages).toBe(5)
  })

  it('should handle network errors', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error('Network error')
    )

    const { result } = renderHook(() => useArticles(), { wrapper })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error?.message).toBe('Network error')
  })
})
