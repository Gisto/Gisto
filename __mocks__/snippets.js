import { snippetStructure } from 'utils/prepareSnippet';

const testId = '123-123-123-123';
const testUser = 'ghtestuser';

export const snippet = (props) => ({
  url: `https://api.github.com/gists/${testId}`,
  forks_url: `https://api.github.com/gists/${testId}/forks`,
  commits_url: `https://api.github.com/gists/${testId}/commits`,
  id: testId,
  node_id: testId,
  git_pull_url: `https://gist.github.com/${testId}.git`,
  git_push_url: `https://gist.github.com/${testId}.git`,
  html_url: `https://gist.github.com/${testId}`,
  files: {
    'ehlo.txt': {
      filename: 'ehlo.txt',
      type: 'text/plain',
      language: 'Text',
      raw_url: `https://gist.githubusercontent.com/${testUser}/${testId}/raw/${testId}/ehlo.txt`,
      size: 6
    }
  },
  public: false,
  created_at: '2018-07-18T17:55:14Z',
  updated_at: '2018-07-21T07:44:36Z',
  description: 'hi',
  comments: 0,
  user: null,
  comments_url: `https://api.github.com/gists/${testId}/comments`,
  owner: {
    login: testUser,
    id: 267718,
    node_id: 'MDQ6VXNlcjI2NzcxOA==',
    avatar_url: 'https://avatars3.githubusercontent.com/u/267718?v=4',
    gravatar_id: '',
    url: `https://api.github.com/users/${testUser}`,
    html_url: `https://github.com/${testUser}`,
    followers_url: `https://api.github.com/users/${testUser}/followers`,
    following_url: `https://api.github.com/users/${testUser}/following{/other_user}`,
    gists_url: `https://api.github.com/users/${testUser}/gists{/gist_id}`,
    starred_url: `https://api.github.com/users/${testUser}/starred{/owner}{/repo}`,
    subscriptions_url: `https://api.github.com/users/${testUser}/subscriptions`,
    organizations_url: `https://api.github.com/users/${testUser}/orgs`,
    repos_url: `https://api.github.com/users/${testUser}/repos`,
    events_url: `https://api.github.com/users/${testUser}/events{/privacy}`,
    received_events_url: `https://api.github.com/users/${testUser}/received_events`,
    type: 'User',
    site_admin: false
  },
  truncated: false,
  ...props
});

export const snippets = () => [
  snippetStructure(snippet({ description: 'aaa123 #tag1 #tag2', id: 'aaa123' })),
  snippetStructure(snippet({ description: 'bbb123 #tag1 #tag2', id: 'bbb123' })),
  snippetStructure(snippet({ description: 'ccc123 #tag3 #tag4 #tag5', id: 'ccc123' }))
];

export const rawSnippets = () => [
  snippet({ description: 'aaa123 #tag1 #tag2', id: 'aaa123' }),
  snippet({ description: 'bbb123 #tag1 #tag2', id: 'bbb123' }),
  snippet({ description: 'ccc123 #tag3 #tag4 #tag5', id: 'ccc123' })
];
