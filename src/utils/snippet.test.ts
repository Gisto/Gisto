import {
  removeTags,
  getTags,
  processSnippet,
  mergeSyncedSnippet,
  getFileExtension,
  getLanguageName,
  isPDF,
  isHTML,
  isCSV,
  isTSV,
  isImage,
  isJson,
  isMarkdown,
  isOpenApi,
  isLaTex,
  isGeoJson,
  previewAvailable,
  formatSnippetForSaving,
  getFilesNeedingLanguageExtension,
} from './snippet.ts';

import { SnippetFileType, SnippetType, SnippetSingleType } from '@/types/snippet.ts';

type MockSnippet = {
  id: string;
  resourcePath: string;
  html_url: string;
  description: string;
  createdAt: string;
  stars: number;
  starred: boolean;
  isPublic: boolean;
  comments: { edges: [] };
  files: Record<string, { name: string; language: { name: string; color: string } }>;
};

describe('snippet utils', () => {
  const mockSnippet: MockSnippet = {
    id: '1',
    resourcePath: '/snippet/1',
    html_url: 'https://gist.github.com/1',
    description: 'Test #tag',
    createdAt: '2023-01-01',
    stars: 0,
    starred: false,
    isPublic: true,
    comments: { edges: [] },
    files: {
      'file1.js': { name: 'file1.js', language: { name: 'JavaScript', color: 'yellow' } },
      'file2.py': { name: 'file2.py', language: { name: 'Python', color: 'blue' } },
    },
  };

  describe('removeTags', () => {
    it('should remove tags from title', () => {
      expect(removeTags('Hello #world')).toBe('Hello ');
    });

    it('should return title if no tags', () => {
      expect(removeTags('Hello world')).toBe('Hello world');
    });

    it('should return unknown for empty title', () => {
      expect(removeTags('')).toBe('unknown');
    });

    it('should handle tags not at the end', () => {
      expect(removeTags('#tag Hello')).toBe('');
    });
  });

  describe('getTags', () => {
    it('should extract tags', () => {
      expect(getTags('Hello #world #test')).toEqual(['#world', '#test']);
    });

    it('should return empty array if no tags', () => {
      expect(getTags('Hello world')).toEqual([]);
    });

    it('should return empty array for empty title', () => {
      expect(getTags('')).toEqual([]);
    });
  });

  describe('processSnippet', () => {
    it('should process snippet correctly', () => {
      const result = processSnippet(mockSnippet as unknown as SnippetType);

      expect(result.id).toBe('1');
      expect(result.title).toBe('Test ');
      expect(result.tags).toEqual(['#tag']);
      expect(result.languages).toEqual([
        { name: 'JavaScript', color: 'yellow' },
        { name: 'Python', color: 'blue' },
      ]);
    });

    it('should handle untitled snippets', () => {
      const untitled = { ...mockSnippet, description: null };
      const result = processSnippet(untitled as unknown as SnippetType);

      expect(result.isUntitled).toBe(false);
      expect(result.description).toBe('Untitled');
    });
  });

  describe('mergeSyncedSnippet', () => {
    const enriched = processSnippet(mockSnippet as unknown as SnippetType);

    const updated = {
      id: '1',
      description: 'Test #tag',
      html_url: 'https://gist.github.com/1',
      files: {
        'file1.js': {
          filename: 'file1.js',
          type: 'text/plain',
          language: 'JavaScript',
          raw_url: 'https://gist.github.com/1/raw',
          size: 4,
          content: 'x = 1;',
        },
      },
      comments: 0,
    } as unknown as SnippetSingleType;

    it('preserves the enriched comments structure when merging a REST response', () => {
      const result = mergeSyncedSnippet(enriched, updated);

      expect(Array.isArray(result.comments.edges)).toBe(true);
    });

    it('takes the updated files, description and language', () => {
      const result = mergeSyncedSnippet(enriched, updated);

      expect(result.description).toBe('Test #tag');
      expect(result.languages).toEqual([{ name: 'JavaScript', color: 'white' }]);
    });

    it('keeps enriched-only fields like createdAt and isPublic', () => {
      const result = mergeSyncedSnippet(enriched, updated);

      expect(result.createdAt).toBe('2023-01-01');
      expect(result.isPublic).toBe(true);
      expect(result.starred).toBe(false);
    });
  });

  describe('file type checks', () => {
    const mockFile = (props: Partial<SnippetFileType>) => ({ ...props }) as SnippetFileType;

    it('should detect PDF', () => {
      expect(isPDF(mockFile({ type: 'application/pdf', filename: 'test.pdf' }))).toBe(true);
      expect(isPDF(mockFile({ type: 'text/plain', filename: 'test.pdf' }))).toBe(false);
    });

    it('should detect HTML', () => {
      expect(isHTML(mockFile({ language: 'HTML' }))).toBe(true);
      expect(isHTML(mockFile({ language: 'JavaScript' }))).toBe(false);
    });

    it('should detect CSV', () => {
      expect(isCSV(mockFile({ language: 'CSV' }))).toBe(true);
    });

    it('should detect image', () => {
      expect(isImage(mockFile({ type: 'image/png' }))).toBe(true);
      expect(isImage(mockFile({ type: 'text/plain' }))).toBe(false);
    });

    it('should detect JSON', () => {
      expect(isJson(mockFile({ language: 'JSON' }))).toBe(true);
    });

    it('should detect Markdown', () => {
      expect(isMarkdown(mockFile({ language: 'Markdown' }))).toBe(true);
    });
  });

  describe('previewAvailable', () => {
    it('should return true for supported formats', () => {
      expect(previewAvailable({ language: 'HTML', type: 'text/html' } as SnippetFileType)).toBe(
        true
      );
      expect(previewAvailable({ type: 'image/png' } as SnippetFileType)).toBe(true);
      expect(
        previewAvailable({ language: 'JavaScript', type: 'text/plain' } as SnippetFileType)
      ).toBe(false);
    });

    it('should not crash if type is missing', () => {
      expect(() =>
        previewAvailable({ language: 'Text', filename: 'test.txt' } as SnippetFileType)
      ).not.toThrow();
    });
  });

  describe('formatSnippetForSaving', () => {
    it('should format snippet with tags', () => {
      const result = formatSnippetForSaving({
        description: 'Test',
        isPublic: true,
        files: [{ filename: 'test.js', content: 'console.log()' }],
        tags: ['#tag1', '#tag2'],
      });

      expect(result.description).toBe('Test #tag1 #tag2');
      expect(result.isPublic).toBe(true);
      expect(result.files).toEqual({ 'test.js': { content: 'console.log()' } });
    });

    it('appends a detected extension when the filename would not detect the language', () => {
      const result = formatSnippetForSaving(
        {
          description: 'Test',
          isPublic: true,
          files: [{ filename: 'test', content: 'content', language: 'Python' }],
        },
        null,
        true
      );

      expect(result.files).toEqual({ 'test.py': { content: 'content' } });
    });

    it('keeps the filename when the extension already matches the language', () => {
      const result = formatSnippetForSaving(
        {
          description: 'Test',
          isPublic: true,
          files: [{ filename: 'test.py', content: 'content', language: 'Python' }],
        },
        null,
        true
      );

      expect(result.files).toEqual({ 'test.py': { content: 'content' } });
    });

    it('appends an extension for languages Linguist still lists', () => {
      const result = formatSnippetForSaving(
        {
          description: 'Test',
          isPublic: true,
          files: [{ filename: 'test', content: 'content', language: 'Ada' }],
        },
        null,
        true
      );

      expect(result.files).toEqual({ 'test.adb': { content: 'content' } });
    });

    it('appends the closest modern extension for renamed or removed Linguist languages', () => {
      const result = formatSnippetForSaving(
        {
          description: 'Test',
          isPublic: true,
          files: [
            { filename: 'config', content: 'content', language: 'Bro' },
            { filename: 'macros', content: 'content', language: 'VimL' },
            { filename: 'proof', content: 'content', language: 'Coq' },
          ],
        },
        null,
        true
      );

      expect(result.files).toEqual({
        'config.zeek': { content: 'content' },
        'macros.vim': { content: 'content' },
        'proof.v': { content: 'content' },
      });
    });

    it('does not repeat an extension already present on the filename', () => {
      const result = formatSnippetForSaving(
        {
          description: 'Test',
          isPublic: true,
          files: [{ filename: 'pom.xml', content: 'content', language: 'Maven POM' }],
        },
        null,
        true
      );

      expect(result.files).toEqual({ 'pom.xml': { content: 'content' } });
    });

    it('does not append extensions when applyLanguageExtensions is false', () => {
      const result = formatSnippetForSaving({
        description: 'Test',
        isPublic: true,
        files: [{ filename: 'test', content: 'content', language: 'Python' }],
      });

      expect(result.files).toEqual({ test: { content: 'content' } });
    });

    it('never renames a file whose language is Text', () => {
      const result = formatSnippetForSaving(
        {
          description: 'Test',
          isPublic: true,
          files: [{ filename: 'c', content: 'content', language: 'Text' }],
        },
        null,
        true
      );

      expect(result.files).toEqual({ c: { content: 'content' } });
    });

    it('still appends an extension to an extensionless file with a real language', () => {
      const result = formatSnippetForSaving(
        {
          description: 'Test',
          isPublic: true,
          files: [{ filename: 'notes', content: 'content', language: 'Python' }],
        },
        null,
        true
      );

      expect(result.files).toEqual({ 'notes.py': { content: 'content' } });
    });

    it('does not append to dotless names that already detect as their language', () => {
      const result = formatSnippetForSaving(
        {
          description: 'Test',
          isPublic: true,
          files: [{ filename: 'dockerfile', content: 'content', language: 'Dockerfile' }],
        },
        null,
        true
      );

      expect(result.files).toEqual({ dockerfile: { content: 'content' } });
    });

    it('does not hijack the name of another live file', () => {
      const result = formatSnippetForSaving(
        {
          description: 'Test',
          isPublic: true,
          files: [
            { filename: 'helper', content: 'a', language: 'Python' },
            { filename: 'helper.py', content: 'b', language: 'Python' },
          ],
        },
        null,
        true
      );

      expect(result.files).toEqual({ helper: { content: 'a' }, 'helper.py': { content: 'b' } });
    });

    it('should handle edit mode', () => {
      const editSnippet = {
        files: { 'old.js': { content: 'old' } },
      } as unknown as SnippetSingleType;

      const result = formatSnippetForSaving(
        {
          description: 'Test',
          isPublic: false,
          files: [{ filename: 'new.js', content: 'new', language: 'JavaScript' }],
        },
        editSnippet,
        true
      );

      expect(result.files).toHaveProperty('new.js');
      expect(result.files).toHaveProperty('old.js');
      expect(result.files['new.js']).toEqual({ content: 'new' });
    });

    it('renames the original file when appending an extension in edit mode', () => {
      const editSnippet = {
        files: { test: { content: 'content' } },
      } as unknown as SnippetSingleType;

      const result = formatSnippetForSaving(
        {
          description: 'Test',
          isPublic: false,
          files: [{ filename: 'test', content: 'content', language: 'Python' }],
        },
        editSnippet,
        true
      );

      expect(result.files).toEqual({ 'test.py': { content: 'content' }, test: null });
    });

    it('does not overwrite a live file with a deleted marker in edit mode', () => {
      const editSnippet = {
        files: { 'test.py': { content: 'old' } },
      } as unknown as SnippetSingleType;

      const result = formatSnippetForSaving(
        {
          description: 'Test',
          isPublic: false,
          files: [{ filename: 'test', content: 'content', language: 'Python' }],
        },
        editSnippet,
        true
      );

      expect(result.files).toEqual({ 'test.py': { content: 'content' } });
    });

    it('does not delete a brand-new file name when appending an extension in edit mode', () => {
      const editSnippet = {
        files: { 'app.js': { content: 'old' } },
      } as unknown as SnippetSingleType;

      const result = formatSnippetForSaving(
        {
          description: 'Test',
          isPublic: false,
          files: [
            { filename: 'server', content: 'new', language: 'JavaScript' },
            { filename: 'app.js', content: 'kept', language: 'JavaScript' },
          ],
        },
        editSnippet,
        true
      );

      // `server: null` would ask the provider to delete a file that never existed
      expect(result.files).toEqual({
        'server.js': { content: 'new' },
        'app.js': { content: 'kept' },
      });
    });
  });

  describe('getFilesNeedingLanguageExtension', () => {
    it('returns files that miss the extension of the selected language', () => {
      expect(
        getFilesNeedingLanguageExtension([
          { filename: 'test', language: 'Python' },
          { filename: 'kept.py', language: 'Python' },
          { filename: 'x', language: 'Nope' },
        ])
      ).toEqual([{ filename: 'test', extension: 'py' }]);
    });

    it('does not promise a rename whose target name another file already owns', () => {
      expect(
        getFilesNeedingLanguageExtension([
          { filename: 'helper', language: 'Python' },
          { filename: 'helper.py', language: 'Python' },
        ])
      ).toEqual([]);
    });

    it('ignores files whose existing extension detects the language regardless of case', () => {
      expect(
        getFilesNeedingLanguageExtension([{ filename: 'TEST.PY', language: 'Python' }])
      ).toEqual([]);
    });

    it('never renames a Text file', () => {
      expect(getFilesNeedingLanguageExtension([{ filename: 'c', language: 'Text' }])).toEqual([]);
    });
  });

  describe('getFileExtension', () => {
    it('should return file extension', () => {
      expect(getFileExtension({ filename: 'test.js' } as SnippetFileType)).toBe('js');
      expect(getFileExtension({ filename: 'file.tar.gz' } as SnippetFileType)).toBe('gz');
    });
  });

  describe('getLanguageName', () => {
    it('should return language name from string', () => {
      expect(getLanguageName({ language: 'JavaScript' } as SnippetFileType)).toBe('JavaScript');
    });

    it('should return language name from object', () => {
      expect(
        getLanguageName({
          language: { name: 'TypeScript', color: 'blue' },
        } as unknown as SnippetFileType)
      ).toBe('TypeScript');
    });

    it('should return empty string for missing language', () => {
      expect(getLanguageName({} as SnippetFileType)).toBe('');
    });
  });

  describe('isTSV', () => {
    it('should detect TSV files', () => {
      expect(isTSV({ type: 'text/tab-separated-values' } as SnippetFileType)).toBe(true);
      expect(isTSV({ type: 'text/plain' } as SnippetFileType)).toBe(false);
    });
  });

  describe('isOpenApi', () => {
    it('should detect OpenAPI files', () => {
      expect(isOpenApi({ language: 'OASv2-json' } as SnippetFileType)).toBe(true);
      expect(isOpenApi({ language: 'OASv3-json' } as SnippetFileType)).toBe(true);
      expect(isOpenApi({ language: 'JavaScript' } as SnippetFileType)).toBe(false);
    });
  });

  describe('isLaTex', () => {
    it('should detect LaTeX files', () => {
      expect(isLaTex({ language: 'TeX' } as SnippetFileType)).toBe(true);
      expect(isLaTex({ language: 'JavaScript' } as SnippetFileType)).toBe(false);
    });
  });

  describe('isGeoJson', () => {
    it('should detect GeoJSON files', () => {
      expect(isGeoJson({ language: 'JSON', filename: 'file.geojson' } as SnippetFileType)).toBe(
        true
      );
      expect(isGeoJson({ language: 'JavaScript', filename: 'test.js' } as SnippetFileType)).toBe(
        false
      );
    });
  });
});
