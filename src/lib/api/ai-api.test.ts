import { describe, it, expect, vi, beforeEach } from 'vitest';

import { buildMessages, generateAiResponse, AiApiError } from './ai-api.ts';

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

  it('sends requests to the MiniMax OpenAI-compatible endpoint', async () => {
    mockSettings.ai = {
      activeAiProvider: 'minimax',
      minimaxApiKey: 'test-key',
      model: 'MiniMax-M3',
      temperature: 0.7,
    };

    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ choices: [{ message: { content: 'MiniMax response' } }] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );

    const result = await generateAiResponse({ prompt: 'hello' });

    expect(result).toBe('MiniMax response');
    expect(fetchSpy.mock.calls[0][0]).toBe('https://api.minimax.io/v1/chat/completions');
    const callBody = JSON.parse(fetchSpy.mock.calls[0][1]?.body as string);
    expect(callBody.model).toBe('MiniMax-M3');

    fetchSpy.mockRestore();
  });

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
});
