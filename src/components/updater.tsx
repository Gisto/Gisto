import { relaunch } from '@tauri-apps/plugin-process';
import { check } from '@tauri-apps/plugin-updater';
import { useEffect } from 'react';

export const Updater = () => {
  useEffect(() => {
    if ('isTauri' in window) {
      (async () => {
        const update = await check();

        if (update?.available) {
          const agree = confirm(`Update to ${update.version} available! Download and install?`);

          if (agree) {
            await update.downloadAndInstall();
            await relaunch();
          }
        }
      })();
    }
  }, []);

  return null;
};
