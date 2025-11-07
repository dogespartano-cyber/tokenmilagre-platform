/**
 * Helpers para respostas consistentes de API
 *
 * Padroniza o formato de todas as respostas das API routes
 */

import { NextResponse } from 'next/server';

/**
 * Interface padrão de resposta de sucesso
 */
export interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
  message?: string;
  meta?: Record<string, any>;
}

/**
 * Interface padrão de resposta de erro
 */
export interface ApiErrorResponse {
  success: false;
  error: string;
  code?: string;
  details?: any;
}

/**
 * Retorna uma resposta de sucesso padronizada
 *
 * @example
 * ```ts
 * return apiSuccess({ articles: [...] }, 'Artigos carregados');
 * ```
 */
export function apiSuccess<T = any>(
  data: T,
  message?: string,
  meta?: Record<string, any>,
  status: number = 200
): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
      meta,
    },
    { status }
  );
}

/**
 * Retorna uma resposta de erro padronizada
 *
 * @example
 * ```ts
 * return apiError('Artigo não encontrado', 404, 'NOT_FOUND');
 * ```
 */
export function apiError(
  error: string,
  status: number = 500,
  code?: string,
  details?: any
): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    {
      success: false,
      error,
      code,
      details,
    },
    { status }
  );
}

/**
 * Erros comuns pré-definidos
 */
export const ApiErrors = {
  UNAUTHORIZED: () => apiError('Não autenticado', 401, 'UNAUTHORIZED'),
  FORBIDDEN: () => apiError('Sem permissão', 403, 'FORBIDDEN'),
  NOT_FOUND: (resource = 'Recurso') =>
    apiError(`${resource} não encontrado`, 404, 'NOT_FOUND'),
  VALIDATION_ERROR: (message: string, details?: any) =>
    apiError(message, 400, 'VALIDATION_ERROR', details),
  INTERNAL_ERROR: (message = 'Erro interno do servidor') =>
    apiError(message, 500, 'INTERNAL_ERROR'),
  RATE_LIMIT: (retryAfter: number) =>
    NextResponse.json(
      {
        success: false,
        error: 'Too many requests',
        code: 'RATE_LIMIT_EXCEEDED',
      },
      {
        status: 429,
        headers: {
          'Retry-After': retryAfter.toString(),
        },
      }
    ),
} as const;

/**
 * Wrapper para handlers de API com error handling automático
 *
 * @example
 * ```ts
 * export const GET = withErrorHandler(async (request) => {
 *   const data = await fetchData();
 *   return apiSuccess(data);
 * });
 * ```
 */
export function withErrorHandler<T extends any[]>(
  handler: (...args: T) => Promise<NextResponse>
) {
  return async (...args: T): Promise<NextResponse> => {
    try {
      return await handler(...args);
    } catch (error: any) {
      console.error('[API Error]', error);

      // Errors conhecidos
      if (error.name === 'UnauthorizedError') {
        return ApiErrors.UNAUTHORIZED();
      }

      if (error.name === 'ForbiddenError') {
        return ApiErrors.FORBIDDEN();
      }

      if (error.name === 'NotFoundError') {
        return ApiErrors.NOT_FOUND(error.resource);
      }

      if (error.name === 'ValidationError') {
        return ApiErrors.VALIDATION_ERROR(error.message, error.details);
      }

      // Erro genérico
      return ApiErrors.INTERNAL_ERROR(
        process.env.NODE_ENV === 'production'
          ? undefined
          : error.message
      );
    }
  };
}

/**
 * Custom errors para serem lançados nos handlers
 */
export class UnauthorizedError extends Error {
  name = 'UnauthorizedError';
  constructor(message = 'Não autenticado') {
    super(message);
  }
}

export class ForbiddenError extends Error {
  name = 'ForbiddenError';
  constructor(message = 'Sem permissão') {
    super(message);
  }
}

export class NotFoundError extends Error {
  name = 'NotFoundError';
  resource?: string;

  constructor(resource = 'Recurso') {
    super(`${resource} não encontrado`);
    this.resource = resource;
  }
}

export class ValidationError extends Error {
  name = 'ValidationError';
  details?: any;

  constructor(message: string, details?: any) {
    super(message);
    this.details = details;
  }
}
