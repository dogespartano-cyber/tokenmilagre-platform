/**
 * 🌀 Users Domain - Public API
 * 
 * @agi-domain: users
 * @agi-pattern: fractal auto-similar
 * @agi-entry-point: true
 * 
 * This is the public entry point for the users domain.
 * All exports from this module are considered part of the public API.
 * 
 * Usage:
 * ```typescript
 * import { UserService, SafeUser } from '@/lib/domains/users'
 * ```
 */

// ============================================
// TYPES (Public)
// ============================================
export type {
    SafeUser,
    UserQuery as UserQueryService, // Alias manual type
    UserCreateInput,
    UserUpdateInput,
    UserListResult,
    UserStats,
    UserCreate,
    UserUpdate,
    UserQuery,
    Login,
    AwardPoints,
    AddBadge,
    RoleEnum as Role,
    UserRoleValue,
} from './types';
export * from './types';
export * from './components/AdminRoute';
export { default as AdminRoute } from './components/AdminRoute';

export { USER_ROLES } from './types';

// ============================================
// SERVICE
// Re-exported from lib/services/user-service.ts
// ============================================
export { UserService } from '@/lib/services/user-service';

// ============================================
// SCHEMAS
// Re-exported from lib/schemas/user-schemas.ts
// ============================================
export {
    // Core schemas
    userCreateSchema,
    userUpdateSchema,
    userQuerySchema,
    loginSchema,
    awardPointsSchema,
    addBadgeSchema,
    // Field schemas
    emailSchema,
    passwordSchema,
    nameSchema,
    // Enums
    roleEnum,
} from '@/lib/schemas/user-schemas';
