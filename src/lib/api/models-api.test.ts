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

  it('fetches and maps models from the OpenAI-compatible endpoint', async () => {
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
    expect(fetchSpy).toHaveBeenCalledWith('https://api.minimax.io/v1/models', {
      headers: { Authorization: 'Bearer test-key' },
    });
  });

  it('does not call the API without a configured key', async () => {
    mockSettings.ai = { minimaxApiKey: '' };
    const fetchSpy = vi.spyOn(globalThis, 'fetch');

    await expect(fetchMiniMaxModels()).rejects.toThrow();
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
