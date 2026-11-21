import { EXTENSION_TO_LANGUAGE } from '@/constants/language-extensions.ts';

export const MIME_BY_EXTENSION: Record<string, string> = {
  pdf: 'application/pdf',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  svg: 'image/svg+xml',
  json: 'application/json',
  csv: 'text/csv',
  tsv: 'text/tab-separated-values',
};

export function guessMimeType(extension: string): string {
  return MIME_BY_EXTENSION[extension] || 'text/plain';
}

export function guessLanguage(extension: string): string {
  return EXTENSION_TO_LANGUAGE[extension] || 'Text';
}

export function buildGitlabDescription(title: string, description: string): string {
  const safeTitle = title || '';
  const safeDescription = description || '';

  if (!safeDescription) {
    return safeTitle;
  }

  const titleClean = safeTitle.endsWith('...') ? safeTitle.slice(0, -3) : safeTitle;
  if (safeDescription.includes(titleClean)) {
    return safeDescription;
  }
  if (safeTitle.includes(safeDescription)) {
    return safeTitle;
  }

  return `${safeTitle}\n${safeDescription}`;
}
