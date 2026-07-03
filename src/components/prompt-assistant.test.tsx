import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { PromptAssistant, type AssistantMessage } from './prompt-assistant.tsx';

vi.mock('@/lib/is-markdown', () => ({
  isMarkdown: () => false,
}));

vi.mock('@/components/layout/pages/snippet/content/preview/markdown.tsx', () => ({
  Markdown: ({ content }: { content: string }) => <div data-testid="markdown">{content}</div>,
}));

describe('PromptAssistant', () => {
  it('renders empty state when no messages', () => {
    render(<PromptAssistant messages={[]} onSend={() => {}} isLoading={false} />);

    expect(screen.getByText('Ask a question to get started')).toBeInTheDocument();
  });

  it('renders custom emptyText when provided', () => {
    render(
      <PromptAssistant
        messages={[]}
        onSend={() => {}}
        isLoading={false}
        emptyText="Ask about My Snippet"
      />
    );

    expect(screen.getByText('Ask about My Snippet')).toBeInTheDocument();
  });

  it('submits on Enter', () => {
    const onSend = vi.fn();
    render(<PromptAssistant messages={[]} onSend={onSend} isLoading={false} />);

    const textarea = screen.getByPlaceholderText('Ask a question...');
    fireEvent.change(textarea, { target: { value: 'hello' } });
    fireEvent.keyDown(textarea, { key: 'Enter' });

    expect(onSend).toHaveBeenCalledWith('hello');
  });

  it('does not submit on Shift+Enter', () => {
    const onSend = vi.fn();
    render(<PromptAssistant messages={[]} onSend={onSend} isLoading={false} />);

    const textarea = screen.getByPlaceholderText('Ask a question...');
    fireEvent.change(textarea, { target: { value: 'hello' } });
    fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: true });

    expect(onSend).not.toHaveBeenCalled();
  });

  it('does not submit on Enter when input is empty', () => {
    const onSend = vi.fn();
    render(<PromptAssistant messages={[]} onSend={onSend} isLoading={false} />);

    const textarea = screen.getByPlaceholderText('Ask a question...');
    fireEvent.keyDown(textarea, { key: 'Enter' });

    expect(onSend).not.toHaveBeenCalled();
  });

  it('does not submit on Enter when loading', () => {
    const onSend = vi.fn();
    render(<PromptAssistant messages={[]} onSend={onSend} isLoading={true} />);

    const textarea = screen.getByPlaceholderText('Ask a question...');
    fireEvent.change(textarea, { target: { value: 'hello' } });
    fireEvent.keyDown(textarea, { key: 'Enter' });

    expect(onSend).not.toHaveBeenCalled();
  });

  it('clears input after submit', () => {
    const onSend = vi.fn();
    render(<PromptAssistant messages={[]} onSend={onSend} isLoading={false} />);

    const textarea = screen.getByPlaceholderText('Ask a question...') as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: 'hello' } });
    fireEvent.keyDown(textarea, { key: 'Enter' });

    expect(textarea.value).toBe('');
  });

  it('shows send button disabled when input is empty', () => {
    render(<PromptAssistant messages={[]} onSend={() => {}} isLoading={false} />);

    const sendButton = screen.getByRole('button', { name: 'Send message' });
    expect(sendButton).toBeDisabled();
  });

  it('shows send button disabled when loading', () => {
    render(<PromptAssistant messages={[]} onSend={() => {}} isLoading={true} />);

    const textarea = screen.getByPlaceholderText('Ask a question...');
    fireEvent.change(textarea, { target: { value: 'hello' } });

    const sendButton = screen.getByRole('button', { name: 'Send message' });
    expect(sendButton).toBeDisabled();
  });

  it('renders user messages with content', () => {
    const messages: AssistantMessage[] = [{ id: '1', role: 'user', content: 'hello there' }];

    render(<PromptAssistant messages={messages} onSend={() => {}} isLoading={false} />);

    expect(screen.getByText('hello there')).toBeInTheDocument();
  });

  it('renders assistant messages with content', () => {
    const messages: AssistantMessage[] = [
      { id: '1', role: 'assistant', content: 'Hi! How can I help?' },
    ];

    render(<PromptAssistant messages={messages} onSend={() => {}} isLoading={false} />);

    expect(screen.getByText('Hi! How can I help?')).toBeInTheDocument();
  });

  it('renders multiline user content preserving whitespace', () => {
    const messages: AssistantMessage[] = [
      { id: '1', role: 'user', content: 'line one\nline two\nline three' },
    ];

    const { container } = render(
      <PromptAssistant messages={messages} onSend={() => {}} isLoading={false} />
    );

    const bubbleContent = container.querySelector('[data-slot="bubble-content"]');
    expect(bubbleContent).toHaveClass('whitespace-pre-wrap');
  });

  it('renders context label when provided', () => {
    render(
      <PromptAssistant
        messages={[]}
        onSend={() => {}}
        isLoading={false}
        contextLabel="Asking about: My Snippet"
      />
    );

    expect(screen.getByText('Asking about: My Snippet')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<PromptAssistant messages={[]} onSend={() => {}} isLoading={true} />);

    expect(screen.getByText('Thinking...')).toBeInTheDocument();
  });

  it('does not show empty state when messages exist', () => {
    const messages: AssistantMessage[] = [{ id: '1', role: 'user', content: 'hello' }];

    render(<PromptAssistant messages={messages} onSend={() => {}} isLoading={false} />);

    expect(screen.queryByText('Ask a question to get started')).not.toBeInTheDocument();
  });
});
