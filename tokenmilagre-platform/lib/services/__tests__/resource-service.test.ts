/**
 * Tests for ResourceService
 * Coverage target: 99%+ (comprehensive test suite)
 *
 * Tests all 10 methods:
 * 1. create
 * 2. getById
 * 3. getBySlug
 * 4. list
 * 5. update
 * 6. delete
 * 7. getStats
 * 8. getByCategory
 * 9. getPopular
 * 10. search
 */

// Create singleton mock logger BEFORE DI container mock
const mockLogger = {
  setContext: jest.fn(),
  clearContext: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}

// Create singleton mock validation
const mockValidation = {
  validate: jest.fn((schema, data) => data),
  sanitizeHtml: jest.fn((html) => html),
}

// Mock DI container BEFORE imports (return singleton instances)
jest.mock('@/lib/di/container', () => ({
  ServiceLocator: {
    getLogger: jest.fn(() => mockLogger),
    getValidation: jest.fn(() => mockValidation),
  },
}))

// Mock bcryptjs for password hashing
jest.mock('bcryptjs', () => ({
  hash: jest.fn((password: string) => Promise.resolve(`hashed_${password}`)),
  compare: jest.fn((password: string, hash: string) =>
    Promise.resolve(hash === `hashed_${password}`)
  ),
}))

import { ResourceService } from '../resource-service'
import { prismaMock } from '@/lib/__mocks__/prisma'

describe('ResourceService', () => {
  let service: ResourceService

  const mockUserId = 'user-123'
  const mockResourceId = 'res-123'

  const mockResourceData = {
    slug: 'metamask-wallet',
    name: 'MetaMask',
    category: 'wallets',
    verified: true,
    shortDescription: 'Popular Ethereum wallet',
    officialUrl: 'https://metamask.io',
    platforms: ['web', 'mobile'],
    tags: ['ethereum', 'web3', 'defi'],
    heroTitle: 'Secure Web3 Wallet',
    heroDescription: 'Connect to the decentralized web',
    heroGradient: 'from-orange-500 to-red-500',
    whyGoodTitle: 'Why MetaMask?',
    whyGoodContent: ['Trusted by millions', 'Open source', 'Easy to use'],
    features: [
      { icon: 'shield', title: 'Secure', description: 'Bank-level security' }
    ],
    howToStartTitle: 'Getting Started',
    howToStartSteps: [
      { number: 1, title: 'Install', description: 'Download the extension' }
    ],
    pros: ['User-friendly', 'Wide support'],
    cons: ['Chrome dependency'],
    faq: [
      { question: 'Is it safe?', answer: 'Yes, very safe' }
    ],
    securityTips: [
      { icon: 'lock', title: 'Backup', description: 'Save your seed phrase' }
    ],
  }

  const mockResource = {
    id: mockResourceId,
    ...mockResourceData,
    platforms: JSON.stringify(mockResourceData.platforms),
    tags: JSON.stringify(mockResourceData.tags),
    whyGoodContent: JSON.stringify(mockResourceData.whyGoodContent),
    features: JSON.stringify(mockResourceData.features),
    howToStartSteps: JSON.stringify(mockResourceData.howToStartSteps),
    pros: JSON.stringify(mockResourceData.pros),
    cons: JSON.stringify(mockResourceData.cons),
    faq: JSON.stringify(mockResourceData.faq),
    securityTips: JSON.stringify(mockResourceData.securityTips),
    securityAudit: null,
    securityAuditDate: null,
    auditedByCommunity: false,
    toolConfig: null,
    interactiveType: null,
    showCompatibleWallets: false,
    relatedResources: null,
    views: 0,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
  }

  beforeEach(() => {
    service = new ResourceService()
    jest.clearAllMocks()
  })

  describe('create', () => {
    it('should create resource successfully', async () => {
      prismaMock.resource.findUnique.mockResolvedValue(null) // Slug doesn't exist
      prismaMock.resource.create.mockResolvedValue(mockResource as any)

      const result = await service.create(mockResourceData, mockUserId)

      expect(result.id).toBe(mockResourceId)
      expect(result.slug).toBe(mockResourceData.slug)
      expect(prismaMock.resource.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          slug: mockResourceData.slug,
          name: mockResourceData.name,
          category: mockResourceData.category,
        }),
      })
      expect(mockLogger.info).toHaveBeenCalledWith('Resource created successfully', expect.any(Object))
    })

    it('should throw error if slug already exists', async () => {
      prismaMock.resource.findUnique.mockResolvedValue({ id: 'existing-id' } as any)

      await expect(
        service.create(mockResourceData, mockUserId)
      ).rejects.toThrow('Resource with slug "metamask-wallet" already exists')

      expect(prismaMock.resource.create).not.toHaveBeenCalled()
    })

    it('should log context and clear it', async () => {
      prismaMock.resource.findUnique.mockResolvedValue(null)
      prismaMock.resource.create.mockResolvedValue(mockResource as any)

      await service.create(mockResourceData, mockUserId)

      expect(mockLogger.setContext).toHaveBeenCalledWith(
        expect.objectContaining({ operation: 'resource.create' })
      )
      expect(mockLogger.clearContext).toHaveBeenCalled()
    })

    it('should clear context even on error', async () => {
      prismaMock.resource.findUnique.mockRejectedValue(new Error('DB error'))

      try {
        await service.create(mockResourceData, mockUserId)
      } catch (e) {
        // Expected error
      }

      expect(mockLogger.clearContext).toHaveBeenCalled()
    })

    it('should handle JSON fields correctly', async () => {
      prismaMock.resource.findUnique.mockResolvedValue(null)
      prismaMock.resource.create.mockResolvedValue(mockResource as any)

      await service.create(mockResourceData, mockUserId)

      expect(prismaMock.resource.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          platforms: JSON.stringify(mockResourceData.platforms),
          tags: JSON.stringify(mockResourceData.tags),
          features: JSON.stringify(mockResourceData.features),
        }),
      })
    })
  })

  describe('getById', () => {
    it('should return resource by ID', async () => {
      prismaMock.resource.findUnique.mockResolvedValue(mockResource as any)

      const result = await service.getById(mockResourceId)

      expect(result).toMatchObject({
        id: mockResourceId,
        slug: mockResourceData.slug,
      })
      expect(prismaMock.resource.findUnique).toHaveBeenCalledWith({
        where: { id: mockResourceId },
      })
    })

    it('should return null if resource not found', async () => {
      prismaMock.resource.findUnique.mockResolvedValue(null)

      const result = await service.getById('nonexistent-id')

      expect(result).toBeNull()
      expect(mockLogger.warn).toHaveBeenCalledWith('Resource not found by ID', expect.any(Object))
    })

    it('should handle database errors', async () => {
      const dbError = new Error('Database connection failed')
      prismaMock.resource.findUnique.mockRejectedValue(dbError)

      await expect(
        service.getById(mockResourceId)
      ).rejects.toThrow('Database connection failed')

      expect(mockLogger.error).toHaveBeenCalledWith('Error getting resource by ID', dbError, expect.any(Object))
    })
  })

  describe('getBySlug', () => {
    it('should return resource by slug without incrementing views', async () => {
      prismaMock.resource.findUnique.mockResolvedValue(mockResource as any)

      const result = await service.getBySlug(mockResourceData.slug, false)

      expect(result).toMatchObject({
        slug: mockResourceData.slug,
      })
      expect(prismaMock.resource.update).not.toHaveBeenCalled()
    })

    it('should increment views when requested', async () => {
      prismaMock.resource.findUnique.mockResolvedValue(mockResource as any)
      prismaMock.resource.update.mockResolvedValue({ ...mockResource, views: 1 } as any)

      const result = await service.getBySlug(mockResourceData.slug, true)

      expect(prismaMock.resource.update).toHaveBeenCalledWith({
        where: { slug: mockResourceData.slug },
        data: { views: { increment: 1 } },
      })
      expect(mockLogger.info).toHaveBeenCalledWith(
        'Resource found and view incremented',
        expect.objectContaining({ id: mockResourceId, slug: mockResourceData.slug })
      )
    })

    it('should return null if slug not found', async () => {
      prismaMock.resource.findUnique.mockResolvedValue(null)

      const result = await service.getBySlug('nonexistent-slug')

      expect(result).toBeNull()
      expect(mockLogger.warn).toHaveBeenCalledWith('Resource not found by slug', expect.any(Object))
    })

    it('should handle database errors', async () => {
      const dbError = new Error('Database connection lost')
      prismaMock.resource.findUnique.mockRejectedValue(dbError)

      await expect(
        service.getBySlug('test-slug')
      ).rejects.toThrow('Database connection lost')

      expect(mockLogger.error).toHaveBeenCalledWith('Error getting resource by slug', dbError, expect.any(Object))
    })
  })

  describe('list', () => {
    const mockResources = [
      { ...mockResource, id: 'res-1' },
      { ...mockResource, id: 'res-2' },
      { ...mockResource, id: 'res-3' },
    ]

    it('should list resources with default pagination', async () => {
      prismaMock.resource.findMany.mockResolvedValue(mockResources as any)
      prismaMock.resource.count.mockResolvedValue(3)

      const result = await service.list()

      expect(result.resources).toHaveLength(3)
      expect(result.total).toBe(3)
      expect(result.page).toBe(1)
      expect(result.limit).toBe(12)
      expect(result.totalPages).toBe(1)
      expect(result.hasMore).toBe(false)
    })

    it('should filter by category', async () => {
      prismaMock.resource.findMany.mockResolvedValue([mockResources[0]] as any)
      prismaMock.resource.count.mockResolvedValue(1)

      await service.list({ category: 'wallets' })

      expect(prismaMock.resource.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ category: 'wallets' }),
        })
      )
    })

    it('should filter by verified status', async () => {
      prismaMock.resource.findMany.mockResolvedValue(mockResources as any)
      prismaMock.resource.count.mockResolvedValue(3)

      await service.list({ verified: true })

      expect(prismaMock.resource.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ verified: true }),
        })
      )
    })

    it('should filter by interactiveType', async () => {
      prismaMock.resource.findMany.mockResolvedValue([mockResources[0]] as any)
      prismaMock.resource.count.mockResolvedValue(1)

      await service.list({ interactiveType: 'calculator' })

      expect(prismaMock.resource.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ interactiveType: 'calculator' }),
        })
      )
    })

    it('should search by name', async () => {
      prismaMock.resource.findMany.mockResolvedValue([mockResources[0]] as any)
      prismaMock.resource.count.mockResolvedValue(1)

      await service.list({ search: 'metamask' })

      expect(prismaMock.resource.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              { name: { contains: 'metamask', mode: 'insensitive' } },
            ]),
          }),
        })
      )
    })

    it('should handle pagination correctly', async () => {
      prismaMock.resource.findMany.mockResolvedValue([mockResources[0]] as any)
      prismaMock.resource.count.mockResolvedValue(25)

      const result = await service.list({ page: 2, limit: 10 })

      expect(result.totalPages).toBe(3)
      expect(result.hasMore).toBe(true)
      expect(prismaMock.resource.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 10,
          take: 10,
        })
      )
    })

    it('should sort by specified field and order', async () => {
      prismaMock.resource.findMany.mockResolvedValue(mockResources as any)
      prismaMock.resource.count.mockResolvedValue(3)

      await service.list({ sortBy: 'views', sortOrder: 'desc' })

      expect(prismaMock.resource.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { views: 'desc' },
        })
      )
    })

    it('should return empty results gracefully', async () => {
      prismaMock.resource.findMany.mockResolvedValue([])
      prismaMock.resource.count.mockResolvedValue(0)

      const result = await service.list({ search: 'nonexistent' })

      expect(result.resources).toHaveLength(0)
      expect(result.total).toBe(0)
      expect(result.totalPages).toBe(0)
      expect(result.hasMore).toBe(false)
    })

    it('should handle database errors', async () => {
      const dbError = new Error('Database query failed')
      prismaMock.resource.findMany.mockRejectedValue(dbError)

      await expect(
        service.list()
      ).rejects.toThrow('Database query failed')

      expect(mockLogger.error).toHaveBeenCalledWith('Error listing resources', dbError, expect.any(Object))
    })
  })

  describe('update', () => {
    it('should update resource successfully', async () => {
      const updateData = { name: 'Updated MetaMask' }

      prismaMock.resource.findUnique.mockResolvedValue(mockResource as any)
      prismaMock.resource.update.mockResolvedValue({ ...mockResource, ...updateData } as any)

      const result = await service.update(mockResourceId, updateData, mockUserId)

      expect(result.name).toBe('Updated MetaMask')
      expect(mockLogger.info).toHaveBeenCalledWith('Resource updated successfully', expect.any(Object))
    })

    it('should throw error if resource not found', async () => {
      prismaMock.resource.findUnique.mockResolvedValue(null)

      await expect(
        service.update('nonexistent-id', { name: 'Test' }, mockUserId)
      ).rejects.toThrow('Resource with ID "nonexistent-id" not found')

      expect(prismaMock.resource.update).not.toHaveBeenCalled()
    })

    it('should check slug uniqueness when changing slug', async () => {
      prismaMock.resource.findUnique
        .mockResolvedValueOnce(mockResource as any) // Resource exists
        .mockResolvedValueOnce({ id: 'other-id', slug: 'taken-slug' } as any) // Slug taken

      await expect(
        service.update(mockResourceId, { slug: 'taken-slug' }, mockUserId)
      ).rejects.toThrow('Resource with slug "taken-slug" already exists')

      expect(prismaMock.resource.update).not.toHaveBeenCalled()
    })

    it('should allow same slug for same resource', async () => {
      prismaMock.resource.findUnique.mockResolvedValue(mockResource as any)
      prismaMock.resource.update.mockResolvedValue({ ...mockResource, name: 'Updated' } as any)

      const result = await service.update(
        mockResourceId,
        { slug: mockResourceData.slug, name: 'Updated' },
        mockUserId
      )

      expect(result.name).toBe('Updated')
      // Should not check for slug uniqueness since it's the same
      expect(prismaMock.resource.findUnique).toHaveBeenCalledTimes(1)
    })

    it('should update JSON fields correctly', async () => {
      const newTags = ['new', 'tags']
      prismaMock.resource.findUnique.mockResolvedValue(mockResource as any)
      prismaMock.resource.update.mockResolvedValue(mockResource as any)

      await service.update(mockResourceId, { tags: newTags }, mockUserId)

      expect(prismaMock.resource.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            tags: JSON.stringify(newTags),
          }),
        })
      )
    })
  })

  describe('delete', () => {
    it('should delete resource successfully', async () => {
      prismaMock.resource.findUnique.mockResolvedValue(mockResource as any)
      prismaMock.resource.delete.mockResolvedValue(mockResource as any)

      await service.delete(mockResourceId, mockUserId)

      expect(prismaMock.resource.delete).toHaveBeenCalledWith({ where: { id: mockResourceId } })
      expect(mockLogger.info).toHaveBeenCalledWith('Resource deleted successfully', expect.any(Object))
    })

    it('should throw error if resource not found', async () => {
      prismaMock.resource.findUnique.mockResolvedValue(null)

      await expect(
        service.delete('nonexistent-id', mockUserId)
      ).rejects.toThrow('Resource with ID "nonexistent-id" not found')

      expect(prismaMock.resource.delete).not.toHaveBeenCalled()
    })
  })

  describe('getStats', () => {
    it('should return comprehensive resource statistics', async () => {
      prismaMock.resource.count
        .mockResolvedValueOnce(100) // total
        .mockResolvedValueOnce(75) // verified

      prismaMock.resource.groupBy.mockResolvedValue([
        { category: 'wallets', _count: 30 },
        { category: 'exchanges', _count: 25 },
        { category: 'defi', _count: 45 },
      ] as any)

      prismaMock.resource.aggregate.mockResolvedValue({
        _sum: { views: 50000 },
        _avg: { views: 500 },
      } as any)

      const result = await service.getStats()

      expect(result).toEqual({
        total: 100,
        verified: 75,
        byCategory: {
          wallets: 30,
          exchanges: 25,
          defi: 45,
        },
        byInteractiveType: expect.any(Object),
        totalViews: 50000,
        avgViewsPerResource: 500,
      })
    })

    it('should handle zero resources gracefully', async () => {
      prismaMock.resource.count.mockResolvedValue(0)
      prismaMock.resource.groupBy.mockResolvedValue([])
      prismaMock.resource.aggregate.mockResolvedValue({
        _sum: { views: null },
        _avg: { views: null },
      } as any)

      const result = await service.getStats()

      expect(result.total).toBe(0)
      expect(result.totalViews).toBe(0)
      expect(result.avgViewsPerResource).toBe(0)
    })

    it('should handle database errors', async () => {
      const dbError = new Error('Database aggregation failed')
      prismaMock.resource.count.mockRejectedValue(dbError)

      await expect(
        service.getStats()
      ).rejects.toThrow('Database aggregation failed')

      expect(mockLogger.error).toHaveBeenCalledWith('Error fetching resource statistics', dbError)
    })
  })

  describe('getByCategory', () => {
    const walletResources = [
      { ...mockResource, id: 'res-1', category: 'wallets' },
      { ...mockResource, id: 'res-2', category: 'wallets' },
    ]

    it('should return resources with specified category', async () => {
      prismaMock.resource.findMany.mockResolvedValue(walletResources as any)

      const result = await service.getByCategory('wallets')

      expect(prismaMock.resource.findMany).toHaveBeenCalledWith({
        where: { category: 'wallets', verified: true },
        orderBy: { views: 'desc' },
        take: 12,
      })
      expect(result).toHaveLength(2)
    })

    it('should respect custom limit', async () => {
      prismaMock.resource.findMany.mockResolvedValue([walletResources[0]] as any)

      await service.getByCategory('wallets', 5)

      expect(prismaMock.resource.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ take: 5 })
      )
    })

    it('should return empty array if no resources found', async () => {
      prismaMock.resource.findMany.mockResolvedValue([])

      const result = await service.getByCategory('nonexistent-category')

      expect(result).toHaveLength(0)
    })

    it('should handle database errors', async () => {
      const dbError = new Error('Database timeout')
      prismaMock.resource.findMany.mockRejectedValue(dbError)

      await expect(
        service.getByCategory('wallets')
      ).rejects.toThrow('Database timeout')

      expect(mockLogger.error).toHaveBeenCalledWith('Error getting resources by category', dbError, expect.any(Object))
    })
  })

  describe('getPopular', () => {
    const popularResources = [
      { ...mockResource, id: 'res-1', views: 1000 },
      { ...mockResource, id: 'res-2', views: 800 },
      { ...mockResource, id: 'res-3', views: 600 },
    ]

    it('should return popular resources sorted by views', async () => {
      prismaMock.resource.findMany.mockResolvedValue(popularResources as any)

      const result = await service.getPopular()

      expect(prismaMock.resource.findMany).toHaveBeenCalledWith({
        where: { verified: true },
        orderBy: { views: 'desc' },
        take: 10,
      })
      expect(result).toHaveLength(3)
    })

    it('should respect custom limit', async () => {
      prismaMock.resource.findMany.mockResolvedValue(popularResources as any)

      await service.getPopular(5)

      expect(prismaMock.resource.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ take: 5 })
      )
    })

    it('should handle database errors', async () => {
      const dbError = new Error('Database connection failed')
      prismaMock.resource.findMany.mockRejectedValue(dbError)

      await expect(
        service.getPopular()
      ).rejects.toThrow('Database connection failed')

      expect(mockLogger.error).toHaveBeenCalledWith('Error getting popular resources', dbError)
    })
  })

  describe('search', () => {
    it('should search resources by query', async () => {
      prismaMock.resource.findMany.mockResolvedValue([mockResource] as any)

      const result = await service.search('metamask')

      expect(prismaMock.resource.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { name: { contains: 'metamask', mode: 'insensitive' } },
            { shortDescription: { contains: 'metamask', mode: 'insensitive' } },
            { category: { contains: 'metamask', mode: 'insensitive' } },
          ],
          verified: true,
        },
        orderBy: { views: 'desc' },
        take: 20,
      })
      expect(result).toHaveLength(1)
    })

    it('should respect custom limit', async () => {
      prismaMock.resource.findMany.mockResolvedValue([mockResource] as any)

      await service.search('wallet', 10)

      expect(prismaMock.resource.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ take: 10 })
      )
    })

    it('should return empty array if no matches found', async () => {
      prismaMock.resource.findMany.mockResolvedValue([])

      const result = await service.search('nonexistent')

      expect(result).toHaveLength(0)
    })

    it('should handle database errors', async () => {
      const dbError = new Error('Database query error')
      prismaMock.resource.findMany.mockRejectedValue(dbError)

      await expect(
        service.search('test')
      ).rejects.toThrow('Database query error')

      expect(mockLogger.error).toHaveBeenCalledWith('Error searching resources', dbError, expect.any(Object))
    })
  })

  describe('edge cases and error handling', () => {
    it('should handle concurrent requests gracefully', async () => {
      prismaMock.resource.findMany.mockResolvedValue([mockResource] as any)
      prismaMock.resource.count.mockResolvedValue(1)

      const promises = [
        service.list({}),
        service.list({ category: 'wallets' }),
        service.list({ verified: true }),
      ]

      const results = await Promise.all(promises)

      expect(results).toHaveLength(3)
      results.forEach(result => {
        expect(result).toHaveProperty('resources')
        expect(result).toHaveProperty('total')
      })
    })

    it('should clear context on all error paths', async () => {
      const methods = [
        () => service.create(mockResourceData, 'admin'),
        () => service.getById('id'),
        () => service.update('id', {}, 'admin'),
        () => service.delete('id', 'admin'),
      ]

      for (const method of methods) {
        jest.clearAllMocks()
        prismaMock.resource.findUnique.mockRejectedValue(new Error('DB error'))

        try {
          await method()
        } catch (e) {
          // Expected error
        }

        expect(mockLogger.clearContext).toHaveBeenCalled()
      }
    })
  })
})
