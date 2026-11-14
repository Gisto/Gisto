import { DocMode } from './manifest.ts';
import { findKindFile, KIND_FILENAMES } from './registry.ts';

import { DocEntry, SnippetFileType } from '@/types/snippet.ts';

export const DOC_FILENAME = KIND_FILENAMES.doc;

const fenceRegex = /^```([\w+#.-]*)\s*$/;
const sectionRegex = /^##(?!#)\s+(.+?)\s*$/;
const entryRegex = /^###(?!#)\s+(.+?)\s*$/;

/**
 * Shared markdown format for both doc modes:
 *
 *   ## Section        (optional grouping)
 *   ### Entry title
 *   prose description
 *   ```lang
 *   code
 *   ```
 *
 * In `reference` mode entries are looked up by section; in `ordered` mode they
 * are a sequence, so untitled entries fall back to their position.
 */
export const parseDoc = (content: string, mode: DocMode = 'reference'): DocEntry[] => {
  const entries: DocEntry[] = [];

  let section = '';
  let title = '';
  let description: string[] = [];
  let code: string[] | null = null;
  let language = '';
  let hasBlock = false;

  const commit = () => {
    const trimmedTitle = title.trim();
    const prose = description.join('\n').trim();
    const block = code ? code.join('\n').trim() : '';

    if (trimmedTitle || prose || block) {
      entries.push({
        id: crypto.randomUUID(),
        section: section.trim(),
        title:
          trimmedTitle ||
          (mode === 'ordered' ? '' : prose.split('\n')[0] || block.split('\n')[0] || ''),
        description: trimmedTitle ? prose : '',
        code: block,
        language,
      });
    }

    title = '';
    description = [];
    code = null;
    language = '';
    hasBlock = false;
  };

  for (const line of content.split('\n')) {
    const fence = line.match(fenceRegex);

    if (fence) {
      if (code === null) {
        code = [];
        language = fence[1].toLowerCase();
        hasBlock = true;
      } else {
        commit();
      }
      continue;
    }

    if (code !== null) {
      code.push(line);
      continue;
    }

    const sectionMatch = line.match(sectionRegex);
    if (sectionMatch) {
      commit();
      section = sectionMatch[1].trim();
      continue;
    }

    const entryMatch = line.match(entryRegex);
    if (entryMatch) {
      commit();
      title = entryMatch[1].trim();
      hasBlock = true;
      continue;
    }

    if (hasBlock && line.trim()) {
      description.push(line.trim());
    }
  }

  commit();

  return entries;
};

/** Shared with the doc view so parsing and rendering agree on what an entry is. */
export const isDocEntry = (entry: DocEntry): boolean =>
  Boolean(entry.title.trim() || entry.description.trim() || entry.code.trim());

const visible = (entries: DocEntry[]) => entries.filter(isDocEntry);

/**
 * Completion keys for doc entries. Titles are used when unique so renaming keeps
 * state; duplicates and untitled entries fall back to their position.
 */
export const docEntryKeys = (entries: DocEntry[]): string[] => {
  const counts = new Map<string, number>();

  entries.forEach((entry) => {
    const title = entry.title.trim();
    if (title) counts.set(title, (counts.get(title) ?? 0) + 1);
  });

  return entries.map((entry, index) => {
    const title = entry.title.trim();
    return title && counts.get(title) === 1 ? title : `#${index}`;
  });
};

export const serializeDoc = (entries: DocEntry[]): string => {
  const parts: string[] = [];
  let section = '';

  const openSection = (next: string) => {
    if (next === section) return;
    section = next;
    if (section) parts.push(`## ${section}`);
  };

  visible(entries).forEach((entry) => {
    openSection(entry.section.trim());

    if (entry.title.trim()) {
      parts.push(`### ${entry.title.trim()}`);
    }

    if (entry.description.trim()) {
      parts.push(entry.description.trim());
    }

    if (entry.code.trim()) {
      parts.push(['```' + entry.language.trim(), entry.code.trim(), '```'].join('\n'));
    }
  });

  return parts.length ? `${parts.join('\n\n')}\n` : '';
};

export const findDocFile = (files: Record<string, SnippetFileType>): SnippetFileType | undefined =>
  findKindFile(files, 'doc');
