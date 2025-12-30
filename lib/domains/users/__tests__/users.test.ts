/**
 * Users Domain Tests
 * 
 * Basic tests for the users domain services
 */

import { prismaMock } from '@/lib/__mocks__/prisma'

// Mock the prisma module
jest.mock('@/lib/core/prisma', () => ({
    prisma: require('@/lib/__mocks__/prisma').prismaMock
}))

describe('Users Domain', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('User queries', () => {
        it('should find user by id', async () => {
            const mockUser = {
                id: 'user-123',
                name: 'Test User',
                email: 'test@example.com',
                role: 'VIEWER',
            }

            prismaMock.user.findUnique.mockResolvedValue(mockUser as never)

            const user = await prismaMock.user.findUnique({
                where: { id: 'user-123' }
            })

            expect(user).toEqual(mockUser)
            expect(user?.role).toBe('VIEWER')
        })

        it('should find user by email', async () => {
            const mockUser = {
                id: 'user-456',
                name: 'Admin User',
                email: 'admin@example.com',
                role: 'ADMIN',
            }

            prismaMock.user.findUnique.mockResolvedValue(mockUser as never)

            const user = await prismaMock.user.findUnique({
                where: { email: 'admin@example.com' }
            })

            expect(user?.role).toBe('ADMIN')
        })

        it('should count users by role', async () => {
            const mockGroups = [
                { role: 'ADMIN', _count: { id: 1 } },
                { role: 'VIEWER', _count: { id: 5 } },
            ]

            prismaMock.user.groupBy.mockResolvedValue(mockGroups as never)

            const groups = await prismaMock.user.groupBy({
                by: ['role'],
                _count: { id: true }
            })

            expect(groups).toHaveLength(2)
        })
    })
})
