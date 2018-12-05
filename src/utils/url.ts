import { DEFAULT_API_ENDPOINT_URL, DEFAULT_GIST_URL } from 'constants/config';
import { getEnterpriseDomain, isEnterpriseLogin } from 'utils/login';

export const getApiUrl = (sufix: string) => {
  return isEnterpriseLogin() ? `${getEnterpriseDomain()}${sufix}` : DEFAULT_API_ENDPOINT_URL;
};

export const getSnippetUrl = (sufix: string) => {
  return isEnterpriseLogin() ? `${getEnterpriseDomain()}${sufix}` : DEFAULT_GIST_URL;
};
