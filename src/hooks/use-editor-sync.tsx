import { listen, UnlistenFn } from '@tauri-apps/api/event';
import { useEffect, useRef } from 'react';

import { isTauri } from '@/components/isTauri.ts';
import { toast } from '@/components/toast';
import { t } from '@/lib/i18n';
import { snippetService } from '@/lib/providers/snippet-service.ts';
import { SnippetSingleType } from '@/types/snippet.ts';

type EditorFileChangedPayload = {
  snippetId: string;
  files: { filename: string; content: string }[];
};

const SAVE_DEBOUNCE_MS = 700;

export const useEditorSync = (snippet: SnippetSingleType | null, onSynced: () => void) => {
  const snippetRef = useRef(snippet);
  snippetRef.current = snippet;
  const onSyncedRef = useRef(onSynced);
  onSyncedRef.current = onSynced;

  useEffect(() => {
    if (!isTauri()) {
      return;
    }

    let unlisten: UnlistenFn | undefined;
    let cancelled = false;
    const pending = new Map<string, string>();
    let saveTimer: number | undefined;
    let saving = false;

    const runSave = async () => {
      if (saving) {
        window.clearTimeout(saveTimer);
        saveTimer = window.setTimeout(runSave, SAVE_DEBOUNCE_MS);
        return;
      }

      const currentSnippet = snippetRef.current;
      if (!currentSnippet || pending.size === 0) {
        return;
      }

      const files: Record<string, { content: string }> = {};
      for (const [filename, content] of pending) {
        files[filename] = { content };
      }
      pending.clear();
      saving = true;

      try {
        await snippetService.updateSnippet({
          snippetId: currentSnippet.id,
          files,
          description: currentSnippet.description,
        });

        if (!cancelled) {
          onSyncedRef.current();
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : t('api.unexpectedError');
        if (!cancelled) {
          toast.error({ title: t('pages.snippet.editorSyncError'), message });
        }
      } finally {
        saving = false;
      }
    };

    const scheduleSave = () => {
      window.clearTimeout(saveTimer);
      saveTimer = window.setTimeout(runSave, SAVE_DEBOUNCE_MS);
    };

    void listen<EditorFileChangedPayload>('editor-file-changed', (event) => {
      if (event.payload.snippetId !== snippetRef.current?.id) {
        return;
      }

      for (const file of event.payload.files) {
        pending.set(file.filename, file.content);
      }
      scheduleSave();
    }).then((fn) => {
      if (cancelled) {
        fn();
      } else {
        unlisten = fn;
      }
    });

    return () => {
      cancelled = true;
      window.clearTimeout(saveTimer);
      unlisten?.();
    };
  }, []);
};
