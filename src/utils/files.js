import { getFileExtension } from 'utils/string';

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

export const isGeoJson = (file) => {
  return file.language === 'JSON'
    && (getFileExtension(file.filename) === 'geojson' || getFileExtension(file.name) === 'geojson');
};
