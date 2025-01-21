import { useEffect, useState } from 'react';

import { fetchAndUpdateSnippets } from '@/lib/utils.ts';

export const useSnippets = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        await fetchAndUpdateSnippets();
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return { isLoading };
};
