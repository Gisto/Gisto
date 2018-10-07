import {
  isEmpty, map, get, includes, uniq, compact, startsWith, some
} from 'lodash/fp';
import { TAG_REGEX, DEFAULT_SNIPPET_DESCRIPTION } from 'constants/config';
import { removeTags } from 'utils/tags';
import { toUnixTimeStamp } from 'utils/date';

const prepareTags = (snippet) => {
  if (!isEmpty(snippet.description)) {
    return snippet.description.match(TAG_REGEX);
  }

  return [];
};

const prepareDescription = (snippet, raw = false) => {
  if (!isEmpty(snippet.description)) {
    return raw ? snippet.description : removeTags(snippet.description);
  }

  return DEFAULT_SNIPPET_DESCRIPTION;
};

const getService = (snippet) => {
  return snippet.url && snippet.url.match(/github\.com/gi) ? 'GITHUB' : 'NOT-GITHUB-FOR-NOW';
};

const prepareFiles = (snippet) => {
  return map(
    (file) => ({
      ...file,
      collapsed: false,
      viewed: toUnixTimeStamp(new Date().getTime()),
      language: startsWith('image/', file.type) ? 'Image' : file.language
    }),
    snippet.files
  );
};

const prepareTruncated = (snippet) => {
  return some((file) => file.size > 1000000, snippet.files);
};

const prepareLanguages = (snippet) => compact(uniq(map('language', snippet.files)));

const prepareFork = (snippet) => snippet.fork_of || {};

const prepareAvatar = (snippet) => get('owner.avatar_url', snippet);

const prepareUserName = (snippet) => get('owner.login', snippet);

const prepareHistory = (snippet) => snippet.history || [];

export const snippetStructure = (snippet, starred) => ({
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
