import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { fetchMiniMaxModels, fetchOllamaModels, fetchOpenRouterModels } from './models-api.ts';

const mockSettings: {
  ai: Record<string, string | undefined>;
} = {
  ai: {
    minimaxApiKey: 'test-key',
  },
};

vi.mock('@/lib/store/globalState', () => ({
  globalState: {
    getState: () => ({
      settings: mockSettings,
    }),
  },
}));

describe('fetchOllamaModels', () => {
  beforeEach(() => {
    mockSettings.ai = { ollamaMode: 'local', model: '' };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches and maps models from a local Ollama server', async () => {
    mockSettings.ai = { ollamaMode: 'local' };
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          models: [{ model: 'llama3.2', name: 'llama3.2:latest' }],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    );

    await expect(fetchOllamaModels()).resolves.toEqual([
      { id: 'llama3.2', name: 'llama3.2:latest' },
    ]);
    expect(fetchSpy.mock.calls[0][0]).toBe('http://localhost:11434/v1/models');
    expect(fetchSpy.mock.calls[0][1]?.headers).toEqual({});
  });

  it('reads OpenAI-compatible listing and uses bearer auth for remote servers', async () => {
    mockSettings.ai = {
      ollamaMode: 'remote',
      ollamaBaseUrl: 'http://192.168.1.10:11434',
      ollamaApiKey: 'secret',
    };
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(
        new Response(JSON.stringify({ data: [{ id: 'qwen2.5' }, { id: 'mistral' }] }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

    await expect(fetchOllamaModels()).resolves.toEqual([
      { id: 'qwen2.5', name: 'qwen2.5' },
      { id: 'mistral', name: 'mistral' },
    ]);
    expect(fetchSpy.mock.calls[0][0]).toBe('http://192.168.1.10:11434/v1/models');
    expect(fetchSpy.mock.calls[0][1]?.headers).toEqual({ Authorization: 'Bearer secret' });
  });

  it('throws when the Ollama server is unreachable', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 500 }));

    await expect(fetchOllamaModels()).rejects.toThrow('Ollama API error: 500');
  });
});

describe('fetchMiniMaxModels', () => {
  beforeEach(() => {
    mockSettings.ai = { minimaxApiKey: 'test-key' };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.each([
    {
      name: 'global OpenAI-compatible',
      region: 'global_en',
      protocol: 'openai',
      endpoint: 'https://api.minimax.io/v1/models',
    },
    {
      name: 'China OpenAI-compatible',
      region: 'cn_zh',
      protocol: 'openai',
      endpoint: 'https://api.minimaxi.com/v1/models',
    },
    {
      name: 'global Anthropic-compatible',
      region: 'global_en',
      protocol: 'anthropic',
      endpoint: 'https://api.minimax.io/anthropic/v1/models',
    },
    {
      name: 'China Anthropic-compatible',
      region: 'cn_zh',
      protocol: 'anthropic',
      endpoint: 'https://api.minimaxi.com/anthropic/v1/models',
    },
  ])('fetches and maps models from the $name endpoint', async ({ region, protocol, endpoint }) => {
    mockSettings.ai = {
      minimaxApiKey: 'test-key',
      minimaxRegion: region,
      minimaxProtocol: protocol,
    };
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          data: [
            { id: 'MiniMax-M3', object: 'model', owned_by: 'minimax' },
            { id: 'MiniMax-M2.7', object: 'model', owned_by: 'minimax' },
          ],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    );

    await expect(fetchMiniMaxModels()).resolves.toEqual([
      { id: 'MiniMax-M3', name: 'MiniMax-M3' },
      { id: 'MiniMax-M2.7', name: 'MiniMax-M2.7' },
    ]);
    expect(fetchSpy.mock.calls[0][0]).toBe(endpoint);
    const headers = fetchSpy.mock.calls[0][1]?.headers as Record<string, string>;
    if (protocol === 'anthropic') {
      expect(headers['x-api-key']).toBe('test-key');
    } else {
      expect(headers.Authorization).toBe('Bearer test-key');
    }
  });

  it('does not call the API without a configured key', async () => {
    mockSettings.ai = { minimaxApiKey: '' };
    const fetchSpy = vi.spyOn(globalThis, 'fetch');

    await expect(fetchMiniMaxModels()).rejects.toThrow();
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});

describe('fetchOpenRouterModels', () => {
  beforeEach(() => {
    mockSettings.ai = { openRouterApiKey: 'test-key' };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('adds active presets before catalog models', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
      const url = String(input);

      if (url.endsWith('/models')) {
        return new Response(
          JSON.stringify({
            data: [
              {
                id: 'google/gemini-3.7-flash',
                name: 'Google: Gemini 3.7 Flash',
                context_length: 1000000,
                pricing: { prompt: 0.000000375, completion: 0.000001875 },
              },
            ],
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({
          data: [
            {
              slug: 'discounted-quality',
              name: 'Discounted Quality',
              description: 'Economical fallback route',
              status: 'active',
            },
            { slug: 'archived', name: 'Archived', status: 'archived' },
          ],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    });

    await expect(fetchOpenRouterModels()).resolves.toEqual([
      {
        id: '@preset/discounted-quality',
        name: 'Discounted Quality',
        description: 'Economical fallback route',
        isPreset: true,
      },
      {
        id: 'google/gemini-3.7-flash',
        name: 'Google: Gemini 3.7 Flash',
        description: undefined,
        contextLength: 1000000,
        pricing: { prompt: 0.000000375, completion: 0.000001875 },
        isFree: false,
      },
    ]);
    expect(fetchSpy).toHaveBeenCalledTimes(2);
    expect(fetchSpy.mock.calls[1][0]).toBe('https://openrouter.ai/api/v1/presets?limit=100');
    expect(fetchSpy.mock.calls[1][1]?.headers).toEqual({ Authorization: 'Bearer test-key' });
  });

  it('keeps catalog models when preset loading fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
      if (String(input).endsWith('/models')) {
        return new Response(JSON.stringify({ data: [{ id: 'openrouter/auto', name: 'Auto' }] }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      return new Response(null, { status: 403 });
    });

    await expect(fetchOpenRouterModels()).resolves.toEqual([
      {
        id: 'openrouter/auto',
        name: 'Auto',
        description: undefined,
        contextLength: undefined,
        pricing: undefined,
        isFree: false,
      },
    ]);
  });

  it('keeps catalog models when the preset request rejects', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
      if (String(input).endsWith('/models')) {
        return new Response(JSON.stringify({ data: [{ id: 'openrouter/auto', name: 'Auto' }] }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      throw new TypeError('Network error');
    });

    await expect(fetchOpenRouterModels()).resolves.toEqual([
      {
        id: 'openrouter/auto',
        name: 'Auto',
        description: undefined,
        contextLength: undefined,
        pricing: undefined,
        isFree: false,
      },
    ]);
  });

  it('does not request presets without an API key', async () => {
    mockSettings.ai = { openRouterApiKey: '' };
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ data: [{ id: 'openrouter/auto', name: 'Auto' }] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );

    await fetchOpenRouterModels();

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy.mock.calls[0][0]).toBe('https://openrouter.ai/api/v1/models');
    expect(fetchSpy.mock.calls[0][1]?.headers).toEqual({});
  });
});
