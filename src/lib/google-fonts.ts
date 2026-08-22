export interface GoogleFontInfo {
  family: string;
  category: string;
  variable: boolean;
}

interface FontsourceEntry {
  family: string;
  category?: string;
  variable?: boolean;
  subsets?: string[];
}

const GOOGLE_FONTS_URL = 'https://api.fontsource.org/v1/fonts';
const FONTS_CACHE_KEY = 'gisto.googleFontsCache';
const FONTS_CACHE_TTL = 24 * 60 * 60 * 1000;

const PRELOADED_FAMILIES = new Set(['Titillium Web', 'Bodoni Moda', 'JetBrains Mono']);

const CSS_FONT_KEYWORDS = new Set([
  'monospace',
  'ui-monospace',
  'sans-serif',
  'serif',
  'system-ui',
  'inherit',
  'initial',
  'unset',
  'revert',
  'revert-layer',
]);

const loadedFamilies = new Set<string>();

const DEFAULT_FONTS: GoogleFontInfo[] = [
  { family: 'Titillium Web', category: 'Sans Serif', variable: false },
  { family: 'Bodoni Moda', category: 'Serif', variable: true },
  { family: 'Fraunces', category: 'Serif', variable: true },
  { family: 'ABeeZee', category: 'Sans Serif', variable: false },
  { family: 'Georgia', category: 'Serif', variable: false },
  { family: 'Roboto', category: 'Sans Serif', variable: false },
  { family: 'Open Sans', category: 'Sans Serif', variable: false },
  { family: 'Lato', category: 'Sans Serif', variable: false },
  { family: 'Playfair Display', category: 'Serif', variable: true },
  { family: 'Merriweather', category: 'Serif', variable: false },
  { family: 'Source Code Pro', category: 'Monospace', variable: true },
  { family: 'JetBrains Mono', category: 'Monospace', variable: true },
];

let fontsPromise: Promise<GoogleFontInfo[]> | null = null;

const FONT_CATEGORIES = new Map<string, string>();

function seedFontCategories() {
  for (const font of [...DEFAULT_FONTS, ...(readCache() ?? [])]) {
    FONT_CATEGORIES.set(font.family, font.category.toLowerCase());
  }
}

seedFontCategories();

function readCache(): GoogleFontInfo[] | null {
  try {
    const cached = localStorage.getItem(FONTS_CACHE_KEY);
    if (!cached) return null;
    const parsed = JSON.parse(cached) as { fetchedAt: number; fonts: GoogleFontInfo[] };
    if (parsed?.fonts && Date.now() - parsed.fetchedAt < FONTS_CACHE_TTL) {
      return parsed.fonts;
    }
  } catch {
    // ignore cache errors
  }
  return null;
}

function writeCache(fonts: GoogleFontInfo[]) {
  try {
    localStorage.setItem(FONTS_CACHE_KEY, JSON.stringify({ fetchedAt: Date.now(), fonts }));
  } catch {
    // ignore quota/security errors
  }
}

async function loadGoogleFonts(): Promise<GoogleFontInfo[]> {
  const cached = readCache();
  if (cached) return cached;

  try {
    const res = await fetch(GOOGLE_FONTS_URL);
    if (!res.ok) throw new Error(`Google Fonts API error: ${res.status}`);
    const data = (await res.json()) as FontsourceEntry[];

    const fonts: GoogleFontInfo[] = data
      .filter((font) => font.family && (!font.subsets || font.subsets.includes('latin')))
      .map((font) => ({
        family: font.family,
        category: font.category ?? 'Sans Serif',
        variable: Boolean(font.variable),
      }))
      .sort((a, b) => a.family.localeCompare(b.family));

    for (const font of fonts) {
      FONT_CATEGORIES.set(font.family, font.category.toLowerCase());
    }

    writeCache(fonts);
    return fonts;
  } catch {
    return DEFAULT_FONTS;
  }
}

export function fetchGoogleFonts(): Promise<GoogleFontInfo[]> {
  if (!fontsPromise) {
    fontsPromise = loadGoogleFonts();
  }
  return fontsPromise;
}

export function fontStack(family: string): string {
  const category = FONT_CATEGORIES.get(family);
  if (category?.includes('mono')) {
    return `${family}, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace`;
  }
  if (category?.includes('sans')) {
    return `${family}, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif`;
  }
  return `${family}, ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif`;
}

export function loadGoogleFont(family: string): void {
  const trimmed = family.trim();
  if (
    !trimmed ||
    trimmed.includes(',') ||
    CSS_FONT_KEYWORDS.has(trimmed.toLowerCase()) ||
    loadedFamilies.has(trimmed) ||
    PRELOADED_FAMILIES.has(trimmed)
  ) {
    return;
  }

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(trimmed)}&display=swap`;
  document.head.appendChild(link);
  loadedFamilies.add(trimmed);
}
