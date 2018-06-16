import { gitHubTokenKeyInStorage } from 'constants/config';

export const isLoggedIn = !!localStorage.getItem(gitHubTokenKeyInStorage);

export const setToken = (token) => localStorage.setItem(gitHubTokenKeyInStorage, token);
export const removeToken = () => localStorage.setItem(gitHubTokenKeyInStorage, '');
