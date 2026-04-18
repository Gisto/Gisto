import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

vi.mock('@/lib/store/globalState', () => ({
  globalState: {
    getState: vi.fn(() => ({ settings: { activeSnippetProvider: 'github' } })),
  },
}));

vi.mock('../api/github-api', () => ({
  GithubApi: {
    baseUrl: 'https://api.github.com',
    capabilities: { supportsGists: true, supportsStars: true },
    getSnippet: vi.fn(),
    getMarkdown: vi.fn(),
    createSnippet: vi.fn(),
    updateSnippet: vi.fn(),
    deleteStar: vi.fn(),
    addStar: vi.fn(),
    deleteSnippet: vi.fn(),
    toggleSnippetVisibility: vi.fn(),
    fetchSnippets: vi.fn(),
    getSnippets: vi.fn(),
    getSnippetsGenerator: vi.fn(),
    gitHubApiVersion: 'v1',
    fetchGithubGraphQL: vi.fn(),
    request: vi.fn(),
    mapToSnippetType: vi.fn(),
    mapToSnippetSingleType: vi.fn(),
    guessMimeType: vi.fn().mockReturnValue('text/plain'),
    guessLanguage: vi.fn().mockReturnValue('JavaScript'),
  },
}));

vi.mock('../api/gitlab-api', () => ({
  GitlabApi: { baseUrl: 'https://api.gitlab.com' },
}));

vi.mock('../api/local-api', () => ({
  LocalApi: { baseUrl: 'https://local.api.com' },
}));

import { GithubApi } from '../api/github-api.ts';
import { GitlabApi } from '../api/gitlab-api.ts';

import { snippetService } from './snippet-service';

import { globalState } from '@/lib/store/globalState';

describe('snippetService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('console', { error: vi.fn(), log: vi.fn() });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('uses GitHub when active provider is github', () => {
    (globalState.getState as ReturnType<typeof vi.fn>).mockReturnValue({
      settings: { activeSnippetProvider: 'github' },
    });
    expect(snippetService.baseUrl).toBe(GithubApi.baseUrl);
  });

  it('uses GitLab when active provider is gitlab', () => {
    (globalState.getState as ReturnType<typeof vi.fn>).mockReturnValue({
      settings: { activeSnippetProvider: 'gitlab' },
    });
    expect(snippetService.baseUrl).toBe(GitlabApi.baseUrl);
  });

  it('falls back to GitHub when provider is unknown', () => {
    (globalState.getState as ReturnType<typeof vi.fn>).mockReturnValue({
      settings: { activeSnippetProvider: 'bitbucket' },
    });
    expect(snippetService.baseUrl).toBe(GithubApi.baseUrl);
  });

  it('exposes capabilities from provider', () => {
    expect(snippetService.capabilities).toEqual({ supportsGists: true, supportsStars: true });
  });

  it('exposes baseUrl from provider', () => {
    expect(snippetService.baseUrl).toBe('https://api.github.com');
  });

  it('exposes gitHubApiVersion from provider', () => {
    expect(snippetService.gitHubApiVersion).toBe('v1');
  });

  it('delegates getSnippet', async () => {
    await snippetService.getSnippet('123');
    expect(GithubApi.getSnippet).toHaveBeenCalledWith('123');
  });

  it('delegates getMarkdown', async () => {
    await snippetService.getMarkdown('# test');
    expect(GithubApi.getMarkdown).toHaveBeenCalledWith('# test');
  });

  it('delegates createSnippet', async () => {
    await snippetService.createSnippet({
      files: { 'test.js': { content: 'console.log()' } },
      description: 'test',
      isPublic: false,
    });
    expect(GithubApi.createSnippet).toHaveBeenCalled();
  });

  it('delegates updateSnippet', async () => {
    await snippetService.updateSnippet({
      snippetId: '123',
      files: { 'test.js': { content: 'console.log()' } },
      description: 'test',
    });
    expect(GithubApi.updateSnippet).toHaveBeenCalled();
  });

  it('delegates deleteStar', async () => {
    await snippetService.deleteStar('123');
    expect(GithubApi.deleteStar).toHaveBeenCalledWith('123');
  });

  it('delegates addStar', async () => {
    await snippetService.addStar('123');
    expect(GithubApi.addStar).toHaveBeenCalledWith('123');
  });

  it('delegates deleteSnippet', async () => {
    await snippetService.deleteSnippet('123');
    expect(GithubApi.deleteSnippet).toHaveBeenCalledWith('123', undefined);
  });

  it('delegates toggleSnippetVisibility', async () => {
    await snippetService.toggleSnippetVisibility('123');
    expect(GithubApi.toggleSnippetVisibility).toHaveBeenCalledWith('123');
  });

  it('delegates fetchSnippets', async () => {
    await snippetService.fetchSnippets(null);
    expect(GithubApi.fetchSnippets).toHaveBeenCalledWith(null);
  });

  it('delegates getSnippets', async () => {
    await snippetService.getSnippets();
    expect(GithubApi.getSnippets).toHaveBeenCalled();
  });

  it('delegates getSnippetsGenerator', async () => {
    await snippetService.getSnippetsGenerator();
    expect(GithubApi.getSnippetsGenerator).toHaveBeenCalled();
  });

  it('delegates request', async () => {
    await snippetService.request({ endpoint: '/test' });
    expect(GithubApi.request).toHaveBeenCalled();
  });

  it('delegates mapToSnippetType', () => {
    snippetService.mapToSnippetType({});
    expect(GithubApi.mapToSnippetType).toHaveBeenCalledWith({});
  });

  it('delegates mapToSnippetSingleType', () => {
    snippetService.mapToSnippetSingleType({});
    expect(GithubApi.mapToSnippetSingleType).toHaveBeenCalledWith({});
  });

  it('delegates guessMimeType', () => {
    expect(snippetService.guessMimeType('js')).toBe('text/plain');
  });

  it('delegates guessLanguage', () => {
    expect(snippetService.guessLanguage('js')).toBe('JavaScript');
  });

  it('delegates fetchGithubGraphQL', async () => {
    await snippetService.fetchGithubGraphQL('query', { cursor: null });
    expect(GithubApi.fetchGithubGraphQL).toHaveBeenCalled();
  });
});
