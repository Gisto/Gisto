import { startsWith } from 'lodash/fp';
import { getFileExtension } from 'utils/string';

interface IFile {
  language: string;
  filename?: string;
  name?: string;
  type?: any;
}

export const isMarkDown = (file: IFile) => {
  return (
    file.language === 'Markdown' ||
    getFileExtension(file.filename) === 'md' ||
    getFileExtension(file.filename) === 'markdown' ||
    getFileExtension(file.name) === 'md' ||
    getFileExtension(file.name) === 'markdown'
  );
};

export const isAsciiDoc = (file: IFile) => {
  return (
    file.language === 'AsciiDoc' ||
    getFileExtension(file.filename) === 'adoc' ||
    getFileExtension(file.filename) === 'asciidoc' ||
    getFileExtension(file.name) === 'adoc' ||
    getFileExtension(file.name) === 'asciidoc'
  );
};

export const isCSV = (file: Partial<IFile>): boolean => file.language === 'CSV';

export const isTSV = (file: Partial<IFile>): boolean => file.type === 'text/tab-separated-values';

export const isImage = (file: Partial<IFile>): boolean => startsWith('image/', file.type);

export const isGeoJson = (file: Partial<IFile>): boolean => {
  return (
    file.language === 'JSON' &&
    (getFileExtension(file.filename) === 'geojson' || getFileExtension(file.name) === 'geojson')
  );
};

export const isPDF = (file: Partial<IFile>): boolean =>
  file.type === 'application/pdf' &&
  (getFileExtension(file.filename) === 'pdf' || getFileExtension(file.name) === 'pdf');

export const isHTML = (file: Partial<IFile>): boolean => file.language === 'HTML';

export const getFileLanguage = (file: Partial<IFile>) => {
  if (isImage(file)) {
    return 'Image';
  }

  if (isPDF(file)) {
    return 'PDF';
  }

  if (isTSV(file)) {
    return 'TSV';
  }

  return file.language;
};
