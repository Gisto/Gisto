import { last, split } from 'lodash/fp';

export const stripTrailingSlash = (string) => string.endsWith('/') ? string.slice(0, -1) : string;

export const getFileExtension = (fileName) => last(split('.', fileName));
