import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  release: `gisto@${__APP_VERSION__}+${__COMMIT_HASH__}`,

  dataCollection: { userInfo: false },

  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],

  tracesSampleRate: import.meta.env.DEV ? 0.0 : 0.2,
  tracePropagationTargets: ['localhost'],

  replaysSessionSampleRate: import.meta.env.DEV ? 0 : 0.1,
  replaysOnErrorSampleRate: 1.0,

  enableLogs: !import.meta.env.DEV,
});
