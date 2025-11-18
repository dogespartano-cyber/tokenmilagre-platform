import * as Sentry from "@sentry/nextjs";

const isProd = process.env.NODE_ENV === 'production';
const isDev = process.env.NODE_ENV === 'development';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Environment
  environment: process.env.NODE_ENV || 'development',

  // Sample rate: 100% in dev, 10% in prod (cost optimization)
  tracesSampleRate: isDev ? 1.0 : 0.1,

  // Performance monitoring
  profilesSampleRate: isDev ? 1.0 : 0.1,

  // Debug only in development
  debug: isDev,

  // Error filtering
  beforeSend(event, hint) {
    // Don't send errors in development
    if (isDev) {
      console.error('Sentry Event (dev):', event);
      return null;
    }

    // Filter out noise
    const error = hint.originalException;
    if (error instanceof Error) {
      // Ignore expected/network errors
      if (
        error.message.includes('Network request failed') ||
        error.message.includes('Failed to fetch') ||
        error.message.includes('timeout')
      ) {
        return null;
      }
    }

    return event;
  },

  // Filter breadcrumbs
  beforeBreadcrumb(breadcrumb) {
    // Don't capture console logs as breadcrumbs
    if (breadcrumb.category === 'console') {
      return null;
    }
    return breadcrumb;
  },

  // Integrations
  integrations: [
    // Performance monitoring
    new Sentry.BrowserTracing({
      tracingOrigins: ['localhost', /^\//],
    }),
  ],
});
