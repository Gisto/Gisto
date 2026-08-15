import { DiffEditor } from '@monaco-editor/react';
import { FileCode2, History, Loader2, RotateCcw } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { toast } from '@/components/toast';
import { Badge } from '@/components/ui/badge.tsx';
import { Button } from '@/components/ui/button.tsx';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog.tsx';
import { EmptyState } from '@/components/ui/empty-state.tsx';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator.tsx';
import { EDITOR_OPTIONS } from '@/constants';
import { getLanguage } from '@/constants/language-map.ts';
import { t } from '@/lib/i18n';
import {
  SnippetFileType,
  SnippetRevision,
  SnippetRevisionContent,
  SnippetSingleType,
} from '@/types/snippet.ts';
import { cn, getEditorTheme, getLanguageName, removeTags } from '@/utils';

type HistoryDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  snippetId: string;
  currentSnippet: SnippetSingleType | null;
  onRestored: () => Promise<void>;
  loadRevisions: (snippetId: string) => Promise<SnippetRevision[]>;
  loadRevision: (snippetId: string, revisionId: string) => Promise<SnippetRevisionContent>;
  restoreRevision: (snippetId: string, revisionId: string) => Promise<unknown>;
};

const DIFF_OPTIONS = {
  ...EDITOR_OPTIONS,
  readOnly: true,
  renderSideBySide: true,
  originalEditable: false,
  minimap: { enabled: false },
};

export const HistoryDialog = ({
  open,
  onOpenChange,
  snippetId,
  currentSnippet,
  onRestored,
  loadRevisions,
  loadRevision,
  restoreRevision,
}: HistoryDialogProps) => {
  const [revisions, setRevisions] = useState<SnippetRevision[]>([]);
  const [contents, setContents] = useState<Record<string, SnippetRevisionContent>>({});
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [restoring, setRestoring] = useState(false);
  const [loadingRevision, setLoadingRevision] = useState(false);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    setRevisions([]);
    setContents({});
    setSelectedIndex(0);
    setSelectedFile(null);
    setLoadingRevision(false);

    loadRevisions(snippetId)
      .then((revs) => {
        if (!cancelled) setRevisions(revs);
      })
      .catch(() => {
        if (!cancelled) {
          toast.error({ message: t('api.errorTryToRefresh') });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [open, snippetId, loadRevisions]);

  const selectedRevision = revisions[selectedIndex];
  const compareRevision = selectedIndex === 0 ? null : (revisions[selectedIndex - 1] ?? null);

  useEffect(() => {
    if (!open || !selectedRevision) return;

    const targets = compareRevision ? [selectedRevision, compareRevision] : [selectedRevision];
    const missing = targets.filter((revision) => !contents[revision.id]);

    if (missing.length === 0) return;

    let cancelled = false;
    setLoadingRevision(true);

    Promise.all(
      missing.map((revision) =>
        loadRevision(snippetId, revision.id).then((content) => ({
          id: revision.id,
          content,
        }))
      )
    )
      .then((loaded) => {
        if (cancelled) return;
        setContents((prev) => {
          const next = { ...prev };
          loaded.forEach(({ id, content }) => {
            next[id] = content;
          });
          return next;
        });
      })
      .catch(() => {
        if (!cancelled) {
          toast.error({ message: t('api.errorTryToRefresh') });
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingRevision(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, snippetId, selectedRevision, compareRevision, contents, loadRevision]);

  const selectedContent = selectedRevision ? contents[selectedRevision.id] : undefined;
  const compareFiles =
    selectedIndex === 0
      ? (currentSnippet?.files ?? null)
      : (compareRevision && contents[compareRevision.id]?.files) || null;

  const fileNames = useMemo(() => {
    const names = new Set<string>();
    if (selectedContent) {
      Object.keys(selectedContent.files).forEach((name) => names.add(name));
    }
    if (compareFiles) {
      Object.keys(compareFiles).forEach((name) => names.add(name));
    }
    return [...names].sort();
  }, [selectedContent, compareFiles]);

  const activeFile = selectedFile && fileNames.includes(selectedFile) ? selectedFile : fileNames[0];

  const originalFile: SnippetFileType | undefined = selectedContent?.files[activeFile];
  const modifiedFile: SnippetFileType | undefined = compareFiles?.[activeFile];

  const fileForLanguage = originalFile ?? modifiedFile;
  const diffLanguage = getLanguage(
    fileForLanguage ? getLanguageName(fileForLanguage) : activeFile?.split('.').pop()
  );

  const formatDate = (date: string) => new Date(date).toLocaleString();

  const handleRestore = async () => {
    if (!selectedRevision) return;

    const confirmation = await confirm(t('pages.snippet.restoreVersionConfirm'));
    if (!confirmation) return;

    setRestoring(true);
    try {
      await restoreRevision(snippetId, selectedRevision.id);
      toast.info({ message: t('pages.snippet.restored') });
      await onRestored();
      onOpenChange(false);
    } catch (error) {
      toast.error({
        message: error instanceof Error ? error.message : t('api.unexpectedError'),
      });
    } finally {
      setRestoring(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="xl" className="flex h-[90vh] flex-col gap-0 overflow-hidden p-0">
        <DialogHeader className="shrink-0 p-6 pb-4">
          <DialogTitle className="flex items-center gap-2">
            <History className="size-4 text-primary" />
            {t('pages.snippet.versionHistory')}
          </DialogTitle>
          {selectedRevision && (
            <DialogDescription>
              {t('pages.snippet.version', {
                number: revisions.length - selectedIndex,
              })}{' '}
              &middot; {formatDate(selectedRevision.createdAt)}
            </DialogDescription>
          )}
        </DialogHeader>

        <Separator />

        {revisions.length === 0 ? (
          <div className="h-64">
            <EmptyState
              title={t('pages.snippet.noHistory')}
              description={t('pages.snippet.noHistoryDescription')}
            />
          </div>
        ) : (
          <div className="flex h-[57vh]">
            <ScrollArea className="w-72 shrink-0 border-r">
              <div className="flex flex-col gap-1 p-2">
                {revisions.map((revision, index) => {
                  const isSelected = index === selectedIndex;

                  return (
                    <button
                      key={revision.id}
                      type="button"
                      onClick={() => setSelectedIndex(index)}
                      className={cn(
                        'flex cursor-pointer flex-col gap-1 rounded-md p-2 text-left transition-colors',
                        isSelected ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50'
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <Badge variant="primary-outline" className="shrink-0">
                          {t('pages.snippet.versionShort', {
                            number: revisions.length - index,
                          })}
                        </Badge>
                        <span className="min-w-0 flex-1 truncate text-sm font-medium">
                          {removeTags(contents[revision.id]?.description || revision.description) ||
                            revision.meta ||
                            t('common.untitled')}
                        </span>
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(revision.createdAt)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </ScrollArea>

            <div className="flex min-w-0 flex-1 flex-col">
              {fileNames.length > 1 && (
                <ScrollArea className="shrink-0 border-b" type="auto">
                  <div className="flex gap-1 p-2">
                    {fileNames.map((name) => (
                      <button
                        key={name}
                        type="button"
                        onClick={() => setSelectedFile(name)}
                        className={cn(
                          'flex shrink-0 cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors',
                          name === activeFile
                            ? 'bg-accent text-accent-foreground'
                            : 'text-muted-foreground hover:bg-accent/50'
                        )}
                      >
                        <FileCode2 className="size-3.5" />
                        {name}
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              )}

              <div className="relative min-h-0 flex-1 p-2">
                <DiffEditor
                  original={originalFile?.content ?? ''}
                  modified={modifiedFile?.content ?? ''}
                  language={diffLanguage}
                  theme={getEditorTheme()}
                  height="100%"
                  options={DIFF_OPTIONS}
                />
                {loadingRevision && (
                  <div className="absolute inset-2 flex items-center justify-center rounded-md bg-background/60 backdrop-blur-sm">
                    <Loader2 className="size-6 animate-spin text-primary" />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <Separator />

        <DialogFooter className="shrink-0 p-6 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('common.close')}
          </Button>
          <Button onClick={handleRestore} disabled={restoring || !selectedRevision}>
            <RotateCcw />
            {t('pages.snippet.restoreVersion')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
