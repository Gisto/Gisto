import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ErrorBoundary } from './error-boundary';

const strings: Record<string, string> = {
  'components.errorBoundaryTitle': 'Something went wrong',
  'components.errorBoundaryDescription': 'An unexpected error occurred.',
  'common.retry': 'Retry',
  'components.errorBoundaryBackHome': 'Back to dashboard',
};

vi.mock('@/lib/i18n', () => ({
  t: (key: string) => strings[key] ?? key,
}));

vi.mock('@sentry/react', () => ({
  captureException: vi.fn(),
}));

const Thrower = ({ message }: { message: string }) => {
  throw new Error(message);
};

const Harness = () => {
  const [exploded, setExploded] = useState(false);

  return (
    <>
      <button onClick={() => setExploded(true)}>explode</button>
      <button onClick={() => setExploded(false)}>defuse</button>
      <ErrorBoundary label="test">
        {exploded ? <Thrower message="boom" /> : <p>all good</p>}
      </ErrorBoundary>
    </>
  );
};

describe('ErrorBoundary', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('renders children when nothing throws', () => {
    render(
      <ErrorBoundary>
        <p>all good</p>
      </ErrorBoundary>
    );

    expect(screen.getByText('all good')).toBeInTheDocument();
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
  });

  it('renders the friendly fallback UI when a child throws', () => {
    render(<Harness />);

    fireEvent.click(screen.getByText('explode'));

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('An unexpected error occurred.')).toBeInTheDocument();
    expect(screen.queryByText('all good')).not.toBeInTheDocument();
  });

  it('recovers via retry once children stop throwing', () => {
    render(<Harness />);

    fireEvent.click(screen.getByText('explode'));
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'defuse' }));
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));

    expect(screen.getByText('all good')).toBeInTheDocument();
  });

  it('offers a way back to the dashboard', () => {
    const assign = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { assign },
      writable: true,
    });

    render(<Harness />);

    fireEvent.click(screen.getByText('explode'));
    fireEvent.click(screen.getByRole('button', { name: 'Back to dashboard' }));

    expect(assign).toHaveBeenCalledWith('/');
  });

  it('uses the custom fallback when provided and recovers via its reset', () => {
    const CustomHarness = () => {
      const [exploded, setExploded] = useState(false);

      return (
        <>
          <button onClick={() => setExploded(!exploded)}>toggle</button>
          <ErrorBoundary
            label="test"
            fallback={(error, reset) => (
              <div>
                <span>custom: {error.message}</span>
                <button onClick={reset}>custom reset</button>
              </div>
            )}
          >
            {exploded ? <Thrower message="kaboom" /> : <p>all good</p>}
          </ErrorBoundary>
        </>
      );
    };

    render(<CustomHarness />);

    fireEvent.click(screen.getByRole('button', { name: 'toggle' }));
    expect(screen.getByText('custom: kaboom')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'toggle' }));
    fireEvent.click(screen.getByRole('button', { name: 'custom reset' }));

    expect(screen.getByText('all good')).toBeInTheDocument();
  });
});
