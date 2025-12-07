/**
 * 🌀 Users Domain - Types
 * 
 * @agi-domain: users
 * @agi-pattern: fractal auto-similar
 * 
 * All types and interfaces for the users domain.
 * Re-exports from user-service.ts and user-schemas.ts
 */

// ============================================
// RE-EXPORTS FROM SERVICE
// These types are defined in user-service.ts
// ============================================
export type {
    SafeUser,
    UserQuery as UserQueryService,  // Renamed to avoid collision with schema type
    UserCreateInput,
    UserUpdateInput,
    UserListResult,
    UserStats,
} from '@/lib/services/user-service';

// ============================================
// RE-EXPORTS FROM SCHEMAS
// These types are defined in user-schemas.ts
// ============================================
export type {
    UserCreate,
    UserUpdate,
    UserQuery,
    Login,
    AwardPoints,
    AddBadge,
    Role,
} from '@/lib/schemas/user-schemas';

// ============================================
// USER ROLES
// ============================================

/**
 * User roles supported by the platform
 */
export const USER_ROLES = ['ADMIN', 'EDITOR', 'VIEWER'] as const;
export type UserRoleValue = typeof USER_ROLES[number];
