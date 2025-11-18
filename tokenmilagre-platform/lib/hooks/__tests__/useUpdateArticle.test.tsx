/**
 * Tests for useUpdateArticle Hook
 * Coverage target: >80%
 */

import { renderHook, waitFor, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useUpdateArticle, usePublishArticle, useArchiveArticle } from '../useUpdateArticle'
import { articleKeys } from '../query-keys'
import type { ArticleWithRelations } from '@/lib/services/article-service'

// Mock fetch globally
global.fetch = jest.fn()

describe('useUpdateArticle', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })

    jest.clearAllMocks()
  })

  afterEach(() => {
    queryClient.clear()
  })

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

  const mockArticle: ArticleWithRelations = {
    id: 'art-1',
    title: 'Original Title',
    slug: 'original-title',
    content: '<p>Original content</p>',
    type: 'news',
    status: 'draft',
    categoryId: 'cat-1',
    authorId: 'user-1',
    readTime: 2,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    deletedAt: null,
    publishedAt: null,
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
  }

  const mockUpdatedArticle: ArticleWithRelations = {
    ...mockArticle,
    title: 'Updated Title',
    updatedAt: new Date('2024-01-02'),
  }

  it('should update article successfully', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockUpdatedArticle,
    })

    const { result } = renderHook(() => useUpdateArticle(), { wrapper })

    act(() => {
      result.current.mutate({
        id: 'art-1',
        data: { title: 'Updated Title' },
      })
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual(mockUpdatedArticle)
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/v2/articles/art-1',
      expect.objectContaining({
        method: 'PATCH',
        credentials: 'include',
        body: JSON.stringify({ title: 'Updated Title' }),
      })
    )
  })

  it('should perform optimistic update', async () => {
    // Set initial data in cache
    queryClient.setQueryData(articleKeys.detail('art-1'), mockArticle)

    ;(global.fetch as jest.Mock).mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                json: async () => mockUpdatedArticle,
              }),
            100
          )
        )
    )

    const { result } = renderHook(() => useUpdateArticle({ optimistic: true }), {
      wrapper,
    })

    act(() => {
      result.current.mutate({
        id: 'art-1',
        data: { title: 'Updated Title' },
      })
    })

    // Check optimistic update immediately
    const optimisticArticle = queryClient.getQueryData<ArticleWithRelations>(
      articleKeys.detail('art-1')
    )
    expect(optimisticArticle?.title).toBe('Updated Title')

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    // Check final update from server
    const finalArticle = queryClient.getQueryData<ArticleWithRelations>(
      articleKeys.detail('art-1')
    )
    expect(finalArticle).toEqual(mockUpdatedArticle)
  })

  it('should rollback on error', async () => {
    // Set initial data in cache
    queryClient.setQueryData(articleKeys.detail('art-1'), mockArticle)

    const errorMessage = 'Update failed'
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        error: { message: errorMessage },
      }),
    })

    const { result } = renderHook(() => useUpdateArticle({ optimistic: true }), {
      wrapper,
    })

    act(() => {
      result.current.mutate({
        id: 'art-1',
        data: { title: 'Updated Title' },
      })
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    // Check rollback
    const rolledBackArticle = queryClient.getQueryData<ArticleWithRelations>(
      articleKeys.detail('art-1')
    )
    expect(rolledBackArticle).toEqual(mockArticle)
    expect(result.current.error?.message).toBe(errorMessage)
  })

  it('should invalidate article and lists after update', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockUpdatedArticle,
    })

    const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries')

    const { result } = renderHook(() => useUpdateArticle(), { wrapper })

    act(() => {
      result.current.mutate({
        id: 'art-1',
        data: { title: 'Updated Title' },
      })
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: articleKeys.detail('art-1'),
    })
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: articleKeys.lists(),
    })
  })

  it('should invalidate stats when status changes', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        ...mockUpdatedArticle,
        status: 'published',
      }),
    })

    const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries')

    const { result } = renderHook(() => useUpdateArticle(), { wrapper })

    act(() => {
      result.current.mutate({
        id: 'art-1',
        data: { status: 'published' },
      })
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: articleKeys.stats(),
    })
  })

  it('should disable optimistic updates when requested', async () => {
    queryClient.setQueryData(articleKeys.detail('art-1'), mockArticle)

    ;(global.fetch as jest.Mock).mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                json: async () => mockUpdatedArticle,
              }),
            100
          )
        )
    )

    const { result } = renderHook(
      () => useUpdateArticle({ optimistic: false }),
      { wrapper }
    )

    act(() => {
      result.current.mutate({
        id: 'art-1',
        data: { title: 'Updated Title' },
      })
    })

    // Check that no optimistic update occurred
    const article = queryClient.getQueryData<ArticleWithRelations>(
      articleKeys.detail('art-1')
    )
    expect(article?.title).toBe('Original Title') // Still original

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
  })
})

describe('usePublishArticle', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        mutations: { retry: false },
      },
    })
    jest.clearAllMocks()
  })

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

  it('should publish article with correct data', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ status: 'published' }),
    })

    const { result } = renderHook(() => usePublishArticle(), { wrapper })

    act(() => {
      result.current.mutate('art-1')
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    const fetchCall = (global.fetch as jest.Mock).mock.calls[0][1]
    const body = JSON.parse(fetchCall.body)
    expect(body.status).toBe('published')
    expect(body.publishedAt).toBeDefined()
  })
})

describe('useArchiveArticle', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        mutations: { retry: false },
      },
    })
    jest.clearAllMocks()
  })

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

  it('should archive article with correct data', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ status: 'ARCHIVED' }),
    })

    const { result } = renderHook(() => useArchiveArticle(), { wrapper })

    act(() => {
      result.current.mutate('art-1')
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    const fetchCall = (global.fetch as jest.Mock).mock.calls[0][1]
    const body = JSON.parse(fetchCall.body)
    expect(body.status).toBe('ARCHIVED')
  })
})
