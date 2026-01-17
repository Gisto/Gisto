import { renderHook, act } from '@testing-library/react';
import { vi, Mock } from 'vitest';

import { useIsMobile } from './use-mobile';

describe('useIsMobile', () => {
  let mockMatchMedia: Mock<typeof window.matchMedia>;

  beforeEach(() => {
    mockMatchMedia = vi.fn();
    window.matchMedia = mockMatchMedia;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return false for desktop width', () => {
    const mockMediaQuery: Partial<MediaQueryList> = {
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
    mockMatchMedia.mockReturnValue(mockMediaQuery as MediaQueryList);

    Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true });

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(false);
  });

  it('should return true for mobile width', () => {
    const mockMediaQuery: Partial<MediaQueryList> = {
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
    mockMatchMedia.mockReturnValue(mockMediaQuery as MediaQueryList);

    Object.defineProperty(window, 'innerWidth', { value: 500, writable: true });

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(true);
  });

  it('should update when media query changes', () => {
    let changeCallback: (event: MediaQueryListEvent) => void;
    const mockMediaQuery: Partial<MediaQueryList> = {
      matches: false,
      addEventListener: vi.fn((event, callback) => {
        if (event === 'change') changeCallback = callback;
      }),
      removeEventListener: vi.fn(),
    };
    mockMatchMedia.mockReturnValue(mockMediaQuery as MediaQueryList);

    Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true });

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(false);

    act(() => {
      Object.defineProperty(window, 'innerWidth', { value: 500, writable: true });
      changeCallback({ matches: true } as MediaQueryListEvent);
    });

    expect(result.current).toBe(true);
  });
});
