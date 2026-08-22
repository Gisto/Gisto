import { beforeEach, describe, expect, it, vi } from 'vitest';

async function importFresh() {
  vi.resetModules();
  return await import('./google-fonts');
}

function freshStorage() {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
}

describe('google-fonts', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
    vi.stubGlobal('localStorage', freshStorage());
    document.head.innerHTML = '';
  });

  describe('fontStack', () => {
    it('wraps the family with a serif fallback stack', async () => {
      const { fontStack } = await importFresh();
      expect(fontStack('Playfair Display')).toBe(
        "Playfair Display, ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif"
      );
    });

    it('uses a sans-serif fallback for sans-serif families', async () => {
      const { fontStack } = await importFresh();
      expect(fontStack('ABeeZee')).toBe(
        "ABeeZee, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif"
      );
    });

    it('uses a monospace fallback for monospace families', async () => {
      const { fontStack } = await importFresh();
      expect(fontStack('JetBrains Mono')).toBe(
        "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"
      );
    });
  });

  describe('loadGoogleFont', () => {
    it('injects a Google Fonts stylesheet link', async () => {
      const { loadGoogleFont } = await importFresh();
      loadGoogleFont('Playfair Display');
      const link = document.head.querySelector('link[href*="fonts.googleapis.com"]');
      expect(link).not.toBeNull();
      expect(link?.getAttribute('href')).toBe(
        'https://fonts.googleapis.com/css2?family=Playfair%20Display&display=swap'
      );
    });

    it('dedupes repeated loads of the same family', async () => {
      const { loadGoogleFont } = await importFresh();
      loadGoogleFont('Playfair Display');
      loadGoogleFont('Playfair Display');
      expect(document.head.querySelectorAll('link[href*="fonts.googleapis.com"]')).toHaveLength(1);
    });

    it('skips families already preloaded in index.html', async () => {
      const { loadGoogleFont } = await importFresh();
      loadGoogleFont('Titillium Web');
      loadGoogleFont('Bodoni Moda');
      expect(document.head.querySelectorAll('link[href*="fonts.googleapis.com"]')).toHaveLength(0);
    });

    it('skips CSS keywords and font stacks', async () => {
      const { loadGoogleFont } = await importFresh();
      loadGoogleFont('monospace');
      loadGoogleFont('system-ui');
      loadGoogleFont('"Fira Code", "Fira Mono", monospace');
      expect(document.head.querySelectorAll('link[href*="fonts.googleapis.com"]')).toHaveLength(0);
    });
  });

  describe('fetchGoogleFonts', () => {
    it('fetches, filters to latin subsets, sorts and maps entries', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => [
            { family: 'Zed Font', category: 'Serif', variable: false, subsets: ['latin'] },
            {
              family: 'Alpha Font',
              category: 'Sans Serif',
              variable: true,
              subsets: ['latin', 'latin-ext'],
            },
            { family: 'Korean Only', category: 'Sans Serif', variable: true, subsets: ['korean'] },
          ],
        })
      );

      const { fetchGoogleFonts } = await importFresh();
      const fonts = await fetchGoogleFonts();

      expect(fonts).toEqual([
        { family: 'Alpha Font', category: 'Sans Serif', variable: true },
        { family: 'Zed Font', category: 'Serif', variable: false },
      ]);
    });

    it('falls back to a curated default list when the API is unreachable', async () => {
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));

      const { fetchGoogleFonts } = await importFresh();
      const fonts = await fetchGoogleFonts();

      expect(fonts.some((font) => font.family === 'Fraunces')).toBe(true);
      expect(fonts.length).toBeGreaterThan(5);
    });

    it('serves the cached list from localStorage on subsequent calls', async () => {
      const cached = [{ family: 'Cached Font', category: 'Serif', variable: false }];
      localStorage.setItem(
        'gisto.googleFontsCache',
        JSON.stringify({ fetchedAt: Date.now(), fonts: cached })
      );

      const { fetchGoogleFonts } = await importFresh();
      const fonts = await fetchGoogleFonts();

      expect(fonts).toEqual(cached);
    });
  });
});
