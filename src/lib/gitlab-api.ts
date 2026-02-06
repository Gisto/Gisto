import { version } from '../../package.json';

import { requestApi } from './providers/request-utils';
import { buildGitlabDescription, guessLanguage, guessMimeType } from './providers/snippet-utils';
import { SnippetProvider } from './providers/types';

import { toast } from '@/components/toast';
import { ITEMS_PER_PAGE } from '@/constants';
import { t } from '@/lib/i18n';
import { globalState } from '@/lib/store/globalState.ts';
import { SnippetFileType, SnippetSingleType, SnippetType } from '@/types/snippet.ts';

// GitLab API type definitions
interface GitLabSnippet {
  id: number;
  title: string;
  description?: string;
  visibility: 'public' | 'private' | 'internal';
  web_url: string;
  files: GitLabFile[];
  author?: {
    id: number;
    name: string;
    username: string;
    avatar_url: string;
  };
  created_at: string;
  updated_at: string;
}

interface GitLabFile {
  path: string;
  file_name?: string;
  content?: string;
  raw_url?: string;
}

export const GitlabApi: SnippetProvider<GitLabSnippet, GitLabSnippet> = {
  capabilities: {
    supportsStars: false,
  },
  baseUrl: 'https://gitlab.com/api/v4',

  async request<T>({
    endpoint = '',
    method = 'GET',
    body,
  }: {
    endpoint: string;
    method?: string;
    body?: Record<string, unknown>;
  }): Promise<{ data: T; headers: Headers; status: number }> {
    const token = localStorage.getItem('GITLAB_TOKEN');
    const headers = {
      'Private-Token': token || '',
      'Content-Type': 'application/json',
      'User-agent': `Gisto app v${version}`,
    };

    return requestApi<T>({
      baseUrl: this.baseUrl,
      endpoint,
      method,
      headers,
      body,
      onUnauthorized: () => {
        toast.error({ message: 'GitLab Unauthorized' });
      },
    });
  },

  async getSnippet(snippetId: string): Promise<SnippetSingleType> {
    if (!/^\d+$/.test(snippetId)) {
      throw new Error('Invalid snippet ID for GitLab');
    }
    const { data } = await this.request<GitLabSnippet>({ endpoint: `/snippets/${snippetId}` });
    const mapped = this.mapToSnippetSingleType(data);

    // GitLab snippets API might not return content for all files in the initial request
    // if there are multiple files or they are large.
    // We fetch raw content if it's missing.
    for (const filename of Object.keys(mapped.files)) {
      const file = mapped.files[filename];
      if (!file.content && file.raw_url) {
        try {
          const encodedFilePath = file.raw_url.split('/raw/')[1];
          const { data: rawContent } = await this.request<string>({
            endpoint: `/snippets/${snippetId}/files/${encodedFilePath}/raw`,
          });
          file.content = rawContent;
        } catch (error) {
          console.error(`Error fetching raw content for ${filename}:`, error);
        }
      }
    }

    return mapped;
  },

  async getMarkdown(text: string): Promise<string> {
    try {
      const { data } = await this.request<{ html: string }>({
        endpoint: '/markdown',
        method: 'POST',
        body: { text, gfm: true },
      });

      return data.html;
    } catch (error) {
      console.error('Error rendering markdown with GitLab:', error);
      return text; // Fallback to raw text if markdown API fails
    }
  },

  async createSnippet({
    files,
    description,
    isPublic,
  }: {
    files: Record<string, { content: string | null } | null>;
    description: string;
    isPublic: boolean;
  }): Promise<SnippetType> {
    const gitlabFiles = Object.entries(files).map(([filePath, fileData]) => ({
      file_path: filePath,
      content: fileData?.content || '',
    }));

    const title = description.split('\n')[0] || 'Untitled';

    const { data } = await this.request<GitLabSnippet>({
      endpoint: '/snippets',
      method: 'POST',
      body: {
        title: title.length > 255 ? title.substring(0, 252) + '...' : title,
        description,
        visibility: isPublic ? 'public' : 'private',
        files: gitlabFiles,
      },
    });

    return this.mapToSnippetType(data);
  },

  async updateSnippet({
    snippetId,
    files,
    description,
  }: {
    snippetId: string;
    files: Record<string, { content: string } | null>;
    description: string;
  }): Promise<SnippetType> {
    if (!/^\d+$/.test(snippetId)) {
      throw new Error('Invalid snippet ID for GitLab');
    }
    const originalSnippet = await this.request<GitLabSnippet>({
      endpoint: `/snippets/${snippetId}`,
    });
    const existingFiles = (originalSnippet.data.files || []).map((f: GitLabFile) => f.path);

    const gitlabFiles = Object.entries(files).map(([filePath, fileData]) => {
      let action: 'create' | 'update' | 'delete' = 'update';
      if (fileData === null) {
        action = 'delete';
      } else if (!existingFiles.includes(filePath)) {
        action = 'create';
      }

      const filePayload: {
        action: 'create' | 'update' | 'delete';
        file_path: string;
        content?: string;
      } = {
        action,
        file_path: filePath,
      };

      if (action !== 'delete') {
        filePayload.content = fileData?.content || '';
      }

      return filePayload;
    });

    const title = description.split('\n')[0] || 'Untitled';

    const { data } = await this.request<GitLabSnippet>({
      endpoint: `/snippets/${snippetId}`,
      method: 'PUT',
      body: {
        title: title.length > 255 ? title.substring(0, 252) + '...' : title,
        description,
        files: gitlabFiles,
      },
    });

    return this.mapToSnippetType(data);
  },

  async deleteStar(): Promise<{ success: boolean }> {
    return { success: false };
  },

  async addStar(): Promise<{ success: boolean }> {
    return { success: false };
  },

  async deleteSnippet(
    snippetId: string,
    notification: boolean = true
  ): Promise<{ success: boolean }> {
    if (!/^\d+$/.test(snippetId)) {
      return { success: false };
    }
    const { status } = await this.request({
      endpoint: `/snippets/${snippetId}`,
      method: 'DELETE',
    });

    if (status === 204 || status === 202) {
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

  async toggleSnippetVisibility(snippetId: string): Promise<SnippetType | null> {
    if (!/^\d+$/.test(snippetId)) {
      return null;
    }
    const originalSnippet = await this.getSnippet(snippetId);
    const newVisibility = originalSnippet.public ? 'private' : 'public';

    const { data } = await this.request<GitLabSnippet>({
      endpoint: `/snippets/${snippetId}`,
      method: 'PUT',
      body: {
        visibility: newVisibility,
      },
    });

    const mapped = this.mapToSnippetType(data);

    toast.info({
      message: mapped.isPublic
        ? t('api.visibilityChangedToPublic')
        : t('api.visibilityChangedToPrivate'),
    });

    return mapped;
  },

  async fetchSnippets(cursor?: string | null) {
    const page = cursor ? parseInt(cursor, 10) : 1;
    const userSnippets = await this.request<GitLabSnippet[]>({
      endpoint: `/snippets?page=${page}&per_page=${ITEMS_PER_PAGE}`,
    });

    return {
      nodes: userSnippets.data.map((s: GitLabSnippet) => this.mapToSnippetType(s)),
      pageInfo: {
        hasNextPage: userSnippets.headers.get('x-next-page') !== '',
        endCursor: userSnippets.headers.get('x-next-page') || null,
      },
    };
  },

  // GitLab doesn't have GraphQL, so this is a no-op implementation
  async fetchGithubGraphQL<T>(): Promise<T> {
    throw new Error('GraphQL is not supported by GitLab API');
  },

  async getSnippets(): Promise<SnippetType[]> {
    const allSnippets: SnippetType[] = [];
    for await (const snippetPage of this.getSnippetsGenerator()) {
      allSnippets.push(...snippetPage);
    }
    return allSnippets;
  },

  async *getSnippetsGenerator(): AsyncGenerator<SnippetType[], void, unknown> {
    let nextPage: string | null = null;
    let isFirst = true;

    while (isFirst || nextPage) {
      isFirst = false;
      const snippetsPage = await this.fetchSnippets(nextPage);
      yield snippetsPage.nodes;

      if (snippetsPage.pageInfo.hasNextPage) {
        nextPage = snippetsPage.pageInfo.endCursor;
      } else {
        nextPage = null;
      }
    }
  },

  mapToSnippetType(gitlabSnippet: GitLabSnippet): SnippetType {
    const description = buildGitlabDescription(
      gitlabSnippet.title || '',
      gitlabSnippet.description || ''
    );

    const files: Record<string, SnippetFileType> = {};
    if (gitlabSnippet.files) {
      gitlabSnippet.files.forEach((file: GitLabFile) => {
        const filename = file.path || file.file_name || 'untitled';
        const extension = filename.split('.').reverse()[0].toLowerCase();
        const type = this.guessMimeType(extension);

        files[filename] = {
          filename: filename,
          content: file.content || '',
          raw_url: file.raw_url || '',
          type: type,
          language: this.guessLanguage(extension),
          size: file.content?.length || 0,
          truncated: false,
          encoding: 'utf-8',
        };
      });
    }

    return {
      id: String(gitlabSnippet.id),
      description: description,
      createdAt: gitlabSnippet.created_at,
      resourcePath: `/snippets/${gitlabSnippet.id}`,
      html_url: gitlabSnippet.web_url,
      isPublic: gitlabSnippet.visibility === 'public',
      stars: 0,
      starred: false,
      files,
      comments: { edges: [] },
    };
  },

  mapToSnippetSingleType(gitlabSnippet: GitLabSnippet): SnippetSingleType {
    const description = buildGitlabDescription(
      gitlabSnippet.title || '',
      gitlabSnippet.description || ''
    );

    const files: Record<string, SnippetFileType> = {};
    if (gitlabSnippet.files) {
      gitlabSnippet.files.forEach((file: GitLabFile) => {
        const filename = file.path || file.file_name || 'untitled';
        const extension = filename.split('.').reverse()[0].toLowerCase();
        const type = this.guessMimeType(extension);

        files[filename] = {
          filename: filename,
          content: file.content || '',
          raw_url: file.raw_url || '',
          type: type,
          language: this.guessLanguage(extension),
          size: file.content?.length || 0,
          truncated: false,
          encoding: 'utf-8',
        };
      });
    }

    return {
      id: String(gitlabSnippet.id),
      description: description,
      created_at: gitlabSnippet.created_at,
      updated_at: gitlabSnippet.updated_at,
      public: gitlabSnippet.visibility === 'public',
      html_url: gitlabSnippet.web_url,
      files,
      owner: {
        login: gitlabSnippet.author?.username || 'unknown',
        avatar_url: gitlabSnippet.author?.avatar_url || '',
        id: gitlabSnippet.author?.id || 0,
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
      history: [],
      comments: 0,
      url: gitlabSnippet.web_url,
      forks: [],
      truncated: false,
      forks_url: '',
      commits_url: '',
      node_id: '',
      git_pull_url: '',
      git_push_url: '',
      comments_url: '',
      user: null,
      comments_enabled: true,
    };
  },

  guessMimeType(extension: string): string {
    return guessMimeType(extension);
  },

  guessLanguage(extension: string): string {
    return guessLanguage(extension);
  },
};
