import { StateType } from './reducer.ts';

import { t } from '@/lib/i18n';
import { serializeBoard, serializeDoc, serializeFlashcards, serializeTodoList } from '@/utils';

/** Serializes the active kind's editor state into its data file content. */
export const kindContent = (state: StateType): string => {
  switch (state.kind) {
    case 'todo':
      return serializeTodoList(state.todos);
    case 'kanban':
      return serializeBoard(state.board);
    case 'doc':
      return serializeDoc(state.docEntries);
    case 'flashcards':
      return serializeFlashcards(state.cards);
    default:
      return state.files.map((file) => file.content).join('\n');
  }
};

/** Editor footer counter for the active kind. */
export const kindCounterLabel = (state: StateType): string => {
  switch (state.kind) {
    case 'todo':
      return t('components.editingTodos', {
        n: state.todos.filter((todo) => todo.text.trim()).length,
      });
    case 'kanban':
      return t('components.editingCards', {
        n: state.board.reduce((sum, column) => sum + column.cards.length, 0),
      });
    case 'doc':
      return t('components.editingEntries', {
        n: state.docEntries.filter((entry) => entry.title.trim()).length,
      });
    case 'flashcards':
      return t('components.editingFlashcards', { n: state.cards.length });
    default:
      return t('components.editingFiles', { n: state.files.length });
  }
};
