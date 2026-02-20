import { SettingsType } from '@/lib/store/globalState.ts';

export const upperCaseFirst = (text: string) => {
  const str = text.toLowerCase();
  return String(str).charAt(0).toUpperCase() + String(str).slice(1);
};

export const camelToTitleCase = (text: string) =>
  text
    .replace(/([A-Z])/g, (match) => ` ${match}`)
    .replace(/^./, (match) => match.toUpperCase())
    .trim();

export const snakeToTitleCase = (text: string) =>
  upperCaseFirst(text.replace(/[_-]/g, ' ').trim().toLowerCase());

export const randomString = (charsCount = 5) => {
  const charset = 'abcdefghijklmnopqrstuvwxyz';
  const array = new Uint8Array(charsCount);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => charset[byte % charset.length]).join('');
};

const languageOverrides: Record<string, string> = {
  en: 'US',
  zh: 'CN',
  ja: 'JP',
  ko: 'KR',
  ru: 'RU',
  hi: 'IN',
  sv: 'SE',
};

const getCountryCodeFromLanguage = (langCode: string): string => {
  if (!langCode || langCode.length !== 2) {
    throw new Error('Language code must be a 2-letter string');
  }

  return (languageOverrides[langCode.toLowerCase()] || langCode).toUpperCase();
};

export const getFlagEmojiFromLanguage = (langCode: string): string => {
  const countryCode = getCountryCodeFromLanguage(langCode);
  const OFFSET = 0x1f1e6 - 'A'.charCodeAt(0);

  const firstChar = String.fromCodePoint(countryCode.charCodeAt(0) + OFFSET);
  const secondChar = String.fromCodePoint(countryCode.charCodeAt(1) + OFFSET);

  return firstChar + secondChar;
};

export const getCountryNameFromLanguage = (
  langCode: string,
  locale: SettingsType['language'] = 'en'
): string => {
  const displayNames = new Intl.DisplayNames([locale], { type: 'language' });
  return displayNames.of(langCode)
    ? upperCaseFirst(displayNames.of(langCode) as string)
    : 'Unknown';
};
