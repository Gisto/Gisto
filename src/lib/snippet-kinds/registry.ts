import { SnippetFileType, StructuredSnippetKind } from '@/types/snippet.ts';

export const KIND_FILENAMES: Record<StructuredSnippetKind, string> = {
  todo: 'todo.md',
  kanban: 'board.json',
  doc: 'doc.md',
  flashcards: 'cards.json',
};

export const KIND_LANGUAGES: Record<StructuredSnippetKind, string> = {
  todo: 'Markdown',
  kanban: 'JSON',
  doc: 'Markdown',
  flashcards: 'JSON',
};

export const STRUCTURED_SNIPPET_KINDS = Object.keys(KIND_FILENAMES) as StructuredSnippetKind[];

export const isStructuredSnippetKind = (kind: string): kind is StructuredSnippetKind =>
  (STRUCTURED_SNIPPET_KINDS as string[]).includes(kind);

/** Data-file lookup shared by every structured kind. */
export const findKindFile = (
  files: Record<string, SnippetFileType>,
  kind: StructuredSnippetKind
): SnippetFileType | undefined =>
  Object.values(files).find((file) => file.filename === KIND_FILENAMES[kind]);

export type SnippetFileContent = Record<string, { content: string }>;

/**
 * Local providers replace the whole file map, so keep only `content` for the
 * existing files and write the kind data file under its registered filename.
 */
export const withKindFile = (
  files: Record<string, SnippetFileType>,
  kind: StructuredSnippetKind,
  content: string
): SnippetFileContent => ({
  ...Object.fromEntries(
    Object.values(files).map((file) => [file.filename, { content: file.content ?? '' }])
  ),
  [KIND_FILENAMES[kind]]: { content },
});

/** Markdown files are detected by extension, unless a language is known. */
export const isMarkdownContent = (file: SnippetFileType): boolean => {
  const language = typeof file.language === 'string' ? file.language : '';

  if (language) return language === 'Markdown';
  return file.filename.toLowerCase().endsWith('.md');
};

/** Stable file order for the snippet viewer. */
export const sortSnippetFiles = (
  filenames: string[],
  files: Record<string, SnippetFileType>,
  markdownFirst: boolean
): string[] => {
  if (!markdownFirst) return filenames;

  const isMarkdown = (name: string) =>
    isMarkdownContent(files[name] ?? ({ filename: name } as SnippetFileType));

  return [...filenames].sort((a, b) => {
    const markdownA = isMarkdown(a);
    const markdownB = isMarkdown(b);

    if (markdownA === markdownB) return 0;
    return markdownA ? -1 : 1;
  });
};
