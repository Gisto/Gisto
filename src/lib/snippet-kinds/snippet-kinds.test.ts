import {
  parseDoc,
  serializeDoc,
  getSnippetKind,
  findDocFile,
  docEntryKeys,
  findKindFile,
  withKindFile,
  isStructuredSnippetKind,
  getManifest,
  isOrderedDoc,
  getDocDone,
  serializeManifest,
  KIND_FILENAMES,
} from './index.ts';

import { SnippetFileType } from '@/types/snippet.ts';

const filesOf = (...files: { filename: string; content: string }[]) =>
  Object.fromEntries(
    files.map((file) => [
      file.filename,
      { filename: file.filename, content: file.content } as SnippetFileType,
    ])
  );

describe('doc', () => {
  it('parses reference docs into sections and entries', () => {
    const content = [
      '## Git',
      '### Commit',
      'Record changes.',
      '```bash',
      'git commit -m "x"',
      '```',
      '### Stash',
      '```sh',
      'git stash',
      '```',
    ].join('\n');

    expect(
      parseDoc(content).map(({ section, title, description, code, language }) => ({
        section,
        title,
        description,
        code,
        language,
      }))
    ).toEqual([
      {
        section: 'Git',
        title: 'Commit',
        description: 'Record changes.',
        code: 'git commit -m "x"',
        language: 'bash',
      },
      { section: 'Git', title: 'Stash', description: '', code: 'git stash', language: 'sh' },
    ]);
  });

  it('ignores preamble before the first section and untitled blocks', () => {
    expect(parseDoc('intro text\n\n## Section')).toEqual([]);
    expect(parseDoc('## Section\n### Entry')).toEqual([
      expect.objectContaining({ section: 'Section', title: 'Entry' }),
    ]);
  });

  it('keeps ordered entries untitled so progress can key on position', () => {
    const content = ['## Setup', '```bash', 'npm ci', '```', '```bash', 'npm test', '```'].join(
      '\n'
    );

    expect(parseDoc(content, 'ordered').map((entry) => entry.title)).toEqual(['', '']);
    expect(parseDoc(content, 'reference').map((entry) => entry.title)).toEqual([
      'npm ci',
      'npm test',
    ]);
  });

  it('keeps section-less entries when serializing', () => {
    const content = serializeDoc([
      { id: '1', section: 'Git', title: 'A', description: '', code: 'a', language: 'bash' },
      { id: '2', section: '', title: 'B', description: 'no section', code: '', language: '' },
    ]);

    expect(content).toBe('## Git\n\n### A\n\n```bash\na\n```\n\n### B\n\nno section\n');
    expect(parseDoc(content)).toHaveLength(2);
  });

  it('round-trips sections and code fences', () => {
    const content = serializeDoc([
      { id: '1', section: 'Git', title: 'A', description: '', code: 'a', language: 'bash' },
      { id: '2', section: 'Git', title: 'B', description: 'b', code: '', language: '' },
      { id: '3', section: '', title: 'C', description: '', code: '', language: '' },
    ]);

    // entry "C" has a section-less title and no body, so it is kept but has no heading
    expect(content).toBe('## Git\n\n### A\n\n```bash\na\n```\n\n### B\n\nb\n\n### C\n');
    expect(parseDoc(content)).toHaveLength(3);
  });
});

describe('docEntryKeys', () => {
  const entry = (id: string, title: string) => ({
    id,
    section: '',
    title,
    description: '',
    code: '',
    language: '',
  });

  it('uses unique titles and falls back to position for duplicates or blanks', () => {
    const entries = [entry('a', 'Build'), entry('b', ''), entry('c', 'Test'), entry('d', 'Test')];

    expect(docEntryKeys(entries)).toEqual(['Build', '#1', '#2', '#3']);
  });

  it('uses titles when every entry is uniquely named', () => {
    expect(docEntryKeys([entry('a', 'One'), entry('b', 'Two')])).toEqual(['One', 'Two']);
  });
});

describe('manifest', () => {
  const manifest = (body: string) => filesOf({ filename: '.config-manifest.json', content: body });

  it('detects every kind from the manifest', () => {
    expect(getSnippetKind(manifest('{"type":"todo"}'))).toBe('todo');
    expect(getSnippetKind(manifest('{"type":"kanban"}'))).toBe('kanban');
    expect(getSnippetKind(manifest('{"type":"doc"}'))).toBe('doc');
    expect(getSnippetKind(manifest('{"type":"flashcards"}'))).toBe('flashcards');
    expect(getSnippetKind(manifest('{"type":"snippet"}'))).toBe('snippet');
    expect(getSnippetKind({})).toBe('snippet');
    expect(getSnippetKind(manifest('not json'))).toBe('snippet');
  });

  it('reads the ordered flag and done titles for docs', () => {
    expect(getManifest(manifest('{"type":"doc","ordered":true,"done":["Step one"]}'))).toEqual({
      type: 'doc',
      ordered: true,
      done: ['Step one'],
    });

    expect(isOrderedDoc(manifest('{"type":"doc","ordered":true}'))).toBe(true);
    expect(isOrderedDoc(manifest('{"type":"doc"}'))).toBe(false);
    expect(getDocDone(manifest('{"type":"doc","done":["a",2]}'))).toEqual(['a']);
    expect(getDocDone(manifest('{"type":"doc"}'))).toEqual([]);
  });

  it('omits empty optional fields when serializing', () => {
    expect(JSON.parse(serializeManifest({ type: 'doc' }))).toEqual({ type: 'doc' });
    expect(JSON.parse(serializeManifest({ type: 'doc', ordered: false }))).toEqual({
      type: 'doc',
      ordered: false,
    });
    expect(JSON.parse(serializeManifest({ type: 'doc', ordered: true, done: [] }))).toEqual({
      type: 'doc',
      ordered: true,
    });
    expect(JSON.parse(serializeManifest({ type: 'doc', ordered: true, done: ['a'] }))).toEqual({
      type: 'doc',
      ordered: true,
      done: ['a'],
    });
  });
});

describe('kind registry', () => {
  it('registers the doc data file', () => {
    const files = filesOf({ filename: 'doc.md', content: 'x' });

    expect(findDocFile(files)?.filename).toBe('doc.md');
    expect(findKindFile(files, 'doc')).toBeDefined();
    expect(KIND_FILENAMES.doc).toBe('doc.md');
    expect(isStructuredSnippetKind('doc')).toBe(true);
    expect(isStructuredSnippetKind('snippet')).toBe(false);
  });

  it('replaces the file map keeping only content for local providers', () => {
    const files = filesOf(
      { filename: 'a.md', content: 'keep' },
      { filename: 'doc.md', content: 'old' }
    );

    expect(withKindFile(files, 'doc', 'new')).toEqual({
      'a.md': { content: 'keep' },
      'doc.md': { content: 'new' },
    });
  });
});
