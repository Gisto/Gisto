import { useRouter } from 'dirty-react-router';
import { useEffect, useCallback } from 'react';

import { globalState } from '@/lib/store/globalState.ts';
import { fetchAndUpdateSnippets } from '@/utils';

export interface Shortcut {
  keys: string[];
  description: string;
}

export interface ShortcutCategory {
  category: string;
  items: Shortcut[];
}

export interface PaletteCommand {
  id: string;
  label: string;
  icon: string;
  shortcut: string;
  action: 'navigate' | 'reload';
  path?: string;
}

export const doReload = async () => {
  globalState.setState({ isLoading: true, snippets: [] });
  try {
    await fetchAndUpdateSnippets();
  } catch (error) {
    console.error('Error reloading snippets:', error);
  } finally {
    globalState.setState({ isLoading: false });
  }
};

export const paletteCommands: PaletteCommand[] = [
  {
    id: 'dashboard',
    label: 'Go to Dashboard',
    icon: 'home',
    shortcut: 'd',
    action: 'navigate',
    path: '/',
  },
  {
    id: 'new',
    label: 'Create New Snippet',
    icon: 'plus',
    shortcut: 'n',
    action: 'navigate',
    path: '/new-snippet',
  },
  {
    id: 'settings',
    label: 'Open Settings',
    icon: 'settings',
    shortcut: 's',
    action: 'navigate',
    path: '/settings',
  },
  {
    id: 'reload',
    label: 'Reload All Snippets',
    icon: 'refresh',
    shortcut: 'r',
    action: 'reload',
  },
];

const paletteShortcutItems: Shortcut[] = paletteCommands.map((cmd) => ({
  keys: [cmd.shortcut.toUpperCase()],
  description: cmd.label,
}));

export const shortcutsConfig: ShortcutCategory[] = [
  {
    category: 'Global',
    items: [
      { keys: ['Ctrl', 'K'], description: 'Open command palette' },
      { keys: ['?'], description: 'Show shortcuts help' },
      { keys: ['Esc'], description: 'Close modal / blur input' },
    ],
  },
  {
    category: 'Command Palette',
    items: [
      { keys: ['↑', '↓'], description: 'Navigate' },
      { keys: ['Enter'], description: 'Select' },
      ...paletteShortcutItems,
    ],
  },
  {
    category: 'Actions',
    items: [
      { keys: ['Ctrl', 'S'], description: 'Save snippet' },
      { keys: ['/'], description: 'Focus search' },
    ],
  },
];

export function useKeyboardShortcuts(
  enabled = true,
  setShowCommandPalette: (open: boolean) => void,
  setShowShortcutsModal: (open: boolean) => void
) {
  const { navigate } = useRouter();

  const handleGlobalKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const isMod = e.ctrlKey || e.metaKey;

      if (isMod && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowCommandPalette(true);
        return;
      }

      if (e.key === '?' || (isMod && e.key === '/')) {
        e.preventDefault();
        setShowShortcutsModal(true);
        return;
      }

      if (isMod && e.key.toLowerCase() === 's') {
        e.preventDefault();
        const saveButton = document.querySelector('[data-save-button]') as HTMLButtonElement;
        saveButton?.click();
        return;
      }

      if (!isMod && e.key === '/') {
        e.preventDefault();
        const searchInput = document.querySelector('[data-search-input]') as HTMLInputElement;
        searchInput?.focus();
        return;
      }

      if (e.key === 'Escape') {
        setShowShortcutsModal(false);
        setShowCommandPalette(false);
        const activeElement = document.activeElement as HTMLElement;
        if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
          activeElement.blur();
        }
        return;
      }
    },
    [setShowCommandPalette, setShowShortcutsModal]
  );

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [enabled, handleGlobalKeyDown]);

  return { navigate };
}
