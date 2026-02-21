import { describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/store/globalState', () => ({
  globalState: {
    getState: vi.fn(),
  },
}));

import { GithubApi } from '../api/github-api.ts';
import { GitlabApi } from '../api/gitlab-api.ts';

import { snippetService } from './snippet-service';

import { globalState } from '@/lib/store/globalState';

const setActiveProvider = (provider?: string) => {
  (globalState.getState as ReturnType<typeof vi.fn>).mockReturnValue({
    settings: {
      activeSnippetProvider: provider,
    },
  });
};

describe('snippetService', () => {
  it('uses GitHub when active provider is github', () => {
    setActiveProvider('github');
    expect(snippetService.baseUrl).toBe(GithubApi.baseUrl);
  });

  it('uses GitLab when active provider is gitlab', () => {
    setActiveProvider('gitlab');
    expect(snippetService.baseUrl).toBe(GitlabApi.baseUrl);
  });

  it('falls back to GitHub when provider is unknown', () => {
    setActiveProvider('bitbucket');
    expect(snippetService.baseUrl).toBe(GithubApi.baseUrl);
  });
});
