import { globalState } from '../store/globalState.ts';

import { resolveMiniMaxEndpoint } from '@/constants/minimax-endpoints.ts';

const GEMINI_ENDPOINT =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const OPENROUTER_ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';
const OPENAI_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
const CLAUDE_ENDPOINT = 'https://api.anthropic.com/v1/messages';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface GenerateAiResponseOptions {
  prompt: string;
  messages?: ChatMessage[];
  systemContext?: string;
  model?: string;
  temperature?: number;
  activeAiProvider?: 'openrouter' | 'gemini' | 'openai' | 'claude' | 'minimax';
}

type AiProvider = NonNullable<GenerateAiResponseOptions['activeAiProvider']>;
type AiApiKeyField =
  | 'openRouterApiKey'
  | 'geminiApiKey'
  | 'openaiApiKey'
  | 'claudeApiKey'
  | 'minimaxApiKey';

const AI_PROVIDER_API_KEYS: Record<AiProvider, AiApiKeyField> = {
  openrouter: 'openRouterApiKey',
  gemini: 'geminiApiKey',
  openai: 'openaiApiKey',
  claude: 'claudeApiKey',
  minimax: 'minimaxApiKey',
};

type OpenAiChatResponse = {
  choices?: Array<{ message?: { content?: string } }>;
};

type OpenRouterChatResponse = OpenAiChatResponse;

type GeminiResponse = {
  candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
};

type AnthropicChatResponse = {
  content?: Array<{ type?: string; text?: string }>;
};

export class AiApiError extends Error {
  constructor(
    message: string,
    public readonly provider: GenerateAiResponseOptions['activeAiProvider'],
    public readonly statusCode?: number
  ) {
    super(message);
    this.name = 'AiApiError';
  }
}

/**
 * Check if an AI provider is available (has a configured API key)
 */
export function isAiAvailable(): boolean {
  const { ai } = globalState.getState().settings;

  const activeAiProvider = (ai.activeAiProvider || 'openrouter') as AiProvider;
  const apiKey = ai[AI_PROVIDER_API_KEYS[activeAiProvider]] || '';

  return Boolean(apiKey);
}

type ApiMessage = { role: 'user' | 'assistant' | 'system'; content: string };

export function buildMessages(
  prompt: string,
  messages?: ChatMessage[],
  systemContext?: string
): ApiMessage[] {
  const base: ApiMessage[] =
    messages && messages.length > 0
      ? messages.map((m) => ({ role: m.role as ApiMessage['role'], content: m.content }))
      : [{ role: 'user', content: prompt }];
  if (systemContext) {
    base.unshift({ role: 'system', content: systemContext });
  }
  return base;
}

function buildGeminiMessages(prompt: string, messages?: ChatMessage[], systemContext?: string) {
  const base =
    messages && messages.length > 0
      ? messages.map((m) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        }))
      : [{ parts: [{ text: prompt }] }];
  if (systemContext) {
    base.unshift({ role: 'user', parts: [{ text: systemContext }] });
  }
  return base;
}

export async function generateAiResponse(options: GenerateAiResponseOptions): Promise<string> {
  const {
    prompt,
    messages: chatMessages,
    systemContext,
    model: overrideModel,
    temperature: overrideTemperature,
  } = options;

  const { ai } = globalState.getState().settings;
  const model = overrideModel ?? ai.model;
  const temperature = overrideTemperature ?? ai.temperature;

  // Get the active provider and its API key
  const activeAiProvider = (ai.activeAiProvider || 'openrouter') as AiProvider;
  const apiKey = ai[AI_PROVIDER_API_KEYS[activeAiProvider]] || '';
  const minimaxEndpoint =
    activeAiProvider === 'minimax'
      ? resolveMiniMaxEndpoint(ai.minimaxRegion, ai.minimaxProtocol)
      : null;

  if (!apiKey) {
    throw new AiApiError(
      `No API key provided for ${activeAiProvider}. Please add your ${activeAiProvider.charAt(0).toUpperCase() + activeAiProvider.slice(1)} API key in Settings > AI Assistant.`,
      activeAiProvider as GenerateAiResponseOptions['activeAiProvider']
    );
  }

  let rawResponse: string;

  const parseErrorMessage = (response: Response, errorBody: unknown) =>
    (errorBody as { error?: { message?: string } } | null)?.error?.message ||
    `HTTP ${response.status} ${response.statusText}`;

  const parseJsonResponse = async <T>(response: Response, provider: AiProvider): Promise<T> => {
    if (!response.ok) {
      const errorBody = await response.json().catch(() => null);
      const message = parseErrorMessage(response, errorBody);
      throw new AiApiError(message, provider, response.status);
    }

    return response.json();
  };

  if (activeAiProvider === 'openrouter') {
    const response = await fetch(OPENROUTER_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Gisto',
      },
      body: JSON.stringify({
        model,
        messages: buildMessages(prompt, chatMessages, systemContext),
        temperature,
      }),
    });

    const res = await parseJsonResponse<OpenRouterChatResponse>(response, 'openrouter');
    rawResponse = res.choices?.[0]?.message?.content ?? '';
  } else if (
    activeAiProvider === 'openai' ||
    (activeAiProvider === 'minimax' && minimaxEndpoint?.protocol === 'openai')
  ) {
    const endpoint =
      activeAiProvider === 'minimax' && minimaxEndpoint ? minimaxEndpoint.chatUrl : OPENAI_ENDPOINT;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: buildMessages(prompt, chatMessages, systemContext),
        temperature,
      }),
    });

    const res = await parseJsonResponse<OpenAiChatResponse>(response, activeAiProvider);
    rawResponse = res.choices?.[0]?.message?.content ?? '';
  } else if (activeAiProvider === 'gemini') {
    const response = await fetch(GEMINI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: buildGeminiMessages(prompt, chatMessages, systemContext),
      }),
    });

    const res = await parseJsonResponse<GeminiResponse>(response, 'gemini');
    rawResponse = res.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  } else if (
    activeAiProvider === 'claude' ||
    (activeAiProvider === 'minimax' && minimaxEndpoint?.protocol === 'anthropic')
  ) {
    const anthropicMessages = buildMessages(prompt, chatMessages, systemContext);
    const anthropicSystem =
      anthropicMessages
        .filter((m) => m.role === 'system')
        .map((m) => m.content)
        .join('\n') || undefined;
    const anthropicBody: Record<string, unknown> = {
      model,
      max_tokens: 4096,
      messages: anthropicMessages.filter((m) => m.role !== 'system'),
      temperature,
    };
    if (anthropicSystem) {
      anthropicBody.system = anthropicSystem;
    }
    const endpoint =
      activeAiProvider === 'minimax' && minimaxEndpoint ? minimaxEndpoint.chatUrl : CLAUDE_ENDPOINT;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(anthropicBody),
    });

    const res = await parseJsonResponse<AnthropicChatResponse>(response, activeAiProvider);
    rawResponse =
      res.content?.find((block) => block.type === 'text')?.text ??
      res.content?.find((block) => block.text)?.text ??
      '';
  } else {
    throw new AiApiError('Invalid AI provider configured.', activeAiProvider);
  }

  // Always clean JSON responses to handle any markdown formatting from AI
  rawResponse = rawResponse
    .trim()
    .replace(/^```json\s*/i, '')
    .replace(/```$/, '')
    .trim();

  return rawResponse;
}
