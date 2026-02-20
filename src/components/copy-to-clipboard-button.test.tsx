import { render, screen, fireEvent, act } from '@testing-library/react';
import { vi } from 'vitest';

import { mockUtils } from '../../test/mockUtils.ts';

import { CopyToClipboardButton } from '@/components/copy-to-clipboard-button';
import { copyToClipboard } from '@/utils';

describe('CopyToClipboardButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    mockUtils();
  });
  it('renders the button with the Clipboard icon initially', () => {
    render(<CopyToClipboardButton text="Test text" />);
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByTestId('clipboard-icon')).toBeInTheDocument();
  });

  it('calls copyToClipboard with the correct text when clicked', () => {
    render(<CopyToClipboardButton text="Test text" />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(copyToClipboard).toHaveBeenCalledWith('Test text');
  });

  it('shows the ClipboardCheck icon after clicking the button', () => {
    vi.useFakeTimers();
    render(<CopyToClipboardButton text="Test text" />);
    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(screen.getByTestId('clipboard-check-icon')).toBeInTheDocument();
    act(() => {
      vi.runAllTimers();
      vi.useRealTimers();
    });
  });

  it('reverts to the Clipboard icon after 2 seconds', () => {
    vi.useFakeTimers();
    render(<CopyToClipboardButton text="Test text" />);
    const button = screen.getByRole('button');

    fireEvent.click(button);
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(screen.getByTestId('clipboard-icon')).toBeInTheDocument();
    vi.useRealTimers();
  });
});
