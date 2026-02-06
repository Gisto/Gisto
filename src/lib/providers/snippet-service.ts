import { SnippetProvider } from './types';

import { GithubApi } from '@/lib/github-api';
import { GitlabApi } from '@/lib/gitlab-api';
import { globalState } from '@/lib/store/globalState';

type SnippetProviderKey = 'github' | 'gitlab';

const SNIPPET_PROVIDERS: Record<SnippetProviderKey, SnippetProvider<unknown, unknown>> = {
  github: GithubApi as SnippetProvider<unknown, unknown>,
  gitlab: GitlabApi as SnippetProvider<unknown, unknown>,
};

function resolveProvider(activeProvider?: string): SnippetProvider<unknown, unknown> {
  if (activeProvider && activeProvider in SNIPPET_PROVIDERS) {
    return SNIPPET_PROVIDERS[activeProvider as SnippetProviderKey];
  }

  return SNIPPET_PROVIDERS.github;
}

class SnippetService implements SnippetProvider<unknown, unknown> {
  private get provider(): SnippetProvider<unknown, unknown> {
    const activeProvider = globalState.getState().settings.activeSnippetProvider;
    return resolveProvider(activeProvider);
  }

  get capabilities() {
    return this.provider.capabilities;
  }

  getSnippet(snippetId: string) {
    return this.provider.getSnippet(snippetId);
  }

  getMarkdown(text: string) {
    return this.provider.getMarkdown(text);
  }

  createSnippet(params: {
    files: Record<string, { content: string | null } | null>;
    description: string;
    isPublic: boolean;
  }) {
    return this.provider.createSnippet(params);
  }

  updateSnippet(params: {
    snippetId: string;
    files: Record<string, { content: string } | null>;
    description: string;
  }) {
    return this.provider.updateSnippet(params);
  }

  deleteStar(snippetId: string) {
    return this.provider.deleteStar(snippetId);
  }

  addStar(snippetId: string) {
    return this.provider.addStar(snippetId);
  }

  deleteSnippet(snippetId: string, notification?: boolean) {
    return this.provider.deleteSnippet(snippetId, notification);
  }

  toggleSnippetVisibility(snippetId: string) {
    return this.provider.toggleSnippetVisibility(snippetId);
  }

  fetchSnippets(cursor?: string | null) {
    return this.provider.fetchSnippets(cursor);
  }

  getSnippets() {
    return this.provider.getSnippets();
  }

  getSnippetsGenerator() {
    return this.provider.getSnippetsGenerator();
  }

  get baseUrl(): string {
    return this.provider.baseUrl;
  }

  get gitHubApiVersion(): string | undefined {
    return this.provider.gitHubApiVersion;
  }

  fetchGithubGraphQL<T>(query?: string, params?: { cursor: string | null }): Promise<T> {
    return this.provider.fetchGithubGraphQL(query, params);
  }

  request<T>(options: {
    endpoint: string;
    method?: string;
    body?: Record<string, unknown>;
  }): Promise<{ data: T; headers: Headers; status: number }> {
    return this.provider.request(options);
  }

  mapToSnippetType(data: unknown): import('@/types/snippet.ts').SnippetType {
    return this.provider.mapToSnippetType(data);
  }

  mapToSnippetSingleType(data: unknown): import('@/types/snippet.ts').SnippetSingleType {
    return this.provider.mapToSnippetSingleType(data);
  }

  guessMimeType(extension: string): string {
    return this.provider.guessMimeType(extension);
  }

  guessLanguage(extension: string): string {
    return this.provider.guessLanguage(extension);
  }
}

export const snippetService = new SnippetService();
