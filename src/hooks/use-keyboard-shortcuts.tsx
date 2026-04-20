import { useState } from 'react';

import { useKeyboardShortcuts } from '@/constants/shortcuts.ts';

export function useKeybindings(enabled = true) {
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);

  const { navigate } = useKeyboardShortcuts(enabled, setShowCommandPalette, setShowShortcutsModal);

  return {
    showShortcutsModal,
    setShowShortcutsModal,
    showCommandPalette,
    setShowCommandPalette,
    navigate,
  };
}
