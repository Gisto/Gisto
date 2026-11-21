import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { MissingExtensionDialog } from './missing-extension-dialog.tsx';

describe('MissingExtensionDialog', () => {
  const defaultProps = {
    files: [
      { filename: 'server', extension: 'js' },
      { filename: 'notes', extension: 'py' },
    ],
  };

  it('lists each file and the extension it will get', () => {
    render(
      <MissingExtensionDialog
        {...defaultProps}
        onConfirm={() => {}}
        onSkip={() => {}}
        onDismiss={() => {}}
      />
    );

    expect(screen.getByText('server → server.js')).toBeInTheDocument();
    expect(screen.getByText('notes → notes.py')).toBeInTheDocument();
  });

  it('confirms with the extension appended', () => {
    const onConfirm = vi.fn();
    render(
      <MissingExtensionDialog
        {...defaultProps}
        onConfirm={onConfirm}
        onSkip={() => {}}
        onDismiss={() => {}}
      />
    );

    fireEvent.click(screen.getByText('Add extension'));

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('skips and saves without the extension', () => {
    const onSkip = vi.fn();
    render(
      <MissingExtensionDialog
        {...defaultProps}
        onConfirm={() => {}}
        onSkip={onSkip}
        onDismiss={() => {}}
      />
    );

    fireEvent.click(screen.getByText('Save without extension'));

    expect(onSkip).toHaveBeenCalledTimes(1);
  });

  it('dismissing aborts instead of saving', () => {
    const onDismiss = vi.fn();
    const onSkip = vi.fn();
    render(
      <MissingExtensionDialog
        {...defaultProps}
        onConfirm={() => {}}
        onSkip={onSkip}
        onDismiss={onDismiss}
      />
    );

    fireEvent.keyDown(document.body, { key: 'Escape' });

    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(onSkip).not.toHaveBeenCalled();
  });
});
