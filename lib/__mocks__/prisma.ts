/**
 * Prisma Client Mock for Testing
 *
 * Usage in tests:
 * import { prismaMock } from '@/lib/__mocks__/prisma'
 *
 * prismaMock.article.findUnique.mockResolvedValue({...})
 */

import { PrismaClient } from '@/lib/generated/prisma'
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended'

// Create deep mock of PrismaClient
export const prismaMock = mockDeep<PrismaClient>() as unknown as DeepMockProxy<PrismaClient>

// Reset mocks between tests
beforeEach(() => {
  mockReset(prismaMock)
})

// Export singleton instance
let prisma: PrismaClient

if (process.env.NODE_ENV === 'test') {
  prisma = prismaMock as unknown as PrismaClient
} else {
  prisma = new PrismaClient()
}

export { prisma }
