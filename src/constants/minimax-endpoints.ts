export type MiniMaxRegion = 'global_en' | 'cn_zh';
export type MiniMaxProtocol = 'openai' | 'anthropic';

export const MINIMAX_REGION_OPTIONS: { value: MiniMaxRegion; label: string }[] = [
  { value: 'global_en', label: 'Global' },
  { value: 'cn_zh', label: 'China' },
];

export const MINIMAX_PROTOCOL_OPTIONS: { value: MiniMaxProtocol; label: string }[] = [
  { value: 'openai', label: 'OpenAI-compatible' },
  { value: 'anthropic', label: 'Anthropic-compatible' },
];

const MINIMAX_BASE_URLS: Record<MiniMaxRegion, Record<MiniMaxProtocol, string>> = {
  global_en: {
    openai: 'https://api.minimax.io/v1',
    anthropic: 'https://api.minimax.io/anthropic',
  },
  cn_zh: {
    openai: 'https://api.minimaxi.com/v1',
    anthropic: 'https://api.minimaxi.com/anthropic',
  },
};

function isMiniMaxRegion(value: unknown): value is MiniMaxRegion {
  return value === 'global_en' || value === 'cn_zh';
}

function isMiniMaxProtocol(value: unknown): value is MiniMaxProtocol {
  return value === 'openai' || value === 'anthropic';
}

export function resolveMiniMaxEndpoint(region: unknown, protocol: unknown) {
  const resolvedRegion = isMiniMaxRegion(region) ? region : 'global_en';
  const resolvedProtocol = isMiniMaxProtocol(protocol) ? protocol : 'openai';
  const baseUrl = MINIMAX_BASE_URLS[resolvedRegion][resolvedProtocol];

  return {
    region: resolvedRegion,
    protocol: resolvedProtocol,
    baseUrl,
    chatUrl:
      resolvedProtocol === 'anthropic' ? `${baseUrl}/v1/messages` : `${baseUrl}/chat/completions`,
    modelsUrl: resolvedProtocol === 'anthropic' ? `${baseUrl}/v1/models` : `${baseUrl}/models`,
  };
}
