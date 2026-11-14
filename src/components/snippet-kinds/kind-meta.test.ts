import {
  KIND_META,
  getKindMeta,
  kindEmptyErrorKey,
  kindLabelKey,
  structuredKinds,
} from './kind-meta.ts';

import { SNIPPET_KINDS } from '@/types/snippet.ts';

describe('KIND_META', () => {
  it('has an entry for every snippet kind', () => {
    SNIPPET_KINDS.forEach((kind) => {
      expect(KIND_META[kind]).toBeDefined();
    });
  });

  it('exposes label and error keys for every kind', () => {
    structuredKinds().forEach((kind) => {
      const meta = getKindMeta(kind);

      expect(meta.labelKey).toBeTruthy();
      expect(meta.emptyErrorKey).toBeTruthy();
      expect(meta.emptyErrorKey.startsWith('pages.new.')).toBe(true);
    });
  });

  it('marks only structured kinds as having a data file', () => {
    expect(getKindMeta('snippet').filename).toBeUndefined();
    structuredKinds().forEach((kind) => {
      expect(getKindMeta(kind).filename).toBeTruthy();
    });
  });

  it('uses a wider layout for board-like editors', () => {
    expect(getKindMeta('kanban').wide).toBe(true);
    expect(getKindMeta('doc').wide).toBe(true);
    expect(getKindMeta('snippet').wide).toBe(false);
  });

  it('lists the ordered-capable kind', () => {
    expect(getKindMeta('doc').supportsOrdering).toBe(true);
    expect(getKindMeta('todo').supportsOrdering).toBeFalsy();
  });

  it('keeps kind order stable for rendering tabs', () => {
    expect(structuredKinds()).toEqual(['todo', 'kanban', 'doc', 'flashcards']);
  });

  it('exposes label and empty-error keys by kind', () => {
    expect(kindLabelKey('kanban')).toBe('common.kanban');
    expect(kindEmptyErrorKey('flashcards')).toBe('pages.new.flashcardsEmptyError');
  });

  it('gives every kind an icon component', () => {
    SNIPPET_KINDS.forEach((kind) => {
      expect(KIND_META[kind].icon).toBeTruthy();
    });
  });
});
