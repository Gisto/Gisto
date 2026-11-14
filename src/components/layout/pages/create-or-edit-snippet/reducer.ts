import { StoreStateType } from '@/lib/store/globalState.ts';
import {
  DocEntry,
  Flashcard,
  KanbanCard,
  KanbanColumn,
  SnippetKind,
  TodoItem,
} from '@/types/snippet.ts';

export type StateType = {
  kind: SnippetKind;
  description: string;
  isPublic: boolean;
  tags: string[];
  todos: TodoItem[];
  board: KanbanColumn[];
  docEntries: DocEntry[];
  docOrdered: boolean;
  cards: Flashcard[];
  files: { filename: string; content: string; language: string }[];
};
type SettingsType = StoreStateType['settings'];

const newTodo = (): TodoItem => ({ id: crypto.randomUUID(), text: '', done: false });
const newColumn = (title = ''): KanbanColumn => ({
  id: crypto.randomUUID(),
  title,
  cards: [],
});

/** New boards start with the two columns every board needs, both editable. */
const newBoard = (): KanbanColumn[] => [newColumn('Todo'), newColumn('Done')];
const newDocEntry = (): DocEntry => ({
  id: crypto.randomUUID(),
  section: '',
  title: '',
  description: '',
  code: '',
  language: '',
});
const newCard = (): Flashcard => {
  return { id: crypto.randomUUID(), front: '', back: '' };
};

const getInitialState = (settings: Partial<SettingsType>): StateType => ({
  kind: 'snippet',
  description: '',
  isPublic: settings.newSnippetPublicByDefault ?? false,
  tags: [],
  todos: [newTodo()],
  board: newBoard(),
  docEntries: [newDocEntry()],
  docOrdered: false,
  cards: [newCard()],
  files: [{ filename: '', content: '', language: settings.newSnippetDefaultLanguage ?? '' }],
});

export const initialState = getInitialState({});

export type ActionType =
  | { type: 'INIT'; payload: Partial<SettingsType> }
  | { type: 'SET_KIND'; payload: SnippetKind }
  | { type: 'SET_DESCRIPTION'; payload: string }
  | { type: 'SET_PUBLIC'; payload: boolean }
  | { type: 'ADD_TAG'; payload: string }
  | { type: 'REMOVE_TAG'; payload: string }
  | { type: 'SET_TAGS'; payload: string[] }
  | { type: 'ADD_TODO' }
  | { type: 'SET_TODOS'; payload: TodoItem[] }
  | { type: 'SET_TODO_TEXT'; payload: { id: string; text: string } }
  | { type: 'TOGGLE_TODO'; payload: string }
  | { type: 'REMOVE_TODO'; payload: string }
  | { type: 'SET_BOARD'; payload: KanbanColumn[] }
  | { type: 'SET_DOC_ENTRIES'; payload: DocEntry[] }
  | { type: 'SET_DOC_ORDERED'; payload: boolean }
  | { type: 'SET_FLASHCARDS'; payload: Flashcard[] }
  | { type: 'ADD_COLUMN' }
  | { type: 'REMOVE_COLUMN'; payload: string }
  | { type: 'SET_COLUMN_TITLE'; payload: { id: string; title: string } }
  | { type: 'ADD_CARD'; payload: string }
  | { type: 'SET_CARD'; payload: { columnId: string; index: number; card: KanbanCard } }
  | { type: 'REMOVE_CARD'; payload: { columnId: string; index: number } }
  | { type: 'MOVE_CARD'; payload: { from: string; to: string; index: number } }
  | { type: 'SET_DOC_ENTRY'; payload: { id: string; patch: Partial<DocEntry> } }
  | { type: 'ADD_DOC_ENTRY' }
  | { type: 'REMOVE_DOC_ENTRY'; payload: string }
  | { type: 'MOVE_DOC_ENTRY'; payload: { id: string; direction: -1 | 1 } }
  | { type: 'ADD_FLASHCARD' }
  | { type: 'REMOVE_FLASHCARD'; payload: string }
  | { type: 'SET_FLASHCARD'; payload: { id: string; patch: Partial<Flashcard> } }
  | { type: 'SET_FILE_LANGUAGE'; payload: string; index: number }
  | { type: 'SET_FILENAME'; payload: string; index: number }
  | { type: 'SET_CONTENT'; payload: string | null; index: number }
  | { type: 'ADD_FILE'; payload?: { filename: string; content: string; language: string } }
  | { type: 'REMOVE_FILE'; index: number }
  | { type: 'RESET' };

export function reducer(state: StateType, action: ActionType): StateType {
  switch (action.type) {
    case 'INIT':
      return { ...getInitialState(action.payload) };
    case 'SET_KIND':
      return {
        ...state,
        kind: action.payload,
        todos: action.payload === 'todo' && state.todos.length === 0 ? [newTodo()] : state.todos,
        board: action.payload === 'kanban' && state.board.length === 0 ? newBoard() : state.board,
      };
    case 'SET_DESCRIPTION':
      return { ...state, description: action.payload };
    case 'SET_PUBLIC':
      return { ...state, isPublic: action.payload };
    case 'ADD_TAG':
      return { ...state, tags: [...state.tags, action.payload] };
    case 'REMOVE_TAG':
      return { ...state, tags: state.tags.filter((tag) => tag !== action.payload) };
    case 'SET_TAGS':
      return { ...state, tags: action.payload };
    case 'ADD_TODO':
      return { ...state, todos: [...state.todos, newTodo()] };
    case 'SET_TODOS':
      return { ...state, todos: action.payload.length ? action.payload : [newTodo()] };
    case 'SET_TODO_TEXT':
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload.id ? { ...todo, text: action.payload.text } : todo
        ),
      };
    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload ? { ...todo, done: !todo.done } : todo
        ),
      };
    case 'REMOVE_TODO':
      return { ...state, todos: state.todos.filter((todo) => todo.id !== action.payload) };
    case 'SET_BOARD':
      return { ...state, board: action.payload.length ? action.payload : newBoard() };
    case 'ADD_COLUMN':
      return { ...state, board: [...state.board, newColumn()] };
    case 'REMOVE_COLUMN':
      return { ...state, board: state.board.filter((column) => column.id !== action.payload) };
    case 'SET_COLUMN_TITLE':
      return {
        ...state,
        board: state.board.map((column) =>
          column.id === action.payload.id ? { ...column, title: action.payload.title } : column
        ),
      };
    case 'ADD_CARD':
      return {
        ...state,
        board: state.board.map((column) =>
          column.id === action.payload
            ? {
                ...column,
                cards: [
                  ...column.cards,
                  { title: '', description: '', labels: [], priority: 'medium' },
                ],
              }
            : column
        ),
      };
    case 'SET_CARD':
      return {
        ...state,
        board: state.board.map((column) =>
          column.id === action.payload.columnId
            ? {
                ...column,
                cards: column.cards.map((card, index) =>
                  index === action.payload.index ? action.payload.card : card
                ),
              }
            : column
        ),
      };
    case 'REMOVE_CARD':
      return {
        ...state,
        board: state.board.map((column) =>
          column.id === action.payload.columnId
            ? {
                ...column,
                cards: column.cards.filter((_, index) => index !== action.payload.index),
              }
            : column
        ),
      };
    case 'MOVE_CARD': {
      const board = state.board.map((column) => ({ ...column, cards: [...column.cards] }));
      const from = board.find((column) => column.id === action.payload.from);
      const to = board.find((column) => column.id === action.payload.to);
      const card = from?.cards.splice(action.payload.index, 1)[0];

      if (card !== undefined && to) {
        to.cards.push(card);
      }

      return { ...state, board };
    }
    case 'SET_DOC_ENTRIES':
      return { ...state, docEntries: action.payload.length ? action.payload : [newDocEntry()] };
    case 'SET_DOC_ORDERED':
      return { ...state, docOrdered: action.payload };
    case 'SET_FLASHCARDS':
      return { ...state, cards: action.payload.length ? action.payload : [newCard()] };
    case 'ADD_DOC_ENTRY':
      return { ...state, docEntries: [...state.docEntries, newDocEntry()] };
    case 'REMOVE_DOC_ENTRY':
      return {
        ...state,
        docEntries:
          state.docEntries.length > 1
            ? state.docEntries.filter((entry) => entry.id !== action.payload)
            : [newDocEntry()],
      };
    case 'MOVE_DOC_ENTRY': {
      const index = state.docEntries.findIndex((entry) => entry.id === action.payload.id);
      const target = index + action.payload.direction;
      if (index === -1 || target < 0 || target >= state.docEntries.length) return state;
      const docEntries = [...state.docEntries];
      [docEntries[index], docEntries[target]] = [docEntries[target], docEntries[index]];
      return { ...state, docEntries };
    }
    case 'SET_DOC_ENTRY':
      return {
        ...state,
        docEntries: state.docEntries.map((entry) =>
          entry.id === action.payload.id ? { ...entry, ...action.payload.patch } : entry
        ),
      };
    case 'ADD_FLASHCARD':
      return { ...state, cards: [...state.cards, newCard()] };
    case 'REMOVE_FLASHCARD':
      return {
        ...state,
        cards:
          state.cards.length > 1
            ? state.cards.filter((card) => card.id !== action.payload)
            : [newCard()],
      };
    case 'SET_FLASHCARD':
      return {
        ...state,
        cards: state.cards.map((card) =>
          card.id === action.payload.id ? { ...card, ...action.payload.patch } : card
        ),
      };
    case 'SET_FILE_LANGUAGE':
      return {
        ...state,
        files: state.files.map((file, index) =>
          index === action.index ? { ...file, language: action.payload } : file
        ),
      };
    case 'SET_FILENAME':
      return {
        ...state,
        files: state.files.map((file, index) =>
          index === action.index ? { ...file, filename: action.payload } : file
        ),
      };
    case 'SET_CONTENT':
      return <StateType>{
        ...state,
        files: state.files.map((file, index) =>
          index === action.index ? { ...file, content: action.payload } : file
        ),
      };
    case 'ADD_FILE':
      return {
        ...state,
        files: [
          ...state.files,
          action.payload || { filename: '', content: '', language: state.files[0]?.language || '' },
        ],
      };
    case 'REMOVE_FILE':
      return { ...state, files: state.files.filter((_, i) => i !== action.index) };
    case 'RESET':
      return {
        ...state,
        kind: 'snippet',
        description: '',
        tags: [],
        todos: [newTodo()],
        board: newBoard(),
        docEntries: [newDocEntry()],
        docOrdered: false,
        cards: [newCard()],
        files: [{ filename: '', content: '', language: state.files[0]?.language || '' }],
      };
    default:
      return state;
  }
}
