import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useKindSaver } from './use-kind-saver.ts';

import { snippetService } from '@/lib/providers/snippet-service.ts';
import { SnippetFileType, SnippetSingleType } from '@/types/snippet.ts';

vi.mock('@/lib/providers/snippet-service.ts', () => ({
  snippetService: { updateSnippet: vi.fn() },
}));

const updateSnippet = vi.mocked(snippetService.updateSnippet);

const file = (filename: string, content: string): SnippetFileType =>
  ({ filename, content }) as unknown as SnippetFileType;

const snippet = (files: Record<string, SnippetFileType>): SnippetSingleType =>
  ({
    id: 'snippet-1',
    description: 'desc',
    files,
  }) as unknown as SnippetSingleType;

describe('useKindSaver', () => {
  beforeEach(() => {
    updateSnippet.mockReset();
    updateSnippet.mockResolvedValue({ id: 'snippet-1' } as never);
  });

  it('persists the kind file and reports the saved content', async () => {
    const onUpdated = vi.fn();
    const current = snippet({
      'doc.md': file('doc.md', 'old'),
      'notes.md': file('notes.md', 'keep'),
    });

    const { result } = renderHook(() => useKindSaver(current, 'doc', onUpdated));

    await act(async () => {
      await result.current.save('new', 'err');
    });

    expect(updateSnippet).toHaveBeenCalledWith({
      snippetId: 'snippet-1',
      files: { 'doc.md': { content: 'new' }, 'notes.md': { content: 'keep' } },
      description: 'desc',
    });
    expect(onUpdated).toHaveBeenCalledWith('new');
  });

  it('reports success and clears the saving flag', async () => {
    const { result } = renderHook(() =>
      useKindSaver(snippet({ 'todo.md': file('todo.md', '') }), 'todo', vi.fn())
    );

    await act(async () => {
      await expect(result.current.save('- [ ] a', 'err')).resolves.toBe(true);
    });
    expect(result.current.saving).toBe(false);
  });

  it('returns false and keeps the previous state when the save fails', async () => {
    updateSnippet.mockRejectedValue(new Error('offline'));
    const onUpdated = vi.fn();
    const current = snippet({ 'kanban.json': file('kanban.json', 'old') });

    const { result } = renderHook(() => useKindSaver(current, 'kanban', onUpdated));

    await act(async () => {
      await expect(result.current.save('new', 'err')).resolves.toBe(false);
    });
    expect(onUpdated).not.toHaveBeenCalled();
    expect(result.current.saving).toBe(false);
  });

  it('writes the data file even when the snippet has no kind file yet', async () => {
    const current = snippet({ 'notes.md': file('notes.md', 'keep') });
    const { result } = renderHook(() => useKindSaver(current, 'flashcards', vi.fn()));

    await act(async () => {
      await result.current.save('{"cards":[]}', 'err');
    });

    const files = updateSnippet.mock.calls[0][0].files as Record<string, { content: string }>;
    expect(files['cards.json']).toEqual({ content: '{"cards":[]}' });
  });
});
