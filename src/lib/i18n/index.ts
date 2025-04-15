import { globalState, SettingsType } from '@/lib/store/globalState';

let defaultTranslations: Record<string, unknown> = {};
let translations: Record<string, unknown> = {};

export const loadTranslations = async (lang: string): Promise<Record<string, unknown>> => {
  const url = `${window.location.origin}/locales/${lang}.json`;

  const res = await fetch(url);

  if (!res.ok) {
    console.error(`Failed to load translation file: ${url}`, lang);
    throw new Error(`Failed to load translation file: ${url}`);
  }

  return await res.json();
};

export const initI18n = async () => {
  const lang = globalState.getState().settings.language;
  translations = await loadTranslations(lang ?? 'en');
  defaultTranslations = await loadTranslations('en');
};

export const setLanguage = async (lang: SettingsType['language']) => {
  const currentLang = globalState.getState().settings.language;

  if (lang !== currentLang) {
    translations = await loadTranslations(lang);
    globalState.setState({
      settings: {
        ...globalState.getState().settings,
        language: lang,
      },
    });
  }
};

// @ts-expect-error I need this
window.setLanguage = setLanguage;

const _getTranslationValue = (obj: Record<string, unknown>, path: string): unknown => {
  return path
    .split('.')
    .reduce((acc: unknown, part) => (acc as Record<string, unknown>)?.[part], obj);
};

const getTranslationString = (
  obj: Record<string, unknown>,
  path: string,
  defaultObj: Record<string, unknown>
): string => {
  const result = _getTranslationValue(obj, path);

  if (result === undefined) {
    const defaultResult = _getTranslationValue(defaultObj, path);

    if (defaultResult === undefined) {
      throw new Error(`Translation key "${path}" not found.`);
    }

    return <string>defaultResult;
  }

  return <string>result;
};

export const t = (key: string, values?: Record<string, string | number>): string => {
  let translation = getTranslationString(translations, key, defaultTranslations);

  if (values) {
    Object.entries(values).forEach(([placeholder, value]) => {
      translation = translation.replace(new RegExp(`\\{${placeholder}\\}`, 'g'), String(value));
    });
  }

  return translation;
};
