import { useEffect, useState, useCallback } from 'react';

import { fetchAndUpdateSnippets } from '@/lib/utils.ts';

export const useSnippets = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchSnippets = useCallback(async () => {
    setIsLoading(true);
    try {
      await fetchAndUpdateSnippets();
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSnippets();
  }, [fetchSnippets]);

  return { isLoading, refresh: fetchSnippets };
};
