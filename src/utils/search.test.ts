import { describe, it, expect } from 'vitest';

import { searchFilter, getAllTags, getAllLanguages } from './search.ts';

import { SnippetEnrichedType } from '@/types/snippet.ts';

describe('searchFilter', () => {
  it('returns all snippets when search is empty', () => {
    const snippets = [
      { title: 'Snippet 1', tags: [], languages: [], starred: false, isPublic: true, files: [] },
    ] as unknown as SnippetEnrichedType[];
    expect(searchFilter('', snippets)).toEqual(snippets);
  });

  it('filters snippets by tag', () => {
    const snippets = [
      {
        title: 'Snippet 1',
        tags: ['#tag1'],
        languages: [],
        starred: false,
        isPublic: true,
        files: [],
      },
      {
        title: 'Snippet 2',
        tags: ['#tag2'],
        languages: [],
        starred: false,
        isPublic: true,
        files: [],
      },
    ] as unknown as SnippetEnrichedType[];
    expect(searchFilter('tag:tag1', snippets)).toEqual([snippets[0]]);
  });

  it('filters snippets by language', () => {
    const snippets = [
      {
        title: 'Snippet 1',
        tags: [],
        languages: [{ name: 'JavaScript' }],
        starred: false,
        isPublic: true,
        files: [],
      },
      {
        title: 'Snippet 2',
        tags: [],
        languages: [{ name: 'TypeScript' }],
        starred: false,
        isPublic: true,
        files: [],
      },
    ] as unknown as SnippetEnrichedType[];
    expect(searchFilter('lang:javascript', snippets)).toEqual([snippets[0]]);
  });

  it('filters starred snippets', () => {
    const snippets = [
      { title: 'Snippet 1', tags: [], languages: [], starred: true, isPublic: true, files: [] },
      { title: 'Snippet 2', tags: [], languages: [], starred: false, isPublic: true, files: [] },
    ] as unknown as SnippetEnrichedType[];
    expect(searchFilter('is:starred', snippets)).toEqual([snippets[0]]);
  });

  it('filters untagged snippets', () => {
    const snippets = [
      { title: 'Snippet 1', tags: [], languages: [], starred: false, isPublic: true, files: [] },
      {
        title: 'Snippet 2',
        tags: ['#tag1'],
        languages: [],
        starred: false,
        isPublic: true,
        files: [],
      },
    ] as unknown as SnippetEnrichedType[];
    expect(searchFilter('is:untagged', snippets)).toEqual([snippets[0]]);
  });

  it('filters private snippets', () => {
    const snippets = [
      { title: 'Snippet 1', tags: [], languages: [], starred: false, isPublic: false, files: [] },
      { title: 'Snippet 2', tags: [], languages: [], starred: false, isPublic: true, files: [] },
    ] as unknown as SnippetEnrichedType[];
    expect(searchFilter('is:private', snippets)).toEqual([snippets[0]]);
  });

  it('filters snippets by title', () => {
    const snippets = [
      {
        title: 'JavaScript Snippet',
        tags: [],
        languages: [],
        starred: false,
        isPublic: true,
        files: [],
      },
      {
        title: 'TypeScript Snippet',
        tags: [],
        languages: [],
        starred: false,
        isPublic: true,
        files: [],
      },
    ] as unknown as SnippetEnrichedType[];
    expect(searchFilter('javascript', snippets)).toEqual([snippets[0]]);
  });

  it('filters snippets by file content', () => {
    const snippets = [
      {
        title: 'Snippet 1',
        tags: [],
        languages: [],
        starred: false,
        isPublic: true,
        files: [{ text: 'console.log("Hello")' }],
      },
      {
        title: 'Snippet 2',
        tags: [],
        languages: [],
        starred: false,
        isPublic: true,
        files: [{ text: 'print("Hello")' }],
      },
    ] as unknown as SnippetEnrichedType[];
    expect(searchFilter('console', snippets)).toEqual([snippets[0]]);
  });

  it('returns no snippets when no match is found', () => {
    const snippets = [
      { title: 'Snippet 1', tags: [], languages: [], starred: false, isPublic: true, files: [] },
    ] as unknown as SnippetEnrichedType[];
    expect(searchFilter('nonexistent', snippets)).toEqual([]);
  });

  it('handles multiple search terms', () => {
    const snippets = [
      {
        title: 'Snippet 1',
        tags: ['#tag1'],
        languages: [{ name: 'JavaScript' }],
        starred: true,
        isPublic: true,
        files: [],
      },
      {
        title: 'Snippet 2',
        tags: ['#tag2'],
        languages: [{ name: 'TypeScript' }],
        starred: false,
        isPublic: true,
        files: [],
      },
    ] as unknown as SnippetEnrichedType[];
    expect(searchFilter('tag:tag1 lang:javascript is:starred', snippets)).toEqual([snippets[0]]);
  });

  describe('getAllTags', () => {
    it('extracts unique tags from snippets', () => {
      const snippets = [
        { tags: ['#tag1', '#tag2'] },
        { tags: ['#tag2', '#tag3'] },
      ] as unknown as SnippetEnrichedType[];
      expect(getAllTags(snippets)).toEqual(['tag1', 'tag2', 'tag3']);
    });

    it('returns empty array for no tags', () => {
      const snippets = [{ tags: [] }] as unknown as SnippetEnrichedType[];
      expect(getAllTags(snippets)).toEqual([]);
    });

    it('removes # from tags', () => {
      const snippets = [{ tags: ['#tag1'] }] as unknown as SnippetEnrichedType[];
      expect(getAllTags(snippets)).toEqual(['tag1']);
    });

    it('sorts tags alphabetically', () => {
      const snippets = [{ tags: ['#zebra', '#alpha'] }] as unknown as SnippetEnrichedType[];
      expect(getAllTags(snippets)).toEqual(['alpha', 'zebra']);
    });
  });

  describe('getAllLanguages', () => {
    it('extracts unique languages from snippets', () => {
      const snippets = [
        { languages: [{ name: 'JavaScript' }] },
        { languages: [{ name: 'TypeScript' }] },
      ] as unknown as SnippetEnrichedType[];
      expect(getAllLanguages(snippets)).toEqual(['JavaScript', 'TypeScript']);
    });

    it('returns empty array for no languages', () => {
      const snippets = [{ languages: [] }] as unknown as SnippetEnrichedType[];
      expect(getAllLanguages(snippets)).toEqual([]);
    });

    it('sorts languages alphabetically', () => {
      const snippets = [
        { languages: [{ name: 'TypeScript' }, { name: 'JavaScript' }] },
      ] as unknown as SnippetEnrichedType[];
      expect(getAllLanguages(snippets)).toEqual(['JavaScript', 'TypeScript']);
    });
  });
});
