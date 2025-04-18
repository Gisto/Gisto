import { relaunch } from '@tauri-apps/plugin-process';
import { check } from '@tauri-apps/plugin-updater';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Mock, vi } from 'vitest';

import { mockUtils } from '../../test/mockUtils.ts';

import { Updater } from './updater';

vi.mock('@tauri-apps/plugin-updater', () => ({
  check: vi.fn(),
}));

vi.mock('@tauri-apps/plugin-process', () => ({
  relaunch: vi.fn(),
}));

mockUtils();

describe('Updater', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing if no update is available', async () => {
    (check as Mock).mockResolvedValue(null);

    render(<Updater />);

    await waitFor(() => {
      expect(screen.queryByText(/updateAvailable/)).not.toBeInTheDocument();
    });
  });

  it('renders update available message when an update is available', async () => {
    Object.defineProperty(window, 'isTauri', { value: true, configurable: true });

    const mockUpdate = {
      version: '1.2.3',
      currentVersion: '1.0.0',
      rawJson: {},
      download: vi.fn(),
      downloadAndInstall: vi.fn(),
    };
    (check as Mock).mockResolvedValue(mockUpdate);

    render(<Updater />);

    await waitFor(() => {
      expect(screen.getByText('Update to v1.2.3 is available')).toBeInTheDocument();
    });
  });

  it('downloads and installs the update when the button is clicked', async () => {
    Object.defineProperty(window, 'isTauri', { value: true, configurable: true });

    const mockUpdate = {
      version: '1.2.3',
      currentVersion: '1.0.0',
      rawJson: {},
      download: vi.fn(),
      downloadAndInstall: vi.fn(),
    };
    (check as Mock).mockResolvedValue(mockUpdate);

    render(<Updater />);

    await waitFor(() => {
      expect(screen.getByText('Update to v1.2.3 is available')).toBeInTheDocument();
    });

    const downloadButton = screen.getByRole('button');
    fireEvent.click(downloadButton);

    await waitFor(() => {
      expect(mockUpdate.downloadAndInstall).toHaveBeenCalled();
    });
  });

  it('relaunches the app when the restart button is clicked', async () => {
    Object.defineProperty(window, 'isTauri', { value: true, configurable: true });
    const mockUpdate = {
      version: '1.2.3',
      currentVersion: '1.0.0',
      rawJson: {},
      download: vi.fn(),
      downloadAndInstall: vi.fn((callback) => {
        callback({ event: 'Finished' });
      }),
    };
    (check as Mock).mockResolvedValue(mockUpdate);

    render(<Updater />);

    await waitFor(() => {
      expect(screen.getByText('Update to v1.2.3 is available')).toBeInTheDocument();
    });

    const downloadButton = screen.getByRole('button');
    fireEvent.click(downloadButton);

    await waitFor(() => {
      expect(screen.getByText('Download of v1.2.3 finished')).toBeInTheDocument();
    });

    const restartButton = screen.getByRole('button');
    fireEvent.click(restartButton);

    await waitFor(() => {
      expect(relaunch).toHaveBeenCalled();
    });
  });
});
