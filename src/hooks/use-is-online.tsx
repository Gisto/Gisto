import { useEffect, useState } from 'react';

export const useIsOnline = () => {
  const [online, setOnline] = useState<boolean>(true);

  const checkOnlineStatus = () => setOnline(navigator.onLine);

  useEffect(() => {
    window.addEventListener('online', checkOnlineStatus);
    window.addEventListener('offline', checkOnlineStatus);
    return () => {
      window.removeEventListener('online', checkOnlineStatus);
      window.removeEventListener('offline', checkOnlineStatus);
    };
  }, []);

  return online;
};
