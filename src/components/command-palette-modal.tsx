'use client';

import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Home, FilePlus, Settings, RefreshCcw } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

import { paletteCommands, doReload } from '@/constants/shortcuts.ts';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate: (path: string) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  home: <Home className="size-4" />,
  plus: <FilePlus className="size-4" />,
  settings: <Settings className="size-4" />,
  refresh: <RefreshCcw className="size-4" />,
};

export const CommandPalette = ({ open, onOpenChange, onNavigate }: CommandPaletteProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const executeCommand = useCallback(
    (cmd: (typeof paletteCommands)[0]) => {
      if (cmd.action === 'navigate' && cmd.path) {
        onNavigate(cmd.path);
      } else if (cmd.action === 'reload') {
        doReload();
      }
      onOpenChange(false);
    },
    [onNavigate, onOpenChange]
  );

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedIndex(0);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((i) => (i + 1) % paletteCommands.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((i) => (i - 1 + paletteCommands.length) % paletteCommands.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        executeCommand(paletteCommands[selectedIndex]);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, selectedIndex, executeCommand]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'd' || e.key === 'n' || e.key === 's' || e.key === 'r') {
      e.stopPropagation();
      e.preventDefault();
      const cmd = paletteCommands.find((c) => c.shortcut === e.key.toLowerCase());
      if (cmd) {
        executeCommand(cmd);
      }
    }
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50" />
        <DialogPrimitive.Content
          className="fixed left-[50%] top-[20%] z-50 grid w-full translate-x-[-50%] gap-2 border bg-background p-2 shadow-lg duration-200 sm:rounded-lg max-w-md"
          onKeyDown={handleKeyDown}
        >
          <div className="flex flex-col gap-1 max-h-[300px] overflow-y-auto py-1" role="listbox">
            {paletteCommands.map((command, index) => (
              <div
                key={command.id}
                role="option"
                aria-selected={index === selectedIndex}
                className={`flex cursor-pointer items-center gap-3 rounded px-3 py-2 text-sm ${
                  index === selectedIndex ? 'bg-accent' : 'hover:bg-accent'
                }`}
                onClick={() => executeCommand(command)}
              >
                {iconMap[command.icon]}
                <span className="flex-1">{command.label}</span>
                <kbd className="text-xs text-muted-foreground">
                  {command.shortcut.toUpperCase()}
                </kbd>
              </div>
            ))}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};
