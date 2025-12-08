/**
 * Authentication Helpers
 *
 * Reusable authentication utilities for API routes
 * Reduces duplication across 31+ route files
 * Updated to support Clerk Authentication
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/core/prisma';
import type { Role } from '@/lib/generated/prisma';

/**
 * Authenticated user session
 */
export interface AuthenticatedUser {
  id: string; // Internal DB ID (CUID)
  clerkId: string; // Clerk ID
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
 */
export async function authenticate(request?: NextRequest): Promise<AuthResult> {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
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

  // 🔒 Verify user exists in database via Clerk ID
  let dbUser = await prisma.user.findUnique({
    where: { clerkId },
    select: { id: true, email: true, name: true, role: true, clerkId: true }
  });

  // 🔄 Self-Healing: If not found by Clerk ID, try email matching (Migration/First Login)
  if (!dbUser) {

  }

  // Re-evaluating: Importing currentUser might be heavy. 
  // Let's stick to the plan: fetch Clerk User Object if DB lookup fails.
  if (!dbUser) {
    const { currentUser } = await import('@clerk/nextjs/server');
    const clerkUser = await currentUser();

    if (clerkUser) {
      const email = clerkUser.emailAddresses[0]?.emailAddress;
      if (email) {
        // Try finding by email
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
          // LINK AND UPDATE
          dbUser = await prisma.user.update({
            where: { id: existingUser.id },
            data: { clerkId },
            select: { id: true, email: true, name: true, role: true, clerkId: true }
          });
        }
      }
    }
  }

  if (!dbUser) {
    // Return 401 if still not found
    return {
      success: false,
      response: NextResponse.json(
        {
          success: false,
          error: 'User not found',
          message: 'Your account appears to be invalid or deleted.',
        },
        { status: 401 }
      ),
    };
  }

  const user: AuthenticatedUser = {
    id: dbUser.id,
    clerkId: dbUser.clerkId || clerkId,
    email: dbUser.email,
    name: dbUser.name,
    role: dbUser.role
  };

  return {
    success: true,
    user,
  };
}

/**
 * Authenticate and require specific role(s)
 *
 * @param request - Next.js request object
 * @param allowedRoles - Array of allowed roles
 * @returns Authentication result with user or error response
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
 */
export function hasMinimumRole(user: AuthenticatedUser, minimumRole: Role): boolean {
  return ROLE_HIERARCHY[user.role] >= ROLE_HIERARCHY[minimumRole];
}
