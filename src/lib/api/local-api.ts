import Dexie, { Table } from 'dexie';
import 'dexie-export-import';

import { guessLanguage, guessMimeType } from '../providers/snippet-utils.ts';
import { SnippetProvider } from '../providers/types.ts';

import { globalState } from '@/lib/store/globalState.ts';
import {
  SnippetFileType,
  SnippetSingleType,
  SnippetType,
  SnippetEnrichedType,
} from '@/types/snippet.ts';
import { randomString } from '@/utils';
import { processSnippet } from '@/utils/snippet.ts';

interface LocalSnippet {
  id: string;
  description: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  files: Record<string, SnippetFileType>;
  starred: boolean;
  stars: number;
}

interface LocalSnippetComment {
  id: string;
  snippetId: string;
  author: {
    login: string;
    avatarUrl: string;
  };
  bodyHTML: string;
  createdAt: string;
}

class GistoDatabase extends Dexie {
  snippets!: Table<LocalSnippet>;
  comments!: Table<LocalSnippetComment>;

  constructor() {
    super('GistoDB');
    this.version(1).stores({
      snippets: 'id, description, isPublic, createdAt, updatedAt, starred',
      comments: 'id, snippetId, createdAt',
    });
  }
}

const db = new GistoDatabase();

async function refreshLocalSnippets() {
  const snippets = await db.snippets.orderBy('updatedAt').reverse().toArray();
  const processed = snippets.map((s) => processSnippet(mapToSnippetType(s)));
  globalState.setState({ snippets: processed as unknown as SnippetEnrichedType[] });
}

function generateId(): string {
  return `local_${Date.now()}_${randomString(16)}`;
}

function mapToSnippetType(snippet: LocalSnippet): SnippetType {
  return {
    resourcePath: `/${snippet.id}`,
    html_url: `#/snippet/${snippet.id}`,
    files: snippet.files,
    id: snippet.id,
    isPublic: snippet.isPublic,
    createdAt: snippet.createdAt,
    description: snippet.description,
    stars: snippet.stars,
    starred: snippet.starred,
    comments: {
      edges: [],
    },
  };
}

function mapToSnippetSingleType(snippet: LocalSnippet): SnippetSingleType {
  const owner = {
    login: 'local',
    id: 0,
    node_id: 'local',
    avatar_url: '',
    gravatar_id: '',
    url: '',
    html_url: '',
    followers_url: '',
    following_url: '',
    gists_url: '',
    starred_url: '',
    subscriptions_url: '',
    organizations_url: '',
    repos_url: '',
    events_url: '',
    received_events_url: '',
    type: 'User',
    user_view_type: 'public',
    site_admin: false,
  };

  return {
    url: `#/snippet/${snippet.id}`,
    forks_url: '',
    commits_url: '',
    id: snippet.id,
    node_id: snippet.id,
    git_pull_url: '',
    git_push_url: '',
    html_url: `#/snippet/${snippet.id}`,
    files: snippet.files,
    public: snippet.isPublic,
    created_at: snippet.createdAt,
    updated_at: snippet.updatedAt,
    description: snippet.description,
    comments: 0,
    user: owner,
    comments_enabled: true,
    comments_url: '',
    owner,
    forks: [],
    history: [],
    truncated: false,
  };
}

export const LocalApi: SnippetProvider<LocalSnippet, LocalSnippet> = {
  capabilities: {
    supportsStars: true,
  },
  baseUrl: 'local',

  async fetchGithubGraphQL() {
    throw new Error('GraphQL is not supported in local mode');
  },

  async getSnippet(snippetId: string): Promise<SnippetSingleType> {
    const snippet = await db.snippets.get(snippetId);
    if (!snippet) {
      throw new Error('Snippet not found');
    }
    return mapToSnippetSingleType(snippet);
  },

  async getMarkdown(text: string): Promise<string> {
    return text;
  },

  async createSnippet(params: {
    files: Record<string, { content: string | null } | null>;
    description: string;
    isPublic: boolean;
  }): Promise<SnippetType> {
    const now = new Date().toISOString();
    const snippetId = generateId();

    const files: Record<string, SnippetFileType> = {};

    for (const [filename, file] of Object.entries(params.files)) {
      if (file && file.content !== null) {
        const extension = filename.split('.').pop() || '';
        files[filename] = {
          filename,
          content: file.content,
          language: guessLanguage(extension),
          encoding: 'text',
          raw_url: '',
          size: file.content.length,
          truncated: false,
          type: 'file',
        };
      }
    }

    const snippet: LocalSnippet = {
      id: snippetId,
      description: params.description,
      isPublic: params.isPublic,
      createdAt: now,
      updatedAt: now,
      files,
      starred: false,
      stars: 0,
    };

    await db.snippets.add(snippet);
    await refreshLocalSnippets();
    return mapToSnippetType(snippet);
  },

  async updateSnippet(params: {
    snippetId: string;
    files: Record<string, { content: string } | null>;
    description: string;
  }): Promise<SnippetType> {
    const existing = await db.snippets.get(params.snippetId);
    if (!existing) {
      throw new Error('Snippet not found');
    }

    const now = new Date().toISOString();
    const files: Record<string, SnippetFileType> = {};

    for (const [filename, file] of Object.entries(params.files)) {
      if (file && file.content !== null) {
        const extension = filename.split('.').pop() || '';
        files[filename] = {
          filename,
          content: file.content,
          language: guessLanguage(extension),
          encoding: 'text',
          raw_url: existing.files[filename]?.raw_url || '',
          size: file.content.length,
          truncated: false,
          type: 'file',
        };
      }
    }

    const updated: LocalSnippet = {
      ...existing,
      description: params.description,
      updatedAt: now,
      files,
    };

    await db.snippets.put(updated);
    await refreshLocalSnippets();
    return mapToSnippetType(updated);
  },

  async deleteStar(snippetId: string): Promise<{ success: boolean }> {
    const snippet = await db.snippets.get(snippetId);
    if (snippet) {
      snippet.starred = false;
      snippet.stars = Math.max(0, snippet.stars - 1);
      await db.snippets.put(snippet);
    }
    await refreshLocalSnippets();
    return { success: true };
  },

  async addStar(snippetId: string): Promise<{ success: boolean }> {
    const snippet = await db.snippets.get(snippetId);
    if (snippet) {
      snippet.starred = true;
      snippet.stars += 1;
      await db.snippets.put(snippet);
    }
    await refreshLocalSnippets();
    return { success: true };
  },

  async deleteSnippet(snippetId: string): Promise<{ success: boolean }> {
    await db.snippets.delete(snippetId);
    await db.comments.where('snippetId').equals(snippetId).delete();
    await refreshLocalSnippets();
    return { success: true };
  },

  async toggleSnippetVisibility(snippetId: string): Promise<SnippetType | null> {
    const snippet = await db.snippets.get(snippetId);
    if (!snippet) return null;

    snippet.isPublic = !snippet.isPublic;
    await db.snippets.put(snippet);
    await refreshLocalSnippets();
    return mapToSnippetType(snippet);
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async fetchSnippets(_cursor?: string | null): Promise<{
    nodes: SnippetType[];
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string | null;
    };
  }> {
    const snippets = await db.snippets.orderBy('updatedAt').reverse().toArray();
    return {
      nodes: snippets.map(mapToSnippetType),
      pageInfo: {
        hasNextPage: false,
        endCursor: null,
      },
    };
  },

  async getSnippets(): Promise<SnippetType[]> {
    const snippets = await db.snippets.orderBy('updatedAt').reverse().toArray();
    return snippets.map(mapToSnippetType);
  },

  async *getSnippetsGenerator(): AsyncGenerator<SnippetType[], void, unknown> {
    const snippets = await db.snippets.orderBy('updatedAt').reverse().toArray();
    yield snippets.map(mapToSnippetType);
  },

  async request<T>({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    endpoint: _endpoint,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    method: _method,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    body: _body,
  }: {
    endpoint?: string;
    method?: string;
    body?: Record<string, unknown>;
  }): Promise<{ data: T; headers: Headers; status: number }> {
    throw new Error('Direct requests are not supported in local mode');
  },

  guessMimeType(extension: string): string {
    return guessMimeType(extension);
  },

  guessLanguage(extension: string): string {
    return guessLanguage(extension);
  },

  mapToSnippetType(data: LocalSnippet): SnippetType {
    return mapToSnippetType(data);
  },

  mapToSnippetSingleType(data: LocalSnippet): SnippetSingleType {
    return mapToSnippetSingleType(data);
  },
};

export async function exportLocalDatabase(): Promise<Blob> {
  return await db.export({ prettyJson: true });
}

export async function importLocalDatabase(file: File): Promise<void> {
  await db.import(file);
  await refreshLocalSnippets();
}
