import { last, split } from 'lodash/fp';

export const stripTrailingSlash = (stringWithSlashes: string) =>
  stringWithSlashes.endsWith('/') ? stringWithSlashes.slice(0, -1) : stringWithSlashes;

export const getFileExtension = (fileName: string) => last(split('.', fileName));

export const randomString = (charsCount = 5) =>
  Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, '')
    .substr(0, charsCount);
