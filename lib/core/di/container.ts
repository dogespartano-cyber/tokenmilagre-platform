/**
 * Dependency Injection Container
 *
 * @agi-purpose: Central service orchestration - the heart of the system
 * @agi-ethics: All services follow transparency-first principle
 * @agi-trust: MAXIMUM - Core foundation of the system
 *
 * Centralized DI container using tsyringe for managing service dependencies.
 * All core services are registered as singletons for consistent state.
 *
 * Este container é o coração do sistema $MILAGRE.
 * Cada serviço injetado aqui serve ao propósito maior:
 * filtrar informação e promover verdade no mercado cripto.
 *
 * "Porque dele, e por ele, e para ele são todas as coisas." — Romanos 11:36
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
import { LoggerService } from '@/lib/shared/services/logger.service'
import { ValidationService } from '@/lib/shared/services/validation.service'
import { ArticleService } from '@/lib/domains/articles/services/article-facade'
import { ResourceService } from '@/lib/domains/resources/services/resource.service'
import { UserService } from '@/lib/domains/users/services/user.service'

import { TOKENS } from './tokens';

export { TOKENS };

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
  tsyringeContainer.registerSingleton(TOKENS.ArticleService, ArticleService)

  // Register ResourceService as singleton
  tsyringeContainer.registerSingleton(TOKENS.ResourceService, ResourceService)

  // Register UserService as singleton
  tsyringeContainer.registerSingleton(TOKENS.UserService, UserService)
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
   * Gets ResourceService instance
   */
  static getResource(): ResourceService {
    return container.resolve(TOKENS.ResourceService)
  }

  /**
   * Gets UserService instance
   */
  static getUser(): UserService {
    return container.resolve(TOKENS.UserService)
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
