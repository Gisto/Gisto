import { keys } from 'lodash/fp';
import { isElectron } from 'utils/electron';
import { gaEvent } from 'utils/ga';
import { handleTypes } from 'utils/types';

import { IGaEvent, ISettings } from 'types/Interfaces.d';

let settings: ISettings;

if (isElectron) {
  settings = require('electron-settings');
} else {
  settings = {
    get: (...args: string[]) => {
      const item = localStorage.getItem(args[0]);

      if (!item) {
        localStorage.setItem(args[0], args[1]);

        return args[1];
      }

      return handleTypes(item);
    },
    set: (...args: string[]) => {
      return localStorage.setItem(args[0], args[1]);
    },
    getAll: () =>
      keys(localStorage).reduce((acc: object[], str: string) => {
        acc[str] = localStorage.getItem(str);

        return acc;
      }, [])
  };
}

// @ts-ignore
export const getSetting = (key: string, fallback?: string | boolean) => settings.get(key, fallback);

export const setSetting = (key: string, value: string | boolean) => {
  gaEvent({
    category: 'settings',
    action: 'set',
    label: key,
    value
  } as IGaEvent);
  // @ts-ignore
  settings.set(key, value);
};

export const setBooleanSetting = (key: string) => {
  const newValue: boolean = !getSetting(key);

  setSetting(key, newValue);
};

export const getAllSettings = () => settings.getAll();

export const setSession = (key: string, value: string) => sessionStorage.setItem(key, value);

export const getSession = (key: string) => sessionStorage.getItem(key);
