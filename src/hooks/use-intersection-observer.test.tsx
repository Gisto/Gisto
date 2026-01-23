import { renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import useIntersectionObserver from './use-intersection-observer';

describe('useIntersectionObserver', () => {
  it('should return false initially and ref', () => {
    // Mock IntersectionObserver for this test
    global.IntersectionObserver = vi.fn().mockImplementation(function () {
      return {
        observe: vi.fn(),
        disconnect: vi.fn(),
        unobserve: vi.fn(),
      };
    });

    const { result } = renderHook(() => useIntersectionObserver());

    const [isInView, ref] = result.current;

    expect(isInView).toBe(false);
    expect(ref.current).toBeNull();
  });
});
