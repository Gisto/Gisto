import { useEffect, useState } from 'react';

import { Store } from './store.ts';

import { GistEnrichedType } from '@/types/gist.ts';

const SETTINGS_STORAGE_KEY = 'gisto-app-settings';

export type StoreStateType = {
  user: Record<string, unknown> | null;
  isLoggedIn: boolean;
  snippets: GistEnrichedType[] | [];
  search: string;
  apiRateLimits: {
    limit: number;
    remaining: number;
    reset: string;
  } | null;
  settings: {
    language: 'en' | 'fr' | 'es' | 'de' | 'it' | 'ru' | 'zh' | 'ja';
    theme: 'system' | 'light' | 'dark';
    newSnippetDefaultLanguage: string;
    sidebarCollapsedByDefault: boolean;
    filesCollapsedByDefault: boolean;
    newSnippetPublicByDefault: boolean;
    jsonPreviewCollapsedByDefault: boolean;
    filesPreviewEnabledByDefault: boolean;
    sortFilesByMarkdownFirst: boolean;
    editor: {
      fontFamily: string;
      fontLigatures: boolean;
      fontSize: number;
      lineHeight: number;
      tabSize: number;
      insertSpaces: boolean;
      detectIndentation: boolean;
      wordWrap: 'wordWrapColumn' | 'on' | 'off' | 'bounded';
      wordWrapColumn: number;
      lineNumbers: 'on' | 'off';
      formatOnPaste: boolean;
      formatOnType: boolean;
      codeLens: boolean;
      smoothScrolling: boolean;
      renderWhitespace: 'none' | 'boundary' | 'selection' | 'trailing' | 'all';
      renderLineHighlight: 'all' | 'line' | 'none' | 'gutter';
      minimap: { enabled: boolean };
    };
    ai: {
      activeAiProvider: 'openrouter' | 'openai' | 'gemini' | 'claude';
      geminiApiKey?: string;
      openRouterApiKey?: string;
      openaiApiKey?: string;
      claudeApiKey?: string;
      model: string;
      temperature: number;
      cleanJson: boolean;
    };
    activeSnippetProvider: 'github' | 'gitlab';
  };
};

export type SettingsType = StoreStateType['settings'];

function saveSettingsToLocalStorage(settings: SettingsType) {
  if (typeof localStorage === 'undefined') return;

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

function migrateSettings(settings: Record<string, unknown>): SettingsType {
  // Migrate old API key structure to new AI section
  if (settings.geminiApiKey || settings.openRouterApiKey || settings.openaiApiKey) {
    if (!settings.ai) {
      settings.ai = {};
    }
    const ai = settings.ai as Record<string, unknown>;
    if (settings.geminiApiKey && !ai.geminiApiKey) {
      ai.geminiApiKey = settings.geminiApiKey;
    }
    if (settings.openRouterApiKey && !ai.openRouterApiKey) {
      ai.openRouterApiKey = settings.openRouterApiKey;
    }
    if (settings.openaiApiKey && !ai.openaiApiKey) {
      ai.openaiApiKey = settings.openaiApiKey;
    }
    // Remove old keys
    delete settings.geminiApiKey;
    delete settings.openRouterApiKey;
    delete settings.openaiApiKey;
  }

  // NOTE: cleanJson, model and temperature are intentional settings — do not remove them during migration.

  return settings as SettingsType;
}

function loadSettingsFromLocalStorage() {
  if (typeof localStorage === 'undefined') {
    return defaultSettings;
  }

  const storedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
  const parsedSettings = storedSettings ? JSON.parse(storedSettings) : null;

  if (!parsedSettings) {
    return defaultSettings;
  }

  const migrated = migrateSettings(parsedSettings);
  return deepMerge({ ...defaultSettings }, migrated);
}

export const defaultSettings: SettingsType = {
  theme: 'system',
  language: 'en',
  newSnippetDefaultLanguage: 'Text',
  sidebarCollapsedByDefault: false,
  filesCollapsedByDefault: false,
  newSnippetPublicByDefault: false,
  jsonPreviewCollapsedByDefault: true,
  filesPreviewEnabledByDefault: true,
  sortFilesByMarkdownFirst: false,
  editor: {
    fontFamily: 'monospace',
    fontLigatures: false,
    fontSize: 13,
    lineHeight: 20,
    tabSize: 2,
    insertSpaces: true,
    detectIndentation: true,
    wordWrap: 'wordWrapColumn',
    wordWrapColumn: 80,
    lineNumbers: 'on',
    formatOnPaste: true,
    formatOnType: true,
    codeLens: false,
    smoothScrolling: true,
    renderWhitespace: 'selection',
    renderLineHighlight: 'line',
    minimap: { enabled: false },
  },
  ai: {
    activeAiProvider: 'openrouter',
    geminiApiKey: '',
    openRouterApiKey: '',
    openaiApiKey: '',
    claudeApiKey: '',
    model: 'meta-llama/llama-3.2-3b-instruct:free',
    temperature: 0.7,
    cleanJson: true,
  },
  activeSnippetProvider: 'github',
};

export const globalState = new Store<StoreStateType>({
  user: null,
  isLoggedIn: false,
  snippets: [],
  search: '',
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
