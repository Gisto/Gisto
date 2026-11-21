import { useCallback, useState } from 'react';

import { withKindFile } from './registry.ts';

import { toast } from '@/components/toast';
import { t } from '@/lib/i18n';
import { snippetService } from '@/lib/providers/snippet-service.ts';
import { SnippetSingleType, StructuredSnippetKind } from '@/types/snippet.ts';

/**
 * Persists a structured kind's data file for the active snippet.
 *
 * Local providers replace the file map, so `withKindFile` keeps the other files
 * untouched. Errors are surfaced as a toast and reported through the boolean
 * result so callers can roll back optimistic state.
 */
export const useKindSaver = (
  snippet: SnippetSingleType,
  kind: StructuredSnippetKind,
  onUpdated?: (content: string) => void
) => {
  const [saving, setSaving] = useState(false);

  const save = useCallback(
    async (
      content: string,
      errorTitle: string,
      extraFiles?: Record<string, { content: string }>
    ) => {
      setSaving(true);

      try {
        const files = { ...withKindFile(snippet.files, kind, content), ...extraFiles };

        await snippetService.updateSnippet({
          snippetId: snippet.id,
          files,
          description: snippet.description,
        });

        onUpdated?.(content);
        return true;
      } catch (error) {
        toast.error({
          title: errorTitle,
          message: error instanceof Error ? error.message : t('api.unexpectedError'),
        });
        return false;
      } finally {
        setSaving(false);
      }
    },
    [snippet, kind, onUpdated]
  );

  return { save, saving };
};
