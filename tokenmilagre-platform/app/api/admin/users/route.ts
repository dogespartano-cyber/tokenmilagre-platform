/**
 * Admin Users API Route
 *
 * Handles user management endpoints with:
 * - Service layer integration (UserService)
 * - Zod validation for all inputs
 * - Structured logging with context
 * - Standardized response format
 * - Auth helpers for role-based access (ADMIN only)
 * - Pagination support
 */

import { NextRequest } from 'next/server'
import { ServiceLocator } from '@/lib/di/container'
import { requireAdmin } from '@/lib/helpers/auth-helpers'
import { successResponse, errorResponse } from '@/lib/helpers/response-helpers'
import { userQuerySchema, userCreateSchema } from '@/lib/schemas/user-schemas'

/**
 * GET /api/admin/users - List all users with filters
 *
 * Protected: ADMIN only
 *
 * Query params:
 * - page: Page number (default 1)
 * - limit: Items per page (default 12, max 100)
 * - role: Filter by role (ADMIN/EDITOR/VIEWER)
 * - search: Search by email or name
 * - createdAfter: Filter users created after date (ISO 8601)
 * - createdBefore: Filter users created before date (ISO 8601)
 * - sortBy: Sort field (createdAt/updatedAt/email/name/role/points, default: createdAt)
 * - sortOrder: Sort direction (asc/desc, default: desc)
 */
export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request)
  if (!auth.success) return auth.response

  const logger = ServiceLocator.getLogger()
  logger.setContext({ endpoint: '/api/admin/users', method: 'GET', userId: auth.user.id })

  try {
    const validation = ServiceLocator.getValidation()
    const userService = ServiceLocator.getUser()

    // Parse and validate query parameters
    const searchParams = request.nextUrl.searchParams
    const rawQuery = Object.fromEntries(searchParams)

    const query = validation.validate(userQuerySchema, rawQuery)

    logger.info('Listing users', {
      page: query.page,
      limit: query.limit,
      filters: { role: query.role, search: query.search }
    })

    // Fetch users using service layer
    const result = await userService.list(query)

    logger.info('Users listed successfully', {
      count: result.users.length,
      total: result.total,
      page: result.page
    })

    return successResponse({
      data: result.users,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
        hasMore: result.hasMore,
        count: result.users.length
      }
    })
  } catch (error) {
    logger.error('Error listing users', error as Error)
    return errorResponse(error as Error)
  } finally {
    logger.clearContext()
  }
}

/**
 * POST /api/admin/users - Create new user
 *
 * Protected: ADMIN only
 *
 * Body params:
 * - email: User email (required)
 * - password: User password (required, min 8 chars)
 * - name: User name (optional)
 * - role: User role (ADMIN/EDITOR/VIEWER, default: VIEWER)
 * - image: Profile image URL (optional)
 */
export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request)
  if (!auth.success) return auth.response

  const logger = ServiceLocator.getLogger()
  logger.setContext({ endpoint: '/api/admin/users', method: 'POST', userId: auth.user.id })

  try {
    const validation = ServiceLocator.getValidation()
    const userService = ServiceLocator.getUser()

    // Parse and validate request body
    const body = await request.json()

    logger.info('Creating user', { email: body.email, role: body.role })

    // Validate using Zod schema
    const validated = validation.validate(userCreateSchema, body)

    // Create user using service layer
    // Service handles password hashing and duplicate check
    const user = await userService.create(validated, auth.user.id)

    logger.info('User created successfully', {
      userId: user.id,
      email: user.email,
      role: user.role
    })

    return successResponse(user, 201)
  } catch (error) {
    logger.error('Error creating user', error as Error)
    return errorResponse(error as Error)
  } finally {
    logger.clearContext()
  }
}
