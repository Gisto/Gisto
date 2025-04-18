import { execSync } from 'node:child_process';
import * as path from 'node:path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

const commitHash = execSync('git rev-parse --short HEAD').toString();

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts', './test/setup.ts'],
  },
  define: {
    __COMMIT_HASH__: JSON.stringify(commitHash),
  },
});
