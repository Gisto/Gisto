import { useEffect, useState } from 'react';

import { Store } from './store.ts';

import { GistEnrichedType } from '@/types/gist.ts';

const SETTINGS_STORAGE_KEY = 'gisto-app-settings';

type StoreStateType = {
  user: Record<string, unknown> | null;
  isLoggedIn: boolean;
  snippets: GistEnrichedType[] | [];
  apiRateLimits: {
    limit: number;
    remaining: number;
    reset: string;
  } | null;
  settings: {
    theme: 'system' | 'light' | 'dark';
    notificationPosition: string;
    sidebarCollapsedByDefault: boolean;
    filesCollapsedByDefault: boolean;
    newSnippetPublicByDefault: boolean;
    editor: {
      fontFamily: string;
      lineNumbers: 'on' | 'off';
      fontSize: number;
      codeLens: boolean;
      minimap: { enabled: boolean };
    };
  };
};

function saveSettingsToLocalStorage(settings: StoreStateType['settings']) {
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
}

function loadSettingsFromLocalStorage(): StoreStateType['settings'] | null {
  const storedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
  return storedSettings ? JSON.parse(storedSettings) : null;
}

const initialSettings = loadSettingsFromLocalStorage() || {
  theme: 'system',
  notificationPosition: 'bottom-right',
  sidebarCollapsedByDefault: false,
  filesCollapsedByDefault: false,
  newSnippetPublicByDefault: false,
  editor: {
    fontFamily: 'monospace',
    fontSize: 13,
    codeLens: false,
    minimap: { enabled: false },
    lineNumbers: 'on',
  },
};

export const globalState = new Store<StoreStateType>({
  user: null,
  isLoggedIn: false,
  snippets: [],
  apiRateLimits: null,
  settings: initialSettings,
});

if (import.meta.env.MODE !== 'production') {
  // @ts-expect-error I just need this, let me :)
  window.globalState = globalState;
}

export function useStoreValue<K extends keyof StoreStateType>(store: K) {
  const [value, setValue] = useState<StoreStateType[K]>(globalState.getState()[store]);

  useEffect(() => {
    return globalState.subscribe((state) => setValue(state[store]));
  }, [store]);

  return value;
}

export function updateSettings(newSettings: Partial<StoreStateType['settings']>) {
  const currentSettings = globalState.getState().settings;
  const updatedSettings = { ...currentSettings, ...newSettings };
  globalState.setState({ settings: updatedSettings });
}

globalState.subscribe((state) => {
  saveSettingsToLocalStorage(state.settings);
});
