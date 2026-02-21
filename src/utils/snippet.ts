import { snippetService } from '@/lib/providers/snippet-service.ts';
import { globalState } from '@/lib/store/globalState.ts';
import {
  SnippetEnrichedType,
  SnippetFileType,
  SnippetSingleType,
  SnippetType,
} from '@/types/snippet.ts';

const tagsRegex = /#(\d*[A-Za-z_\-0-9]+\d*)/g;

export const removeTags = (title: string) => {
  if (!title) {
    return 'unknown';
  }

  const tags = title.match(tagsRegex);
  return tags ? title.trim().split(tags[0])[0] : title;
};

export const getTags = (title: string) => {
  if (!title) {
    return [];
  }

  const tags = title.match(tagsRegex);

  return tags || [];
};

export const processSnippet = (snippet: SnippetType): SnippetEnrichedType => {
  const description = snippet.description ?? 'Untitled';

  return {
    ...snippet,
    id: snippet.id,
    description: description,
    isUntitled: !description,
    tags: getTags(description),
    title: removeTags(description),
    languages: Object.keys(snippet.files)
      .map((file) => {
        const lang = snippet.files[file]?.language;
        if (typeof lang === 'string') {
          return { name: lang, color: 'white' as const };
        }
        return lang || { name: 'Text', color: 'white' as const };
      })
      .reduce((acc: { name: string; color: string }[], lang) => {
        if (
          typeof lang === 'object' &&
          lang !== null &&
          !acc.some((item) => item.name === lang.name)
        ) {
          acc.push({ name: lang.name, color: lang.color || 'white' });
        }

        return acc;
      }, []),
    files: Object.values(snippet.files).map((file) => ({
      ...file,
      text: file.content,
    })) as unknown as SnippetEnrichedType['files'],
  };
};

export const getLanguageName = (file: SnippetFileType): string => {
  if (!file?.language) return '';
  return typeof file.language === 'string' ? file.language : file.language.name;
};

export const fetchAndUpdateSnippets = async () => {
  const allFetchedSnippetIds = new Set<string>();

  for await (const snippetsPage of snippetService.getSnippetsGenerator()) {
    const currentSnippetsState = globalState.getState().snippets;

    const newSnippets = snippetsPage.map((snippet) => processSnippet(snippet));

    newSnippets.forEach((snippet) => allFetchedSnippetIds.add(snippet.id));

    const updatedSnippets = currentSnippetsState.map((existingSnippet) => {
      const matchingNewSnippet = newSnippets.find(
        (newSnippet) => newSnippet.id === existingSnippet.id
      );
      return matchingNewSnippet || existingSnippet;
    });

    const completelyNewSnippets = newSnippets.filter(
      (newSnippet) => !updatedSnippets.some((snippet) => snippet.id === newSnippet.id)
    );

    // Filter to only include snippets that exist in API - this removes deleted ones
    const filteredSnippets = updatedSnippets.filter((snippet) =>
      allFetchedSnippetIds.has(snippet.id)
    );

    const snippets: SnippetEnrichedType[] = [...completelyNewSnippets, ...filteredSnippets].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    globalState.setState({ snippets });
  }
};

export const getFileExtension = (file: SnippetFileType): string =>
  file.filename.split('.').reverse()[0];

export const isPDF = (file: SnippetFileType): boolean =>
  file?.type === 'application/pdf' && getFileExtension(file) === 'pdf';

export const isHTML = (file: SnippetFileType): boolean => getLanguageName(file) === 'HTML';

export const isCSV = (file: SnippetFileType): boolean => getLanguageName(file) === 'CSV';

export const isTSV = (file: SnippetFileType): boolean => file?.type === 'text/tab-separated-values';

export const isImage = (file: SnippetFileType): boolean => file?.type?.startsWith('image/');

export const isJson = (file: SnippetFileType): boolean => getLanguageName(file) === 'JSON';

export const isMarkdown = (file: SnippetFileType): boolean => getLanguageName(file) === 'Markdown';

export const isOpenApi = (file: SnippetFileType): boolean => {
  const lang = getLanguageName(file);
  return lang === 'OASv2-json' || lang === 'OASv3-json';
};

export const isLaTex = (file: SnippetFileType): boolean => {
  return getLanguageName(file)?.toLowerCase() === 'tex';
};

export const isGeoJson = (file: SnippetFileType): boolean =>
  isJson(file) && getFileExtension(file) === 'geojson';

export const previewAvailable = (file: SnippetFileType): boolean =>
  isPDF(file) ||
  isHTML(file) ||
  isImage(file) ||
  isCSV(file) ||
  isTSV(file) ||
  isJson(file) ||
  isMarkdown(file) ||
  isLaTex(file) ||
  isOpenApi(file);

export const formatSnippetForSaving = (
  snippet: {
    description: string;
    isPublic: boolean;
    files: { filename: string; content: string | null }[];
    tags?: string[];
  },
  edit: SnippetSingleType | null = null
) => {
  const updatedFiles = edit
    ? [
        ...snippet.files,
        ...Object.keys(edit.files)
          .filter((filename) => !snippet.files.some((file) => file.filename === filename))
          .map((filename) => ({ filename, content: null })),
      ]
    : snippet.files;

  const files = updatedFiles.reduce<{ [key: string]: { content: string } | null }>(
    (acc, { filename, content }) => {
      acc[filename] = content === null ? null : { content };
      return acc;
    },
    {}
  );

  return {
    description: snippet.description + (snippet.tags?.length ? ` ${snippet.tags.join(' ')}` : ''),
    isPublic: snippet.isPublic,
    files,
  };
};
