import { describe, it, expect, vi, beforeEach } from 'vitest';

import { buildMessages, generateAiResponse, isAiAvailable, AiApiError } from './ai-api.ts';

const mockSettings: {
  ai: Record<string, string | number | undefined>;
} = {
  ai: {
    activeAiProvider: 'openrouter',
    openRouterApiKey: 'test-key',
    model: 'test-model',
    temperature: 0.7,
  },
};

vi.mock('@/lib/store/globalState', () => ({
  globalState: {
    getState: () => ({
      settings: mockSettings,
    }),
  },
}));

describe('buildMessages', () => {
  it('returns a single user message when no messages or context provided', () => {
    const result = buildMessages('hello');
    expect(result).toEqual([{ role: 'user', content: 'hello' }]);
  });

  it('maps ChatMessage array to ApiMessage array', () => {
    const messages = [
      { role: 'user' as const, content: 'hi' },
      { role: 'assistant' as const, content: 'hello there' },
    ];
    const result = buildMessages('', messages);
    expect(result).toEqual([
      { role: 'user', content: 'hi' },
      { role: 'assistant', content: 'hello there' },
    ]);
  });

  it('prepends system context when provided', () => {
    const messages = [{ role: 'user' as const, content: 'tell me about this code' }];
    const result = buildMessages('', messages, 'Snippet: foo.js\nconsole.log("hello")');
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      role: 'system',
      content: 'Snippet: foo.js\nconsole.log("hello")',
    });
    expect(result[1]).toEqual({ role: 'user', content: 'tell me about this code' });
  });

  it('prepends system context even without messages', () => {
    const result = buildMessages('hello', undefined, 'System context');
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ role: 'system', content: 'System context' });
    expect(result[1]).toEqual({ role: 'user', content: 'hello' });
  });

  it('preserves order: system context first, then original messages', () => {
    const messages = [
      { role: 'system' as const, content: 'original system' },
      { role: 'user' as const, content: 'user msg' },
    ];
    const result = buildMessages('', messages, 'new context');
    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({ role: 'system', content: 'new context' });
    expect(result[1]).toEqual({ role: 'system', content: 'original system' });
    expect(result[2]).toEqual({ role: 'user', content: 'user msg' });
  });
});

describe('generateAiResponse', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSettings.ai = {
      activeAiProvider: 'openrouter',
      openRouterApiKey: 'test-key',
      model: 'test-model',
      temperature: 0.7,
    };
  });

  it('throws AiApiError when no API key is configured', async () => {
    mockSettings.ai.openRouterApiKey = '';

    await expect(generateAiResponse({ prompt: 'hello' })).rejects.toThrow(AiApiError);
  });

  it('sends message history to OpenRouter', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ choices: [{ message: { content: 'Hi back' } }] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );

    const messages = [
      { role: 'user' as const, content: 'first message' },
      { role: 'assistant' as const, content: 'first response' },
    ];

    const result = await generateAiResponse({ prompt: 'second message', messages });

    expect(result).toBe('Hi back');
    const callBody = JSON.parse(fetchSpy.mock.calls[0][1]?.body as string);
    expect(callBody.messages).toHaveLength(2);
    expect(callBody.messages[0]).toEqual({ role: 'user', content: 'first message' });
    expect(callBody.messages[1]).toEqual({ role: 'assistant', content: 'first response' });

    fetchSpy.mockRestore();
  });

  it('includes system context as system message for OpenRouter', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ choices: [{ message: { content: 'ok' } }] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );

    await generateAiResponse({
      prompt: 'hello',
      systemContext: 'Snippet title: My Code',
    });

    const callBody = JSON.parse(fetchSpy.mock.calls[0][1]?.body as string);
    expect(callBody.messages).toHaveLength(2);
    expect(callBody.messages[0]).toEqual({
      role: 'system',
      content: 'Snippet title: My Code',
    });
    expect(callBody.messages[1]).toEqual({ role: 'user', content: 'hello' });

    fetchSpy.mockRestore();
  });

  it('sends system as separate field for Claude', async () => {
    mockSettings.ai = {
      activeAiProvider: 'claude',
      claudeApiKey: 'sk-ant-test',
      model: 'claude-3-opus',
      temperature: 0.7,
    };

    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ content: [{ text: 'Understood.' }] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );

    await generateAiResponse({
      prompt: 'analyze this',
      systemContext: 'Code context here',
    });

    const callBody = JSON.parse(fetchSpy.mock.calls[0][1]?.body as string);
    expect(callBody.system).toBe('Code context here');
    expect(callBody.messages).toHaveLength(1);
    expect(callBody.messages[0].role).toBe('user');

    fetchSpy.mockRestore();
  });

  it.each([
    {
      name: 'global OpenAI-compatible',
      region: 'global_en',
      protocol: 'openai',
      endpoint: 'https://api.minimax.io/v1/chat/completions',
    },
    {
      name: 'China OpenAI-compatible',
      region: 'cn_zh',
      protocol: 'openai',
      endpoint: 'https://api.minimaxi.com/v1/chat/completions',
    },
    {
      name: 'global Anthropic-compatible',
      region: 'global_en',
      protocol: 'anthropic',
      endpoint: 'https://api.minimax.io/anthropic/v1/messages',
    },
    {
      name: 'China Anthropic-compatible',
      region: 'cn_zh',
      protocol: 'anthropic',
      endpoint: 'https://api.minimaxi.com/anthropic/v1/messages',
    },
  ])(
    'routes MiniMax requests through the $name endpoint',
    async ({ region, protocol, endpoint }) => {
      mockSettings.ai = {
        activeAiProvider: 'minimax',
        minimaxApiKey: 'test-key',
        minimaxRegion: region,
        minimaxProtocol: protocol,
        model: 'MiniMax-M3',
        temperature: 0.7,
      };

      const responseBody =
        protocol === 'anthropic'
          ? {
              content: [
                { type: 'thinking', thinking: 'Internal reasoning' },
                { type: 'text', text: 'MiniMax response' },
              ],
            }
          : { choices: [{ message: { content: 'MiniMax response' } }] };
      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
        new Response(JSON.stringify(responseBody), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const result = await generateAiResponse({
        prompt: 'hello',
        systemContext: 'Follow the requested format.',
      });

      expect(result).toBe('MiniMax response');
      expect(fetchSpy.mock.calls[0][0]).toBe(endpoint);
      const request = fetchSpy.mock.calls[0][1];
      const headers = request?.headers as Record<string, string>;
      const callBody = JSON.parse(request?.body as string);
      expect(callBody.model).toBe('MiniMax-M3');
      if (protocol === 'anthropic') {
        expect(headers['x-api-key']).toBe('test-key');
        expect(callBody.system).toBe('Follow the requested format.');
        expect(callBody.max_tokens).toBe(4096);
      } else {
        expect(headers.Authorization).toBe('Bearer test-key');
        expect(callBody.messages[0]).toEqual({
          role: 'system',
          content: 'Follow the requested format.',
        });
      }

      fetchSpy.mockRestore();
    }
  );

  it('cleans JSON code fences from response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({ choices: [{ message: { content: '```json\n{"key": "value"}\n```' } }] }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    );

    const result = await generateAiResponse({ prompt: 'generate json' });
    expect(result).toBe('{"key": "value"}');
  });

  it('routes OpenAI-compatible requests to the local Ollama server', async () => {
    mockSettings.ai = {
      activeAiProvider: 'ollama',
      ollamaMode: 'local',
      model: 'llama3.2',
      temperature: 0.7,
    };

    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ choices: [{ message: { content: 'Local response' } }] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );

    const result = await generateAiResponse({ prompt: 'hello', systemContext: 'Be concise.' });

    expect(result).toBe('Local response');
    expect(fetchSpy.mock.calls[0][0]).toBe('http://localhost:11434/v1/chat/completions');
    const request = fetchSpy.mock.calls[0][1];
    let headers: Record<string, string>;
    if (request && typeof request === 'object' && 'headers' in request) {
      headers = (request as { headers: Record<string, string> }).headers;
    } else {
      headers = {};
    }
    expect(headers.Authorization).toBeUndefined();
    const callBody = JSON.parse(request?.body as string);
    expect(callBody.model).toBe('llama3.2');
    expect(callBody.messages[0]).toEqual({ role: 'system', content: 'Be concise.' });

    fetchSpy.mockRestore();
  });

  it('routes OpenAI-compatible requests to a remote Ollama server', async () => {
    mockSettings.ai = {
      activeAiProvider: 'ollama',
      ollamaMode: 'remote',
      ollamaBaseUrl: 'http://192.168.1.10:11434/',
      ollamaApiKey: 'optional-token',
      model: 'llama3.1',
      temperature: 0.7,
    };

    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ choices: [{ message: { content: 'Remote response' } }] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );

    const result = await generateAiResponse({ prompt: 'hello' });

    expect(result).toBe('Remote response');
    expect(fetchSpy.mock.calls[0][0]).toBe('http://192.168.1.10:11434/v1/chat/completions');
    const headers = fetchSpy.mock.calls[0][1]?.headers as Record<string, string>;
    expect(headers.Authorization).toBe('Bearer optional-token');

    fetchSpy.mockRestore();
  });

  it('does not require an API key for Ollama', async () => {
    mockSettings.ai = {
      activeAiProvider: 'ollama',
      ollamaMode: 'local',
      model: 'llama3.2',
      temperature: 0.7,
    };

    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ choices: [{ message: { content: 'ok' } }] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );

    await expect(generateAiResponse({ prompt: 'hello' })).resolves.toBe('ok');
  });
});

describe('isAiAvailable', () => {
  beforeEach(() => {
    mockSettings.ai = {
      activeAiProvider: 'openrouter',
      openRouterApiKey: 'test-key',
      model: 'test-model',
      temperature: 0.7,
    };
  });

  it('returns false without a configured API key', () => {
    mockSettings.ai = { activeAiProvider: 'openrouter', openRouterApiKey: '' };
    expect(isAiAvailable()).toBe(false);
  });

  it('returns true when an API key is configured', () => {
    expect(isAiAvailable()).toBe(true);
  });

  it('returns true for Ollama even without an API key', () => {
    mockSettings.ai = { activeAiProvider: 'ollama', ollamaMode: 'local' };
    expect(isAiAvailable()).toBe(true);
  });
});
