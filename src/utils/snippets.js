import { get } from 'lodash/fp';

export const getSnippet = (path, store) => get(path, store);
