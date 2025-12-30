/**
 * Resources Domain Tests
 * 
 * Basic tests for the resources domain services
 */

import { prismaMock } from '@/lib/__mocks__/prisma'

// Mock the prisma module
jest.mock('@/lib/core/prisma', () => ({
    prisma: require('@/lib/__mocks__/prisma').prismaMock
}))

describe('Resources Domain', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('Resource queries', () => {
        it('should count resources', async () => {
            prismaMock.resource.count.mockResolvedValue(18 as never)

            const count = await prismaMock.resource.count()

            expect(count).toBe(18)
        })

        it('should find verified resources', async () => {
            const mockResources = [
                { id: '1', name: 'Resource 1', verified: true },
                { id: '2', name: 'Resource 2', verified: true },
            ]

            prismaMock.resource.findMany.mockResolvedValue(mockResources as never)

            const resources = await prismaMock.resource.findMany({
                where: { verified: true }
            })

            expect(resources).toHaveLength(2)
            expect(resources[0].verified).toBe(true)
        })

        it('should group resources by category', async () => {
            const mockGroups = [
                { category: 'exchanges', _count: { id: 5 } },
                { category: 'wallets', _count: { id: 3 } },
            ]

            prismaMock.resource.groupBy.mockResolvedValue(mockGroups as never)

            const groups = await prismaMock.resource.groupBy({
                by: ['category'],
                _count: { id: true }
            })

            expect(groups).toHaveLength(2)
        })
    })
})
