/**
 * UserService Tests
 * 
 * Tests for the UserService class methods
 */

import { prismaMock } from '@/lib/__mocks__/prisma'

// Mock the prisma module
jest.mock('@/lib/core/prisma', () => ({
    prisma: require('@/lib/__mocks__/prisma').prismaMock
}))

// Mock bcrypt
jest.mock('bcryptjs', () => ({
    hash: jest.fn().mockResolvedValue('hashed_password'),
    compare: jest.fn().mockResolvedValue(true),
}))

// Mock logger service instance
const mockLogger = {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    setContext: jest.fn().mockReturnThis(),
    clearContext: jest.fn().mockReturnThis(),
}

// Mock validation service instance
const mockValidation = {
    isValidEmail: jest.fn().mockReturnValue(true),
    isValidUUID: jest.fn().mockReturnValue(true),
}

// Mock the DI container (tsyringe)
jest.mock('tsyringe', () => ({
    container: {
        resolve: jest.fn((token: string) => {
            if (token === 'LoggerService') return mockLogger
            if (token === 'ValidationService') return mockValidation
            return {}
        }),
    },
    injectable: () => jest.fn(),
    singleton: () => jest.fn(),
}))


describe('UserService', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('getById', () => {
        it('should return user when found', async () => {
            const mockUser = {
                id: 'user-123',
                name: 'Test User',
                email: 'test@example.com',
                role: 'VIEWER',
                points: 100,
                badges: ['early_adopter'],
                createdAt: new Date(),
                updatedAt: new Date(),
            }

            prismaMock.user.findUnique.mockResolvedValue(mockUser as never)

            const { UserService } = await import('../services/user.service')
            const service = new UserService()

            const result = await service.getById('user-123')

            expect(result).toEqual(mockUser)
            expect(prismaMock.user.findUnique).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: { id: 'user-123' }
                })
            )
        })

        it('should return null when user not found', async () => {
            prismaMock.user.findUnique.mockResolvedValue(null as never)

            const { UserService } = await import('../services/user.service')
            const service = new UserService()

            const result = await service.getById('non-existent')

            expect(result).toBeNull()
        })
    })

    describe('getByEmail', () => {
        it('should return user when found by email', async () => {
            const mockUser = {
                id: 'user-456',
                name: 'Admin User',
                email: 'admin@example.com',
                role: 'ADMIN',
            }

            prismaMock.user.findUnique.mockResolvedValue(mockUser as never)

            const { UserService } = await import('../services/user.service')
            const service = new UserService()

            const result = await service.getByEmail('admin@example.com')

            expect(result?.role).toBe('ADMIN')
            expect(prismaMock.user.findUnique).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: { email: 'admin@example.com' }
                })
            )
        })
    })

    describe('list', () => {
        it('should return paginated list of users', async () => {
            const mockUsers = [
                { id: 'user-1', name: 'User 1', email: 'user1@example.com', role: 'VIEWER' },
                { id: 'user-2', name: 'User 2', email: 'user2@example.com', role: 'VIEWER' },
            ]

            prismaMock.user.findMany.mockResolvedValue(mockUsers as never)
            prismaMock.user.count.mockResolvedValue(2 as never)

            const { UserService } = await import('../services/user.service')
            const service = new UserService()

            const result = await service.list({ limit: 10, page: 1 })

            expect(result.users).toHaveLength(2)
            expect(result.total).toBe(2)
        })

        it('should filter users by role', async () => {
            const mockAdmins = [
                { id: 'admin-1', name: 'Admin 1', email: 'admin1@example.com', role: 'ADMIN' },
            ]

            prismaMock.user.findMany.mockResolvedValue(mockAdmins as never)
            prismaMock.user.count.mockResolvedValue(1 as never)

            const { UserService } = await import('../services/user.service')
            const service = new UserService()

            const result = await service.list({ role: 'ADMIN' })

            expect(result.users).toHaveLength(1)
            expect(result.users[0].role).toBe('ADMIN')
        })
    })

    describe('awardPoints', () => {
        it('should add points to user', async () => {
            const mockUser = {
                id: 'user-123',
                name: 'Test User',
                points: 100,
            }

            const updatedUser = {
                ...mockUser,
                points: 150,
            }

            prismaMock.user.findUnique.mockResolvedValue(mockUser as never)
            prismaMock.user.update.mockResolvedValue(updatedUser as never)

            const { UserService } = await import('../services/user.service')
            const service = new UserService()

            const result = await service.awardPoints('user-123', 50)

            expect(result.points).toBe(150)
            expect(prismaMock.user.update).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: { id: 'user-123' },
                    data: expect.objectContaining({
                        points: { increment: 50 }
                    })
                })
            )
        })
    })

    describe('addBadge', () => {
        it('should add badge to user', async () => {
            // badges é armazenado como JSON string no banco
            const mockUser = {
                id: 'user-123',
                name: 'Test User',
                badges: JSON.stringify(['early_adopter']),
            }

            const updatedUser = {
                id: 'user-123',
                name: 'Test User',
                badges: JSON.stringify(['early_adopter', 'contributor']),
            }

            prismaMock.user.findUnique.mockResolvedValue(mockUser as never)
            prismaMock.user.update.mockResolvedValue(updatedUser as never)

            const { UserService } = await import('../services/user.service')
            const service = new UserService()

            const result = await service.addBadge('user-123', 'contributor')

            // O resultado retorna badges como string JSON
            expect(result.badges).toBe(JSON.stringify(['early_adopter', 'contributor']))
        })
    })

    describe('getStats', () => {
        it('should return user statistics', async () => {
            // Mock todos os métodos usados por getStats
            prismaMock.user.count.mockResolvedValue(100 as never)
            prismaMock.user.groupBy.mockResolvedValue([
                { role: 'ADMIN', _count: 5 },
                { role: 'VIEWER', _count: 95 },
            ] as never)
            prismaMock.user.aggregate.mockResolvedValue({
                _sum: { points: 5000 },
                _avg: { points: 50 },
            } as never)

            const { UserService } = await import('../services/user.service')
            const service = new UserService()

            const result = await service.getStats()

            expect(result.total).toBe(100)
            expect(result.totalPoints).toBe(5000)
            expect(result.avgPointsPerUser).toBe(50)
        })
    })
})
