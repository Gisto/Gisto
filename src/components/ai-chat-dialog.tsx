import { GripVertical, Plus, Sparkles } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { PromptAssistant, type AssistantMessage } from '@/components/prompt-assistant.tsx';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet.tsx';
import { cn } from '@/utils';

const MIN_WIDTH = 420;
const MAX_WIDTH = 900;
const DEFAULT_WIDTH = 640;

type AIChatDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  messages: AssistantMessage[];
  onSend: (prompt: string) => void | Promise<void>;
  onClear: () => void;
  isLoading: boolean;
  placeholder?: string;
  contextLabel?: string;
};

export const AIChatDialog = ({
  open,
  onOpenChange,
  title = 'AI Assistant',
  messages,
  onSend,
  onClear,
  isLoading,
  placeholder = 'Ask a question...',
  contextLabel,
}: AIChatDialogProps) => {
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const dragging = useRef(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (open) setWidth(DEFAULT_WIDTH);
  }, [open]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    dragging.current = true;
    document.body.style.userSelect = 'none';
  }, []);

  useEffect(() => {
    if (!open) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      const newWidth = window.innerWidth - e.clientX;
      setWidth(Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, newWidth)));
    };

    const handleMouseUp = () => {
      dragging.current = false;
      document.body.style.userSelect = '';
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
    };
  }, [open]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex flex-col p-0 gap-0"
        style={{ width, maxWidth: width, minWidth: MIN_WIDTH }}
      >
        <div
          onMouseDown={handleMouseDown}
          className={cn(
            'absolute left-0 top-0 z-50 h-full w-1.5 cursor-col-resize',
            'hover:bg-accent/50 active:bg-accent/80 transition-colors',
            'flex items-center justify-center group'
          )}
        >
          <GripVertical className="size-3 text-muted-foreground/40 group-hover:text-muted-foreground/70 transition-colors pointer-events-none" />
        </div>
        <SheetHeader className="px-4 pt-4 pb-3 border-b shrink-0">
          <SheetTitle className="flex items-center gap-2 text-sm">
            <Sparkles className="size-4" />
            {title}
            {messages.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto gap-1.5 h-7 text-xs"
                onClick={onClear}
              >
                <Plus className="size-3.5" />
                New chat
              </Button>
            )}
          </SheetTitle>
        </SheetHeader>
        <div className="flex-1 flex flex-col overflow-hidden">
          <PromptAssistant
            messages={messages}
            onSend={onSend}
            isLoading={isLoading}
            placeholder={placeholder}
            contextLabel={contextLabel}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};
