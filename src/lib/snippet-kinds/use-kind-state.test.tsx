import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useKindState } from './use-kind-state.ts';

describe('useKindState', () => {
  it('parses the initial value and re-derives it when the source changes', () => {
    const parse = vi.fn((content: string) => content.toUpperCase());
    const { result, rerender } = renderHook(
      ({ content, id }: { content: string; id: string }) => useKindState(content, id, parse),
      { initialProps: { content: 'a', id: 'one' } }
    );

    expect(result.current[0]).toBe('A');
    expect(parse).toHaveBeenCalledTimes(1);

    rerender({ content: 'a', id: 'one' });
    expect(parse).toHaveBeenCalledTimes(1);

    rerender({ content: 'b', id: 'two' });
    expect(result.current[0]).toBe('B');
    expect(parse).toHaveBeenCalledTimes(2);
  });

  it('exposes a setter for local edits', () => {
    const { result } = renderHook(() => useKindState('a', 'one', (value: string) => value));

    act(() => result.current[1]('local'));

    expect(result.current[0]).toBe('local');
  });

  it('does not reseed when the same content identity is passed again', () => {
    const parse = vi.fn((content: string) => content);
    const { result, rerender } = renderHook(
      ({ content }: { content: string }) => useKindState(content, 'one', parse),
      { initialProps: { content: 'a' } }
    );

    const first = result.current[0];
    rerender({ content: 'a' });

    expect(result.current[0]).toBe(first);
  });
});
