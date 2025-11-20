/**
 * Tests for UserService
 * Coverage target: 99%+ (comprehensive test suite)
 *
 * Tests all 11 methods:
 * 1. create
 * 2. getById
 * 3. getByEmail
 * 4. list
 * 5. update
 * 6. delete
 * 7. verifyPassword
 * 8. awardPoints
 * 9. addBadge
 * 10. getStats
 * 11. getByRole
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

// Mock services BEFORE imports
jest.mock('../logger-service', () => ({
  logger: {
    setContext: jest.fn(),
    clearContext: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}))

jest.mock('../validation-service', () => ({
  validationService: {
    validate: jest.fn((schema, data) => data),
    sanitizeHtml: jest.fn((html) => html),
  },
}))

// Mock bcryptjs for password hashing
jest.mock('bcryptjs', () => ({
  hash: jest.fn((password: string) => Promise.resolve(`hashed_${password}`)),
  compare: jest.fn((password: string, hash: string) =>
    Promise.resolve(hash === `hashed_${password}`)
  ),
}))

import { UserService } from '../user-service'
import { prismaMock } from '@/lib/__mocks__/prisma'
import bcrypt from 'bcryptjs'

describe('UserService', () => {
  let service: UserService

  const mockUserId = 'user-123'
  const mockAdminId = 'admin-123'

  const mockUserData = {
    email: 'test@example.com',
    password: 'SecurePass123',
    name: 'Test User',
    role: 'VIEWER' as const,
  }

  const mockUser = {
    id: mockUserId,
    email: mockUserData.email,
    password: 'hashed_SecurePass123',
    name: mockUserData.name,
    role: mockUserData.role,
    image: null,
    points: 0,
    badges: null,
    emailVerified: null,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
  }

  beforeEach(() => {
    service = new UserService()
    jest.clearAllMocks()
  })

  describe('create', () => {
    it('should create user successfully with hashed password', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null) // Email doesn't exist
      prismaMock.user.create.mockResolvedValue(mockUser as any)

      const result = await service.create(mockUserData, mockAdminId)

      expect(bcrypt.hash).toHaveBeenCalledWith('SecurePass123', 10)
      expect(prismaMock.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          email: mockUserData.email,
          password: 'hashed_SecurePass123',
          name: mockUserData.name,
          role: 'VIEWER',
          points: 0,
          badges: null,
        }),
      })

      expect(result).not.toHaveProperty('password')
      expect(result.email).toBe(mockUserData.email)
      expect(mockLogger.info).toHaveBeenCalledWith('User created successfully', expect.any(Object))
    })

    it('should throw error if email already exists', async () => {
      prismaMock.user.findUnique.mockResolvedValue(mockUser as any)

      await expect(
        service.create(mockUserData, mockAdminId)
      ).rejects.toThrow('User with email "test@example.com" already exists')

      expect(prismaMock.user.create).not.toHaveBeenCalled()
    })

    it('should throw error for invalid email format', async () => {
      const invalidData = { ...mockUserData, email: 'invalid-email' }

      await expect(
        service.create(invalidData, mockAdminId)
      ).rejects.toThrow('Invalid email format')

      expect(prismaMock.user.create).not.toHaveBeenCalled()
    })

    it('should throw error for password too short', async () => {
      const shortPasswordData = { ...mockUserData, password: '123' }

      await expect(
        service.create(shortPasswordData, mockAdminId)
      ).rejects.toThrow('Password must be at least 6 characters')

      expect(prismaMock.user.create).not.toHaveBeenCalled()
    })

    it('should default role to VIEWER if not provided', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null)
      prismaMock.user.create.mockResolvedValue(mockUser as any)

      const dataWithoutRole = { ...mockUserData }
      delete (dataWithoutRole as any).role

      await service.create(dataWithoutRole, mockAdminId)

      expect(prismaMock.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ role: 'VIEWER' }),
      })
    })

    it('should handle optional fields (name, image)', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null)
      prismaMock.user.create.mockResolvedValue(mockUser as any)

      const minimalData = {
        email: mockUserData.email,
        password: mockUserData.password,
      }

      await service.create(minimalData, mockAdminId)

      expect(prismaMock.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          email: minimalData.email,
          name: undefined,
          image: undefined,
        }),
      })
    })

    it('should log context and clear it', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null)
      prismaMock.user.create.mockResolvedValue(mockUser as any)

      await service.create(mockUserData, mockAdminId)

      expect(mockLogger.setContext).toHaveBeenCalledWith(
        expect.objectContaining({ operation: 'user.create', adminId: mockAdminId })
      )
      expect(mockLogger.clearContext).toHaveBeenCalled()
    })

    it('should clear context even on error', async () => {
      prismaMock.user.findUnique.mockRejectedValue(new Error('Database error'))

      await expect(
        service.create(mockUserData, mockAdminId)
      ).rejects.toThrow('Database error')

      expect(mockLogger.clearContext).toHaveBeenCalled()
    })
  })

  describe('getById', () => {
    it('should return user without password by default', async () => {
      prismaMock.user.findUnique.mockResolvedValue(mockUser as any)

      const result = await service.getById(mockUserId)

      expect(result).not.toHaveProperty('password')
      expect(result).toMatchObject({
        id: mockUserId,
        email: mockUserData.email,
        name: mockUserData.name,
      })
      expect(mockLogger.info).toHaveBeenCalledWith('User found by ID', expect.any(Object))
    })

    it('should return user with password when includeSensitive=true', async () => {
      prismaMock.user.findUnique.mockResolvedValue(mockUser as any)

      const result = await service.getById(mockUserId, true)

      expect(result).toHaveProperty('password')
      expect(result?.password).toBe('hashed_SecurePass123')
    })

    it('should return null if user not found', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null)

      const result = await service.getById('nonexistent-id')

      expect(result).toBeNull()
      expect(mockLogger.warn).toHaveBeenCalledWith('User not found by ID', expect.any(Object))
    })

    it('should handle database errors', async () => {
      prismaMock.user.findUnique.mockRejectedValue(new Error('Database error'))

      await expect(
        service.getById(mockUserId)
      ).rejects.toThrow('Database error')

      expect(mockLogger.error).toHaveBeenCalledWith('Error getting user by ID', expect.any(Error), expect.any(Object))
    })
  })

  describe('getByEmail', () => {
    it('should return user without password by default', async () => {
      prismaMock.user.findUnique.mockResolvedValue(mockUser as any)

      const result = await service.getByEmail(mockUserData.email)

      expect(result).not.toHaveProperty('password')
      expect(result).toMatchObject({
        id: mockUserId,
        email: mockUserData.email,
      })
    })

    it('should return user with password when includeSensitive=true', async () => {
      prismaMock.user.findUnique.mockResolvedValue(mockUser as any)

      const result = await service.getByEmail(mockUserData.email, true)

      expect(result).toHaveProperty('password')
    })

    it('should return null if user not found', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null)

      const result = await service.getByEmail('nonexistent@example.com')

      expect(result).toBeNull()
      expect(mockLogger.warn).toHaveBeenCalledWith('User not found by email', expect.any(Object))
    })

    it('should handle database errors', async () => {
      const dbError = new Error('Database connection failed')
      prismaMock.user.findUnique.mockRejectedValue(dbError)

      await expect(
        service.getByEmail('test@example.com')
      ).rejects.toThrow('Database connection failed')

      expect(mockLogger.error).toHaveBeenCalledWith('Error getting user by email', dbError, expect.any(Object))
    })
  })

  describe('list', () => {
    const mockUsers = [
      { ...mockUser, id: 'user-1' },
      { ...mockUser, id: 'user-2' },
      { ...mockUser, id: 'user-3' },
    ]

    it('should list users with default pagination', async () => {
      prismaMock.user.findMany.mockResolvedValue(mockUsers as any)
      prismaMock.user.count.mockResolvedValue(3)

      const result = await service.list()

      expect(result.users).toHaveLength(3)
      expect(result.total).toBe(3)
      expect(result.page).toBe(1)
      expect(result.limit).toBe(12)
      expect(result.totalPages).toBe(1)
      expect(result.hasMore).toBe(false)

      // Verify no passwords in results
      result.users.forEach(user => {
        expect(user).not.toHaveProperty('password')
      })
    })

    it('should filter by role', async () => {
      prismaMock.user.findMany.mockResolvedValue([mockUsers[0]] as any)
      prismaMock.user.count.mockResolvedValue(1)

      await service.list({ role: 'ADMIN' })

      expect(prismaMock.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ role: 'ADMIN' }),
        })
      )
    })

    it('should search by name or email', async () => {
      prismaMock.user.findMany.mockResolvedValue([mockUsers[0]] as any)
      prismaMock.user.count.mockResolvedValue(1)

      await service.list({ search: 'test' })

      expect(prismaMock.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: [
              { email: { contains: 'test', mode: 'insensitive' } },
              { name: { contains: 'test', mode: 'insensitive' } },
            ],
          }),
        })
      )
    })

    it('should handle pagination correctly', async () => {
      prismaMock.user.findMany.mockResolvedValue([mockUsers[0]] as any)
      prismaMock.user.count.mockResolvedValue(25)

      const result = await service.list({ page: 2, limit: 10 })

      expect(result.totalPages).toBe(3)
      expect(result.hasMore).toBe(true)
      expect(prismaMock.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 10,
          take: 10,
        })
      )
    })

    it('should respect maximum limit (100)', async () => {
      prismaMock.user.findMany.mockResolvedValue(mockUsers as any)
      prismaMock.user.count.mockResolvedValue(3)

      await service.list({ limit: 200 })

      expect(prismaMock.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ take: 100 })
      )
    })

    it('should sort by specified field and order', async () => {
      prismaMock.user.findMany.mockResolvedValue(mockUsers as any)
      prismaMock.user.count.mockResolvedValue(3)

      await service.list({ sortBy: 'email', sortOrder: 'asc' })

      expect(prismaMock.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { email: 'asc' },
        })
      )
    })

    it('should default to sorting by createdAt desc', async () => {
      prismaMock.user.findMany.mockResolvedValue(mockUsers as any)
      prismaMock.user.count.mockResolvedValue(3)

      await service.list({})

      expect(prismaMock.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { createdAt: 'desc' },
        })
      )
    })

    it('should combine role filter and search', async () => {
      prismaMock.user.findMany.mockResolvedValue([mockUsers[0]] as any)
      prismaMock.user.count.mockResolvedValue(1)

      await service.list({ role: 'EDITOR', search: 'john' })

      expect(prismaMock.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            role: 'EDITOR',
            OR: expect.any(Array),
          }),
        })
      )
    })

    it('should return empty results gracefully', async () => {
      prismaMock.user.findMany.mockResolvedValue([])
      prismaMock.user.count.mockResolvedValue(0)

      const result = await service.list({ search: 'nonexistent' })

      expect(result.users).toHaveLength(0)
      expect(result.total).toBe(0)
      expect(result.totalPages).toBe(0)
      expect(result.hasMore).toBe(false)
    })

    it('should handle database errors', async () => {
      const dbError = new Error('Database query failed')
      prismaMock.user.findMany.mockRejectedValue(dbError)

      await expect(
        service.list()
      ).rejects.toThrow('Database query failed')

      expect(mockLogger.error).toHaveBeenCalledWith('Error listing users', dbError, expect.any(Object))
    })
  })

  describe('update', () => {
    it('should update user successfully', async () => {
      const updateData = { name: 'Updated Name' }

      prismaMock.user.findUnique.mockResolvedValue(mockUser as any)
      prismaMock.user.update.mockResolvedValue({ ...mockUser, ...updateData } as any)

      const result = await service.update(mockUserId, updateData, mockAdminId)

      expect(result.name).toBe('Updated Name')
      expect(result).not.toHaveProperty('password')
      expect(mockLogger.info).toHaveBeenCalledWith('User updated successfully', expect.any(Object))
    })

    it('should throw error if user not found', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null)

      await expect(
        service.update('nonexistent-id', { name: 'Test' }, mockAdminId)
      ).rejects.toThrow('User with ID "nonexistent-id" not found')

      expect(prismaMock.user.update).not.toHaveBeenCalled()
    })

    it('should validate email format when updating email', async () => {
      prismaMock.user.findUnique.mockResolvedValue(mockUser as any)

      await expect(
        service.update(mockUserId, { email: 'invalid-email' }, mockAdminId)
      ).rejects.toThrow('Invalid email format')

      expect(prismaMock.user.update).not.toHaveBeenCalled()
    })

    it('should check email uniqueness when changing email', async () => {
      prismaMock.user.findUnique
        .mockResolvedValueOnce(mockUser as any) // User exists
        .mockResolvedValueOnce({ id: 'other-id', email: 'taken@example.com' } as any) // Email taken

      await expect(
        service.update(mockUserId, { email: 'taken@example.com' }, mockAdminId)
      ).rejects.toThrow('User with email "taken@example.com" already exists')

      expect(prismaMock.user.update).not.toHaveBeenCalled()
    })

    it('should allow same email (no change)', async () => {
      prismaMock.user.findUnique.mockResolvedValue(mockUser as any)
      prismaMock.user.update.mockResolvedValue({ ...mockUser, name: 'Updated' } as any)

      const result = await service.update(
        mockUserId,
        { email: mockUserData.email, name: 'Updated' },
        mockAdminId
      )

      expect(result.name).toBe('Updated')
      // Should not check for email uniqueness since it's the same
      expect(prismaMock.user.findUnique).toHaveBeenCalledTimes(1)
    })

    it('should hash password when updating', async () => {
      prismaMock.user.findUnique.mockResolvedValue(mockUser as any)
      prismaMock.user.update.mockResolvedValue(mockUser as any)

      await service.update(mockUserId, { password: 'NewPassword123' }, mockAdminId)

      expect(bcrypt.hash).toHaveBeenCalledWith('NewPassword123', 10)
      expect(prismaMock.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ password: 'hashed_NewPassword123' }),
        })
      )
    })

    it('should validate password length when updating', async () => {
      prismaMock.user.findUnique.mockResolvedValue(mockUser as any)

      await expect(
        service.update(mockUserId, { password: '123' }, mockAdminId)
      ).rejects.toThrow('Password must be at least 6 characters')

      expect(prismaMock.user.update).not.toHaveBeenCalled()
    })

    it('should update role', async () => {
      prismaMock.user.findUnique.mockResolvedValue(mockUser as any)
      prismaMock.user.update.mockResolvedValue({ ...mockUser, role: 'ADMIN' } as any)

      const result = await service.update(mockUserId, { role: 'ADMIN' }, mockAdminId)

      expect(result.role).toBe('ADMIN')
    })

    it('should update points', async () => {
      prismaMock.user.findUnique.mockResolvedValue(mockUser as any)
      prismaMock.user.update.mockResolvedValue({ ...mockUser, points: 100 } as any)

      const result = await service.update(mockUserId, { points: 100 }, mockAdminId)

      expect(result.points).toBe(100)
    })

    it('should update badges JSON', async () => {
      prismaMock.user.findUnique.mockResolvedValue(mockUser as any)
      prismaMock.user.update.mockResolvedValue({ ...mockUser, badges: '["badge1"]' } as any)

      const result = await service.update(mockUserId, { badges: '["badge1"]' }, mockAdminId)

      expect(result.badges).toBe('["badge1"]')
    })
  })

  describe('delete', () => {
    it('should delete user successfully', async () => {
      prismaMock.user.findUnique.mockResolvedValue(mockUser as any)
      prismaMock.user.delete.mockResolvedValue(mockUser as any)

      await service.delete(mockUserId, mockAdminId)

      expect(prismaMock.user.delete).toHaveBeenCalledWith({ where: { id: mockUserId } })
      expect(mockLogger.info).toHaveBeenCalledWith('User deleted successfully', expect.any(Object))
    })

    it('should throw error if user not found', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null)

      await expect(
        service.delete('nonexistent-id', mockAdminId)
      ).rejects.toThrow('User with ID "nonexistent-id" not found')

      expect(prismaMock.user.delete).not.toHaveBeenCalled()
    })

    it('should prevent self-deletion', async () => {
      prismaMock.user.findUnique.mockResolvedValue(mockUser as any)

      await expect(
        service.delete(mockAdminId, mockAdminId) // Same ID
      ).rejects.toThrow('Cannot delete your own user account')

      expect(prismaMock.user.delete).not.toHaveBeenCalled()
    })

    it('should log deletion with user email', async () => {
      prismaMock.user.findUnique.mockResolvedValue(mockUser as any)
      prismaMock.user.delete.mockResolvedValue(mockUser as any)

      await service.delete(mockUserId, mockAdminId)

      expect(mockLogger.info).toHaveBeenCalledWith(
        'User deleted successfully',
        expect.objectContaining({ email: mockUserData.email })
      )
    })
  })

  describe('verifyPassword', () => {
    it('should return user when password is correct', async () => {
      prismaMock.user.findUnique.mockResolvedValue(mockUser as any)

      const result = await service.verifyPassword(mockUserData.email, 'SecurePass123')

      expect(bcrypt.compare).toHaveBeenCalledWith('SecurePass123', 'hashed_SecurePass123')
      expect(result).not.toHaveProperty('password')
      expect(result).toMatchObject({ id: mockUserId, email: mockUserData.email })
      expect(mockLogger.info).toHaveBeenCalledWith('Password verification successful', expect.any(Object))
    })

    it('should return null when password is incorrect', async () => {
      prismaMock.user.findUnique.mockResolvedValue(mockUser as any)
      ;(bcrypt.compare as jest.Mock).mockResolvedValueOnce(false)

      const result = await service.verifyPassword(mockUserData.email, 'WrongPassword')

      expect(result).toBeNull()
      expect(mockLogger.warn).toHaveBeenCalledWith('Password verification failed', expect.any(Object))
    })

    it('should return null when user not found', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null)

      const result = await service.verifyPassword('nonexistent@example.com', 'password')

      expect(result).toBeNull()
      expect(mockLogger.warn).toHaveBeenCalledWith('User not found for password verification', expect.any(Object))
    })

    it('should not include password in returned user', async () => {
      prismaMock.user.findUnique.mockResolvedValue(mockUser as any)

      const result = await service.verifyPassword(mockUserData.email, 'SecurePass123')

      expect(result).not.toHaveProperty('password')
    })

    it('should handle database errors', async () => {
      const dbError = new Error('Database connection lost')
      prismaMock.user.findUnique.mockRejectedValue(dbError)

      await expect(
        service.verifyPassword('test@example.com', 'password')
      ).rejects.toThrow('Database connection lost')

      expect(mockLogger.error).toHaveBeenCalledWith('Error verifying password', dbError, expect.any(Object))
    })
  })

  describe('awardPoints', () => {
    it('should increment user points', async () => {
      prismaMock.user.update.mockResolvedValue({ ...mockUser, points: 100 } as any)

      const result = await service.awardPoints(mockUserId, 100)

      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: { id: mockUserId },
        data: { points: { increment: 100 } },
      })
      expect(result.points).toBe(100)
      expect(result).not.toHaveProperty('password')
    })

    it('should log points awarded with new total', async () => {
      prismaMock.user.update.mockResolvedValue({ ...mockUser, points: 150 } as any)

      await service.awardPoints(mockUserId, 50)

      expect(mockLogger.info).toHaveBeenCalledWith(
        'Points awarded successfully',
        expect.objectContaining({ newTotal: 150 })
      )
    })

    it('should handle database errors', async () => {
      prismaMock.user.update.mockRejectedValue(new Error('Database error'))

      await expect(
        service.awardPoints(mockUserId, 100)
      ).rejects.toThrow('Database error')

      expect(mockLogger.error).toHaveBeenCalledWith('Error awarding points', expect.any(Error), expect.any(Object))
    })
  })

  describe('addBadge', () => {
    it('should add badge to empty badges array', async () => {
      prismaMock.user.findUnique.mockResolvedValue({ ...mockUser, badges: null } as any)
      prismaMock.user.update.mockResolvedValue({ ...mockUser, badges: '["newBadge"]' } as any)

      const result = await service.addBadge(mockUserId, 'newBadge')

      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: { id: mockUserId },
        data: { badges: '["newBadge"]' },
      })
      expect(result.badges).toBe('["newBadge"]')
    })

    it('should add badge to existing badges', async () => {
      prismaMock.user.findUnique.mockResolvedValue({ ...mockUser, badges: '["badge1"]' } as any)
      prismaMock.user.update.mockResolvedValue({ ...mockUser, badges: '["badge1","badge2"]' } as any)

      await service.addBadge(mockUserId, 'badge2')

      expect(prismaMock.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { badges: '["badge1","badge2"]' },
        })
      )
    })

    it('should not add duplicate badge', async () => {
      prismaMock.user.findUnique.mockResolvedValue({ ...mockUser, badges: '["existingBadge"]' } as any)
      prismaMock.user.update.mockResolvedValue({ ...mockUser, badges: '["existingBadge"]' } as any)

      await service.addBadge(mockUserId, 'existingBadge')

      expect(prismaMock.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { badges: '["existingBadge"]' },
        })
      )
    })

    it('should throw error if user not found', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null)

      await expect(
        service.addBadge('nonexistent-id', 'badge')
      ).rejects.toThrow('User with ID "nonexistent-id" not found')

      expect(prismaMock.user.update).not.toHaveBeenCalled()
    })

    it('should not include password in result', async () => {
      prismaMock.user.findUnique.mockResolvedValue({ ...mockUser, badges: null } as any)
      prismaMock.user.update.mockResolvedValue({ ...mockUser, badges: '["newBadge"]' } as any)

      const result = await service.addBadge(mockUserId, 'newBadge')

      expect(result).not.toHaveProperty('password')
    })
  })

  describe('getStats', () => {
    it('should return comprehensive user statistics', async () => {
      prismaMock.user.count
        .mockResolvedValueOnce(100) // total
        .mockResolvedValueOnce(25) // withBadges

      prismaMock.user.groupBy.mockResolvedValue([
        { role: 'ADMIN', _count: 5 },
        { role: 'EDITOR', _count: 15 },
        { role: 'VIEWER', _count: 80 },
      ] as any)

      prismaMock.user.aggregate.mockResolvedValue({
        _sum: { points: 5000 },
        _avg: { points: 50 },
      } as any)

      const result = await service.getStats()

      expect(result).toEqual({
        total: 100,
        byRole: {
          ADMIN: 5,
          EDITOR: 15,
          VIEWER: 80,
        },
        totalPoints: 5000,
        avgPointsPerUser: 50,
        withBadges: 25,
      })
    })

    it('should handle zero users gracefully', async () => {
      prismaMock.user.count.mockResolvedValue(0)
      prismaMock.user.groupBy.mockResolvedValue([])
      prismaMock.user.aggregate.mockResolvedValue({
        _sum: { points: null },
        _avg: { points: null },
      } as any)

      const result = await service.getStats()

      expect(result.total).toBe(0)
      expect(result.totalPoints).toBe(0)
      expect(result.avgPointsPerUser).toBe(0)
    })

    it('should log statistics when fetched', async () => {
      prismaMock.user.count.mockResolvedValue(50)
      prismaMock.user.groupBy.mockResolvedValue([])
      prismaMock.user.aggregate.mockResolvedValue({
        _sum: { points: 1000 },
        _avg: { points: 20 },
      } as any)

      await service.getStats()

      expect(mockLogger.info).toHaveBeenCalledWith('User statistics fetched', expect.any(Object))
    })

    it('should handle database errors', async () => {
      const dbError = new Error('Database aggregation failed')
      prismaMock.user.count.mockRejectedValue(dbError)

      await expect(
        service.getStats()
      ).rejects.toThrow('Database aggregation failed')

      expect(mockLogger.error).toHaveBeenCalledWith('Error fetching user statistics', dbError)
    })
  })

  describe('getByRole', () => {
    const adminUsers = [
      { ...mockUser, id: 'admin-1', role: 'ADMIN' },
      { ...mockUser, id: 'admin-2', role: 'ADMIN' },
    ]

    it('should return users with specified role', async () => {
      prismaMock.user.findMany.mockResolvedValue(adminUsers as any)

      const result = await service.getByRole('ADMIN')

      expect(prismaMock.user.findMany).toHaveBeenCalledWith({
        where: { role: 'ADMIN' },
        orderBy: { createdAt: 'desc' },
        take: 100,
      })
      expect(result).toHaveLength(2)

      // Verify no passwords
      result.forEach(user => {
        expect(user).not.toHaveProperty('password')
        expect(user.role).toBe('ADMIN')
      })
    })

    it('should respect custom limit', async () => {
      prismaMock.user.findMany.mockResolvedValue([adminUsers[0]] as any)

      await service.getByRole('EDITOR', 10)

      expect(prismaMock.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ take: 10 })
      )
    })

    it('should default to limit of 100', async () => {
      prismaMock.user.findMany.mockResolvedValue(adminUsers as any)

      await service.getByRole('VIEWER')

      expect(prismaMock.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ take: 100 })
      )
    })

    it('should order by createdAt desc', async () => {
      prismaMock.user.findMany.mockResolvedValue(adminUsers as any)

      await service.getByRole('ADMIN')

      expect(prismaMock.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { createdAt: 'desc' },
        })
      )
    })

    it('should return empty array if no users found', async () => {
      prismaMock.user.findMany.mockResolvedValue([])

      const result = await service.getByRole('ADMIN')

      expect(result).toHaveLength(0)
      expect(mockLogger.info).toHaveBeenCalledWith(
        'Users fetched by role',
        expect.objectContaining({ count: 0 })
      )
    })

    it('should handle database errors', async () => {
      const dbError = new Error('Database timeout')
      prismaMock.user.findMany.mockRejectedValue(dbError)

      await expect(
        service.getByRole('ADMIN')
      ).rejects.toThrow('Database timeout')

      expect(mockLogger.error).toHaveBeenCalledWith('Error getting users by role', dbError, expect.any(Object))
    })
  })

  describe('edge cases and error handling', () => {
    it('should handle concurrent requests gracefully', async () => {
      prismaMock.user.findMany.mockResolvedValue([mockUser] as any)
      prismaMock.user.count.mockResolvedValue(1)

      const promises = [
        service.list({}),
        service.list({ role: 'ADMIN' }),
        service.list({ search: 'test' }),
      ]

      const results = await Promise.all(promises)

      expect(results).toHaveLength(3)
      results.forEach(result => {
        expect(result).toHaveProperty('users')
        expect(result).toHaveProperty('total')
      })
    })

    it('should clear context on all error paths', async () => {
      const methods = [
        () => service.create({ email: 'invalid', password: 'pass' }, 'admin'),
        () => service.getById('id'),
        () => service.update('id', {}, 'admin'),
        () => service.delete('id', 'admin'),
      ]

      for (const method of methods) {
        jest.clearAllMocks()
        prismaMock.user.findUnique.mockRejectedValue(new Error('DB error'))

        try {
          await method()
        } catch (e) {
          // Expected error
        }

        expect(mockLogger.clearContext).toHaveBeenCalled()
      }
    })

    it('should handle malformed JSON in badges gracefully', async () => {
      prismaMock.user.findUnique.mockResolvedValue({ ...mockUser, badges: 'invalid-json' } as any)

      await expect(
        service.addBadge(mockUserId, 'newBadge')
      ).rejects.toThrow()
    })
  })
})
