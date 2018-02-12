import { size, isEmpty, map, values, get } from 'lodash';
import * as CONF from '../constants/config';
import { v4 } from 'uuid';

interface Gist {
  service: string;
  description: string;
  id: string;
  star: boolean;
  tags: string[];
  files: any;
  languages: object[];
  public: boolean;
  url: string;
  htmlUrl: string;
  comments: any;
  avatarUrl: string;
  username: string;
  truncated: boolean;
  fork: object;
  history: object[];
  created: number;
  updated: number;
  viewed: number;
}

const prepareTags = (snippet) => {
  if (!isEmpty(snippet.description)) {
    return snippet.description.match(CONF.tagRegex);
  }

  return [];
};

const prepareDescription = (snippet): string => {
  if (!isEmpty(snippet.description)) {
    return snippet.description;
  }

  return CONF.defaultSnippetDescription;
};

const getService = (snippet) => snippet.url.match(/github\.com/gi) ? 'GITHUB' : 'NOT-GITHUB-FOR-NOW';

const toUnixTimeStamp = (date) => Math.floor(new Date(date).getTime() / 1000);

const prepareFiles = (snippet) => map(snippet.files, (file) => ({
  collapsed: false,
  viewed: toUnixTimeStamp(new Date().getTime()),
  uuid: v4(),
  ...file
}));

const prepareLanguages = (snippet) => map(snippet.files, 'language');

const prepareFork = (snippet) => snippet.fork_of || {};

const prepareAvatar = (snippet) => get(snippet, 'owner.avatar_url');

const prepareUserName = (snippet) => get(snippet, 'owner.login');

const prepareHistory = (snippet) => snippet.history || [];

export const snippetStructure = (snippet): Gist => ({
  service: getService(snippet),
  description: prepareDescription(snippet),
  id: snippet.id,
  star: snippet.star,
  tags: prepareTags(snippet),
  files: prepareFiles(snippet),
  languages: prepareLanguages(snippet),
  public: snippet.public,
  url: snippet.url,
  htmlUrl: snippet.html_url,
  comments: snippet.comments,
  avatarUrl: prepareAvatar(snippet),
  username: prepareUserName(snippet),
  truncated: snippet.truncated,
  fork: prepareFork(snippet),
  history: prepareHistory(snippet),
  created: toUnixTimeStamp(snippet.created_at),
  updated: toUnixTimeStamp(snippet.updated_at),
  viewed: toUnixTimeStamp(new Date().getTime())
});
