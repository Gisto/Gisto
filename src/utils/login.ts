import { GITHUB_ENTERPRISE_DOMAIN_IN_STORAGE, GITHUB_TOKEN_KEY_IN_STORAGE } from 'constants/config';
import { stripTrailingSlash } from 'utils/string';
import uuid from 'uuid';

export const isLoggedIn = !!localStorage.getItem(GITHUB_TOKEN_KEY_IN_STORAGE);

export const setToken = (token: string) => {
  if (localStorage.getItem('unique-app-id') === null) {
    localStorage.setItem('unique-app-id', uuid.v4());
  }

  localStorage.setItem(GITHUB_TOKEN_KEY_IN_STORAGE, token);
};

export const removeToken = () => localStorage.setItem(GITHUB_TOKEN_KEY_IN_STORAGE, '');

export const setEnterpriseDomain = (domain: string) => {
  return localStorage.setItem(GITHUB_ENTERPRISE_DOMAIN_IN_STORAGE, stripTrailingSlash(domain));
};

export const getEnterpriseDomain = () => localStorage.getItem(GITHUB_ENTERPRISE_DOMAIN_IN_STORAGE);

export const isEnterpriseLogin = () => !!localStorage.getItem(GITHUB_ENTERPRISE_DOMAIN_IN_STORAGE);

export const removeEnterpriseDomain = () =>
  localStorage.removeItem(GITHUB_ENTERPRISE_DOMAIN_IN_STORAGE);
