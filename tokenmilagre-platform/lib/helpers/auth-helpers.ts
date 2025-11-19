/**
 * Authentication Helpers
 *
 * Reusable authentication utilities for API routes
 * Reduces duplication across 31+ route files
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import type { Role } from '@/lib/generated/prisma';

/**
 * Authenticated user session
 */
export interface AuthenticatedUser {
  id: string;
  email: string;
  name?: string | null;
  role: Role;
}

/**
 * Authentication result
 */
export type AuthResult =
  | { success: true; user: AuthenticatedUser }
  | { success: false; response: NextResponse };

/**
 * Authenticate request and get user session
 *
 * @param request - Next.js request object
 * @returns Authentication result with user or error response
 *
 * @example
 * ```typescript
 * export async function GET(request: NextRequest) {
 *   const auth = await authenticate(request);
 *   if (!auth.success) return auth.response;
 *
 *   const { user } = auth;
 *   // ... use user.id, user.role, etc.
 * }
 * ```
 */
export async function authenticate(request?: NextRequest): Promise<AuthResult> {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return {
      success: false,
      response: NextResponse.json(
        {
          success: false,
          error: 'Authentication required',
          message: 'You must be logged in to access this resource',
        },
        { status: 401 }
      ),
    };
  }

  return {
    success: true,
    user: session.user as AuthenticatedUser,
  };
}

/**
 * Authenticate and require specific role(s)
 *
 * @param request - Next.js request object
 * @param allowedRoles - Array of allowed roles
 * @returns Authentication result with user or error response
 *
 * @example
 * ```typescript
 * export async function POST(request: NextRequest) {
 *   const auth = await requireRole(request, ['ADMIN', 'EDITOR']);
 *   if (!auth.success) return auth.response;
 *
 *   // User is authenticated and has ADMIN or EDITOR role
 *   const { user } = auth;
 * }
 * ```
 */
export async function requireRole(
  request: NextRequest,
  allowedRoles: Role[]
): Promise<AuthResult> {
  const auth = await authenticate(request);
  if (!auth.success) return auth;

  const { user } = auth;

  if (!allowedRoles.includes(user.role)) {
    return {
      success: false,
      response: NextResponse.json(
        {
          success: false,
          error: 'Insufficient permissions',
          message: `This action requires one of the following roles: ${allowedRoles.join(', ')}`,
          requiredRoles: allowedRoles,
          userRole: user.role,
        },
        { status: 403 }
      ),
    };
  }

  return { success: true, user };
}

/**
 * Authenticate and require ADMIN role
 *
 * @param request - Next.js request object
 * @returns Authentication result with admin user or error response
 *
 * @example
 * ```typescript
 * export async function DELETE(request: NextRequest) {
 *   const auth = await requireAdmin(request);
 *   if (!auth.success) return auth.response;
 *
 *   // User is authenticated admin
 *   const { user } = auth;
 * }
 * ```
 */
export async function requireAdmin(request?: NextRequest): Promise<AuthResult> {
  const auth = await authenticate(request);
  if (!auth.success) return auth;

  const { user } = auth;

  if (user.role !== 'ADMIN') {
    return {
      success: false,
      response: NextResponse.json(
        {
          success: false,
          error: 'Admin access required',
          message: 'This action requires administrator privileges',
        },
        { status: 403 }
      ),
    };
  }

  return { success: true, user };
}

/**
 * Authenticate and require ADMIN or EDITOR role
 *
 * @param request - Next.js request object
 * @returns Authentication result with user or error response
 *
 * @example
 * ```typescript
 * export async function POST(request: NextRequest) {
 *   const auth = await requireEditor(request);
 *   if (!auth.success) return auth.response;
 *
 *   // User can create/edit content
 *   const { user } = auth;
 * }
 * ```
 */
export async function requireEditor(request?: NextRequest): Promise<AuthResult> {
  return requireRole(request!, ['ADMIN', 'EDITOR']);
}

/**
 * Check if user owns resource or is admin
 *
 * @param user - Authenticated user
 * @param resourceOwnerId - ID of the resource owner
 * @returns True if user owns resource or is admin
 *
 * @example
 * ```typescript
 * const auth = await authenticate(request);
 * if (!auth.success) return auth.response;
 *
 * const article = await prisma.article.findUnique({ where: { id } });
 * if (!canAccessResource(auth.user, article.authorId)) {
 *   return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
 * }
 * ```
 */
export function canAccessResource(
  user: AuthenticatedUser,
  resourceOwnerId: string
): boolean {
  return user.role === 'ADMIN' || user.id === resourceOwnerId;
}

/**
 * Validate API key from request headers
 *
 * @param request - Next.js request object
 * @param validApiKey - Expected API key (from env)
 * @returns True if API key is valid
 *
 * @example
 * ```typescript
 * export async function POST(request: NextRequest) {
 *   const validApiKey = process.env.INTERNAL_API_KEY;
 *   if (validApiKey && validateAPIKey(request, validApiKey)) {
 *     // Authenticated via API key
 *   } else {
 *     // Fall back to session auth
 *     const auth = await authenticate(request);
 *     if (!auth.success) return auth.response;
 *   }
 * }
 * ```
 */
export function validateAPIKey(request: NextRequest, validApiKey: string): boolean {
  const apiKey = request.headers.get('x-api-key');
  return !!apiKey && apiKey === validApiKey;
}

/**
 * Role hierarchy levels
 * Higher number = more permissions
 */
const ROLE_HIERARCHY: Record<Role, number> = {
  VIEWER: 1,
  EDITOR: 2,
  ADMIN: 3,
};

/**
 * Check if user has minimum role level
 *
 * @param user - Authenticated user
 * @param minimumRole - Minimum required role
 * @returns True if user has sufficient permissions
 *
 * @example
 * ```typescript
 * if (hasMinimumRole(user, 'EDITOR')) {
 *   // User is EDITOR or ADMIN
 * }
 * ```
 */
export function hasMinimumRole(user: AuthenticatedUser, minimumRole: Role): boolean {
  return ROLE_HIERARCHY[user.role] >= ROLE_HIERARCHY[minimumRole];
}
