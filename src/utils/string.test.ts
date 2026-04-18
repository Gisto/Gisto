import { describe, it, expect } from 'vitest';

import {
  upperCaseFirst,
  camelToTitleCase,
  snakeToTitleCase,
  randomString,
  getFlagEmojiFromLanguage,
  getCountryNameFromLanguage,
} from './string.ts';

describe('upperCaseFirst', () => {
  it('converts the first character to uppercase', () => {
    expect(upperCaseFirst('hello')).toBe('Hello');
  });

  it('handles an already capitalized string', () => {
    expect(upperCaseFirst('Hello')).toBe('Hello');
  });

  it('handles an empty string', () => {
    expect(upperCaseFirst('')).toBe('');
  });

  it('handles a string with mixed case', () => {
    expect(upperCaseFirst('hELLO')).toBe('Hello');
  });
});

describe('camelToTitleCase', () => {
  it('converts camelCase to title case', () => {
    expect(camelToTitleCase('camelCaseText')).toBe('Camel Case Text');
  });

  it('handles a single word', () => {
    expect(camelToTitleCase('word')).toBe('Word');
  });

  it('handles an empty string', () => {
    expect(camelToTitleCase('')).toBe('');
  });

  it('handles a string with no uppercase letters', () => {
    expect(camelToTitleCase('lowercase')).toBe('Lowercase');
  });
});

describe('snakeToTitleCase', () => {
  it('converts snake_case to title case', () => {
    expect(snakeToTitleCase('snake_case_text')).toBe('Snake case text');
  });

  it('converts kebab-case to title case', () => {
    expect(snakeToTitleCase('kebab-case-text')).toBe('Kebab case text');
  });

  it('handles an empty string', () => {
    expect(snakeToTitleCase('')).toBe('');
  });

  it('handles a string with no underscores or dashes', () => {
    expect(snakeToTitleCase('text')).toBe('Text');
  });
});

describe('randomString', () => {
  it('generates a string of the specified length', () => {
    expect(randomString(3)).toHaveLength(3);
  });

  it('generates a string of default length when no argument is provided', () => {
    expect(randomString()).toHaveLength(5);
  });

  it('generates a string containing only lowercase letters', () => {
    expect(randomString(4)).toMatch(/^[a-z]+$/);
  });

  it('handles a length of zero', () => {
    expect(randomString(0)).toBe('');
  });
});

describe('getFlagEmojiFromLanguage', () => {
  it('returns flag emoji for en', () => {
    expect(getFlagEmojiFromLanguage('en')).toBe('🇺🇸');
  });

  it('returns flag emoji for zh', () => {
    expect(getFlagEmojiFromLanguage('zh')).toBe('🇨🇳');
  });

  it('returns flag emoji for ja', () => {
    expect(getFlagEmojiFromLanguage('ja')).toBe('🇯🇵');
  });

  it('returns flag emoji for ko', () => {
    expect(getFlagEmojiFromLanguage('ko')).toBe('🇰🇷');
  });

  it('returns flag emoji for ru', () => {
    expect(getFlagEmojiFromLanguage('ru')).toBe('🇷🇺');
  });

  it('returns flag emoji for hi', () => {
    expect(getFlagEmojiFromLanguage('hi')).toBe('🇮🇳');
  });

  it('returns flag emoji for sv', () => {
    expect(getFlagEmojiFromLanguage('sv')).toBe('🇸🇪');
  });

  it('throws for invalid language code', () => {
    expect(() => getFlagEmojiFromLanguage('')).toThrow();
    expect(() => getFlagEmojiFromLanguage('abc')).toThrow();
  });
});

describe('getCountryNameFromLanguage', () => {
  it('returns English name for en', () => {
    expect(getCountryNameFromLanguage('en')).toBe('English');
  });

  it('returns Chinese for zh', () => {
    expect(getCountryNameFromLanguage('zh')).toBe('Chinese');
  });

  it('returns Japanese for ja', () => {
    expect(getCountryNameFromLanguage('ja')).toBe('Japanese');
  });

  it('returns Korean for ko', () => {
    expect(getCountryNameFromLanguage('ko')).toBe('Korean');
  });

  it('handles unknown language gracefully', () => {
    expect(getCountryNameFromLanguage('xyz')).toBeDefined();
  });
});
