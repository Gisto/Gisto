import { renderHook, waitFor, act } from '@testing-library/react';
import { vi } from 'vitest';

import { globalState, useStoreValue, updateSettings, defaultSettings } from './globalState';

describe('globalState', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    globalState.setState({
      isLoading: false,
      loadingProgress: 0,
      search: '',
      snippets: [],
    });
  });

  describe('useStoreValue', () => {
    it('should return the current value from store', () => {
      const { result } = renderHook(() => useStoreValue('isLoggedIn'));

      expect(result.current).toBe(false);
    });

    it('should update when store changes', async () => {
      const { result } = renderHook(() => useStoreValue('isLoggedIn'));

      act(() => {
        globalState.setState({ isLoggedIn: true });
      });

      await waitFor(() => {
        expect(result.current).toBe(true);
      });
    });

    it('should return isLoading state', () => {
      const { result } = renderHook(() => useStoreValue('isLoading'));
      expect(result.current).toBe(false);
    });

    it('should return loadingProgress state', () => {
      const { result } = renderHook(() => useStoreValue('loadingProgress'));
      expect(result.current).toBe(0);
    });

    it('should return search state', () => {
      const { result } = renderHook(() => useStoreValue('search'));
      expect(result.current).toBe('');
    });

    it('should return snippets array', () => {
      const { result } = renderHook(() => useStoreValue('snippets'));
      expect(result.current).toEqual([]);
    });

    it('should return totalSnippetCount', () => {
      const { result } = renderHook(() => useStoreValue('totalSnippetCount'));
      expect(result.current).toBe(0);
    });

    it('should return apiRateLimits', () => {
      const { result } = renderHook(() => useStoreValue('apiRateLimits'));
      expect(result.current).toBeNull();
    });
  });

  describe('updateSettings', () => {
    beforeEach(() => {
      // Reset to default
      globalState.setState({ settings: defaultSettings });
    });

    it('should update settings with flat key', () => {
      updateSettings({ language: 'fr' });

      expect(globalState.getState().settings.language).toBe('fr');
    });

    it('should update nested settings', () => {
      updateSettings({ 'editor.fontSize': 14 } as Record<string, unknown>);

      expect(globalState.getState().settings.editor.fontSize).toBe(14);
    });

    it('should handle multiple updates', () => {
      updateSettings({ language: 'es', 'editor.fontSize': 16 } as Record<string, unknown>);

      const settings = globalState.getState().settings;
      expect(settings.language).toBe('es');
      expect(settings.editor.fontSize).toBe(16);
    });

    it('should update theme setting', () => {
      updateSettings({ theme: 'dark' });

      expect(globalState.getState().settings.theme).toBe('dark');
    });

    it('should update sidebarCollapsedByDefault', () => {
      updateSettings({ sidebarCollapsedByDefault: true });

      expect(globalState.getState().settings.sidebarCollapsedByDefault).toBe(true);
    });

    it('should update ai settings', () => {
      updateSettings({ 'ai.activeAiProvider': 'claude' } as Record<string, unknown>);

      expect(globalState.getState().settings.ai.activeAiProvider).toBe('claude');
    });
  });
});
