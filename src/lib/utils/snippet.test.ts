import {
  removeTags,
  getTags,
  processSnippet,
  getFileExtension,
  isPDF,
  isHTML,
  isCSV,
  isImage,
  isJson,
  isMarkdown,
  previewAvailable,
  formatSnippetForSaving,
} from './snippet';

import { SnippetFileType, SnippetType, SnippetSingleType } from '@/types/snippet';

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
      expect(previewAvailable({ language: 'HTML', type: 'text/html' } as SnippetFileType)).toBe(true);
      expect(previewAvailable({ type: 'image/png' } as SnippetFileType)).toBe(true);
      expect(previewAvailable({ language: 'JavaScript', type: 'text/plain' } as SnippetFileType)).toBe(
        false
      );
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

    it('should handle edit mode', () => {
      const editSnippet = {
        files: { 'old.js': { content: 'old' } },
      } as unknown as SnippetSingleType;

      const result = formatSnippetForSaving(
        {
          description: 'Test',
          isPublic: false,
          files: [{ filename: 'new.js', content: 'new' }],
        },
        editSnippet
      );

      expect(result.files).toHaveProperty('new.js');
      expect(result.files).toHaveProperty('old.js');
    });
  });

  describe('getFileExtension', () => {
    it('should return file extension', () => {
      expect(getFileExtension({ filename: 'test.js' } as SnippetFileType)).toBe('js');
      expect(getFileExtension({ filename: 'file.tar.gz' } as SnippetFileType)).toBe('gz');
    });
  });
});
