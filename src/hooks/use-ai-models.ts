import { useCallback, useEffect, useState } from 'react';

import { fetchModels } from '@/lib/api/models-api.ts';
import { t } from '@/lib/i18n';

export type ModelOption = {
  value: string;
  label: string;
  isPreset?: boolean;
  hasModelDetails?: boolean;
  isFree?: boolean;
  modelId?: string;
  description?: string;
  contextLength?: number;
  pricing?: { prompt: number; completion: number };
};

type UseAiModelsResult = {
  models: ModelOption[];
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
};

export function includeSelectedModel(models: ModelOption[], value: string): ModelOption[] {
  if (!value || models.some((model) => model.value === value)) return models;

  return [
    {
      value,
      label: value,
      modelId: value,
      isPreset: value.startsWith('@preset/'),
      hasModelDetails: false,
    },
    ...models,
  ];
}

export function sortModelOptions(models: ModelOption[]): ModelOption[] {
  const byLabel = (a: ModelOption, b: ModelOption) => a.label.localeCompare(b.label);
  const presets = models.filter((model) => model.isPreset).sort(byLabel);
  const free = models.filter((model) => !model.isPreset && model.isFree);
  const paid = models.filter((model) => !model.isPreset && !model.isFree);

  return [...presets, ...free, ...paid];
}

const cache = new Map<string, { models: ModelOption[]; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000;

function formatModelName(name: string, id: string): string {
  if (name !== id) return name;
  const parts = id.split('/');
  const last = parts[parts.length - 1]?.replace(/:free$/, '') ?? id;
  return last.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function stripFreeLabel(name: string): string {
  return name
    .replace(/\(free\)/gi, '')
    .replace(/\(free trial\)/gi, '')
    .trim();
}

const KNOWN_MODEL_LABELS: Record<string, string> = {
  'gpt-4o': 'GPT-4o',
  'gpt-4o-mini': 'GPT-4o Mini',
  'gpt-4-turbo': 'GPT-4 Turbo',
  'gpt-4': 'GPT-4',
  o1: 'o1',
  'o3-mini': 'o3 Mini',
  'gemini-2.0-flash': 'Gemini 2.0 Flash',
  'gemini-1.5-pro': 'Gemini 1.5 Pro',
  'gemini-1.5-flash': 'Gemini 1.5 Flash',
  'claude-opus-4-5-20251101': 'Claude Opus 4.5',
  'claude-haiku-4-5-20251001': 'Claude Haiku 4.5',
  'claude-sonnet-4-5-20250929': 'Claude Sonnet 4.5',
  'claude-sonnet-4-20250514': 'Claude Sonnet 4',
  'claude-opus-4-20250514': 'Claude Opus 4',
  'claude-3-haiku-20240307': 'Claude 3 Haiku',
  'MiniMax-M3': 'MiniMax-M3',
  'MiniMax-M2.7': 'MiniMax-M2.7',
};

export function useAiModels(provider: string | undefined): UseAiModelsResult {
  const [models, setModels] = useState<ModelOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadModels = useCallback(async () => {
    if (!provider) return;

    const cached = cache.get(provider);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      setModels(cached.models);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchModels(provider);

      const mapped: ModelOption[] = result.map((m) => {
        if (m.isPreset) {
          return {
            value: m.id,
            label: `🎛 ${m.name}`,
            isPreset: true,
            hasModelDetails: false,
            modelId: m.id,
            description: m.description,
          };
        }

        const id = m.id.replace(/^models\//, '');
        const known = KNOWN_MODEL_LABELS[id];
        const name = known ?? formatModelName(m.name, m.id);
        const cleanName = m.isFree ? stripFreeLabel(name) : name;
        return {
          value: m.id,
          label: m.isFree ? `💸 ${cleanName} (Free)` : name,
          isFree: m.isFree,
          hasModelDetails: true,
          modelId: id,
          description: m.description,
          contextLength: m.contextLength,
          pricing: m.pricing,
        };
      });

      const sorted = sortModelOptions(mapped);

      cache.set(provider, { models: sorted, timestamp: Date.now() });
      setModels(sorted);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('api.failedToFetchModels'));
    } finally {
      setIsLoading(false);
    }
  }, [provider]);

  useEffect(() => {
    setModels([]);
    setError(null);
    void loadModels();
  }, [loadModels]);

  const refresh = useCallback(() => {
    if (!provider) return;
    cache.delete(provider);
    setModels([]);
    setError(null);
    void loadModels();
  }, [provider, loadModels]);

  return { models, isLoading, error, refresh };
}
