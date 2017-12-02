import { size, isEmpty } from 'lodash';
import * as CONF from '../constants/config';

interface Gist {
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

const prepareTags = (snippet: Gist) => {
  if (!isEmpty(snippet.description) || snippet.description !== CONF.defaultSnippetDescription) {
    return snippet.description.match(CONF.tagRegex);
  }

  return [];
};

const prepareDescription = (snippet: Gist) => {
  if (!isEmpty(snippet.description)) {
    return snippet.description;
  }

  return CONF.defaultSnippetDescription;
};

const prepareFiles = (snippet: Gist) => {
  console.log(' ->>>>> gonna prepare files');
  // TODO: prepare files
  return snippet.files;
};

const toUnixTimeStamp = (date) => Math.floor(new Date(date).getTime() / 1000);

export const snippetStructure = (snippet) => {
  const gist = {
    description: prepareDescription(snippet),
    id: snippet.id,
    star: snippet.star,
    tags: prepareTags(snippet),
    files: prepareFiles(snippet),
    public: snippet.public,
    url: snippet.url,
    htmlUrl: snippet.html_url,
    comments: snippet.comments,
    avatarUrl: snippet.owner.avatar_url,
    username: snippet.owner.login,
    truncated: snippet.truncated,
    fork: size(snippet.forks),
    created: toUnixTimeStamp(snippet.created_at),
    updated: toUnixTimeStamp(snippet.updated_at),
    viewed: toUnixTimeStamp(new Date().getTime())
  };

  console.log('snippet', gist);
  return gist;
};
