import { DEFAULT_GITHUB_API_ENDPOINT_URL, DEFAULT_GITHUB_SNIPPET_URL } from 'constants/config';
import { getGithubEnterpriseDomain, isGithubEnterpriseLogin } from 'utils/login';

export const getGithubApiUrl = (sufix: string) => {
  return isGithubEnterpriseLogin()
    ? `${getGithubEnterpriseDomain()}${sufix}`
    : DEFAULT_GITHUB_API_ENDPOINT_URL;
};

export const getGithubSnippetUrl = (sufix: string) => {
  return isGithubEnterpriseLogin()
    ? `${getGithubEnterpriseDomain()}${sufix}`
    : DEFAULT_GITHUB_SNIPPET_URL;
};
