export type StateType = {
  description: string;
  isPublic: boolean;
  tags: string[];
  files: { filename: string; content: string; language: string }[];
};

export const initialState: StateType = {
  description: '',
  isPublic: false,
  tags: [],
  files: [{ filename: '', content: '', language: '' }],
};

export type ActionType =
  | { type: 'SET_DESCRIPTION'; payload: string }
  | { type: 'SET_PUBLIC'; payload: boolean }
  | { type: 'ADD_TAG'; payload: string }
  | { type: 'REMOVE_TAG'; payload: string }
  | { type: 'SET_TAGS'; payload: string[] }
  | { type: 'SET_FILE_LANGUAGE'; payload: string; index: number }
  | { type: 'SET_FILENAME'; payload: string; index: number }
  | { type: 'SET_CONTENT'; payload: string | null; index: number }
  | { type: 'ADD_FILE'; payload?: { filename: string; content: string; language: string } }
  | { type: 'REMOVE_FILE'; index: number }
  | { type: 'RESET' };

export function reducer(state: StateType, action: ActionType): StateType {
  switch (action.type) {
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
        files: [...state.files, action.payload || { filename: '', content: '', language: '' }],
      };
    case 'REMOVE_FILE':
      return { ...state, files: state.files.filter((_, i) => i !== action.index) };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}
