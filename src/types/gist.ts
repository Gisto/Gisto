export type GistFileType = {
  filename: string;
  content: string;
  language: string;
  encoding: string;
  raw_url: string;
  size: number;
  truncated: boolean;
  type: string;
};

export type GistOwner = {
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

export type GistChangeStatus = {
  total: number;
  additions: number;
  deletions: number;
};

export type GistHistoryItem = {
  user: GistOwner;
  version: string;
  committed_at: string;
  change_status: GistChangeStatus;
  url: string;
};

export type GistSingleType = {
  url: string;
  forks_url: string;
  commits_url: string;
  id: string;
  node_id: string;
  git_pull_url: string;
  git_push_url: string;
  html_url: string;
  files: Record<string, GistFileType>;
  public: boolean;
  created_at: string;
  updated_at: string;
  description: string;
  comments: number;
  user: GistOwner | null;
  comments_enabled: boolean;
  comments_url: string;
  owner: GistOwner;
  forks: never[];
  history: GistHistoryItem[];
  truncated: boolean;
};

export type GistType = {
  resourcePath: string;
  html_url: string;
  files: Record<string, GistFileType>;
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
};

export type GistEnrichedType = GistType & {
  title: string;
  tags: string[];
  isUntitled: boolean;
  files: GistFileType & { text?: string }[];
  languages: { name: string; color: string }[];
};
