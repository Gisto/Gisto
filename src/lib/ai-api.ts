import { globalState } from './store/globalState.ts';

const GEMINI_ENDPOINT =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const OPENROUTER_ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';
const OPENAI_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

export interface GenerateAiResponseOptions {
  prompt: string;
  model?: string;
  temperature?: number;
  activeAiProvider?: 'openrouter' | 'gemini' | 'openai';
}

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

  const activeAiProvider = ai.activeAiProvider || 'openrouter';
  let apiKey = '';

  if (activeAiProvider === 'openai') {
    apiKey = ai.openaiApiKey || '';
  } else if (activeAiProvider === 'gemini') {
    apiKey = ai.geminiApiKey || '';
  } else {
    apiKey = ai.openRouterApiKey || '';
  }

  return !!apiKey;
}

export async function generateAiResponse(options: GenerateAiResponseOptions): Promise<string> {
  const { prompt, model: overrideModel, temperature: overrideTemperature } = options;

  const { ai } = globalState.getState().settings;
  const model = overrideModel ?? ai.model;
  const temperature = overrideTemperature ?? ai.temperature;

  // Get the active provider and its API key
  const activeAiProvider = ai.activeAiProvider || 'openrouter';
  let apiKey = '';

  if (activeAiProvider === 'openai') {
    apiKey = ai.openaiApiKey || '';
  } else if (activeAiProvider === 'gemini') {
    apiKey = ai.geminiApiKey || '';
  } else {
    apiKey = ai.openRouterApiKey || '';
  }

  if (!apiKey) {
    throw new AiApiError(
      `No API key provided for ${activeAiProvider}. Please add your ${activeAiProvider.charAt(0).toUpperCase() + activeAiProvider.slice(1)} API key in Settings > AI Assistant.`,
      activeAiProvider as GenerateAiResponseOptions['activeAiProvider']
    );
  }

  let response: Response;
  let rawResponse: string;

  if (activeAiProvider === 'openrouter') {
    response = await fetch(OPENROUTER_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Gisto',
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null);
      const message = errorBody?.error?.message || `HTTP ${response.status} ${response.statusText}`;

      throw new AiApiError(message, 'openrouter', response.status);
    }

    const res = await response.json();
    rawResponse = res.choices?.[0]?.message?.content ?? '';
  } else if (activeAiProvider === 'openai') {
    response = await fetch(OPENAI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null);
      const message = errorBody?.error?.message || `HTTP ${response.status} ${response.statusText}`;

      throw new AiApiError(message, 'openai', response.status);
    }

    const res = await response.json();
    rawResponse = res.choices?.[0]?.message?.content ?? '';
  } else if (activeAiProvider === 'gemini') {
    response = await fetch(GEMINI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null);
      const message = errorBody?.error?.message || `HTTP ${response.status} ${response.statusText}`;

      throw new AiApiError(message, 'gemini', response.status);
    }

    const res = await response.json();
    rawResponse = res.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  } else {
    throw new AiApiError('Invalid AI provider configured.', 'openrouter');
  }

  // Always clean JSON responses to handle any markdown formatting from AI
  rawResponse = rawResponse
    .trim()
    .replace(/^```json\s*/i, '')
    .replace(/```$/, '')
    .trim();

  return rawResponse;
}
