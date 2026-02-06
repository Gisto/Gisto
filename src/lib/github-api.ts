import { version } from '../../package.json';

import { requestApi } from './providers/request-utils';
import { guessLanguage, guessMimeType } from './providers/snippet-utils';
import { SnippetProvider } from './providers/types';

import { toast } from '@/components/toast';
import { ITEMS_PER_PAGE } from '@/constants';
import { t } from '@/lib/i18n';
import { globalState } from '@/lib/store/globalState.ts';
import { SnippetFileType, SnippetSingleType, SnippetType } from '@/types/snippet.ts';

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

interface SnippetQueryData {
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

type GitHubSnippetListItem = GitHubNode | SnippetType;

function isGitHubNode(data: GitHubSnippetListItem): data is GitHubNode {
  return Array.isArray(data.files);
}

export const GithubApi: SnippetProvider<GitHubSnippetListItem, SnippetSingleType> = {
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

  async getSnippet(snippetId: string): Promise<SnippetSingleType> {
    const { data } = await this.request<SnippetSingleType>({ endpoint: `/gists/${snippetId}` });

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

  async createSnippet({
    files,
    description,
    isPublic,
  }: {
    files: Record<string, { content: string | null } | null>;
    description: string;
    isPublic: boolean;
  }): Promise<SnippetType> {
    const { data } = await this.request<SnippetType>({
      endpoint: '/gists',
      method: 'POST',
      body: { files, description, public: isPublic },
    });

    return data;
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
    const { data } = await this.request<SnippetType>({
      endpoint: `/gists/${snippetId}`,
      method: 'PATCH',
      body: { files, description },
    });

    return data;
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
    const { status } = await this.request({ endpoint: `/gists/${snippetId}/star`, method: 'PUT' });

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

  async deleteSnippet(
    snippetId: string,
    notification: boolean = true
  ): Promise<{ success: boolean }> {
    const { status } = await this.request({ endpoint: `/gists/${snippetId}`, method: 'DELETE' });

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

  async toggleSnippetVisibility(snippetId: string): Promise<SnippetType | null> {
    const originalSnippet = await this.getSnippet(snippetId);

    const files = Object.entries(originalSnippet.files || {}).reduce(
      (acc, [fileName, fileData]) => {
        if (fileData && fileName) {
          acc[fileName] = { content: fileData.content || '' };
        }
        return acc;
      },
      {} as Record<string, { content: string }>
    );

    const newVisibility = !originalSnippet.public;

    const newSnippet = await this.createSnippet({
      files,
      description: originalSnippet.description || '',
      isPublic: newVisibility,
    });

    if (newSnippet.id) {
      await this.deleteSnippet(snippetId);

      toast.info({
        message: newVisibility
          ? t('api.visibilityChangedToPublic')
          : t('api.visibilityChangedToPrivate'),
      });

      return newSnippet;
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

  async fetchSnippets(cursor: string | null = null) {
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
      const data = await this.fetchGithubGraphQL<SnippetQueryData>(query, {
        cursor,
      });

      return {
        nodes: data.viewer.gists.nodes.map((node) => this.mapToSnippetType(node)),
        pageInfo: data.viewer.gists.pageInfo,
      };
    } catch (error) {
      console.error('Error fetching snippets:', error);
      toast.error({ message: t('api.errorTryToRefresh'), duration: 5000 });
      throw error;
    }
  },

  // TODO: let's keep in case we want to come back to only load when all pages fetched
  async getSnippets(): Promise<SnippetType[]> {
    const allSnippets: SnippetType[] = [];
    for await (const snippetPage of this.getSnippetsGenerator()) {
      allSnippets.push(...snippetPage);
    }
    return allSnippets;
  },

  async *getSnippetsGenerator(): AsyncGenerator<SnippetType[], void, unknown> {
    let hasNextPage = true;
    let cursor: string | null = null;

    while (hasNextPage) {
      const snippetsPage = await this.fetchSnippets(cursor);
      yield snippetsPage.nodes;
      hasNextPage = snippetsPage.pageInfo.hasNextPage;
      cursor = snippetsPage.pageInfo.endCursor;
    }
  },

  mapToSnippetType(data: GitHubSnippetListItem): SnippetType {
    // If it's already in the correct format (e.g. from create/update snippet response)
    if (!isGitHubNode(data)) {
      return data;
    }

    // Map from GraphQL format to SnippetType
    const node = data as GitHubNode;
    const files: Record<string, SnippetFileType> = {};

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
      files: files,
      isPublic: node.isPublic,
      starred: node.starred,
      stars: node.stars,
      resourcePath: node.resourcePath,
      comments: node.comments,
    };
  },

  mapToSnippetSingleType(data: SnippetSingleType): SnippetSingleType {
    return data;
  },

  guessMimeType(extension: string): string {
    return guessMimeType(extension);
  },

  guessLanguage(extension: string): string {
    return guessLanguage(extension);
  }
};
