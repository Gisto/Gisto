import { ArrowUpIcon, MessageCircleDashedIcon, PlusIcon, Sparkles } from 'lucide-react';
import { useCallback, useState } from 'react';

import { Markdown } from '@/components/layout/pages/snippet/content/preview/markdown.tsx';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Bubble, BubbleContent } from '@/components/ui/bubble';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Message, MessageAvatar, MessageContent } from '@/components/ui/message';
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerProvider,
  MessageScrollerViewport,
  MessageScrollerItem,
} from '@/components/ui/message-scroller';
import { Textarea } from '@/components/ui/textarea';
import { AI_PROVIDERS } from '@/constants/ai-providers';
import { t } from '@/lib/i18n';
import { isMarkdown } from '@/lib/is-markdown';
import { useStoreValue } from '@/lib/store/globalState.ts';
import { cn } from '@/utils';

export type AssistantMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

type PromptAssistantProps = {
  messages: AssistantMessage[];
  onSend: (prompt: string) => void | Promise<void>;
  onClear: () => void;
  isLoading: boolean;
  placeholder?: string;
  emptyText?: string;
};

export const PromptAssistant = ({
  messages,
  onSend,
  onClear,
  isLoading,
  placeholder = t('components.howCanIHelp'),
  emptyText = t('components.pressSendToStart'),
}: PromptAssistantProps) => {
  const [input, setInput] = useState('');
  const user = useStoreValue('user');
  const userRecord = (user ?? {}) as Record<string, unknown>;
  const userAvatarUrl = typeof userRecord.avatar_url === 'string' ? userRecord.avatar_url : '';
  const userName =
    (typeof userRecord.name === 'string' && userRecord.name) ||
    (typeof userRecord.login === 'string' && userRecord.login) ||
    (typeof userRecord.username === 'string' && userRecord.username) ||
    '';

  const aiSettings = useStoreValue('settings').ai;
  const provider = AI_PROVIDERS[aiSettings.activeAiProvider];
  const ProviderIcon = provider?.icon;
  const modelLabel =
    provider?.modelOptions.find((option) => option.value === aiSettings.model)?.label ??
    aiSettings.model;

  const handleSend = useCallback(() => {
    const q = input.trim();
    if (!q || isLoading) return;
    setInput('');
    void onSend(q);
  }, [input, isLoading, onSend]);

  const isBusy = isLoading;

  return (
    <Card className="flex h-full flex-col gap-0 rounded-none border-0">
      <CardHeader className="flex-row items-center justify-between gap-4 border-b shrink-0 px-4 py-3">
        <div className="flex items-center gap-2">
          <CardTitle className="text-sm">{t('components.aiAssistant')}</CardTitle>
          <Button
            variant="outline"
            size="xs"
            onClick={onClear}
            disabled={isBusy}
            className="gap-1 text-muted-foreground"
          >
            <PlusIcon className="size-3" />
            {t('common.newChat')}
          </Button>
        </div>
        {provider && (
          <Badge
            variant="outline"
            className="max-w-56 shrink-0 items-center gap-1.5 px-2 font-normal text-muted-foreground"
            title={`${provider.label} · ${modelLabel}`}
          >
            {ProviderIcon && <ProviderIcon className="size-3 shrink-0 text-foreground/70" />}
            <span className="truncate">
              <span className="font-semibold text-foreground">{provider.label}</span>
              <span className="ml-1 font-mono text-[11px]">{modelLabel}</span>
            </span>
          </Badge>
        )}
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        {messages.length === 0 && !isLoading ? (
          <Empty className="h-full">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <MessageCircleDashedIcon />
              </EmptyMedia>
              <EmptyTitle>{emptyText}</EmptyTitle>
              <EmptyDescription>{t('components.useTextInputToAsk')}</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <MessageScrollerProvider autoScroll>
            <MessageScroller>
              <MessageScrollerViewport>
                <MessageScrollerContent aria-busy={isBusy} className="p-4 gap-3">
                  {messages.map((msg) => (
                    <MessageScrollerItem key={msg.id} scrollAnchor={msg.role === 'user'}>
                      <Message align={msg.role === 'user' ? 'end' : 'start'}>
                        <MessageAvatar>
                          <Avatar className="size-8">
                            {msg.role === 'user' ? (
                              <>
                                <AvatarImage src={userAvatarUrl} alt={userName} />
                                <AvatarFallback className="text-xs">
                                  {userName.charAt(0)?.toUpperCase() || '?'}
                                </AvatarFallback>
                              </>
                            ) : (
                              <AvatarFallback>
                                <Sparkles className="size-4 text-primary" />
                              </AvatarFallback>
                            )}
                          </Avatar>
                        </MessageAvatar>
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
                      <Message align="start">
                        <MessageAvatar>
                          <Avatar className="size-8">
                            <AvatarFallback>
                              <Sparkles className="size-4" />
                            </AvatarFallback>
                          </Avatar>
                        </MessageAvatar>
                        <MessageContent className="gap-1.5">
                          <Bubble variant="secondary" align="start">
                            <BubbleContent>{t('components.thinking')}</BubbleContent>
                          </Bubble>
                        </MessageContent>
                      </Message>
                    </MessageScrollerItem>
                  )}
                </MessageScrollerContent>
              </MessageScrollerViewport>
              <MessageScrollerButton />
            </MessageScroller>
          </MessageScrollerProvider>
        )}
      </CardContent>
      <CardFooter className=" shrink-0 p-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="relative w-full"
        >
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={placeholder}
            className="min-h-14 max-h-32 pr-10 resize-none rounded-2xl!"
            rows={1}
          />
          <Button
            type="submit"
            size="icon-sm"
            disabled={!input.trim() || isBusy}
            className="absolute bottom-2 right-2 rounded-full!"
            aria-label={t('common.send')}
          >
            <ArrowUpIcon />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};
