import { ArrowLeft, ArrowRight, Plus, Trash, X } from 'lucide-react';
import { useState } from 'react';
import { z } from 'zod';

import { ActionType } from '@/components/layout/pages/create-or-edit-snippet/reducer.ts';
import { EDITOR_ITEM_CARD } from '@/components/snippet-kinds/editors/editor-card.ts';
import {
  KANBAN_PRIORITY_STYLES,
  priorityLabel,
} from '@/components/snippet-kinds/kanban-priority.ts';
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.tsx';
import { Textarea } from '@/components/ui/textarea';
import { ZodError } from '@/components/zod-error.tsx';
import { t } from '@/lib/i18n';
import { KANBAN_PRIORITIES } from '@/lib/snippet-kinds/kanban.ts';
import { KanbanColumn, KanbanPriority } from '@/types/snippet.ts';
import { cn } from '@/utils';

type Props = {
  board: KanbanColumn[];
  dispatch: React.Dispatch<ActionType>;
  errors: z.ZodIssue[];
};

const CardLabels = ({
  labels,
  onChange,
}: {
  labels: string[];
  onChange: (labels: string[]) => void;
}) => {
  const [value, setValue] = useState('');

  const addLabel = () => {
    const label = value.trim();
    if (label && !labels.includes(label)) onChange([...labels, label]);
    setValue('');
  };

  return (
    <div className="flex flex-wrap items-center gap-1">
      {labels.map((label) => (
        <span
          key={label}
          className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary"
        >
          {label}
          <X
            className="size-3 cursor-pointer hover:text-danger"
            onClick={() => onChange(labels.filter((item) => item !== label))}
          />
        </span>
      ))}
      <Input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ',') {
            event.preventDefault();
            addLabel();
          }
        }}
        onBlur={addLabel}
        placeholder={t('pages.new.addLabel')}
        className="h-7 w-28 text-xs"
      />
    </div>
  );
};

export const KanbanBoardEditor = ({ board, dispatch, errors }: Props) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm font-medium text-primary flex gap-2">
      {t('pages.new.typeKanban')} <ZodError errors={errors} path="files.0.content" />
    </label>
    <div className="flex items-start gap-4 overflow-x-auto pb-2">
      {board.map((column, columnIndex) => (
        <div key={column.id} className={cn('flex w-80 shrink-0 flex-col gap-2', EDITOR_ITEM_CARD)}>
          <div className="flex items-center gap-2">
            <Input
              value={column.title}
              onChange={(e) =>
                dispatch({
                  type: 'SET_COLUMN_TITLE',
                  payload: { id: column.id, title: e.target.value },
                })
              }
              placeholder={t('pages.new.enterColumnTitle')}
              className="font-medium"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => dispatch({ type: 'REMOVE_COLUMN', payload: column.id })}
              aria-label={t('common.delete')}
            >
              <Trash className="size-4" />
            </Button>
          </div>
          {column.cards.map((card, cardIndex) => (
            <div
              key={`${column.id}-${cardIndex}`}
              className="flex flex-col gap-1 rounded-lg border border-border bg-background p-2"
            >
              <div className="flex items-center gap-1">
                <Input
                  value={card.title}
                  onChange={(e) =>
                    dispatch({
                      type: 'SET_CARD',
                      payload: {
                        columnId: column.id,
                        index: cardIndex,
                        card: { ...card, title: e.target.value },
                      },
                    })
                  }
                  placeholder={t('pages.new.enterCardTitle')}
                  className="font-semibold"
                />
                <Button
                  variant="outline"
                  size="icon"
                  disabled={columnIndex === 0}
                  onClick={() =>
                    dispatch({
                      type: 'MOVE_CARD',
                      payload: {
                        from: column.id,
                        to: board[columnIndex - 1].id,
                        index: cardIndex,
                      },
                    })
                  }
                  aria-label={t('common.moveLeft')}
                >
                  <ArrowLeft className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  disabled={columnIndex === board.length - 1}
                  onClick={() =>
                    dispatch({
                      type: 'MOVE_CARD',
                      payload: {
                        from: column.id,
                        to: board[columnIndex + 1].id,
                        index: cardIndex,
                      },
                    })
                  }
                  aria-label={t('common.moveRight')}
                >
                  <ArrowRight className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    dispatch({
                      type: 'REMOVE_CARD',
                      payload: { columnId: column.id, index: cardIndex },
                    })
                  }
                  aria-label={t('common.delete')}
                >
                  <Trash className="size-4" />
                </Button>
              </div>
              <Textarea
                value={card.description}
                onChange={(e) =>
                  dispatch({
                    type: 'SET_CARD',
                    payload: {
                      columnId: column.id,
                      index: cardIndex,
                      card: { ...card, description: e.target.value },
                    },
                  })
                }
                placeholder={t('pages.new.cardDescription')}
                className="min-h-9 text-sm"
              />
              <CardLabels
                labels={card.labels}
                onChange={(labels) =>
                  dispatch({
                    type: 'SET_CARD',
                    payload: { columnId: column.id, index: cardIndex, card: { ...card, labels } },
                  })
                }
              />
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{t('common.priority')}</span>
                <Select
                  value={card.priority ?? ''}
                  onValueChange={(value) =>
                    dispatch({
                      type: 'SET_CARD',
                      payload: {
                        columnId: column.id,
                        index: cardIndex,
                        card: { ...card, priority: value as KanbanPriority },
                      },
                    })
                  }
                >
                  <SelectTrigger className="h-7 w-28 text-xs" aria-label={t('common.priority')}>
                    <SelectValue placeholder={t('common.priority')} />
                  </SelectTrigger>
                  <SelectContent>
                    {KANBAN_PRIORITIES.map((priority) => (
                      <SelectItem key={priority} value={priority}>
                        <span className="flex items-center gap-1.5">
                          <span
                            className={`size-2 rounded-full ${KANBAN_PRIORITY_STYLES[priority].dotClassName}`}
                          />
                          {priorityLabel(priority)}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}
          <Button
            variant="outline"
            className="self-start"
            onClick={() => dispatch({ type: 'ADD_CARD', payload: column.id })}
          >
            <Plus className="size-4" />
            {t('pages.new.addCard')}
          </Button>
        </div>
      ))}
      <Button
        variant="outline"
        className="shrink-0"
        onClick={() => dispatch({ type: 'ADD_COLUMN' })}
      >
        <Plus className="size-4" />
        {t('pages.new.addColumn')}
      </Button>
    </div>
  </div>
);
