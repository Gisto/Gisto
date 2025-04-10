import { relaunch } from '@tauri-apps/plugin-process';
import { check, Update } from '@tauri-apps/plugin-updater';
import { CircleChevronDown, Loader } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button.tsx';

export const Updater = () => {
  const [availableUpdate, setAvailableUpdate] = useState<Update | null>(null);
  const [downloaded, setDownloaded] = useState<number>(0);
  const [, setContentLength] = useState<number>(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if ('isTauri' in window) {
      (async () => {
        const update = await check();

        if (update?.version) {
          setAvailableUpdate(update);
        }
      })();
    }
  }, []);

  if (!availableUpdate) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <CircleChevronDown strokeWidth={1.5} className="animate-pulse stroke-lime-500" />
      {done
        ? `Download of v${availableUpdate.version} finished`
        : `Update to v${availableUpdate.version} is available`}
      {!done && (
        <Button
          size="sm"
          onClick={async () => {
            if (availableUpdate) {
              await availableUpdate.downloadAndInstall((event) => {
                if (event.event === 'Finished') {
                  setDone(true);
                }
                if (event.event === 'Started') {
                  setContentLength(Number(event.data.contentLength));
                }
                if (event.event === 'Progress') {
                  setDownloaded(downloaded + event.data.chunkLength);
                }
              });
            }
          }}
        >
          {downloaded === 0 ? 'Download' : <Loader strokeWidth={1.5} className="animate-spin" />}
        </Button>
      )}
      {done && (
        <Button
          size="sm"
          onClick={async () => {
            await relaunch();
          }}
        >
          Restart gisto
        </Button>
      )}
    </div>
  );
};
