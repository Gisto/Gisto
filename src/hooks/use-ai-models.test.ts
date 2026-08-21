import { describe, expect, it } from 'vitest';

import { includeSelectedModel, sortModelOptions, type ModelOption } from './use-ai-models.ts';

describe('sortModelOptions', () => {
  it('sorts presets first, then free and paid models', () => {
    const options: ModelOption[] = [
      { value: 'paid-b', label: 'Paid B' },
      { value: '@preset/z', label: 'Z preset', isPreset: true },
      { value: 'free-b', label: 'Free B', isFree: true },
      { value: '@preset/a', label: 'A preset', isPreset: true },
      { value: 'paid-a', label: 'Paid A' },
      { value: 'free-a', label: 'Free A', isFree: true },
    ];

    expect(sortModelOptions(options).map((option) => option.value)).toEqual([
      '@preset/a',
      '@preset/z',
      'free-b',
      'free-a',
      'paid-b',
      'paid-a',
    ]);
  });
});

describe('includeSelectedModel', () => {
  it('keeps an unavailable preset visible as the selected value', () => {
    const models: ModelOption[] = [{ value: 'openrouter/auto', label: 'Auto Router' }];

    expect(includeSelectedModel(models, '@preset/azure-credit-efficient')).toEqual([
      {
        value: '@preset/azure-credit-efficient',
        label: '@preset/azure-credit-efficient',
        modelId: '@preset/azure-credit-efficient',
        isPreset: true,
        hasModelDetails: false,
      },
      ...models,
    ]);
  });

  it('does not duplicate a selected catalog option', () => {
    const models: ModelOption[] = [{ value: 'openrouter/auto', label: 'Auto Router' }];

    expect(includeSelectedModel(models, 'openrouter/auto')).toBe(models);
  });
});
