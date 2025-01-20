import { useEffect, useState } from 'react';

import { type GistType } from '@/types/gist.ts';
import { GithubAPI } from '@/lib/GithubApi.ts';
import { getTags, removeTags } from '@/lib/utils.ts';
import { globalState } from '@/lib/store/globalState.ts';

export const useSnippets = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        for await (const gistPage of GithubAPI.getGistsGenerator()) {
          const currentSnippets = globalState.getState().snippets;

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

          const updatedSnippets = currentSnippets.map((existingSnippet) => {
            const matchingNewSnippet = newSnippets.find(
              (newSnippet) => newSnippet.id === existingSnippet.id
            );
            return matchingNewSnippet || existingSnippet;
          });

          const completelyNewSnippets = newSnippets.filter(
            (newSnippet) => !updatedSnippets.some((snippet) => snippet.id === newSnippet.id)
          );

          globalState.setState({
            // @ts-expect-error no need to specify all ATM
            snippets: [...updatedSnippets, ...completelyNewSnippets].sort(
              (a, b) => +a.createdAt - +b.createdAt
            ),
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return { isLoading };
};
