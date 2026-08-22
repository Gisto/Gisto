import { createContext, useContext, useEffect, useState } from 'react';

import { fontStack, loadGoogleFont } from '@/lib/google-fonts';
import { updateSettings, useStoreValue } from '@/lib/store/globalState.ts';

export type Theme = 'dark' | 'light' | 'system';

function foregroundFor(baseColor: string): string {
  const match = baseColor.trim().match(/^([\d.]+)\s+([\d.]+)%\s+([\d.]+)%$/);
  if (!match) return 'hsl(0 0% 100%)';
  const lightness = parseFloat(match[3]);
  return lightness >= 60 ? 'hsl(35 25% 17%)' : 'hsl(0 0% 100%)';
}

function isValidBaseColor(baseColor: string): boolean {
  return /^[\d.]+\s+[\d.]+%\s+[\d.]+%$/.test(baseColor.trim());
}

type ThemeProviderProps = {
  children: React.ReactNode;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  resolvedTheme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
  resolvedTheme: 'system',
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const settings = useStoreValue('settings');
  const [theme, setTheme] = useState<Theme>(settings.theme);
  const [resolvedTheme, setResolvedTheme] = useState<Theme>(theme);

  useEffect(() => {
    const root = window.document.documentElement;
    const baseColor = settings.baseColor;

    if (!isValidBaseColor(baseColor)) return;

    root.style.setProperty('--primary', baseColor);
    root.style.setProperty('--primary-foreground', foregroundFor(baseColor));
  }, [settings.baseColor]);

  useEffect(() => {
    const root = window.document.documentElement;

    root.style.setProperty('--font-heading', fontStack(settings.headingFont));
    root.style.setProperty('--font-numbers', fontStack(settings.numbersFont));
    root.style.setProperty('--font-body', fontStack(settings.bodyFont));
    loadGoogleFont(settings.headingFont);
    loadGoogleFont(settings.numbersFont);
    loadGoogleFont(settings.bodyFont);
    loadGoogleFont(settings.editor.fontFamily);
  }, [settings.headingFont, settings.numbersFont, settings.bodyFont, settings.editor.fontFamily]);

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      updateSettings({
        theme: systemTheme,
      });
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResolvedTheme(systemTheme);
      root.classList.add(systemTheme);
      return;
    }
    setResolvedTheme(theme);
    root.classList.add(theme);
    updateSettings({ theme });
  }, [theme]);

  const value = {
    theme,
    resolvedTheme,
    setTheme: (theme: Theme) => {
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined) throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};
