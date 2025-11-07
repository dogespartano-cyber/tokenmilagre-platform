export async function register() {
  // Validar variáveis de ambiente no startup
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./lib/env');
  }

  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config');
  }
}
