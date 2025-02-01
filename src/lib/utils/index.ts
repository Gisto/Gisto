import { z } from 'zod';

import { globalState } from '@/lib/store/globalState.ts';

export * from './string';
export * from './snippet';
export * from './search';

export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

export const copyToClipboard = (text: string) => navigator.clipboard.writeText(text);

export const formatZodErrors = (errors: z.ZodIssue[]): Record<string, string[]> => {
  return errors.reduce(
    (acc, error) => {
      const path = error.path.join('.');
      if (!acc[path]) {
        acc[path] = [];
      }
      acc[path].push(error.message);
      return acc;
    },
    {} as Record<string, string[]>
  );
};

export const getEditorTheme = () => {
  if (globalState.getState().settings.theme === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'vs-dark' : 'light';
  }

  return globalState.getState().settings.theme === 'dark' ? 'vs-dark' : 'light';
};
