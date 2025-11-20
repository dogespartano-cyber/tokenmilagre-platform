/**
 * Dependency Injection Container
 *
 * Centralized DI container using tsyringe for managing service dependencies.
 * All core services are registered as singletons for consistent state.
 *
 * @example
 * ```typescript
 * import { container } from '@/lib/di/container'
 * import { ArticleService } from '@/lib/services/article-service'
 *
 * // Get service instance
 * const articleService = container.resolve(ArticleService)
 *
 * // Use in API routes
 * export async function GET(request: Request) {
 *   const articleService = container.resolve(ArticleService)
 *   const articles = await articleService.list({ page: 1, limit: 10 })
 *   return NextResponse.json(articles)
 * }
 * ```
 */

import 'reflect-metadata'
import { container as tsyringeContainer } from 'tsyringe'
import { LoggerService } from '@/lib/services/logger-service'
import { ValidationService } from '@/lib/services/validation-service'
import { ArticleService } from '@/lib/services/article-service'

/**
 * Service tokens for dependency injection
 * Use these tokens instead of class constructors for better testability
 */
export const TOKENS = {
  LoggerService: 'LoggerService',
  ValidationService: 'ValidationService',
  ArticleService: 'ArticleService',
} as const

/**
 * Initializes the DI container with all core services
 * Called automatically on import, but can be called manually for testing
 */
export function initializeContainer(): void {
  // Clear existing registrations (useful for tests)
  tsyringeContainer.clearInstances()

  // Register LoggerService as singleton
  tsyringeContainer.registerSingleton(TOKENS.LoggerService, LoggerService)

  // Register ValidationService as singleton
  tsyringeContainer.registerSingleton(TOKENS.ValidationService, ValidationService)

  // Register ArticleService as singleton
  // Note: ArticleService depends on LoggerService and ValidationService,
  // but we're using the global instances for now (logger, validationService)
  // In the future, we can refactor to inject dependencies via constructor
  tsyringeContainer.registerSingleton(TOKENS.ArticleService, ArticleService)
}

/**
 * Export the configured container
 * This is the main container instance used throughout the application
 */
export const container = tsyringeContainer

/**
 * Helper function to resolve services with type safety
 * Provides better IDE support and type checking
 */
export class ServiceLocator {
  /**
   * Gets LoggerService instance
   */
  static getLogger(): LoggerService {
    return container.resolve(TOKENS.LoggerService)
  }

  /**
   * Gets ValidationService instance
   */
  static getValidation(): ValidationService {
    return container.resolve(TOKENS.ValidationService)
  }

  /**
   * Gets ArticleService instance
   */
  static getArticle(): ArticleService {
    return container.resolve(TOKENS.ArticleService)
  }

  /**
   * Resets all service instances (useful for tests)
   */
  static reset(): void {
    container.clearInstances()
    initializeContainer()
  }
}

// Initialize container on module load
initializeContainer()
