import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/helpers/auth-helpers';
import { successResponse, errorResponse, notFoundResponse } from '@/lib/helpers/response-helpers';
import { ServiceLocator } from '@/lib/di/container';
import { userUpdateSchema, roleEnum } from '@/lib/schemas/user-schemas';
import { PASSWORD_CONSTRAINTS } from '@/lib/constants/validation';

/**
 * PATCH /api/admin/users/[id]
 * Updates user (role, name, password, etc.)
 * Protected: ADMIN only
 *
 * @param id - User ID to update
 * @returns Updated user (without password)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // 1. Authentication & Authorization
  const auth = await requireAdmin(request);
  if (!auth.success) return auth.response;

  const { id } = await params;

  // 2. Logging context
  const logger = ServiceLocator.getLogger();
  logger.setContext({ endpoint: `/api/admin/users/${id}`, method: 'PATCH', userId: auth.user.id });

  try {
    logger.info('Updating user', { targetUserId: id });

    // 3. Get services
    const userService = ServiceLocator.getUser();
    const validation = ServiceLocator.getValidation();

    // 4. Check if user exists
    const existingUser = await userService.getById(id);
    if (!existingUser) {
      return notFoundResponse('User', { id });
    }

    // 5. Parse and validate body
    const body = await request.json();

    // Prevent admin from changing their own role
    if (auth.user.id === id && body.role && body.role !== 'ADMIN') {
      return errorResponse('You cannot change your own role', 400);
    }

    // Validate using Zod schema
    const validated = validation.validate(userUpdateSchema, body);

    // 6. Update user using service
    const updatedUser = await userService.update(id, validated, auth.user.id);

    logger.info('User updated successfully', { targetUserId: id, email: updatedUser.email });

    // 7. Return standardized response
    return successResponse(updatedUser);
  } catch (error) {
    logger.error('Error updating user', error as Error, { targetUserId: id });
    return errorResponse(error as Error);
  } finally {
    logger.clearContext();
  }
}

/**
 * DELETE /api/admin/users/[id]
 * Deletes user
 * Protected: ADMIN only
 *
 * @param id - User ID to delete
 * @returns Success message
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // 1. Authentication & Authorization
  const auth = await requireAdmin(request);
  if (!auth.success) return auth.response;

  const { id } = await params;

  // 2. Logging context
  const logger = ServiceLocator.getLogger();
  logger.setContext({ endpoint: `/api/admin/users/${id}`, method: 'DELETE', userId: auth.user.id });

  try {
    logger.info('Deleting user', { targetUserId: id });

    // 3. Get service
    const userService = ServiceLocator.getUser();

    // 4. Delete user using service (service handles all validations)
    await userService.delete(id, auth.user.id);

    logger.info('User deleted successfully', { targetUserId: id });

    // 5. Return standardized response
    return successResponse({ message: 'User deleted successfully' });
  } catch (error) {
    logger.error('Error deleting user', error as Error, { targetUserId: id });
    return errorResponse(error as Error);
  } finally {
    logger.clearContext();
  }
}
