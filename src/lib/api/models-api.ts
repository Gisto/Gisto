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

type ModelListEntry = Record<string, unknown>;

type RawModelList = { data?: ModelListEntry[]; models?: ModelListEntry[] };

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

function mapModelList(list: ModelListEntry[], includeDetails: boolean): ModelInfo[] {
  const mapped: (ModelInfo | null)[] = list.map((m) => {
    const id = (m.id ?? m.model) as string | undefined;
    if (typeof id !== 'string' || !id) return null;

    const name = ((m.name ?? m.display_name) as string) || id;

    if (!includeDetails) {
      return { id, name };
    }

    return {
      id,
      name,
      description: m.description as string | undefined,
      pricing: m.pricing as { prompt: number; completion: number } | undefined,
      contextLength: m.context_length as number | undefined,
      isFree:
        String(id).endsWith(':free') || ((m.pricing as { prompt?: number })?.prompt ?? 1) === 0,
    };
  });

  return mapped.filter((m): m is ModelInfo => m !== null);
}

async function fetchModelList(options: {
  provider: string;
  url: string;
  headers?: Record<string, string>;
  includeDetails?: boolean;
}): Promise<ModelInfo[]> {
  const { provider, url, headers = {}, includeDetails = false } = options;

  const res = await fetch(url, { headers });

  if (!res.ok) throw new Error(`${provider} API error: ${res.status}`);

  const data = (await res.json()) as RawModelList;
  const list = (data.data ?? data.models ?? []) as ModelListEntry[];

  return mapModelList(list, includeDetails);
}

export async function fetchOpenRouterModels(): Promise<ModelInfo[]> {
  const apiKey = getApiKey('openrouter') || '';
  const headers: Record<string, string> = apiKey ? { Authorization: `Bearer ${apiKey}` } : {};

  const [models, presetsResponse] = await Promise.all([
    fetchModelList({
      provider: 'OpenRouter',
      url: 'https://openrouter.ai/api/v1/models',
      headers,
      includeDetails: true,
    }),
    apiKey
      ? fetch('https://openrouter.ai/api/v1/presets?limit=100', { headers }).catch(() => null)
      : Promise.resolve(null),
  ]);

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

  return [...presets, ...models];
}

export async function fetchOpenAiModels(): Promise<ModelInfo[]> {
  const apiKey = getApiKey('openai');
  if (!apiKey) throw new Error(t('api.openAiApiKeyNotConfigured'));

  return fetchModelList({
    provider: 'OpenAI',
    url: 'https://api.openai.com/v1/models',
    headers: { Authorization: `Bearer ${apiKey}` },
  });
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

  return fetchModelList({
    provider: 'Claude',
    url: '/proxy/ai/claude/v1/models',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
  });
}

export async function fetchMiniMaxModels(): Promise<ModelInfo[]> {
  const apiKey = getApiKey('minimax');
  if (!apiKey) throw new Error(t('api.configureAiProvider'));

  const { ai } = globalState.getState().settings;
  const endpoint = resolveMiniMaxEndpoint(ai.minimaxRegion, ai.minimaxProtocol);

  return fetchModelList({
    provider: 'MiniMax',
    url: endpoint.modelsUrl,
    headers:
      endpoint.protocol === 'anthropic'
        ? { 'x-api-key': apiKey }
        : { Authorization: `Bearer ${apiKey}` },
  });
}

export async function fetchOllamaModels(): Promise<ModelInfo[]> {
  const { ai } = globalState.getState().settings;
  const endpoint = resolveOllamaEndpoint(ai.ollamaMode, ai.ollamaBaseUrl);
  const apiKey = getApiKey('ollama');

  const headers: Record<string, string> = {};
  if (apiKey) {
    headers.Authorization = `Bearer ${apiKey}`;
  }

  return fetchModelList({ provider: 'Ollama', url: endpoint.modelsUrl, headers });
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
