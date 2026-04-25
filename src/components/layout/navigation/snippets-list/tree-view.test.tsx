import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { TreeView } from './tree-view.tsx';

import { t } from '@/lib/i18n';

vi.mock('@/lib/store/globalState', () => ({
  useStoreValue: vi.fn(() => []),
}));

vi.mock('dirty-react-router', () => ({
  useRouter: () => ({ navigate: vi.fn() }),
}));

describe('TreeView', () => {
  it('renders tags mode correctly with empty state', () => {
    render(<TreeView mode="tags" allExpanded={true} />);
    expect(screen.getByText(t('list.noSnippets'))).toBeInTheDocument();
  });

  it('renders languages mode correctly with empty state', () => {
    render(<TreeView mode="languages" allExpanded={true} />);
    expect(screen.getByText(t('list.noSnippets'))).toBeInTheDocument();
  });

  it('accepts allExpanded prop when false with empty state', () => {
    render(<TreeView mode="tags" allExpanded={false} />);
    expect(screen.getByText(t('list.noSnippets'))).toBeInTheDocument();
  });
});
