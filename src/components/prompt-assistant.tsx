import { ArrowUpIcon, Check, Mic, PlusIcon, Sparkles, Square } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Markdown } from '@/components/layout/pages/snippet/content/preview/markdown.tsx';
import { toast } from '@/components/toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bubble, BubbleContent } from '@/components/ui/bubble';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Message, MessageAvatar, MessageContent } from '@/components/ui/message';
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerProvider,
  MessageScrollerViewport,
  MessageScrollerItem,
} from '@/components/ui/message-scroller';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { Textarea } from '@/components/ui/textarea';
import { AI_PROVIDERS } from '@/constants/ai-providers';
import { includeSelectedModel, useAiModels } from '@/hooks/use-ai-models';
import { t } from '@/lib/i18n';
import { isMarkdown } from '@/lib/is-markdown';
import { updateSettings, useStoreValue } from '@/lib/store/globalState.ts';
import { cn, upperCaseFirst } from '@/utils';

type SpeechRecognitionResultEvent = {
  resultIndex: number;
  results: ArrayLike<{ isFinal: boolean } & ArrayLike<{ transcript: string }>>;
};

type SpeechRecognitionInstance = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  continuous: boolean;
  onresult: ((event: SpeechRecognitionResultEvent) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

const getSpeechRecognition = (): SpeechRecognitionConstructor | null => {
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };

  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
};

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

  const { models, isLoading: modelsLoading } = useAiModels(aiSettings.activeAiProvider);
  const fallbackModels = (AI_PROVIDERS[aiSettings.activeAiProvider]?.modelOptions ?? []).map(
    (option) => ({
      value: option.value,
      label: option.label,
    })
  );
  const presetLabels = AI_PROVIDERS[aiSettings.activeAiProvider]?.modelOptions ?? [];
  const modelOptions = includeSelectedModel(
    models.length > 0 ? models : fallbackModels,
    aiSettings.model
  ).map((model) => {
    const preset = presetLabels.find((option) => option.value === model.value);
    return preset ? { ...model, label: preset.label } : model;
  });

  const handleProviderChange = (nextProvider: string) => {
    if (nextProvider === aiSettings.activeAiProvider) return;
    updateSettings({
      'ai.activeAiProvider': nextProvider,
      'ai.model': '',
    } as Record<string, unknown>);
  };

  const handleModelChange = (value: string) => {
    updateSettings({ 'ai.model': value } as Record<string, unknown>);
  };

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const interimRef = useRef('');
  const spokenFinalRef = useRef('');
  const [isListening, setIsListening] = useState(false);
  const speechSupported = getSpeechRecognition() !== null;

  useEffect(() => {
    return () => recognitionRef.current?.abort();
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    interimRef.current = '';
    spokenFinalRef.current = '';
    setIsListening(false);
  }, []);

  const toggleListening = useCallback(() => {
    const SpeechRecognition = getSpeechRecognition();
    if (!SpeechRecognition) {
      toast.error({ message: t('components.voiceInputUnsupported') });
      return;
    }

    if (isListening) {
      stopListening();
      return;
    }

    let recognition: SpeechRecognitionInstance;
    try {
      recognition = new SpeechRecognition();
    } catch {
      toast.error({ message: t('components.voiceInputUnsupported') });
      return;
    }

    interimRef.current = '';
    spokenFinalRef.current = '';
    recognition.lang = navigator.language || 'en-US';
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      let finalText = '';
      let interimText = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) finalText += result[0].transcript;
        else interimText += result[0].transcript;
      }
      if (finalText) spokenFinalRef.current += finalText;

      setInput((prev) => {
        const base =
          interimRef.current && prev.endsWith(interimRef.current)
            ? prev.slice(0, prev.length - interimRef.current.length)
            : prev;
        interimRef.current = interimText;
        return base + spokenFinalRef.current + interimText;
      });
    };

    recognition.onend = () => {
      recognitionRef.current = null;
      interimRef.current = '';
      spokenFinalRef.current = '';
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      const { error } = event;
      recognitionRef.current = null;
      interimRef.current = '';
      spokenFinalRef.current = '';
      setIsListening(false);
      if (error !== 'aborted' && error !== 'no-speech') {
        toast.error({ message: t('components.voiceInputError', { error }) });
      }
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
      setIsListening(true);
    } catch {
      recognitionRef.current = null;
      toast.error({ message: t('components.voiceInputUnsupported') });
    }
  }, [isListening, stopListening]);

  const handleSend = useCallback(() => {
    const q = input.trim();
    if (!q || isLoading) return;
    stopListening();
    setInput('');
    void onSend(q);
  }, [input, isLoading, onSend, stopListening]);

  const isBusy = isLoading;
  const isNewChat = messages.length === 0 && !isBusy;

  const providerSelect = (
    <div className="min-w-0 max-w-40">
      <SearchableSelect
        chip
        options={Object.entries(AI_PROVIDERS).map(([id, aiProvider]) => ({
          label: aiProvider.label,
          value: id,
        }))}
        value={aiSettings.activeAiProvider}
        onChange={handleProviderChange}
        disabled={isBusy}
        searchPlaceholder={t('common.searchProviders')}
        contentRenderer={({ state }) => {
          const value = state.values[0];
          const Icon = value ? AI_PROVIDERS[value.value]?.icon : undefined;
          return (
            <div className="flex h-6! items-center justify-center gap-1.5">
              {Icon ? (
                <Icon className="size-4 shrink-0" />
              ) : (
                <span className="text-xs text-muted-foreground">
                  {upperCaseFirst(t('common.select'))}
                </span>
              )}
            </div>
          );
        }}
        itemRenderer={(option) => {
          const Icon = AI_PROVIDERS[option.value]?.icon;
          return (
            <>
              {Icon && <Icon className="size-4 shrink-0" />}
              <span className="min-w-0 flex-1 truncate text-left">{option.label}</span>
              {option.value === aiSettings.activeAiProvider && (
                <Check className="size-4 shrink-0" />
              )}
            </>
          );
        }}
      />
    </div>
  );

  const modelSelect = (
    <div className="min-w-0 max-w-40">
      <SearchableSelect
        chip
        options={modelOptions.map((model) => ({
          label: model.label,
          value: model.value,
          disabled: false,
        }))}
        value={aiSettings.model}
        onChange={handleModelChange}
        disabled={isBusy}
        placeholder={
          modelsLoading ? t('components.loadingModels') : upperCaseFirst(t('common.select'))
        }
        searchPlaceholder={t('components.searchModels')}
        loading={modelsLoading && models.length === 0}
        itemRenderer={(option) => (
          <>
            <span className="min-w-0 flex-1 truncate text-left">{option.label}</span>
            {option.value === aiSettings.model && <Check className="size-4 shrink-0" />}
          </>
        )}
      />
    </div>
  );

  const composer = (big: boolean) => (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSend();
      }}
      className={cn('relative w-full', big && 'max-w-xl')}
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
        placeholder={isListening ? t('components.listening') : placeholder}
        autoFocus={big}
        className={cn(
          'resize-none rounded-2xl! pr-20',
          big ? 'min-h-32 max-h-44 pb-16' : 'min-h-20 max-h-32 pb-14'
        )}
        rows={1}
      />
      <div
        className={cn(
          'absolute flex items-center gap-1.5',
          big ? 'bottom-2 left-2' : 'bottom-1.5 left-1.5'
        )}
      >
        {providerSelect}
        {modelSelect}
      </div>
      <div
        className={cn(
          'absolute flex items-center gap-1',
          big ? 'bottom-2 right-2' : 'bottom-1.5 right-1.5'
        )}
      >
        <Button
          type="button"
          size="icon-sm"
          variant={isListening ? 'default' : 'ghost'}
          onClick={toggleListening}
          disabled={!speechSupported || isBusy}
          aria-label={
            isListening ? t('components.stopVoiceInput') : t('components.startVoiceInput')
          }
          title={isListening ? t('components.stopVoiceInput') : t('components.startVoiceInput')}
          className={cn(
            'rounded-full! shrink-0',
            isListening && 'bg-destructive text-destructive-foreground animate-pulse'
          )}
        >
          {isListening ? (
            <Square className="size-3.5 fill-current" />
          ) : (
            <Mic className={isListening ? 'animate-pulse' : undefined} />
          )}
        </Button>
        <Button
          type="submit"
          size="icon-sm"
          disabled={!input.trim() || isBusy}
          className="rounded-full! shrink-0"
          aria-label={t('common.send')}
        >
          <ArrowUpIcon />
        </Button>
      </div>
    </form>
  );

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
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        {isNewChat ? (
          <div className="flex h-full flex-col items-center justify-center gap-6 px-6">
            <div className="flex flex-col items-center gap-2 text-center">
              <h2 className="flex items-center justify-center gap-2.5 text-xl font-semibold tracking-tight sm:text-2xl">
                <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Sparkles className="size-5" />
                </span>
                {t('components.hey', { name: userName || 'there' })}
              </h2>
              <p className="text-sm text-muted-foreground">{emptyText}</p>
            </div>
            {composer(true)}
          </div>
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
      {!isNewChat && <CardFooter className="shrink-0 p-3">{composer(false)}</CardFooter>}
    </Card>
  );
};
