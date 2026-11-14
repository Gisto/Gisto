import { ArrowDown, ArrowUp, Plus, Trash } from 'lucide-react';
import { z } from 'zod';

import { ActionType } from '@/components/layout/pages/create-or-edit-snippet/reducer.ts';
import { EDITOR_ITEM_CARD } from '@/components/snippet-kinds/editors/editor-card.ts';
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Textarea } from '@/components/ui/textarea';
import { ZodError } from '@/components/zod-error.tsx';
import { t } from '@/lib/i18n';
import { DocEntry } from '@/types/snippet.ts';
import { cn } from '@/utils';

type Props = {
  entries: DocEntry[];
  ordered: boolean;
  dispatch: React.Dispatch<ActionType>;
  errors: z.ZodIssue[];
};

const SECTION_SUGGESTIONS = ['', 'General', 'Setup', 'Usage', 'Shortcuts', 'Troubleshooting'];

export const DocEditor = ({ entries, ordered, dispatch, errors }: Props) => (
  <div className="flex flex-col gap-3">
    <div className="flex items-center justify-between gap-2">
      <label className="text-sm font-medium text-primary flex gap-2">
        {t('pages.new.docEntries')} <ZodError errors={errors} path="files.0.content" />
      </label>
      <label className="flex items-center gap-2 text-xs text-muted-foreground">
        <input
          type="checkbox"
          checked={ordered}
          onChange={(event) => dispatch({ type: 'SET_DOC_ORDERED', payload: event.target.checked })}
          className="size-4 accent-primary"
        />
        {t('pages.new.docOrdered')}
      </label>
    </div>

    <datalist id="doc-sections">
      {SECTION_SUGGESTIONS.filter(Boolean).map((section) => (
        <option key={section} value={section} />
      ))}
    </datalist>

    {entries.map((entry, index) => (
      <div key={entry.id} className={cn('flex flex-col gap-2', EDITOR_ITEM_CARD)}>
        <div className="flex items-center gap-2">
          {ordered && (
            <span className="w-5 shrink-0 text-center text-xs text-muted-foreground">
              {index + 1}
            </span>
          )}

          <Input
            value={entry.section}
            onChange={(event) =>
              dispatch({
                type: 'SET_DOC_ENTRY',
                payload: { id: entry.id, patch: { section: event.target.value } },
              })
            }
            placeholder={t('pages.new.docSection')}
            list="doc-sections"
            className="max-w-44"
          />

          <Input
            value={entry.title}
            onChange={(event) =>
              dispatch({
                type: 'SET_DOC_ENTRY',
                payload: { id: entry.id, patch: { title: event.target.value } },
              })
            }
            placeholder={t('pages.new.docEntryTitle')}
          />

          <div className="ml-auto flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              disabled={index === 0}
              onClick={() =>
                dispatch({ type: 'MOVE_DOC_ENTRY', payload: { id: entry.id, direction: -1 } })
              }
              aria-label={t('pages.new.moveUp')}
            >
              <ArrowUp className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled={index === entries.length - 1}
              onClick={() =>
                dispatch({ type: 'MOVE_DOC_ENTRY', payload: { id: entry.id, direction: 1 } })
              }
              aria-label={t('pages.new.moveDown')}
            >
              <ArrowDown className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => dispatch({ type: 'REMOVE_DOC_ENTRY', payload: entry.id })}
              aria-label={t('pages.new.removeEntry')}
            >
              <Trash className="size-4" />
            </Button>
          </div>
        </div>

        <Textarea
          value={entry.description}
          onChange={(event) =>
            dispatch({
              type: 'SET_DOC_ENTRY',
              payload: { id: entry.id, patch: { description: event.target.value } },
            })
          }
          placeholder={t('pages.new.docDescription')}
          rows={2}
        />

        <div className="flex items-start gap-2">
          <Input
            value={entry.language}
            onChange={(event) =>
              dispatch({
                type: 'SET_DOC_ENTRY',
                payload: { id: entry.id, patch: { language: event.target.value } },
              })
            }
            placeholder={t('pages.new.docLanguage')}
            className="max-w-32 font-mono text-xs"
            aria-label={t('pages.new.docLanguage')}
          />
          <Textarea
            value={entry.code}
            onChange={(event) =>
              dispatch({
                type: 'SET_DOC_ENTRY',
                payload: { id: entry.id, patch: { code: event.target.value } },
              })
            }
            placeholder={t('pages.new.docCode')}
            rows={2}
            className="font-mono text-xs"
            aria-label={t('pages.new.docCode')}
          />
        </div>
      </div>
    ))}

    <Button
      variant="outline"
      className="self-start"
      onClick={() => dispatch({ type: 'ADD_DOC_ENTRY' })}
    >
      <Plus className="size-4" />
      {t('pages.new.addEntry')}
    </Button>
  </div>
);
