import { beforeEach, describe, expect, it } from 'vitest';

import { isSpecialSnippetKindsEnabled } from './feature-flags.ts';
import { getVisibleSnippetKind } from './snippet-kinds/manifest.ts';

import { globalState } from '@/lib/store/globalState.ts';
import { SnippetFileType } from '@/types/snippet.ts';

const manifest = (content: string): Record<string, SnippetFileType> =>
  ({
    '.config-manifest.json': { filename: '.config-manifest.json', content },
  }) as unknown as Record<string, SnippetFileType>;

const setFlag = (enabled: boolean) =>
  globalState.setState({
    settings: { ...globalState.getState().settings, specialSnippetKinds: enabled },
  });

describe('feature flags', () => {
  beforeEach(() => {
    setFlag(false);
  });

  it('is disabled by default', () => {
    setFlag(false);

    expect(isSpecialSnippetKindsEnabled()).toBe(false);
  });

  it('is enabled once the setting is on', () => {
    setFlag(true);

    expect(isSpecialSnippetKindsEnabled()).toBe(true);
  });
});

describe('getVisibleSnippetKind', () => {
  beforeEach(() => {
    setFlag(false);
  });

  it('hides structured kinds while the flag is off', () => {
    expect(getVisibleSnippetKind(manifest('{"type":"todo"}'))).toBe('snippet');
    expect(getVisibleSnippetKind(manifest('{"type":"kanban"}'))).toBe('snippet');
    expect(getVisibleSnippetKind(manifest('{"type":"doc"}'))).toBe('snippet');
    expect(getVisibleSnippetKind(manifest('{"type":"flashcards"}'))).toBe('snippet');
  });

  it('exposes structured kinds once the flag is on', () => {
    setFlag(true);

    expect(getVisibleSnippetKind(manifest('{"type":"todo"}'))).toBe('todo');
    expect(getVisibleSnippetKind(manifest('{"type":"doc"}'))).toBe('doc');
    expect(getVisibleSnippetKind({})).toBe('snippet');
  });
});
