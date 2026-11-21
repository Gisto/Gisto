import { globalState } from '@/lib/store/globalState.ts';

/**
 * Settings-backed feature flags. Every flag is off by default so unfinished
 * features stay hidden until they are explicitly opted into.
 */
export const isSpecialSnippetKindsEnabled = (): boolean =>
  globalState.getState().settings.specialSnippetKinds === true;
