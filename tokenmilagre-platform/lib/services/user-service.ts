/**
 * UserService - Complete User CRUD Operations
 *
 * Centralized service for all user-related operations with:
 * - Complete CRUD operations with Prisma
 * - Password hashing with bcrypt
 * - Role-based access control
 * - Email validation and uniqueness
 * - Structured logging with LoggerService
 * - Error handling with ErrorService
 * - Type safety and DI integration
 *
 * @example
 * ```typescript
 * import { ServiceLocator } from '@/lib/di/container'
 *
 * const userService = ServiceLocator.getUser()
 * const user = await userService.create(data, adminId)
 * const users = await userService.list({ role: 'VIEWER' })
 * ```
 */

import { prisma } from '@/lib/prisma'
import { User, Role, Prisma } from '@/lib/generated/prisma'
import { ServiceLocator } from '@/lib/di/container'
import { PAGINATION } from '@/lib/constants/pagination'
import { PASSWORD_CONSTRAINTS, EMAIL_CONSTRAINTS } from '@/lib/constants/validation'
import bcrypt from 'bcryptjs'

/**
 * User without sensitive data
 */
export type SafeUser = Omit<User, 'password'>

/**
 * User query parameters
 */
export interface UserQuery {
  page?: number
  limit?: number
  role?: Role
  search?: string
  sortBy?: keyof User
  sortOrder?: 'asc' | 'desc'
}

/**
 * User creation input
 */
export interface UserCreateInput {
  email: string
  password: string
  name?: string
  role?: Role
  image?: string
}

/**
 * User update input
 */
export interface UserUpdateInput {
  email?: string
  password?: string
  name?: string
  role?: Role
  image?: string
  points?: number
  badges?: string
}

/**
 * Paginated user list result
 */
export interface UserListResult {
  users: SafeUser[]
  total: number
  page: number
  limit: number
  totalPages: number
  hasMore: boolean
}

/**
 * User statistics
 */
export interface UserStats {
  total: number
  byRole: Record<Role, number>
  totalPoints: number
  avgPointsPerUser: number
  withBadges: number
}

/**
 * User Service
 * Handles all user CRUD operations with Clean Architecture patterns
 */
export class UserService {
  // Lazy initialization to avoid circular dependency
  private get logger() {
    return ServiceLocator.getLogger()
  }

  private get validation() {
    return ServiceLocator.getValidation()
  }

  /**
   * Create a new user
   *
   * @param data - User creation data
   * @param adminId - Admin ID creating the user
   * @returns Created user (without password)
   */
  async create(data: UserCreateInput, adminId: string): Promise<SafeUser> {
    this.logger.setContext({ operation: 'user.create', adminId, email: data.email })

    try {
      this.logger.info('Creating user', { email: data.email, role: data.role })

      // Validate email format
      if (!EMAIL_CONSTRAINTS.PATTERN.test(data.email)) {
        throw new Error('Invalid email format')
      }

      // Validate password length
      if (data.password.length < PASSWORD_CONSTRAINTS.MIN_LENGTH) {
        throw new Error(
          `Password must be at least ${PASSWORD_CONSTRAINTS.MIN_LENGTH} characters`
        )
      }

      // Check email uniqueness
      const existing = await prisma.user.findUnique({
        where: { email: data.email },
        select: { id: true },
      })

      if (existing) {
        throw new Error(`User with email "${data.email}" already exists`)
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(data.password, 10)

      // Create user
      const user = await prisma.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          name: data.name,
          role: data.role ?? 'VIEWER',
          image: data.image,
          points: 0,
          badges: null,
        },
      })

      this.logger.info('User created successfully', { userId: user.id, email: user.email })

      // Return user without password
      const { password, ...safeUser } = user
      return safeUser
    } catch (error) {
      this.logger.error('Error creating user', error as Error, { email: data.email })
      throw error
    } finally {
      this.logger.clearContext()
    }
  }

  /**
   * Get user by ID
   *
   * @param id - User ID
   * @param includeSensitive - Whether to include password (default: false)
   * @returns User or null
   */
  async getById(id: string, includeSensitive: boolean = false): Promise<SafeUser | null> {
    this.logger.setContext({ operation: 'user.getById', id })

    try {
      const user = await prisma.user.findUnique({
        where: { id },
      })

      if (user) {
        this.logger.info('User found by ID', { id, email: user.email })

        if (includeSensitive) {
          return user
        } else {
          const { password, ...safeUser } = user
          return safeUser
        }
      } else {
        this.logger.warn('User not found by ID', { id })
        return null
      }
    } catch (error) {
      this.logger.error('Error getting user by ID', error as Error, { id })
      throw error
    } finally {
      this.logger.clearContext()
    }
  }

  /**
   * Get user by email
   *
   * @param email - User email
   * @param includeSensitive - Whether to include password (default: false)
   * @returns User or null
   */
  async getByEmail(email: string, includeSensitive: boolean = false): Promise<SafeUser | User | null> {
    this.logger.setContext({ operation: 'user.getByEmail', email })

    try {
      const user = await prisma.user.findUnique({
        where: { email },
      })

      if (user) {
        this.logger.info('User found by email', { id: user.id, email })

        if (includeSensitive) {
          return user
        } else {
          const { password, ...safeUser } = user
          return safeUser
        }
      } else {
        this.logger.warn('User not found by email', { email })
        return null
      }
    } catch (error) {
      this.logger.error('Error getting user by email', error as Error, { email })
      throw error
    } finally {
      this.logger.clearContext()
    }
  }

  /**
   * List users with pagination and filters
   *
   * @param query - Query parameters for filtering and pagination
   * @returns Paginated list of users (without passwords)
   */
  async list(query: UserQuery = {}): Promise<UserListResult> {
    const page = query.page ?? PAGINATION.DEFAULT_PAGE
    const limit = Math.min(query.limit ?? PAGINATION.DEFAULT_LIMIT, PAGINATION.MAX_LIMIT)
    const skip = (page - 1) * limit

    this.logger.setContext({ operation: 'user.list', page, limit })

    try {
      // Build where clause
      const where: Prisma.UserWhereInput = {}

      if (query.role) {
        where.role = query.role
      }

      if (query.search) {
        where.OR = [
          { email: { contains: query.search, mode: 'insensitive' } },
          { name: { contains: query.search, mode: 'insensitive' } },
        ]
      }

      // Build orderBy
      const orderBy: Prisma.UserOrderByWithRelationInput = {}
      if (query.sortBy) {
        orderBy[query.sortBy] = query.sortOrder || 'desc'
      } else {
        orderBy.createdAt = 'desc'
      }

      // Execute queries in parallel
      const [usersWithPasswords, total] = await Promise.all([
        prisma.user.findMany({
          where,
          orderBy,
          skip,
          take: limit,
          include: {
            _count: {
              select: { articles: true },
            },
          },
        }),
        prisma.user.count({ where }),
      ])

      // Remove passwords from results
      const users = usersWithPasswords.map((user) => {
        const { password, ...safeUser } = user
        return safeUser
      })

      const totalPages = Math.ceil(total / limit)
      const hasMore = page < totalPages

      this.logger.info('Users listed successfully', {
        count: users.length,
        total,
        page,
        totalPages,
      })

      return {
        users,
        total,
        page,
        limit,
        totalPages,
        hasMore,
      }
    } catch (error) {
      this.logger.error('Error listing users', error as Error, { page, limit })
      throw error
    } finally {
      this.logger.clearContext()
    }
  }

  /**
   * Update user
   *
   * @param id - User ID
   * @param data - Update data
   * @param adminId - Admin ID performing the update
   * @returns Updated user (without password)
   */
  async update(
    id: string,
    data: UserUpdateInput,
    adminId: string
  ): Promise<SafeUser> {
    this.logger.setContext({ operation: 'user.update', id, adminId })

    try {
      this.logger.info('Updating user', { id, fields: Object.keys(data) })

      // Check if user exists
      const existing = await prisma.user.findUnique({
        where: { id },
        select: { id: true, email: true },
      })

      if (!existing) {
        throw new Error(`User with ID "${id}" not found`)
      }

      // If updating email, check uniqueness
      if (data.email && data.email !== existing.email) {
        if (!EMAIL_CONSTRAINTS.PATTERN.test(data.email)) {
          throw new Error('Invalid email format')
        }

        const emailExists = await prisma.user.findUnique({
          where: { email: data.email },
          select: { id: true },
        })

        if (emailExists) {
          throw new Error(`User with email "${data.email}" already exists`)
        }
      }

      // Prepare update data
      const updateData: Prisma.UserUpdateInput = {}

      if (data.email !== undefined) updateData.email = data.email
      if (data.name !== undefined) updateData.name = data.name
      if (data.role !== undefined) updateData.role = data.role
      if (data.image !== undefined) updateData.image = data.image
      if (data.points !== undefined) updateData.points = data.points
      if (data.badges !== undefined) updateData.badges = data.badges

      // If updating password, hash it
      if (data.password !== undefined) {
        if (data.password.length < PASSWORD_CONSTRAINTS.MIN_LENGTH) {
          throw new Error(
            `Password must be at least ${PASSWORD_CONSTRAINTS.MIN_LENGTH} characters`
          )
        }
        updateData.password = await bcrypt.hash(data.password, 10)
      }

      // Update user
      const user = await prisma.user.update({
        where: { id },
        data: updateData,
      })

      this.logger.info('User updated successfully', { id, email: user.email })

      // Return user without password
      const { password, ...safeUser } = user
      return safeUser
    } catch (error) {
      this.logger.error('Error updating user', error as Error, { id })
      throw error
    } finally {
      this.logger.clearContext()
    }
  }

  /**
   * Delete user
   *
   * @param id - User ID
   * @param adminId - Admin ID performing the deletion
   */
  async delete(id: string, adminId: string): Promise<void> {
    this.logger.setContext({ operation: 'user.delete', id, adminId })

    try {
      this.logger.info('Deleting user', { id })

      const user = await prisma.user.findUnique({
        where: { id },
        select: { id: true, email: true },
      })

      if (!user) {
        throw new Error(`User with ID "${id}" not found`)
      }

      // Prevent self-deletion
      if (id === adminId) {
        throw new Error('Cannot delete your own user account')
      }

      await prisma.user.delete({
        where: { id },
      })

      this.logger.info('User deleted successfully', { id, email: user.email })
    } catch (error) {
      this.logger.error('Error deleting user', error as Error, { id })
      throw error
    } finally {
      this.logger.clearContext()
    }
  }

  /**
   * Verify user password
   *
   * @param email - User email
   * @param password - Plain text password to verify
   * @returns User if password is valid, null otherwise
   */
  async verifyPassword(email: string, password: string): Promise<SafeUser | null> {
    this.logger.setContext({ operation: 'user.verifyPassword', email })

    try {
      const user = await prisma.user.findUnique({
        where: { email },
      })

      if (!user) {
        this.logger.warn('User not found for password verification', { email })
        return null
      }

      const isValid = await bcrypt.compare(password, user.password)

      if (isValid) {
        this.logger.info('Password verification successful', { userId: user.id })
        const { password: _, ...safeUser } = user
        return safeUser
      } else {
        this.logger.warn('Password verification failed', { userId: user.id })
        return null
      }
    } catch (error) {
      this.logger.error('Error verifying password', error as Error, { email })
      throw error
    } finally {
      this.logger.clearContext()
    }
  }

  /**
   * Award points to user
   *
   * @param id - User ID
   * @param points - Points to award
   * @returns Updated user
   */
  async awardPoints(id: string, points: number): Promise<SafeUser> {
    this.logger.setContext({ operation: 'user.awardPoints', id, points })

    try {
      this.logger.info('Awarding points to user', { id, points })

      const user = await prisma.user.update({
        where: { id },
        data: { points: { increment: points } },
      })

      this.logger.info('Points awarded successfully', { userId: user.id, newTotal: user.points })

      const { password, ...safeUser } = user
      return safeUser
    } catch (error) {
      this.logger.error('Error awarding points', error as Error, { id, points })
      throw error
    } finally {
      this.logger.clearContext()
    }
  }

  /**
   * Add badge to user
   *
   * @param id - User ID
   * @param badge - Badge to add
   * @returns Updated user
   */
  async addBadge(id: string, badge: string): Promise<SafeUser> {
    this.logger.setContext({ operation: 'user.addBadge', id, badge })

    try {
      this.logger.info('Adding badge to user', { id, badge })

      const user = await prisma.user.findUnique({
        where: { id },
        select: { badges: true },
      })

      if (!user) {
        throw new Error(`User with ID "${id}" not found`)
      }

      const currentBadges: string[] = user.badges ? JSON.parse(user.badges) : []

      if (!currentBadges.includes(badge)) {
        currentBadges.push(badge)
      }

      const updatedUser = await prisma.user.update({
        where: { id },
        data: { badges: JSON.stringify(currentBadges) },
      })

      this.logger.info('Badge added successfully', { userId: updatedUser.id, badge })

      const { password, ...safeUser } = updatedUser
      return safeUser
    } catch (error) {
      this.logger.error('Error adding badge', error as Error, { id, badge })
      throw error
    } finally {
      this.logger.clearContext()
    }
  }

  /**
   * Get user statistics
   *
   * @returns User statistics
   */
  async getStats(): Promise<UserStats> {
    this.logger.setContext({ operation: 'user.getStats' })

    try {
      this.logger.info('Fetching user statistics')

      const [
        total,
        byRole,
        pointsAggregate,
        withBadges,
      ] = await Promise.all([
        prisma.user.count(),
        prisma.user.groupBy({
          by: ['role'],
          _count: true,
        }),
        prisma.user.aggregate({
          _sum: { points: true },
          _avg: { points: true },
        }),
        prisma.user.count({
          where: {
            badges: { not: null },
          },
        }),
      ])

      const stats: UserStats = {
        total,
        byRole: Object.fromEntries(
          byRole.map((r) => [r.role, r._count])
        ) as Record<Role, number>,
        totalPoints: pointsAggregate._sum.points ?? 0,
        avgPointsPerUser: Math.round(pointsAggregate._avg.points ?? 0),
        withBadges,
      }

      this.logger.info('User statistics fetched', stats)

      return stats
    } catch (error) {
      this.logger.error('Error fetching user statistics', error as Error)
      throw error
    } finally {
      this.logger.clearContext()
    }
  }

  /**
   * Get users by role
   *
   * @param role - User role
   * @param limit - Maximum number of users to return
   * @returns List of users
   */
  async getByRole(role: Role, limit: number = 100): Promise<SafeUser[]> {
    this.logger.setContext({ operation: 'user.getByRole', role, limit })

    try {
      const usersWithPasswords = await prisma.user.findMany({
        where: { role },
        orderBy: { createdAt: 'desc' },
        take: limit,
      })

      const users = usersWithPasswords.map((user) => {
        const { password, ...safeUser } = user
        return safeUser
      })

      this.logger.info('Users fetched by role', { role, count: users.length })

      return users
    } catch (error) {
      this.logger.error('Error getting users by role', error as Error, { role })
      throw error
    } finally {
      this.logger.clearContext()
    }
  }
}

// Export singleton instance
export const userService = new UserService()
