import { render, screen, act } from '@testing-library/react';
import { vi } from 'vitest';

import ToastManager from './toast-manager';

import { EVENT_NAME } from './';

import { randomString } from '@/lib/utils';

// Mock the randomString utility
vi.mock('@/lib/utils', () => ({
  randomString: vi.fn(() => 'mock-random-string'),
  cn: () => 'mock-class-name',
}));

describe('ToastManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<ToastManager />);
    expect(screen.getByTestId('toast-container')).toBeInTheDocument();
  });

  it('adds a new toast when event is triggered', () => {
    render(<ToastManager />);

    const toastData = {
      title: 'Test Toast',
      message: 'Test Message',
      type: 'success',
      duration: 3000,
    };

    act(() => {
      window.dispatchEvent(
        new CustomEvent(EVENT_NAME, {
          detail: toastData,
        })
      );
    });

    expect(screen.getByText('Test Toast')).toBeInTheDocument();
    expect(screen.getByText('Test Message')).toBeInTheDocument();
  });

  it('generates random id if not provided', () => {
    render(<ToastManager />);

    const toastData = {
      title: 'Test Toast',
      message: 'Test Message',
      type: 'success',
      duration: 3000,
    };

    act(() => {
      window.dispatchEvent(
        new CustomEvent(EVENT_NAME, {
          detail: toastData,
        })
      );
    });

    expect(randomString).toHaveBeenCalledTimes(1);
  });

  it('positions multiple toasts correctly', () => {
    render(<ToastManager />);

    const toasts = [
      {
        id: 'toast-1',
        title: 'Toast 1',
        message: 'Message 1',
        type: 'success',
        duration: 3000,
      },
      {
        id: 'toast-2',
        title: 'Toast 2',
        message: 'Message 2',
        type: 'error',
        duration: 3000,
      },
    ];

    act(() => {
      toasts.forEach((toast) => {
        window.dispatchEvent(
          new CustomEvent(EVENT_NAME, {
            detail: toast,
          })
        );
      });
    });

    const toastElements = screen.getAllByTestId('toast');
    expect(toastElements[0]).toHaveStyle({ bottom: '0px' });
    expect(toastElements[1]).toHaveStyle({ bottom: '80px' });
  });
});
