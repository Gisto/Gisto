import settings from 'electron-settings';

export const getSetting = (key,  fallback = undefined) => settings.get(key, fallback);

export const setSetting = (key, value) => settings.set(key, value);

export const setBooleanSetting = (key) => setSetting(key, !getSetting(key));
