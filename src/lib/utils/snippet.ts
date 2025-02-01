import { ITEMS_PER_PAGE } from '@/constants';
import { GithubAPI } from '@/lib/GithubApi.ts';
import { globalState } from '@/lib/store/globalState.ts';
import { GistFileType, GistSingleType, GistType } from '@/types/gist.ts';

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

export const processSnippet = (snippet: GistType) => {
  const description = snippet.description ?? 'Untitled';

  return {
    ...snippet,
    id: snippet.resourcePath,
    description: description,
    isUntitled: !description,
    tags: getTags(description),
    title: removeTags(description),
    languages: Object.keys(snippet.files)
      .map((file) => snippet.files[file]?.language || { name: 'Text', color: 'white' })
      .reduce((acc: { name: string; color?: string }[], lang) => {
        if (
          typeof lang === 'object' &&
          lang !== null &&
          !acc.some((item) => item.name === lang.name)
        ) {
          acc.push(lang);
        }

        return acc;
      }, []),
  };
};

export const fetchAndUpdateSnippets = async () => {
  const allFetchedSnippetIds = new Set();

  for await (const snippetsPage of GithubAPI.getGistsGenerator()) {
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

    const isLastPage = snippetsPage.length < ITEMS_PER_PAGE;
    const filteredSnippets = isLastPage
      ? updatedSnippets.filter((snippet) => allFetchedSnippetIds.has(snippet.id))
      : updatedSnippets;

    globalState.setState({
      // @ts-expect-error no need to specify all ATM
      snippets: [...completelyNewSnippets, ...filteredSnippets]
        // TODO: we probably should sort on the client page where interactions are later on
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    });

    if (isLastPage) {
      break;
    }
  }
};

export const getFileExtension = (file: GistFileType): string =>
  file.filename.split('.').reverse()[0];

export const isPDF = (file: GistFileType): boolean =>
  file.type === 'application/pdf' && getFileExtension(file) === 'pdf';

export const isHTML = (file: GistFileType): boolean => file.language === 'HTML';

export const isCSV = (file: GistFileType): boolean => file.language === 'CSV';

export const isTSV = (file: GistFileType): boolean => file.type === 'text/tab-separated-values';

export const isImage = (file: GistFileType): boolean => file.type.startsWith('image/');

export const isJson = (file: GistFileType): boolean => file.language === 'JSON';

export const isMarkdown = (file: GistFileType): boolean => file.language === 'Markdown';

export const isOpenApi = (file: GistFileType): boolean => {
  return file.language === 'OASv2-json' || file.language === 'OASv3-json';
};

export const isLaTex = (file: GistFileType): boolean => {
  return file.language.toLowerCase() === 'tex';
};

export const isGeoJson = (file: GistFileType): boolean =>
  isJson(file) && getFileExtension(file) === 'geojson';

export const previewAvailable = (file: GistFileType): boolean =>
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
  edit: GistSingleType | null = null
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
