/**
 * Authentication Middleware
 *
 * Provides authentication and authorization helpers for API routes.
 * Supports JWT token validation and role-based access control.
 *
 * @example
 * ```typescript
 * import { authenticate, requireRole } from '@/lib/middleware/auth'
 *
 * export async function GET(request: NextRequest) {
 *   const user = await authenticate(request)
 *   requireRole(user, ['ADMIN', 'EDITOR'])
 *
 *   // User is authenticated and authorized
 *   const articleService = ServiceLocator.getArticle()
 *   const articles = await articleService.list({ page: 1, limit: 10 })
 *   return NextResponse.json(articles)
 * }
 * ```
 */

import { NextRequest } from 'next/server'
import { AuthenticationError, AuthorizationError } from '@/lib/services/error-service'
import { ServiceLocator } from '@/lib/di/container'

/**
 * User roles in the system
 */
export type UserRole = 'ADMIN' | 'EDITOR' | 'AUTHOR' | 'READER'

/**
 * Authenticated user information
 */
export interface AuthUser {
  id: string
  email: string
  name: string
  role: UserRole
  isActive: boolean
}

/**
 * JWT payload structure
 */
interface JWTPayload {
  userId: string
  email: string
  name: string
  role: UserRole
  isActive: boolean
  iat: number
  exp: number
}

/**
 * Extracts and validates authentication token from request
 * Supports Bearer token in Authorization header or token in cookie
 *
 * @param request - Next.js request object
 * @returns Authenticated user information
 * @throws AuthenticationError if token is missing or invalid
 */
export async function authenticate(request: NextRequest): Promise<AuthUser> {
  const logger = ServiceLocator.getLogger()

  try {
    // Extract token from Authorization header or cookie
    const authHeader = request.headers.get('authorization')
    const cookieToken = request.cookies.get('auth_token')?.value

    let token: string | null = null

    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.substring(7)
    } else if (cookieToken) {
      token = cookieToken
    }

    if (!token) {
      throw new AuthenticationError('Token de autenticação não fornecido', {
        header: !!authHeader,
        cookie: !!cookieToken,
      })
    }

    // Validate token and extract user information
    const user = await validateToken(token)

    if (!user.isActive) {
      throw new AuthenticationError('Usuário inativo', { userId: user.id })
    }

    logger.debug('User authenticated successfully', {
      userId: user.id,
      role: user.role,
    })

    return user
  } catch (error) {
    if (error instanceof AuthenticationError) {
      throw error
    }

    logger.warn('Authentication failed', { error })
    throw new AuthenticationError('Token de autenticação inválido')
  }
}

/**
 * Validates JWT token and extracts user information
 *
 * @param token - JWT token string
 * @returns Decoded user information
 * @throws AuthenticationError if token is invalid or expired
 */
async function validateToken(token: string): Promise<AuthUser> {
  // TODO: Implement actual JWT validation with jsonwebtoken library
  // For now, this is a placeholder implementation

  try {
    // Decode token (without verification - TEMPORARY)
    const parts = token.split('.')
    if (parts.length !== 3) {
      throw new Error('Invalid token format')
    }

    const payload = JSON.parse(
      Buffer.from(parts[1], 'base64').toString('utf-8')
    ) as JWTPayload

    // Check expiration
    const now = Math.floor(Date.now() / 1000)
    if (payload.exp && payload.exp < now) {
      throw new AuthenticationError('Token expirado', { exp: payload.exp })
    }

    // Return user information
    return {
      id: payload.userId,
      email: payload.email,
      name: payload.name,
      role: payload.role,
      isActive: payload.isActive,
    }
  } catch (error) {
    if (error instanceof AuthenticationError) {
      throw error
    }
    throw new AuthenticationError('Falha ao decodificar token')
  }
}

/**
 * Checks if user has required role(s)
 * Throws AuthorizationError if user doesn't have permission
 *
 * @param user - Authenticated user
 * @param allowedRoles - Array of roles that are allowed
 * @throws AuthorizationError if user doesn't have required role
 */
export function requireRole(user: AuthUser, allowedRoles: UserRole[]): void {
  if (!allowedRoles.includes(user.role)) {
    const logger = ServiceLocator.getLogger()
    logger.warn('User lacks required role', {
      userId: user.id,
      userRole: user.role,
      requiredRoles: allowedRoles,
    })

    throw new AuthorizationError('Você não tem permissão para esta operação', {
      userRole: user.role,
      requiredRoles: allowedRoles,
    })
  }
}

/**
 * Checks if user owns the resource or has admin role
 * Useful for update/delete operations
 *
 * @param user - Authenticated user
 * @param resourceOwnerId - ID of the resource owner
 * @throws AuthorizationError if user is not owner and not admin
 */
export function requireOwnershipOrAdmin(
  user: AuthUser,
  resourceOwnerId: string
): void {
  const isOwner = user.id === resourceOwnerId
  const isAdmin = user.role === 'ADMIN'

  if (!isOwner && !isAdmin) {
    const logger = ServiceLocator.getLogger()
    logger.warn('User lacks ownership or admin role', {
      userId: user.id,
      userRole: user.role,
      resourceOwnerId,
    })

    throw new AuthorizationError(
      'Você não tem permissão para modificar este recurso',
      {
        userId: user.id,
        resourceOwnerId,
      }
    )
  }
}

/**
 * Optional authentication - returns null if no token provided
 * Useful for public endpoints that have optional user context
 *
 * @param request - Next.js request object
 * @returns Authenticated user or null
 */
export async function authenticateOptional(
  request: NextRequest
): Promise<AuthUser | null> {
  try {
    return await authenticate(request)
  } catch (error) {
    // Return null for missing token, throw for invalid token
    if (
      error instanceof AuthenticationError &&
      error.message.includes('não fornecido')
    ) {
      return null
    }
    throw error
  }
}

/**
 * Role hierarchy for permission checks
 * Higher index = more permissions
 */
const ROLE_HIERARCHY: UserRole[] = ['READER', 'AUTHOR', 'EDITOR', 'ADMIN']

/**
 * Checks if user has minimum required role level
 * Uses role hierarchy (ADMIN > EDITOR > AUTHOR > READER)
 *
 * @param user - Authenticated user
 * @param minRole - Minimum required role
 * @returns true if user meets minimum role requirement
 */
export function hasMinimumRole(user: AuthUser, minRole: UserRole): boolean {
  const userRoleIndex = ROLE_HIERARCHY.indexOf(user.role)
  const minRoleIndex = ROLE_HIERARCHY.indexOf(minRole)

  return userRoleIndex >= minRoleIndex
}

/**
 * Requires minimum role level
 * Throws AuthorizationError if user doesn't meet requirement
 *
 * @param user - Authenticated user
 * @param minRole - Minimum required role
 * @throws AuthorizationError if user doesn't meet minimum role
 */
export function requireMinimumRole(user: AuthUser, minRole: UserRole): void {
  if (!hasMinimumRole(user, minRole)) {
    const logger = ServiceLocator.getLogger()
    logger.warn('User lacks minimum role', {
      userId: user.id,
      userRole: user.role,
      minimumRole: minRole,
    })

    throw new AuthorizationError(
      'Você não tem permissão suficiente para esta operação',
      {
        userRole: user.role,
        minimumRole: minRole,
      }
    )
  }
}
