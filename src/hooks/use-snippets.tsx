import { useEffect, useState, useCallback, useRef } from 'react';

import { globalState } from '@/lib/store/globalState.ts';
import { fetchAndUpdateSnippets } from '@/utils';

export const useSnippets = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const hasLoadedRef = useRef(false);

  const fetchSnippets = useCallback(async () => {
    if (hasLoadedRef.current) {
      return;
    }

    try {
      await fetchAndUpdateSnippets();
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      hasLoadedRef.current = true;
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSnippets();
  }, [fetchSnippets]);

  const allSnippets = globalState.getState().snippets;
  const hasSnippets = allSnippets.length > 0;

  return { isLoading: isLoading && !hasSnippets, refresh: fetchSnippets };
};
