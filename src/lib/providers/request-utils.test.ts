import { vi, MockedFunction } from 'vitest';

import { requestApi } from './request-utils';

describe('requestApi', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.clearAllMocks();
  });

  it('builds a URL from baseUrl and endpoint', async () => {
    const mockResponse = {
      status: 200,
      headers: { get: vi.fn(() => 'application/json') },
      json: vi.fn().mockResolvedValue({ ok: true }),
    };

    (global.fetch as MockedFunction<typeof fetch>).mockResolvedValue(
      mockResponse as unknown as Response
    );

    await requestApi({
      baseUrl: 'https://api.example.com',
      endpoint: '/test',
      headers: { Authorization: 'token' },
    });

    expect(global.fetch).toHaveBeenCalledWith('https://api.example.com/test', {
      method: 'GET',
      headers: { Authorization: 'token' },
      body: undefined,
    });
  });

  it('uses absolute endpoints without baseUrl prefix', async () => {
    const mockResponse = {
      status: 200,
      headers: { get: vi.fn(() => 'application/json') },
      json: vi.fn().mockResolvedValue({ ok: true }),
    };

    (global.fetch as MockedFunction<typeof fetch>).mockResolvedValue(
      mockResponse as unknown as Response
    );

    await requestApi({
      baseUrl: 'https://api.example.com',
      endpoint: 'https://other.example.com/test',
      headers: { Authorization: 'token' },
    });

    expect(global.fetch).toHaveBeenCalledWith('https://other.example.com/test', {
      method: 'GET',
      headers: { Authorization: 'token' },
      body: undefined,
    });
  });

  it('parses JSON responses by content type', async () => {
    const mockResponse = {
      status: 200,
      headers: { get: vi.fn(() => 'application/json') },
      json: vi.fn().mockResolvedValue({ data: 'value' }),
    };

    (global.fetch as MockedFunction<typeof fetch>).mockResolvedValue(
      mockResponse as unknown as Response
    );

    const result = await requestApi<{ data: string }>({
      baseUrl: 'https://api.example.com',
      endpoint: '/json',
      headers: {},
    });

    expect(result.data).toEqual({ data: 'value' });
  });

  it('parses text responses when content type is not JSON', async () => {
    const mockResponse = {
      status: 200,
      headers: { get: vi.fn(() => 'text/plain') },
      text: vi.fn().mockResolvedValue('hello'),
    };

    (global.fetch as MockedFunction<typeof fetch>).mockResolvedValue(
      mockResponse as unknown as Response
    );

    const result = await requestApi<string>({
      baseUrl: 'https://api.example.com',
      endpoint: '/text',
      headers: {},
    });

    expect(result.data).toBe('hello');
  });

  it('returns null for DELETE responses', async () => {
    const mockResponse = {
      status: 204,
      headers: { get: vi.fn(() => 'application/json') },
      json: vi.fn(),
    };

    (global.fetch as MockedFunction<typeof fetch>).mockResolvedValue(
      mockResponse as unknown as Response
    );

    const result = await requestApi<null>({
      baseUrl: 'https://api.example.com',
      endpoint: '/delete',
      method: 'DELETE',
      headers: {},
    });

    expect(result.data).toBeNull();
  });

  it('calls onUnauthorized for 401 responses and throws', async () => {
    const onUnauthorized = vi.fn();
    const mockResponse = {
      status: 401,
      headers: { get: vi.fn() },
    };

    (global.fetch as MockedFunction<typeof fetch>).mockResolvedValue(
      mockResponse as unknown as Response
    );

    await expect(
      requestApi({
        baseUrl: 'https://api.example.com',
        endpoint: '/unauthorized',
        headers: {},
        onUnauthorized,
      })
    ).rejects.toThrow('HTTP error! status: 401');

    expect(onUnauthorized).toHaveBeenCalled();
  });
});
