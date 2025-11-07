/**
 * Testes para helpers de resposta de API
 */

import {
  apiSuccess,
  apiError,
  ApiErrors,
  withErrorHandler,
  UnauthorizedError,
  ValidationError,
} from '@/lib/api-response';

describe('API Response Helpers', () => {
  describe('apiSuccess', () => {
    it('should return success response with data', () => {
      const response = apiSuccess({ test: 'data' }, 'Success message');
      expect(response.status).toBe(200);
    });

    it('should allow custom status code', () => {
      const response = apiSuccess({ test: 'data' }, undefined, undefined, 201);
      expect(response.status).toBe(201);
    });
  });

  describe('apiError', () => {
    it('should return error response', () => {
      const response = apiError('Error message', 400);
      expect(response.status).toBe(400);
    });

    it('should include error code', () => {
      const response = apiError('Error', 400, 'VALIDATION_ERROR');
      expect(response.status).toBe(400);
    });
  });

  describe('ApiErrors', () => {
    it('should return UNAUTHORIZED error', () => {
      const response = ApiErrors.UNAUTHORIZED();
      expect(response.status).toBe(401);
    });

    it('should return FORBIDDEN error', () => {
      const response = ApiErrors.FORBIDDEN();
      expect(response.status).toBe(403);
    });

    it('should return NOT_FOUND error', () => {
      const response = ApiErrors.NOT_FOUND('Article');
      expect(response.status).toBe(404);
    });
  });

  describe('withErrorHandler', () => {
    it('should catch UnauthorizedError', async () => {
      const handler = withErrorHandler(async () => {
        throw new UnauthorizedError();
      });

      const response = await handler();
      expect(response.status).toBe(401);
    });

    it('should catch ValidationError', async () => {
      const handler = withErrorHandler(async () => {
        throw new ValidationError('Invalid data');
      });

      const response = await handler();
      expect(response.status).toBe(400);
    });

    it('should handle generic errors', async () => {
      const handler = withErrorHandler(async () => {
        throw new Error('Generic error');
      });

      const response = await handler();
      expect(response.status).toBe(500);
    });
  });
});
