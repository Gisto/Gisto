import { findKindFile, KIND_FILENAMES } from './registry.ts';

import { KanbanCard, KanbanColumn, KanbanPriority, SnippetFileType } from '@/types/snippet.ts';

export const KANBAN_FILENAME = KIND_FILENAMES.kanban;

/** Shared with the board view so parsing and rendering agree on what a card is. */
export const isKanbanCard = (card: KanbanCard): boolean =>
  Boolean(card.title.trim() || card.description.trim());

export const KANBAN_PRIORITIES: KanbanPriority[] = ['low', 'medium', 'high'];

export const isKanbanPriority = (value: unknown): value is KanbanPriority =>
  typeof value === 'string' && (KANBAN_PRIORITIES as string[]).includes(value);

const parseCard = (card: unknown): KanbanCard | null => {
  if (typeof card === 'string') {
    const title = card.trim();
    return title ? { title, description: '', labels: [] } : null;
  }
  if (!card || typeof card !== 'object') return null;

  const { title, description, labels, priority } = card as {
    title?: unknown;
    description?: unknown;
    labels?: unknown;
    priority?: unknown;
  };
  const parsed = {
    title: typeof title === 'string' ? title : '',
    description: typeof description === 'string' ? description : '',
    labels: Array.isArray(labels)
      ? Array.from(
          new Set(
            labels
              .filter((label): label is string => typeof label === 'string')
              .map((label) => label.trim())
              .filter(Boolean)
          )
        )
      : [],
    priority: isKanbanPriority(priority) ? priority : undefined,
  };

  return isKanbanCard(parsed) ? parsed : null;
};

export const parseBoard = (content: string): KanbanColumn[] => {
  try {
    const board = JSON.parse(content) as { columns?: unknown };
    if (!Array.isArray(board.columns)) return [];

    return board.columns.flatMap((column) => {
      if (!column || typeof column !== 'object') return [];

      const { title, cards } = column as { title?: unknown; cards?: unknown };
      return [
        {
          id: crypto.randomUUID(),
          title: typeof title === 'string' ? title : '',
          cards: Array.isArray(cards) ? cards.flatMap((card) => parseCard(card) ?? []) : [],
        },
      ];
    });
  } catch {
    return [];
  }
};

/** Drop index adjusted for the card being removed from the same column. */
const insertionAt = (
  from: { columnId: string; index: number },
  targetLength: number,
  toIndex?: number,
  toColumnId?: string
): number => {
  if (toIndex === undefined) return targetLength;
  if (from.columnId === toColumnId && from.index < toIndex) return Math.max(toIndex - 1, 0);

  return toIndex;
};

export const moveBoardCard = (
  columns: KanbanColumn[],
  from: { columnId: string; index: number },
  toColumnId: string,
  toIndex?: number
): KanbanColumn[] => {
  const next = columns.map((column) => ({ ...column, cards: [...column.cards] }));
  const fromColumn = next.find((column) => column.id === from.columnId);
  const toColumn = next.find((column) => column.id === toColumnId);

  if (!fromColumn || !toColumn) return columns;

  const insertAt = insertionAt(from, toColumn.cards.length, toIndex, toColumnId);

  if (from.columnId === toColumnId && insertAt === from.index) return columns;

  const [card] = fromColumn.cards.splice(from.index, 1);
  if (card === undefined) return columns;

  toColumn.cards.splice(insertAt, 0, card);
  return next;
};

export const serializeBoard = (columns: KanbanColumn[]): string =>
  JSON.stringify(
    {
      columns: columns.map((column) => ({
        title: column.title.trim(),
        cards: column.cards
          .map((card) => ({
            title: card.title.trim(),
            description: card.description.trim(),
            labels: card.labels.map((label) => label.trim()).filter(Boolean),
            ...(card.priority ? { priority: card.priority } : {}),
          }))
          .filter((card) => card.title || card.description),
      })),
    },
    null,
    2
  );

/** Board file content with empty cards and columns removed. */
export const parseColumns = (content: string): KanbanColumn[] =>
  parseBoard(content)
    .map((column) => ({ ...column, cards: column.cards.filter(isKanbanCard) }))
    .filter((column) => column.title.trim() || column.cards.length > 0);

export const findKanbanFile = (
  files: Record<string, SnippetFileType>
): SnippetFileType | undefined => findKindFile(files, 'kanban');
