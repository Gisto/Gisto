import { useEffect, useState } from 'react';

import { Store } from './store.ts';

import { GistEnrichedType } from '@/types/gist.ts';

const SETTINGS_STORAGE_KEY = 'gisto-app-settings';

export type StoreStateType = {
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
    newSnippetDefaultLanguage: string;
    sidebarCollapsedByDefault: boolean;
    filesCollapsedByDefault: boolean;
    newSnippetPublicByDefault: boolean;
    jsonPreviewCollapsedByDefault: boolean;
    editor: {
      fontFamily: string;
      fontLigatures: boolean;
      fontSize: number;
      tabSize: number;
      wordWrapColumn: number;
      lineNumbers: 'on' | 'off';
      formatOnPaste: boolean;
      codeLens: boolean;
      minimap: { enabled: boolean };
    };
  };
};

export type SettingsType = StoreStateType['settings'];

function saveSettingsToLocalStorage(settings: SettingsType) {
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
}

function deepMerge(target: Record<string, unknown>, source: Record<string, unknown>) {
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      if (!target[key]) {
        target[key] = {};
      }
      deepMerge(target[key] as Record<string, unknown>, source[key] as Record<string, unknown>);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

function loadSettingsFromLocalStorage() {
  const storedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
  const parsedSettings = storedSettings ? JSON.parse(storedSettings) : null;

  return parsedSettings ? deepMerge({ ...defaultSettings }, parsedSettings) : defaultSettings;
}

const defaultSettings: SettingsType = {
  theme: 'system',
  newSnippetDefaultLanguage: 'Text',
  sidebarCollapsedByDefault: false,
  filesCollapsedByDefault: false,
  newSnippetPublicByDefault: false,
  jsonPreviewCollapsedByDefault: true,
  editor: {
    fontFamily: 'monospace',
    fontLigatures: false,
    fontSize: 13,
    tabSize: 2,
    wordWrapColumn: 80,
    lineNumbers: 'on',
    formatOnPaste: true,
    codeLens: false,
    minimap: { enabled: false },
  },
};

export const globalState = new Store<StoreStateType>({
  user: null,
  isLoggedIn: false,
  snippets: [],
  apiRateLimits: null,
  settings: loadSettingsFromLocalStorage() as SettingsType,
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

export function updateSettings(newSettings: Partial<SettingsType>) {
  const currentSettings = globalState.getState().settings as SettingsType;
  const updatedSettings = { ...currentSettings };

  Object.entries(newSettings).forEach(([path, value]) => {
    if (path.includes('.')) {
      setNestedProperty(updatedSettings, path, value);
    } else {
      if (path in updatedSettings) {
        // @ts-expect-error TODO
        updatedSettings[path as string] = value;
      }
    }
  });

  globalState.setState({ settings: updatedSettings });
}

function setNestedProperty(obj: { [key: string]: unknown }, path: string, value: unknown): void {
  const keys = path.split('.');
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    // @ts-expect-error TODO
    current = current[keys[i]] = current[keys[i]] || {};
  }
  current[keys[keys.length - 1]] = value;
}

globalState.subscribe((state) => {
  saveSettingsToLocalStorage(state.settings);
});
