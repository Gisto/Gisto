/* eslint-disable @typescript-eslint/no-explicit-any */
import { version } from '../../package.json';

import { requestApi } from './providers/request-utils';
import { guessLanguage, guessMimeType } from './providers/snippet-utils';
import { SnippetProvider } from './providers/types';

import { toast } from '@/components/toast';
import { ITEMS_PER_PAGE } from '@/constants';
import { t } from '@/lib/i18n';
import { globalState } from '@/lib/store/globalState.ts';
import { GistFileType, GistSingleType, GistType } from '@/types/gist.ts';

interface GraphQLResponse<T> {
  data: T;
  errors?: string[];
}

interface GitHubNode {
  description: string | null;
  createdAt: string;
  id: string; // resourcePath or id? Query alias id: resourcePath
  isFork: boolean;
  stars: number;
  starred: boolean;
  resourcePath: string;
  isPublic: boolean;
  name: string;
  owner: {
    id: string;
    login: string;
    avatarUrl: string;
    resourcePath: string;
  };
  html_url: string;
  comments: {
    edges: Array<{
      node: {
        id: string;
        createdAt: string;
        author: {
          login: string;
          avatarUrl: string;
        };
        bodyHTML: string;
      };
    }>;
  };
  files: Array<{
    name: string;
    encoding: string;
    extension: string;
    isTruncated: boolean;
    isImage: boolean;
    language: {
      color: string | null;
      name: string | null;
    } | null;
    encodedName: string;
    size: number;
    text: string;
  }>;
  forks: {
    edges: Array<{
      node: {
        createdAt: string;
        id: string;
      };
    }>;
  };
}

interface GistQueryData {
  viewer: {
    gists: {
      pageInfo: {
        hasNextPage: boolean;
        endCursor: string | null;
      };
      nodes: Array<GitHubNode>;
    };
  };
}

export const GithubApi: SnippetProvider<any> = {
  capabilities: {
    supportsStars: true,
  },
  baseUrl: 'https://api.github.com',
  gitHubApiVersion: '2022-11-28',

  async request<T>({
    endpoint = '',
    method = 'GET',
    body,
  }: {
    endpoint: string;
    method?: string;
    body?: Record<string, unknown>;
  }): Promise<{ data: T; headers: Headers; status: number }> {
    const token = localStorage.getItem('GITHUB_TOKEN');
    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': this.gitHubApiVersion || '2022-11-28',
      'User-agent': `Gisto app v${version}`,
    };

    const response = await requestApi<T>({
      baseUrl: this.baseUrl,
      endpoint,
      method,
      headers,
      body,
      onUnauthorized: () => {
        document.location.href = '/';
      },
    });

    globalState.setState({
      apiRateLimits: {
        limit: Number(response.headers.get('x-ratelimit-limit')),
        remaining: Number(response.headers.get('x-ratelimit-remaining')),
        reset: new Date(
          Number(response.headers.get('x-ratelimit-reset')) * 1000
        ).toLocaleTimeString(),
      },
    });

    return response;
  },

  async getGist(gistId: string): Promise<GistSingleType> {
    const { data } = await this.request<GistSingleType>({ endpoint: `/gists/${gistId}` });

    return data;
  },

  async getMarkdown(text: string): Promise<string> {
    const { data } = await this.request<string>({
      endpoint: '/markdown',
      method: 'POST',
      body: { text },
    });

    return data;
  },

  async createGist({
    files,
    description,
    isPublic,
  }: {
    files: Record<string, { content: string | null } | null>;
    description: string;
    isPublic: boolean;
  }): Promise<GistType> {
    const { data } = await this.request<GistType>({
      endpoint: '/gists',
      method: 'POST',
      body: { files, description, public: isPublic },
    });

    return data;
  },

  async updateGist({
    gistId,
    files,
    description,
  }: {
    gistId: string;
    files: Record<string, { content: string } | null>;
    description: string;
  }): Promise<GistType> {
    const { data } = await this.request<GistType>({
      endpoint: `/gists/${gistId}`,
      method: 'PATCH',
      body: { files, description },
    });

    return data;
  },

  async deleteStar(gistId: string): Promise<{ success: boolean }> {
    const { status } = await this.request({ endpoint: `/gists/${gistId}/star`, method: 'DELETE' });

    if (status === 204) {
      const updatedSnippets = globalState
        .getState()
        .snippets.map((snippet) =>
          snippet.id === gistId ? { ...snippet, starred: false } : snippet
        );

      globalState.setState({
        snippets: updatedSnippets,
      });

      toast.info({ message: t('api.starRemoved') });

      return { success: true };
    }

    return { success: false };
  },

  async addStar(gistId: string): Promise<{ success: boolean }> {
    const { status } = await this.request({ endpoint: `/gists/${gistId}/star`, method: 'PUT' });

    if (status === 204) {
      const updatedSnippets = globalState
        .getState()
        .snippets.map((snippet) =>
          snippet.id === gistId ? { ...snippet, starred: true } : snippet
        );

      globalState.setState({
        snippets: updatedSnippets,
      });

      toast.info({ message: t('api.starAdded') });

      return { success: true };
    }

    return { success: false };
  },

  async deleteGist(gistId: string, notification: boolean = true): Promise<{ success: boolean }> {
    const { status } = await this.request({ endpoint: `/gists/${gistId}`, method: 'DELETE' });

    if (status === 204) {
      globalState.setState({
        snippets: globalState.getState().snippets.filter((snippet) => snippet.id !== gistId),
      });

      if (notification) {
        toast.info({ message: t('list.snippetDeleted') });
      }

      return { success: true };
    }

    return { success: false };
  },

  async toggleGistVisibility(gistId: string): Promise<GistType | null> {
    const originalGist = await this.getGist(gistId);

    const files = Object.entries(originalGist.files || {}).reduce(
      (acc, [fileName, fileData]) => {
        if (fileData && fileName) {
          acc[fileName] = { content: fileData.content || '' };
        }
        return acc;
      },
      {} as Record<string, { content: string }>
    );

    const newVisibility = !originalGist.public;

    const newGist = await this.createGist({
      files,
      description: originalGist.description || '',
      isPublic: newVisibility,
    });

    if (newGist.id) {
      await this.deleteGist(gistId);

      toast.info({
        message: newVisibility
          ? t('api.visibilityChangedToPublic')
          : t('api.visibilityChangedToPrivate'),
      });

      return newGist;
    }

    toast.info({
      message: newVisibility
        ? t('api.visibilityChangedToPublic')
        : t('api.visibilityChangedToPrivate'),
    });

    return null;
  },

  async fetchGithubGraphQL<T>(query?: string, params?: { cursor: string | null }): Promise<T> {
    const { data } = await this.request<GraphQLResponse<T>>({
      endpoint: 'https://api.github.com/graphql',
      method: 'POST',
      body: { query, variables: params },
    });

    return data.data;
  },

  async fetchGists(cursor: string | null = null) {
    const query = `
    query($cursor: String) {
      viewer {
        gists(first: ${ITEMS_PER_PAGE}, after: $cursor, orderBy: {field: CREATED_AT, direction: DESC}, privacy: ALL) {
          pageInfo {
            hasNextPage
            endCursor
          }
          nodes {
            description
            createdAt
            id: resourcePath
            isFork
            stars: stargazerCount
            starred: viewerHasStarred
            resourcePath
            isPublic
            name
            owner {
              id
              login
              avatarUrl
              resourcePath
            }
            html_url: url
            comments(last: 100) {
              edges {
                node {
                  id
                  createdAt
                  author {
                    login
                    avatarUrl
                  }
                  bodyHTML
                }
              }
            }
            files {
              name
              encoding
              extension
              isTruncated
              isImage
              language {
                color
                name
              }
              encodedName
              size
              text
            }
            forks(last: 100) {
              edges {
                node {
                  createdAt
                  id
                }
              }
            }
          }
        }
      }
    }
  `;

    try {
      const data = await this.fetchGithubGraphQL<GistQueryData>(query, {
        cursor,
      });

      return {
        nodes: data.viewer.gists.nodes.map((node) => this.mapToGistType(node)),
        pageInfo: data.viewer.gists.pageInfo
      };
    } catch (error) {
      console.error('Error fetching gists:', error);
      toast.error({ message: t('api.errorTryToRefresh'), duration: 5000 });
      throw error;
    }
  },

  // TODO: let's keep in case we want to come back to only load when all pages fetched
  async getGists(): Promise<GistType[]> {
    const allGists: GistType[] = [];
    for await (const gistPage of this.getGistsGenerator()) {
      allGists.push(...gistPage);
    }
    return allGists;
  },

  async *getGistsGenerator(): AsyncGenerator<GistType[], void, unknown> {
    let hasNextPage = true;
    let cursor: string | null = null;

    while (hasNextPage) {
      const gistsPage = await this.fetchGists(cursor);
      yield gistsPage.nodes;
      hasNextPage = gistsPage.pageInfo.hasNextPage;
      cursor = gistsPage.pageInfo.endCursor;
    }
  },

  mapToGistType(data: any): GistType {
    // If it's already in the correct format (e.g. from create/update Gist response)
    if (!('files' in data && Array.isArray(data.files))) {
      return data as GistType;
    }

    // Map from GraphQL format to GistType
    const node = data as GitHubNode;
    const files: Record<string, GistFileType> = {};

    if (node.files && Array.isArray(node.files)) {
      node.files.forEach((file) => {
        files[file.name] = {
          filename: file.name,
          content: file.text,
          type: 'text/plain', // Default used in logic
          language: file.language
            ? { name: file.language.name || 'Text', color: file.language.color }
            : { name: 'Text', color: null },
          size: file.size,
          truncated: file.isTruncated,
          encoding: 'utf-8',
          raw_url: '', // Not provided in GraphQL node directly easily without constructing it
        };
      });
    }

    return {
      id: node.name, // Use name as ID for compatibility
      description: node.description || '',
      html_url: node.html_url,
      createdAt: node.createdAt,
      updated_at: node.createdAt, // createdAt as fallback
      files: files,
      public: node.isPublic,
      owner: {
        login: node.owner.login,
        avatar_url: node.owner.avatarUrl,
        id: 0, // Not present in partial view
        // ... fill other dummy if needed, or assume partial
      } as any, // Cast to any to avoid filling all User fields if not strictly needed in list view
      history: [],
      comments: node.comments,
      url: node.html_url,
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
      // Add optional GistType fields...
      isPublic: node.isPublic,
      starred: node.starred,
      stars: node.stars,
      resourcePath: node.resourcePath
    } as unknown as GistType;
  },

  mapToGistSingleType(data: GistSingleType): GistSingleType {
    return data;
  },

  guessMimeType(extension: string): string {
    return guessMimeType(extension);
  },

  guessLanguage(extension: string): string {
    return guessLanguage(extension);
  }
};
