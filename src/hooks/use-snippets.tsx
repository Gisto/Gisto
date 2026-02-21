import { useEffect, useState, useCallback, useRef } from 'react';

import { fetchAndUpdateSnippets } from '@/utils';

export const useSnippets = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const hasLoadedRef = useRef(false);

  const fetchSnippets = useCallback(async (isRefresh = false) => {
    if (hasLoadedRef.current && !isRefresh) {
      return;
    }

    if (isRefresh) {
      setIsRefreshing(true);
    }

    try {
      await fetchAndUpdateSnippets();
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      hasLoadedRef.current = true;
      setIsLoading(false);
      if (isRefresh) {
        setIsRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchSnippets();
  }, [fetchSnippets]);

  return { isLoading, isRefreshing, refresh: () => fetchSnippets(true) };
};
