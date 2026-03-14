import { ITEMS_PER_PAGE } from '@/constants';
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

  globalState.setState({ isLoading: true, loadingProgress: 0 });

  try {
    let hasNextPage = true;
    let cursor: string | null = null;
    let totalFetched = 0;
    let totalCount = 0;

    while (hasNextPage) {
      const snippetsPage = await snippetService.fetchSnippets(cursor);
      const currentSnippetsState = globalState.getState().snippets;
      totalFetched += snippetsPage.nodes.length;

      if (!totalCount && snippetsPage.totalCount) {
        totalCount = snippetsPage.totalCount;
        globalState.setState({ totalSnippetCount: totalCount });
      }

      const progress = totalCount
        ? Math.min(90, Math.round((totalFetched / totalCount) * 100))
        : Math.min(90, Math.round((totalFetched / (totalFetched + ITEMS_PER_PAGE)) * 100));
      globalState.setState({ loadingProgress: progress });

      const newSnippets = snippetsPage.nodes.map((snippet) => processSnippet(snippet));

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

      const filteredSnippets = updatedSnippets.filter((snippet) =>
        allFetchedSnippetIds.has(snippet.id)
      );

      const snippets: SnippetEnrichedType[] = [...completelyNewSnippets, ...filteredSnippets].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      globalState.setState({ snippets });

      hasNextPage = snippetsPage.pageInfo.hasNextPage;
      cursor = snippetsPage.pageInfo.endCursor;

      if (snippetsPage.nodes.length < ITEMS_PER_PAGE) {
        break;
      }
    }
  } catch (error) {
    console.error('Error fetching snippets:', error);
  } finally {
    globalState.setState({ isLoading: false, loadingProgress: 100 });
  }
};

export const getFileExtension = (file: SnippetFileType): string =>
  file.filename.split('.').reverse()[0];

export const isPDF = (file: SnippetFileType): boolean =>
  file?.type === 'application/pdf' && getFileExtension(file) === 'pdf';

export const isHTML = (file: SnippetFileType): boolean => getLanguageName(file).toLowerCase() === 'html';

export const isCSV = (file: SnippetFileType): boolean => getLanguageName(file).toLowerCase() === 'csv';

export const isTSV = (file: SnippetFileType): boolean => file?.type === 'text/tab-separated-values';

export const isImage = (file: SnippetFileType): boolean => file?.type?.startsWith('image/');

export const isJson = (file: SnippetFileType): boolean => getLanguageName(file).toLowerCase() === 'json';

export const isMarkdown = (file: SnippetFileType): boolean => getLanguageName(file).toLowerCase() === 'markdown';

export const isOpenApi = (file: SnippetFileType): boolean => {
  const lang = getLanguageName(file).toLowerCase();
  return lang === 'oasv2-json' || lang === 'oasv3-json';
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
