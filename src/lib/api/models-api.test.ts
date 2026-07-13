import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { fetchMiniMaxModels } from './models-api.ts';

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
