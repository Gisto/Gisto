import { useRouter } from 'dirty-react-router';
import {
  Copy,
  Code2,
  ExternalLink,
  Globe,
  History,
  Info,
  ListTree,
  Maximize2,
  Minimize2,
  MoreVertical,
  Pencil,
  Shield,
  ShieldCheck,
  Sparkles,
  Star,
  Trash,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import type { AssistantMessage } from '@/components/prompt-assistant.tsx';
import type { ChatMessage } from '@/lib/api/ai-api.ts';
import type { SnippetSingleType } from '@/types/snippet.ts';

import { AIChatDialog } from '@/components/ai-chat-dialog.tsx';
import { isTauri } from '@/components/isTauri.ts';
import { PageHeader } from '@/components/layout/pages/page-header.tsx';
import { File } from '@/components/layout/pages/snippet/content';
import { HistoryDialog } from '@/components/layout/pages/snippet/history-dialog.tsx';
import { Loading } from '@/components/loading.tsx';
import { DocView } from '@/components/snippet-kinds/views/doc-view.tsx';
import { FlashcardsView } from '@/components/snippet-kinds/views/flashcards-view.tsx';
import { KanbanBoard } from '@/components/snippet-kinds/views/kanban-board.tsx';
import { TodoChecklist } from '@/components/snippet-kinds/views/todo-checklist.tsx';
import { toast } from '@/components/toast';
import { Badge } from '@/components/ui/badge.tsx';
import { Button } from '@/components/ui/button.tsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator.tsx';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip.tsx';
import { GISTO_APP_CONTEXT } from '@/constants/ai-context';
import { useEditorSync } from '@/hooks/use-editor-sync.tsx';
import { AiApiError, generateAiResponse, isAiAvailable } from '@/lib/api/ai-api.ts';
import {
  getGistRevisionContent,
  getGistRevisions,
  restoreGistRevision,
} from '@/lib/api/github-api.ts';
import {
  getLocalRevisionContent,
  getSnippetRevisions,
  restoreSnippetRevision,
} from '@/lib/api/local-api.ts';
import { openSnippetInEditor } from '@/lib/api/open-in-editor.ts';
import { t } from '@/lib/i18n';
import { snippetService } from '@/lib/providers/snippet-service.ts';
import { globalState, setSnippetOpenInEditor, useStoreValue } from '@/lib/store/globalState.ts';
import { SnippetKind } from '@/types/snippet.ts';
import {
  copyToClipboard,
  fetchAndUpdateSnippets,
  getVisibleSnippetKind,
  getTags,
  isOrderedDoc,
  MANIFEST_FILENAME,
  TODO_FILENAME,
  KANBAN_FILENAME,
  FLASHCARDS_FILENAME,
  mergeSyncedSnippet,
  removeTags,
  cn,
  sortSnippetFiles,
  upperCaseFirst,
} from '@/utils';

const KindView = ({
  kind,
  snippet,
  onTodoUpdated,
  onKanbanUpdated,
  onFlashcardsUpdated,
}: {
  kind: SnippetKind;
  snippet: SnippetSingleType;
  onTodoUpdated: (content: string) => void;
  onKanbanUpdated: (content: string) => void;
  onFlashcardsUpdated: (content: string) => void;
}) => {
  if (kind === 'kanban') {
    return (
      <div className="h-full overflow-auto pb-10">
        <KanbanBoard snippet={snippet} onUpdated={onKanbanUpdated} />
      </div>
    );
  }

  if (kind === 'doc') {
    return (
      <ScrollArea className="h-full pb-10">
        <DocView snippet={snippet} ordered={isOrderedDoc(snippet.files)} />
      </ScrollArea>
    );
  }

  if (kind === 'flashcards') {
    // the view owns its own scroll container so it can center on the page
    return <FlashcardsView snippet={snippet} onUpdated={onFlashcardsUpdated} />;
  }

  if (kind === 'todo') {
    return (
      <ScrollArea className="h-full pb-10">
        <TodoChecklist snippet={snippet} onUpdated={onTodoUpdated} />
      </ScrollArea>
    );
  }

  return <SnippetFiles snippet={snippet} />;
};

const SnippetFiles = ({
  snippet,
  includeManifest = false,
}: {
  snippet: SnippetSingleType;
  includeManifest?: boolean;
}) => (
  <ScrollArea className="h-full pb-10">
    <div className="p-4">
      {renderSnippetFiles(snippet, {
        includeManifest,
        defaultPreview: includeManifest ? false : undefined,
      })}
    </div>
  </ScrollArea>
);

const renderSnippetFiles = (
  snippet: SnippetSingleType,
  {
    includeManifest = false,
    defaultPreview,
  }: { includeManifest?: boolean; defaultPreview?: boolean } = {}
) => {
  const sortByMarkdownFirst = globalState.getState()?.settings?.sortFilesByMarkdownFirst;
  const filenames = Object.keys(snippet.files).filter(
    (file) => includeManifest || file !== MANIFEST_FILENAME
  );

  return sortSnippetFiles(filenames, snippet.files, sortByMarkdownFirst).map((file) => (
    <File key={file} snippet={snippet} file={snippet.files[file]} defaultPreview={defaultPreview} />
  ));
};

export const SnippetContent = () => {
  const [snippet, setSnippet] = useState<SnippetSingleType | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSource, setShowSource] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);

  // view mode is per snippet, so reset it when navigating between snippets
  useEffect(() => {
    setShowSource(false);
    setFullScreen(false);
  }, [snippet?.id]);

  useEffect(() => {
    if (!fullScreen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setFullScreen(false);
    };

    window.addEventListener('keydown', onKeyDown);

    return () => window.removeEventListener('keydown', onKeyDown);
  }, [fullScreen]);
  const { params, navigate } = useRouter();
  const snippetState = useStoreValue('snippets').find((s) => s.id === params.id);
  const settings = useStoreValue('settings');
  const activeProvider = settings.activeSnippetProvider;
  const isLocalProvider = activeProvider === 'local';
  const isHistorySupported = isLocalProvider || activeProvider === 'github';
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<AssistantMessage[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const snippetData = await snippetService.getSnippet(params.id);

      setSnippet(snippetData);
      setLoading(false);
    };

    if (params.id) {
      void fetchData();
    }
  }, [params.id]);

  useEffect(() => {
    setChatMessages([]);
    setChatOpen(false);
  }, [params.id]);

  const snippetContext = snippet
    ? `You are helping the user with the following snippet:\nTitle: ${removeTags(snippet.description) || t('common.untitled')}\nFiles:\n${Object.values(
        snippet.files
      )
        .map((f) => `--- ${f.filename} (${f.language}) ---\n${f.content}`)
        .join('\n\n')}`
    : '';

  const handleChatSend = useCallback(
    async (prompt: string) => {
      const userMessage: AssistantMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content: prompt,
      };
      const updated = [...chatMessages, userMessage];
      setChatMessages(updated);

      if (!isAiAvailable()) {
        setChatMessages([
          ...updated,
          {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: t('api.configureAiProvider'),
          },
        ]);
        return;
      }

      const msgs: ChatMessage[] = updated.map((m) => ({ role: m.role, content: m.content }));

      setChatLoading(true);
      try {
        const result = await generateAiResponse({
          prompt,
          messages: msgs,
          systemContext: [GISTO_APP_CONTEXT, snippetContext].filter(Boolean).join('\n\n'),
        });
        setChatMessages((prev) => [
          ...prev,
          { id: crypto.randomUUID(), role: 'assistant', content: result },
        ]);
      } catch (error) {
        const msg =
          error instanceof AiApiError
            ? `Error: ${error.message}`
            : `Error: ${error instanceof Error ? error.message : t('api.unexpectedError')}`;
        setChatMessages((prev) => [
          ...prev,
          { id: crypto.randomUUID(), role: 'assistant', content: msg },
        ]);
      } finally {
        setChatLoading(false);
      }
    },
    [chatMessages, snippetContext]
  );

  const handleRestored = useCallback(async () => {
    const snippetData = await snippetService.getSnippet(params.id);
    setSnippet(snippetData);
    await fetchAndUpdateSnippets();
  }, [params.id]);

  const loadRevisions = useCallback(
    (id: string) => (activeProvider === 'github' ? getGistRevisions(id) : getSnippetRevisions(id)),
    [activeProvider]
  );

  const loadRevision = useCallback(
    (id: string, revisionId: string) =>
      activeProvider === 'github'
        ? getGistRevisionContent(id, revisionId)
        : getLocalRevisionContent(id, revisionId),
    [activeProvider]
  );

  const restoreRevision = useCallback(
    (id: string, revisionId: string) =>
      activeProvider === 'github'
        ? restoreGistRevision(id, revisionId)
        : restoreSnippetRevision(id, revisionId),
    [activeProvider]
  );

  const handleEditorSynced = useCallback(async () => {
    const snippetData = await snippetService.getSnippet(params.id);
    setSnippet(snippetData);

    globalState.setState({
      snippets: globalState
        .getState()
        .snippets.map((s) => (s.id === snippetData.id ? mergeSyncedSnippet(s, snippetData) : s)),
    });
  }, [params.id]);

  useEditorSync(snippet, handleEditorSynced);

  if (loading || !snippet) {
    return <Loading />;
  }

  const kind = getVisibleSnippetKind(snippet.files);
  const isStructuredKind = kind !== 'snippet';
  const badges = getTags(snippet.description);
  const updateFileContent = (filename: string, content: string) =>
    setSnippet((previous) => {
      if (!previous) return previous;

      const target = Object.values(previous.files).find((file) => file.filename === filename);
      if (!target) return previous;

      return {
        ...previous,
        files: {
          ...previous.files,
          [target.filename]: { ...target, content },
        },
      };
    });
  const handleTodoUpdated = (content: string) => updateFileContent(TODO_FILENAME, content);
  const handleKanbanUpdated = (content: string) => updateFileContent(KANBAN_FILENAME, content);
  const handleFlashcardsUpdated = (content: string) =>
    updateFileContent(FLASHCARDS_FILENAME, content);

  return (
    <div className="h-screen w-full min-w-0 border-r border-collapse">
      <PageHeader>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <div className="line-clamp-1">
              {removeTags(snippet.description) || t('common.untitled')}
            </div>

            {kind !== 'snippet' && (
              <Badge variant="secondary">{upperCaseFirst(t(`common.${kind}`))}</Badge>
            )}

            {badges.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex gap-2">
                  {badges.map((tag) => (
                    <Badge
                      key={tag}
                      variant="primary-outline"
                      className="whitespace-nowrap cursor-pointer hover:text-primary/50 hover:border-primary/50"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 ml-6">
            {isAiAvailable() && (
              <Button
                variant="ghost"
                size="icon"
                className="-mx-3"
                onClick={() => setChatOpen(true)}
              >
                <Sparkles
                  className="size-4 text-primary"
                  style={{ filter: 'drop-shadow(0 0 6px hsl(var(--primary)))' }}
                />
                <span className="sr-only">{t('components.aiAssistant')}</span>
              </Button>
            )}

            {isStructuredKind && (
              <>
                <Separator orientation="vertical" className="mx-2 h-6" />
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="-mx-3"
                      onClick={() => setShowSource((value) => !value)}
                    >
                      {showSource ? <ListTree className="size-4" /> : <Code2 className="size-4" />}
                      <span className="sr-only">
                        {t(showSource ? 'pages.snippet.showKindView' : 'pages.snippet.showSource')}
                      </span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {t(showSource ? 'pages.snippet.showKindView' : 'pages.snippet.showSource')}
                  </TooltipContent>
                </Tooltip>
              </>
            )}

            <Separator orientation="vertical" className="mx-2 h-6" />

            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="-mx-3"
                  onClick={() => setFullScreen((value) => !value)}
                >
                  {fullScreen ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
                  <span className="sr-only">
                    {t(fullScreen ? 'pages.snippet.exitFullScreen' : 'pages.snippet.fullScreen')}
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {t(fullScreen ? 'pages.snippet.exitFullScreen' : 'pages.snippet.fullScreen')}
              </TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="mx-2 h-6" />

            <Button
              variant="ghost"
              size="icon"
              className="-mx-3"
              onClick={() => navigate(`/edit/${snippet.id}`)}
            >
              <Pencil className="size-4" />
              <span className="sr-only">{upperCaseFirst(t('common.edit'))}</span>
            </Button>

            {isHistorySupported && (
              <>
                <Separator orientation="vertical" className="mx-2 h-6" />
                <Button
                  variant="ghost"
                  size="icon"
                  className="-mx-3"
                  onClick={() => setHistoryOpen(true)}
                >
                  <History className="size-4" />
                  <span className="sr-only">{t('pages.snippet.versionHistory')}</span>
                </Button>
              </>
            )}

            <Separator orientation="vertical" className="mx-2 h-6" />

            {snippetState && snippetState.isPublic ? (
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    onClick={async () => {
                      const confirmation = await confirm(
                        t('list.sureToChangeVisibility', {
                          name: removeTags(snippet.description),
                          visibility: t('common.private'),
                        })
                      );

                      if (confirmation) {
                        await snippetService.toggleSnippetVisibility(snippet.id);
                        navigate('/');
                        await fetchAndUpdateSnippets();
                      }
                    }}
                    variant="ghost"
                    size="icon"
                    className="-mx-3"
                  >
                    <Shield
                      strokeWidth={1.5}
                      className="size-3 cursor-pointer hover:text-primary stroke-danger"
                    />
                    <span className="sr-only">{t('common.lock')}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {upperCaseFirst(t('common.public'))} {t('common.snippet')}
                </TooltipContent>
              </Tooltip>
            ) : (
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    onClick={async () => {
                      const confirmation = await confirm(
                        t('list.sureToChangeVisibility', {
                          name: removeTags(snippet.description),
                          visibility: t('common.public'),
                        })
                      );

                      if (confirmation) {
                        await snippetService.toggleSnippetVisibility(snippet.id);
                        navigate('/');
                        await fetchAndUpdateSnippets();
                      }
                    }}
                    variant="ghost"
                    size="icon"
                    className="-mx-3"
                  >
                    <ShieldCheck
                      strokeWidth={1.5}
                      className="size-3 cursor-pointer hover:text-primary stroke-success"
                    />
                    <span className="sr-only">{t('common.lock')}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {upperCaseFirst(t('common.private'))} {t('common.snippet')}
                </TooltipContent>
              </Tooltip>
            )}

            <Separator orientation="vertical" className="mx-2 h-6" />
            {snippetService.capabilities.supportsStars && (
              <>
                {snippetState && snippetState.starred ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="-mx-3"
                    onClick={async () => await snippetService.deleteStar(snippet.id)}
                  >
                    <Star className="size-4 fill-primary stroke-primary" />
                    <span className="sr-only">{upperCaseFirst(t('common.starred'))}</span>
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="-mx-3"
                    onClick={async () => await snippetService.addStar(snippet.id)}
                  >
                    <Star className="size-4" />
                    <span className="sr-only">{upperCaseFirst(t('common.star'))}</span>
                  </Button>
                )}

                <Separator orientation="vertical" className="mx-2 h-6" />
              </>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild className="">
                <Button variant="ghost" size="icon" className="-ml-3">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">{t('common.more')}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <a className="cursor-pointer" href={snippet.html_url} target="_blank">
                    <Globe /> {upperCaseFirst(t('pages.snippet.openOnWeb'))}
                  </a>
                </DropdownMenuItem>
                {isTauri() && (
                  <DropdownMenuItem
                    onClick={async () => {
                      try {
                        const dirPath = await openSnippetInEditor(
                          snippet.id,
                          Object.values(snippet.files).map((file) => ({
                            filename: file.filename,
                            content: file.content ?? '',
                          })),
                          settings.externalEditor.command
                        );

                        setSnippetOpenInEditor(snippet.id, true);

                        toast.info({
                          title: t('pages.snippet.openInEditor'),
                          message: t('pages.snippet.openedInEditor', { path: dirPath }),
                        });
                      } catch (error) {
                        toast.error({
                          title: t('pages.snippet.openInEditor'),
                          message:
                            error instanceof Error ? error.message : t('api.unexpectedError'),
                        });
                      }
                    }}
                  >
                    <Code2 /> {t('pages.snippet.openInEditor')}
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => copyToClipboard(snippet.id)}>
                  <Copy /> {t('pages.snippet.copySnippetId')}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    copyToClipboard(
                      `<script src="https://gist.github.com/${globalState.getState()?.user?.login ?? ''}/${snippet.id}.js"></script>`
                    )
                  }
                >
                  <Copy /> {t('pages.snippet.copyEmbed')}
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a
                    className="cursor-pointer"
                    href={`https://plnkr.co/edit/gist:${snippet?.id}?preview`}
                    target="_blank"
                  >
                    <ExternalLink /> {t('pages.snippet.openIn')} <strong>plnkr</strong>
                  </a>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <a
                    className="cursor-pointer"
                    href={`https://jsfiddle.net/gh/gist/library/pure/${snippet?.id}`}
                    target="_blank"
                  >
                    <ExternalLink /> {t('pages.snippet.openIn')} <strong>jsfiddle</strong>{' '}
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger asChild>
                        <Info strokeWidth={1.5} className="size-3 cursor-pointer" />
                      </TooltipTrigger>
                      <TooltipContent align="end">
                        {t('pages.snippet.jsfiddleInstructions')}
                      </TooltipContent>
                    </Tooltip>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-danger"
                  onClick={async () => {
                    const confirmation = await confirm(
                      t('list.sureToDelete', {
                        description: removeTags(snippet.description),
                      })
                    );

                    if (confirmation) {
                      const value = await snippetService.deleteSnippet(snippet.id, true);

                      if (value.success) {
                        navigate('/');
                      }
                    }
                  }}
                >
                  <Trash /> {upperCaseFirst(t('common.delete'))}{' '}
                  <small>({t('pages.snippet.cannotBeUndone')})</small>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </PageHeader>
      <div
        className={cn(
          'bg-secondary h-full shadow-inner',
          fullScreen && 'fixed inset-0 z-50 flex flex-col'
        )}
      >
        {fullScreen && (
          <div className="flex h-[52px] shrink-0 items-center justify-between gap-2 border-b bg-background px-4">
            <div className="line-clamp-1 text-sm font-medium">
              {removeTags(snippet.description) || t('common.untitled')}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setFullScreen(false)}
              aria-label={t('pages.snippet.exitFullScreen')}
            >
              <Minimize2 className="size-4" />
            </Button>
          </div>
        )}
        <div className={cn('min-h-0', fullScreen ? 'flex-1' : 'h-full')}>
          {showSource ? (
            <SnippetFiles snippet={snippet} includeManifest />
          ) : (
            <KindView
              kind={kind}
              snippet={snippet}
              onTodoUpdated={handleTodoUpdated}
              onKanbanUpdated={handleKanbanUpdated}
              onFlashcardsUpdated={handleFlashcardsUpdated}
            />
          )}
        </div>
      </div>

      <AIChatDialog
        open={chatOpen}
        onOpenChange={setChatOpen}
        messages={chatMessages}
        onSend={handleChatSend}
        onClear={() => setChatMessages([])}
        isLoading={chatLoading}
        emptyText={t('pages.snippet.askAbout', {
          title: removeTags(snippet.description) || t('common.untitled'),
        })}
        placeholder={t('pages.snippet.askAQuestion')}
      />

      {isHistorySupported && (
        <HistoryDialog
          open={historyOpen}
          onOpenChange={setHistoryOpen}
          snippetId={snippet.id}
          currentSnippet={snippet}
          onRestored={handleRestored}
          loadRevisions={loadRevisions}
          loadRevision={loadRevision}
          restoreRevision={restoreRevision}
        />
      )}
    </div>
  );
};
