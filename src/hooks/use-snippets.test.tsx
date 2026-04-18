import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { mockUtils } from '../../test/mockUtils';

import { useSnippets } from './use-snippets';

mockUtils();

const mockFetchAndUpdateSnippets = vi.fn();

vi.mock('@/utils', async () => {
  const actual = await vi.importActual('@/utils');
  return {
    ...actual,
    fetchAndUpdateSnippets: mockFetchAndUpdateSnippets,
  };
});

describe('useSnippets', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should set loading to false after fetch completes', async () => {
    mockFetchAndUpdateSnippets.mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useSnippets());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('should handle fetch error gracefully', async () => {
    mockFetchAndUpdateSnippets.mockRejectedValueOnce(new Error('Fetch error'));

    const { result } = renderHook(() => useSnippets());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('should return initial loading state', async () => {
    mockFetchAndUpdateSnippets.mockImplementation(() => new Promise(() => {}));

    const { result } = renderHook(() => useSnippets());

    expect(result.current.isLoading).toBe(true);
  });

  it('should return isRefreshing state', async () => {
    mockFetchAndUpdateSnippets.mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useSnippets());

    await waitFor(() => {
      expect(result.current.isRefreshing).toBe(false);
    });
  });

  it('should return refresh function', async () => {
    mockFetchAndUpdateSnippets.mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useSnippets());

    await waitFor(() => {
      expect(result.current.refresh).toBeDefined();
      expect(typeof result.current.refresh).toBe('function');
    });
  });
});
