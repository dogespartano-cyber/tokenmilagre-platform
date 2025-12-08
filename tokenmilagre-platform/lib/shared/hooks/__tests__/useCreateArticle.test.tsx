/**
 * Tests for useCreateArticle Hook
 * Coverage target: >80%
 */

import { renderHook, waitFor, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useCreateArticle, useCreateArticleWithSlug } from '../useCreateArticle'
import { articleKeys } from '../query-keys'
import type { ArticleCreateInput, ArticleWithRelations } from '@/lib/services/article-service'

// Mock fetch globally
global.fetch = jest.fn()

describe('useCreateArticle', () => {
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

  const mockArticleInput: ArticleCreateInput = {
    title: 'New Article',
    slug: 'new-article',
    content: '<p>Article content</p>',
    type: 'NEWS',
    categoryId: 'cat-1',
    authorId: 'user-1',
    tagIds: ['tag-1'],
    status: 'DRAFT',
  }

  const mockArticleResponse: ArticleWithRelations = {
    id: 'art-new',
    title: 'New Article',
    slug: 'new-article',
    content: '<p>Article content</p>',
    type: 'NEWS',
    status: 'DRAFT',
    categoryId: 'cat-1',
    authorId: 'user-1',
    readTime: 2,
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03'),
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
    tags: [
      {
        id: 'at-1',
        articleId: 'art-new',
        tagId: 'tag-1',
        tag: {
          id: 'tag-1',
          name: 'Bitcoin',
          slug: 'bitcoin',
        },
      },
    ],
    citations: [],
    relatedArticles: [],
    relatedByArticles: [],
  }

  it('should create article successfully', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockArticleResponse,
    })

    const { result } = renderHook(() => useCreateArticle(), { wrapper })

    act(() => {
      result.current.mutate(mockArticleInput)
    })

    expect(result.current.isPending).toBe(true)

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual(mockArticleResponse)
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/v2/articles',
      expect.objectContaining({
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(mockArticleInput),
      })
    )
  })

  it('should invalidate article lists after creation', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockArticleResponse,
    })

    const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries')

    const { result } = renderHook(() => useCreateArticle(), { wrapper })

    act(() => {
      result.current.mutate(mockArticleInput)
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: articleKeys.lists(),
    })
  })

  it('should invalidate stats after creation', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockArticleResponse,
    })

    const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries')

    const { result } = renderHook(() => useCreateArticle(), { wrapper })

    act(() => {
      result.current.mutate(mockArticleInput)
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: articleKeys.stats(),
    })
  })

  it('should set created article in cache', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockArticleResponse,
    })

    const { result } = renderHook(() => useCreateArticle(), { wrapper })

    act(() => {
      result.current.mutate(mockArticleInput)
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    const cachedArticle = queryClient.getQueryData(
      articleKeys.detail(mockArticleResponse.id)
    )
    expect(cachedArticle).toEqual(mockArticleResponse)
  })

  it('should handle creation errors', async () => {
    const errorMessage = 'Slug already exists'
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        error: {
          message: errorMessage,
        },
      }),
    })

    const { result } = renderHook(() => useCreateArticle(), { wrapper })

    act(() => {
      result.current.mutate(mockArticleInput)
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error?.message).toBe(errorMessage)
  })

  it('should call onSuccess callback', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockArticleResponse,
    })

    const onSuccess = jest.fn()

    const { result } = renderHook(
      () => useCreateArticle({ onSuccess }),
      { wrapper }
    )

    act(() => {
      result.current.mutate(mockArticleInput)
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(onSuccess).toHaveBeenCalledWith(
      mockArticleResponse,
      mockArticleInput,
      expect.anything()
    )
  })

  it('should call onError callback', async () => {
    const errorMessage = 'Creation failed'
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        error: { message: errorMessage },
      }),
    })

    const onError = jest.fn()

    const { result } = renderHook(
      () => useCreateArticle({ onError }),
      { wrapper }
    )

    act(() => {
      result.current.mutate(mockArticleInput)
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({ message: errorMessage }),
      mockArticleInput,
      undefined
    )
  })

  it('should handle network errors', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error('Network error')
    )

    const { result } = renderHook(() => useCreateArticle(), { wrapper })

    act(() => {
      result.current.mutate(mockArticleInput)
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error?.message).toBe('Network error')
  })
})

describe('useCreateArticleWithSlug', () => {
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

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

  const mockArticleResponse: ArticleWithRelations = {
    id: 'art-new',
    title: 'Auto Slug Article',
    slug: 'auto-slug-article',
    content: '<p>Content</p>',
    type: 'NEWS',
    status: 'DRAFT',
    categoryId: 'cat-1',
    authorId: 'user-1',
    readTime: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
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

  it('should auto-generate slug from title', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockArticleResponse,
    })

    const { result } = renderHook(() => useCreateArticleWithSlug(), { wrapper })

    act(() => {
      result.current.mutate({
        title: 'Auto Slug Article',
        content: '<p>Content</p>',
        type: 'NEWS',
        categoryId: 'cat-1',
        authorId: 'user-1',
        tagIds: [],
        status: 'DRAFT',
      })
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    const fetchCall = (global.fetch as jest.Mock).mock.calls[0][1]
    const body = JSON.parse(fetchCall.body)
    expect(body.slug).toBe('auto-slug-article')
  })

  it('should use provided slug if given', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockArticleResponse,
    })

    const { result } = renderHook(() => useCreateArticleWithSlug(), { wrapper })

    act(() => {
      result.current.mutate({
        title: 'Auto Slug Article',
        slug: 'custom-slug',
        content: '<p>Content</p>',
        type: 'NEWS',
        categoryId: 'cat-1',
        authorId: 'user-1',
        tagIds: [],
        status: 'DRAFT',
      })
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    const fetchCall = (global.fetch as jest.Mock).mock.calls[0][1]
    const body = JSON.parse(fetchCall.body)
    expect(body.slug).toBe('custom-slug')
  })
})
