import { version } from '../../../package.json';
import { t } from '../i18n';
import { requestApi } from '../providers/request-utils.ts';
import { guessLanguage, guessMimeType } from '../providers/snippet-utils.ts';
import { SnippetProvider } from '../providers/types.ts';
import { globalState } from '../store/globalState.ts';

import { toast } from '@/components/toast';
import { SnippetFileType, SnippetSingleType, SnippetType } from '@/types/snippet.ts';

interface SnippetBinFile {
  filename: string;
  type: string;
  language: string;
  raw_url: string;
  size: number;
  content?: string;
}

interface SnippetBinOwner {
  login: string;
  id: string;
  avatar_url: string;
}

interface SnippetBinGist {
  id: string;
  public: boolean;
  description: string;
  files: Record<string, SnippetBinFile>;
  owner: SnippetBinOwner;
  created_at: string;
  updated_at: string;
  star_count: number;
  starred?: boolean;
}

export const SnippetBinApi: SnippetProvider<SnippetBinGist, SnippetBinGist> = {
  capabilities: {
    supportsStars: true,
  },
  get baseUrl() {
    return globalState.getState().settings.snippetBinBaseUrl;
  },

  async request<T>({
    endpoint = '',
    method = 'GET',
    body,
  }: {
    endpoint: string;
    method?: string;
    body?: Record<string, unknown>;
  }): Promise<{ data: T; headers: Headers; status: number }> {
    const token = localStorage.getItem('SNIPPET_BIN_TOKEN');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-agent': `Gisto app v${version}`,
    };

    if (token) {
      headers['Authorization'] = `token ${token}`;
    }

    return requestApi<T>({
      baseUrl: this.baseUrl,
      endpoint,
      method,
      headers,
      body,
      onUnauthorized: () => {
        toast.error({ message: 'Snippet-bin Unauthorized' });
      },
    });
  },

  async getSnippet(snippetId: string): Promise<SnippetSingleType> {
    const { data } = await this.request<SnippetBinGist>({ endpoint: `/gists/${snippetId}` });
    return this.mapToSnippetSingleType(data);
  },

  async getMarkdown(text: string): Promise<string> {
    // Snippet-bin doesn't seem to have a markdown preview API yet, return text as is or use a simple fallback
    return text;
  },

  async createSnippet({ files, description, isPublic }): Promise<SnippetType> {
    const { data } = await this.request<SnippetBinGist>({
      endpoint: '/gists',
      method: 'POST',
      body: {
        description,
        public: isPublic,
        files: Object.keys(files).reduce<Record<string, { content?: string | null }>>(
          (acc, filename) => {
            acc[filename] = { content: files[filename]?.content };
            return acc;
          },
          {}
        ),
      },
    });

    return this.mapToSnippetType(data);
  },

  async updateSnippet({ snippetId, files, description }): Promise<SnippetType> {
    const { data } = await this.request<SnippetBinGist>({
      endpoint: `/gists/${snippetId}`,
      method: 'PATCH',
      body: {
        description,
        files: Object.keys(files).reduce<Record<string, { content?: string | null }>>(
          (acc, filename) => {
            acc[filename] = { content: files[filename]?.content };
            return acc;
          },
          {}
        ),
      },
    });

    return this.mapToSnippetType(data);
  },

  async deleteStar(snippetId: string): Promise<{ success: boolean }> {
    const { status } = await this.request({
      endpoint: `/gists/${snippetId}/star`,
      method: 'DELETE',
    });

    if (status === 204) {
      const updatedSnippets = globalState
        .getState()
        .snippets.map((snippet) =>
          snippet.id === snippetId ? { ...snippet, starred: false } : snippet
        );

      globalState.setState({
        snippets: updatedSnippets,
      });

      toast.info({ message: t('api.starRemoved') });

      return { success: true };
    }

    return { success: false };
  },

  async addStar(snippetId: string): Promise<{ success: boolean }> {
    const { status } = await this.request({
      endpoint: `/gists/${snippetId}/star`,
      method: 'POST',
    });

    if (status === 204) {
      const updatedSnippets = globalState
        .getState()
        .snippets.map((snippet) =>
          snippet.id === snippetId ? { ...snippet, starred: true } : snippet
        );

      globalState.setState({
        snippets: updatedSnippets,
      });

      toast.info({ message: t('api.starAdded') });

      return { success: true };
    }

    return { success: false };
  },

  async deleteSnippet(snippetId: string, notification: boolean): Promise<{ success: boolean }> {
    const { status } = await this.request({
      endpoint: `/gists/${snippetId}`,
      method: 'DELETE',
    });

    if (status === 403) {
      toast.error({ message: 'Not allowed to delete this snippet' });
      return { success: false };
    }

    if (status === 204) {
      globalState.setState({
        snippets: globalState.getState().snippets.filter((snippet) => snippet.id !== snippetId),
      });

      if (notification) {
        toast.info({ message: t('list.snippetDeleted') });
      }

      return { success: true };
    }

    return { success: false };
  },

  async toggleSnippetVisibility(): Promise<SnippetType | null> {
    // Not supported by snippet-bin yet
    return null;
  },

  async fetchSnippets(): Promise<{
    nodes: SnippetType[];
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string | null;
    };
  }> {
    const { data: allGists } = await this.request<SnippetBinGist[]>({ endpoint: '/gists' });
    let starredGistIds: Set<string> = new Set();

    try {
      const { data: starredGists } = await this.request<SnippetBinGist[]>({
        endpoint: '/gists/starred',
      });
      starredGistIds = new Set(starredGists.map((gist) => gist.id));
    } catch (error) {
      console.warn('Failed to fetch starred gists', error);
    }

    const nodes = allGists.map((gist) => {
      const snippet = this.mapToSnippetType(gist);
      return {
        ...snippet,
        starred: starredGistIds.has(gist.id),
      };
    });

    return {
      nodes,
      pageInfo: {
        hasNextPage: false,
        endCursor: null,
      },
    };
  },

  async getSnippets(): Promise<SnippetType[]> {
    const { nodes } = await this.fetchSnippets();
    return nodes;
  },

  async *getSnippetsGenerator(): AsyncGenerator<SnippetType[], void, unknown> {
    const snippets = await this.getSnippets();
    yield snippets;
  },

  guessMimeType(extension: string): string {
    return guessMimeType(extension);
  },

  guessLanguage(extension: string): string {
    return guessLanguage(extension);
  },

  mapToSnippetType(data: SnippetBinGist): SnippetType {
    const files: Record<string, SnippetFileType> = {};

    Object.values(data.files).forEach((file) => {
      files[file.filename] = {
        filename: file.filename,
        type: file.type,
        language: file.language,
        raw_url: `${this.baseUrl.replace(/\/api$/, '')}${file.raw_url}`,
        size: file.size,
        truncated: false,
        content: file.content ?? '',
        encoding: 'utf-8',
      };
    });

    return {
      id: data.id,
      resourcePath: `/gists/${data.id}`,
      html_url: `${this.baseUrl.replace(/\/api$/, '')}/gists/${data.id}`,
      description: data.description,
      isPublic: data.public,
      createdAt: data.created_at,
      files,
      owner: {
        login: data.owner?.login || 'unknown',
        avatarUrl: data.owner?.avatar_url || '',
        avatar_url: data.owner?.avatar_url || '',
        id: data.owner?.id || '',
        node_id: '',
        gravatar_id: '',
        url: '',
        html_url: '',
        followers_url: '',
        following_url: '',
      },
      stars: data.star_count,
      starred: !!data.starred,
      comments: { edges: [] },
    };
  },

  mapToSnippetSingleType(data: SnippetBinGist): SnippetSingleType {
    const snippet = this.mapToSnippetType(data);
    const files: Record<string, SnippetFileType & { content?: string }> = {};

    Object.values(data.files).forEach((file) => {
      files[file.filename] = {
        ...snippet.files[file.filename],
        content: file.content ?? '',
      };
    });

    return {
      ...snippet,
      url: '',
      forks_url: '',
      commits_url: '',
      node_id: '',
      git_pull_url: '',
      git_push_url: '',
      html_url: '',
      public: data.public,
      created_at: data.created_at,
      updated_at: data.updated_at,
      comments: 0,
      user: null,
      comments_enabled: false,
      comments_url: '',
      owner: {
        ...snippet.owner!,
        id: Number(snippet.owner?.id) || 0,
        node_id: '',
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
      },
      forks: [],
      history: [],
      truncated: false,
      files,
    };
  },
};
