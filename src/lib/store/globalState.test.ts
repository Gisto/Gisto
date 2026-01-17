import { renderHook, waitFor, act } from '@testing-library/react';
import { vi } from 'vitest';

import { globalState, useStoreValue, updateSettings, defaultSettings } from './globalState';

describe('globalState', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
  });
});
