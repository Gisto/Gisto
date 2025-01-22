import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { ITEMS_PER_PAGE } from '@/constants';
import { GithubAPI } from '@/lib/GithubApi.ts';
import { globalState } from '@/lib/store/globalState.ts';
import { GistType } from '@/types/gist.ts';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fancyCardStyle = cn(
  'bg-gradient-to-bl to-50% from-primary dark:from-primary-950',
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
    languages: Array.from(
      Object.values(
        Object.keys(snippet.files)
          .map((file) => snippet.files[file]?.language)
          .filter(Boolean)
          .reduce((acc: Record<string, string>, lang) => {
            acc[lang] = lang;
            return acc;
          }, {})
      )
    ),
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
