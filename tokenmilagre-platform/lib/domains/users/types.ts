/**
 * 🌀 Users Domain - Types
 * 
 * @agi-domain: users
 * @agi-pattern: fractal auto-similar
 * 
 * All types and interfaces for the users domain.
 */

import { User, Role } from '@/lib/generated/prisma';

// ============================================
// DOMAIN ENTITIES
// Moved from user.service.ts to avoid circular deps
// ============================================

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

// ============================================
// RE-EXPORTS FROM SCHEMAS
// These types are defined in user-schemas.ts
// ============================================
export type {
    UserCreate,
    UserUpdate,
    Login,
    AwardPoints,
    AddBadge,
    Role as RoleEnum, // Alias to avoid conflict with Prisma Role
} from '@/lib/schemas/user-schemas';

// ============================================
// USER ROLES
// ============================================

/**
 * User roles supported by the platform
 */
export const USER_ROLES = ['ADMIN', 'EDITOR', 'VIEWER'] as const;
export type UserRoleValue = typeof USER_ROLES[number];
