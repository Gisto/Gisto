/* eslint-disable @typescript-eslint/no-explicit-any */
import { SnippetProvider } from './types';

import { GithubApi } from '@/lib/github-api';
import { GitlabApi } from '@/lib/gitlab-api';
import { globalState } from '@/lib/store/globalState';

type SnippetProviderKey = 'github' | 'gitlab';

const SNIPPET_PROVIDERS: Record<SnippetProviderKey, SnippetProvider<any>> = {
  github: GithubApi as SnippetProvider<any>,
  gitlab: GitlabApi as SnippetProvider<any>,
};

function resolveProvider(activeProvider?: string): SnippetProvider<any> {
  if (activeProvider && activeProvider in SNIPPET_PROVIDERS) {
    return SNIPPET_PROVIDERS[activeProvider as SnippetProviderKey];
  }

  return SNIPPET_PROVIDERS.github;
}

class SnippetService implements SnippetProvider<any> {
  private get provider(): SnippetProvider<any> {
    const activeProvider = globalState.getState().settings.activeSnippetProvider;
    return resolveProvider(activeProvider);
  }

  get capabilities() {
    return this.provider.capabilities;
  }

  getGist(gistId: string) {
    return this.provider.getGist(gistId);
  }

  getMarkdown(text: string) {
    return this.provider.getMarkdown(text);
  }

  createGist(params: {
    files: Record<string, { content: string | null } | null>;
    description: string;
    isPublic: boolean;
  }) {
    return this.provider.createGist(params);
  }

  updateGist(params: {
    gistId: string;
    files: Record<string, { content: string } | null>;
    description: string;
  }) {
    return this.provider.updateGist(params);
  }

  deleteStar(gistId: string) {
    return this.provider.deleteStar(gistId);
  }

  addStar(gistId: string) {
    return this.provider.addStar(gistId);
  }

  deleteGist(gistId: string, notification?: boolean) {
    return this.provider.deleteGist(gistId, notification);
  }

  toggleGistVisibility(gistId: string) {
    return this.provider.toggleGistVisibility(gistId);
  }

  fetchGists(cursor?: string | null) {
    return this.provider.fetchGists(cursor);
  }

  getGists() {
    return this.provider.getGists();
  }

  getGistsGenerator() {
    return this.provider.getGistsGenerator();
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

  /* eslint-disable @typescript-eslint/no-explicit-any */
  mapToGistType(data: any): import('@/types/gist.ts').GistType {
    return this.provider.mapToGistType(data);
  }

  mapToGistSingleType(data: any): import('@/types/gist.ts').GistSingleType {
    return this.provider.mapToGistSingleType(data);
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */

  guessMimeType(extension: string): string {
    return this.provider.guessMimeType(extension);
  }

  guessLanguage(extension: string): string {
    return this.provider.guessLanguage(extension);
  }
}

export const snippetService = new SnippetService();
