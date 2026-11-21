import { Fragment, useState } from 'react';

import {
  KANBAN_PRIORITY_STYLES,
  priorityLabel,
} from '@/components/snippet-kinds/kanban-priority.ts';
import { KindMarkdown } from '@/components/snippet-kinds/kind-markdown.tsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog.tsx';
import { t } from '@/lib/i18n';
import { parseColumns } from '@/lib/snippet-kinds/kanban.ts';
import { useKindSaver } from '@/lib/snippet-kinds/use-kind-saver.ts';
import { useKindState } from '@/lib/snippet-kinds/use-kind-state.ts';
import { KanbanCard, KanbanPriority, SnippetSingleType } from '@/types/snippet.ts';
import { cn, findKanbanFile, moveBoardCard, serializeBoard } from '@/utils';

type CardLocation = { columnId: string; index: number };

const LABEL_CLASSES = [
  'bg-blue-500/15 text-blue-700 dark:text-blue-300',
  'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
  'bg-amber-500/15 text-amber-700 dark:text-amber-300',
  'bg-rose-500/15 text-rose-700 dark:text-rose-300',
  'bg-violet-500/15 text-violet-700 dark:text-violet-300',
  'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300',
];

const labelClass = (label: string) => {
  let hash = 0;
  for (const char of label) hash = (hash * 31 + char.charCodeAt(0)) | 0;
  return LABEL_CLASSES[Math.abs(hash) % LABEL_CLASSES.length];
};

const PriorityChip = ({ priority }: { priority: KanbanPriority }) => {
  const style = KANBAN_PRIORITY_STYLES[priority];

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${style.className}`}
    >
      <span className={`size-1.5 rounded-full ${style.dotClassName}`} />
      {priorityLabel(priority)}
    </span>
  );
};

const LabelChips = ({ labels }: { labels: string[] }) =>
  labels.length ? (
    <div className="flex flex-wrap gap-1">
      {labels.map((label) => (
        <span key={label} className={cn('rounded-full px-2 py-0.5 text-xs', labelClass(label))}>
          {label}
        </span>
      ))}
    </div>
  ) : null;

const readDrag = (event: React.DragEvent): CardLocation | null => {
  try {
    const value = JSON.parse(event.dataTransfer.getData('text/plain')) as CardLocation;
    return typeof value.columnId === 'string' && typeof value.index === 'number' ? value : null;
  } catch {
    return null;
  }
};

const insertionIndex = (event: React.DragEvent<HTMLDivElement>): number => {
  const cards = Array.from(event.currentTarget.querySelectorAll('[data-kanban-card]'));
  const position = cards.findIndex((card) => {
    const rect = card.getBoundingClientRect();
    return event.clientY < rect.top + rect.height / 2;
  });

  return position === -1 ? cards.length : position;
};

export const KanbanBoard = ({
  snippet,
  onUpdated,
}: {
  snippet: SnippetSingleType;
  onUpdated: (content: string) => void;
}) => {
  const [columns, setColumns] = useKindState(
    findKanbanFile(snippet.files)?.content ?? '',
    snippet.id,
    parseColumns
  );
  const { save, saving } = useKindSaver(snippet, 'kanban', onUpdated);
  const [dragging, setDragging] = useState<CardLocation | null>(null);
  const [dragHeight, setDragHeight] = useState(0);
  const [dropTarget, setDropTarget] = useState<CardLocation | null>(null);
  const [detail, setDetail] = useState<KanbanCard | null>(null);

  const moveCard = async (from: CardLocation, toColumnId: string, toIndex?: number) => {
    const previous = columns;
    const next = moveBoardCard(columns, from, toColumnId, toIndex);

    if (next === columns) return;

    setColumns(next);

    const saved = await save(serializeBoard(next), t('pages.snippet.kanbanUpdateError'));

    if (!saved) setColumns(previous);
  };

  if (columns.length === 0) {
    return (
      <div className="p-4">
        <p className="text-muted-foreground">{t('pages.snippet.kanbanEmpty')}</p>
      </div>
    );
  }

  return (
    <>
      <div className="w-max min-w-full p-4">
        <div className="flex items-start gap-4">
          {columns.map((column) => (
            <div
              key={column.id}
              className="flex w-72 shrink-0 flex-col gap-2 rounded-md border bg-background p-3 min-h-24"
              onDragOver={(event) => {
                event.preventDefault();
                setDropTarget({ columnId: column.id, index: insertionIndex(event) });
              }}
              onDragLeave={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node)) {
                  setDropTarget((current) => (current?.columnId === column.id ? null : current));
                }
              }}
              onDrop={(event) => {
                event.preventDefault();
                const from = readDrag(event);
                const index = insertionIndex(event);
                setDragging(null);
                setDropTarget(null);
                if (from) void moveCard(from, column.id, index);
              }}
            >
              {column.title.trim() && (
                <div className="text-sm font-semibold break-words">{column.title}</div>
              )}
              {column.cards.map((card, index) => {
                const isDragged = dragging?.columnId === column.id && dragging.index === index;

                return (
                  <Fragment key={`${column.id}-${index}`}>
                    {dropTarget?.columnId === column.id && dropTarget.index === index && (
                      <div
                        style={{ height: dragHeight || undefined }}
                        className="min-h-9 rounded-md border-2 border-dashed border-primary/40 bg-primary/5"
                      />
                    )}
                    <div
                      draggable={!saving}
                      onDragStart={(event) => {
                        event.dataTransfer.effectAllowed = 'move';
                        event.dataTransfer.setData(
                          'text/plain',
                          JSON.stringify({ columnId: column.id, index })
                        );
                        setDragging({ columnId: column.id, index });
                        setDragHeight(event.currentTarget.offsetHeight);
                      }}
                      onDragEnd={() => {
                        setDragging(null);
                        setDragHeight(0);
                        setDropTarget(null);
                      }}
                      onClick={(event) => {
                        if ((event.target as HTMLElement).closest('a')) return;
                        setDetail(card);
                      }}
                      data-kanban-card
                      className={cn(
                        'rounded-md border bg-secondary p-2 text-sm break-words cursor-grab select-none active:cursor-grabbing',
                        isDragged && 'opacity-50'
                      )}
                    >
                      {card.title.trim() && (
                        <KindMarkdown text={card.title} inline className="font-semibold" />
                      )}
                      {card.description.trim() && (
                        <KindMarkdown
                          text={card.description}
                          className="pt-1.5 text-muted-foreground text-xs"
                        />
                      )}
                      {(card.priority || card.labels.length > 0) && (
                        <div className="mt-1 flex flex-wrap items-center gap-1">
                          {card.priority && <PriorityChip priority={card.priority} />}
                          <LabelChips labels={card.labels} />
                        </div>
                      )}
                    </div>
                  </Fragment>
                );
              })}
              {dropTarget?.columnId === column.id && dropTarget.index >= column.cards.length && (
                <div
                  style={{ height: dragHeight || undefined }}
                  className="min-h-9 rounded-md border-2 border-dashed border-primary/40 bg-primary/5"
                />
              )}
            </div>
          ))}
        </div>
      </div>
      <Dialog open={detail !== null} onOpenChange={(open) => !open && setDetail(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {detail?.title.trim() ? (
                <KindMarkdown text={detail.title} inline />
              ) : (
                t('pages.snippet.cardDetails')
              )}
            </DialogTitle>
            <div className="flex flex-wrap items-center gap-1">
              {detail?.priority && <PriorityChip priority={detail.priority} />}
              <LabelChips labels={detail?.labels ?? []} />
            </div>
          </DialogHeader>
          {detail?.description.trim() && (
            <KindMarkdown text={detail.description} className="pt-1" />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
