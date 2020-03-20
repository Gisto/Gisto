import {
  difference,
  filter,
  flow,
  head,
  includes,
  isEmpty,
  keyBy,
  map,
  orderBy,
  pick,
  reduce,
  size,
  startsWith,
  trim
} from 'lodash/fp';
import { getFileLanguage } from 'utils/files';
import { setNotification } from 'utils/notifications';
import { removeTags } from 'utils/tags';

import { IClipboardEvent, IFile, INotification, ISnippet } from 'types/Interfaces.d';
import { getSetting } from './settings';

export const isTag = (filterText: string) => startsWith('#', filterText);

export const hasTag = (filterText: string) => filterText.match(/#.+/gi);

const filterByTagsText = (snippets: ISnippet, filterText: string) => {
  return filter((snippet) => includes(filterText, snippet.tags), snippets);
};

const filterByFreeText = (snippets: ISnippet, filterText: string) => {
  try {
    new RegExp(filterText, 'gi');
  } catch (e) {
    return false;
  }

  const regex = new RegExp(filterText, 'gi');

  if (filterText !== '') {
    if (isTag(filterText)) {
      return filterByTagsText(snippets, filterText);
    }

    if (hasTag(filterText)) {
      const textMatches = filter((snippet) => {
        return !!snippet.description.includes(removeTags(filterText));
      }, snippets);

      const matchedTag = head(filterText.match(/#.+/gi));

      return filter((snippet) => {
        return !!includes(matchedTag, snippet.tags);
      }, textMatches);
    }

    return filter((snippet) => {
      const descriptionMatch = snippet.description.match(regex);
      const fileNameMatch = size(filter((file) => file.filename.match(regex), snippet.files)) > 0;
      const contentMatch =
        size(filter((file) => file.content && file.content.match(regex), snippet.files)) > 0;

      return descriptionMatch || fileNameMatch || contentMatch;
    }, snippets);
  }

  return snippets;
};

const filterByTags = (snippets: ISnippet, filterTags: string) => {
  return filter((snippet) => size(difference(filterTags, snippet.tags)) === 0, snippets);
};

const filterByLanguage = (snippets: ISnippet, filterLanguage: string | null) => {
  return filter((snippet) => includes(filterLanguage, snippet.languages), snippets);
};

const filterByStatus = (snippets: ISnippet, filterStatus: string) => {
  switch (filterStatus) {
    case 'private': {
      return filter((snippet) => snippet.public === false, snippets);
    }
    case 'public': {
      return filter((snippet) => snippet.public === true, snippets);
    }
    case 'starred': {
      return filter((snippet) => snippet.star === true, snippets);
    }
    case 'untitled': {
      return filter((snippet) => snippet.description === 'untitled', snippets);
    }
    default: {
      return snippets;
    }
  }
};

export const filterSnippetsList = (
  snippets: ISnippet,
  filterText: string,
  filterTags: string,
  filterLanguage: string,
  filterStatus: string,
  filterTruncated: string,
  filterUntagged: string
) => {
  // @ts-ignore
  const sortedSnippets: ISnippet = orderBy(
    [getSetting('settings-snippet-order-field', 'created')],
    [getSetting('settings-snippet-order-direction', 'desc')],
    snippets
  );

  if (!isEmpty(trim(filterText))) {
    return filterByFreeText(sortedSnippets, trim(filterText));
  }

  if (!isEmpty(filterTags)) {
    return filterByTags(sortedSnippets, filterTags);
  }

  if (!isEmpty(trim(filterLanguage))) {
    return filterByLanguage(sortedSnippets, trim(filterLanguage));
  }

  if (!isEmpty(trim(filterStatus))) {
    return filterByStatus(sortedSnippets, trim(filterStatus));
  }

  if (filterTruncated) {
    // @ts-ignore
    return filter({ truncated: true }, sortedSnippets);
  }

  if (filterUntagged) {
    return filter((snippet) => snippet.tags === null || size(snippet.tags) === 0, sortedSnippets);
  }

  return sortedSnippets;
};

export const copyToClipboard = (event: Event, text: string, message: string) => {
  const notification = { title: message || 'Copied to clipboard' } as INotification;
  const handleCopy = (copyEvent: IClipboardEvent) => {
    copyEvent.clipboardData.setData('text/plain', text);
    copyEvent.preventDefault();
    document.removeEventListener('copy', handleCopy, true);
  };

  // @ts-ignore
  document.addEventListener('copy', handleCopy.bind(this), true);
  document.execCommand('copy');
  setNotification({ ...notification, type: 'success' });
};

export const prepareFiles = (files: IFile[]) => {
  return flow([
    map((file: IFile) => ({
      name: file.name,
      content: file.content
    })),
    keyBy('name')
  ])(files);
};

export const prepareFilesForDuplication = (files: IFile[]) =>
  reduce(
    (acc, file) => {
      acc[file.filename] = {
        filename: file.filename,
        content: file.content
      };

      return acc;
    },
    {},
    files
  );

export const prepareFilesForUpdate = (snippet: ISnippet) => {
  const cleanFiles = flow([
    map((file) => {
      return pick(['filename', 'content', 'originalFileName', 'delete', 'isNew'], file);
    }),
    // we do not support saving/editing specific files
    filter(
      (file: IFile) =>
        !file.filename.match(
          /\.png|\.jpg|\.jpeg|\.gif|\.bmp|\.tiff|\.tif|\.webp|\.xpm|\.exif|\.icns|\.ico|\.jp2|\.ai|\.psd|\.pdf/gi
        )
    )
  ])(snippet.files);

  const filesClean = keyBy('originalFileName', cleanFiles);

  const files = reduce(
    (acc, file) => {
      if (file.delete) {
        acc[file.originalFileName] = null;
      } else if (file.isNew) {
        acc[file.filename] = {
          filename: file.filename,
          content: file.content
        };
      } else {
        acc[file.originalFileName] = {
          filename: file.filename,
          content: file.content
        };
      }

      return acc;
    },
    {},
    filesClean
  );

  return {
    description: snippet.description,
    files
  };
};

export const fileTypesList = (files: IFile) => map((file) => getFileLanguage(file), files);
