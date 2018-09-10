import {
  filter,
  includes,
  startsWith,
  trim,
  sortBy,
  flow,
  reverse,
  isEmpty,
  difference,
  size,
  keyBy,
  map,
  pick,
  reduce,
  head
} from 'lodash/fp';
import { removeTags } from 'utils/tags';

export const isTag = (filterText) => startsWith('#', filterText);

export const hasTag = (filterText) => filterText.match(/#.+/ig);

const filterByTagsText = (snippets, filterText) => {
  return filter((snippet) => includes(filterText, snippet.tags), snippets);
};

const filterByFreeText = (snippets, filterText) => {
  try {
    // eslint-disable-next-line no-new
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

      const matchedTag = head(filterText.match(/#.+/ig));

      return filter((snippet) => {
        return !!includes(matchedTag, snippet.tags);
      }, textMatches);
    }

    return filter((snippet) => snippet.description.match(regex), snippets);
  }

  return snippets;
};

const filterByTags = (snippets, filterTags) => {
  return filter((snippet) => size(difference(filterTags, snippet.tags)) === 0, snippets);
};

const filterByLanguage = (snippets, filterLanguage) => {
  return filter((snippet) => includes(filterLanguage, snippet.languages), snippets);
};

const filterByStatus = (snippets, filterStatus) => {
  switch (filterStatus) {
    case 'private': {
      return filter({ public: false }, snippets);
    }
    case 'public': {
      return filter({ public: true }, snippets);
    }
    case 'starred': {
      return filter({ star: true }, snippets);
    }
    case 'untitled': {
      return filter({ description: 'untitled' }, snippets);
    }
    default: {
      return snippets;
    }
  }
};

export const filterSnippetsList = (
  snippets, filterText, filterTags, filterLanguage, filterStatus
) => {
  const sortedSnippets = flow([sortBy(['created']), reverse])(snippets);

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

  return sortedSnippets;
};

export const copyToClipboard = (event, text) => {
  const handleCopy = (copyEvent) => {
    copyEvent.clipboardData.setData('text/plain', text);
    copyEvent.preventDefault();
    document.removeEventListener('copy', handleCopy, true);
  };

  document.addEventListener('copy', handleCopy.bind(this), true);
  document.execCommand('copy');
};

export const prepareFiles = (files) => {
  return flow([
    map((file) => ({
      name: file.name,
      content: file.content
    })),
    keyBy('name')
  ])(files);
};

export const prepareFilesForUpdate = (snippet) => {
  const cleanFiles = map((file) => {
    return pick(['filename', 'content', 'originalFileName', 'delete', 'isNew'], file);
  }, snippet.files);

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
