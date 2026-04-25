import { vi, MockedFunction } from 'vitest';

import { globalState } from '../store/globalState.ts';

import { SnippetBinApi } from './snippet-bin-api.ts';

import { SnippetEnrichedType } from '@/types/snippet.ts';

interface SnippetBinFile {
  filename: string;
  type: string;
  language: string;
  raw_url: string;
  size: number;
  content?: string;
}

interface SnippetBinOwner {
  login: string;
  id: string;
  avatar_url: string;
}

interface SnippetBinGist {
  id: string;
  public: boolean;
  description: string;
  files: Record<string, SnippetBinFile>;
  owner: SnippetBinOwner;
  created_at: string;
  updated_at: string;
  star_count: number;
  starred?: boolean;
}

describe('SnippetBinApi', () => {
  const originalFetch = global.fetch;
  const originalLocalStorage = global.localStorage;

  beforeEach(() => {
    global.fetch = vi.fn();
    Object.defineProperty(global, 'localStorage', {
      value: { getItem: vi.fn(), setItem: vi.fn() },
      writable: true,
    });
    globalState.setState({
      settings: {
        ...globalState.getState().settings,
        snippetBinBaseUrl: 'http://localhost:3001/api',
      },
    });
  });

  afterEach(() => {
    global.fetch = originalFetch;
    global.localStorage = originalLocalStorage;
    vi.clearAllMocks();
  });

  describe('mapToSnippetType', () => {
    it('should map snippet-bin gist to Gisto snippet type using global baseUrl', () => {
      globalState.setState({
        settings: {
          ...globalState.getState().settings,
          snippetBinBaseUrl: 'https://my-snippet-bin.com/api',
        },
      });

      const mockGist: SnippetBinGist = {
        id: 'gist123',
        public: true,
        description: 'Test Gist',
        files: {
          'test.js': {
            filename: 'test.js',
            type: 'application/javascript',
            language: 'javascript',
            raw_url: '/api/gists/gist123/files/test.js',
            size: 100,
          },
        },
        owner: {
          login: 'testuser',
          id: 'user123',
          avatar_url: 'http://avatar.url',
        },
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        star_count: 5,
        starred: true,
      };

      const mapped = SnippetBinApi.mapToSnippetType(mockGist);

      expect(mapped.id).toBe('gist123');
      expect(mapped.description).toBe('Test Gist');
      expect(mapped.files['test.js'].raw_url).toBe(
        'https://my-snippet-bin.com/api/gists/gist123/files/test.js'
      );
      expect(mapped.owner?.login).toBe('testuser');
      expect(mapped.isPublic).toBe(true);
      expect(mapped.createdAt).toBe('2024-01-01T00:00:00Z');
      expect(mapped.stars).toBe(5);
      expect(mapped.starred).toBe(true);
      expect(mapped.comments).toEqual({ edges: [] });
    });
  });

  describe('fetchSnippets', () => {
    it('should fetch snippets and merge starred status', async () => {
      const mockGists: SnippetBinGist[] = [
        {
          id: 'gist1',
          public: true,
          files: {},
          owner: { login: 'u', id: '1', avatar_url: '' },
          description: '',
          created_at: '',
          updated_at: '',
          star_count: 0,
        },
        {
          id: 'gist2',
          public: true,
          files: {},
          owner: { login: 'u', id: '1', avatar_url: '' },
          description: '',
          created_at: '',
          updated_at: '',
          star_count: 0,
        },
      ];
      const mockStarredGists = [{ id: 'gist2' }] as SnippetBinGist[];

      const mockResponse = (data: unknown) => ({
        ok: true,
        status: 200,
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        json: vi.fn().mockResolvedValue(data),
      });

      (global.fetch as MockedFunction<typeof fetch>)
        .mockResolvedValueOnce(mockResponse(mockGists) as unknown as Response)
        .mockResolvedValueOnce(mockResponse(mockStarredGists) as unknown as Response);

      const result = await SnippetBinApi.fetchSnippets();

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/gists',
        expect.any(Object)
      );
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/gists/starred',
        expect.any(Object)
      );

      expect(result.nodes).toHaveLength(2);
      expect(result.nodes[0].id).toBe('gist1');
      expect(result.nodes[0].starred).toBe(false);
      expect(result.nodes[1].id).toBe('gist2');
      expect(result.nodes[1].starred).toBe(true);
    });

    it('should handle failed starred fetch gracefully', async () => {
      const mockGists: SnippetBinGist[] = [
        {
          id: 'gist1',
          public: true,
          files: {},
          owner: { login: 'u', id: '1', avatar_url: '' },
          description: '',
          created_at: '',
          updated_at: '',
          star_count: 0,
        },
      ];

      const mockResponse = (data: unknown) => ({
        ok: true,
        status: 200,
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        json: vi.fn().mockResolvedValue(data),
      });

      (global.fetch as MockedFunction<typeof fetch>)
        .mockResolvedValueOnce(mockResponse(mockGists) as unknown as Response)
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          headers: { get: vi.fn() },
          text: vi.fn().mockResolvedValue('Error'),
        } as unknown as Response);

      const result = await SnippetBinApi.fetchSnippets();

      expect(result.nodes).toHaveLength(1);
      expect(result.nodes[0].starred).toBe(false);
    });
  });

  describe('star and delete operations', () => {
    beforeEach(() => {
      globalState.setState({
        snippets: [
          {
            id: 'gist123',
            starred: false,
            createdAt: '2024-01-01T00:00:00Z',
            description: '',
            files: [],
            html_url: '',
            isPublic: true,
            resourcePath: '',
            stars: 0,
            comments: { edges: [] },
            title: '',
            tags: [],
            isUntitled: false,
            languages: [],
          } as unknown as SnippetEnrichedType,
        ],
      });
    });

    it('addStar should update state and show toast on success', async () => {
      const mockResponse = {
        ok: true,
        status: 204,
        headers: new Headers(),
        text: vi.fn().mockResolvedValue(''),
      };
      (global.fetch as MockedFunction<typeof fetch>).mockResolvedValue(
        mockResponse as unknown as Response
      );

      const result = await SnippetBinApi.addStar('gist123');

      expect(result.success).toBe(true);
      expect(globalState.getState().snippets[0].starred).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/gists/gist123/star'),
        expect.objectContaining({ method: 'POST' })
      );
    });

    it('deleteStar should update state and show toast on success', async () => {
      globalState.setState({
        snippets: [
          {
            id: 'gist123',
            starred: true,
            createdAt: '2024-01-01T00:00:00Z',
            description: '',
            files: [],
            html_url: '',
            isPublic: true,
            resourcePath: '',
            stars: 0,
            comments: { edges: [] },
            title: '',
            tags: [],
            isUntitled: false,
            languages: [],
          } as unknown as SnippetEnrichedType,
        ],
      });

      const mockResponse = {
        ok: true,
        status: 204,
        headers: new Headers(),
        text: vi.fn().mockResolvedValue(''),
      };
      (global.fetch as MockedFunction<typeof fetch>).mockResolvedValue(
        mockResponse as unknown as Response
      );

      const result = await SnippetBinApi.deleteStar('gist123');

      expect(result.success).toBe(true);
      expect(globalState.getState().snippets[0].starred).toBe(false);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/gists/gist123/star'),
        expect.objectContaining({ method: 'DELETE' })
      );
    });

    it('deleteSnippet should update state and show toast on success', async () => {
      const mockResponse = {
        ok: true,
        status: 204,
        headers: new Headers(),
        text: vi.fn().mockResolvedValue(''),
      };
      (global.fetch as MockedFunction<typeof fetch>).mockResolvedValue(
        mockResponse as unknown as Response
      );

      const result = await SnippetBinApi.deleteSnippet('gist123');

      expect(result.success).toBe(true);
      expect(globalState.getState().snippets).toHaveLength(0);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/gists/gist123'),
        expect.objectContaining({ method: 'DELETE' })
      );
    });
  });
});
