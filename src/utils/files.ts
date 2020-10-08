import { startsWith } from 'lodash/fp';
import { getFileExtension } from 'utils/string';

import { IFile } from 'types/Interfaces.d';

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

export const isLaTex = (file: Partial<IFile>): boolean => file.language === 'TeX';

export const isCSV = (file: Partial<IFile>): boolean => file.language === 'CSV';

export const isTSV = (file: Partial<IFile>): boolean => file.type === 'text/tab-separated-values';

export const isImage = (file: Partial<IFile>): boolean => startsWith('image/', file.type);

export const isJson = (file: IFile): boolean => file.language === 'JSON';

export const isGeoJson = (file: IFile): boolean => {
  return (
    isJson(file) &&
    (getFileExtension(file.filename) === 'geojson' || getFileExtension(file.name) === 'geojson')
  );
};

export const isOpenApi = (file: Partial<IFile>): void => {
  return (
    // @ts-ignore
    (file.language === 'YAML' && file.content.startsWith('openapi:')) ||
    // @ts-ignore
    (file.language === 'JSON' && JSON.parse(file.content).swagger)
  );
};

export const isPDF = (file: IFile): boolean =>
  file.type === 'application/pdf' &&
  (getFileExtension(file.filename) === 'pdf' || getFileExtension(file.name) === 'pdf');

export const isHTML = (file: Partial<IFile>): boolean => file.language === 'HTML';

export const getFileLanguage = (file: IFile) => {
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
