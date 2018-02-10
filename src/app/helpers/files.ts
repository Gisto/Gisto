import { omit, map, keyBy } from 'lodash/fp';

export const normalizeFiles = (files) => {
  const normalizeFileNames = map((file) => {
    if (file.originalFileName === file.filename) {
      return omit('filename', file);
    }

    return file;
  }, files);

  return keyBy('originalFileName', normalizeFileNames);
};
