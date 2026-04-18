import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { ThemeSwitcher } from './theme-switcher';

const mockSetTheme = vi.fn();

vi.mock('./theme-provider', () => ({
  useTheme: vi.fn(() => ({ setTheme: mockSetTheme, theme: 'light', resolvedTheme: 'light' })),
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

  it('renders with showLabel prop', () => {
    render(<ThemeSwitcher showLabel />);
    expect(screen.getByText('theme.light')).toBeInTheDocument();
  });

  it('renders with row trigger mode', () => {
    render(<ThemeSwitcher triggerMode="row" />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('renders with row trigger mode and label', () => {
    render(<ThemeSwitcher triggerMode="row" showLabel />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<ThemeSwitcher className="custom-class" />);
    const container = screen.getByRole('button').parentElement;
    expect(container).toHaveClass('custom-class');
  });

  it('applies custom buttonClassName', () => {
    render(<ThemeSwitcher buttonClassName="custom-button-class" />);
    expect(screen.getByRole('button')).toHaveClass('custom-button-class');
  });

  it('has accessible button', () => {
    render(<ThemeSwitcher />);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });
});
