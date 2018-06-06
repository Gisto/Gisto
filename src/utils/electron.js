import { get } from 'lodash/fp';

export const isElectron = process && get('electron', process.versions);
