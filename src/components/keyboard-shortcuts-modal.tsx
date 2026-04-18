'use client';

import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Keyboard } from 'lucide-react';

import { Button } from '@/components/ui/button.tsx';
import { shortcutsConfig } from '@/constants/shortcuts.ts';
import { cn } from '@/utils';

export const KeyboardShortcutsModal = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed left-[50%] top-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg max-w-lg max-h-[90vh]">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Keyboard className="size-5" />
              <DialogPrimitive.Title className="text-lg font-semibold">
                Keyboard Shortcuts
              </DialogPrimitive.Title>
            </div>

            <DialogPrimitive.Description className="text-sm text-muted-foreground">
              Quick shortcuts to navigate and interact with Gisto.
            </DialogPrimitive.Description>

            <div className="grid gap-4 py-2 overflow-y-auto max-h-[60vh]">
              {shortcutsConfig.map((category) => (
                <div key={category.category} className="flex flex-col gap-2">
                  <h3 className="text-sm font-medium">{category.category}</h3>
                  <div className="grid gap-2">
                    {category.items.map((shortcut) => (
                      <div
                        key={shortcut.description}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-muted-foreground">{shortcut.description}</span>
                        <div className="flex items-center gap-1">
                          {shortcut.keys.map((key, i) => (
                            <kbd
                              key={key}
                              className={cn(
                                'px-2 py-0.5 text-xs font-medium bg-muted rounded border',
                                i > 0 && 'ml-1'
                              )}
                            >
                              {key}
                            </kbd>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <DialogPrimitive.Close asChild>
              <Button variant="secondary" className="mt-2">
                Close
              </Button>
            </DialogPrimitive.Close>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};
