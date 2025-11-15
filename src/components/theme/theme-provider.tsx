import { createContext, useContext, useEffect, useState } from 'react';

import { updateSettings, useStoreValue } from '@/lib/store/globalState.ts';

export type Theme = 'dark' | 'light' | 'system';

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
