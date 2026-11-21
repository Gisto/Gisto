import { findKindFile, KIND_FILENAMES } from './registry.ts';

import { SnippetFileType, TodoItem } from '@/types/snippet.ts';

export const TODO_FILENAME = KIND_FILENAMES.todo;

const checklistRegex = /^\s*[-*]\s+\[([ xX])\]\s+(.*)$/;

export const parseTodoList = (content: string): TodoItem[] =>
  content.split('\n').flatMap((line) => {
    const match = line.match(checklistRegex);
    return match
      ? [{ id: crypto.randomUUID(), text: match[2].trim(), done: match[1].toLowerCase() === 'x' }]
      : [];
  });

export const serializeTodoList = (todos: TodoItem[]): string =>
  todos
    .filter((todo) => todo.text.trim())
    .map((todo) => `- [${todo.done ? 'x' : ' '}] ${todo.text.trim()}`)
    .join('\n');

export const findTodoFile = (files: Record<string, SnippetFileType>): SnippetFileType | undefined =>
  findKindFile(files, 'todo');
