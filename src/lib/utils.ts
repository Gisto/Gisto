import { z } from 'zod';

import { ITEMS_PER_PAGE } from '@/constants';
import { GithubAPI } from '@/lib/GithubApi.ts';
import { globalState } from '@/lib/store/globalState.ts';
import { GistEnrichedType, GistFileType, GistSingleType, GistType } from '@/types/gist.ts';

export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

export const fancyCardStyle = cn(
  'bg-gradient-to-bl to-50% from-primary/30 dark:from-primary-950',
  'hover:shadow-lg hover:border-secondary transition-all ease-in-out duration-300'
);

export const upperCaseFirst = (text: string) => {
  const str = text.toLowerCase();
  return String(str).charAt(0).toUpperCase() + String(str).slice(1);
};

export const camelToTitleCase = (text: string) =>
  text
    .replace(/([A-Z])/g, (match) => ` ${match}`)
    .replace(/^./, (match) => match.toUpperCase())
    .trim();

export const snakeToTitleCase = (text: string) =>
  upperCaseFirst(text.replace(/[_-]/g, ' ').trim().toLowerCase());

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

export const copyToClipboard = (text: string) => navigator.clipboard.writeText(text);

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

export const searchFilter = (search: string, currentSnippets: GistEnrichedType[] | []) => {
  if (search === '' || search.length === 0) {
    return currentSnippets;
  }

  const searchTerms = search.toLowerCase().split(' ');

  return currentSnippets.filter((listItem) => {
    return searchTerms.every((term) => {
      if (term.startsWith('tag:')) {
        const tagToSearch = term.slice(4).trim();
        return listItem.tags.some((tag) =>
          tag.replace('#', '').toLowerCase().startsWith(tagToSearch)
        );
      }

      if (term.startsWith('lang:')) {
        const langToSearch = term.slice(5).trim();
        return listItem.languages.some((lang) => lang.name.toLowerCase().startsWith(langToSearch));
      }

      if (listItem.title.trim().toLowerCase().includes(term)) {
        return true;
      }

      return listItem.files.some((file) => file.text?.toLowerCase().includes(term));
    });
  });
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

export const formatZodErrors = (errors: z.ZodIssue[]): Record<string, string[]> => {
  return errors.reduce(
    (acc, error) => {
      const path = error.path.join('.');
      if (!acc[path]) {
        acc[path] = [];
      }
      acc[path].push(error.message);
      return acc;
    },
    {} as Record<string, string[]>
  );
};

export const randomString = (charsCount = 5) =>
  Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, '')
    .slice(0, charsCount);

export const getEditorTheme = () => {
  if (globalState.getState().settings.theme === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'vs-dark' : 'light';
  }

  return globalState.getState().settings.theme === 'dark' ? 'vs-dark' : 'light';
};
