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
    dedupe: ['react', 'react-dom'],
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/proxy/ai/openrouter': {
        target: 'https://openrouter.ai',
        changeOrigin: true,
        rewrite: (p) => p.replace('/proxy/ai/openrouter', ''),
      },
      '/proxy/ai/openai': {
        target: 'https://api.openai.com',
        changeOrigin: true,
        rewrite: (p) => p.replace('/proxy/ai/openai', ''),
      },
      '/proxy/ai/gemini': {
        target: 'https://generativelanguage.googleapis.com',
        changeOrigin: true,
        rewrite: (p) => p.replace('/proxy/ai/gemini', ''),
      },
      '/proxy/ai/claude': {
        target: 'https://api.anthropic.com',
        changeOrigin: true,
        rewrite: (p) => p.replace('/proxy/ai/claude', ''),
      },
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
