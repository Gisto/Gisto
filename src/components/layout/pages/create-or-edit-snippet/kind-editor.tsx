import { z } from 'zod';

import { ActionType, StateType } from './reducer.ts';

import { FileCard } from '@/components/layout/pages/create-or-edit-snippet/file-card.tsx';
import { DocEditor } from '@/components/snippet-kinds/editors/doc-editor.tsx';
import { FlashcardsEditor } from '@/components/snippet-kinds/editors/flashcards-editor.tsx';
import { KanbanBoardEditor } from '@/components/snippet-kinds/editors/kanban-board-editor.tsx';
import { TodoListEditor } from '@/components/snippet-kinds/editors/todo-list-editor.tsx';
import { t } from '@/lib/i18n';

export const KindEditor = ({
  state,
  dispatch,
  errors,
  isEdit,
}: {
  state: StateType;
  dispatch: React.ActionDispatch<[action: ActionType]>;
  errors: z.ZodIssue[];
  isEdit: boolean;
}) => {
  switch (state.kind) {
    case 'todo':
      return <TodoListEditor todos={state.todos} dispatch={dispatch} errors={errors} />;
    case 'kanban':
      return <KanbanBoardEditor board={state.board} dispatch={dispatch} errors={errors} />;
    case 'doc':
      return (
        <DocEditor
          entries={state.docEntries}
          ordered={state.docOrdered}
          dispatch={dispatch}
          errors={errors}
        />
      );
    case 'flashcards':
      return <FlashcardsEditor cards={state.cards} dispatch={dispatch} errors={errors} />;
    default:
      return (
        <>
          <div className="text-xs">{t('pages.new.dragDropTip')}</div>
          {state.files.map((file, index) => (
            <FileCard
              key={`${index}-${file.language}`}
              file={file}
              index={index}
              dispatch={dispatch}
              isEdit={isEdit}
              errors={errors}
              totalFiles={state.files.length}
            />
          ))}
        </>
      );
  }
};
