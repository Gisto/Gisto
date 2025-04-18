import { vi } from 'vitest';

export const mockUtils = () => {
  vi.mock('@/lib/utils', () => ({
    copyToClipboard: vi.fn(),
    cn: vi.fn(),
    getEditorTheme: vi.fn(() => 'light'),
    randomString: vi.fn(() => 'mock-random-string'),
    fetchAndUpdateSnippets: vi.fn(),
    upperCaseFirst: vi.fn(),
  }));
};
