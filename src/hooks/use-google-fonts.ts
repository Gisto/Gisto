import { useCallback, useEffect, useState } from 'react';

import { fetchGoogleFonts, GoogleFontInfo } from '@/lib/google-fonts';

export function useGoogleFonts() {
  const [fonts, setFonts] = useState<GoogleFontInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tick, setTick] = useState(0);

  const loadFonts = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchGoogleFonts();
      setFonts(data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadFonts();
  }, [loadFonts, tick]);

  const refresh = useCallback(() => setTick((value) => value + 1), []);

  return { fonts, isLoading, refresh };
}
