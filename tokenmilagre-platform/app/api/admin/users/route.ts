import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { requireAdmin } from '@/lib/helpers/auth-helpers';
import { successResponse, errorResponse, conflictResponse } from '@/lib/helpers/response-helpers';
import { ServiceLocator } from '@/lib/di/container';
import { PASSWORD_CONSTRAINTS, EMAIL_CONSTRAINTS } from '@/lib/constants/validation';

/**
 * GET /api/admin/users
 * List all users
 * Protected: ADMIN only
 */
export async function GET(request: NextRequest) {
  try {
    // Authenticate and authorize
    const auth = await requireAdmin(request);
    if (!auth.success) return auth.response;

    const logger = ServiceLocator.getLogger();
    logger.setContext({ endpoint: '/api/admin/users', method: 'GET', userId: auth.user.id });

    try {
      // Query parameters
      const searchParams = request.nextUrl.searchParams;
      const roleFilter = searchParams.get('role');

      // Build where clause
      const where: any = {};
      if (roleFilter && roleFilter !== 'all') {
        where.role = roleFilter;
      }

      // Fetch users
      const users = await prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          image: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              articles: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      logger.info('Users fetched successfully', { count: users.length, roleFilter });

      return successResponse(users);
    } finally {
      logger.clearContext();
    }
  } catch (error) {
    const logger = ServiceLocator.getLogger();
    logger.error('Error fetching users', error as Error);
    return errorResponse(error instanceof Error ? error.message : 'Error fetching users');
  }
}

/**
 * POST /api/admin/users
 * Create new user
 * Protected: ADMIN only
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate and authorize
    const auth = await requireAdmin(request);
    if (!auth.success) return auth.response;

    const logger = ServiceLocator.getLogger();
    const validation = ServiceLocator.getValidation();

    logger.setContext({ endpoint: '/api/admin/users', method: 'POST', userId: auth.user.id });

    try {
      // Parse body
      const body = await request.json();
      const { email, name, password, role } = body;

      // Validate required fields
      if (!email || !password || !role) {
        logger.warn('Missing required fields', { email: !!email, password: !!password, role: !!role });
        return errorResponse('Email, password, and role are required', 400);
      }

      // Validate email format
      if (!EMAIL_CONSTRAINTS.PATTERN.test(email)) {
        logger.warn('Invalid email format', { email });
        return errorResponse('Invalid email format', 400);
      }

      // Validate password length
      if (password.length < PASSWORD_CONSTRAINTS.MIN_LENGTH) {
        logger.warn('Password too short', { length: password.length });
        return errorResponse(
          `Password must be at least ${PASSWORD_CONSTRAINTS.MIN_LENGTH} characters`,
          400
        );
      }

      // Validate role
      if (!['ADMIN', 'EDITOR', 'VIEWER'].includes(role)) {
        logger.warn('Invalid role', { role });
        return errorResponse('Invalid role', 400);
      }

      // Check if email already exists
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        logger.warn('Email already exists', { email });
        return conflictResponse('User', 'email', email);
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          name: name || null,
          password: hashedPassword,
          role,
          image: null
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true
        }
      });

      logger.info('User created successfully', { userId: user.id, email: user.email, role: user.role });

      return successResponse(user, 201);
    } finally {
      logger.clearContext();
    }
  } catch (error) {
    const logger = ServiceLocator.getLogger();
    logger.error('Error creating user', error as Error);
    return errorResponse(error instanceof Error ? error.message : 'Error creating user');
  }
}
