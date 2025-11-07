/**
 * Sistema de logging estruturado
 *
 * Substitui console.log para melhor controle e formatação
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: any;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isTest = process.env.NODE_ENV === 'test';

  /**
   * Formata a mensagem de log
   */
  private format(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

    if (context && Object.keys(context).length > 0) {
      return `${prefix} ${message} ${JSON.stringify(context)}`;
    }

    return `${prefix} ${message}`;
  }

  /**
   * Log de debug (apenas em desenvolvimento)
   */
  debug(message: string, context?: LogContext): void {
    if (!this.isDevelopment || this.isTest) return;
    console.debug(this.format('debug', message, context));
  }

  /**
   * Log de informação
   */
  info(message: string, context?: LogContext): void {
    if (this.isTest) return;
    console.info(this.format('info', message, context));
  }

  /**
   * Log de aviso
   */
  warn(message: string, context?: LogContext): void {
    if (this.isTest) return;
    console.warn(this.format('warn', message, context));
  }

  /**
   * Log de erro (sempre ativo)
   */
  error(message: string, error?: Error | any, context?: LogContext): void {
    const errorContext = {
      ...context,
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack,
        name: error.name,
      } : error,
    };

    console.error(this.format('error', message, errorContext));

    // Em produção, enviar para Sentry
    if (!this.isDevelopment && typeof window === 'undefined') {
      // Server-side: Sentry já captura erros automaticamente
    }
  }

  /**
   * Log de API request/response
   */
  api(method: string, path: string, status: number, duration?: number): void {
    if (this.isTest) return;

    const context: LogContext = {
      method,
      path,
      status,
    };

    if (duration !== undefined) {
      context.duration = `${duration}ms`;
    }

    const level: LogLevel = status >= 500 ? 'error' :
                            status >= 400 ? 'warn' :
                            'info';

    this[level](`API ${method} ${path}`, context);
  }

  /**
   * Log de performance
   */
  perf(operation: string, duration: number, context?: LogContext): void {
    if (this.isTest) return;

    const level: LogLevel = duration > 1000 ? 'warn' : 'debug';

    this[level](`Performance: ${operation}`, {
      ...context,
      duration: `${duration}ms`,
    });
  }
}

/**
 * Singleton logger instance
 */
export const logger = new Logger();

/**
 * Helper para medir tempo de execução
 */
export function withTiming<T>(
  operation: string,
  fn: () => T | Promise<T>,
  context?: LogContext
): Promise<T> {
  const start = Date.now();

  const result = fn();

  if (result instanceof Promise) {
    return result.then((value) => {
      const duration = Date.now() - start;
      logger.perf(operation, duration, context);
      return value;
    });
  }

  const duration = Date.now() - start;
  logger.perf(operation, duration, context);
  return Promise.resolve(result);
}
