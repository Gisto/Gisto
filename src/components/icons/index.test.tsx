import { render } from '@testing-library/react';

import { OpenAIIcon, GeminiIcon, ClaudeIcon, OpenRouterIcon, GitHubIcon, GitLabIcon } from '.';

describe('Icons', () => {
  it('renders OpenAIIcon', () => {
    const { asFragment } = render(<OpenAIIcon />);
    expect(asFragment()).toBeDefined();
  });

  it('renders GeminiIcon', () => {
    const { asFragment } = render(<GeminiIcon />);
    expect(asFragment()).toBeDefined();
  });

  it('renders ClaudeIcon', () => {
    const { asFragment } = render(<ClaudeIcon />);
    expect(asFragment()).toBeDefined();
  });

  it('renders OpenRouterIcon', () => {
    const { asFragment } = render(<OpenRouterIcon />);
    expect(asFragment()).toBeDefined();
  });

  it('renders GitHubIcon', () => {
    const { asFragment } = render(<GitHubIcon />);
    expect(asFragment()).toBeDefined();
  });

  it('renders GitLabIcon', () => {
    const { asFragment } = render(<GitLabIcon />);
    expect(asFragment()).toBeDefined();
  });
});
