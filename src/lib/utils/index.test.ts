import { describe, it, expect, vi, beforeEach } from 'vitest';
import { z } from 'zod';

import { cn, copyToClipboard, formatZodErrors, getEditorTheme } from './index';

import { globalState } from '@/lib/store/globalState.ts';

describe('cn', () => {
  it('joins multiple class names into a single string', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2');
  });

  it('filters out falsy values', () => {
    expect(cn('class1', undefined, null, false, 'class2')).toBe('class1 class2');
  });

  it('returns an empty string when no valid classes are provided', () => {
    expect(cn(undefined, null, false)).toBe('');
  });
});

describe('copyToClipboard', () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn(),
      },
    });
  });
  it('copies text to clipboard successfully', async () => {
    const mockWriteText = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue();
    await copyToClipboard('test text');
    expect(mockWriteText).toHaveBeenCalledWith('test text');
  });

  it('throws an error when clipboard write fails', async () => {
    vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValue(new Error('Clipboard error'));
    await expect(copyToClipboard('test text')).rejects.toThrow('Clipboard error');
  });
});

describe('formatZodErrors', () => {
  it('formats Zod errors into a record of field paths and messages', () => {
    const errors: z.ZodIssue[] = [
      { path: ['field1'], message: 'Error 1', code: 'custom' },
      { path: ['field2'], message: 'Error 2', code: 'custom' },
      { path: ['field1'], message: 'Error 3', code: 'custom' },
    ];
    expect(formatZodErrors(errors)).toEqual({
      field1: ['Error 1', 'Error 3'],
      field2: ['Error 2'],
    });
  });

  it('returns an empty object when no errors are provided', () => {
    expect(formatZodErrors([])).toEqual({});
  });
});

describe('getEditorTheme', () => {
  it('returns "vs-dark" when system theme is dark', () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: true } as MediaQueryList);
    vi.spyOn(globalState, 'getState').mockReturnValue({
      // @ts-expect-error not all provided
      settings: {
        theme: 'system',
      },
    });
    expect(getEditorTheme()).toBe('vs-dark');
  });

  it('returns "light" when system theme is light', () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: false } as MediaQueryList);
    vi.spyOn(globalState, 'getState').mockReturnValue({
      // @ts-expect-error not all provided
      settings: { theme: 'system' },
    });
    expect(getEditorTheme()).toBe('light');
  });

  it('returns "vs-dark" when user theme is set to dark', () => {
    vi.spyOn(globalState, 'getState').mockReturnValue({
      // @ts-expect-error not all provided
      settings: {
        theme: 'dark',
      },
    });
    expect(getEditorTheme()).toBe('vs-dark');
  });

  it('returns "light" when user theme is set to light', () => {
    vi.spyOn(globalState, 'getState').mockReturnValue({
      // @ts-expect-error not all provided
      settings: { theme: 'light' },
    });
    expect(getEditorTheme()).toBe('light');
  });
});
