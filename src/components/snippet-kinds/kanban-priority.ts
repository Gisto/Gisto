import { t } from '@/lib/i18n';
import { KanbanPriority } from '@/types/snippet.ts';

type PriorityStyle = { className: string; dotClassName: string; labelKey: string };

/** Chip styling and label for kanban card priorities, shared by editor and board. */
export const KANBAN_PRIORITY_STYLES: Record<KanbanPriority, PriorityStyle> = {
  low: {
    className: 'bg-sky-500/15 text-sky-700 dark:text-sky-300',
    dotClassName: 'bg-sky-500',
    labelKey: 'common.low',
  },
  medium: {
    className: 'bg-amber-500/15 text-amber-700 dark:text-amber-300',
    dotClassName: 'bg-amber-500',
    labelKey: 'common.medium',
  },
  high: {
    className: 'bg-rose-500/15 text-rose-700 dark:text-rose-300',
    dotClassName: 'bg-rose-500',
    labelKey: 'common.high',
  },
};

export const priorityLabel = (priority: KanbanPriority): string =>
  t(KANBAN_PRIORITY_STYLES[priority].labelKey);
