import {
  GITHUB_ENTERPRISE_DOMAIN_IN_STORAGE,
  GITHUB_TOKEN_KEY_IN_STORAGE,
  GITLAB_ENTERPRISE_DOMAIN_IN_STORAGE,
  GITLAB_TOKEN_KEY_IN_STORAGE
} from 'constants/config';
import { stripTrailingSlash } from 'utils/string';
import uuid from 'uuid';

// GitHub
export const isLoggedIn = !!localStorage.getItem(GITHUB_TOKEN_KEY_IN_STORAGE);

export const setGithubToken = (token: string) => {
  if (localStorage.getItem('unique-app-id') === null) {
    localStorage.setItem('unique-app-id', uuid.v4());
  }

  localStorage.setItem(GITHUB_TOKEN_KEY_IN_STORAGE, token);
};

export const removeGithubToken = () => localStorage.setItem(GITHUB_TOKEN_KEY_IN_STORAGE, '');

export const setGithubEnterpriseDomain = (domain: string) => {
  return localStorage.setItem(GITHUB_ENTERPRISE_DOMAIN_IN_STORAGE, stripTrailingSlash(domain));
};

export const getGithubEnterpriseDomain = () =>
  localStorage.getItem(GITHUB_ENTERPRISE_DOMAIN_IN_STORAGE);

export const isGithubEnterpriseLogin = () =>
  !!localStorage.getItem(GITHUB_ENTERPRISE_DOMAIN_IN_STORAGE);

export const removeGithubEnterpriseDomain = () =>
  localStorage.removeItem(GITHUB_ENTERPRISE_DOMAIN_IN_STORAGE);

// GitLab

export const setGitlabToken = (token: string) => {
  localStorage.setItem(GITLAB_TOKEN_KEY_IN_STORAGE, token);
};

export const removeGitlabToken = () => localStorage.setItem(GITLAB_TOKEN_KEY_IN_STORAGE, '');

export const setGitlabEnterpriseDomain = (domain: string) => {
  return localStorage.setItem(GITLAB_ENTERPRISE_DOMAIN_IN_STORAGE, stripTrailingSlash(domain));
};

export const getGitlabEnterpriseDomain = () =>
  localStorage.getItem(GITLAB_ENTERPRISE_DOMAIN_IN_STORAGE);

export const isGitlabEnterpriseLogin = () =>
  !!localStorage.getItem(GITLAB_ENTERPRISE_DOMAIN_IN_STORAGE);

export const removeGitlabEnterpriseDomain = () =>
  localStorage.removeItem(GITHUB_ENTERPRISE_DOMAIN_IN_STORAGE);
