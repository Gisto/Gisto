import { Plus, Trash } from 'lucide-react';
import { z } from 'zod';

import { ActionType } from '@/components/layout/pages/create-or-edit-snippet/reducer.ts';
import { EDITOR_ITEM_ROW } from '@/components/snippet-kinds/editors/editor-card.ts';
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import { ZodError } from '@/components/zod-error.tsx';
import { t } from '@/lib/i18n';
import { TodoItem } from '@/types/snippet.ts';
import { cn } from '@/utils';

type Props = {
  todos: TodoItem[];
  dispatch: React.Dispatch<ActionType>;
  errors: z.ZodIssue[];
};

export const TodoListEditor = ({ todos, dispatch, errors }: Props) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm font-medium text-primary flex gap-2">
      {t('pages.new.todoList')} <ZodError errors={errors} path="files.0.content" />
    </label>
    {todos.map((todo) => (
      <div key={todo.id} className={cn('flex items-center gap-2', EDITOR_ITEM_ROW)}>
        <input
          type="checkbox"
          checked={todo.done}
          onChange={() => dispatch({ type: 'TOGGLE_TODO', payload: todo.id })}
          className="size-4 accent-primary"
          aria-label={t('pages.new.toggleTodoItem')}
        />
        <Input
          value={todo.text}
          onChange={(e) =>
            dispatch({ type: 'SET_TODO_TEXT', payload: { id: todo.id, text: e.target.value } })
          }
          placeholder={t('pages.new.enterTodoItem')}
          className={cn(todo.done && 'line-through text-muted-foreground')}
        />
        <Button
          variant="outline"
          size="icon"
          onClick={() => dispatch({ type: 'REMOVE_TODO', payload: todo.id })}
          aria-label={t('pages.new.removeTodoItem')}
        >
          <Trash className="size-4" />
        </Button>
      </div>
    ))}
    <Button variant="outline" className="self-start" onClick={() => dispatch({ type: 'ADD_TODO' })}>
      <Plus className="size-4" />
      {t('pages.new.addTodoItem')}
    </Button>
  </div>
);
