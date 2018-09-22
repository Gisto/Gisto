import { gitHubTokenKeyInStorage, gitHubEnterpriseDomainInStorage } from 'constants/config';
import { stripTrailingSlash } from 'utils/string';
import uuid from 'uuid';

export const isLoggedIn = !!localStorage.getItem(gitHubTokenKeyInStorage);

export const setToken = (token) => {
  if (localStorage.getItem('unique-app-id') === null) {
    localStorage.setItem('unique-app-id', uuid.v4());
  }

  localStorage.setItem(gitHubTokenKeyInStorage, token);
};

export const removeToken = () => localStorage.setItem(gitHubTokenKeyInStorage, '');

export const setEnterpriseDomain = (domain) => {
  return localStorage.setItem(
    gitHubEnterpriseDomainInStorage,
    stripTrailingSlash(domain)
  );
};

export const getEnterpriseDomain = () => localStorage.getItem(gitHubEnterpriseDomainInStorage);

export const isEnterpriseLogin = () => !!localStorage.getItem(gitHubEnterpriseDomainInStorage);

export const removeEnterpriseDomain = () => localStorage.removeItem(
  gitHubEnterpriseDomainInStorage
);
