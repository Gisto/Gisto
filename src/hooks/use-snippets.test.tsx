import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { mockUtils } from '../../test/mockUtils';

import { useSnippets } from './use-snippets';

mockUtils();

const mockFetchAndUpdateSnippets = vi.fn();

vi.mock('@/lib/utils', async () => {
  const actual = await vi.importActual('@/lib/utils');
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
});
