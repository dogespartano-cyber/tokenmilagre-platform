/**
 * Service tokens for dependency injection
 * Use these tokens instead of class constructors for better testability
 */
export const TOKENS = {
    LoggerService: 'LoggerService',
    ValidationService: 'ValidationService',
    ArticleService: 'ArticleService',
    ResourceService: 'ResourceService',
    UserService: 'UserService',
} as const
