import { KindMarkdown } from '@/components/snippet-kinds/kind-markdown.tsx';
import { t } from '@/lib/i18n';
import { useKindSaver } from '@/lib/snippet-kinds/use-kind-saver.ts';
import { useKindState } from '@/lib/snippet-kinds/use-kind-state.ts';
import { SnippetSingleType } from '@/types/snippet.ts';
import { cn, findTodoFile, parseTodoList, serializeTodoList } from '@/utils';

export const TodoChecklist = ({
  snippet,
  onUpdated,
}: {
  snippet: SnippetSingleType;
  onUpdated: (content: string) => void;
}) => {
  const file = findTodoFile(snippet.files);
  const [todos, setTodos] = useKindState(file?.content ?? '', snippet.id, parseTodoList);
  const { save, saving } = useKindSaver(snippet, 'todo', onUpdated);

  const toggle = async (id: string) => {
    const previous = todos;
    const next = todos.map((todo) => (todo.id === id ? { ...todo, done: !todo.done } : todo));

    setTodos(next);
    const saved = await save(serializeTodoList(next), t('pages.snippet.todoUpdateError'));

    if (!saved) setTodos(previous);
  };

  const done = todos.filter((todo) => todo.done).length;

  return (
    <div className="p-4">
      <div className="mb-4 text-sm text-muted-foreground">
        {t('pages.snippet.todoProgress', { done, total: todos.length })}
      </div>
      {todos.length === 0 ? (
        <p className="text-muted-foreground">{t('pages.snippet.todoEmpty')}</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {todos.map((todo) => (
            <li key={todo.id}>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={todo.done}
                  disabled={saving}
                  onChange={() => void toggle(todo.id)}
                  className="size-4 accent-primary"
                />
                <KindMarkdown
                  text={todo.text}
                  inline
                  className={cn(todo.done && 'text-muted-foreground line-through')}
                />
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
