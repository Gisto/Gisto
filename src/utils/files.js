import { getFileExtension } from 'utils/string';
import { startsWith } from 'lodash/fp';

export const isMarkDown = (file) => {
  return file.language === 'Markdown'
    || getFileExtension(file.filename) === 'md'
    || getFileExtension(file.filename) === 'markdown'
    || getFileExtension(file.name) === 'md'
    || getFileExtension(file.name) === 'markdown';
};

export const isAsciiDoc = (file) => {
  return file.language === 'AsciiDoc'
    || getFileExtension(file.filename) === 'adoc'
    || getFileExtension(file.filename) === 'asciidoc'
    || getFileExtension(file.name) === 'adoc'
    || getFileExtension(file.name) === 'asciidoc';
};

export const isCSV = (file) => file.language === 'CSV';

export const isImage = (file) => startsWith('image/', file.type);

export const isGeoJson = (file) => {
  return file.language === 'JSON'
    && (getFileExtension(file.filename) === 'geojson' || getFileExtension(file.name) === 'geojson');
};

export const isPDF = (file) => file.type === 'application/pdf'
  && (getFileExtension(file.filename) === 'pdf' || getFileExtension(file.name) === 'pdf');

export const getFileLanguage = (file) => {
  if (isImage(file)) {
    return 'Image';
  }

  if (isPDF(file)) {
    return 'PDF';
  }

  return file.language;
};
