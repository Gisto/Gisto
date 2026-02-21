import { vi } from 'vitest';

export const mockUtils = () => {
  vi.mock('@/utils', () => ({
    copyToClipboard: vi.fn(),
    cn: vi.fn(),
    getEditorTheme: vi.fn(() => 'light'),
    randomString: vi.fn(() => 'mock-random-string'),
    upperCaseFirst: vi.fn(),
    formatZodErrors: vi.fn(),
    fetchAndUpdateSnippets: vi.fn(),
    getTags: vi.fn(),
    removeTags: vi.fn(),
    getLanguageName: vi.fn(),
    previewAvailable: vi.fn(),
    searchFilter: vi.fn(),
    getAllTags: vi.fn(),
    getAllLanguages: vi.fn(),
  }));
};
