import { relaunch } from '@tauri-apps/plugin-process';
import { check, Update } from '@tauri-apps/plugin-updater';
import { CircleChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';

import { isTauri } from '@/components/isTauri.ts';
import { Loading } from '@/components/loading.tsx';
import { Button } from '@/components/ui/button.tsx';
import { t } from '@/lib/i18n';
import { upperCaseFirst } from '@/utils';

export const Updater = () => {
  const [availableUpdate, setAvailableUpdate] = useState<Update | null>(null);
  const [downloaded, setDownloaded] = useState<number>(0);
  const [, setContentLength] = useState<number>(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (isTauri()) {
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
        ? t('components.downloadFinished', {
            version: availableUpdate.version,
          })
        : t('components.updateAvailable', { version: availableUpdate.version })}
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
          {downloaded === 0 ? (
            upperCaseFirst(t('common.download'))
          ) : (
            <Loading size={4} className="flex items-center justify-center" />
          )}
        </Button>
      )}
      {done && (
        <Button
          size="sm"
          onClick={async () => {
            await relaunch();
          }}
        >
          {upperCaseFirst(t('common.restart'))} gisto
        </Button>
      )}
    </div>
  );
};
