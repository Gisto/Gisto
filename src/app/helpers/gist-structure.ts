import { size, isEmpty, map, values, get } from 'lodash';
import * as CONF from '../constants/config';

interface Gist {
  service: string;
  description: string;
  star: boolean;
  tags: string[];
  files: object[];
  viewed: number;
  created: string;
  updated: string;
  secret: boolean;
  url: string;
  htmlUrl: string;
  comments: number;
  avatarUrl: string;
  username: string;
  truncated: boolean;
  fork: any;
}

const prepareTags = (snippet) => {
  if (!isEmpty(snippet.description) || snippet.description !== CONF.defaultSnippetDescription) {
    return snippet.description.match(CONF.tagRegex);
  }

  return [];
};

const prepareDescription = (snippet) => {
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
  ...file
}));

const prepareLanguages = (snippet) => map(snippet.files, 'language');

const prepareFork = (snippet) => snippet.fork_of || {};

const prepareAvatar = (snippet) => get(snippet, 'owner.avatar_url');

const prepareUserName = (snippet) => get(snippet, 'owner.login');

export const snippetStructure = (snippet) => ({
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
    created: toUnixTimeStamp(snippet.created_at),
    updated: toUnixTimeStamp(snippet.updated_at),
    viewed: toUnixTimeStamp(new Date().getTime())
});
