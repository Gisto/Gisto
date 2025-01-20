import { useEffect, useState } from 'react';

import { Store } from './store.ts';

import { GistEnrichedType } from '@/types/gist.ts';

type StoreStateType = {
  user: Record<string, unknown> | null;
  isLoggedIn: boolean;
  snippets: GistEnrichedType[] | [];
  apiRateLimits: {
    limit: number;
    remaining: number;
    reset: string;
  } | null;
};

export const globalState = new Store<StoreStateType>({
  user: null,
  isLoggedIn: false,
  snippets: [],
  apiRateLimits: null,
});

if (import.meta.env.MODE !== 'production') {
  // @ts-expect-error I just need this, let me
  window.globalState = globalState;
}

export function useStoreValue<K extends keyof StoreStateType>(store: K) {
  const [value, setValue] = useState<StoreStateType[K]>(globalState.getState()[store]);

  useEffect(() => {
    return globalState.subscribe((state) => setValue(state[store]));
  }, [store]);

  return value;
}
