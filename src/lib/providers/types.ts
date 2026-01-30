import { GistSingleType, GistType } from '@/types/gist.ts';

export interface SnippetProvider<TRaw = GistSingleType> {
  capabilities: {
    supportsStars: boolean;
  };
  baseUrl: string;
  gitHubApiVersion?: string;
  fetchGithubGraphQL<T>(query?: string, params?: { cursor: string | null }): Promise<T>;
  getGist(gistId: string): Promise<GistSingleType>;
  getMarkdown(text: string): Promise<string>;
  createGist(params: {
    files: Record<string, { content: string | null } | null>;
    description: string;
    isPublic: boolean;
  }): Promise<GistType>;
  updateGist(params: {
    gistId: string;
    files: Record<string, { content: string } | null>;
    description: string;
  }): Promise<GistType>;
  deleteStar(gistId: string): Promise<{ success: boolean }>;
  addStar(gistId: string): Promise<{ success: boolean }>;
  deleteGist(gistId: string, notification?: boolean): Promise<{ success: boolean }>;
  toggleGistVisibility(gistId: string): Promise<GistType | null>;
  fetchGists(cursor?: string | null): Promise<{
    nodes: GistType[];
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string | null;
    };
  }>;
  getGists(): Promise<GistType[]>;
  getGistsGenerator(): AsyncGenerator<GistType[], void, unknown>;
  // Additional methods used by implementations
  request<T>(params: {
    endpoint?: string;
    method?: string;
    body?: Record<string, unknown>;
  }): Promise<{ data: T; headers: Headers; status: number }>;
  guessMimeType(extension: string): string;
  guessLanguage(extension: string): string;
  mapToGistType(data: TRaw): GistType;
  mapToGistSingleType(data: TRaw): GistSingleType;
}
