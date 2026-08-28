export type OllamaMode = 'local' | 'remote';

export const OLLAMA_MODE_OPTIONS: { value: OllamaMode; label: string }[] = [
  { value: 'local', label: 'Local' },
  { value: 'remote', label: 'Remote' },
];

export const DEFAULT_OLLAMA_BASE_URL = 'http://localhost:11434';

function isOllamaMode(value: unknown): value is OllamaMode {
  return value === 'local' || value === 'remote';
}

function trimTrailingSlashes(url: string): string {
  return url.replace(/\/+$/, '');
}

export function resolveOllamaEndpoint(mode: unknown, baseUrl?: string) {
  const resolvedMode = isOllamaMode(mode) ? mode : 'local';
  const base =
    resolvedMode === 'remote' && baseUrl?.trim()
      ? trimTrailingSlashes(baseUrl.trim())
      : DEFAULT_OLLAMA_BASE_URL;

  return {
    mode: resolvedMode,
    baseUrl: base,
    chatUrl: `${base}/v1/chat/completions`,
    modelsUrl: `${base}/v1/models`,
  };
}
