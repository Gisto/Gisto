import { resolveMiniMaxEndpoint } from '@/constants/minimax-endpoints.ts';
import { resolveOllamaEndpoint } from '@/constants/ollama-endpoints.ts';
import { t } from '@/lib/i18n';
import { globalState } from '@/lib/store/globalState.ts';

type ModelInfo = {
  id: string;
  name: string;
  isPreset?: boolean;
  description?: string;
  pricing?: { prompt: number; completion: number };
  contextLength?: number;
  isFree?: boolean;
};

function getApiKey(provider: string): string | null {
  const { ai } = globalState.getState().settings;
  const keyField: Record<string, string> = {
    openai: 'openaiApiKey',
    gemini: 'geminiApiKey',
    claude: 'claudeApiKey',
    minimax: 'minimaxApiKey',
    openrouter: 'openRouterApiKey',
    ollama: 'ollamaApiKey',
  };
  const key = keyField[provider];
  if (!key) return null;
  const val = (ai as Record<string, unknown>)[key];
  return typeof val === 'string' ? val : null;
}

export async function fetchOpenRouterModels(): Promise<ModelInfo[]> {
  const apiKey = getApiKey('openrouter') || '';
  const headers: Record<string, string> = apiKey ? { Authorization: `Bearer ${apiKey}` } : {};

  const [modelsResponse, presetsResponse] = await Promise.all([
    fetch('https://openrouter.ai/api/v1/models', { headers }),
    apiKey
      ? fetch('https://openrouter.ai/api/v1/presets?limit=100', { headers }).catch(() => null)
      : Promise.resolve(null),
  ]);

  if (!modelsResponse.ok) throw new Error(`OpenRouter API error: ${modelsResponse.status}`);

  const data = await modelsResponse.json();
  const presetData = presetsResponse?.ok ? await presetsResponse.json().catch(() => null) : null;

  const presets = (presetData?.data || [])
    .filter(
      (preset: Record<string, unknown>) =>
        preset.status === 'active' && typeof preset.slug === 'string'
    )
    .map((preset: Record<string, unknown>) => ({
      id: `@preset/${preset.slug as string}`,
      name: (preset.name as string) || (preset.slug as string),
      description: (preset.description as string | null) || undefined,
      isPreset: true,
    }));

  const models = (data.data || []).map((m: Record<string, unknown>) => ({
    id: m.id as string,
    name: (m.name as string) || (m.id as string),
    description: m.description as string | undefined,
    pricing: m.pricing as { prompt: number; completion: number } | undefined,
    contextLength: m.context_length as number | undefined,
    isFree:
      String(m.id).endsWith(':free') || ((m.pricing as { prompt?: number })?.prompt ?? 1) === 0,
  }));

  return [...presets, ...models];
}

export async function fetchOpenAiModels(): Promise<ModelInfo[]> {
  const apiKey = getApiKey('openai');
  if (!apiKey) throw new Error(t('api.openAiApiKeyNotConfigured'));

  const res = await fetch('https://api.openai.com/v1/models', {
    headers: { Authorization: `Bearer ${apiKey}` },
  });

  if (!res.ok) throw new Error(`OpenAI API error: ${res.status}`);

  const data = await res.json();

  return (data.data || [])
    .filter((m: Record<string, unknown>) => m.id as string)
    .map((m: Record<string, unknown>) => ({
      id: m.id as string,
      name: m.id as string,
    }));
}

export async function fetchGeminiModels(): Promise<ModelInfo[]> {
  const apiKey = getApiKey('gemini');
  if (!apiKey) throw new Error(t('api.geminiApiKeyNotConfigured'));

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);

  if (!res.ok) throw new Error(`Gemini API error: ${res.status}`);

  const data = await res.json();

  return (data.models || []).map((m: Record<string, unknown>) => ({
    id: m.name as string,
    name: ((m.displayName as string) || (m.name as string)).replace(/^models\//, ''),
  }));
}

export async function fetchClaudeModels(): Promise<ModelInfo[]> {
  const apiKey = getApiKey('claude');
  if (!apiKey) throw new Error(t('api.claudeApiKeyNotConfigured'));

  const res = await fetch('/proxy/ai/claude/v1/models', {
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
  });

  if (!res.ok) throw new Error(`Claude API error: ${res.status}`);

  const data = await res.json();

  return (data.data || []).map((m: Record<string, unknown>) => ({
    id: m.id as string,
    name: (m.name as string) || (m.display_name as string) || (m.id as string),
  }));
}

export async function fetchMiniMaxModels(): Promise<ModelInfo[]> {
  const apiKey = getApiKey('minimax');
  if (!apiKey) throw new Error(t('api.configureAiProvider'));

  const { ai } = globalState.getState().settings;
  const endpoint = resolveMiniMaxEndpoint(ai.minimaxRegion, ai.minimaxProtocol);

  const res = await fetch(endpoint.modelsUrl, {
    headers:
      endpoint.protocol === 'anthropic'
        ? { 'x-api-key': apiKey }
        : { Authorization: `Bearer ${apiKey}` },
  });

  if (!res.ok) throw new Error(`MiniMax API error: ${res.status}`);

  const data = await res.json();

  return (data.data || [])
    .filter((m: Record<string, unknown>) => typeof m.id === 'string')
    .map((m: Record<string, unknown>) => ({
      id: m.id as string,
      name: m.id as string,
    }));
}

export async function fetchOllamaModels(): Promise<ModelInfo[]> {
  const { ai } = globalState.getState().settings;
  const endpoint = resolveOllamaEndpoint(ai.ollamaMode, ai.ollamaBaseUrl);
  const apiKey = getApiKey('ollama');

  const headers: Record<string, string> = {};
  if (apiKey) {
    headers.Authorization = `Bearer ${apiKey}`;
  }

  const res = await fetch(endpoint.modelsUrl, { headers });

  if (!res.ok) throw new Error(`Ollama API error: ${res.status}`);

  const data = await res.json();

  const list = (data.data || data.models || []) as Record<string, unknown>[];

  return list
    .map((m) => {
      const id = (m.id ?? m.model ?? m.name) as string | undefined;
      if (!id) return null;
      return { id, name: (m.name as string) || id };
    })
    .filter((m): m is ModelInfo => m !== null);
}

export async function fetchModels(provider: string): Promise<ModelInfo[]> {
  switch (provider) {
    case 'openrouter':
      return fetchOpenRouterModels();
    case 'openai':
      return fetchOpenAiModels();
    case 'gemini':
      return fetchGeminiModels();
    case 'claude':
      return fetchClaudeModels();
    case 'minimax':
      return fetchMiniMaxModels();
    case 'ollama':
      return fetchOllamaModels();
    default:
      return [];
  }
}
