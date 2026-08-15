import { vi, MockedFunction } from 'vitest';

import {
  getGistRevisionContent,
  getGistRevisions,
  GithubApi,
  restoreGistRevision,
} from './github-api.ts';

describe('GithubApi', () => {
  const originalFetch = global.fetch;
  const originalLocalStorage = global.localStorage;

  const mockJsonResponse = (data: unknown) => ({
    ok: true,
    status: 200,
    headers: {
      get: vi.fn((key: string) => (key === 'Content-Type' ? 'application/json' : null)),
    },
    json: vi.fn().mockResolvedValue(data),
  });

  beforeEach(() => {
    global.fetch = vi.fn();
    Object.defineProperty(global, 'localStorage', {
      value: { getItem: vi.fn(), setItem: vi.fn() },
      writable: true,
    });
  });

  afterEach(() => {
    global.fetch = originalFetch;
    global.localStorage = originalLocalStorage;
    vi.clearAllMocks();
  });

  describe('request', () => {
    it('should make GET request successfully', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        headers: {
          get: vi.fn((key) => {
            if (key === 'x-ratelimit-limit') return '5000';
            if (key === 'x-ratelimit-remaining') return '4999';
            if (key === 'x-ratelimit-reset') return '1638360000';
            if (key === 'Content-Type') return 'application/json';
          }),
        },
        json: vi.fn().mockResolvedValue({ data: 'test' }),
      };

      (global.fetch as MockedFunction<typeof fetch>).mockResolvedValue(
        mockResponse as unknown as Response
      );
      (global.localStorage.getItem as MockedFunction<typeof localStorage.getItem>).mockReturnValue(
        'mock-token'
      );

      const result = await GithubApi.request({ endpoint: '/test' });

      expect(global.fetch).toHaveBeenCalledWith('https://api.github.com/test', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer mock-token',
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
          'User-agent': expect.stringContaining('Gisto app v'),
        },
        body: undefined,
      });

      expect(result).toEqual({
        data: { data: 'test' },
        headers: mockResponse.headers,
        status: 200,
      });
    });

    it('should handle POST request with body', async () => {
      const mockResponse = {
        ok: true,
        status: 201,
        headers: {
          get: vi.fn((key) => {
            if (key === 'Content-Type') return 'application/json';
          }),
        },
        json: vi.fn().mockResolvedValue({ id: '123' }),
      };

      (global.fetch as MockedFunction<typeof fetch>).mockResolvedValue(
        mockResponse as unknown as Response
      );
      (global.localStorage.getItem as MockedFunction<typeof localStorage.getItem>).mockReturnValue(
        'mock-token'
      );

      await GithubApi.request({
        endpoint: '/gists',
        method: 'POST',
        body: { description: 'test' },
      });

      expect(global.fetch).toHaveBeenCalledWith('https://api.github.com/gists', {
        method: 'POST',
        headers: expect.any(Object),
        body: JSON.stringify({ description: 'test' }),
      });
    });

    it('should throw error on HTTP error', async () => {
      const mockResponse = {
        ok: false,
        status: 404,
        headers: { get: vi.fn() },
      };

      (global.fetch as MockedFunction<typeof fetch>).mockResolvedValue(
        mockResponse as unknown as Response
      );
      (global.localStorage.getItem as MockedFunction<typeof localStorage.getItem>).mockReturnValue(
        'mock-token'
      );

      await expect(GithubApi.request({ endpoint: '/notfound' })).rejects.toThrow(
        'HTTP error! status: 404'
      );
    });

    it('should throw on 401', async () => {
      const mockResponse = {
        ok: false,
        status: 401,
        headers: { get: vi.fn() },
      };

      (global.fetch as MockedFunction<typeof fetch>).mockResolvedValue(
        mockResponse as unknown as Response
      );
      (global.localStorage.getItem as MockedFunction<typeof localStorage.getItem>).mockReturnValue(
        'mock-token'
      );

      await expect(GithubApi.request({ endpoint: '/unauthorized' })).rejects.toThrow();
    });
  });

  describe('getGistRevisions', () => {
    it('should map commits to revisions', async () => {
      (global.fetch as MockedFunction<typeof fetch>).mockResolvedValue(
        mockJsonResponse([
          {
            version: 'abc123',
            committed_at: '2024-01-01T00:00:00Z',
            change_status: { total: 3, additions: 2, deletions: 1 },
            url: 'https://api.github.com/gists/gist1/abc123',
          },
          {
            version: 'def456',
            committed_at: '2023-12-01T00:00:00Z',
            change_status: { total: 1, additions: 1, deletions: 0 },
            url: 'https://api.github.com/gists/gist1/def456',
          },
        ]) as unknown as Response
      );

      const revisions = await getGistRevisions('gist1');

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.github.com/gists/gist1/commits?per_page=100',
        expect.anything()
      );

      expect(revisions).toHaveLength(2);
      expect(revisions[0]).toEqual({
        id: 'abc123',
        snippetId: 'gist1',
        description: '',
        createdAt: '2024-01-01T00:00:00Z',
        meta: '2+ 1-',
      });
      expect(revisions[1]!.id).toBe('def456');
    });
  });

  describe('getGistRevisionContent', () => {
    it('should map revision gist files to SnippetFileType', async () => {
      (global.fetch as MockedFunction<typeof fetch>).mockResolvedValue(
        mockJsonResponse({
          id: 'gist1',
          description: 'Old title',
          files: {
            'file1.js': {
              filename: 'file1.js',
              content: 'const a = 1;',
              language: 'JavaScript',
              truncated: false,
              size: 13,
            },
            'file2.md': {
              filename: 'file2.md',
              content: null,
              language: null,
              truncated: false,
              size: 0,
            },
          },
        }) as unknown as Response
      );

      const content = await getGistRevisionContent('gist1', 'abc123');

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.github.com/gists/gist1/abc123',
        expect.anything()
      );

      expect(content.description).toBe('Old title');
      expect(content.files['file1.js'].content).toBe('const a = 1;');
      expect(content.files['file1.js'].language).toEqual({ name: 'JavaScript', color: null });
      expect(content.files['file2.md'].content).toBe('');
      expect(content.files['file2.md'].language).toEqual({ name: 'Text', color: null });
    });
  });

  describe('restoreGistRevision', () => {
    it('should patch the gist with the revision content and delete removed files', async () => {
      (global.fetch as MockedFunction<typeof fetch>)
        .mockResolvedValueOnce(
          mockJsonResponse({
            id: 'gist1',
            description: 'Old title',
            files: {
              'file1.js': {
                filename: 'file1.js',
                content: 'const a = 1;',
                language: 'JavaScript',
                truncated: false,
                size: 13,
              },
            },
          }) as unknown as Response
        )
        .mockResolvedValueOnce(
          mockJsonResponse({
            id: 'gist1',
            description: 'Current title',
            files: {
              'file1.js': { filename: 'file1.js', content: 'const b = 2;' },
              'removed.js': { filename: 'removed.js', content: 'delete me' },
            },
          }) as unknown as Response
        )
        .mockResolvedValueOnce(
          mockJsonResponse({
            id: 'gist1',
            description: 'Old title',
            files: {},
          }) as unknown as Response
        );

      await restoreGistRevision('gist1', 'abc123');

      expect(global.fetch).toHaveBeenNthCalledWith(
        1,
        'https://api.github.com/gists/gist1/abc123',
        expect.anything()
      );
      expect(global.fetch).toHaveBeenNthCalledWith(
        2,
        'https://api.github.com/gists/gist1',
        expect.anything()
      );

      const [url, options] = (global.fetch as MockedFunction<typeof fetch>).mock.calls[2] as [
        string,
        RequestInit,
      ];

      expect(url).toBe('https://api.github.com/gists/gist1');
      expect(options.method).toBe('PATCH');
      expect(JSON.parse(options.body as string)).toEqual({
        description: 'Old title',
        files: {
          'removed.js': null,
          'file1.js': { content: 'const a = 1;' },
        },
      });
    });
  });
});
