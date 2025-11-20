/**
 * Response Helpers
 *
 * Standardized API response utilities for consistent response formats
 */

import { NextResponse } from 'next/server';

/**
 * Standard success response format
 */
export interface SuccessResponse<T = any> {
  success: true;
  data: T;
  timestamp?: string;
}

/**
 * Standard error response format
 */
export interface ErrorResponse {
  success: false;
  error: string;
  message?: string;
  code?: string;
  details?: Record<string, any>;
  timestamp?: string;
}

/**
 * Paginated response format
 */
export interface PaginatedResponse<T = any> {
  success: true;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
    count: number;
  };
  timestamp?: string;
}

/**
 * Create success response
 *
 * @param data - Response data
 * @param status - HTTP status code (default: 200)
 * @param includeTimestamp - Include timestamp in response (default: false)
 * @returns NextResponse with success format
 *
 * @example
 * ```typescript
 * return successResponse({ id: '123', title: 'Article' }, 201);
 * // { success: true, data: { id: '123', title: 'Article' } }
 * ```
 */
export function successResponse<T>(
  data: T,
  status: number = 200,
  includeTimestamp: boolean = false
): NextResponse {
  const response: SuccessResponse<T> = {
    success: true,
    data,
  };

  if (includeTimestamp) {
    response.timestamp = new Date().toISOString();
  }

  return NextResponse.json(response, { status });
}

/**
 * Create error response
 *
 * @param error - Error message or Error object
 * @param status - HTTP status code (default: 500)
 * @param details - Additional error details
 * @returns NextResponse with error format
 *
 * @example
 * ```typescript
 * return errorResponse('Article not found', 404);
 * // { success: false, error: 'Article not found' }
 *
 * return errorResponse(new ValidationError('Invalid input'), 400, { field: 'email' });
 * // { success: false, error: 'Invalid input', details: { field: 'email' } }
 * ```
 */
export function errorResponse(
  error: string | Error,
  status: number = 500,
  details?: Record<string, any>
): NextResponse {
  const errorMessage = typeof error === 'string' ? error : error.message;

  const response: ErrorResponse = {
    success: false,
    error: errorMessage,
    timestamp: new Date().toISOString(),
  };

  if (details) {
    response.details = details;
  }

  // Add error code for specific status codes
  if (status === 400) response.code = 'BAD_REQUEST';
  else if (status === 401) response.code = 'UNAUTHORIZED';
  else if (status === 403) response.code = 'FORBIDDEN';
  else if (status === 404) response.code = 'NOT_FOUND';
  else if (status === 409) response.code = 'CONFLICT';
  else if (status === 422) response.code = 'VALIDATION_ERROR';
  else if (status === 500) response.code = 'INTERNAL_ERROR';
  else if (status === 503) response.code = 'SERVICE_UNAVAILABLE';

  return NextResponse.json(response, { status });
}

/**
 * Create paginated response
 *
 * @param data - Array of items
 * @param page - Current page number
 * @param limit - Items per page
 * @param total - Total number of items
 * @param includeTimestamp - Include timestamp in response (default: false)
 * @returns NextResponse with paginated format
 *
 * @example
 * ```typescript
 * const articles = await prisma.article.findMany({ skip, take });
 * const total = await prisma.article.count();
 *
 * return paginatedResponse(articles, page, limit, total);
 * ```
 */
export function paginatedResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number,
  includeTimestamp: boolean = false
): NextResponse {
  const totalPages = Math.ceil(total / limit);
  const hasMore = page < totalPages;

  const response: PaginatedResponse<T> = {
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasMore,
      count: data.length,
    },
  };

  if (includeTimestamp) {
    response.timestamp = new Date().toISOString();
  }

  return NextResponse.json(response);
}

/**
 * Create validation error response
 *
 * @param errors - Validation errors object
 * @returns NextResponse with validation error format
 *
 * @example
 * ```typescript
 * return validationErrorResponse({
 *   email: 'Invalid email format',
 *   password: 'Password must be at least 6 characters'
 * });
 * ```
 */
export function validationErrorResponse(
  errors: Record<string, string | string[]>
): NextResponse {
  return errorResponse('Validation failed', 422, { errors });
}

/**
 * Create not found error response
 *
 * @param resource - Resource name (e.g., 'Article', 'User')
 * @param identifier - Resource identifier (optional)
 * @returns NextResponse with not found error
 *
 * @example
 * ```typescript
 * return notFoundResponse('Article', slug);
 * // { success: false, error: 'Article not found', details: { slug: 'my-article' } }
 * ```
 */
export function notFoundResponse(
  resource: string,
  identifier?: string | Record<string, any>
): NextResponse {
  const details = typeof identifier === 'string'
    ? { id: identifier }
    : identifier;

  return errorResponse(
    `${resource} not found`,
    404,
    details
  );
}

/**
 * Create unauthorized error response
 *
 * @param message - Custom error message (optional)
 * @returns NextResponse with unauthorized error
 */
export function unauthorizedResponse(message?: string): NextResponse {
  return errorResponse(
    message || 'Authentication required',
    401
  );
}

/**
 * Create forbidden error response
 *
 * @param message - Custom error message (optional)
 * @returns NextResponse with forbidden error
 */
export function forbiddenResponse(message?: string): NextResponse {
  return errorResponse(
    message || 'Insufficient permissions',
    403
  );
}

/**
 * Create conflict error response
 *
 * @param resource - Resource name
 * @param field - Conflicting field name
 * @param value - Conflicting value
 * @returns NextResponse with conflict error
 *
 * @example
 * ```typescript
 * return conflictResponse('Article', 'slug', existingSlug);
 * // { success: false, error: 'Article with this slug already exists' }
 * ```
 */
export function conflictResponse(
  resource: string,
  field: string,
  value: any
): NextResponse {
  return errorResponse(
    `${resource} with this ${field} already exists`,
    409,
    { [field]: value }
  );
}
