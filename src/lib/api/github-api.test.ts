import { vi, MockedFunction } from 'vitest';

import { GithubApi } from './github-api.ts';

describe('GithubApi', () => {
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
});
