import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { ThemeSwitcher } from './theme-switcher';

const mockSetTheme = vi.fn();

vi.mock('./theme-provider', () => ({
  useTheme: () => ({ setTheme: mockSetTheme }),
}));

vi.mock('@/lib/i18n', () => ({
  t: vi.fn((key) => key),
}));

describe('ThemeSwitcher', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders theme switcher button', () => {
    render(<ThemeSwitcher />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
