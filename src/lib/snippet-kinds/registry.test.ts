import {
  KIND_FILENAMES,
  TODO_FILENAME,
  KANBAN_FILENAME,
  DOC_FILENAME,
  FLASHCARDS_FILENAME,
  MANIFEST_FILENAME,
  KIND_LANGUAGES,
  STRUCTURED_SNIPPET_KINDS,
  isStructuredSnippetKind,
  isKanbanCard,
  isDocEntry,
  isMarkdownContent,
  parseColumns,
  sortSnippetFiles,
} from './index.ts';

import { DocEntry, KanbanCard, SnippetFileType } from '@/types/snippet.ts';

describe('kind filename registry', () => {
  it('derives per-kind filename constants from a single source', () => {
    expect(TODO_FILENAME).toBe(KIND_FILENAMES.todo);
    expect(KANBAN_FILENAME).toBe(KIND_FILENAMES.kanban);
    expect(DOC_FILENAME).toBe(KIND_FILENAMES.doc);
    expect(FLASHCARDS_FILENAME).toBe(KIND_FILENAMES.flashcards);
  });

  it('uses distinct filenames so kind data files never collide', () => {
    const filenames = STRUCTURED_SNIPPET_KINDS.map((kind) => KIND_FILENAMES[kind]);

    expect(new Set(filenames).size).toBe(filenames.length);
    expect(new Set([...filenames, MANIFEST_FILENAME]).size).toBe(filenames.length + 1);
  });

  it('registers a language for every structured kind', () => {
    STRUCTURED_SNIPPET_KINDS.forEach((kind) => {
      expect(KIND_LANGUAGES[kind]).toBeTruthy();
    });
  });

  it('treats only non-snippet kinds as structured', () => {
    STRUCTURED_SNIPPET_KINDS.forEach((kind) => {
      expect(isStructuredSnippetKind(kind)).toBe(true);
    });

    expect(isStructuredSnippetKind('snippet')).toBe(false);
    expect(isStructuredSnippetKind('nope')).toBe(false);
  });
});

describe('shared content predicates', () => {
  it('accepts kanban cards with a title or description only', () => {
    expect(isKanbanCard({ title: 'a', description: '', labels: [] })).toBe(true);
    expect(isKanbanCard({ title: '', description: 'b', labels: [] })).toBe(true);
    expect(isKanbanCard({ title: ' ', description: '  ', labels: [] })).toBe(false);
  });

  it('accepts doc entries with a title, description or code only', () => {
    const entry = (patch: Partial<DocEntry>): DocEntry => ({
      id: '1',
      section: '',
      title: '',
      description: '',
      code: '',
      language: '',
      ...patch,
    });

    expect(isDocEntry(entry({ title: 'a' }))).toBe(true);
    expect(isDocEntry(entry({ description: 'b' }))).toBe(true);
    expect(isDocEntry(entry({ code: 'c' }))).toBe(true);
    expect(isDocEntry(entry({}))).toBe(false);
  });

  it('only treats markdown languages as markdown', () => {
    expect(isMarkdownContent({ filename: 'a.md' } as SnippetFileType)).toBe(true);
    expect(isMarkdownContent({ filename: 'a', language: 'Markdown' } as SnippetFileType)).toBe(
      true
    );
    expect(isMarkdownContent({ filename: 'a.md', language: 'JSON' } as SnippetFileType)).toBe(
      false
    );
    expect(isMarkdownContent({ filename: 'a.txt', language: 'Text' } as SnippetFileType)).toBe(
      false
    );
  });
});

describe('parseColumns', () => {
  it('drops empty cards and columns while keeping populated ones', () => {
    const columns = parseColumns(
      JSON.stringify({
        columns: [
          {
            title: 'Todo',
            cards: [
              { title: 'one', description: '', labels: [] },
              { title: '', description: '', labels: [] },
            ],
          },
          { title: '', cards: [] },
        ],
      })
    );

    expect(columns).toEqual([
      {
        id: expect.any(String),
        title: 'Todo',
        cards: [{ title: 'one', description: '', labels: [] }],
      },
    ]);
  });

  it('keeps untitled columns that still hold cards', () => {
    const [column] = parseColumns(
      JSON.stringify({
        columns: [{ title: '', cards: [{ title: 'x', description: '', labels: [] }] }],
      })
    );

    expect(column?.cards).toHaveLength(1);
  });

  it('returns nothing for malformed content', () => {
    expect(parseColumns('not json')).toEqual([]);
    expect(parseColumns('{"columns":"nope"}')).toEqual([]);
  });
});

describe('kind data shape', () => {
  it('keeps the kanban card helper aligned with serialization', () => {
    const card: KanbanCard = { title: 'a', description: '', labels: [] };
    expect(isKanbanCard(card)).toBe(true);
  });
});
describe('sortSnippetFiles', () => {
  const files = {
    'b.json': { filename: 'b.json', language: 'JSON' },
    'a.md': { filename: 'a.md', language: 'Markdown' },
    'c.txt': { filename: 'c.txt', language: 'Text' },
    d: { filename: 'd', language: 'Markdown' },
  } as unknown as Record<string, SnippetFileType>;

  it('puts markdown first when the setting is on', () => {
    expect(sortSnippetFiles(Object.keys(files), files, true)).toEqual([
      'a.md',
      'd',
      'b.json',
      'c.txt',
    ]);
  });

  it('keeps the original order when the setting is off', () => {
    expect(sortSnippetFiles(Object.keys(files), files, false)).toEqual([
      'b.json',
      'a.md',
      'c.txt',
      'd',
    ]);
  });
});
