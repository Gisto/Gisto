import { renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import { useIsOnline } from './use-is-online';

describe('useIsOnline', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return boolean value', () => {
    const { result } = renderHook(() => useIsOnline());

    expect(typeof result.current).toBe('boolean');
  });
});
