import { keys } from 'lodash/fp';
import { isElectron } from 'utils/electron';
import { handleTypes } from 'utils/types';
import { gaEvent } from 'utils/ga';

let settings;

if (isElectron) {
  settings = require('electron-settings');
} else {
  settings = {
    get: (...args) => {
      const item = localStorage.getItem(args[0]);

      if (!item) {
        localStorage.setItem(args[0], args[1]);

        return args[1];
      }

      return handleTypes(item);
    },
    set: (...args) => {
      return localStorage.setItem(args[0], args[1]);
    },
    getAll: () => keys(localStorage).reduce((acc, str)  => {
      acc[str] = localStorage.getItem(str);

      return acc;
    }, {})
  };
}

export const getSetting = (key,  fallback = undefined) => settings.get(key, fallback);

export const setSetting = (key, value) => {
  gaEvent({
    category: 'settings',
    action: 'set',
    label: key,
    value
  });
  settings.set(key, value);
};

export const setBooleanSetting = (key) => {
  const newValue = !getSetting(key);

  setSetting(key, newValue);
};

export const getAllSettings = () => settings.getAll();
