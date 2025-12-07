/**
 * LoggerService - Lightweight Logger
 *
 * Implementação simples de logging usando console.
 * Para projetos maiores, considere Pino ou Winston.
 */

export class LoggerService {
  private context: Record<string, any> = {}

  setContext(ctx: Record<string, any>): void {
    this.context = { ...this.context, ...ctx }
  }

  clearContext(): void {
    this.context = {}
  }

  info(message: string, meta?: object): void {
    console.log('[INFO]', message, { ...this.context, ...meta })
  }

  warn(message: string, meta?: object): void {
    console.warn('[WARN]', message, { ...this.context, ...meta })
  }

  error(message: string, error?: Error, meta?: object): void {
    console.error('[ERROR]', message, error, { ...this.context, ...meta })
  }

  debug(message: string, meta?: object): void {
    console.debug('[DEBUG]', message, { ...this.context, ...meta })
  }

  logResponse(statusCode: number, duration: number, meta?: object): void {
    const logData = { statusCode, duration, ...meta }

    if (statusCode >= 500) {
      this.error(`HTTP ${statusCode}`, undefined, logData)
    } else if (statusCode >= 400) {
      this.warn(`HTTP ${statusCode}`, logData)
    } else {
      this.info(`HTTP ${statusCode}`, logData)
    }
  }

  logAction(action: string, userId?: string, meta?: object): void {
    this.info('User Action', { action, userId, ...meta })
  }

  fatal(message: string, error?: Error | object): void {
    console.error('[FATAL]', message, error, this.context)
  }
}

// Export singleton
export const logger = new LoggerService()
