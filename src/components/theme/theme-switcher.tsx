import { Moon, Sun } from 'lucide-react';

import { useTheme } from '@/components/theme/theme-provider.tsx';
import { Button } from '@/components/ui/button.tsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx';
import { t } from '@/lib/i18n';
import { cn } from '@/utils';

type ThemeSwitcherProps = {
  showLabel?: boolean;
  className?: string;
  buttonClassName?: string;
  triggerMode?: 'icon' | 'row';
};

export function ThemeSwitcher({
  showLabel = false,
  className,
  buttonClassName,
  triggerMode = 'icon',
}: ThemeSwitcherProps) {
  const { setTheme, theme, resolvedTheme } = useTheme();
  const label =
    theme === 'system'
      ? `${t('theme.system')} (${t(`theme.${resolvedTheme}`)})`
      : t(`theme.${theme}`);

  if (triggerMode === 'row') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className={cn(
              'flex items-center gap-2 mb-2 p-2 w-full rounded hover:bg-secondary',
              showLabel ? 'justify-start' : 'justify-center',
              className
            )}
          >
            <span className="relative flex size-4 items-center justify-center">
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </span>
            {showLabel && <span>{label}</span>}
            <span className="sr-only">Toggle theme</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setTheme('light')}>{t('theme.light')}</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme('dark')}>{t('theme.dark')}</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme('system')}>
            {t('theme.system')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className={cn(showLabel && 'flex items-center gap-2', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="link" size="icon" className={buttonClassName}>
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setTheme('light')}>{t('theme.light')}</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme('dark')}>{t('theme.dark')}</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme('system')}>
            {t('theme.system')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {showLabel && <span className="text-sm text-muted-foreground">{label}</span>}
    </div>
  );
}
