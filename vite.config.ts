import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import * as path from 'node:path';

import { sentryVitePlugin } from '@sentry/vite-plugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));
const commitHash = execSync('git rev-parse --short HEAD').toString();

const enableSourceMaps = Boolean(process.env.SENTRY_AUTH_TOKEN);

// https://vite.dev/config/
export default defineConfig({
  ...(enableSourceMaps ? { build: { sourcemap: 'hidden' } } : {}),
  plugins: [
    react(),
    ...(process.env.SENTRY_AUTH_TOKEN
      ? [
          sentryVitePlugin({
            org: 'gisto',
            project: process.env.SENTRY_PROJECT,
            authToken: process.env.SENTRY_AUTH_TOKEN,
          }),
        ]
      : []),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts', './test/setup.ts'],
    reporters: process.env.CI ? ['default', 'github-actions'] : ['default'],
  },
  define: {
    __COMMIT_HASH__: JSON.stringify(commitHash),
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
});
