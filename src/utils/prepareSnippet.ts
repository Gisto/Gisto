import { compact, flow, get, includes, isEmpty, map, some, uniq } from 'lodash/fp';

import { DEFAULT_SNIPPET_DESCRIPTION, TAG_REGEX } from 'constants/config';

import { toUnixTimeStamp } from 'utils/date';
import { getFileLanguage } from 'utils/files';
import { fileTypesList } from 'utils/snippets';
import { removeTags } from 'utils/tags';

import { IFile, ISnippet } from 'types/Interfaces.d';

const prepareTags = (snippet: Partial<ISnippet>) => {
  if (!isEmpty(snippet.description)) {
    return snippet.description && snippet.description.match(TAG_REGEX);
  }

  return [];
};

const prepareDescription = (snippet: Partial<ISnippet>, raw = false) => {
  if (!isEmpty(snippet.description)) {
    return raw ? snippet.description : removeTags(snippet.description);
  }

  return DEFAULT_SNIPPET_DESCRIPTION;
};

const getService = (snippet: Partial<ISnippet>) => {
  return snippet.url && snippet.url.match(/github\.com/gi) ? 'GITHUB' : 'NOT-GITHUB-FOR-NOW';
};

const prepareFiles = (snippet: Partial<ISnippet>) => {
  return map(
    (file: IFile) => ({
      ...file,
      collapsed: false,
      viewed: toUnixTimeStamp(new Date().getTime()),
      language: getFileLanguage(file)
    }),
    snippet.files
  );
};

const prepareTruncated = (snippet: Partial<ISnippet>) => {
  return some((file: IFile) => file.size > 1000000, snippet.files);
};

const prepareLanguages = (snippet: Partial<ISnippet>) =>
  flow([fileTypesList, uniq, compact])(snippet.files);

const prepareFork = (snippet: Partial<ISnippet>) => snippet.fork_of || {};

const prepareAvatar = (snippet: Partial<ISnippet>) => get('owner.avatar_url', snippet);

const prepareUserName = (snippet: Partial<ISnippet>) => get('owner.login', snippet);

const prepareHistory = (snippet: Partial<ISnippet>) => snippet.history || [];

export const snippetStructure = (snippet: ISnippet, starred: string[]) => ({
  service: getService(snippet),
  description: prepareDescription(snippet),
  rawDescription: prepareDescription(snippet, true),
  id: snippet.id,
  star: includes(snippet.id, starred),
  tags: prepareTags(snippet),
  files: prepareFiles(snippet),
  languages: prepareLanguages(snippet),
  public: snippet.public,
  url: snippet.url,
  htmlUrl: snippet.html_url,
  comments: snippet.comments,
  avatarUrl: prepareAvatar(snippet),
  username: prepareUserName(snippet),
  truncated: prepareTruncated(snippet),
  fork: prepareFork(snippet),
  history: prepareHistory(snippet),
  created: toUnixTimeStamp(snippet.created_at),
  updated: toUnixTimeStamp(snippet.updated_at),
  viewed: toUnixTimeStamp(new Date().getTime()),
  lastModified: toUnixTimeStamp(snippet.lastModified)
});
