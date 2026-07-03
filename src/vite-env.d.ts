/// <reference types="vite/client" />

declare const __COMMIT_HASH__: string;
declare const __APP_VERSION__: string;
declare module '@wekanteam/markdown-it-mermaid';

interface ImportMetaEnv {
  VITE_SENTRY_DSN: string;
}
