import { compact, flow, get, includes, isEmpty, map, some, uniq } from 'lodash/fp';

import { DEFAULT_SNIPPET_DESCRIPTION, TAG_REGEX } from 'constants/config';

import { toUnixTimeStamp } from 'utils/date';
import { getFileLanguage } from 'utils/files';
import { fileTypesList } from 'utils/snippets';
import { removeTags } from 'utils/tags';

import { IFile, ISnippet } from 'types/Interfaces.d';
import { GITHUB, GITLAB } from 'constants/service';

const prepareTags = (snippet: Partial<ISnippet>) => {
  if (!isEmpty(snippet.description)) {
    return snippet.description && snippet.description.match(TAG_REGEX);
  }

  return [];
};

const prepareDescription = (snippet: Partial<ISnippet>, raw = false) => {
  if (snippet.title) {
    return raw ? snippet.title : removeTags(snippet.title);
  }

  if (!isEmpty(snippet.description)) {
    return raw ? snippet.description : removeTags(snippet.description);
  }

  return DEFAULT_SNIPPET_DESCRIPTION;
};

const getService = (snippet: Partial<ISnippet>) => {
  if (snippet.url && snippet.url.match(/github\.com/gi)) {
    return GITHUB;
  }
  if (snippet.raw_url && snippet.raw_url.match(/gitlab\.com/gi)) {
    return GITLAB;
  }

  return 'UNKNOWN';
};

const getTitle = (snippet: Partial<ISnippet>) => {
  return snippet.title || null;
};

const prepareFiles = (snippet: Partial<ISnippet>) => {
  if (snippet.file_name) {
    return [
      {
        filename: snippet.file_name,
        collapsed: false,
        viewed: toUnixTimeStamp(new Date().getTime()),
        language: null
      }
    ];
  }

  if (snippet.files) {
    return map(
      (file: IFile) => ({
        ...file,
        collapsed: false,
        viewed: toUnixTimeStamp(new Date().getTime()),
        language: getFileLanguage(file)
      }),
      snippet.files
    );
  }
};

const prepareTruncated = (snippet: Partial<ISnippet>) => {
  return some((file: IFile) => file.size > 1000000, snippet.files);
};

const prepareLanguages = (snippet: Partial<ISnippet>) =>
  flow([fileTypesList, uniq, compact])(snippet.files);

const prepareVisibility = (snippet: Partial<ISnippet>) => {
  if (!snippet.public || snippet.visibility === 'private') {
    return false;
  }

  return true;
};

const prepareFork = (snippet: Partial<ISnippet>) => snippet.fork_of || {};

const prepareAvatar = (snippet: Partial<ISnippet>) =>
  get('owner.avatar_url', snippet) || get('author.avatar_url', snippet);

const prepareUserName = (snippet: Partial<ISnippet>) => get('owner.login', snippet);

const prepareHistory = (snippet: Partial<ISnippet>) => snippet.history || [];

export const snippetStructure = (snippet: ISnippet, starred: string[]) => ({
  service: getService(snippet),
  title: getTitle(snippet),
  description: prepareDescription(snippet),
  rawDescription: prepareDescription(snippet, true),
  id: snippet.id,
  star: includes(snippet.id, starred),
  tags: prepareTags(snippet),
  files: prepareFiles(snippet),
  languages: prepareLanguages(snippet),
  public: prepareVisibility(snippet),
  url: snippet.url,
  htmlUrl: snippet.html_url || snippet.web_url,
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
