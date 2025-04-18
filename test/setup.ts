import { vi } from 'vitest';

import * as en from '../public/locales/en.json';

vi.mock('@/lib/i18n', () => ({
  t: vi.fn((key: string, params?: Record<string, unknown>) => {
    const flattenTranslations = (obj: unknown, prefix = ''): Record<string, unknown> =>
      Object.keys(obj).reduce(
        (acc, k) => {
          const pre = prefix ? `${prefix}.` : '';
          if (typeof obj[k] === 'object') {
            Object.assign(acc, flattenTranslations(obj[k], pre + k));
          } else {
            acc[pre + k] = obj[k];
          }
          return acc;
        },
        {} as Record<string, string>
      );

    const translations = flattenTranslations(en);

    let translation = String(translations[key] || key);
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        translation = translation.replace(`{${paramKey}}`, String(paramValue));
      });
    }
    return translation;
  }),
}));
