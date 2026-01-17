import { OpenAIIcon, GeminiIcon, ClaudeIcon, OpenRouterIcon } from '@/components/icons';

export interface AiProvider {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description: string;
  apiKeyUrl: string;
  modelOptions: { value: string; label: string }[];
}

export const AI_PROVIDERS: Record<string, AiProvider> = {
  openai: {
    label: 'OpenAI',
    description: 'GPT models',
    icon: OpenAIIcon,
    apiKeyUrl: 'https://platform.openai.com/api-keys',
    modelOptions: [
      { value: 'gpt-4o', label: '🔥 GPT-4o (Latest & Smartest)' },
      { value: 'gpt-4-turbo', label: '🔥 GPT-4 Turbo (Fast & Smart)' },
      { value: 'gpt-4o-mini', label: '💸 GPT-4o Mini (Fast & Cheap)' },
      { value: 'gpt-4', label: '🏃‍♂️ GPT-4 (Legacy)' },
    ],
  },
  gemini: {
    label: 'Gemini',
    description: 'Google AI',
    icon: GeminiIcon,
    apiKeyUrl: 'https://aistudio.google.com/app/apikey',
    modelOptions: [
      { value: 'gemini-2.0-flash', label: '🔥 Gemini 2.0 Flash (Latest)' },
      { value: 'gemini-1.5-pro', label: '🔥 Gemini 1.5 Pro' },
      { value: 'gemini-1.5-flash', label: '💸 Gemini 1.5 Flash' },
    ],
  },
  claude: {
    label: 'Claude',
    description: 'Anthropic AI',
    icon: ClaudeIcon,
    apiKeyUrl: 'https://console.anthropic.com/',
    modelOptions: [
      { value: 'claude-opus-4-5-20251101', label: '🔥 Claude Opus 4.5 (Latest & Most Capable)' },
      { value: 'claude-haiku-4-5-20251001', label: '💸 Claude Haiku 4.5 (Fast & Cheap)' },
      { value: 'claude-sonnet-4-5-20250929', label: '🔥 Claude Sonnet 4.5' },
      { value: 'claude-opus-4-1-20250805', label: '🔥 Claude Opus 4.1' },
      { value: 'claude-opus-4-20250514', label: '🔥 Claude Opus 4' },
      { value: 'claude-sonnet-4-20250514', label: '🔥 Claude Sonnet 4' },
      { value: 'claude-3-haiku-20240307', label: '🏃‍♂️ Claude 3 Haiku (Legacy)' },
    ],
  },
  openrouter: {
    label: 'OpenRouter',
    description: 'Multiple Models',
    icon: OpenRouterIcon,
    apiKeyUrl: 'https://openrouter.ai/keys',
    modelOptions: [
      {
        value: 'meta-llama/llama-3.2-3b-instruct:free',
        label: '💸 Llama 3.2 3B (Free)',
      },
      { value: 'mistralai/mistral-7b-instruct:free', label: '💸 Mistral 7B (Free)' },
      {
        value: 'google/gemini-2.0-flash-exp:free',
        label: '💸 Gemini 2.0 Flash (Free)',
      },
      { value: 'qwen/qwen3-4b:free', label: '💸 Qwen3 4B (Free)' },
      { value: 'moonshotai/kimi-k2:free', label: '💸 Kimi K2 (Free)' },
      { value: 'deepseek/deepseek-r1-0528:free', label: '💸 DeepSeek R1 (Free)' },
      {
        value: 'mistralai/mistral-small-3.1-24b-instruct:free',
        label: '💸 Mistral Small 24B (Free)',
      },
      {
        value: 'meta-llama/llama-3.3-70b-instruct:free',
        label: '💸 Llama 3.3 70B (Free)',
      },
      { value: 'google/gemma-3-12b-it:free', label: '💸 Gemma 3 12B (Free)' },
      { value: 'openai/gpt-4o-mini', label: '🏃‍♂️ GPT-4o Mini' },
      { value: 'anthropic/claude-3-5-haiku-20241022', label: '💸 Claude 3.5 Haiku' },
      { value: 'anthropic/claude-3-5-sonnet-20241022', label: '🔥 Claude 3.5 Sonnet' },
      { value: 'meta-llama/llama-3.1-70b-instruct', label: '🔥 Llama 3.1 70B' },
      { value: 'openai/gpt-4o', label: '🔥 GPT-4o' },
    ],
  },
};
