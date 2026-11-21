export const SNIPPET_KINDS = ['snippet', 'todo', 'kanban', 'doc', 'flashcards'] as const;
export type SnippetKind = (typeof SNIPPET_KINDS)[number];
export type StructuredSnippetKind = Exclude<SnippetKind, 'snippet'>;

export type TodoItem = { id: string; text: string; done: boolean };

export type KanbanPriority = 'low' | 'medium' | 'high';

export type KanbanCard = {
  title: string;
  description: string;
  labels: string[];
  priority?: KanbanPriority;
};
export type KanbanColumn = { id: string; title: string; cards: KanbanCard[] };

export type DocEntry = {
  id: string;
  section: string;
  title: string;
  description: string;
  code: string;
  language: string;
};

export type FlashcardRating = 'again' | 'hard' | 'good' | 'easy';

export type Flashcard = {
  id: string;
  front: string;
  back: string;
  /** Multiple-choice options; when present the card is answered by picking one */
  options?: string[];
  /** Indices into `options` that count as correct answers */
  answers?: number[];
  /** Seconds allowed to answer; expiry grades the card as `again` */
  timeLimit?: number;
};

export type SnippetFileType = {
  filename: string;
  content: string;
  language: string | { name: string; color?: string | null };
  encoding: string;
  raw_url: string;
  size: number;
  truncated: boolean;
  type: string;
};

export type SnippetOwner = {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  user_view_type: string;
  site_admin: boolean;
};

export type SnippetChangeStatus = {
  total: number;
  additions: number;
  deletions: number;
};

export type SnippetHistoryItem = {
  user: SnippetOwner;
  version: string;
  committed_at: string;
  change_status: SnippetChangeStatus;
  url: string;
};

export type SnippetRevision = {
  id: string;
  snippetId: string;
  description: string;
  files?: Record<string, SnippetFileType>;
  createdAt: string;
  meta?: string;
};

export type SnippetRevisionContent = {
  description: string;
  files: Record<string, SnippetFileType>;
};

export type SnippetSingleType = {
  url: string;
  forks_url: string;
  commits_url: string;
  id: string;
  node_id: string;
  git_pull_url: string;
  git_push_url: string;
  html_url: string;
  files: Record<string, SnippetFileType>;
  public: boolean;
  created_at: string;
  updated_at: string;
  description: string;
  comments: number;
  user: SnippetOwner | null;
  comments_enabled: boolean;
  comments_url: string;
  owner: SnippetOwner;
  forks: never[];
  history: SnippetHistoryItem[];
  truncated: boolean;
};

export type SnippetType = {
  resourcePath: string;
  html_url: string;
  files: Record<string, SnippetFileType>;
  id: string;
  isPublic: boolean;
  createdAt: string;
  description: string;
  stars: number;
  starred: boolean;
  comments: {
    edges: Array<{
      node: {
        id: string;
        author: {
          login: string;
          avatarUrl: string;
        };
        bodyHTML: string;
        createdAt: string;
      };
    }>;
  };
  owner?: {
    login: string;
    avatarUrl: string;
    avatar_url: string;
    id: string;
    node_id: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
  };
};

export type SnippetEnrichedType = SnippetType & {
  kind: SnippetKind;
  title: string;
  tags: string[];
  isUntitled: boolean;
  files: SnippetFileType & { text?: string }[];
  languages: { name: string; color: string }[];
};
