import { version } from '../../package.json';

import { GistType } from '@/types/gist.ts';
import { globalState } from '@/lib/store/globalState.ts';

interface GraphQLResponse<T> {
  data: T;
  errors?: string[];
}

interface GistQueryData {
  viewer: {
    gists: {
      pageInfo: {
        hasNextPage: boolean;
        endCursor: string | null;
      };
      nodes: Array<{
        description: string | null;
        createdAt: string;
        id: string;
        isFork: boolean;
        stars: number;
        resourcePath: string;
        isPublic: boolean;
        name: string;
        owner: {
          id: string;
          login: string;
          avatarUrl: string;
          resourcePath: string;
        };
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
      }>;
    };
  };
}

export const GithubAPI = {
  baseUrl: 'https://api.github.com/gists',
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
    const url = `${this.baseUrl}${endpoint}`;

    // const cache = await caches.open(url);
    // const cachedResponse = await cache.match(url);
    // if (cachedResponse) {
    //   return {
    //     data: await cachedResponse.json(),
    //     headers: cachedResponse.headers,
    //     status: cachedResponse.status,
    //   };
    // }

    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': this.gitHubApiVersion,
      'User-agent': `Gisto app v${version}`,
    };

    const response: Response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (response.status !== 200) {
      if (response.status === 401) {
        document.location.href = '/';
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    globalState.setState({
      apiRateLimits: {
        limit: Number(response.headers.get('x-ratelimit-limit')),
        remaining: Number(response.headers.get('x-ratelimit-remaining')),
        reset: new Date(
          Number(response.headers.get('x-ratelimit-reset')) * 1000
        ).toLocaleTimeString(),
      },
    });

    // const responseClone = response.clone();
    // await cache.put(url, responseClone);

    const data = await response.json();

    return { data, headers: response.headers, status: response.status };
  },

  async getGist(gistId: string): Promise<GistType> {
    const { data } = await this.request<GistType>({ endpoint: `/${gistId}` });

    return data;
  },

  async createGist(
    files: Record<string, { content: string }>,
    description: string,
    isPublic: boolean
  ): Promise<GistType> {
    const { data } = await this.request<GistType>({
      endpoint: '',
      method: 'POST',
      body: { files, description, public: isPublic },
    });

    return data;
  },

  async updateGist(
    gistId: string,
    files: Record<string, { content: string } | null>
  ): Promise<GistType> {
    const { data } = await this.request<GistType>({
      endpoint: `/${gistId}`,
      method: 'PATCH',
      body: { files },
    });

    return data;
  },

  async deleteGist(gistId: string): Promise<void> {
    // TODO delete from storage if success
    await this.request({ endpoint: `/${gistId}`, method: 'DELETE' });
  },

  async fetchGithubGraphQL<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
    // const cacheKey = JSON.stringify({ query, variables });
    // const cachedItem = cache.get(cacheKey);
    //
    // if (cachedItem && Date.now() - cachedItem.timestamp < CACHE_DURATION) {
    //   return cachedItem.data as T;
    // }

    const token = localStorage.getItem('GITHUB_TOKEN');
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      throw new Error(`GitHub GraphQL request failed: ${response.statusText}`);
    }

    globalState.setState({
      apiRateLimits: {
        limit: Number(response.headers.get('x-ratelimit-limit')),
        remaining: Number(response.headers.get('x-ratelimit-remaining')),
        reset: new Date(
          Number(response.headers.get('x-ratelimit-reset')) * 1000
        ).toLocaleTimeString(),
      },
    });

    const result: GraphQLResponse<T> = await response.json();
    // cache.set(cacheKey, { data: result.data, timestamp: Date.now() });

    return result.data;
  },

  async fetchGists(cursor: string | null = null) {
    const query = `
    query($cursor: String) {
      viewer {
        gists(first: 100, after: $cursor, orderBy: {field: CREATED_AT, direction: DESC}, privacy: ALL) {
          pageInfo {
            hasNextPage
            endCursor
          }
          nodes {
            description
            createdAt
            id
            isFork
            stars: stargazerCount
            resourcePath
            isPublic
            name
            owner {
              id
              login
              avatarUrl
              resourcePath
            }
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

      return data.viewer.gists;
    } catch (error) {
      console.error('Error fetching gists:', error);
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
      // @ts-expect-error align GraphQL types with response types
      yield gistsPage.nodes;
      hasNextPage = gistsPage.pageInfo.hasNextPage;
      cursor = gistsPage.pageInfo.endCursor;
    }
  },
};
