import * as Sentry from "@sentry/nextjs";


const isDev = process.env.NODE_ENV === 'development';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Environment
  environment: process.env.NODE_ENV || 'development',

  // Sample rate: 100% in dev, 10% in prod
  tracesSampleRate: isDev ? 1.0 : 0.1,

  // Debug only in development
  debug: isDev,

  // Session Replay: capture all errors
  replaysOnErrorSampleRate: 1.0,

  // Session Replay: only 10% of normal sessions in prod
  replaysSessionSampleRate: isDev ? 1.0 : 0.1,

  // Error filtering (same as server)
  beforeSend(event, hint) {
    if (isDev) {
      console.error('Sentry Event (client, dev):', event);
      return null;
    }

    const error = hint.originalException;
    if (error instanceof Error) {
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

  beforeBreadcrumb(breadcrumb) {
    if (breadcrumb.category === 'console') {
      return null;
    }
    return breadcrumb;
  },

  integrations: [
    // Session Replay with privacy
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
});
