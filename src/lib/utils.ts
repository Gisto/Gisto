import { twMerge } from 'tailwind-merge';

import { clsx, type ClassValue } from 'clsx';

import { GithubAPI } from '@/lib/GithubApi.ts';
import { globalState } from '@/lib/store/globalState.ts';
import { GistType } from '@/types/gist.ts';
import { ITEMS_PER_PAGE } from '@/constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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

export const fetchAndUpdateSnippets = async () => {
  const allFetchedSnippetIds = new Set();

  for await (const gistPage of GithubAPI.getGistsGenerator()) {
    const currentSnippetsState = globalState.getState().snippets;

    const newSnippets = gistPage.map((gist: GistType) => ({
      ...gist,
      id: gist.resourcePath,
      description: gist.description ?? 'Untitled',
      tags: getTags(gist.description),
      title: removeTags(gist.description),
      languages: Array.from(
        Object.values(
          Object.keys(gist.files)
            .map((file) => gist.files[file]?.language)
            .filter(Boolean)
            .reduce((acc: Record<string, string>, lang) => {
              acc[lang] = lang;
              return acc;
            }, {})
        )
      ),
    }));

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

    const isLastPage = gistPage.length < ITEMS_PER_PAGE;
    const filteredSnippets = isLastPage
      ? updatedSnippets.filter((snippet) => allFetchedSnippetIds.has(snippet.id))
      : updatedSnippets;

    globalState.setState({
      // @ts-expect-error no need to specify all ATM
      snippets: [...completelyNewSnippets, ...filteredSnippets].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    });

    if (isLastPage) {
      break;
    }
  }
};