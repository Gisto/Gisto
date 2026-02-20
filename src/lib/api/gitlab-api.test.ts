import { vi, MockedFunction } from 'vitest';

import { GitlabApi } from './gitlab-api.ts';

describe('GitlabApi', () => {
  const originalFetch = global.fetch;
  const originalLocalStorage = global.localStorage;

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
    it('should make GET request successfully with Private-Token', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        headers: {
          get: vi.fn((key) => {
            if (key === 'Content-Type') return 'application/json';
          }),
        },
        json: vi.fn().mockResolvedValue({ id: 1, title: 'test' }),
      };

      (global.fetch as MockedFunction<typeof fetch>).mockResolvedValue(
        mockResponse as unknown as Response
      );
      (global.localStorage.getItem as MockedFunction<typeof localStorage.getItem>).mockReturnValue(
        'mock-gitlab-token'
      );

      const result = await GitlabApi.request({ endpoint: '/test' });

      expect(global.fetch).toHaveBeenCalledWith('https://gitlab.com/api/v4/test', {
        method: 'GET',
        headers: {
          'Private-Token': 'mock-gitlab-token',
          'Content-Type': 'application/json',
          'User-agent': expect.stringContaining('Gisto app v'),
        },
        body: undefined,
      });

      expect(result.data).toEqual({ id: 1, title: 'test' });
    });
  });

  describe('getSnippet', () => {
    it('should fetch snippet and its raw file content if missing', async () => {
      const snippetId = '123';
      const rawUrl = 'https://gitlab.com/-/snippets/123/raw/main/file1.txt';
      const mockSnippetResponse = {
        ok: true,
        status: 200,
        headers: {
          get: vi.fn((key) => (key === 'Content-Type' ? 'application/json' : null)),
        },
        json: vi.fn().mockResolvedValue({
          id: snippetId,
          title: 'Test',
          files: [{ path: 'test.js', raw_url: rawUrl }],
          author: { username: 'testuser' },
        }),
      };

      const mockRawResponse = {
        ok: true,
        status: 200,
        headers: {
          get: vi.fn((key) => (key === 'Content-Type' ? 'text/plain' : null)),
        },
        text: vi.fn().mockResolvedValue('const a = 1;'),
      };

      (global.fetch as MockedFunction<typeof fetch>)
        .mockResolvedValueOnce(mockSnippetResponse as unknown as Response)
        .mockResolvedValueOnce(mockRawResponse as unknown as Response);

      const result = await GitlabApi.getSnippet(snippetId);

      expect(global.fetch).toHaveBeenCalledWith(
        `https://gitlab.com/api/v4/snippets/${snippetId}`,
        expect.anything()
      );
      expect(global.fetch).toHaveBeenCalledWith(
        `https://gitlab.com/api/v4/snippets/${snippetId}/files/main/file1.txt/raw`,
        expect.anything()
      );
      expect(result.files['test.js'].content).toBe('const a = 1;');
    });

    it('should fetch distinct content for multiple files using their raw_urls', async () => {
      const snippetId = '123';
      const rawUrl1 = 'https://gitlab.com/-/snippets/123/raw/main/file1.txt';
      const rawUrl2 = 'https://gitlab.com/-/snippets/123/raw/main/file2.txt';

      const mockSnippetResponse = {
        ok: true,
        status: 200,
        headers: {
          get: vi.fn((key) => (key === 'Content-Type' ? 'application/json' : null)),
        },
        json: vi.fn().mockResolvedValue({
          id: snippetId,
          title: 'Multiple Files',
          files: [
            { path: 'file1.txt', raw_url: rawUrl1 },
            { path: 'file2.txt', raw_url: rawUrl2 },
          ],
          author: { username: 'testuser' },
        }),
      };

      const mockRaw1Response = {
        ok: true,
        status: 200,
        headers: {
          get: vi.fn((key) => (key === 'Content-Type' ? 'text/plain' : null)),
        },
        text: vi.fn().mockResolvedValue('Content 1'),
      };

      const mockRaw2Response = {
        ok: true,
        status: 200,
        headers: {
          get: vi.fn((key) => (key === 'Content-Type' ? 'text/plain' : null)),
        },
        text: vi.fn().mockResolvedValue('Content 2'),
      };

      (global.fetch as MockedFunction<typeof fetch>)
        .mockResolvedValueOnce(mockSnippetResponse as unknown as Response)
        .mockResolvedValueOnce(mockRaw1Response as unknown as Response)
        .mockResolvedValueOnce(mockRaw2Response as unknown as Response);

      const result = await GitlabApi.getSnippet(snippetId);

      expect(global.fetch).toHaveBeenCalledWith(
        `https://gitlab.com/api/v4/snippets/${snippetId}/files/main/file1.txt/raw`,
        expect.anything()
      );
      expect(global.fetch).toHaveBeenCalledWith(
        `https://gitlab.com/api/v4/snippets/${snippetId}/files/main/file2.txt/raw`,
        expect.anything()
      );
      expect(result.files['file1.txt'].content).toBe('Content 1');
      expect(result.files['file2.txt'].content).toBe('Content 2');
    });
  });

  describe('updateSnippet', () => {
    it('should update snippet with correct file actions and no content for delete', async () => {
      const snippetId = '123';
      const files = {
        'new.js': { content: 'console.log("new")' },
        'existing.js': { content: 'console.log("updated")' },
        'deleted.js': null,
      };
      const description = 'Updated Description';

      const mockUpdateResponse = {
        ok: true,
        status: 200,
        headers: {
          get: vi.fn((key) => (key === 'Content-Type' ? 'application/json' : null)),
        },
        json: vi.fn().mockResolvedValue({
          id: snippetId,
          title: 'Updated Description',
          description: 'Updated Description',
          web_url: 'https://gitlab.com/snippets/123',
        }),
      };

      const mockSnippetResponse = {
        ok: true,
        status: 200,
        headers: {
          get: vi.fn((key) => (key === 'Content-Type' ? 'application/json' : null)),
        },
        json: vi.fn().mockResolvedValue({
          id: snippetId,
          files: [{ path: 'existing.js' }, { path: 'deleted.js' }],
        }),
      };

      (global.fetch as MockedFunction<typeof fetch>)
        .mockResolvedValueOnce(mockSnippetResponse as unknown as Response)
        .mockResolvedValueOnce(mockUpdateResponse as unknown as Response);

      await GitlabApi.updateSnippet({ snippetId, files, description });

      expect(global.fetch).toHaveBeenLastCalledWith(
        `https://gitlab.com/api/v4/snippets/${snippetId}`,
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify({
            title: 'Updated Description',
            description: 'Updated Description',
            files: [
              { action: 'create', file_path: 'new.js', content: 'console.log("new")' },
              { action: 'update', file_path: 'existing.js', content: 'console.log("updated")' },
              { action: 'delete', file_path: 'deleted.js' },
            ],
          }),
        })
      );
    });
  });

  describe('createSnippet', () => {
    it('should create a snippet with multiple files and distinct content', async () => {
      const requestMock = vi.spyOn(GitlabApi, 'request').mockResolvedValue({
        data: {
          id: 123,
          title: 'Test Snippet',
          description: 'Test Description',
          visibility: 'public',
          web_url: 'https://gitlab.com/snippets/123',
          files: [
            { path: 'file1.txt', content: 'Content 1', raw_url: '' },
            { path: 'file2.txt', content: 'Content 2', raw_url: '' },
          ],
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z',
        },
        headers: new Headers(),
        status: 201,
      });

      const files = {
        'file1.txt': { content: 'Content 1' },
        'file2.txt': { content: 'Content 2' },
      };

      await GitlabApi.createSnippet({
        files,
        description: 'Test Description',
        isPublic: true,
      });

      expect(requestMock).toHaveBeenCalledWith({
        endpoint: '/snippets',
        method: 'POST',
        body: {
          title: 'Test Description',
          description: 'Test Description',
          visibility: 'public',
          files: [
            { file_path: 'file1.txt', content: 'Content 1' },
            { file_path: 'file2.txt', content: 'Content 2' },
          ],
        },
      });
    });
  });

  describe('mapToSnippetType', () => {
    it('should map GitLab snippet to SnippetType with full description and tags', () => {
      const gitlabSnippet = {
        id: 123,
        title: 'Snippet Title',
        description: 'Snippet Title\nFull description #tag1 #tag2',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
        web_url: 'https://gitlab.com/snippets/123',
        visibility: 'public' as const,
        files: [],
      };

      const result = GitlabApi.mapToSnippetType(gitlabSnippet);

      expect(result.description).toBe('Snippet Title\nFull description #tag1 #tag2');
    });

    it('should handle truncated titles when mapping from description', () => {
      const gitlabSnippet = {
        id: 123,
        title: 'Snippet Title...',
        description: 'Snippet Title with more text #tag',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
        web_url: 'https://gitlab.com/snippets/123',
        visibility: 'public' as const,
        files: [],
      };

      const result = GitlabApi.mapToSnippetType(gitlabSnippet);

      expect(result.description).toBe('Snippet Title with more text #tag');
    });

    it('should combine title and description if they are different and title is not in description', () => {
      const gitlabSnippet = {
        id: 123,
        title: 'Headline #tag',
        description: 'Detail notes',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
        web_url: 'https://gitlab.com/snippets/123',
        visibility: 'public' as const,
        files: [],
      };

      const result = GitlabApi.mapToSnippetType(gitlabSnippet);

      expect(result.description).toBe('Headline #tag\nDetail notes');
    });

    it('should fallback to title if description is missing', () => {
      const gitlabSnippet = {
        id: 123,
        title: 'Snippet Title #tag',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
        web_url: 'https://gitlab.com/snippets/123',
        visibility: 'public' as const,
        files: [],
      };

      const result = GitlabApi.mapToSnippetType(gitlabSnippet);

      expect(result.description).toBe('Snippet Title #tag');
    });
  });
});
