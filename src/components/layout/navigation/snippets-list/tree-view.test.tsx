import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { TreeView } from './tree-view.tsx';

vi.mock('@/lib/store/globalState', () => ({
  useStoreValue: vi.fn(() => []),
}));

vi.mock('dirty-react-router', () => ({
  useRouter: () => ({ navigate: vi.fn() }),
}));

describe('TreeView', () => {
  it('renders tags mode correctly', () => {
    render(<TreeView mode="tags" allExpanded={true} />);
    expect(screen.getByText(/no tags/i)).toBeInTheDocument();
  });

  it('renders languages mode correctly', () => {
    render(<TreeView mode="languages" allExpanded={true} />);
    expect(screen.getByText(/no languages/i)).toBeInTheDocument();
  });

  it('accepts allExpanded prop when false', () => {
    render(<TreeView mode="tags" allExpanded={false} />);
    expect(screen.getByText(/no tags/i)).toBeInTheDocument();
  });
});
