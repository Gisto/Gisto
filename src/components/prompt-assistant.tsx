import { Loader2, Send, Sparkles } from 'lucide-react';
import { useState, useRef, useCallback } from 'react';

import { Markdown } from '@/components/layout/pages/snippet/content/preview/markdown.tsx';
import { Bubble, BubbleContent } from '@/components/ui/bubble';
import { Button } from '@/components/ui/button';
import { Marker, MarkerContent, MarkerIcon } from '@/components/ui/marker';
import { Message, MessageContent } from '@/components/ui/message';
import {
  MessageScrollerProvider,
  MessageScroller,
  MessageScrollerViewport,
  MessageScrollerContent,
  MessageScrollerItem,
} from '@/components/ui/message-scroller';
import { Textarea } from '@/components/ui/textarea';
import { isMarkdown } from '@/lib/is-markdown';
import { cn } from '@/utils';

export type AssistantMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

type PromptAssistantProps = {
  messages: AssistantMessage[];
  onSend: (prompt: string) => void | Promise<void>;
  isLoading: boolean;
  placeholder?: string;
  emptyText?: string;
  contextLabel?: string;
};

export const PromptAssistant = ({
  messages,
  onSend,
  isLoading,
  placeholder = 'Ask a question...',
  emptyText = 'Ask a question to get started',
  contextLabel,
}: PromptAssistantProps) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = useCallback(() => {
    const q = input.trim();
    if (!q || isLoading) return;
    setInput('');
    void onSend(q);
  }, [input, isLoading, onSend]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-full flex-col">
      {contextLabel && (
        <div className="border-b bg-muted/30 px-4 py-2">
          <p className="text-xs text-muted-foreground truncate">{contextLabel}</p>
        </div>
      )}
      <MessageScrollerProvider autoScroll>
        <MessageScroller className="flex-1">
          <MessageScrollerViewport>
            <MessageScrollerContent className="gap-3 pb-3">
              {messages.length === 0 && !isLoading && (
                <div className="flex flex-1 flex-col items-center justify-center text-center">
                  <Sparkles className="mb-2 size-8 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">{emptyText}</p>
                </div>
              )}
              {messages.map((msg, i) => (
                <MessageScrollerItem key={msg.id} scrollAnchor={i === messages.length - 1}>
                  <Message align={msg.role === 'user' ? 'end' : 'start'}>
                    <MessageContent className="gap-1.5">
                      <Bubble
                        variant={msg.role === 'user' ? 'default' : 'secondary'}
                        align={msg.role === 'user' ? 'end' : 'start'}
                      >
                        <BubbleContent
                          className={cn(
                            msg.role === 'assistant' &&
                              '[&_pre]:overflow-x-auto [&_pre]:max-w-full',
                            msg.role === 'user' && 'whitespace-pre-wrap'
                          )}
                        >
                          {msg.role === 'assistant' && isMarkdown(msg.content) ? (
                            <Markdown content={msg.content} />
                          ) : (
                            msg.content
                          )}
                        </BubbleContent>
                      </Bubble>
                    </MessageContent>
                  </Message>
                </MessageScrollerItem>
              ))}
              {isLoading && (
                <MessageScrollerItem scrollAnchor>
                  <Marker role="status">
                    <MarkerIcon>
                      <Loader2 className="size-4 animate-spin" />
                    </MarkerIcon>
                    <MarkerContent>Thinking...</MarkerContent>
                  </Marker>
                </MessageScrollerItem>
              )}
            </MessageScrollerContent>
          </MessageScrollerViewport>
        </MessageScroller>
      </MessageScrollerProvider>
      <div className="border-t px-3 py-3 flex items-end gap-2 shrink-0">
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="min-h-[36px] max-h-[100px] resize-none text-sm"
          rows={1}
        />
        <Button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          size="icon"
          className="shrink-0 size-8"
          aria-label="Send message"
        >
          {isLoading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
        </Button>
      </div>
    </div>
  );
};
