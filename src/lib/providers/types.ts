import { SnippetSingleType, SnippetType } from '@/types/snippet.ts';

export interface SnippetProvider<TRawList = SnippetSingleType, TRawSingle = TRawList> {
  capabilities: {
    supportsStars: boolean;
  };
  baseUrl: string;
  gitHubApiVersion?: string;
  fetchGithubGraphQL<T>(query?: string, params?: { cursor: string | null }): Promise<T>;
  getSnippet(snippetId: string): Promise<SnippetSingleType>;
  getMarkdown(text: string): Promise<string>;
  createSnippet(params: {
    files: Record<string, { content: string | null } | null>;
    description: string;
    isPublic: boolean;
  }): Promise<SnippetType>;
  updateSnippet(params: {
    snippetId: string;
    files: Record<string, { content: string } | null>;
    description: string;
  }): Promise<SnippetType>;
  deleteStar(snippetId: string): Promise<{ success: boolean }>;
  addStar(snippetId: string): Promise<{ success: boolean }>;
  deleteSnippet(snippetId: string, notification?: boolean): Promise<{ success: boolean }>;
  toggleSnippetVisibility(snippetId: string): Promise<SnippetType | null>;
  fetchSnippets(cursor?: string | null): Promise<{
    nodes: SnippetType[];
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string | null;
    };
  }>;
  getSnippets(): Promise<SnippetType[]>;
  getSnippetsGenerator(): AsyncGenerator<SnippetType[], void, unknown>;
  // Additional methods used by implementations
  request<T>(params: {
    endpoint?: string;
    method?: string;
    body?: Record<string, unknown>;
  }): Promise<{ data: T; headers: Headers; status: number }>;
  guessMimeType(extension: string): string;
  guessLanguage(extension: string): string;
  mapToSnippetType(data: TRawList): SnippetType;
  mapToSnippetSingleType(data: TRawSingle): SnippetSingleType;
}
