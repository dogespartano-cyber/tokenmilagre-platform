/**
 * Article CRUD Service Tests
 * 
 * Tests for the ArticleCrudService - Create, Read, Update, Delete operations
 */

import { prismaMock } from '@/lib/__mocks__/prisma'

// Mock the prisma module
jest.mock('@/lib/core/prisma', () => ({
    prisma: require('@/lib/__mocks__/prisma').prismaMock
}))

// Mock the DI container
jest.mock('@/lib/core/di/container', () => ({
    ServiceLocator: {
        getLogger: jest.fn().mockReturnValue({
            debug: jest.fn(),
            info: jest.fn(),
            warn: jest.fn(),
            error: jest.fn(),
        }),
        get: jest.fn().mockReturnValue({
            validateSlug: jest.fn(),
            validateArticleData: jest.fn(),
        }),
    },
}))

// Mock the validation service
jest.mock('@/lib/services/validation-service', () => ({
    ValidationService: class {
        validateSlug = jest.fn()
        validateArticleData = jest.fn()
    },
}))

describe('ArticleCrudService', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('getById', () => {
        it('should return article when found', async () => {
            const mockArticle = {
                id: 'test-id',
                title: 'Test Article',
                slug: 'test-article',
                content: '# Test Content',
                type: 'news',
                category: 'mercado',
                published: true,
                authorId: 'author-id',
                author: { id: 'author-id', name: 'Test Author' },
            }

            prismaMock.article.findUnique.mockResolvedValue(mockArticle as never)

            // Dynamic import to ensure mocks are applied
            const { ArticleCrudService } = await import('../services/article-crud.service')
            const service = new ArticleCrudService()

            const result = await service.getById('test-id')

            expect(result).toEqual(mockArticle)
            expect(prismaMock.article.findUnique).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: { id: 'test-id' }
                })
            )
        })

        it('should throw error when article not found', async () => {
            prismaMock.article.findUnique.mockResolvedValue(null as never)

            const { ArticleCrudService } = await import('../services/article-crud.service')
            const service = new ArticleCrudService()

            await expect(service.getById('non-existent')).rejects.toThrow()
        })
    })

    describe('getBySlug', () => {
        it('should return article when found by slug', async () => {
            const mockArticle = {
                id: 'test-id',
                title: 'Test Article',
                slug: 'test-article',
                content: '# Test Content',
                type: 'educational',
                category: 'tecnologia',
                published: true,
            }

            prismaMock.article.findUnique.mockResolvedValue(mockArticle as never)

            const { ArticleCrudService } = await import('../services/article-crud.service')
            const service = new ArticleCrudService()

            const result = await service.getBySlug('test-article')

            expect(result).toEqual(mockArticle)
            expect(prismaMock.article.findUnique).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: { slug: 'test-article' }
                })
            )
        })
    })

    describe('delete', () => {
        it('should delete article when user is owner', async () => {
            const mockArticle = {
                id: 'test-id',
                authorId: 'user-123',
                title: 'To be deleted',
            }

            prismaMock.article.findUnique.mockResolvedValue(mockArticle as never)
            prismaMock.article.delete.mockResolvedValue(mockArticle as never)

            const { ArticleCrudService } = await import('../services/article-crud.service')
            const service = new ArticleCrudService()

            await service.delete('test-id', 'user-123')

            expect(prismaMock.article.delete).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: { id: 'test-id' }
                })
            )
        })
    })
})
